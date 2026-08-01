"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminActualitesPage() {
  return (
    <AdminContentManager
      title="Actualités"
      description="Publie des nouveautés visibles sur la page d'accueil : dates clés, événements, bourses et annonces plateforme."
      endpoint="/news"
      pillVariant="orange"
      fields={[
        { key: "title", label: "Titre", required: true, placeholder: "Ouverture des inscriptions UGANC 2026" },
        {
          key: "summary",
          label: "Résumé",
          type: "textarea",
          required: true,
          rows: 3,
          placeholder: "Court texte affiché sur la carte (2-3 phrases max)",
        },
        {
          key: "content",
          label: "Article complet",
          type: "textarea",
          rows: 8,
          placeholder: "Texte affiché sur la page de détail (paragraphes séparés par une ligne vide)",
        },
        {
          key: "category",
          label: "Catégorie",
          type: "select",
          required: true,
          options: ["Actualité", "Événement", "Bourse", "Plateforme"],
        },
        {
          key: "link",
          label: "Lien complémentaire (optionnel)",
          placeholder: "/universites ou https://... — bouton en bas de l'article",
        },
        { key: "published_at", label: "Date de publication", type: "date" },
        { key: "is_active", label: "Visible sur l'accueil", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "category", label: "Catégorie" },
        {
          key: "published_at",
          label: "Publication",
          render: (r) =>
            r.published_at ? String(r.published_at).slice(0, 10) : "N/A",
        },
        {
          key: "is_active",
          label: "Actif",
          render: (r) => (r.is_active ? "Oui" : "Non"),
        },
      ]}
      createDefaults={{ is_active: true, category: "Actualité" }}
    />
  );
}
