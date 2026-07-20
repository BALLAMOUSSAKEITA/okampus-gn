"use client";

import { useSession } from "next-auth/react";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminStagesPage() {
  return (
    <AdminContentManager
      title="Stages & Jobs"
      description="Publier et gerer les offres de stage"
      endpoint="/stages"
      pillVariant="orange"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "company", label: "Entreprise", required: true },
        { key: "location", label: "Lieu", required: true },
        { key: "type", label: "Type", required: true, options: ["Stage", "Job", "Alternance"] },
        { key: "domain", label: "Domaine", required: true },
        { key: "duration", label: "Duree" },
        { key: "remuneration", label: "Remuneration" },
        { key: "contact_email", label: "Email contact" },
        { key: "contact_phone", label: "Telephone" },
        { key: "external_link", label: "Lien externe" },
        { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
        { key: "requirements", label: "Prerequis", type: "textarea", rows: 2 },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "company", label: "Entreprise" },
        { key: "location", label: "Lieu" },
        { key: "type", label: "Type" },
        {
          key: "is_active",
          label: "Actif",
          render: (r) => (r.is_active ? "Oui" : "Non"),
        },
      ]}
      createDefaults={{ is_active: true }}
    />
  );
}
