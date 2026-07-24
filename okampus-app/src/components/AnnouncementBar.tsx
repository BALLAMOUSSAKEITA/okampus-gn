import Link from "next/link";
import type { ReactNode } from "react";

const messages = [
  <>
    <span className="text-[#ffdf3d] font-semibold">BacheliO</span>
    {" "}— du bac a l&apos;emploi, on t&apos;accompagne a chaque etape
  </>,
  <>Orientation IA, mentorat et stages reunis au meme endroit</>,
  <>Des etudiants mentors disponibles pour te guider filiere par filiere</>,
  <>
    <Link href="/inscription" className="underline underline-offset-2 hover:text-[#ffdf3d] transition-colors font-semibold">
      Cree ton compte
    </Link>
    {" "}— ca prend moins de 2 minutes
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
      className="bg-[#121117] text-white text-[13px] h-10 overflow-hidden relative"
      aria-label="Annonces BacheliO"
    >
      <div className="announcement-track flex items-center h-full w-max">
        {track}
      </div>
    </div>
  );
}
