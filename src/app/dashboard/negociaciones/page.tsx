"use client";

import React, { useMemo } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useRouter } from "next/navigation";
import { Target, DollarSign, TrendingUp, CheckCircle2, Clock, Building, User, Calendar } from "lucide-react";

const STAGES = [
  {
    key: "contactando",
    label: "Contactando",
    description: "Hiciste el primer contacto",
    color: "#52525B",
    bg: "#F4F4F5",
    text: "#111113",
    border: "#E8E8EA",
    statuses: ["Link enviado"],
  },
  {
    key: "negociando",
    label: "Negociando",
    description: "Conversaciones activas",
    color: "#3F3F46",
    bg: "#F4F4F5",
    text: "#111113",
    border: "#E8E8EA",
    statuses: ["Reunión programada", "Demo creada"],
  },
  {
    key: "cerrando",
    label: "Cerrando",
    description: "Casi listo, falta activar",
    color: "#3F3F46",
    bg: "#F4F4F5",
    text: "#111113",
    border: "#E8E8EA",
    statuses: ["Cuenta activada"],
  },
  {
    key: "comisionando",
    label: "Comisionando",
    description: "Generando ingresos",
    color: "#111113",
    bg: "#E8E8EA",
    text: "#111113",
    border: "#D4D4D8",
    statuses: ["Generando comisiones"],
  },
];

function daysAgo(dateStr: string | undefined) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getInitialColor() {
  return "#3F3F46";
}

export default function NegociacionesPage() {
  const { prospects, isLoadingProspects } = useDashboard();
  const router = useRouter();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const pipelineTotal = useMemo(
    () => prospects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0),
    [prospects]
  );

  const closedThisMonth = useMemo(
    () =>
      prospects.filter((p) => {
        if (p.status !== "Generando comisiones") return false;
        const d = p.createdAt ? new Date(p.createdAt) : null;
        if (!d || isNaN(d.getTime())) return false;
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [prospects, currentMonth, currentYear]
  );

  const dealsByStage = useMemo(() => {
    const map: Record<string, typeof prospects> = {};
    for (const stage of STAGES) {
      map[stage.key] = prospects.filter((p) => stage.statuses.includes(p.status));
    }
    return map;
  }, [prospects]);

  if (isLoadingProspects) {
    return (
      <div className="p-5 animate-pulse space-y-4">
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-20 bg-gray-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-96 bg-gray-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* METRICS BAR */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-[#F4F4F5] flex items-center justify-center">
              <DollarSign className="h-[14px] w-[14px] text-[#52525B]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]">Pipeline total</span>
          </div>
          <div className="text-[22px] font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ${pipelineTotal.toLocaleString()}
          </div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-[#F4F4F5] flex items-center justify-center">
              <Target className="h-[14px] w-[14px] text-[#111113]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]">Negociando</span>
          </div>
          <div className="text-[22px] font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {dealsByStage.negociando.length}
          </div>
          <div className="text-[10px] text-[#111113] font-bold mt-0.5">
            {dealsByStage.negociando.reduce((s, p) => s + (p.estimatedValue || 0), 0).toLocaleString()} USD en juego
          </div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-[#F4F4F5] flex items-center justify-center">
              <TrendingUp className="h-[14px] w-[14px] text-[#52525B]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]">Cierres este mes</span>
          </div>
          <div className="text-[22px] font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {closedThisMonth.length}
          </div>
          <div className="text-[10px] text-[#71717A] font-bold mt-0.5">
            {closedThisMonth.reduce((s, p) => s + (p.commissionEarned || 0), 0).toLocaleString()} USD en comisiones
          </div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-[#F4F4F5] flex items-center justify-center">
              <Clock className="h-[14px] w-[14px] text-[#52525B]" />
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]">Por contactar</span>
          </div>
          <div className="text-[22px] font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {dealsByStage.contactando.filter((p) => {
              const d = daysAgo(p.createdAt);
              return d !== null && d > 7;
            }).length}
          </div>
          <div className="text-[10px] text-[#71717A] font-bold mt-0.5">+7 días sin seguimiento</div>
        </div>
      </div>

      {/* KANBAN PIPELINE */}
      <div className="grid grid-cols-4 gap-3 items-start min-h-[500px]">
        {STAGES.map((stage) => {
          const deals = dealsByStage[stage.key];
          const totalStage = deals.reduce((s, p) => s + (p.estimatedValue || 0), 0);

          return (
            <div
              key={stage.key}
              className="bg-[#F6F6F7] border border-[#E8E8EA] rounded-2xl flex flex-col min-h-[420px]"
            >
              <div className="px-4 py-3 border-b border-[#E8E8EA] flex items-center justify-between bg-[#111113] rounded-t-2xl">
                <div>
                  <div className="text-xs font-extrabold text-white">{stage.label}</div>
                  <div className="text-[10px] text-[#A1A1AA]">{stage.description}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-[#A1A1AA]">
                    ${totalStage.toLocaleString()}
                  </span>
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold"
                    style={{ background: "#3F3F46", color: "#fff" }}
                  >
                    {deals.length}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {deals.length === 0 ? (
                  <div className="flex items-center justify-center h-24 border border-dashed border-[#E8E8EA] rounded-xl mx-0.5">
                    <p className="text-[10px] text-[#A1A1AA]">Sin deals aquí</p>
                  </div>
                ) : (
                  deals.map((prospect) => {
                    const d = daysAgo(prospect.createdAt);
                    const isStale = d !== null && d > 7 && stage.key === "contactando";
                    const isWarm = stage.key === "negociando" || stage.key === "cerrando";

                    return (
                      <button
                        key={prospect.id}
                        onClick={() => router.push(`/dashboard/prospects?selected=${prospect.id}`)}
                        className="w-full text-left bg-white border border-[#E8E8EA] rounded-xl p-3.5 cursor-pointer hover:border-[#C7C7CC] hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div
                            className="w-[34px] h-[34px] rounded-[10px] text-white flex items-center justify-center font-extrabold text-[12px] flex-shrink-0"
                            style={{ background: getInitialColor() }}
                          >
                            {getInitials(prospect.company)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12px] font-extrabold text-[#111113] truncate">
                              {prospect.company}
                            </div>
                            <div className="text-[10px] text-[#71717A]">{prospect.industry}</div>
                          </div>
                          {isStale && (
                            <span className="ml-auto bg-[#F4F4F5] text-[#71717A] text-[9px] font-extrabold rounded-full px-2 py-0.5 flex-shrink-0">
                              {d}d
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[10px] text-[#71717A] mb-2">
                          <User className="h-3 w-3" />
                          <span className="font-semibold truncate">{prospect.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-bold text-[#111113]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            ${prospect.estimatedValue.toLocaleString()} USD
                          </span>
                        </div>

                        <div
                          className="h-1 rounded-full mt-2.5 bg-[#E8E8EA]"
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
