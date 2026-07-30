"use client";

import { useSession } from "next-auth/react";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminStoriesPage() {
  const { data: session } = useSession();

  return (
    <AdminContentManager
      title="Success Stories"
      description="Temoignages et parcours inspirants"
      endpoint="/stories"
      pillVariant="blue"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "category", label: "Catégorie", required: true, options: ["Orientation", "Etudes", "Carrière", "Entrepreneuriat"] },
        { key: "author_name", label: "Nom auteur", required: true },
        { key: "author_role", label: "Rôle / filière" },
        { key: "university", label: "Université" },
        { key: "graduation_year", label: "Année diplôme" },
        { key: "image_url", label: "URL image" },
        { key: "content", label: "Contenu", type: "textarea", required: true, rows: 6 },
        { key: "is_featured", label: "Mis en avant", type: "checkbox" },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "author_name", label: "Auteur" },
        { key: "category", label: "Catégorie" },
        {
          key: "is_featured",
          label: "Featured",
          render: (r) => (r.is_featured ? "Oui" : "Non"),
        },
      ]}
      createDefaults={{
        author_id: session?.user?.id ?? "",
        is_featured: false,
        is_active: true,
      }}
    />
  );
}
