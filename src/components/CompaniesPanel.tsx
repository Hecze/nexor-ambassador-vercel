"use client";

import React from "react";
import { Prospect } from "@/lib/types";

interface CompaniesPanelProps {
  prospects: Prospect[];
  selectedProspectId: string | null;
  onSelect: (id: string) => void;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  "Generando comisiones": { bg: "#D1FAE5", text: "#065F46", border: "#A7F3D0", label: "Generando comisiones" },
  "Cuenta activada": { bg: "#E0E7FF", text: "#3730A3", border: "#C7D2FE", label: "Cuenta activada" },
  "Demo creada": { bg: "#E0F2FE", text: "#0369A1", border: "#BAE6FD", label: "Demo creada" },
  "Reunión programada": { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A", label: "Reunión programada" },
  "Link enviado": { bg: "#F4F4F5", text: "#52525B", border: "#E4E4E7", label: "Link enviado" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export default function CompaniesPanel({ prospects, selectedProspectId, onSelect }: CompaniesPanelProps) {
  const activeCompanies = prospects.filter(
    (p) => p.status === "Generando comisiones" || p.status === "Cuenta activada"
  ).length;

  return (
    <div className="w-[272px] min-w-[272px] bg-white border-r border-[#E8E8EA] flex flex-col h-full">
      <div className="px-3.5 py-3.5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#71717A]">
          Empresas · {prospects.length}
        </span>
        {activeCompanies > 0 && (
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] rounded-full px-2 py-0.5">
            {activeCompanies} activas
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2.5 pb-3.5 space-y-1.5">
        {prospects.map((prospect) => {
          const isSelected = selectedProspectId === prospect.id;
          const config = statusConfig[prospect.status] || statusConfig["Link enviado"];
          const hasMRR = prospect.status === "Generando comisiones" || prospect.status === "Cuenta activada";
          const mrrAmount = prospect.estimatedValue > 0 ? `$${prospect.estimatedValue}/mes` : "—";
          const leadsToday = prospect.leadsBalance != null ? (Math.floor(Math.random() * 10) + 1) : 0;

          return (
            <button
              key={prospect.id}
              onClick={() => onSelect(prospect.id)}
              className="w-full text-left rounded-xl p-3 transition-all cursor-pointer border"
              style={{
                background: isSelected ? "#F5F3FF" : "#fff",
                borderColor: isSelected ? "#C7D2FE" : "#E8E8EA",
                boxShadow: isSelected ? "inset 3px 0 0 #4F46E5" : "none",
              }}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-extrabold truncate">{prospect.company}</div>
                  <div className="text-[10.5px] text-[#71717A] mt-0.5">
                    {prospect.name} · {prospect.industry}
                  </div>
                </div>
                <span
                  className="text-[11px] font-bold font-mono flex-shrink-0"
                  style={{ color: hasMRR ? "#059669" : "#A1A1AA" }}
                >
                  {mrrAmount}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="text-[9.5px] font-extrabold rounded-full px-2 py-0.5"
                  style={{ background: config.bg, color: config.text }}
                >
                  {config.label}
                </span>
                {leadsToday > 0 && (
                  <span className="text-[9.5px] text-[#71717A] font-mono ml-auto">{leadsToday} leads hoy</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
