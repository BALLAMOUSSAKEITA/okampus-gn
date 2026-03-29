"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

const sizes = {
  sm: { icon: 28, text: "text-lg" },
  md: { icon: 36, text: "text-xl" },
  lg: { icon: 44, text: "text-2xl" },
  xl: { icon: 56, text: "text-3xl" },
};

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#c41e3a" />
              <stop offset="100%" stopColor="#9e1830" />
            </linearGradient>
            <linearGradient id="logo-accent" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f4c430" />
              <stop offset="100%" stopColor="#f0b800" />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="48" height="48" rx="14" fill="url(#logo-bg)" />

          <path
            d="M24 12L10 19L24 26L38 19L24 12Z"
            fill="url(#logo-accent)"
            opacity="0.95"
          />
          <path
            d="M14 21.5V30C14 30 18 34 24 34C30 34 34 30 34 30V21.5"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M38 19V28"
            stroke="url(#logo-accent)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle cx="38" cy="29.5" r="1.8" fill="#f4c430" />

          <circle cx="20" cy="41" r="1.5" fill="#c41e3a" opacity="0.7" />
          <circle cx="24" cy="41" r="1.5" fill="#f4c430" opacity="0.7" />
          <circle cx="28" cy="41" r="1.5" fill="#008751" opacity="0.7" />
        </svg>
      </div>

      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-gradient-gn`}>
          O&apos;Kampus
        </span>
      )}
    </div>
  );
}
