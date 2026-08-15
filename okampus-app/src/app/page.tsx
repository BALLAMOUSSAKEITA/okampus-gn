import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/Logo";
import GetStartedLink from "@/components/GetStartedLink";
import SubjectIcon from "@/components/SubjectIcon";
import OrientationDemo from "@/components/OrientationDemo";
import { LandingFeaturedMentors } from "@/components/landing/LandingDynamicSections";
import { LandingNews } from "@/components/landing/LandingNews";
import LandingHero from "@/components/landing/LandingHero";
import WhatsAppCommunityBanner from "@/components/landing/WhatsAppCommunityBanner";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/site-config";

const subjects = [
  { id: "universites", title: "Universités & Écoles", count: "12 établissements", link: "/universites" },
  { id: "assistant", title: "Assistant IA", count: "Orientation personnalisée", link: "/assistant" },
  { id: "conseil", title: "Mentorat", count: "Conseillers étudiants", link: "/conseil" },
  { id: "forum", title: "Forum", count: "Communauté active", link: "/forum" },
  { id: "stages", title: "Stages & Jobs", count: "Opportunités locales", link: "/stages" },
  { id: "bourses", title: "Bourses", count: "Concours et aides", link: "/bourses" },
  { id: "cv", title: "Générateur CV", count: "CV pro avec IA", link: "/cv" },
  { id: "ressources", title: "Ressources", count: "TD et cours", link: "/ressources" },
  { id: "parcours", title: "Parcours", count: "Suivi académique", link: "/parcours" },
  { id: "calendrier", title: "Calendrier", count: "Dates universitaires", link: "/calendrier" },
];

const howItWorks = [
  {
    step: "1",
    title: "Trouve ton mentor",
    desc: "Des étudiants déjà en filière te guident, t'encouragent et répondent à tes questions.",
  },
  {
    step: "2",
    title: "Commence à explorer",
    desc: "L'assistant IA analyse ton profil et te recommande les filières les plus adaptées.",
  },
  {
    step: "3",
    title: "Progresse chaque semaine",
    desc: "Suis ton parcours, postule aux stages et prepare ton insertion professionnelle.",
  },
];

const heroStudentPhoto = {
  src: "/images/jeune-fille.png",
  alt: "Jeune étudiante en bibliothèque",
  name: "Fatoumata S.",
  role: "Étudiante",
};

const heroMentorPhoto = {
  src: "/images/jeune-homme.png",
  alt: "Jeune étudiant en bibliothèque",
  name: "Mamadou D.",
  role: "Mentor",
  rotate: "rotate-[4deg]",
};

export default function Home() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero-canvas px-4 sm:px-6 pt-4 sm:pt-10 pb-12 sm:pb-16 md:pb-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto">
        <WhatsAppCommunityBanner variant="compact" className="lg:hidden mb-5 sm:mb-6" />
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <LandingHero />

          {/* Mobile: une seule photo */}
          <div className="relative h-[260px] sm:h-[340px] lg:hidden animate-scaleIn">
            <div className="absolute inset-0 landing-photo shadow-[0_8px_24px_rgba(18,17,23,0.15)]">
              <Image
                src={heroStudentPhoto.src}
                alt={heroStudentPhoto.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-center"
              />
              <span className="sticker-label absolute bottom-4 left-4 text-sm z-10">
                {heroStudentPhoto.name}
              </span>
            </div>
          </div>

          {/* Desktop: collage */}
          <div className="relative h-[500px] hidden lg:block">
            <div className={`absolute bottom-2 left-10 w-48 h-56 ${heroMentorPhoto.rotate} z-30`}>
              <div className="relative w-full h-full landing-photo shadow-[0_10px_28px_rgba(18,17,23,0.18)] ring-2 ring-[#ffdf3d]">
                <Image
                  src={heroMentorPhoto.src}
                  alt={heroMentorPhoto.alt}
                  fill
                  sizes="192px"
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

            <div className="absolute top-0 right-6 w-64 h-80 -rotate-3 z-20">
              <div className="relative w-full h-full landing-photo shadow-[0_8px_24px_rgba(18,17,23,0.15)]">
                <Image
                  src={heroStudentPhoto.src}
                  alt={heroStudentPhoto.alt}
                  fill
                  sizes="256px"
                  className="object-cover object-center"
                />
                <span className="sticker-label absolute bottom-3 left-3 rotate-[-3deg] text-sm z-10">
                  {heroStudentPhoto.name}
                </span>
                <span className="absolute top-3 right-3 rotate-[2deg] z-10 rounded px-2.5 py-1 text-xs font-semibold bg-[#14b887] text-[#121117]">
                  {heroStudentPhoto.role}
                </span>
              </div>
            </div>

            <div className="absolute top-[38%] left-[42%] -translate-x-1/2 -translate-y-1/2 sticker-label rotate-[-5deg] text-base px-4 py-2 z-40 pointer-events-none">
              La réussite, à deux
            </div>
          </div>
        </div>

        <WhatsAppCommunityBanner className="hidden lg:block" />
        </div>
      </section>

      <LandingNews />

      <OrientationDemo />

      {/* Catalogue */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-[32px] sm:text-[40px] font-bold leading-[1.13] text-[#121117]">
              Explore la plateforme
            </h2>
            <p className="mt-4 text-[#4d4c5c] text-lg">
              Chaque outil t&apos;accompagne à une étape de ton parcours
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

      <LandingFeaturedMentors />

      {/* How it works */}
      <section className="bg-white py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="font-display text-[32px] md:text-[48px] font-bold leading-[1.13] text-[#121117] text-center mb-14 sm:mb-16">
            Comment fonctionne BacheliO ?
          </h2>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            {howItWorks.map((item) => (
              <div key={item.step} className="relative">
                <span className="font-display text-[56px] font-bold text-[#121117]/10 leading-none select-none">{item.step}</span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#121117] mt-1 mb-3">{item.title}</h3>
                <p className="text-[#4d4c5c] leading-relaxed">{item.desc}</p>
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
          <GetStartedLink className="btn-primary mt-8 bg-[#121117]">
            Commencer maintenant
            <span aria-hidden="true">→</span>
          </GetStartedLink>
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
              Partage ton expérience avec les nouveaux bacheliers et aide-les à choisir la bonne filière.
            </p>
            <ul className="mt-6 space-y-3">
              {["Accompagne de nouveaux étudiants", "Développe ton réseau", "Contribue à ta communauté"].map((item) => (
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
                  { href: "/cv", label: "Générateur CV" },
                ],
              },
              {
                title: "Ressources",
                links: [
                  { href: "/universites", label: "Universités & Écoles" },
                  { href: "/stages", label: "Stages & Jobs" },
                  { href: "/bourses", label: "Bourses" },
                  { href: "/ressources", label: "Cours & TD" },
                  { href: "/calendrier", label: "Calendrier" },
                ],
              },
              {
                title: "Communauté",
                links: [
                  { href: WHATSAPP_COMMUNITY_URL, label: "Groupe WhatsApp", external: true },
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
                  {col.links.map((link) =>
                    "external" in link && link.external ? (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-[#dcdce5] hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link key={link.href} href={link.href} className="block text-sm text-[#dcdce5] hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-[#2a2935] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-[#6a697c]">
              &copy; 2026 BacheliO
            </p>
            <Link
              href="/confidentialite"
              className="text-sm text-[#dcdce5] hover:text-white transition-colors"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
