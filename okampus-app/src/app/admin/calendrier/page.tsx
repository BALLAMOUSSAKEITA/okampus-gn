"use client";

import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminCalendrierPage() {
  return (
    <AdminContentManager
      title="Calendrier"
      description="Dates universitaires et evenements importants"
      endpoint="/calendar"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "type", label: "Type", required: true, options: ["Inscription", "Examen", "Vacances", "Evenement", "Autre"] },
        { key: "start_date", label: "Date debut", type: "date", required: true },
        { key: "end_date", label: "Date fin", type: "date" },
        { key: "location", label: "Lieu" },
        { key: "university", label: "Universite" },
        { key: "color", label: "Couleur", placeholder: "#14b887" },
        { key: "description", label: "Description", type: "textarea", rows: 3 },
        { key: "is_recurrent", label: "Recurrent", type: "checkbox" },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "type", label: "Type" },
        { key: "start_date", label: "Debut", render: (r) => String(r.start_date ?? "").slice(0, 10) },
        { key: "university", label: "Universite" },
      ]}
      createDefaults={{ is_recurrent: false, is_active: true }}
    />
  );
}
