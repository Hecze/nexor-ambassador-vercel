"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Sparkles, Building, Briefcase, Users, TrendingUp, Zap, Clock, CheckCircle2 } from "lucide-react";
import NexorLogo from "@/components/NexorLogo";

interface Msg {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  { icon: Building, text: "Soy del sector automotriz y vendo vehículos" },
  { icon: Users, text: "Tengo una inmobiliaria o agencia de bienes raíces" },
  { icon: Briefcase, text: "Mi empresa es SaaS o tecnología B2B" },
  { icon: TrendingUp, text: "Clínica de salud, estética o bienestar" },
];

export default function ReferralPage() {
  const params = useParams();
  const partnerId = params.partnerId as string;
  const [messages, setMessages] = useState<Msg[]>([
    { role: "model", text: "¡Hola! 👋 Soy Sofía, la IA comercial de Nexor.\n\nEstoy aquí para entender tu negocio y mostrarte cómo podemos automatizar la atención de tus leads, calificarlos al instante y agendar reuniones por ti — todo 24/7 sin que pierdas una sola oportunidad.\n\nPara empezar, cuéntame un poco sobre tu empresa: ¿en qué industria operan y qué tipo de clientes atienden?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, partnerId }),
      });
      const data = await res.json();
      if (data.text) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      }
      if (data.registered) {
        setRegistered(true);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "model", text: "Perdón, tuve un pequeño error. ¿Podemos continuar? Cuéntame de tu empresa." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Inter', sans-serif" }}>
        <div className="bg-white border border-[#E8E8EA] rounded-3xl p-10 text-center space-y-5 shadow-sm animate-fade-in max-w-[440px] w-full">
          <div className="w-20 h-20 rounded-full bg-[#ECFDF5] border-[3px] border-[#A7F3D0] flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-[#059669]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ¡Registro completado!
            </h2>
            <p className="text-sm text-[#71717A] max-w-sm mx-auto leading-relaxed">
              Ya tenemos todos los datos de tu empresa. Un asesor de Nexor se pondrá en contacto contigo pronto para mostrarte una demo personalizada según tu industria y volumen de leads.
            </p>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <div className="text-lg font-bold text-[#059669]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>24/7</div>
              <div className="text-[10px] text-[#71717A]">Respuesta automática</div>
            </div>
            <div className="w-px h-8 bg-[#E8E8EA]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#059669]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+38%</div>
              <div className="text-[10px] text-[#71717A]">Más leads calificados</div>
            </div>
            <div className="w-px h-8 bg-[#E8E8EA]" />
            <div className="text-center">
              <div className="text-lg font-bold text-[#059669]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>-70%</div>
              <div className="text-[10px] text-[#71717A]">Tiempo del equipo</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-[#E8E8EA] bg-white h-[60px] flex items-center justify-between px-5 flex-shrink-0">
        <NexorLogo className="h-[26px] w-auto" />
        <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]">Con tecnología de IA · Nexor</span>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[720px]">
          {messages.length <= 1 ? (
            <div className="space-y-5">
              <div className="text-center space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-extrabold text-amber-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  Nexor para Empresas
                </span>
                <h1 className="text-[28px] font-bold tracking-[-0.5px] text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Cuéntanos sobre tu empresa
                </h1>
                <p className="text-sm text-[#71717A] max-w-md mx-auto leading-relaxed">
                  Sofía, nuestra IA comercial, adaptará Nexor a tu industria, tu tamaño de equipo y tus necesidades de ventas. Solo necesitamos conocerte un poco mejor.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SUGGESTIONS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.text}
                      onClick={() => handleSend(s.text)}
                      className="bg-white border border-[#E8E8EA] rounded-2xl p-4 text-left hover:border-[#111113] hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-[34px] h-[34px] rounded-xl bg-[#F4F4F5] flex items-center justify-center flex-shrink-0 group-hover:bg-[#111113] transition-colors">
                          <Icon className="h-[15px] w-[15px] text-[#52525B] group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <div className="text-[12px] font-extrabold text-[#111113]">{s.text}</div>
                          <div className="text-[10px] text-[#A1A1AA] mt-0.5">Click para empezar</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="bg-white border border-[#E8E8EA] rounded-xl p-3.5 text-center">
                  <Zap className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                  <div className="text-[10px] font-extrabold text-[#111113]">Respuesta 24/7</div>
                  <div className="text-[9px] text-[#A1A1AA] mt-0.5">Tus leads nunca esperan</div>
                </div>
                <div className="bg-white border border-[#E8E8EA] rounded-xl p-3.5 text-center">
                  <Clock className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                  <div className="text-[10px] font-extrabold text-[#111113]">Calificación instantánea</div>
                  <div className="text-[9px] text-[#A1A1AA] mt-0.5">+38% más reuniones</div>
                </div>
                <div className="bg-white border border-[#E8E8EA] rounded-xl p-3.5 text-center">
                  <Users className="h-4 w-4 text-indigo-500 mx-auto mb-1" />
                  <div className="text-[10px] font-extrabold text-[#111113]">Agenda reuniones</div>
                  <div className="text-[9px] text-[#A1A1AA] mt-0.5">Directo en tu calendario</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white border border-[#E8E8EA] rounded-2xl px-4 py-3">
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-[30px] h-[30px] rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-[14px] w-[14px] text-amber-600" />
                  </div>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="O escríbele a Sofía directamente..."
                    className="flex-1 text-[12px] font-semibold text-[#111113] placeholder-[#A1A1AA] outline-none bg-transparent"
                  />
                </div>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="rounded-xl bg-[#111113] p-2.5 text-white hover:bg-[#27272A] disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8E8EA] rounded-3xl shadow-xs overflow-hidden">
              <div className="bg-[#0B0B0E] p-4 text-white flex items-center space-x-3">
                <div className="h-[38px] w-[38px] rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Sparkles className="h-[17px] w-[17px] text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold">Sofía</p>
                  <p className="text-[10px] text-[#71717A]">Asistente Virtual · Nexor AI</p>
                </div>
              </div>

              <div className="h-[420px] overflow-y-auto p-4 space-y-3" style={{ background: "#FAFAFA" }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#111113] text-white rounded-br-sm"
                        : "bg-white text-[#3F3F46] border border-[#E8E8EA] rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-[#A1A1AA] text-xs px-4 py-2.5 rounded-2xl border border-[#E8E8EA] animate-pulse">
                      Sofía está escribiendo...
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <div className="flex items-center space-x-2 px-4 py-3 border-t border-[#F0F0F2]">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu respuesta..."
                  className="flex-1 rounded-full border border-[#E8E8EA] px-4 py-2.5 text-xs font-semibold text-[#111113] placeholder-[#A1A1AA] focus:border-neutral-900 outline-none bg-white"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="rounded-full bg-[#111113] p-2.5 text-white hover:bg-[#27272A] disabled:opacity-40 transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
