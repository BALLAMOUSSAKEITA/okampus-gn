import Link from "next/link";
import type { ReactNode } from "react";

const messages = [
  <>
    <span className="text-[#ffdf3d] font-semibold">BacheliO</span>
    {" "}— du bac a l&apos;emploi, on t&apos;accompagne à chaque étape
  </>,
  <>Orientation IA, mentorat et stages réunis au même endroit</>,
  <>Des étudiants mentors disponibles pour te guider filière par filière</>,
  <>
    <Link href="/inscription" className="underline underline-offset-2 hover:text-[#ffdf3d] transition-colors font-semibold">
      Crée ton compte
    </Link>
    {" "}— ça prend moins de 2 minutes
  </>,
];

function TickerItem({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center shrink-0">
      <span>{children}</span>
      <span className="mx-8 text-[#6a697c]" aria-hidden="true">
        •
      </span>
    </span>
  );
}

export default function AnnouncementBar() {
  const track = (
    <>
      {messages.map((msg, i) => (
        <TickerItem key={`a-${i}`}>{msg}</TickerItem>
      ))}
      {messages.map((msg, i) => (
        <TickerItem key={`b-${i}`}>{msg}</TickerItem>
      ))}
    </>
  );

  return (
    <div
      className="bg-[#121117] text-white text-[13px] h-9 md:h-10 overflow-hidden relative"
      aria-label="Annonces BacheliO"
    >
      {/* Mobile: message statique lisible */}
      <div className="md:hidden flex items-center justify-center h-full px-4 text-center">
        <p className="truncate">
          <span className="text-[#ffdf3d] font-semibold">BacheliO</span>
          {" "}— orientation, mentors et stages
        </p>
      </div>

      {/* Desktop / tablette: ticker */}
      <div className="hidden md:block h-full">
        <div className="announcement-track flex items-center h-full w-max">
          {track}
        </div>
      </div>
    </div>
  );
}
