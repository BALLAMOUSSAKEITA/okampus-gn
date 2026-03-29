import Link from "next/link";
import Logo from "@/components/Logo";

const features = [
  {
    title: "Assistant IA",
    desc: "Analyse ton profil et recois des recommandations d'orientation personnalisees",
    link: "/assistant",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    gradient: "from-violet-500 to-purple-500",
    bgLight: "bg-violet-50",
  },
  {
    title: "Mentorat etudiant",
    desc: "Contacte directement des etudiants en filiere pour avoir leurs retours",
    link: "/conseil",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
  },
  {
    title: "Forum communaute",
    desc: "Pose tes questions sur les universites, filieres et la vie etudiante",
    link: "/forum",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
  },
  {
    title: "Suivi de parcours",
    desc: "Gere tes notes, objectifs et ta progression academique",
    link: "/parcours",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
  },
  {
    title: "Stages & Jobs",
    desc: "Trouve des stages, jobs etudiants et alternances en Guinee et ailleurs",
    link: "/stages",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50",
  },
  {
    title: "Generateur CV",
    desc: "Cree ton CV professionnel automatiquement avec l'IA",
    link: "/cv",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    gradient: "from-blue-500 to-sky-500",
    bgLight: "bg-red-50",
  },
  {
    title: "Ressources",
    desc: "Accede a des TD, cours et sujets d'examens partages par la communaute",
    link: "/ressources",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    gradient: "from-cyan-500 to-teal-500",
    bgLight: "bg-cyan-50",
  },
  {
    title: "Bourses & Concours",
    desc: "Decouvre toutes les opportunites de bourses et concours disponibles",
    link: "/bourses",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-3.77 1.522m0 0a6.003 6.003 0 01-3.77-1.522" />
      </svg>
    ),
    gradient: "from-yellow-500 to-amber-500",
    bgLight: "bg-yellow-50",
  },
  {
    title: "Calendrier",
    desc: "Ne rate aucun evenement : examens, vacances, rentrees universitaires",
    link: "/calendrier",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    gradient: "from-purple-500 to-violet-500",
    bgLight: "bg-purple-50",
  },
  {
    title: "Entrepreneuriat",
    desc: "Decouvre et partage des projets entrepreneuriaux etudiants",
    link: "/entrepreneuriat",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    gradient: "from-orange-500 to-red-500",
    bgLight: "bg-orange-50",
  },
  {
    title: "Success Stories",
    desc: "Inspire-toi des parcours exceptionnels d'anciens etudiants",
    link: "/success-stories",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    gradient: "from-pink-500 to-rose-500",
    bgLight: "bg-pink-50",
  },
];

const stats = [
  { value: "30+", label: "Filieres", desc: "Conseillees" },
  { value: "50+", label: "Mentors", desc: "Actifs" },
  { value: "10+", label: "Universites", desc: "Representees" },
  { value: "1000+", label: "Etudiants", desc: "Accompagnes" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative mesh-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 right-1/3 w-72 h-72 bg-emerald-400/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-red-100 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c41e3a] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-sm font-medium text-[#c41e3a]">
                Plateforme de l&apos;etudiant guineen
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
              <span className="text-slate-900">Ton avenir,</span>
              <br />
              <span className="text-gradient-primary">ton parcours.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Orientation IA, mentorat, forum, CV, stages &mdash; O&apos;Kampus t&apos;accompagne
              du bac a l&apos;emploi avec les meilleurs outils.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
              <Link
                href="/inscription"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 btn-primary text-base"
              >
                Commencer gratuitement
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/assistant"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 btn-secondary text-base"
              >
                <svg className="w-5 h-5 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Tester l&apos;assistant IA
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-20">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="card px-5 py-6 text-center group cursor-default"
              >
                <div className="text-3xl font-extrabold text-[#c41e3a]">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-red-50 text-[#c41e3a] text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              Fonctionnalites
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Tout ce dont tu as besoin
            </h2>
            <p className="text-lg text-slate-600 mt-4">
              Une plateforme complete pour reussir ton parcours etudiant
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className="card group p-6 relative overflow-hidden"
              >
                {/* Gradient blob on hover */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

                <div className="relative">
                  <div className={`w-12 h-12 ${feature.bgLight} rounded-xl flex items-center justify-center mb-4 text-slate-700 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#c41e3a] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.desc}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#c41e3a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Decouvrir
                    <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 mesh-gradient relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              Comment ca marche
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              3 etapes pour avancer
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Cree ton profil",
                desc: "Inscris-toi, renseigne ta serie, tes notes et tes centres d'interet.",
                color: "from-[#c41e3a] to-[#9e1830]",
              },
              {
                step: "02",
                title: "Explore tes options",
                desc: "L'assistant IA analyse ton profil et te recommande les meilleures filieres.",
                color: "from-amber-500 to-orange-500",
              },
              {
                step: "03",
                title: "Connecte-toi",
                desc: "Echange avec des mentors, postule a des stages et construis ton avenir.",
                color: "from-emerald-500 to-teal-500",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="card p-8 text-center h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} text-white text-xl font-bold mb-5 shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c41e3a] via-[#9e1830] to-[#7a1225]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Pret a construire ton avenir ?
          </h2>
          <p className="text-lg md:text-xl text-red-100 mb-10 max-w-2xl mx-auto">
            Rejoins des milliers d&apos;etudiants guineens qui avancent avec confiance grace a O&apos;Kampus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inscription"
              className="group inline-flex items-center justify-center gap-2 bg-white text-[#c41e3a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all shadow-xl shadow-red-900/20"
            >
              S&apos;inscrire gratuitement
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/assistant"
              className="inline-flex items-center justify-center gap-2 text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
            >
              Essayer l&apos;assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-1">
              <Logo size="md" showText={true} className="mb-4" />
              <p className="text-sm text-slate-400 leading-relaxed">
                La plateforme qui accompagne chaque etudiant guineen du bac a l&apos;emploi.
              </p>
              {/* Guinea flag bar */}
              <div className="flex gap-0 mt-5 rounded-full overflow-hidden w-20 h-1.5">
                <div className="flex-1 bg-[#ce1126]" />
                <div className="flex-1 bg-[#fcd116]" />
                <div className="flex-1 bg-[#009460]" />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Plateforme</h4>
              <div className="space-y-3">
                {[
                  { href: "/assistant", label: "Assistant IA" },
                  { href: "/conseil", label: "Mentorat" },
                  { href: "/forum", label: "Forum" },
                  { href: "/cv", label: "Generateur CV" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Ressources</h4>
              <div className="space-y-3">
                {[
                  { href: "/stages", label: "Stages & Jobs" },
                  { href: "/bourses", label: "Bourses" },
                  { href: "/ressources", label: "Cours & TD" },
                  { href: "/calendrier", label: "Calendrier" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Communaute</h4>
              <div className="space-y-3">
                {[
                  { href: "/entrepreneuriat", label: "Entrepreneuriat" },
                  { href: "/success-stories", label: "Success Stories" },
                  { href: "/parcours", label: "Mon parcours" },
                  { href: "/inscription", label: "Rejoindre" },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              &copy; 2025 O&apos;Kampus &mdash; Fait avec passion pour les etudiants guineens
            </p>
            <div className="flex gap-4">
              <span className="text-xs text-slate-600 px-3 py-1 rounded-full bg-slate-800/50">
                Conakry, Guinee
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
