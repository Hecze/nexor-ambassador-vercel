import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { Message } from "@/lib/types";

interface AiSalesCoachProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export default function AiSalesCoach({
  messages,
  onSendMessage,
  isLoading,
}: AiSalesCoachProps) {
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleQuickQuestion = (text: string) => {
    if (isLoading) return;
    onSendMessage(text);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col h-[calc(100vh-14rem)] min-h-[600px] flex-1" id="coach-section">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
        <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sofía: Tu Coach de Ventas de Nexor</h2>
          <p className="text-xs text-gray-500">Agente experto en prospección, superación de objeciones y automatización de procesos comerciales.</p>
        </div>
      </div>

      {/* Historial de conversación */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1" id="coach-chat-history">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-neutral-900 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-900 border border-gray-200 rounded-tl-none"
              }`}
            >
              {/* Formateo de Markdown para respuestas elegantes del Coach */}
              <div className="space-y-2 text-left">
                {(() => {
                  const lines = msg.text.split("\n");
                  let inList = false;
                  const listItems: React.ReactNode[] = [];
                  const renderedBlocks: React.ReactNode[] = [];

                  const parseInlineMarkdown = (text: string) => {
                    const boldRegex = /\*\*(.*?)\*\*/g;
                    const parts: React.ReactNode[] = [];
                    let lastIndex = 0;
                    let match;

                    while ((match = boldRegex.exec(text)) !== null) {
                      if (match.index > lastIndex) {
                        parts.push(text.substring(lastIndex, match.index));
                      }
                      parts.push(
                        <strong key={match.index} className="font-extrabold text-neutral-900">
                          {match[1]}
                        </strong>
                      );
                      lastIndex = boldRegex.lastIndex;
                    }
                    if (lastIndex < text.length) {
                      parts.push(text.substring(lastIndex));
                    }
                    return parts.length > 0 ? parts : text;
                  };

                  lines.forEach((line, idx) => {
                    const trimmed = line.trim();
                    
                    // Manejar elementos de lista
                    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
                      const cleanText = trimmed.substring(2);
                      listItems.push(
                        <li key={`li-${idx}`} className="list-disc list-inside ml-3 pl-1 text-xs text-gray-800 leading-relaxed">
                          {parseInlineMarkdown(cleanText)}
                        </li>
                      );
                      inList = true;
                    } else {
                      // Si estábamos en una lista y entramos a un párrafo, renderizar la lista acumulada
                      if (inList && listItems.length > 0) {
                        renderedBlocks.push(
                          <ul key={`ul-${idx}`} className="space-y-1 my-1.5 list-disc list-inside">
                            {[...listItems]}
                          </ul>
                        );
                        listItems.length = 0;
                        inList = false;
                      }
                      
                      if (trimmed === "") {
                        renderedBlocks.push(<div key={`space-${idx}`} className="h-2" />);
                      } else {
                        renderedBlocks.push(
                          <p key={`p-${idx}`} className="text-xs leading-relaxed text-gray-800">
                            {parseInlineMarkdown(line)}
                          </p>
                        );
                      }
                    }
                  });

                  // Renderizar lista restante si existe al final del mensaje
                  if (inList && listItems.length > 0) {
                    renderedBlocks.push(
                      <ul key="ul-end" className="space-y-1 my-1.5 list-disc list-inside">
                        {[...listItems]}
                      </ul>
                    );
                  }

                  return renderedBlocks;
                })()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-150 rounded-2xl rounded-tl-none p-4 text-sm text-gray-500 animate-pulse">
              Sofía de Nexor está pensando en tu estrategia comercial...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Preguntas de ejemplo rápidas en la parte inferior */}
      <div className="pb-3 pt-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5 pl-1">Sugerencias rápidas</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickQuestion("¿Cómo vendo Nexor a una concesionaria de autos?")}
            disabled={isLoading}
            className="rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition-colors cursor-pointer text-left disabled:opacity-50"
            id="prompt-quick-auto"
          >
            🚗 Vender a Automotrices
          </button>
          <button
            onClick={() => handleQuickQuestion("Dame un guion de WhatsApp para una inmobiliaria")}
            disabled={isLoading}
            className="rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition-colors cursor-pointer text-left disabled:opacity-50"
            id="prompt-quick-inmobiliaria"
          >
            🏢 Mensaje para Inmobiliarias
          </button>
          <button
            onClick={() => handleQuickQuestion("¿Cómo respondo si dicen que la IA es impersonal?")}
            disabled={isLoading}
            className="rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs text-gray-700 transition-colors cursor-pointer text-left disabled:opacity-50"
            id="prompt-quick-objection"
          >
            💡 Rebatir "IA es fría"
          </button>
        </div>
      </div>

      {/* Campo de envío de mensajes */}
      <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Pregúntale a Sofía sobre técnicas de cierre o automatizaciones..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-3.5 text-xs focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none"
          id="input-coach-msg"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="rounded-full bg-neutral-900 p-3.5 text-white hover:bg-neutral-800 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          id="btn-send-coach-msg"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
