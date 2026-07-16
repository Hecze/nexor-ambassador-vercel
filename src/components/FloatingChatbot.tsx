"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Minus } from "lucide-react";
import { usePathname } from "next/navigation";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "model", text: "¡Hola! 👋 Soy Sofía, tu asistente virtual de Nexor. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (pathname === "/dashboard/support") {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsMinimized(false);
        setMessages((prev) => {
          if (prev.some((m) => m.text.includes("quizás yo pueda resolver tu problema"))) return prev;
          return [
            ...prev,
            {
              role: "model",
              text: "Hola, quizás yo pueda resolver tu problema. Cuéntame qué necesitas y te ayudo al instante. Si no logro solucionarlo, te ayudaré a crear un ticket de soporte.",
            },
          ];
        });
      }, 800); // Reducido a 800ms para una reacción más rápida
      return () => clearTimeout(timer);
    }
  }, [pathname]);

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
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", text: data.text }]);
    } catch {
      setMessages((prev) => [...prev, { role: "model", text: "Tuve un error. ¿Reintentamos? Si el problema persiste, crea un ticket en Soporte." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-neutral-900 text-white shadow-xl hover:bg-neutral-800 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-80 transition-all ${isMinimized ? "h-12" : "h-[480px]"}`}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white rounded-t-2xl flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">N</div>
            <span className="text-xs font-bold">Sofía</span>
          </div>
          <div className="flex items-center space-x-1">
            <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded cursor-pointer">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
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
                  <div className="bg-white text-gray-400 text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 animate-pulse">
                    Escribiendo...
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="flex items-center space-x-2 px-4 py-3 border-t border-gray-150 bg-white flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu duda aquí..."
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-xs focus:border-neutral-900 outline-none bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full bg-neutral-900 p-2 text-white hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
