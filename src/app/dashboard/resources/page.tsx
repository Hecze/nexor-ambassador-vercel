"use client";

import React, { useState } from "react";
import { RESOURCE_TEMPLATES } from "@/lib/data";
import Link from "next/link";

const TEMPLATE_STATS: Record<string, { text: string; color: "green" | "indigo" }> = {
  "auto-wa": { text: "+38% test drives", color: "green" },
  "re-email": { text: "Respuesta < 30 s", color: "indigo" },
  "saas-wa": { text: "2x demos", color: "green" },
  "est-email": { text: "-25% ausentismo", color: "indigo" },
};

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "WhatsApp", label: "WhatsApp" },
  { value: "Email", label: "Email" },
  null,
  { value: "Automotriz", label: "Automotriz" },
  { value: "Inmobiliaria", label: "Inmobiliaria" },
  { value: "SaaS", label: "SaaS" },
  { value: "Salud/Estética", label: "Salud/Estética" },
];

export default function ResourcesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredTemplates = RESOURCE_TEMPLATES.filter((tpl) => {
    if (filter === "all") return true;
    if (filter === "WhatsApp" || filter === "Email") return tpl.category === filter;
    return tpl.industry === filter || (filter === "Salud/Estética" && tpl.industry.includes("Salud"));
  });

  return (
    <div className="flex flex-col gap-[14px] p-[18px_20px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f, i) => {
            if (f === null) {
              return <span key="sep" className="w-px bg-[#E8E8EA] mx-1 self-stretch" />;
            }
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer border"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  background: isActive ? "#111113" : "#fff",
                  color: isActive ? "#fff" : "#52525B",
                  borderColor: isActive ? "#111113" : "#E8E8EA",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E8E8EA] rounded-[10px] px-3 py-2 w-60">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35" /></svg>
          <span className="text-xs text-[#A1A1AA]">Buscar plantilla...</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredTemplates.map((template) => {
          const stat = TEMPLATE_STATS[template.id];
          const isExpanded = expandedId === template.id;
          const isWhatsApp = template.category === "WhatsApp";
          return (
            <div
              key={template.id}
              className="bg-white border border-[#E8E8EA] rounded-2xl p-4 flex flex-col gap-[11px] transition-colors hover:border-[#C7C7CC]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center flex-shrink-0"
                    style={{ background: isWhatsApp ? "#ECFDF5" : "#EEF2FF" }}
                  >
                    {isWhatsApp ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#059669"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" /></svg>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-extrabold truncate">{template.title}</div>
                    <div className="text-[9.5px] text-[#71717A]">{template.description}</div>
                  </div>
                </div>
                {stat && (
                  <span
                    className="text-[9px] font-extrabold rounded-full px-2 py-0.5 flex-shrink-0 ml-2"
                    style={{
                      background: stat.color === "green" ? "#D1FAE5" : "#E0E7FF",
                      color: stat.color === "green" ? "#065F46" : "#3730A3",
                    }}
                  >
                    {stat.text}
                  </span>
                )}
              </div>

              <div
                className="bg-[#FAFAFA] border border-[#F0F0F2] rounded-[11px] px-[13px] py-[11px] text-[11.5px] text-[#3F3F46] leading-relaxed whitespace-pre-wrap"
                style={isExpanded ? {} : { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}
              >
                {template.content}
              </div>

              <div className="flex gap-[7px]">
                <button
                  onClick={() => handleCopy(template.content, template.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#111113] text-white border-none rounded-[9px] py-2 text-[11px] font-extrabold cursor-pointer transition-colors hover:bg-[#27272A]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {copiedId === template.id ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      Copiado
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                      Copiar
                    </>
                  )}
                </button>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : template.id)}
                  className="bg-white text-[#52525B] border border-[#E8E8EA] rounded-[9px] px-3 py-2 text-[11px] font-bold cursor-pointer transition-colors hover:border-[#A1A1AA]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Ver completo
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-[14px] px-4 py-[13px] flex items-center gap-[11px]">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
        <span className="text-[11.5px] text-[#3730A3] font-semibold flex-1">¿Ninguna encaja con tu prospecto? Pídele a Sofía que genere un copy a medida con los datos de tu lead.</span>
        <Link
          href="/dashboard/coach"
          className="bg-[#4F46E5] text-white rounded-[9px] px-3.5 py-2 text-[11px] font-extrabold transition-colors hover:bg-[#4338CA] no-underline"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pedir a Sofía
        </Link>
      </div>
    </div>
  );
}
