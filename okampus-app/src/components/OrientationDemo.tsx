import type { ReactNode } from "react";
import Link from "next/link";
import UserAvatar from "@/components/UserAvatar";

type DemoMessage = {
  id: string;
  author: "student" | "kampus" | "mentor";
  name: string;
  gender?: "male" | "female";
  time: string;
  text: ReactNode;
  delay: string;
};

const demoMessages: DemoMessage[] = [
  {
    id: "1",
    author: "student",
    name: "Fatoumata K.",
    gender: "female",
    time: "14:02",
    delay: "0ms",
    text: (
      <>
        Salut Kampus ! J&apos;ai eu mon bac en{" "}
        <strong className="font-semibold">Sciences Expérimentales</strong> à Conakry. J&apos;adore
        la biologie, mais je ne sais pas si je dois viser la médecine ou la pharmacie…
      </>
    ),
  },
  {
    id: "2",
    author: "kampus",
    name: "Kampus",
    time: "14:02",
    delay: "120ms",
    text: (
      <>
        Bonjour Fatoumata ! Avec ton profil, voici 3 pistes solides :{" "}
        <strong className="font-semibold">Médecine</strong>,{" "}
        <strong className="font-semibold">Pharmacie</strong> ou{" "}
        <strong className="font-semibold">Sciences de la Santé</strong> (Gamal, UGB). Tu as une
        bonne base en sciences — veux-tu qu&apos;on compare les deux filières ?
      </>
    ),
  },
  {
    id: "3",
    author: "student",
    name: "Fatoumata K.",
    gender: "female",
    time: "14:04",
    delay: "240ms",
    text: <>Oui, surtout les débouchés et la durée des études.</>,
  },
  {
    id: "4",
    author: "kampus",
    name: "Kampus",
    time: "14:04",
    delay: "360ms",
    text: (
      <>
        <strong className="font-semibold">Médecine</strong> : 7 ans minimum, débouchés clairs
        (hôpital, spécialisation). <strong className="font-semibold">Pharmacie</strong> : 5–6 ans,
        laboratoires, industrie. Pour quelqu&apos;un passionné par le corps humain → la médecine
        semble mieux alignée. Ensuite, parle avec un mentor pour un retour terrain.
      </>
    ),
  },
  {
    id: "5",
    author: "mentor",
    name: "Aissatou B.",
    gender: "female",
    time: "14:18",
    delay: "480ms",
    text: (
      <>
        Coucou Fatoumata ! Je suis en 3e année de médecine à Gamal. J&apos;ai eu les mêmes doutes
        l&apos;année dernière. On peut en parler 20 min — je te partage mon quotidien et les pièges
        à éviter.
      </>
    ),
  },
];

function DemoBubble({ message }: { message: DemoMessage }) {
  const isStudent = message.author === "student";
  const isKampus = message.author === "kampus";

  return (
    <div
      className={`demo-chat-message flex gap-3 ${isStudent ? "flex-row-reverse" : ""}`}
      style={{ animationDelay: message.delay }}
    >
      <div className="shrink-0 mt-1">
        {isKampus ? (
          <div className="w-9 h-9 rounded-full bg-[#14b887] text-[#121117] flex items-center justify-center text-sm font-bold">
            K
          </div>
        ) : (
          <UserAvatar name={message.name} gender={message.gender ?? "female"} size={36} />
        )}
      </div>

      <div className={`max-w-[88%] sm:max-w-[78%] ${isStudent ? "text-right" : ""}`}>
        <div
          className={`flex items-center gap-2 mb-1 text-[11px] text-[#6a697c] ${
            isStudent ? "justify-end" : ""
          }`}
        >
          <span className="font-semibold text-[#121117]">{message.name}</span>
          {isKampus && (
            <span className="rounded px-1.5 py-0.5 bg-[#14b887]/20 text-[#121117] font-medium">
              IA
            </span>
          )}
          {message.author === "mentor" && (
            <span className="rounded px-1.5 py-0.5 bg-[#99c5ff]/40 text-[#121117] font-medium">
              Mentor
            </span>
          )}
          <span>{message.time}</span>
        </div>

        <div
          className={`rounded-lg px-3.5 py-2.5 text-[14px] leading-relaxed text-left ${
            isStudent
              ? "bg-[#121117] text-white rounded-tr-sm"
              : isKampus
                ? "bg-white border border-[#dcdce5] text-[#121117] rounded-tl-sm"
                : "bg-[#99c5ff]/25 border border-[#99c5ff]/50 text-[#121117] rounded-tl-sm"
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
}

export default function OrientationDemo() {
  return (
    <section className="bg-[#f4f4f8] py-16 sm:py-20 px-4 sm:px-6 border-y border-[#dcdce5]">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14 items-start">
          <div>
            <span className="sticker-label rotate-[-1deg] mb-4 inline-block">Exemple concret</span>
            <h2 className="font-display text-[28px] sm:text-[36px] font-bold leading-[1.13] text-[#121117] max-w-xl">
              Une orientation qui debouche sur une vraie decision
            </h2>
            <p className="mt-4 text-[#4d4c5c] text-lg leading-relaxed max-w-xl">
              Voici comment Fatoumata, bacheliere de Conakry, a clarifie son choix en quelques
              echanges — d&apos;abord avec l&apos;assistant, puis avec une mentorante en medecine.
            </p>

            <div className="mt-8 card p-4 sm:p-5 bg-white shadow-[0_8px_32px_rgba(18,17,23,0.06)]">
              <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#dcdce5]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#14b887]" />
                  <p className="text-sm font-semibold text-[#121117]">Conversation simulee</p>
                </div>
                <span className="text-[11px] text-[#6a697c] font-medium">Scenario reel Guinee</span>
              </div>

              <div className="space-y-4 max-h-[420px] sm:max-h-none overflow-y-auto pr-1">
                {demoMessages.map((message) => (
                  <DemoBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-5 bg-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6a697c]">
                Ce que tu gagnes
              </p>
              <ul className="mt-4 space-y-3">
                {[
                  "Des filieres comparees selon ton profil",
                  "Un mentor qui connait le terrain",
                  "Une decision plus rapide et rassurante",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#4d4c5c]">
                    <span className="w-5 h-5 rounded-full bg-[#14b887] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 bg-[#ffdf3d] border-[#ffdf3d]">
              <p className="font-display text-lg font-bold text-[#121117]">
                Et toi, tu hesites sur quoi ?
              </p>
              <p className="mt-2 text-sm text-[#121117]/80">
                Cree ton compte gratuitement et lance ta propre conversation d&apos;orientation.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/inscription?callbackUrl=/assistant" className="btn-primary !text-sm !py-3">
                  Commencer avec Kampus
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/inscription?callbackUrl=/conseil" className="btn-secondary bg-white/60 !text-sm !py-2.5">
                  Parler a un mentor
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
