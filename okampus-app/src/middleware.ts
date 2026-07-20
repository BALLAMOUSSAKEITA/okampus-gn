export { auth as middleware } from "@/auth";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
