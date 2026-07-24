"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import EmptyState from "@/components/ui/EmptyState";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import UserAvatar from "@/components/UserAvatar";
import { inferGenderFromName } from "@/lib/avatars";

interface Advisor {
  id: string;
  name: string;
  field: string;
  university: string;
  year: string;
  description: string;
  meetLink?: string;
  availableSlots: string[];
}

export default function ConseilPage() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [searchField, setSearchField] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/mentors`);
        if (!res.ok) throw new Error("Impossible de charger les mentors");
        const data = (await res.json()) as Array<{
          id: string;
          name: string;
          field: string;
          university: string;
          year: string;
          description: string;
          meet_link?: string | null;
          available_slots: string[];
        }>;
        setAdvisors(
          data.map((m) => ({
            id: m.id,
            name: m.name,
            field: m.field,
            university: m.university,
            year: m.year,
            description: m.description,
            meetLink: m.meet_link ?? undefined,
            availableSlots: m.available_slots ?? [],
          }))
        );
      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Erreur de chargement");
        setAdvisors([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredAdvisors = advisors.filter(
    (a) =>
      a.field.toLowerCase().includes(searchField.toLowerCase()) ||
      a.name.toLowerCase().includes(searchField.toLowerCase())
  );

  const selectAdvisor = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setBookingConfirmed(false);
    setSelectedSlot("");
  };

  const confirmBooking = () => {
    if (selectedSlot && selectedAdvisor) {
      setBookingConfirmed(true);
      setShowBooking(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <PageHeader eyebrow="Mentorat" title="Mentorat & Conseil" />
        <div className="card p-10 text-center text-[#6a697c]">Chargement...</div>
      </PageShell>
    );
  }

  if (fetchError) {
    return (
      <PageShell>
        <PageHeader eyebrow="Mentorat" title="Mentorat & Conseil" />
        <EmptyState title="Erreur de chargement" description={fetchError} />
      </PageShell>
    );
  }

  if (advisors.length === 0) {
    return (
      <PageShell>
        <PageHeader
          eyebrow="Mentorat"
          title="Mentorat & Conseil"
          description="Discute avec un etudiant ou prends rendez-vous pour un appel video"
        />
        <EmptyState
          title="Aucun mentor disponible"
          description="Les mentors inscrits apparaitront ici. Reviens bientot ou inscris-toi pour devenir mentor."
        />
      </PageShell>
    );
  }

  return (
    <>
      <PageShell>
        <PageHeader
          eyebrow="Mentorat"
          title="Mentorat & Conseil"
          description="Consulte les profils mentors et reserve un creneau d'appel video"
        />

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 md:gap-7">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="card border border-[#dcdce5] overflow-hidden">
              <div className="p-4 md:p-5 border-b border-[#dcdce5]">
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a697c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-[#dcdce5] bg-white focus:border-[#121117] focus:ring-2 focus:ring-[#121117]/20 outline-none transition-all placeholder:text-[#6a697c]"
                  />
                </div>
              </div>
              <div className="divide-y divide-[#dcdce5]/80 max-h-[60vh] lg:max-h-[600px] overflow-y-auto">
                {filteredAdvisors.map((advisor) => (
                  <button
                    key={advisor.id}
                    onClick={() => selectAdvisor(advisor)}
                    className={`w-full p-3.5 md:p-4 flex items-center gap-3.5 hover:bg-[#f4f4f8]/40 transition-all duration-200 text-left ${
                      selectedAdvisor?.id === advisor.id ? "bg-[#f4f4f8] border-l-4 border-[#121117]" : ""
                    }`}
                  >
                    <UserAvatar name={advisor.name} gender={inferGenderFromName(advisor.name)} size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#121117] text-sm md:text-base truncate">{advisor.name}</p>
                      <p className="text-xs md:text-sm text-[#121117] font-medium truncate">{advisor.field}</p>
                      <p className="text-xs text-[#6a697c] truncate mt-0.5">
                        {advisor.university} • {advisor.year}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="card border border-[#dcdce5] p-6 md:p-8 min-h-[400px]">
              {selectedAdvisor ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <UserAvatar name={selectedAdvisor.name} gender={inferGenderFromName(selectedAdvisor.name)} size={64} />
                      <div>
                        <h3 className="font-bold text-[#121117] text-lg">{selectedAdvisor.name}</h3>
                        <p className="text-sm text-[#4d4c5c]">
                          {selectedAdvisor.field} • {selectedAdvisor.university} • {selectedAdvisor.year}
                        </p>
                      </div>
                    </div>
                    {selectedAdvisor.availableSlots.length > 0 && (
                      <button onClick={() => setShowBooking(true)} className="btn-primary shrink-0">
                        Prendre rendez-vous
                      </button>
                    )}
                  </div>

                  <p className="text-sm text-[#4d4c5c] leading-relaxed bg-[#f4f4f8] rounded-lg px-4 py-3 italic">
                    &quot;{selectedAdvisor.description}&quot;
                  </p>

                  {selectedAdvisor.meetLink && (
                    <p className="mt-4 text-sm text-[#4d4c5c]">
                      Lien Meet :{" "}
                      <a href={selectedAdvisor.meetLink} target="_blank" rel="noopener noreferrer" className="text-[#121117] underline">
                        {selectedAdvisor.meetLink}
                      </a>
                    </p>
                  )}

                  {bookingConfirmed && selectedSlot && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <p className="font-semibold text-emerald-800 text-sm">Rendez-vous reserve</p>
                      <p className="text-xs text-emerald-700 mt-1">
                        Creneau : {selectedSlot}
                        {selectedAdvisor.meetLink && (
                          <>
                            {" "}
                            •{" "}
                            <a href={selectedAdvisor.meetLink} target="_blank" rel="noopener noreferrer" className="underline">
                              Rejoindre l&apos;appel
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  )}

                  {selectedAdvisor.availableSlots.length === 0 && (
                    <p className="mt-4 text-sm text-[#6a697c]">Aucun creneau disponible pour le moment.</p>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <h3 className="text-lg font-bold text-[#121117] mb-2">Choisis un mentor</h3>
                  <p className="text-sm text-[#4d4c5c] max-w-sm">
                    Selectionne un etudiant dans la liste pour voir son profil et reserver un creneau.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageShell>

      {showBooking && selectedAdvisor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="h-1 bg-[#121117] rounded-t-2xl" />
            <div className="p-5 md:p-6 border-b border-[#dcdce5]">
              <h3 className="text-lg font-bold text-[#121117]">Prendre rendez-vous</h3>
              <p className="text-sm text-[#4d4c5c] mt-1">avec {selectedAdvisor.name}</p>
            </div>
            <div className="p-5 md:p-6">
              <div className="space-y-2.5">
                {selectedAdvisor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                      selectedSlot === slot
                        ? "border-[#121117] bg-[#f4f4f8]"
                        : "border-[#dcdce5] text-[#4d4c5c] hover:border-[#121117]/30"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-7 pt-6 border-t border-[#dcdce5]">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#dcdce5] text-[#4d4c5c] font-medium hover:bg-[#f4f4f8]"
                >
                  Annuler
                </button>
                <button onClick={confirmBooking} disabled={!selectedSlot} className="btn-primary">
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
