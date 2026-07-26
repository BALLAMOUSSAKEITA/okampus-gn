import Link from "next/link";
import { ReactNode } from "react";
import Logo from "@/components/Logo";

interface LoginShellProps {
  children: ReactNode;
}

export default function LoginShell({ children }: LoginShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f0f2f5] flex items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-[980px] grid lg:grid-cols-[1fr_396px] gap-8 lg:gap-12 items-center">
        {/* Colonne brand — style Facebook */}
        <div className="hidden lg:block text-left pl-2">
          <Link href="/" className="inline-block mb-4">
            <Logo size="lg" />
          </Link>
          <p className="text-[28px] leading-snug text-[#121117] font-medium max-w-[480px]">
            BacheliO t&apos;accompagne apres le bac : orientation, mentors etudiants et
            opportunites en Guinee.
          </p>
        </div>

        {/* Carte connexion */}
        <div className="w-full max-w-[396px] mx-auto lg:mx-0 lg:ml-auto">
          <div className="lg:hidden flex justify-center mb-6">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.12)] border border-[#dddfe2] p-4 sm:p-6">
            <h1 className="text-xl font-bold text-center text-[#121117] mb-4">
              Se connecter a BacheliO
            </h1>
            {children}
          </div>

          <p className="text-center text-[15px] mt-6 text-[#121117]">
            <Link
              href="/inscription"
              className="font-semibold text-[#14b887] hover:underline underline-offset-2"
            >
              Creer un compte
            </Link>
          </p>

          <p className="text-center text-xs text-[#6a697c] mt-4">
            <Link href="/" className="hover:text-[#121117]">
              Retour a l&apos;accueil
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
