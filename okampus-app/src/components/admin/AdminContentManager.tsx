"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminFetch, inputClass, type FieldConfig } from "@/lib/admin-api";

type AdminContentManagerProps = {
  title: string;
  description: string;
  endpoint: string;
  fields: FieldConfig[];
  columns: { key: string; label: string; render?: (row: Record<string, unknown>) => string }[];
  idKey?: string;
  createDefaults?: Record<string, unknown>;
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
          className={inputClass}
          required={field.required}
        />
      );
    }
    if (field.type === "checkbox") {
      return (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded"
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
          className={inputClass}
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
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#121117]">{title}</h1>
        <p className="text-[#4d4c5c] mt-1">{description}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="card p-5 mb-6 bg-white">
        <h2 className="font-semibold text-[#121117] mb-4">
          {editingId ? "Modifier" : "Ajouter"}
        </h2>
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.key}
              className={field.type === "textarea" ? "sm:col-span-2" : ""}
            >
              <label className="block text-xs font-medium text-[#4d4c5c] mb-1">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
          <div className="sm:col-span-2 flex gap-2 pt-2">
            <button type="submit" disabled={saving} className="btn-primary !text-sm !py-2.5">
              {saving ? "Enregistrement..." : editingId ? "Mettre a jour" : "Creer"}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-secondary !text-sm !py-2.5">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card overflow-hidden bg-white">
        {loading ? (
          <p className="p-6 text-[#6a697c] text-sm">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-[#6a697c] text-sm">Aucun element pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#dcdce5] bg-[#f4f4f8]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="text-left px-4 py-3 font-semibold text-[#4d4c5c] whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold text-[#4d4c5c]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={String(row[idKey])} className="border-b border-[#dcdce5] last:border-0">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-[#121117] max-w-[200px] truncate">
                        {col.render
                          ? col.render(row)
                          : String(row[col.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="text-[#121117] font-medium hover:underline mr-3"
                      >
                        Editer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(String(row[idKey]))}
                        className="text-red-600 font-medium hover:underline"
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
