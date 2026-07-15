import React, { useState } from "react";
import { Copy, CheckCircle2, MessageSquare, Mail, HelpCircle } from "lucide-react";
import { RESOURCE_TEMPLATES } from "@/lib/data";

export default function ResourceLibrary() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredTemplates = RESOURCE_TEMPLATES.filter((tpl) => {
    const matchesIndustry = selectedIndustry === "all" || tpl.industry.toLowerCase() === selectedIndustry.toLowerCase() || (selectedIndustry === "Salud" && tpl.industry.includes("Salud"));
    const matchesCategory = selectedCategory === "all" || tpl.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesIndustry && matchesCategory;
  });

  return (
    <div className="space-y-6" id="resources-section">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Biblioteca de Plantillas de Prospección</h2>
          <p className="text-sm text-gray-500 mt-1">Material redactado por expertos para enviar por WhatsApp o correo electrónico de acuerdo a cada nicho de mercado.</p>
        </div>

        {/* Filtros personalizados sin controles horribles de HTML por defecto */}
        <div className="flex flex-wrap gap-2">
          {/* Selector de Industria */}
          <div className="flex bg-gray-100 p-1 rounded-full text-xs">
            <button
              onClick={() => setSelectedIndustry("all")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedIndustry === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-ind-all"
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedIndustry("Automotriz")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedIndustry === "Automotriz" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-ind-auto"
            >
              Automotriz
            </button>
            <button
              onClick={() => setSelectedIndustry("Inmobiliaria")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedIndustry === "Inmobiliaria" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-ind-inmob"
            >
              Inmobiliaria
            </button>
            <button
              onClick={() => setSelectedIndustry("SaaS")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedIndustry === "SaaS" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-ind-saas"
            >
              SaaS
            </button>
          </div>

          {/* Selector de Canal / Categoría */}
          <div className="flex bg-gray-100 p-1 rounded-full text-xs">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-cat-all"
            >
              Canales
            </button>
            <button
              onClick={() => setSelectedCategory("WhatsApp")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === "WhatsApp" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-cat-wa"
            >
              WhatsApp
            </button>
            <button
              onClick={() => setSelectedCategory("Email")}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === "Email" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
              }`}
              id="filter-cat-email"
            >
              Correo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-gray-300 transition-all flex flex-col justify-between"
            id={`template-card-${template.id}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center space-x-1 rounded-full bg-neutral-100 text-neutral-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {template.industry}
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
                  {template.category === "WhatsApp" ? (
                    <MessageSquare className="h-3 w-3 mr-1" />
                  ) : (
                    <Mail className="h-3 w-3 mr-1" />
                  )}
                  {template.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{template.title}</h3>
              <p className="text-xs text-gray-400 mb-4">{template.description}</p>
              
              <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-xs text-gray-700 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto mb-4">
                {template.content}
              </div>
            </div>

            <button
              onClick={() => handleCopy(template.content, template.id)}
              className={`w-full inline-flex items-center justify-center space-x-2 rounded-xl py-3 text-xs font-bold transition-all active:scale-98 ${
                copiedId === template.id
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white"
              }`}
              id={`btn-copy-${template.id}`}
            >
              {copiedId === template.id ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>¡Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Plantilla</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
