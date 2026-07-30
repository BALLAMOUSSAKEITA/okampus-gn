import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/Logo";

const brandCopy = {
  login: "BacheliO t'accompagne après le bac : orientation, mentors étudiants et opportunités en Guinée.",
  register:
    "Rejoins BacheliO gratuitement : orientation IA, mentors étudiants, forum et opportunités en Guinée.",
} as const;

interface AuthCardShellProps {
  children: ReactNode;
  mode?: "login" | "register";
  title: string;
  subtitle?: string;
  footerHref: string;
  footerLabel: string;
  wide?: boolean;
}

export default function AuthCardShell({
  children,
  mode = "login",
  title,
  subtitle,
  footerHref,
  footerLabel,
  wide = false,
}: AuthCardShellProps) {
  const brand = brandCopy[mode];
  const cardWidth = wide ? "max-w-[432px]" : "max-w-[396px]";
  const gridCols = wide ? "lg:grid-cols-[1fr_432px]" : "lg:grid-cols-[1fr_396px]";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f0f2f5] flex items-center justify-center px-4 py-10 sm:py-14">
      <div className={`w-full max-w-[980px] grid ${gridCols} gap-8 lg:gap-12 items-center`}>
        <div className="hidden lg:block text-left pl-2">
          <Link href="/" className="inline-block mb-4">
            <Logo size="lg" />
          </Link>
          <p className="text-[28px] leading-snug text-[#121117] font-medium max-w-[480px]">
            {brand}
          </p>
        </div>

        <div className={`w-full ${cardWidth} mx-auto lg:mx-0 lg:ml-auto`}>
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] border border-[#dddfe2] p-4 sm:p-6">
            <header className="text-center mb-4">
              <h1 className="text-xl font-bold text-[#121117]">{title}</h1>
              {subtitle && (
                <p className="text-sm text-[#6a697c] mt-1 leading-relaxed">{subtitle}</p>
              )}
            </header>
            {children}
          </div>

          <p className="text-center text-[15px] mt-6 text-[#121117]">
            <Link
              href={footerHref}
              className="font-semibold text-[#14b887] hover:underline underline-offset-2"
            >
              {footerLabel}
            </Link>
          </p>

          <p className="text-center text-xs text-[#6a697c] mt-4">
            <Link href="/" className="hover:text-[#121117]">
              Retour à l&apos;accueil
            </Link>
            {" · "}
            <Link href="/confidentialite" className="hover:text-[#121117]">
              Confidentialite
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
