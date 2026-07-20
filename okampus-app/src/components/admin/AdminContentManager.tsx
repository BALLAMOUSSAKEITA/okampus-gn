"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import {
  adminFetch,
  inputClass,
  labelClass,
  selectClass,
  type FieldConfig,
} from "@/lib/admin-api";

type AdminContentManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  columns: { key: string; label: string; render?: (row: Record<string, unknown>) => string }[];
  idKey?: string;
  createDefaults?: Record<string, unknown>;
  pillVariant?: "blue" | "green" | "orange" | "violet";
};

function emptyForm(fields: FieldConfig[], defaults?: Record<string, unknown>) {
  const form: Record<string, unknown> = { ...defaults };
  fields.forEach((f) => {
    if (form[f.key] === undefined) {
      form[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : "";
    }
  });
  return form;
}

export default function AdminContentManager({
  title,
  description,
  endpoint,
  fields,
  columns,
  idKey = "id",
  createDefaults,
  pillVariant = "blue",
}: AdminContentManagerProps) {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyForm(fields, createDefaults));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminFetch<Record<string, unknown>[]>(endpoint, token);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [endpoint, token]);

  useEffect(() => {
    load();
  }, [load]);

  const resetForm = () => {
    setForm(emptyForm(fields, createDefaults));
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {};
      fields.forEach((f) => {
        const val = form[f.key];
        if (f.type === "number") payload[f.key] = Number(val) || 0;
        else if (f.type === "checkbox") payload[f.key] = Boolean(val);
        else if (f.type === "date" && val) payload[f.key] = new Date(String(val)).toISOString();
        else if (val !== "" && val !== undefined) payload[f.key] = val;
      });

      if (editingId) {
        await adminFetch(`${endpoint}/${editingId}`, token, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch(endpoint, token, {
          method: "POST",
          body: JSON.stringify({ ...createDefaults, ...payload }),
        });
      }
      resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row: Record<string, unknown>) => {
    const next: Record<string, unknown> = emptyForm(fields, createDefaults);
    fields.forEach((f) => {
      if (row[f.key] !== undefined && row[f.key] !== null) {
        if (f.type === "date" && row[f.key]) {
          next[f.key] = String(row[f.key]).slice(0, 10);
        } else {
          next[f.key] = row[f.key];
        }
      }
    });
    setForm(next);
    setEditingId(String(row[idKey]));
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Supprimer cet element ?")) return;
    try {
      await adminFetch(`${endpoint}/${id}`, token, { method: "DELETE" });
      if (editingId === id) resetForm();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur suppression");
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = form[field.key];
    const onChange = (v: unknown) => setForm((prev) => ({ ...prev, [field.key]: v }));

    if (field.type === "textarea") {
      return (
        <textarea
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          className="admin-textarea"
          required={field.required}
        />
      );
    }
    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-2 text-sm text-[#171717]">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-[#e5e5e5]"
          />
          Oui
        </label>
      );
    }
    if (field.type === "select" && field.options) {
      return (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
          required={field.required}
        >
          <option value="">Selectionner</option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={field.type === "number" ? Number(value) || "" : String(value ?? "")}
        onChange={(e) =>
          onChange(field.type === "number" ? e.target.valueAsNumber : e.target.value)
        }
        placeholder={field.placeholder}
        className={inputClass}
        required={field.required && !editingId}
      />
    );
  };

  return (
    <div>
      <AdminPageHeader
        pill={{ label: "Contenu", variant: pillVariant }}
        title={title}
        description={description}
      />

      {error && <div className="admin-alert-error">{error}</div>}

      <div className="admin-card mb-6">
        <h2 className="admin-card-title">{editingId ? "Modifier" : "Ajouter"}</h2>
        <form onSubmit={handleSubmit} className="admin-form-grid">
          {fields.map((field) => (
            <div
              key={field.key}
              className={field.type === "textarea" ? "admin-form-span-2" : ""}
            >
              <label className={labelClass}>{field.label}</label>
              {renderField(field)}
            </div>
          ))}
          <div className="admin-form-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="admin-btn-primary">
              {saving ? "Enregistrement..." : editingId ? "Mettre a jour" : "Creer"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="admin-btn-secondary">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-card !p-0 overflow-hidden">
        {loading ? (
          <p className="admin-empty">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="admin-empty">Aucun element pour le moment.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th className="admin-table-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={String(row[idKey])}>
                    {columns.map((col) => (
                      <td key={col.key} className="max-w-[200px] truncate">
                        {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                    <td className="admin-table-actions">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="admin-btn-link mr-3"
                      >
                        Editer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(String(row[idKey]))}
                        className="admin-btn-danger"
                      >
                        Suppr.
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
