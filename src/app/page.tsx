import Link from "next/link";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background avec motifs géométriques */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-emerald-50" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#c41e3a]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#008751]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#f4c430]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c41e3a\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-800 text-sm font-medium">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                La plateforme de l’étudiant guinéen
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Trouvez votre</span>
                <br />
                <span className="bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
                  voie idéale
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                O&apos;Kampus accompagne l&apos;étudiant guinéen de la réussite au bac jusqu&apos;à
                l&apos;insertion professionnelle. Orientation, conseils (chat & rendez-vous),
                forum, CV… tout au même endroit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/assistant"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-violet-200 transition-all hover:-translate-y-0.5"
                >
                  🤖 Assistant IA
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/conseil"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:shadow-red-200 transition-all"
                >
                  Parler à un conseiller
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#008751] text-[#008751] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#008751] hover:text-white transition-all"
                >
                  S&apos;inscrire
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#c41e3a]/20 to-[#008751]/20 rounded-3xl blur-2xl" />
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
                  <div className="space-y-4">
                    {[
                      { icon: "🎓", title: "Médecine", desc: "Conseiller disponible", color: "bg-red-50" },
                      { icon: "⚖️", title: "Droit", desc: "3 conseillers actifs", color: "bg-amber-50" },
                      { icon: "💻", title: "Informatique", desc: "Conseiller disponible", color: "bg-emerald-50" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${item.color}`}>
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <span className="ml-auto text-[#008751] text-sm font-medium">Chat →</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme, pour tout votre parcours étudiant
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Orientation + Plan d’action",
                desc: "Définissez votre projet, vos forces/faiblesses et vos notes. Recevez des recommandations et les prochaines étapes pour avancer.",
                link: "/assistant",
              },
              {
                icon: "💬",
                title: "Mentorat & Rendez-vous",
                desc: "Discutez avec des étudiants-conseillers, puis prenez rendez-vous pour un appel (Meet) plus approfondi.",
                link: "/conseil",
              },
              {
                icon: "📚",
                title: "Communauté & Ressources",
                desc: "Posez vos questions sur les universités et les filières. Bientôt : ressources bac, bourses, stages et opportunités.",
                link: "/forum",
              },
            ].map((feature, i) => (
              <Link
                key={i}
                href={feature.link}
                className="group p-8 rounded-2xl border-2 border-amber-100 hover:border-[#c41e3a]/30 hover:shadow-xl hover:shadow-red-50 transition-all"
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#c41e3a] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#c41e3a] to-[#9e1830]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Prêt à construire ton parcours ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoins O&apos;Kampus et avance du bac à l&apos;emploi : orientation, communauté, CV et opportunités.
          </p>
          <Link
            href="/conseil"
            className="inline-flex items-center gap-2 bg-white text-[#c41e3a] px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-50 transition-all shadow-xl"
          >
            Commencer maintenant
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-bold text-xl bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] bg-clip-text text-transparent">
              O&apos;Kampus
            </span>
            <p className="text-gray-400 text-sm">
              Plateforme de l’étudiant guinéen • République de Guinée
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
