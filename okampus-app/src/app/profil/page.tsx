"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/context/AuthContext";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import UserAvatar from "@/components/UserAvatar";
import MentorInbox from "@/components/MentorInbox";
import PushNotificationSetup from "@/components/PushNotificationSetup";

const emptyAdvisorForm = {
  field: "",
  university: "",
  year: "",
  description: "",
  meetLink: "",
  availableSlotsText: "",
};

export default function ProfilPage() {
  const router = useRouter();
  const { user, isLoaded, updateUser } = useAuth();
  const [showAdvisorForm, setShowAdvisorForm] = useState(false);
  const [advisorForm, setAdvisorForm] = useState(emptyAdvisorForm);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorError, setAdvisorError] = useState("");
  const [advisorSuccess, setAdvisorSuccess] = useState("");

  const openAdvisorForm = () => {
    setAdvisorError("");
    setAdvisorForm({
      field: user?.field?.trim() || "",
      university: user?.university?.trim() || "",
      year: "",
      description: "",
      meetLink: "",
      availableSlotsText: "",
    });
    setShowAdvisorForm(true);
  };

  useEffect(() => {
    if (isLoaded && !user) {
      router.replace("/connexion?callbackUrl=/profil");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f8]">
        <div className="animate-pulse text-[#6a697c] text-lg font-medium">Chargement...</div>
      </div>
    );
  }

  const handleBecomeAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdvisorError("");
    setAdvisorSuccess("");

    if (user.role !== "etudiant" && user.role !== "admin") {
      setAdvisorError("Seuls les etudiants peuvent devenir conseillers");
      return;
    }

    if (!advisorForm.field.trim() || !advisorForm.university.trim() || !advisorForm.year.trim()) {
      setAdvisorError("Filiere, universite et annee sont requises");
      return;
    }

    const availableSlots = advisorForm.availableSlotsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    setAdvisorLoading(true);
    try {
      const ok = await updateUser({
        isAdvisor: true,
        advisorProfile: {
          field: advisorForm.field.trim(),
          university: advisorForm.university.trim(),
          year: advisorForm.year.trim(),
          description: advisorForm.description.trim(),
          meetLink: advisorForm.meetLink.trim() || undefined,
          availableSlots,
        },
      });

      if (!ok) {
        setAdvisorError("Impossible d'enregistrer le profil conseiller. Reessaie.");
        return;
      }

      setShowAdvisorForm(false);
      setAdvisorForm(emptyAdvisorForm);
      setAdvisorSuccess("Tu es maintenant conseiller !");
      setTimeout(() => setAdvisorSuccess(""), 3000);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const handleStopAdvisor = async () => {
    setAdvisorError("");
    setAdvisorSuccess("");
    setAdvisorLoading(true);
    try {
      const ok = await updateUser({ isAdvisor: false, advisorProfile: null });
      if (!ok) {
        setAdvisorError("Impossible de retirer le statut conseiller. Reessaie.");
        return;
      }
      setAdvisorSuccess("Statut conseiller retire.");
      setTimeout(() => setAdvisorSuccess(""), 3000);
    } finally {
      setAdvisorLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all";

  return (
    <>
      <PageShell narrow>
        <PageHeader
          title="Mon profil"
          description="Gere ton compte et ton statut conseiller"
        />

        {advisorSuccess && (
          <div
            role="status"
            className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700"
          >
            {advisorSuccess}
          </div>
        )}
        {advisorError && !showAdvisorForm && (
          <div
            role="alert"
            className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
          >
            {advisorError}
          </div>
        )}

        <div className="card border border-[#dcdce5] p-8 mb-8">
          <div className="flex items-center gap-5 mb-8">
            <UserAvatar name={user.name} size={72} rounded="lg" />
            <div>
              <h2 className="text-xl font-bold text-[#121117]">{user.name}</h2>
              <p className="text-[#4d4c5c] mt-0.5">{user.email || user.phone}</p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                  user.role === "bachelier"
                    ? "bg-[#f4f4f8] text-[#4d4c5c]"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {user.role === "bachelier" ? "Nouveau bachelier" : "Etudiant"}
              </span>
            </div>
          </div>

          {user.role === "etudiant" && (
            <div className="border-t border-[#dcdce5] pt-7">
              <h3 className="font-semibold text-[#121117] mb-4 text-sm uppercase tracking-wide">
                Statut conseiller
              </h3>
              {user.isAdvisor && user.advisorProfile ? (
                <div className="bg-emerald-50/80 rounded-lg p-5 mb-4 border border-emerald-100">
                  <PushNotificationSetup enabled />
                  <p className="text-emerald-700 font-semibold mb-2">Conseiller actif</p>
                  <p className="text-sm text-[#4d4c5c]">
                    <strong>{user.advisorProfile.field}</strong> •{" "}
                    {user.advisorProfile.university} • {user.advisorProfile.year}
                  </p>
                  {user.advisorProfile.description && (
                    <p className="text-sm text-[#4d4c5c] mt-2 italic">
                      &quot;{user.advisorProfile.description}&quot;
                    </p>
                  )}
                  {user.advisorProfile.availableSlots?.length > 0 && (
                    <p className="text-sm text-[#4d4c5c] mt-2">
                      Creneaux : {user.advisorProfile.availableSlots.join(" · ")}
                    </p>
                  )}
                  {user.advisorProfile.meetLink && (
                    <p className="text-sm text-[#4d4c5c] mt-1">
                      Meet :{" "}
                      <a
                        href={user.advisorProfile.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-[#121117]"
                      >
                        {user.advisorProfile.meetLink}
                      </a>
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleStopAdvisor}
                    disabled={advisorLoading}
                    className="mt-4 text-sm text-red-500 hover:text-red-600 hover:underline transition-colors disabled:opacity-50"
                  >
                    {advisorLoading ? "Chargement..." : "Ne plus etre conseiller"}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[#4d4c5c] text-sm mb-5 leading-relaxed">
                    En tant qu&apos;etudiant, tu peux aider les bacheliers en devenant conseiller.
                    Tu pourras discuter avec eux et prendre des rendez-vous pour des appels Meet.
                  </p>
                  <button
                    type="button"
                    onClick={openAdvisorForm}
                    className="btn-primary"
                  >
                    Devenir conseiller
                  </button>
                </>
              )}
            </div>
          )}

          <MentorInbox isAdvisor={Boolean(user.isAdvisor)} />

          <div className="border-t border-[#dcdce5] pt-6 mt-7">
            <button
              type="button"
              onClick={async () => {
                await signOut({ redirect: false });
                router.push("/");
              }}
              className="text-[#6a697c] hover:text-red-500 text-sm font-medium transition-colors"
            >
              Se deconnecter
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
          <Link
            href="/assistant"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">IA</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-[#121117] transition-colors">
              Assistant IA
            </span>
          </Link>
          <Link
            href="/conseil"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">C</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-[#121117] transition-colors">
              Conseillers
            </span>
          </Link>
          <Link
            href="/forum"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">F</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-emerald-600 transition-colors">
              Forum
            </span>
          </Link>
          <Link
            href="/cv"
            className="flex-1 p-5 card hover:border-[#121117]/30 transition-all text-center group min-w-[140px]"
          >
            <span className="text-2xl block mb-2">CV</span>
            <span className="font-semibold text-[#4d4c5c] group-hover:text-[#121117] transition-colors">
              Generateur CV
            </span>
          </Link>
        </div>
      </PageShell>

      {showAdvisorForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-lg shadow-2xl shadow-[#121117]/10 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="h-1 bg-[#121117] rounded-t-2xl md:rounded-t-lg" />
            <div className="p-6 md:p-8 border-b border-[#dcdce5]">
              <h3 className="text-xl font-bold text-[#121117]">Devenir conseiller</h3>
              <p className="text-sm text-[#4d4c5c] mt-1">
                Ces infos seront visibles par les bacheliers sur la page Mentorat.
                {(user.field || user.university) && (
                  <> Filiere et universite pre-remplies depuis ton inscription.</>
                )}
              </p>
            </div>
            <form onSubmit={handleBecomeAdvisor} className="p-6 md:p-8 space-y-5">
              {advisorError && (
                <div
                  role="alert"
                  className="rounded border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
                >
                  {advisorError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Filiere <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={advisorForm.field}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, field: e.target.value })}
                  placeholder="Ex: Medecine, Droit, Informatique"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Universite <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={advisorForm.university}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, university: e.target.value })}
                  placeholder="Ex: UGANC, Gamal"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Annee <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={advisorForm.year}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, year: e.target.value })}
                  placeholder="Ex: 4eme annee"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Petite description de toi
                </label>
                <textarea
                  value={advisorForm.description}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, description: e.target.value })}
                  placeholder="Ex: Passionne par la medecine, j'aime partager mon experience..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Creneaux disponibles (un par ligne)
                </label>
                <textarea
                  value={advisorForm.availableSlotsText}
                  onChange={(e) =>
                    setAdvisorForm({ ...advisorForm, availableSlotsText: e.target.value })
                  }
                  placeholder={"Lundi 14h-16h\nMercredi 10h-12h"}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4d4c5c] mb-1.5">
                  Lien Meet (optionnel)
                </label>
                <input
                  type="url"
                  value={advisorForm.meetLink}
                  onChange={(e) => setAdvisorForm({ ...advisorForm, meetLink: e.target.value })}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvisorForm(false);
                    setAdvisorError("");
                  }}
                  disabled={advisorLoading}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={advisorLoading}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {advisorLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    "Devenir conseiller"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
