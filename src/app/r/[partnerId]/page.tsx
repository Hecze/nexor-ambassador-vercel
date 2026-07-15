"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { Send, Sparkles, MessageSquare, Building, Mail, User, ArrowRight } from "lucide-react";
import NexorLogo from "@/components/NexorLogo";

interface Msg {
  role: "user" | "model";
  text: string;
}

export default function ReferralPage() {
  const params = useParams();
  const partnerId = params.partnerId as string;
  const [messages, setMessages] = useState<Msg[]>([
    { role: "model", text: "¡Hola! 👋 Soy Sofía, la asistente virtual de Nexor AI.\n\nMe han contado que te interesa mejorar la forma en que tu empresa atiende y califica leads. Nexor es un ecosistema de automatización inteligente que responde al instante 24/7 por WhatsApp, llamadas, email, Instagram y más.\n\nCuéntame un poco sobre tu empresa: ¿cuál es tu nombre, cuál es tu cargo y en qué industria operan?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsLoading(true);

    try {
      const history = messages.slice(-8).map((m) => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history,
          partnerId,
        }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);

      if (data.registered && !registered) {
        setRegistered(true);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "model", text: "Perdón, tuve un pequeño error. ¿Podemos continuar? Cuéntame de tu empresa." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex flex-col">
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
        <NexorLogo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-bold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sofía — IA de Nexor</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Transforma tus leads en ventas automáticamente
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Nexor califica prospectos y agenda reuniones por ti, 24/7, sin reemplazar tu CRM actual.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl shadow-xs overflow-hidden">
            <div className="bg-neutral-900 p-4 text-white flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Sofía</p>
                <p className="text-[10px] text-neutral-400">Asistente Virtual · Nexor AI</p>
              </div>
              {registered && (
                <span className="ml-auto bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Registrado ✓
                </span>
              )}
            </div>

            <div className="h-[400px] overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 text-xs px-4 py-3 rounded-2xl border border-gray-200 animate-pulse">
                    Sofía está escribiendo...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="flex items-center space-x-2 px-4 py-3 border-t border-gray-100">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu respuesta aquí..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-xs focus:border-neutral-900 outline-none bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-neutral-900 p-2.5 text-white hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <p className="text-center text-[11px] text-gray-400">
            Al chatear con Sofía, aceptas que tus datos sean compartidos con el partner de Nexor que te refirió.
          </p>
        </div>
      </main>
    </div>
  );
}
