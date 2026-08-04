import type { ReactNode } from "react";

type OgShareCardProps = {
  badge: string;
  title: string;
  subtitle?: string;
  detail?: string;
  footer?: string;
};

function truncate(text: string, max: number): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Carte visuelle 1200×630 pour Facebook / Open Graph. */
export function OgShareCard({ badge, title, subtitle, detail, footer }: OgShareCardProps): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f4f4f8 0%, #e8e8f0 45%, #ffdf3d33 100%)",
        padding: "48px 56px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #14b887, #121117)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffdf3d",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            B
          </div>
          <span style={{ fontSize: 32, fontWeight: 800, color: "#121117" }}>BacheliO</span>
        </div>
        <span
          style={{
            background: "#14b887",
            color: "#121117",
            fontSize: 22,
            fontWeight: 700,
            padding: "10px 22px",
            borderRadius: 999,
          }}
        >
          {badge}
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          marginTop: 28,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "3px solid #121117",
            borderRadius: 24,
            padding: "40px 44px",
            width: "100%",
            boxShadow: "8px 8px 0 #121117",
          }}
        >
          <div
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: "#121117",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            {truncate(title, 90)}
          </div>
          {subtitle ? (
            <div style={{ marginTop: 18, fontSize: 28, fontWeight: 600, color: "#4d4c5c" }}>
              {truncate(subtitle, 70)}
            </div>
          ) : null}
          {detail ? (
            <div style={{ marginTop: 14, fontSize: 24, color: "#6a697c", lineHeight: 1.35 }}>
              {truncate(detail, 120)}
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 24,
          fontSize: 22,
          color: "#4d4c5c",
          fontWeight: 600,
        }}
      >
        <span>{footer ?? "www.bachelio.com"}</span>
        <span
          style={{
            background: "#ffdf3d",
            color: "#121117",
            padding: "6px 14px",
            borderRadius: 8,
            fontWeight: 700,
          }}
        >
          Guinée · Étudiants
        </span>
      </div>
    </div>
  );
}
