"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminForumPage() {
  return (
    <AdminContentManager
      title="Forum"
      description="Moderer et publiér des sujets de discussion"
      endpoint="/forum"
      pillVariant="violet"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "author", label: "Auteur", required: true },
        { key: "category", label: "Catégorie", required: true, options: ["Orientation", "Etudes", "Stages", "Vie étudiante", "Autre"] },
        { key: "content", label: "Contenu", type: "textarea", required: true, rows: 5 },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "author", label: "Auteur" },
        { key: "category", label: "Catégorie" },
        { key: "replies", label: "Réponses" },
      ]}
    />
  );
}
