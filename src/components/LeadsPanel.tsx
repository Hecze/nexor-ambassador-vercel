"use client";

import React from "react";
import { Prospect } from "@/lib/types";
import { Phone, MessageSquare } from "lucide-react";

interface SimulatedLead {
  id: string;
  name: string;
  channel: "whatsapp" | "instagram" | "phone" | "email";
  status: "nuevo" | "caliente" | "cerrado" | "humano" | "frio";
  latestMessage: string;
  lastActive: string;
  timestamp: number;
  productOfInterest?: string;
  phoneOrUser: string;
}

interface LeadsPanelProps {
  prospect: Prospect;
  leads: SimulatedLead[];
  onSelectLead: (leadId: string) => void;
  selectedLeadId: string | null;
}

const stageConfig: Record<string, { bg: string; text: string; label: string }> = {
  nuevo: { bg: "#E0F2FE", text: "#0369A1", label: "Nuevo" },
  caliente: { bg: "#FEF3C7", text: "#92400E", label: "Caliente" },
  cerrado: { bg: "#D1FAE5", text: "#065F46", label: "Cerrado" },
  humano: { bg: "#E0E7FF", text: "#4338CA", label: "Con humano" },
  frio: { bg: "#F4F4F5", text: "#52525B", label: "Frío" },
};

function getProbability(status: string, channel: string): number {
  if (status === "cerrado") return 100;
  if (status === "caliente") return Math.floor(Math.random() * 30) + 55;
  if (status === "humano") return Math.floor(Math.random() * 30) + 40;
  if (status === "frio") return Math.floor(Math.random() * 20) + 5;
  return Math.floor(Math.random() * 30) + 15;
}

function getProbabilityColor(pct: number) {
  if (pct >= 70) return { bg: "#10B981", text: "#065F46" };
  if (pct >= 40) return { bg: "#F59E0B", text: "#B45309" };
  return { bg: "#0284C7", text: "#0369A1" };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getChannelIcon(channel: string) {
  switch (channel) {
    case "whatsapp":
      return (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#059669">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z" />
        </svg>
      );
    case "phone":
      return <Phone className="h-[9px] w-[9px] text-blue-500" />;
    case "instagram":
      return <MessageSquare className="h-[9px] w-[9px] text-pink-500" />;
    default:
      return <MessageSquare className="h-[9px] w-[9px] text-gray-400" />;
  }
}

function formatAmount(lead: SimulatedLead): string {
  const amounts = [28500, 41200, 22900, 19400, 26700];
  const idx = lead.id.charCodeAt(lead.id.length - 1) % amounts.length;
  return `$${amounts[idx].toLocaleString()}`;
}

function getInterest(lead: SimulatedLead): string {
  const interests = ["Sedán Híbrido", "SUV Eléctrica", "Sedán Confort", "Hatchback Deportivo", "Nexor Híbrido"];
  return lead.productOfInterest || interests[lead.id.charCodeAt(0) % interests.length];
}

export default function LeadsPanel({ prospect, leads, onSelectLead, selectedLeadId }: LeadsPanelProps) {
  const stages: { key: string; label: string; color: string; borderColor: string; count: number }[] = [
    { key: "nuevo", label: "Nuevos", color: "#0284C7", borderColor: "#0284C7", count: leads.filter((l) => l.status === "nuevo").length },
    { key: "caliente", label: "Calientes", color: "#F59E0B", borderColor: "#F59E0B", count: leads.filter((l) => l.status === "caliente").length },
    { key: "cerrado", label: "Cerrados", color: "#10B981", borderColor: "#10B981", count: leads.filter((l) => l.status === "cerrado").length },
    { key: "humano", label: "Con humano", color: "#6366F1", borderColor: "#6366F1", count: leads.filter((l) => l.status === "humano").length },
    { key: "frio", label: "Fríos", color: "#A1A1AA", borderColor: "#A1A1AA", count: leads.filter((l) => l.status === "frio").length },
  ];

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-y-auto gap-3 p-4">
      {/* Company header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-[34px] h-[34px] rounded-xl bg-[#111113] text-white flex items-center justify-center font-extrabold text-[13px] flex-shrink-0">
            {prospect.company.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-extrabold">{prospect.company}</div>
            <div className="text-[10.5px] text-[#71717A]">Leads gestionados por la IA de Nexor · en vivo</div>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-[#065F46]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> EN VIVO
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-[#E8E8EA] rounded-xl px-3 py-1.5 text-[11px] font-bold text-[#52525B]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round">
              <path d="M19 5c0 1.66-3.13 3-7 3S5 6.66 5 5s3.13-3 7-3 7 1.34 7 3z M5 5v14c0 1.66 3.13 3 7 3s7-1.34 7-3V5" />
            </svg>
            Saldo: <span className="font-mono text-[#111113]">{prospect.leadsBalance ?? 0} leads</span>
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="grid grid-cols-5 gap-2">
        {stages.map((s) => (
          <div
            key={s.key}
            className="bg-white border border-[#E8E8EA] rounded-xl px-3 py-2.5"
            style={{ borderTop: `3px solid ${s.color}` }}
          >
            <div className="text-[9.5px] font-extrabold uppercase tracking-[0.8px]" style={{ color: s.color }}>
              {s.label}
            </div>
            <div className="font-bold text-xl mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {s.count}
            </div>
          </div>
        ))}
      </div>

      {/* Leads table */}
      <div className="bg-white border border-[#E8E8EA] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[minmax(160px,1.4fr)_1fr_90px_110px_100px] gap-2.5 px-4 py-2.5 border-b border-[#F0F0F2] text-[9.5px] font-extrabold uppercase tracking-[1px] text-[#A1A1AA]">
          <span>Lead</span>
          <span>Interés</span>
          <span>Monto</span>
          <span>Prob. cierre</span>
          <span>Etapa</span>
        </div>

        {leads.slice(0, 10).map((lead, idx) => {
          const pct = getProbability(lead.status, lead.channel);
          const probColor = getProbabilityColor(pct);
          const stage = stageConfig[lead.status] || stageConfig.nuevo;
          const isSelected = selectedLeadId === lead.id;
          const amount = formatAmount(lead);

          return (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="grid grid-cols-[minmax(160px,1.4fr)_1fr_90px_110px_100px] gap-2.5 items-center px-4 py-3 cursor-pointer border-t border-[#F0F0F2] transition-colors"
              style={{
                background: isSelected ? "#FFFBEB" : idx === 0 ? "#FFFBEB" : "transparent",
                boxShadow: isSelected || idx === 0 ? "inset 3px 0 0 #F59E0B" : "none",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-extrabold text-[11px] flex-shrink-0"
                  style={{ background: stage.bg, color: stage.text }}
                >
                  {getInitials(lead.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-extrabold truncate">{lead.name}</div>
                  <div className="flex items-center gap-1 text-[9.5px] text-[#059669] font-bold">
                    {getChannelIcon(lead.channel)}
                    {lead.channel === "whatsapp"
                      ? "WhatsApp"
                      : lead.channel === "instagram"
                        ? "Instagram"
                        : lead.channel === "phone"
                          ? "Llamada"
                          : "Email"}
                    {" · "}{lead.lastActive}
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-[#52525B] font-semibold">{getInterest(lead)}</span>
              <span className="text-[11.5px] font-bold font-mono">{amount}</span>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-[5px] bg-[#F0F0F2] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: probColor.bg }}
                  />
                </div>
                <span className="text-[10.5px] font-bold font-mono" style={{ color: probColor.text }}>
                  {pct}%
                </span>
              </div>
              <span
                className="text-[9.5px] font-extrabold rounded-full px-2.5 py-1 w-fit"
                style={{ background: stage.bg, color: stage.text }}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
