import React, { useState } from "react";
import {
  LifeBuoy,
  Plus,
  X,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Upload,
  Trash2,
  FileText,
  Wrench,
  Receipt,
  Lightbulb,
  AlertTriangle,
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

interface SupportPanelProps {
  userEmail: string;
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
    className: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  en_revision: {
    label: "En Revisión",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
  },
  resuelto: {
    label: "Resuelto",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dot: "bg-emerald-500",
  },
};

export default function SupportPanel({ userEmail }: SupportPanelProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);

  // Form state
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<SupportTicket["type"] | null>(null);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [expectedBehavior, setExpectedBehavior] = useState("");

  const resetForm = () => {
    setStep(1);
    setSelectedType(null);
    setSubject("");
    setDescription("");
    setVideoUrl("");
    setExpectedBehavior("");
    setShowForm(false);
    setSuccessTicketId(null);
  };

  const handleSubmit = () => {
    if (!selectedType || !subject.trim() || !description.trim()) return;
    if (selectedType === "queja" && !videoUrl.trim()) return;

    const newTicket: SupportTicket = {
      id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
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
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  const typeInfo = (type: SupportTicket["type"]) =>
    TICKET_TYPES.find((t) => t.id === type)!;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            Soporte con Nexor Raíz
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Crea un ticket y nuestro equipo se pondrá en contacto contigo.
          </p>
        </div>
        {!showForm && !successTicketId && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Nuevo ticket</span>
          </button>
        )}
      </div>

      {/* SUCCESS STATE */}
      {successTicketId && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-10 text-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-emerald-900">
              ¡Ticket {successTicketId} creado!
            </h3>
            <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
              El equipo de Nexor Raíz se pondrá en contacto contigo a través de{" "}
              <strong className="font-black">{userEmail}</strong> en las próximas 24 horas hábiles.
            </p>
          </div>
          <button
            onClick={resetForm}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all"
          >
            Ver mis tickets
          </button>
        </div>
      )}

      {/* CREATE TICKET FORM */}
      {showForm && !successTicketId && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          {/* Progress header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step >= 1 ? "bg-neutral-900 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span className="text-xs font-bold text-gray-500">Tipo</span>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  step === 2 ? "bg-neutral-900 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </span>
              <span className="text-xs font-bold text-gray-500">Detalle</span>
            </div>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* STEP 1: Type selection */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  ¿Qué tipo de solicitud es?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TICKET_TYPES.map((t) => {
                    const Icon = t.icon;
                    const isSelected = selectedType === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-4 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-gray-200 hover:border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon
                            className={`h-4 w-4 ${isSelected ? "text-white" : t.iconColor}`}
                          />
                          <span className="text-xs font-black">{t.label}</span>
                        </div>
                        <p className={`text-[11px] ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                          {t.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    disabled={!selectedType}
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && selectedType && (
              <div className="space-y-4">
                {/* Selected type badge */}
                {(() => {
                  const t = typeInfo(selectedType);
                  const Icon = t.icon;
                  return (
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[10px] font-bold ${t.badgeClass}`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{t.label}</span>
                      </span>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[10px] text-gray-400 hover:text-gray-700 underline cursor-pointer"
                      >
                        Cambiar
                      </button>
                    </div>
                  );
                })()}

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
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
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
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
                    className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none resize-none"
                  />
                </div>

                {/* Complaint-specific fields */}
                {selectedType === "queja" && (
                  <>
                    <div className="space-y-1.5 p-4 bg-red-50 rounded-2xl border border-red-100">
                      <label className="block text-[11px] font-bold text-red-600 uppercase tracking-wider flex items-center space-x-1.5">
                        <Upload className="h-3.5 w-3.5" />
                        <span>Evidencia en video * (obligatorio para quejas)</span>
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://drive.google.com/... · https://loom.com/... · https://youtu.be/..."
                        className="block w-full rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                      />
                      <p className="text-[10px] text-red-500">
                        Sube un video que muestre el problema y pega aquí el enlace. Esto agiliza la resolución.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        ¿Qué comportamiento esperabas?
                      </label>
                      <textarea
                        value={expectedBehavior}
                        onChange={(e) => setExpectedBehavior(e.target.value)}
                        rows={2}
                        placeholder="Describe qué debería haber ocurrido en lugar de lo que pasó..."
                        className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs focus:border-neutral-900 outline-none resize-none"
                      />
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
                  >
                    ← Atrás
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={
                      !subject.trim() ||
                      !description.trim() ||
                      (selectedType === "queja" && !videoUrl.trim())
                    }
                    className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                  >
                    Enviar ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TICKETS LIST */}
      {tickets.length > 0 && !successTicketId && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Mis tickets ({tickets.length})
          </p>
          {tickets.map((ticket) => {
            const info = typeInfo(ticket.type);
            const Icon = info.icon;
            const status = STATUS_CONFIG[ticket.status];
            return (
              <div
                key={ticket.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${info.badgeClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-xs font-black text-gray-900">{ticket.subject}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold ${info.badgeClass}`}>
                          {info.label}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${status.className}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          <span>{status.label}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        {ticket.id} · {ticket.createdAt}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed pl-11">
                  {ticket.description.length > 200
                    ? ticket.description.slice(0, 200) + "..."
                    : ticket.description}
                </p>

                {ticket.videoUrl && (
                  <div className="pl-11">
                    <a
                      href={ticket.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700 underline"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Ver evidencia adjunta</span>
                    </a>
                  </div>
                )}

                <div className="pl-11 flex items-center space-x-2 text-[10px] text-gray-400 bg-gray-50 rounded-xl px-3 py-2">
                  <MessageSquare className="h-3 w-3 flex-shrink-0" />
                  <span>
                    Nexor Raíz responderá a{" "}
                    <strong className="text-gray-700">{userEmail}</strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {tickets.length === 0 && !showForm && !successTicketId && (
        <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-14 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-gray-50 border border-gray-150 flex items-center justify-center mx-auto">
            <LifeBuoy className="h-6 w-6 text-gray-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-gray-900">Sin tickets abiertos</h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              ¿Tienes algún problema o sugerencia? Crea un ticket y el equipo de Nexor Raíz te responderá en 24 horas.
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Crear primer ticket</span>
          </button>
        </div>
      )}
    </div>
  );
}
