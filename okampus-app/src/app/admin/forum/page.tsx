"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminForumPage() {
  return (
    <AdminContentManager
      title="Forum"
      description="Moderer et publier des sujets de discussion"
      endpoint="/forum"
      pillVariant="violet"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "author", label: "Auteur", required: true },
        { key: "category", label: "Categorie", required: true, options: ["Orientation", "Etudes", "Stages", "Vie etudiante", "Autre"] },
        { key: "content", label: "Contenu", type: "textarea", required: true, rows: 5 },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "author", label: "Auteur" },
        { key: "category", label: "Categorie" },
        { key: "replies", label: "Reponses" },
      ]}
    />
  );
}
