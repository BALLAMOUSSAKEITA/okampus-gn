"use client";

import { useSession } from "next-auth/react";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminEntrepreneuriatPage() {
  const { data: session } = useSession();

  return (
    <AdminContentManager
      title="Entrepreneuriat"
      description="Projets et initiatives etudiantes"
      endpoint="/entrepreneur"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "category", label: "Categorie", required: true },
        { key: "status", label: "Statut", required: true, options: ["Ideation", "En cours", "Lance", "Recherche cofondateur"] },
        { key: "team_size", label: "Taille equipe", type: "number" },
        { key: "seeking", label: "Recherche" },
        { key: "website", label: "Site web" },
        { key: "contact_info", label: "Contact" },
        { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "category", label: "Categorie" },
        { key: "status", label: "Statut" },
        { key: "team_size", label: "Equipe" },
      ]}
      createDefaults={{
        author_id: session?.user?.id ?? "",
        team_size: 1,
        is_active: true,
      }}
    />
  );
}
