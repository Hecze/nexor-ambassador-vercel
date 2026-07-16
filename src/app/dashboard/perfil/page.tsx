"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function PerfilPage() {
  const { user } = useAuth();

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<any>(null);
  const [savedData, setSavedData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<"transferencia" | "paypal" | "cripto">("transferencia");

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

  const displayName = savedData?.name || user?.displayName || "Tu nombre";
  const displayEmail = user?.email || "socio@nexor.ai";
  const initial = (displayName || "S").charAt(0).toUpperCase();

  const referralUrl =
    typeof window !== "undefined" ? `${window.location.origin}/r/${user?.uid}` : "";

  return (
    <div className="p-[18px] grid grid-cols-[minmax(0,1.35fr)_340px] gap-4 items-start">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3">
        {/* PARTNER CARD */}
        <div className="bg-[#101018] rounded-[18px] p-5 text-white relative overflow-hidden">
          <div className="absolute top-[-70px] right-[-40px] w-[240px] h-[240px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.3),transparent_70%)] pointer-events-none" />
          <div className="flex items-center gap-4 relative">
            <div className="relative flex-shrink-0">
              <div className="w-[72px] h-[72px] rounded-full bg-[linear-gradient(135deg,#111113,#7C3AED)] flex items-center justify-center text-2xl font-bold border-[3px] border-white/[0.15]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {initial}
              </div>
              <div className="absolute -right-1 -bottom-1 bg-[#fe5852] border-[3px] border-[#101018] rounded-[9px] text-white text-[11px] font-extrabold px-[7px] py-[2px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                4
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {displayName}
              </div>
              <div className="text-[11.5px] text-[#A1A1AA] mt-px">{displayEmail} · partner desde mayo 2026</div>
              <div className="flex gap-1.5 mt-2">
                <span className="text-[9.5px] font-extrabold uppercase tracking-[0.6px] bg-[rgba(251,191,36,0.15)] text-[#fe5852] border border-[rgba(251,191,36,0.3)] rounded-full px-2.5 py-[3px]">
                  Explorer Partner · 15%
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold bg-[rgba(254,88,82,0.12)] text-[#fe5852] border border-[rgba(254,88,82,0.3)] rounded-full px-2.5 py-[3px]">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fe5852">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                  Racha de 5 días
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mt-[18px] relative">
            <div className="bg-white/[0.05] border border-white/[0.09] rounded-[12px] p-[11px_13px]">
              <div className="text-[8.5px] font-extrabold tracking-[1px] text-[#71717A] uppercase">Empresas</div>
              <div className="text-[19px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>5</div>
            </div>
            <div className="bg-white/[0.05] border border-white/[0.09] rounded-[12px] p-[11px_13px]">
              <div className="text-[8.5px] font-extrabold tracking-[1px] text-[#71717A] uppercase">Comisión julio</div>
              <div className="text-[19px] font-bold text-[#56dfe0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>$195</div>
            </div>
            <div className="bg-white/[0.05] border border-white/[0.09] rounded-[12px] p-[11px_13px]">
              <div className="text-[8.5px] font-extrabold tracking-[1px] text-[#71717A] uppercase">Liga Zafiro</div>
              <div className="text-[19px] font-bold text-[#93C5FD]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>#4</div>
            </div>
          </div>
        </div>

        {/* LINKEDIN IMPORT */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-[9px] mb-2.5">
            <div className="w-[30px] h-[30px] rounded-[9px] bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.5A6 6 0 0 1 16 8z M6 9H2v12h4z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[12.5px] font-extrabold">Vincula tu LinkedIn</div>
              <div className="text-[10.5px] text-[#71717A]">Sofía usa tu experiencia para personalizar sus recomendaciones de venta</div>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/tu-perfil"
              className="flex-1 border border-[#E8E8EA] rounded-[10px] px-[13px] py-2.5 text-xs outline-none bg-[#FAFAFA] focus:border-[#0A66C2] focus:bg-white"
            />
            <button
              onClick={handleLoadLinkedIn}
              disabled={isScraping || !linkedinUrl.trim()}
              className="bg-[#0A66C2] hover:bg-[#084F96] disabled:opacity-50 text-white rounded-[10px] px-4 py-2.5 text-[11.5px] font-extrabold transition-colors flex-shrink-0 cursor-pointer"
            >
              {isScraping ? (
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Importar perfil"
              )}
            </button>
          </div>

          {scrapedData && (
            <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-xs font-extrabold text-[#1E40AF]">Datos extraídos correctamente</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-[#A1A1AA]">Empresa</span>
                  <p className="font-bold text-gray-900">{scrapedData.company}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-[#A1A1AA]">Rol</span>
                  <p className="font-bold text-gray-900">{scrapedData.role}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-[#A1A1AA]">Industria</span>
                  <p className="font-bold text-gray-900">{scrapedData.industry}</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <span className="text-[#A1A1AA]">Tamaño</span>
                  <p className="font-bold text-gray-900">{scrapedData.employeeCount}</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Guardar en mi perfil
              </button>
            </div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="text-[12.5px] font-extrabold mb-2.5">Método de cobro</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setPaymentMethod("transferencia")}
              className={`rounded-[11px] p-[11px_13px] cursor-pointer text-left transition-colors ${
                paymentMethod === "transferencia"
                  ? "border-[1.5px] border-[#111113] bg-[#FAFAFA]"
                  : "border border-[#E8E8EA] hover:border-[#A1A1AA]"
              }`}
            >
              <div className={`text-[11.5px] font-extrabold ${paymentMethod === "transferencia" ? "text-[#111113]" : "text-[#52525B]"}`}>Transferencia</div>
              <div className={`text-[9.5px] mt-px ${paymentMethod === "transferencia" ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>Internacional · activo</div>
            </button>
            <button
              onClick={() => setPaymentMethod("paypal")}
              className={`rounded-[11px] p-[11px_13px] cursor-pointer text-left transition-colors ${
                paymentMethod === "paypal"
                  ? "border-[1.5px] border-[#111113] bg-[#FAFAFA]"
                  : "border border-[#E8E8EA] hover:border-[#A1A1AA]"
              }`}
            >
              <div className={`text-[11.5px] ${paymentMethod === "paypal" ? "font-extrabold text-[#111113]" : "font-bold text-[#52525B]"}`}>PayPal</div>
              <div className={`text-[9.5px] mt-px ${paymentMethod === "paypal" ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>Sin configurar</div>
            </button>
            <button
              onClick={() => setPaymentMethod("cripto")}
              className={`rounded-[11px] p-[11px_13px] cursor-pointer text-left transition-colors ${
                paymentMethod === "cripto"
                  ? "border-[1.5px] border-[#111113] bg-[#FAFAFA]"
                  : "border border-[#E8E8EA] hover:border-[#A1A1AA]"
              }`}
            >
              <div className={`text-[11.5px] ${paymentMethod === "cripto" ? "font-extrabold text-[#111113]" : "font-bold text-[#52525B]"}`}>Cripto (USDC)</div>
              <div className={`text-[9.5px] mt-px ${paymentMethod === "cripto" ? "text-[#71717A]" : "text-[#A1A1AA]"}`}>Sin configurar</div>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-3">
        {/* REFERRAL LINK */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span className="text-[12.5px] font-extrabold">Tu link de referidos</span>
          </div>
          <div className="text-[10.5px] text-[#71717A] leading-relaxed mb-2.5">
            Cada prospecto que entre por tu link queda atribuido a ti por 90 días. Sofía lo califica sola.
          </div>
          <div className="flex gap-[7px]">
            <div
              className="flex-1 bg-[#FAFAFA] border border-[#E8E8EA] rounded-[10px] px-3 py-2.5 text-[10.5px] text-[#3F3F46] whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {referralUrl || "getnexor.ai/r/6289A"}
            </div>
            <button
              onClick={() => {
                if (typeof window !== "undefined" && referralUrl) {
                  navigator.clipboard.writeText(referralUrl);
                }
              }}
              className="flex items-center gap-[5px] bg-[#111113] hover:bg-[#27272A] text-white rounded-[10px] px-[13px] py-2.5 text-[11px] font-extrabold transition-colors flex-shrink-0 cursor-pointer"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copiar
            </button>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[#F0F0F2]">
            <div>
              <div className="text-[9px] font-extrabold tracking-[1px] text-[#A1A1AA] uppercase">Clics</div>
              <div className="text-[17px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>128</div>
            </div>
            <div>
              <div className="text-[9px] font-extrabold tracking-[1px] text-[#A1A1AA] uppercase">Leads</div>
              <div className="text-[17px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>9</div>
            </div>
            <div>
              <div className="text-[9px] font-extrabold tracking-[1px] text-[#A1A1AA] uppercase">Cierres</div>
              <div className="text-[17px] font-bold text-[#56dfe0]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>1</div>
            </div>
          </div>
        </div>

        {/* BADGE SHOWCASE */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="text-[12.5px] font-extrabold mb-3">Vitrina de insignias</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-[5px] bg-[rgba(254,88,82,0.06)] border border-[#E8E8EA] rounded-xl p-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe5852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12 M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
              </svg>
              <span className="text-[9px] font-extrabold text-[#78350F] text-center leading-tight">
                Primera<br />venta
              </span>
            </div>
            <div className="flex flex-col items-center gap-[5px] bg-[rgba(254,88,82,0.06)] border border-[#E8E8EA] rounded-xl p-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fe5852" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span className="text-[9px] font-extrabold text-[#78350F] text-center leading-tight">
                Constructor<br />de cartera
              </span>
            </div>
            <div className="flex flex-col items-center gap-[5px] bg-[#FAFAFA] border border-dashed border-[#D4D4D8] rounded-xl p-3 opacity-60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[9px] font-extrabold text-[#71717A] text-center leading-tight">
                Vendedor<br />certificado
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
