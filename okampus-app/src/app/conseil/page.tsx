"use client";

import { useState } from "react";

interface Advisor {
  id: string;
  name: string;
  field: string;
  university: string;
  year: string;
  initials: string;
  online: boolean;
  description: string;
  meetLink: string;
  availableSlots: string[];
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "advisor";
  timestamp: Date;
}

const advisors: Advisor[] = [
  {
    id: "1",
    name: "Aissatou Diallo",
    field: "Médecine",
    university: "UGANC",
    year: "4ème année",
    initials: "AD",
    online: true,
    description: "Passionnée par la médecine, j'aime partager mon expérience avec les futurs étudiants. La 1ère année est intense mais faisable !",
    meetLink: "https://meet.google.com/abc-defg-hij",
    availableSlots: ["Lundi 14h-16h", "Mercredi 10h-12h", "Vendredi 15h-17h"],
  },
  {
    id: "2",
    name: "Mamadou Bah",
    field: "Droit",
    university: "UGANC",
    year: "3ème année",
    initials: "MB",
    online: true,
    description: "Étudiant en droit, je peux t'éclairer sur les débouchés et le quotidien de la fac. N'hésite pas !",
    meetLink: "https://meet.google.com/xyz-uvwx-rst",
    availableSlots: ["Mardi 9h-11h", "Jeudi 14h-16h"],
  },
  {
    id: "3",
    name: "Fatoumata Camara",
    field: "Informatique",
    university: "UGANC",
    year: "5ème année",
    initials: "FC",
    online: true,
    description: "Développeuse en devenir. L'informatique en Guinée offre de belles opportunités. Viens me poser tes questions !",
    meetLink: "https://meet.google.com/dev-meet-123",
    availableSlots: ["Lundi 16h-18h", "Mercredi 14h-16h", "Samedi 10h-12h"],
  },
  {
    id: "4",
    name: "Ibrahima Sow",
    field: "Génie Civil",
    university: "UGANC",
    year: "4ème année",
    initials: "IS",
    online: false,
    description: "Le génie civil est un secteur en plein essor en Guinée. Je peux te parler des stages et des projets concrets.",
    meetLink: "https://meet.google.com/genie-civil-45",
    availableSlots: ["Mardi 14h-16h", "Vendredi 10h-12h"],
  },
  {
    id: "5",
    name: "Mariama Barry",
    field: "Commerce",
    university: "UGANC",
    year: "3ème année",
    initials: "MB",
    online: true,
    description: "Commerce et gestion : une filière polyvalente. Je partage mon parcours et les opportunités que j'ai découvertes.",
    meetLink: "https://meet.google.com/commerce-789",
    availableSlots: ["Mercredi 9h-11h", "Jeudi 15h-17h"],
  },
  {
    id: "6",
    name: "Ousmane Keita",
    field: "Sciences Économiques",
    university: "UGANC",
    year: "2ème année",
    initials: "OK",
    online: true,
    description: "Économie et développement : des sujets passionnants. Je peux t'aider à y voir plus clair pour ton orientation.",
    meetLink: "https://meet.google.com/eco-meet-101",
    availableSlots: ["Lundi 10h-12h", "Vendredi 14h-16h"],
  },
];

export default function ConseilPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [searchField, setSearchField] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredAdvisors = advisors.filter(
    (a) =>
      a.field.toLowerCase().includes(searchField.toLowerCase()) ||
      a.name.toLowerCase().includes(searchField.toLowerCase())
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedAdvisor) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    setTimeout(() => {
      const responses = [
        "Excellente question ! En médecine, la première année est très exigeante. Je te conseille de bien t'organiser dès le début et de ne pas hésiter à former des groupes d'étude.",
        "C'est un parcours passionnant. Les débouchés sont nombreux, notamment dans les hôpitaux, la recherche, et même l'humanitaire.",
        "N'hésite pas si tu as d'autres questions. Je suis là pour t'aider dans ton orientation !",
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "advisor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 800 + Math.random() * 1500);
  };

  const startChat = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setBookingConfirmed(false);
    setMessages([
      {
        id: "0",
        text: `Bonjour ! Je suis ${advisor.name}, étudiant(e) en ${advisor.field} à ${advisor.university}. ${advisor.description} Comment puis-je t'aider ?`,
        sender: "advisor",
        timestamp: new Date(),
      },
    ]);
  };

  const confirmBooking = () => {
    if (selectedSlot && selectedAdvisor) {
      setBookingConfirmed(true);
      setShowBooking(false);
      setSelectedSlot("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14">
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c41e3a] to-[#9e1830] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                Mentorat & Conseil
              </h1>
            </div>
          </div>
          <p className="text-slate-500 text-sm md:text-base ml-[52px]">
            Discute avec un étudiant ou prends rendez-vous pour un appel vidéo
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 md:gap-7">
          {/* Liste des conseillers - Mobile: collapsible, Desktop: sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="card bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
              <div className="p-4 md:p-5 border-b border-slate-100">
                <div className="relative">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-200 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="divide-y divide-slate-100/80 max-h-[60vh] lg:max-h-[600px] overflow-y-auto">
                {filteredAdvisors.map((advisor) => (
                  <button
                    key={advisor.id}
                    onClick={() => startChat(advisor)}
                    className={`w-full p-3.5 md:p-4 flex items-center gap-3.5 hover:bg-red-50/40 transition-all duration-200 text-left ${
                      selectedAdvisor?.id === advisor.id ? "bg-red-50 border-l-4 border-[#c41e3a]" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#9e1830] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                        {advisor.initials}
                      </div>
                      {advisor.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm md:text-base truncate">
                        {advisor.name}
                      </p>
                      <p className="text-xs md:text-sm text-[#c41e3a] font-medium truncate">
                        {advisor.field}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {advisor.university} • {advisor.year}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="card bg-white rounded-2xl shadow-sm border border-slate-200/80 flex flex-col h-[calc(100vh-250px)] md:h-[600px]">
              {selectedAdvisor ? (
                <>
                  <div className="p-4 md:p-5 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <div className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#c41e3a] to-[#9e1830] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {selectedAdvisor.initials}
                          </div>
                          {selectedAdvisor.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">
                            {selectedAdvisor.name}
                          </h3>
                          <p className="text-xs md:text-sm text-slate-500 truncate">
                            {selectedAdvisor.field} • {selectedAdvisor.university}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBooking(true)}
                        className="btn-primary px-4 md:px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-xl text-xs md:text-sm font-semibold hover:from-emerald-700 hover:to-emerald-600 transition-all shadow-sm hover:shadow-md flex-shrink-0"
                      >
                        Rendez-vous
                      </button>
                    </div>

                    {selectedAdvisor.description && (
                      <p className="text-xs md:text-sm text-slate-500 mt-3.5 italic leading-relaxed bg-slate-50/80 rounded-xl px-4 py-3">
                        &quot;{selectedAdvisor.description}&quot;
                      </p>
                    )}

                    {bookingConfirmed && (
                      <div className="mt-3.5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-semibold text-emerald-800 text-sm">Rendez-vous confirmé</p>
                        </div>
                        <p className="text-xs text-emerald-700 mt-1.5 ml-6">
                          Créneau : {selectedSlot} •{" "}
                          <a
                            href={selectedAdvisor.meetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium hover:text-emerald-900 transition-colors"
                          >
                            Rejoindre l&apos;appel
                          </a>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-50/80 to-slate-50">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[72%] rounded-2xl px-4 py-3 ${
                            msg.sender === "user"
                              ? "bg-[#c41e3a] text-white shadow-sm"
                              : "bg-white border border-slate-200/80 text-slate-800 shadow-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                          <p className={`text-xs mt-1.5 ${msg.sender === "user" ? "text-red-200" : "text-slate-400"}`}>
                            {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-3.5 md:p-4 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ecris ton message..."
                        className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:border-[#c41e3a] focus:ring-2 focus:ring-red-200 outline-none transition-all placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim()}
                        className="btn-primary px-5 md:px-6 py-2.5 bg-gradient-to-r from-[#c41e3a] to-[#9e1830] text-white rounded-xl font-semibold text-sm hover:from-[#9e1830] hover:to-[#c41e3a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                      >
                        Envoyer
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-100 flex items-center justify-center mb-5">
                    <svg className="w-9 h-9 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Choisis un conseiller
                  </h3>
                  <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                    Sélectionne un étudiant dans la liste pour commencer une conversation ou prendre rendez-vous.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Rendez-vous */}
      {showBooking && selectedAdvisor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Accent bar at top */}
            <div className="h-1 bg-gradient-to-r from-[#c41e3a] via-[#f4c430] to-[#008751] rounded-t-2xl" />
            <div className="sticky top-0 bg-white border-b border-slate-100 p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">
                    Prendre rendez-vous
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    avec {selectedAdvisor.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowBooking(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <p className="text-sm text-slate-500 mb-5">
                Choisis un créneau pour un appel vidéo. Le lien Meet te sera communiqué après confirmation.
              </p>
              <div className="space-y-2.5">
                {selectedAdvisor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                      selectedSlot === slot
                        ? "border-[#c41e3a] bg-red-50 text-[#9e1830] shadow-sm"
                        : "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedSlot === slot ? "border-[#c41e3a] bg-[#c41e3a]" : "border-slate-300"
                      }`}>
                        {selectedSlot === slot && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      {slot}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-7 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setShowBooking(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={!selectedSlot}
                  className="btn-primary flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-semibold hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
