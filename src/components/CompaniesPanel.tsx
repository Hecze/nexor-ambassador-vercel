"use client";

import React, { useState } from "react";
import { Prospect } from "@/lib/types";
import { Plus, X } from "lucide-react";

interface CompaniesPanelProps {
  prospects: Prospect[];
  selectedProspectId: string | null;
  onSelect: (id: string) => void;
  onAddProspect: (prospect: Omit<Prospect, "id" | "createdAt">) => void;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  "Generando comisiones": { bg: "rgba(86,223,224,0.12)", text: "#111113", border: "rgba(86,223,224,0.20)", label: "Generando comisiones" },
  "Cuenta activada": { bg: "#F4F4F5", text: "#111113", border: "#E8E8EA", label: "Cuenta activada" },
  "Demo creada": { bg: "#F4F4F5", text: "#111113", border: "#E8E8EA", label: "Demo creada" },
  "Reunión programada": { bg: "rgba(254,88,82,0.08)", text: "#111113", border: "#E8E8EA", label: "Reunión programada" },
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

export default function CompaniesPanel({ prospects, selectedProspectId, onSelect, onAddProspect }: CompaniesPanelProps) {
  const [showForm, setShowForm] = useState(false);
  const [cName, setCName] = useState("");
  const [cCompany, setCCompany] = useState("");
  const [cIndustry, setCIndustry] = useState("Automotriz");

  const activeCompanies = prospects.filter(
    (p) => p.status === "Generando comisiones" || p.status === "Cuenta activada"
  ).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cCompany.trim()) return;
    onAddProspect({
      name: cName,
      company: cCompany,
      email: "",
      industry: cIndustry,
      estimatedValue: 0,
      status: "Link enviado",
      leadsBalance: 0,
      leadsConsumed: 0,
      invoices: [],
    } as any);
    setCName("");
    setCCompany("");
    setCIndustry("Automotriz");
    setShowForm(false);
  };

  return (
    <div className="w-[272px] min-w-[272px] bg-white border-r border-[#D4D4D8] flex flex-col h-full shadow-[1px_0_4px_rgba(0,0,0,0.04)]">
      <div className="px-3.5 py-3.5 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#71717A]">
          Empresas · {prospects.length}
        </span>
        <div className="flex items-center gap-1.5">
          {activeCompanies > 0 && (
            <span className="text-[10px] font-bold text-[#56dfe0] bg-[rgba(86,223,224,0.06)] rounded-full px-2 py-0.5">
              {activeCompanies} activas
            </span>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="px-3.5 pb-2 space-y-2 animate-fade-in">
          <input
            type="text"
            required
            value={cName}
            onChange={(e) => setCName(e.target.value)}
            placeholder="Nombre del contacto"
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none"
          />
          <input
            type="text"
            required
            value={cCompany}
            onChange={(e) => setCCompany(e.target.value)}
            placeholder="Nombre de la empresa"
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none"
          />
          <select
            value={cIndustry}
            onChange={(e) => setCIndustry(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none cursor-pointer"
          >
            <option value="Automotriz">Automotriz</option>
            <option value="Inmobiliaria">Inmobiliaria</option>
            <option value="SaaS">SaaS / Software</option>
            <option value="Salud/Estética">Salud o Estética</option>
            <option value="Servicios B2B">Servicios B2B</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer"
          >
            Registrar
          </button>
        </form>
      )}
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
                borderColor: isSelected ? "#E8E8EA" : "#E8E8EA",
                boxShadow: isSelected ? "inset 3px 0 0 #111113" : "none",
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
                  style={{ color: hasMRR ? "#56dfe0" : "#A1A1AA" }}
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
