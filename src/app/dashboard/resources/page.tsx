"use client";

import React, { useState } from "react";
import { RESOURCE_TEMPLATES } from "@/lib/data";
import { ResourceTemplate } from "@/lib/types";
import Link from "next/link";

const TEMPLATE_STATS: Record<string, { text: string; color: "green" | "indigo" }> = {
  "auto-wa": { text: "+38% test drives", color: "green" },
  "re-email": { text: "Respuesta < 30 s", color: "indigo" },
  "saas-wa": { text: "2x demos", color: "green" },
  "est-email": { text: "-25% ausentismo", color: "indigo" },
};

const EMPTY_TEMPLATE: Omit<ResourceTemplate, "id"> = {
  title: "",
  description: "",
  category: "WhatsApp",
  industry: "Automotriz",
  content: "",
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
  const [templates, setTemplates] = useState<ResourceTemplate[]>(RESOURCE_TEMPLATES);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ResourceTemplate>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newForm, setNewForm] = useState<Partial<ResourceTemplate>>({ ...EMPTY_TEMPLATE });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const startEdit = (tpl: ResourceTemplate) => {
    setEditingId(tpl.id);
    setEditForm({ title: tpl.title, description: tpl.description, category: tpl.category, industry: tpl.industry, content: tpl.content });
  };

  const saveEdit = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...editForm } as ResourceTemplate : t))
    );
    setEditingId(null);
    setEditForm({});
  };

  const addTemplate = () => {
    const id = "tpl-" + Date.now();
    const newTpl: ResourceTemplate = {
      id,
      title: newForm.title || "Nueva plantilla",
      description: newForm.description || "",
      category: (newForm.category as ResourceTemplate["category"]) || "WhatsApp",
      industry: newForm.industry || "Automotriz",
      content: newForm.content || "",
    };
    setTemplates((prev) => [...prev, newTpl]);
    setShowAddForm(false);
    setNewForm({ ...EMPTY_TEMPLATE });
  };

  const filteredTemplates = templates.filter((tpl) => {
    if (filter === "all") return true;
    if (filter === "WhatsApp" || filter === "Email") return tpl.category === filter;
    return tpl.industry === filter || (filter === "Salud/Estética" && tpl.industry.includes("Salud"));
  });

  const renderField = (label: string, value: string, onChange: (v: string) => void, type: "input" | "select" = "input", options?: string[]) => (
    <div className="flex-1 min-w-0">
      <label className="text-[9px] font-extrabold text-[#71717A] uppercase block mb-0.5">{label}</label>
      {type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-[#E8E8EA] px-2 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none cursor-pointer bg-white">
          {options?.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-[#E8E8EA] px-2 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none" />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-[14px] p-[18px_20px]">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap items-center">
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
        <button
          onClick={() => { setShowAddForm(true); setNewForm({ ...EMPTY_TEMPLATE }); }}
          className="flex items-center gap-1.5 bg-[#111113] text-white rounded-[10px] px-4 py-2 text-[11px] font-extrabold cursor-pointer hover:bg-[#27272A] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14 M5 12h14" /></svg>
          Nueva plantilla
        </button>
      </div>

      {/* Add-new form */}
      {showAddForm && (
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4 space-y-3 animate-fade-in">
          <div className="text-[11px] font-extrabold text-[#111113]">Nueva plantilla</div>
          <div className="grid grid-cols-2 gap-2">
            {renderField("Título", newForm.title || "", (v) => setNewForm({ ...newForm, title: v }))}
            {renderField("Descripción", newForm.description || "", (v) => setNewForm({ ...newForm, description: v }))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {renderField("Canal", newForm.category || "WhatsApp", (v) => setNewForm({ ...newForm, category: v as ResourceTemplate["category"] }), "select", ["WhatsApp", "Email", "Puntos Clave"])}
            {renderField("Industria", newForm.industry || "Automotriz", (v) => setNewForm({ ...newForm, industry: v }), "select", ["Automotriz", "Inmobiliaria", "SaaS", "Salud/Estética"])}
          </div>
          <div>
            <label className="text-[9px] font-extrabold text-[#71717A] uppercase block mb-0.5">Contenido</label>
            <textarea value={newForm.content || ""} onChange={(e) => setNewForm({ ...newForm, content: e.target.value })} rows={5} className="w-full rounded-lg border border-[#E8E8EA] px-2 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none resize-y" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAddForm(false)} className="bg-white border border-[#E8E8EA] text-[#52525B] rounded-[9px] px-4 py-2 text-[11px] font-bold cursor-pointer hover:border-[#A1A1AA]">Cancelar</button>
            <button onClick={addTemplate} className="bg-[#111113] text-white rounded-[9px] px-4 py-2 text-[11px] font-extrabold cursor-pointer hover:bg-[#27272A]">Guardar</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {filteredTemplates.map((template) => {
          const stat = TEMPLATE_STATS[template.id];
          const isExpanded = expandedId === template.id;
          const isEditing = editingId === template.id;
          const isWhatsApp = template.category === "WhatsApp";

          return (
            <div
              key={template.id}
              className="bg-white border border-[#E8E8EA] rounded-2xl p-5 flex flex-col gap-[13px] transition-colors hover:border-[#C7C7CC]"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {renderField("Título", editForm.title || "", (v) => setEditForm({ ...editForm, title: v }))}
                    {renderField("Descripción", editForm.description || "", (v) => setEditForm({ ...editForm, description: v }))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {renderField("Canal", editForm.category || "WhatsApp", (v) => setEditForm({ ...editForm, category: v as ResourceTemplate["category"] }), "select", ["WhatsApp", "Email", "Puntos Clave"])}
                    {renderField("Industria", editForm.industry || "Automotriz", (v) => setEditForm({ ...editForm, industry: v }), "select", ["Automotriz", "Inmobiliaria", "SaaS", "Salud/Estética"])}
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-[#71717A] uppercase block mb-0.5">Contenido</label>
                    <textarea value={editForm.content || ""} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} rows={6} className="w-full rounded-lg border border-[#E8E8EA] px-2 py-1.5 text-[11px] font-bold focus:border-neutral-900 outline-none resize-y" />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setEditingId(null); setEditForm({}); }} className="bg-white border border-[#E8E8EA] text-[#52525B] rounded-[9px] px-4 py-2 text-[11px] font-bold cursor-pointer hover:border-[#A1A1AA]">Cancelar</button>
                    <button onClick={() => saveEdit(template.id)} className="bg-[#111113] text-white rounded-[9px] px-4 py-2 text-[11px] font-extrabold cursor-pointer hover:bg-[#27272A]">Guardar</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center flex-shrink-0"
                        style={{ background: isWhatsApp ? "rgba(86,223,224,0.06)" : "#F4F4F5" }}
                      >
                        {isWhatsApp ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#111113"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2z" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" /></svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-extrabold truncate">{template.title}</div>
                        <div className="text-[9.5px] text-[#71717A]">{template.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                      {stat && (
                        <span
                          className="text-[9px] font-extrabold rounded-full px-2 py-0.5"
                          style={{
                            background: stat.color === "green" ? "rgba(86,223,224,0.12)" : "#F4F4F5",
                            color: stat.color === "green" ? "#111113" : "#111113",
                          }}
                        >
                          {stat.text}
                        </span>
                      )}
                      <button
                        onClick={() => startEdit(template)}
                        className="p-1 rounded-lg text-[#A1A1AA] hover:text-[#111113] hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-1 rounded-lg text-[#A1A1AA] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Eliminar"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6 M14 11v6" /></svg>
                      </button>
                    </div>
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
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-[#F4F4F5] border border-[#E8E8EA] rounded-[14px] px-4 py-[13px] flex items-center gap-[11px]">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>
        <span className="text-[11.5px] text-[#111113] font-semibold flex-1">¿Ninguna encaja con tu prospecto? Pídele a Sofía que genere un copy a medida con los datos de tu lead.</span>
        <Link
          href="/dashboard/coach"
          className="bg-[#111113] text-white rounded-[9px] px-3.5 py-2 text-[11px] font-extrabold transition-colors hover:bg-[#111113] no-underline"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Pedir a Sofía
        </Link>
      </div>
    </div>
  );
}
