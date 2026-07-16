"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Plus,
  X,
  CheckCircle2,
  ChevronRight,
  Send,
  AlertTriangle,
  Wrench,
  Receipt,
  Lightbulb,
  Upload,
  Trash2,
  MessageSquare,
} from "lucide-react";

interface SupportTicket {
  id: string;
  type: "queja" | "soporte" | "facturacion" | "sugerencia";
  subject: string;
  description: string;
  videoUrl?: string;
  expectedBehavior?: string;
  status: "abierto" | "en_revision" | "resuelto";
  createdAt: string;
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const TICKET_TYPES: {
  id: SupportTicket["type"];
  label: string;
  icon: React.ElementType;
  iconColor: string;
  badgeClass: string;
  description: string;
}[] = [
  {
    id: "queja",
    label: "Queja",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    badgeClass: "text-red-700 bg-red-50 border-red-200",
    description: "Reportar un problema grave o mala experiencia",
  },
  {
    id: "soporte",
    label: "Soporte Técnico",
    icon: Wrench,
    iconColor: "text-blue-500",
    badgeClass: "text-blue-700 bg-blue-50 border-blue-200",
    description: "Ayuda con el funcionamiento de la plataforma",
  },
  {
    id: "facturacion",
    label: "Facturación",
    icon: Receipt,
    iconColor: "text-amber-500",
    badgeClass: "text-amber-700 bg-amber-50 border-amber-200",
    description: "Preguntas sobre pagos, invoices o cobros",
  },
  {
    id: "sugerencia",
    label: "Sugerencia",
    icon: Lightbulb,
    iconColor: "text-emerald-500",
    badgeClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    description: "Proponer mejoras o nuevas funcionalidades",
  },
];

const STATUS_CONFIG = {
  abierto: {
    label: "Abierto",
    textColor: "#B91C1C",
    bgColor: "#FEE2E2",
    dot: "bg-red-500 animate-pulse",
  },
  en_revision: {
    label: "En revisión",
    textColor: "#111113",
    bgColor: "rgba(254,88,82,0.08)",
    dot: "bg-amber-500",
  },
  resuelto: {
    label: "Resuelto",
    textColor: "#111113",
    bgColor: "rgba(86,223,224,0.12)",
    dot: "bg-emerald-500",
  },
};

/* ─── Nexi Proactive Panel ─── */

function NexiProactivePanel({
  userEmail,
  onCreateTicket,
}: {
  userEmail: string;
  onCreateTicket: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "¡Hola! 👀 Vi que el link de pago FAC-401 falló. Ya lo regeneré y lo probé: funciona. ¿Quieres que se lo reenvíe a la Dra. Ortega por WhatsApp?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [proactiveResolved, setProactiveResolved] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Tuve un error. ¿Reintentamos? Si el problema persiste, crea un ticket en Soporte." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setProactiveResolved(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "model",
        text: "¡Listo! 🎉 Ya reenvié el link de pago FAC-401 a la Dra. Ortega por WhatsApp. El ticket TK-2041 se cerrará automáticamente. ¿Necesitas algo más?",
      },
    ]);
  };

  const handlePreferTicket = () => {
    setMessages((prev) => [
      ...prev,
      { role: "model", text: "Entendido. Voy a mantener el ticket TK-2041 abierto para que el equipo lo revise. También puedes crear un ticket nuevo si lo prefieres." },
    ]);
    onCreateTicket();
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #E8E8EA",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#111113",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: "11px",
          color: "#fff",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8 M4 8h16v12H4z M2 14h2 M20 14h2 M15 13v2 M9 13v2" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13px", fontWeight: 800 }}>Nexi</div>
          <div style={{ fontSize: "10px", color: "#A1A1AA", fontWeight: 600 }}>
            Se adelantó a tu problema
          </div>
        </div>
        <span
          style={{
            fontSize: "8.5px",
            fontWeight: 800,
            letterSpacing: "1px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "999px",
            padding: "3px 9px",
          }}
        >
          PROACTIVO
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          background: "#FCFCFD",
          minHeight: "180px",
          maxHeight: "280px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => {
          const isModel = msg.role === "model";
          const isFirst = i === 0;
          return (
            <div
              key={i}
              style={{
                alignSelf: isModel ? "flex-start" : "flex-end",
                maxWidth: "92%",
                background: isModel ? "#fff" : "#111113",
                color: isModel ? "#27272A" : "#fff",
                border: isModel ? "1px solid #EAEAEC" : "none",
                borderRadius: isModel ? "3px 13px 13px 13px" : "13px 13px 3px 13px",
                padding: "10px 13px",
                fontSize: "12px",
                lineHeight: 1.55,
              }}
            >
              {msg.text}
            </div>
          );
        })}

        {isLoading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#fff",
              border: "1px solid #EAEAEC",
              borderRadius: "3px 13px 13px 13px",
              padding: "10px 13px",
              fontSize: "12px",
              color: "#A1A1AA",
            }}
          >
            Escribiendo...
          </div>
        )}

        {/* Proactive action buttons — only on first render before interaction */}
        {!proactiveResolved && messages.length === 1 && (
          <>
            <div style={{ display: "flex", gap: "6px", alignSelf: "flex-start" }}>
              <button
                onClick={handleResend}
                style={{
                  background: "#111113",
                  color: "#fff",
                  border: "none",
                  borderRadius: "9px",
                  padding: "8px 13px",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                Sí, reenvíalo
              </button>
              <button
                onClick={handlePreferTicket}
                style={{
                  background: "#fff",
                  color: "#52525B",
                  border: "1px solid #E8E8EA",
                  borderRadius: "9px",
                  padding: "8px 13px",
                  fontSize: "11px",
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                Prefiero el ticket
              </button>
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                fontSize: "9px",
                color: "#A1A1AA",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Si Nexi lo resuelve, el ticket TK-2041 se cierra solo
            </div>
          </>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #F0F0F2",
          display: "flex",
          gap: "8px",
          background: "#fff",
        }}
      >
        <input
          placeholder="Cuéntale tu problema a Nexi..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{
            flex: 1,
            border: "1px solid #E8E8EA",
            borderRadius: "10px",
            padding: "10px 13px",
            fontSize: "12px",
            fontFamily: "'Inter', sans-serif",
            outline: "none",
            background: "#FAFAFA",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#111113",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            opacity: !input.trim() || isLoading ? 0.5 : 1,
          }}
        >
          <Send className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */

function StatCard({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: number;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E8E8EA",
        borderRadius: "12px",
        padding: "12px 14px",
      }}
    >
      <div
        style={{
          fontSize: "9.5px",
          fontWeight: 800,
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "#71717A",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: valueColor || "#111113",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function SupportPage() {
  const { user } = useAuth();
  const userEmail = user?.email || "partner@nexor.ai";

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<SupportTicket["type"] | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");
  const [showTicketList, setShowTicketList] = useState(true);

  const resetForm = () => {
    setStep(1);
    setSelectedType(null);
    setSubject("");
    setDescription("");
    setVideoUrl("");
    setExpectedBehavior("");
    setShowForm(false);
    setSuccessTicketId(null);
    setShowTicketList(true);
  };

  const handleSubmit = () => {
    if (!selectedType || !subject.trim() || !description.trim()) return;
    if (selectedType === "queja" && !videoUrl.trim()) return;

    const newTicket: SupportTicket = {
      id: "TK-" + Math.floor(1000 + Math.random() * 9000),
      type: selectedType,
      subject: subject.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim() || undefined,
      expectedBehavior: expectedBehavior.trim() || undefined,
      status: "abierto",
      createdAt: new Date().toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSuccessTicketId(newTicket.id);
    setShowForm(false);
    setShowTicketList(false);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const typeInfo = (type: SupportTicket["type"]) =>
    TICKET_TYPES.find((t) => t.id === type)!;

  const openTickets = tickets.filter((t) => t.status === "abierto").length;
  const reviewTickets = tickets.filter((t) => t.status === "en_revision").length;
  const resolvedTickets = tickets.filter((t) => t.status === "resuelto").length;

  /* ─── Demo tickets ─── */
  const demoTickets: SupportTicket[] = [
    {
      id: "TK-2041",
      type: "facturacion",
      subject: "El link de pago de FAC-401 devuelve error 404",
      description: "",
      status: "abierto",
      createdAt: "hace 3 h",
    },
    {
      id: "TK-2038",
      type: "soporte",
      subject: "Demo de DentalEstetik no muestra los tratamientos cargados",
      description: "",
      status: "en_revision",
      createdAt: "ayer",
    },
    {
      id: "TK-2019",
      type: "soporte",
      subject: "No llegaban notificaciones de leads nuevos",
      description: "",
      status: "resuelto",
      createdAt: "8 jul",
    },
  ];

  const displayTickets =
    tickets.length > 0 ? tickets : showTicketList ? demoTickets : [];

  const ticketTypeIconEl: Record<SupportTicket["type"], React.ReactNode> = {
    queja: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 8v4 M12 16h.01" />
      </svg>
    ),
    soporte: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fe5852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6v6l4 2" />
      </svg>
    ),
    facturacion: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 8v4 M12 16h.01" />
      </svg>
    ),
    sugerencia: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#56dfe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />
      </svg>
    ),
  };

  const ticketTypeLabel: Record<SupportTicket["type"], string> = {
    queja: "Queja",
    soporte: "Soporte técnico",
    facturacion: "Facturación",
    sugerencia: "Sugerencia",
  };

  const resolvedIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#56dfe0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4L12 14.01l-3-3" />
    </svg>
  );

  return (
    <div
      style={{
        padding: "18px 20px",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "16px",
        alignItems: "start",
        fontFamily: "'Inter', sans-serif",
        color: "#111113",
      }}
    >
      {/* ── LEFT COLUMN ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
          <StatCard label="Abiertos" value={openTickets || 1} />
          <StatCard label="En revisión" value={reviewTickets || 1} />
          <StatCard label="Resueltos" value={resolvedTickets || 4} valueColor="#56dfe0" />
        </div>

        {/* Tickets card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E8E8EA",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid #F0F0F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 800 }}>Mis tickets</span>
            {!showForm && !successTicketId && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "#111113",
                  color: "#fff",
                  border: "none",
                  borderRadius: "9px",
                  padding: "8px 13px",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                <Plus className="h-3 w-3" />
                Nuevo ticket
              </button>
            )}
          </div>

          {/* SUCCESS STATE */}
          {successTicketId && (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <div
                style={{
                  height: "48px",
                  width: "48px",
                  borderRadius: "50%",
                  background: "rgba(86,223,224,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#111113", marginBottom: "6px" }}>
                ¡Ticket {successTicketId} creado!
              </h3>
              <p
                style={{
                  fontSize: "11px",
                  color: "#56dfe0",
                  maxWidth: "300px",
                  margin: "0 auto 16px",
                  lineHeight: 1.5,
                }}
              >
                El equipo de Nexor se pondrá en contacto contigo a través de{" "}
                <strong>{userEmail}</strong> en las próximas 24 horas hábiles.
              </p>
              <button
                onClick={resetForm}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#56dfe0",
                  color: "#fff",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                Ver mis tickets
              </button>
            </div>
          )}

          {/* CREATE TICKET FORM */}
          {showForm && !successTicketId && (
            <div>
              {/* Progress */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                  borderBottom: "1px solid #F0F0F2",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    style={{
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      background: step >= 1 ? "#111113" : "#F0F0F2",
                      color: step >= 1 ? "#fff" : "#A1A1AA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 800,
                    }}
                  >
                    {step > 1 ? "✓" : "1"}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717A" }}>Tipo</span>
                  <ChevronRight className="h-3.5 w-3.5 text-[#D4D4D8]" />
                  <span
                    style={{
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      background: step === 2 ? "#111113" : "#F0F0F2",
                      color: step === 2 ? "#fff" : "#A1A1AA",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 800,
                    }}
                  >
                    2
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#71717A" }}>Detalle</span>
                </div>
                <button
                  onClick={resetForm}
                  style={{
                    padding: "6px",
                    borderRadius: "8px",
                    border: "none",
                    background: "transparent",
                    color: "#A1A1AA",
                    cursor: "pointer",
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div style={{ padding: "18px" }}>
                {/* STEP 1 */}
                {step === 1 && (
                  <div>
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "#A1A1AA",
                        marginBottom: "12px",
                      }}
                    >
                      ¿Qué tipo de solicitud es?
                    </p>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        marginBottom: "16px",
                      }}
                    >
                      {TICKET_TYPES.map((t) => {
                        const Icon = t.icon;
                        const isSelected = selectedType === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setSelectedType(t.id)}
                            style={{
                              padding: "12px",
                              borderRadius: "14px",
                              border: isSelected ? "2px solid #111113" : "1px solid #E8E8EA",
                              background: isSelected ? "#111113" : "#fff",
                              color: isSelected ? "#fff" : "#3F3F46",
                              textAlign: "left",
                              cursor: "pointer",
                              fontFamily: "'Inter', sans-serif",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              <Icon className={`h-4 w-4 ${isSelected ? "text-white" : t.iconColor}`} />
                              <span style={{ fontSize: "11px", fontWeight: 800 }}>{t.label}</span>
                            </div>
                            <p
                              style={{
                                fontSize: "10px",
                                color: isSelected ? "#A1A1AA" : "#71717A",
                                margin: 0,
                              }}
                            >
                              {t.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        disabled={!selectedType}
                        onClick={() => setStep(2)}
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          background: "#111113",
                          color: "#fff",
                          border: "none",
                          fontSize: "11px",
                          fontWeight: 800,
                          fontFamily: "'Inter', sans-serif",
                          cursor: selectedType ? "pointer" : "not-allowed",
                          opacity: selectedType ? 1 : 0.4,
                        }}
                      >
                        Continuar &rarr;
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 */}
                {step === 2 && selectedType && (
                  <div>
                    {(() => {
                      const t = typeInfo(selectedType);
                      const Icon = t.icon;
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "16px",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 12px",
                              borderRadius: "999px",
                              border: `1px solid ${selectedType === "queja" ? "#FECACA" : selectedType === "facturacion" ? "#E8E8EA" : selectedType === "sugerencia" ? "rgba(86,223,224,0.20)" : "#BFDBFE"}`,
                              background: selectedType === "queja" ? "#FEF2F2" : selectedType === "facturacion" ? "rgba(254,88,82,0.06)" : selectedType === "sugerencia" ? "rgba(86,223,224,0.06)" : "#EFF6FF",
                              color: selectedType === "queja" ? "#B91C1C" : selectedType === "facturacion" ? "#111113" : selectedType === "sugerencia" ? "#111113" : "#1E40AF",
                              fontSize: "10px",
                              fontWeight: 800,
                            }}
                          >
                            <Icon className="h-3 w-3" />
                            {t.label}
                          </span>
                          <button
                            onClick={() => setStep(1)}
                            style={{
                              fontSize: "10px",
                              color: "#A1A1AA",
                              background: "none",
                              border: "none",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            Cambiar
                          </button>
                        </div>
                      );
                    })()}

                    <div style={{ marginBottom: "14px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "10px",
                          fontWeight: 800,
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          color: "#71717A",
                          marginBottom: "6px",
                        }}
                      >
                        Asunto *
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={
                          selectedType === "queja"
                            ? "Ej. El simulador de ventas no funciona correctamente"
                            : selectedType === "sugerencia"
                            ? "Ej. Agregar exportación de clientes a CSV"
                            : "Ej. Mi factura INV-123456 no se generó correctamente"
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          borderRadius: "12px",
                          border: "1px solid #E8E8EA",
                          padding: "10px 14px",
                          fontSize: "12px",
                          fontFamily: "'Inter', sans-serif",
                          outline: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: "14px" }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "10px",
                          fontWeight: 800,
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                          color: "#71717A",
                          marginBottom: "6px",
                        }}
                      >
                        Descripción detallada *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder={
                          selectedType === "queja"
                            ? "Describe con el máximo detalle qué ocurrió, cuándo y el impacto que tuvo..."
                            : selectedType === "sugerencia"
                            ? "Describe la mejora y por qué crees que sería útil para el equipo..."
                            : "Explica el problema o consulta con el mayor detalle posible..."
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          borderRadius: "12px",
                          border: "1px solid #E8E8EA",
                          padding: "10px 14px",
                          fontSize: "12px",
                          fontFamily: "'Inter', sans-serif",
                          outline: "none",
                          resize: "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>

                    {selectedType === "queja" && (
                      <>
                        <div
                          style={{
                            marginBottom: "14px",
                            padding: "14px",
                            background: "#FEF2F2",
                            borderRadius: "14px",
                            border: "1px solid #FECACA",
                          }}
                        >
                          <label
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              fontSize: "10px",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              color: "#DC2626",
                              marginBottom: "8px",
                            }}
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Evidencia en video * (obligatorio para quejas)
                          </label>
                          <input
                            type="url"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="https://drive.google.com/... · https://loom.com/... · https://youtu.be/..."
                            style={{
                              display: "block",
                              width: "100%",
                              borderRadius: "12px",
                              border: "1px solid #FECACA",
                              padding: "10px 14px",
                              fontSize: "12px",
                              fontFamily: "'Inter', sans-serif",
                              outline: "none",
                              boxSizing: "border-box",
                            }}
                          />
                          <p style={{ fontSize: "10px", color: "#EF4444", margin: "6px 0 0" }}>
                            Sube un video que muestre el problema y pega aquí el enlace.
                          </p>
                        </div>

                        <div style={{ marginBottom: "14px" }}>
                          <label
                            style={{
                              display: "block",
                              fontSize: "10px",
                              fontWeight: 800,
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              color: "#71717A",
                              marginBottom: "6px",
                            }}
                          >
                            ¿Qué comportamiento esperabas?
                          </label>
                          <textarea
                            value={expectedBehavior}
                            onChange={(e) => setExpectedBehavior(e.target.value)}
                            rows={2}
                            placeholder="Describe qué debería haber ocurrido en lugar de lo que pasó..."
                            style={{
                              display: "block",
                              width: "100%",
                              borderRadius: "12px",
                              border: "1px solid #E8E8EA",
                              padding: "10px 14px",
                              fontSize: "12px",
                              fontFamily: "'Inter', sans-serif",
                              outline: "none",
                              resize: "none",
                              boxSizing: "border-box",
                            }}
                          />
                        </div>
                      </>
                    )}

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "14px",
                        borderTop: "1px solid #F0F0F2",
                      }}
                    >
                      <button
                        onClick={() => setStep(1)}
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#A1A1AA",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        &larr; Atrás
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={
                          !subject.trim() ||
                          !description.trim() ||
                          (selectedType === "queja" && !videoUrl.trim())
                        }
                        style={{
                          padding: "10px 20px",
                          borderRadius: "10px",
                          background: "#111113",
                          color: "#fff",
                          border: "none",
                          fontSize: "11px",
                          fontWeight: 800,
                          fontFamily: "'Inter', sans-serif",
                          cursor: !subject.trim() || !description.trim() ? "not-allowed" : "pointer",
                          opacity: !subject.trim() || !description.trim() || (selectedType === "queja" && !videoUrl.trim()) ? 0.4 : 1,
                        }}
                      >
                        Enviar ticket
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TICKET LIST (demo or real) */}
          {!showForm && !successTicketId && displayTickets.length > 0 && (
            <div>
              {displayTickets.map((ticket, i) => {
                const status = STATUS_CONFIG[ticket.status];
                const isResolved = ticket.status === "resuelto";
                return (
                  <div
                    key={ticket.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "13px 18px",
                      borderBottom: i < displayTickets.length - 1 ? "1px solid #F6F6F7" : "none",
                      cursor: "pointer",
                      opacity: isResolved ? 0.65 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        background: isResolved
                          ? "rgba(86,223,224,0.06)"
                          : ticket.type === "facturacion" || ticket.type === "queja"
                          ? "#FEF2F2"
                          : "rgba(254,88,82,0.06)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isResolved
                        ? resolvedIcon
                        : ticketTypeIconEl[ticket.type]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#111113" }}>
                        {ticket.subject}
                      </div>
                      <div style={{ fontSize: "10px", color: "#71717A", marginTop: "2px" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ticket.id}</span>
                        {" · "}
                        {ticketTypeLabel[ticket.type]}
                        {" · "}
                        {ticket.createdAt}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 800,
                        color: status.textColor,
                        background: status.bgColor,
                        borderRadius: "999px",
                        padding: "3px 10px",
                        flexShrink: 0,
                      }}
                    >
                      {ticket.status === "abierto"
                        ? "Abierto · Alta"
                        : status.label}
                    </span>
                    {/* Delete button for user-created tickets */}
                    {!demoTickets.some((d) => d.id === ticket.id) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTicket(ticket.id);
                        }}
                        style={{
                          padding: "4px",
                          borderRadius: "6px",
                          border: "none",
                          background: "transparent",
                          color: "#D4D4D8",
                          cursor: "pointer",
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* EMPTY STATE — only show when no demos and no real tickets */}
          {!showForm && !successTicketId && tickets.length === 0 && !showTicketList && (
            <div style={{ padding: "48px 24px", textAlign: "center" }}>
              <div
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  background: "#F6F6F7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px",
                }}
              >
                <MessageSquare className="h-5 w-5 text-[#D4D4D8]" />
              </div>
              <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#111113", marginBottom: "4px" }}>
                Sin tickets abiertos
              </h3>
              <p style={{ fontSize: "11px", color: "#A1A1AA", maxWidth: "280px", margin: "0 auto 16px" }}>
                ¿Tienes algún problema o sugerencia? Crea un ticket y el equipo de Nexor te responderá en 24 horas.
              </p>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#111113",
                  color: "#fff",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: 800,
                  fontFamily: "'Inter', sans-serif",
                  cursor: "pointer",
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Crear primer ticket
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
