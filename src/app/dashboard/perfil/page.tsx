"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { User, Linkedin, Search, CheckCircle2, Briefcase, MapPin, Shield, Link2, Copy } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [savedData, setSavedData] = useState<any>(null);

  const handleLoadLinkedIn = async () => {
    if (!linkedinUrl.trim()) return;
    setIsScraping(true);
    try {
      const response = await fetch("/api/apify/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl: linkedinUrl, clientName: user?.displayName || "" }),
      });
      const data = await response.json();
      setScrapedData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScraping(false);
    }
  };

  const handleSave = () => {
    if (scrapedData) {
      setSavedData(scrapedData);
      setScrapedData(null);
    }
  };

  const displayData = savedData || {
    name: user?.displayName || "Tu nombre",
    role: "Partner de Nexor",
    company: "Independiente",
    industry: "Sin definir",
    experience: "Vincula tu LinkedIn para que Sofía pueda personalizar sus recomendaciones de venta según tu background profesional.",
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden">
        <div className="bg-neutral-900 p-6 text-white flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black">
            {(user?.displayName || "T").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-black">{displayData.name}</h2>
            <p className="text-xs text-neutral-400">{user?.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <Briefcase className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Rol</p>
              <p className="text-sm font-bold text-gray-900">{displayData.role}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <Shield className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Industria</p>
              <p className="text-sm font-bold text-gray-900">{displayData.industry}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Experiencia</p>
            <p className="text-xs text-gray-700 leading-relaxed">{displayData.experience}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-xl"><Linkedin className="h-5 w-5 text-blue-600" /></div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Vincular LinkedIn</h3>
            <p className="text-[11px] text-gray-400">Sofía usará tu perfil profesional para darte mejores recomendaciones de venta.</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <input
            type="url"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="Pega aquí la URL de tu perfil de LinkedIn..."
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-xs outline-none focus:border-neutral-900"
          />
          <button
            onClick={handleLoadLinkedIn}
            disabled={isScraping || !linkedinUrl.trim()}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            {isScraping ? (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span>Extraer datos</span>
          </button>
        </div>

        {scrapedData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-800">Datos extraídos correctamente</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400">Empresa</span>
                <p className="font-bold text-gray-900">{scrapedData.company}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400">Rol</span>
                <p className="font-bold text-gray-900">{scrapedData.role}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400">Industria</span>
                <p className="font-bold text-gray-900">{scrapedData.industry}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <span className="text-gray-400">Tamaño</span>
                <p className="font-bold text-gray-900">{scrapedData.employeeCount}</p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Guardar en mi perfil
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 rounded-xl"><Link2 className="h-5 w-5 text-amber-600" /></div>
          <div>
            <h3 className="text-sm font-black text-gray-900">Link de Referido</h3>
            <p className="text-[11px] text-gray-400">Comparte este link. Tus prospectos hablarán con Sofía y aparecerán automáticamente en tu cartera.</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <input
            readOnly
            value={typeof window !== "undefined" ? `${window.location.origin}/r/${user?.uid}` : ""}
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-700 outline-none"
          />
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                navigator.clipboard.writeText(`${window.location.origin}/r/${user?.uid}`);
              }
            }}
            className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copiar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
