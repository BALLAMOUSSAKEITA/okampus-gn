"use client";

import { useSession } from "next-auth/react";
import AdminContentManager from "@/components/admin/AdminContentManager";

export default function AdminRessourcesPage() {
  const { data: session } = useSession();

  return (
    <AdminContentManager
      title="Ressources"
      description="Cours, TD et documents pedagogiques"
      endpoint="/resources"
      pillVariant="green"
      fields={[
        { key: "title", label: "Titre", required: true },
        { key: "category", label: "Categorie", required: true },
        { key: "subject", label: "Matiere", required: true },
        { key: "filiere", label: "Filiere" },
        { key: "university", label: "Universite" },
        { key: "year", label: "Annee" },
        { key: "file_url", label: "URL fichier", required: true },
        { key: "file_type", label: "Type fichier", required: true, placeholder: "pdf" },
        { key: "file_size", label: "Taille (octets)", type: "number" },
        { key: "price", label: "Prix (GNF)", type: "number" },
        { key: "description", label: "Description", type: "textarea", required: true, rows: 3 },
        { key: "is_premium", label: "Premium", type: "checkbox" },
        { key: "is_active", label: "Actif", type: "checkbox" },
      ]}
      columns={[
        { key: "title", label: "Titre" },
        { key: "subject", label: "Matiere" },
        { key: "category", label: "Categorie" },
        { key: "price", label: "Prix" },
      ]}
      createDefaults={{
        author_id: session?.user?.id ?? "",
        file_size: 0,
        price: 0,
        is_premium: false,
        is_active: true,
      }}
    />
  );
}
