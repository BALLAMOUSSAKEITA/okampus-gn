"use client";

import { useState } from "react";

interface Advisor {
  id: string;
  name: string;
  field: string;
  university: string;
  year: string;
  avatar: string;
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
    avatar: "👩‍⚕️",
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
    avatar: "👨‍⚖️",
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
    avatar: "👩‍💻",
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
    avatar: "👷",
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
    avatar: "👩‍💼",
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
    avatar: "👨‍🎓",
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
        "Excellente question ! En médecine, la première année est très exigeante. Je te conseille de bien t'organiser...",
        "C'est un parcours passionnant. Les débouchés sont nombreux, notamment dans les hôpitaux et la recherche.",
        "N'hésite pas si tu as d'autres questions. Je suis là pour t'aider !",
      ];
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: "advisor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000 + Math.random() * 2000);
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Conseil & Orientation
          </h1>
          <p className="text-gray-600">
            Choisissez un conseiller, discutez en chat ou prenez rendez-vous pour un appel Meet
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Liste des conseillers */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
            <div className="p-4 border-b border-amber-100">
              <input
                type="text"
                placeholder="Rechercher une filière..."
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-amber-200 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
              />
            </div>
            <div className="divide-y divide-amber-50 max-h-[500px] overflow-y-auto">
              {filteredAdvisors.map((advisor) => (
                <button
                  key={advisor.id}
                  onClick={() => startChat(advisor)}
                  className={`w-full p-4 flex items-center gap-4 hover:bg-amber-50 transition-colors text-left ${
                    selectedAdvisor?.id === advisor.id ? "bg-amber-50 border-l-4 border-[#c41e3a]" : ""
                  }`}
                >
                  <span className="text-2xl">{advisor.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{advisor.name}</p>
                    <p className="text-sm text-gray-600 truncate">{advisor.field} • {advisor.university}</p>
                  </div>
                  {advisor.online && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" title="En ligne" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden flex flex-col min-h-[500px]">
            {selectedAdvisor ? (
              <>
                <div className="p-4 border-b border-amber-100 bg-amber-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{selectedAdvisor.avatar}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedAdvisor.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedAdvisor.field} • {selectedAdvisor.university} • {selectedAdvisor.year}
                        </p>
                        {selectedAdvisor.description && (
                          <p className="text-sm text-gray-500 mt-1 italic max-w-md">
                            &quot;{selectedAdvisor.description}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedAdvisor.online && (
                        <span className="flex items-center gap-1 text-sm text-emerald-600">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          En ligne
                        </span>
                      )}
                      <button
                        onClick={() => setShowBooking(true)}
                        className="px-3 py-1.5 bg-[#008751] text-white rounded-lg text-sm font-medium hover:bg-[#00a86b] flex items-center gap-1"
                      >
                        📅 Rendez-vous Meet
                      </button>
                    </div>
                  </div>
                </div>

                {bookingConfirmed && selectedAdvisor && (
                  <div className="mx-4 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="font-semibold text-emerald-800">✓ Rendez-vous confirmé !</p>
                    <p className="text-sm text-emerald-700 mt-1">
                      Créneau : {selectedSlot} • Rejoins l&apos;appel :{" "}
                      <a
                        href={selectedAdvisor.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-medium"
                      >
                        Lien Meet
                      </a>
                    </p>
                  </div>
                )}

                <div className="flex-1 p-4 overflow-y-auto space-y-4 min-h-[300px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-[#c41e3a] text-white rounded-br-md"
                            : "bg-amber-100 text-gray-900 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/80" : "text-gray-500"}`}>
                          {msg.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-amber-100">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Écrivez votre message..."
                      className="flex-1 px-4 py-3 rounded-xl border border-amber-200 focus:border-[#c41e3a] focus:ring-2 focus:ring-[#c41e3a]/20 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="px-6 py-3 bg-[#c41e3a] text-white rounded-xl font-semibold hover:bg-[#9e1830] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Envoyer
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <span className="text-6xl mb-4">💬</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Choisissez un conseiller
                </h3>
                <p className="text-gray-600 max-w-md">
                  Sélectionnez un étudiant dans la liste à gauche pour commencer une conversation, 
                  voir sa description ou prendre rendez-vous pour un appel Meet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Rendez-vous */}
      {showBooking && selectedAdvisor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Prendre rendez-vous avec {selectedAdvisor.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez un créneau pour un appel Meet. Le lien vous sera envoyé après confirmation.
            </p>
            <div className="space-y-2 mb-6">
              {selectedAdvisor.availableSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedSlot === slot
                      ? "border-[#008751] bg-emerald-50 text-[#008751]"
                      : "border-amber-200 hover:border-amber-300"
                  }`}
                >
                  📅 {slot}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBooking(false)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmBooking}
                disabled={!selectedSlot}
                className="flex-1 px-4 py-2 rounded-xl bg-[#008751] text-white font-semibold hover:bg-[#00a86b] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
