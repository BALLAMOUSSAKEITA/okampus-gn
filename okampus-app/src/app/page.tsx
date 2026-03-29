import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile First */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-amber-50 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c41e3a] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#008751] rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6 md:space-y-8">
            <span className="inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-slate-200 text-sm font-medium text-slate-700">
              Plateforme de l'étudiant guinéen
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900">
              De la réussite au bac à l'insertion professionnelle
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Orientation, mentorat, forum, CV… O'Kampus accompagne chaque étudiant guinéen tout au long de son parcours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
              <Link
                href="/inscription"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-[#c41e3a] text-white rounded-lg font-semibold hover:bg-[#9e1830] transition-colors shadow-lg shadow-red-500/20"
              >
                Commencer gratuitement
              </Link>
              <Link
                href="/assistant"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition-colors border border-slate-200"
              >
                Assistant orientation
              </Link>
            </div>
          </div>

          {/* Stats Cards - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-16 md:mt-20">
            {[
              { label: "Filières", value: "30+", desc: "Conseillées" },
              { label: "Conseillers", value: "50+", desc: "Actifs" },
              { label: "Universités", value: "10+", desc: "Représentées" },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
                <div className="text-3xl font-bold text-[#c41e3a]">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont tu as besoin
            </h2>
            <p className="text-lg text-slate-600">
              Une plateforme complète pour ton parcours étudiant
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: "Assistant IA",
                desc: "Analyse ton profil et reçois des recommandations personnalisées",
                link: "/assistant",
                color: "from-violet-500 to-purple-500",
              },
              {
                title: "Conseillers étudiants",
                desc: "Contacte directement des étudiants en filière pour avoir leurs retours",
                link: "/conseil",
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Forum communauté",
                desc: "Pose tes questions sur les universités et les filières",
                link: "/forum",
                color: "from-emerald-500 to-teal-500",
              },
              {
                title: "Suivi de parcours",
                desc: "Gère tes notes, objectifs et progression académique",
                link: "/parcours",
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "Offres de stage",
                desc: "Trouve des stages, jobs étudiants et alternances en Guinée",
                link: "/stages",
                color: "from-rose-500 to-pink-500",
              },
              {
                title: "Générateur CV",
                desc: "Crée ton CV professionnel automatiquement",
                link: "/cv",
                color: "from-indigo-500 to-blue-500",
              },
              {
                title: "Ressources partagées",
                desc: "Accède à des TD, cours et sujets d'examens partagés par la communauté",
                link: "/ressources",
                color: "from-cyan-500 to-teal-500",
              },
              {
                title: "Bourses & Concours",
                desc: "Découvre toutes les opportunités de bourses et concours disponibles",
                link: "/bourses",
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Calendrier universitaire",
                desc: "Ne rate aucun événement important : examens, vacances, rentrées",
                link: "/calendrier",
                color: "from-purple-500 to-violet-500",
              },
              {
                title: "Entrepreneuriat",
                desc: "Découvre et partage des projets entrepreneuriaux étudiants",
                link: "/entrepreneuriat",
                color: "from-orange-500 to-red-500",
              },
              {
                title: "Success Stories",
                desc: "Inspire-toi des parcours exceptionnels d'anciens étudiants",
                link: "/success-stories",
                color: "from-pink-500 to-rose-500",
              },
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} mb-4 opacity-90 group-hover:opacity-100 transition-opacity`} />
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#c41e3a] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-[#c41e3a] to-[#9e1830]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Prêt à démarrer ?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoins O'Kampus et avance du bac à l'emploi avec confiance.
          </p>
          <Link
            href="/inscription"
            className="inline-flex items-center gap-2 bg-white text-[#c41e3a] px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-50 transition-all shadow-xl"
          >
            S'inscrire gratuitement
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
                O'Kampus
              </span>
              <span className="text-xs text-slate-400">• Guinée</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/assistant" className="hover:text-white transition-colors">Assistant</Link>
              <Link href="/conseil" className="hover:text-white transition-colors">Conseillers</Link>
              <Link href="/forum" className="hover:text-white transition-colors">Forum</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>Plateforme de l'étudiant guinéen • Du bac à l'emploi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
