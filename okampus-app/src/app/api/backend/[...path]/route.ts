import { NextRequest, NextResponse } from "next/server";
import { getServerAccessToken } from "@/lib/server-auth";

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const AUTH_REQUIRED: Array<{ test: (path: string, method: string) => boolean }> = [
  { test: (p) => p.startsWith("/admin") },
  { test: (p) => p.startsWith("/users/") },
  { test: (p) => p.startsWith("/mentor-messages") },
  { test: (p) => p.startsWith("/push-subscriptions") },
  { test: (p) => p.startsWith("/assistant/") },
  { test: (p) => p.startsWith("/parcours/") },
  { test: (p) => p.startsWith("/cv/") },
  { test: (p, m) => m !== "GET" && p.startsWith("/forum") },
  { test: (p) => /\/forum\/[^/]+\/(like|comments)/.test(p) },
  { test: (p) => p.startsWith("/resources/upload") },
  { test: (p, m) => m === "POST" && /\/resources\/[^/]+\/purchase/.test(p) },
];

function requiresAuth(path: string, method: string): boolean {
  return AUTH_REQUIRED.some(({ test }) => test(path, method));
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  const path = `/${pathSegments.join("/")}`;
  const search = request.nextUrl.search;
  const url = `${API_URL}${path}${search}`;
  const method = request.method;

  const accessToken = await getServerAccessToken();
  if (requiresAuth(path, method) && !accessToken) {
    return NextResponse.json({ detail: "Non authentifié" }, { status: 401 });
  }

  const headers = new Headers();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  let body: BodyInit | undefined;
  if (method !== "GET" && method !== "HEAD") {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("multipart/form-data")) {
      body = await request.arrayBuffer();
      headers.set("Content-Type", contentType);
    } else if (contentType?.includes("application/json")) {
      body = await request.text();
      headers.set("Content-Type", "application/json");
    } else {
      const raw = await request.arrayBuffer();
      if (raw.byteLength > 0) body = raw;
      if (contentType) headers.set("Content-Type", contentType);
    }
  }

  const res = await fetch(url, { method, headers, body });
  const resType = res.headers.get("content-type") ?? "";

  if (resType.includes("application/json")) {
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const buffer = await res.arrayBuffer();
  const responseHeaders = new Headers();
  if (resType) responseHeaders.set("Content-Type", resType);
  const disposition = res.headers.get("content-disposition");
  if (disposition) responseHeaders.set("Content-Disposition", disposition);
  return new NextResponse(buffer, { status: res.status, headers: responseHeaders });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
