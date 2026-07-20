"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminBoursesPage() {
  return (
    <AdminContentManager
      title="Bourses"
      description="Concours, aides et opportunites de financement"
      endpoint="/scholarships"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "type", label: "Type", required: true, options: ["Bourse", "Concours", "Aide", "Subvention"] },
        { key: "organization", label: "Organisation", required: true },
        { key: "location", label: "Lieu" },
        { key: "domain", label: "Domaine" },
        { key: "amount", label: "Montant" },
        { key: "deadline", label: "Date limite", type: "date" },
        { key: "apply_link", label: "Lien candidature" },
        { key: "contact_info", label: "Contact" },
        { key: "description", label: "Description", type: "textarea", required: true, rows: 4 },
        { key: "eligibility", label: "Eligibilite", type: "textarea", rows: 2 },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "organization", label: "Organisation" },
        { key: "type", label: "Type" },
        { key: "deadline", label: "Deadline", render: (r) => (r.deadline ? String(r.deadline).slice(0, 10) : "—") },
      ]}
      createDefaults={{ is_active: true }}
    />
  );
}
