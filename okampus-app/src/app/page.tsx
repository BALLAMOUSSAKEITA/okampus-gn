import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import SubjectIcon from "@/components/SubjectIcon";

const stats = [
  { value: "1000+", label: "Etudiants accompagnes" },
  { value: "50+", label: "Mentors actifs" },
  { value: "30+", label: "Filieres conseillees" },
  { value: "10+", label: "Universites" },
  { value: "4.8", label: "Note moyenne" },
];

const subjects = [
  { id: "assistant", title: "Assistant IA", count: "Orientation personnalisee", link: "/assistant" },
  { id: "conseil", title: "Mentorat", count: "50+ conseillers", link: "/conseil" },
  { id: "forum", title: "Forum", count: "Communaute active", link: "/forum" },
  { id: "stages", title: "Stages & Jobs", count: "Opportunites locales", link: "/stages" },
  { id: "bourses", title: "Bourses", count: "Concours et aides", link: "/bourses" },
  { id: "cv", title: "Generateur CV", count: "CV pro avec IA", link: "/cv" },
  { id: "ressources", title: "Ressources", count: "TD et cours", link: "/ressources" },
  { id: "parcours", title: "Parcours", count: "Suivi academique", link: "/parcours" },
  { id: "calendrier", title: "Calendrier", count: "Dates universitaires", link: "/calendrier" },
];

const featuredMentors = [
  { name: "Aissatou B.", role: "Medecine — Gamal", rating: "4.9", initials: "AB", color: "bg-[#99c5ff]" },
  { name: "Mamadou D.", role: "Informatique — UGB", rating: "4.8", initials: "MD", color: "bg-[#ffdf3d]" },
  { name: "Fatoumata S.", role: "Droit — Kofi Annan", rating: "5.0", initials: "FS", color: "bg-[#f4f4f8]" },
  { name: "Ibrahima C.", role: "Commerce — UGANC", rating: "4.7", initials: "IC", color: "bg-[#99c5ff]/60" },
];

const howItWorks = [
  {
    step: "1",
    title: "Trouve ton mentor",
    desc: "Des etudiants deja en filiere te guident, t'encouragent et repondent a tes questions.",
    mentors: featuredMentors.slice(0, 3),
  },
  {
    step: "2",
    title: "Commence a explorer",
    desc: "L'assistant IA analyse ton profil et te recommande les filieres les plus adaptees.",
  },
  {
    step: "3",
    title: "Progresse chaque semaine",
    desc: "Suis ton parcours, postule aux stages et prepare ton insertion professionnelle.",
  },
];

const heroStudentPhoto = {
  src: "/images/jeune-fille.png",
  alt: "Jeune etudiante en bibliotheque",
  name: "Fatoumata S.",
  role: "Etudiante",
};

const heroMentorPhoto = {
  src: "/images/jeune-homme.png",
  alt: "Jeune etudiant en bibliotheque",
  name: "Mamadou D.",
  role: "Mentor",
  rotate: "rotate-[4deg]",
};

export default function Home() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero-canvas px-4 sm:px-6 pt-10 pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="animate-fadeInUp">
            <span className="sticker-label rotate-[-2deg] mb-6 inline-block">Plateforme etudiante</span>
            <h1 className="font-display text-[40px] sm:text-[56px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.02em] text-[#121117] max-w-[560px]">
              Reussis plus vite avec la bonne orientation
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-[#121117]/90 leading-[1.5] max-w-md">
              IA, mentorat, forum et stages — tout ce qu&apos;il faut pour choisir ta filiere et
              construire ton avenir.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/inscription" className="btn-primary">
                Trouver un mentor
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/assistant" className="btn-secondary bg-white/40 border-[#121117] hover:bg-[#121117]">
                Tester l&apos;assistant IA
              </Link>
            </div>
          </div>

          <div className="relative h-[340px] sm:h-[420px] lg:h-[500px]">
            {/* Photo mentor — visible devant, en bas a gauche */}
            <div className={`absolute bottom-2 left-0 sm:left-6 lg:left-10 w-36 sm:w-44 lg:w-48 h-44 sm:h-52 lg:h-56 ${heroMentorPhoto.rotate} z-30`}>
              <div className="relative w-full h-full landing-photo shadow-[0_10px_28px_rgba(18,17,23,0.18)] ring-2 ring-[#ffdf3d]">
                <Image
                  src={heroMentorPhoto.src}
                  alt={heroMentorPhoto.alt}
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 176px, 192px"
                  className="object-cover object-center"
                />
                <span className="sticker-label absolute bottom-3 left-3 rotate-[-3deg] text-xs z-10">
                  {heroMentorPhoto.name}
                </span>
                <span className="absolute top-3 right-3 rotate-[2deg] z-10 rounded px-2 py-1 text-[10px] font-semibold bg-[#ffdf3d] text-[#121117]">
                  {heroMentorPhoto.role}
                </span>
              </div>
            </div>

            {/* Photo principale — etudiante */}
            <div className="absolute top-0 right-0 sm:right-2 lg:right-6 w-44 sm:w-56 lg:w-64 h-56 sm:h-72 lg:h-80 -rotate-3 z-20">
              <div className="relative w-full h-full landing-photo shadow-[0_8px_24px_rgba(18,17,23,0.15)]">
                <Image
                  src={heroStudentPhoto.src}
                  alt={heroStudentPhoto.alt}
                  fill
                  priority
                  sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
                  className="object-cover object-center"
                />
                <span className="sticker-label absolute bottom-3 left-3 rotate-[-3deg] text-xs sm:text-sm z-10">
                  {heroStudentPhoto.name}
                </span>
                <span className="absolute top-3 right-3 rotate-[2deg] z-10 rounded px-2.5 py-1 text-xs font-semibold bg-[#14b887] text-[#121117]">
                  {heroStudentPhoto.role}
                </span>
              </div>
            </div>

            <div className="absolute top-[38%] left-[38%] sm:left-[42%] -translate-x-1/2 -translate-y-1/2 sticker-label rotate-[-5deg] text-sm sm:text-base px-3 sm:px-4 py-2 max-w-[140px] sm:max-w-none z-40 pointer-events-none">
              La reussite, a deux
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-stat-strip py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <div className="font-display text-[28px] sm:text-[32px] font-bold text-[#121117] leading-none">{stat.value}</div>
              <div className="mt-2 text-[13px] text-[#4d4c5c] leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Catalogue */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-[32px] sm:text-[40px] font-bold leading-[1.13] text-[#121117]">
              Explore la plateforme
            </h2>
            <p className="mt-4 text-[#4d4c5c] text-lg">
              Chaque outil t&apos;accompagne a une etape de ton parcours
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <Link key={subject.link} href={subject.link} className="catalog-card group">
                <SubjectIcon id={subject.id} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#121117] group-hover:underline underline-offset-2">
                    {subject.title}
                  </h3>
                  <p className="text-[13px] text-[#4d4c5c] mt-0.5">{subject.count}</p>
                </div>
                <span className="text-xl text-[#121117] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mentors featured */}
      <section className="bg-[#f4f4f8] py-16 px-4 sm:px-6 border-y border-[#dcdce5]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="font-display text-[28px] sm:text-[36px] font-bold text-[#121117] leading-tight">
                Mentors populaires
              </h2>
              <p className="mt-2 text-[#4d4c5c]">Des etudiants qui connaissent deja le terrain</p>
            </div>
            <Link href="/conseil" className="btn-secondary shrink-0">
              Voir tous les mentors
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredMentors.map((m) => (
              <Link key={m.name} href="/conseil" className="card overflow-hidden group">
                <div className={`h-32 ${m.color} flex items-center justify-center`}>
                  <span className="text-4xl font-bold text-[#121117]/15">{m.initials}</span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#121117]">{m.name}</p>
                  <p className="text-xs text-[#4d4c5c] mt-1">{m.role}</p>
                  <p className="text-xs font-semibold text-[#121117] mt-2">{m.rating} ★</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display text-[32px] md:text-[48px] font-bold leading-[1.13] text-[#121117] text-center mb-14 sm:mb-16">
            Comment fonctionne O&apos;Kampus ?
          </h2>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <span className="font-display text-[56px] font-bold text-[#121117]/10 leading-none select-none">{item.step}</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#121117] mt-1 mb-3">{item.title}</h3>
                <p className="text-[#4d4c5c] leading-relaxed">{item.desc}</p>

                {item.mentors && (
                  <div className="mt-6 space-y-2">
                    {item.mentors.map((m) => (
                      <div key={m.name} className="catalog-card !py-3">
                        <div className="w-9 h-9 rounded bg-[#14b887] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {m.initials.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-[#121117] truncate">{m.name}</p>
                          <p className="text-xs text-[#4d4c5c] truncate">{m.role}</p>
                        </div>
                        <span className="text-xs font-semibold text-[#121117] shrink-0">{m.rating} ★</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="bg-[#ffdf3d] py-14 sm:py-16 px-4 sm:px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h2 className="font-display text-[28px] sm:text-[36px] font-bold leading-[1.13] text-[#121117]">
            Tu vas adorer ton parcours. Promis.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#121117]/80">
            Ton premier mentor ne te convient pas ? Essaie-en un autre mentor.
          </p>
          <Link href="/inscription" className="btn-primary mt-8 bg-[#121117]">
            Commencer maintenant
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* Become mentor */}
      <section className="bg-[#f4f4f8] py-16 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-[28px] sm:text-[36px] font-bold leading-[1.13] text-[#121117]">
              Deviens mentor
            </h2>
            <p className="mt-4 text-[#4d4c5c] leading-relaxed">
              Partage ton experience avec les nouveaux bacheliers et aide-les a choisir la bonne filiere.
            </p>
            <ul className="mt-6 space-y-3">
              {["Accompagne de nouveaux etudiants", "Developpe ton reseau", "Contribue a ta communaute"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#4d4c5c]">
                  <span className="w-5 h-5 rounded-full bg-[#14b887] text-white flex items-center justify-center text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Link href="/inscription" className="btn-primary">
              Devenir mentor
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/conseil" className="btn-secondary bg-white">
              Voir les mentors
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121117] text-white px-4 sm:px-6 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2 md:col-span-1">
              <div className="mb-4 [&_span]:!text-white">
                <Logo size="md" showText={true} inverted />
              </div>
              <p className="text-sm text-[#dcdce5] leading-relaxed max-w-xs">
                La plateforme qui t&apos;accompagne du bac a l&apos;emploi.
              </p>
            </div>

            {[
              {
                title: "Plateforme",
                links: [
                  { href: "/assistant", label: "Assistant IA" },
                  { href: "/conseil", label: "Mentorat" },
                  { href: "/forum", label: "Forum" },
                  { href: "/cv", label: "Generateur CV" },
                ],
              },
              {
                title: "Ressources",
                links: [
                  { href: "/stages", label: "Stages & Jobs" },
                  { href: "/bourses", label: "Bourses" },
                  { href: "/ressources", label: "Cours & TD" },
                  { href: "/calendrier", label: "Calendrier" },
                ],
              },
              {
                title: "Communaute",
                links: [
                  { href: "/entrepreneuriat", label: "Entrepreneuriat" },
                  { href: "/success-stories", label: "Success Stories" },
                  { href: "/parcours", label: "Mon parcours" },
                  { href: "/inscription", label: "Rejoindre" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold uppercase text-white mb-4">{col.title}</h4>
                <div className="space-y-2">
                  {col.links.map((link) => (
                    <Link key={link.href} href={link.href} className="block text-sm text-[#dcdce5] hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-[#2a2935] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6a697c]">
              &copy; 2026 O&apos;Kampus
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
