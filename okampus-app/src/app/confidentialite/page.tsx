import Link from "next/link";
import Logo from "@/components/Logo";

const sections = [
  {
    title: "1. Responsable du traitement",
    body: [
      "BacheliO (ci-après « la Plateforme ») est une plateforme d'orientation et d'accompagnement étudiant.",
      "Pour toute question relative à vos données personnelles : contact@bachelio.com.",
    ],
  },
  {
    title: "2. Données collectées",
    body: [
      "Lors de l'inscription et de l'utilisation du service, nous pouvons collecter :",
      "• Identifiants de compte : nom, email et/ou numéro de téléphone, mot de passe (stocke de façon chiffrée) ;",
      "• Profil académique : ville, option au bac, université, filière ;",
      "• Contenus que vous publiéz : messages forum, ressources, CV, parcours ;",
      "• Données techniques : logs de connexion, type d'appareil, pages consultées (à des fins de sécurité et d'amélioration).",
    ],
  },
  {
    title: "3. Finalites",
    body: [
      "Vos données sont utilisées pour :",
      "• Créer et sécuriser votre compte ;",
      "• Personnaliser l'orientation (assistant IA, recommandations, mentorat) ;",
      "• Vous permettre d'utiliser le forum, les stages, les bourses et les ressources ;",
      "• Assurer le support, la sécurité et l'amélioration de la Plateforme ;",
      "• Respecter nos obligations légales.",
      "Nous ne vendons pas vos données personnelles à des tiers.",
    ],
  },
  {
    title: "4. Base légale",
    body: [
      "Le traitement repose sur : votre consentement (creation de compte et acceptation de cette politique), l'execution du service que vous demandez, et, le cas échéant, notre intérêt légitime à sécuriser et améliorer la Plateforme.",
    ],
  },
  {
    title: "5. Conservation",
    body: [
      "Les données de compte sont conservées tant que votre compte est actif.",
      "En cas de suppression de compte, nous effaçons ou anonymisons vos données personnelles dans un délai raisonnable, sauf obligation légale de conservation (par exemple logs de sécurité).",
    ],
  },
  {
    title: "6. Partage",
    body: [
      "Vos données peuvent être traitées par des prestataires techniques (hébergement, email transactionnel, outils d'analyse) uniquement pour faire fonctionner BacheliO, sous des garanties contractuelles appropriees.",
      "Certaines informations que vous choisissez de rendre publiques (profil mentor, posts forum) sont visibles par les autres utilisateurs.",
    ],
  },
  {
    title: "7. Sécurité",
    body: [
      "Nous mettons en place des mesures techniques et organisationnelles raisonnables : mots de passe haches, accès restreints, communications HTTPS.",
      "Aucun systeme n'est totalement infaillible ; signalez toute activité suspecte à contact@bachelio.com.",
    ],
  },
  {
    title: "8. Vos droits",
    body: [
      "Selon la legislation applicable, vous pouvez demander l'accès, la rectification, la suppression ou la limitation du traitement de vos données, ainsi que vous opposer à certains traitements.",
      "Vous pouvez aussi supprimer votre compte depuis votre profil ou en nous contactant.",
      "Pour exercer vos droits : contact@bachelio.com.",
    ],
  },
  {
    title: "9. Mineurs",
    body: [
      "BacheliO s'adresse principalement aux bacheliers et étudiants. Si vous avez moins de 16 ans, demandez l'accord d'un parent ou tuteur avant de créer un compte.",
    ],
  },
  {
    title: "10. Modifications",
    body: [
      "Cette politique peut être mise à jour. La date de mise à jour figure ci-dessous. En cas de changement important, nous vous en informerons sur la Plateforme.",
    ],
  },
];

export default function ConfidentialitePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f4f4f8]">
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link href="/" className="inline-block mb-8">
          <Logo size="md" />
        </Link>

        <header className="mb-10">
          <p className="text-sm font-semibold text-[#14b887] mb-2">Légal</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-[#121117]">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-[#4d4c5c] leading-relaxed">
            Comment BacheliO collecte, utilise et protège vos données personnelles.
          </p>
          <p className="mt-2 text-sm text-[#6a697c]">Dernière mise à jour : 24 juillet 2026</p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-lg font-bold text-[#121117] mb-3">
                {section.title}
              </h2>
              <div className="space-y-2 text-[#4d4c5c] leading-relaxed text-[15px]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 text-sm text-[#6a697c]">
          <Link href="/inscription" className="text-[#121117] font-medium hover:underline">
            Retour à l&apos;inscription
          </Link>
          {" · "}
          <Link href="/" className="hover:text-[#121117]">
            Accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
