"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";

export default function CoachPage() {
  const { coachMessages, sendCoachMessage, isCoachLoading } = useDashboard();
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [coachMessages]);

  const handleSend = () => {
    if (!input.trim() || isCoachLoading) return;
    sendCoachMessage(input.trim());
    setInput("");
  };

  const handleQuickQuestion = (text: string) => {
    if (isCoachLoading) return;
    sendCoachMessage(text);
  };

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

  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    let inList = false;
    const listItems: React.ReactNode[] = [];
    const renderedBlocks: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const cleanText = trimmed.substring(2);
        listItems.push(
          <li
            key={`li-${idx}`}
            className="list-disc list-inside ml-3 pl-1 text-xs text-gray-800 leading-relaxed"
          >
            {parseInlineMarkdown(cleanText)}
          </li>
        );
        inList = true;
      } else {
        if (inList && listItems.length > 0) {
          renderedBlocks.push(
            <ul
              key={`ul-${idx}`}
              className="space-y-1 my-1.5 list-disc list-inside"
            >
              {[...listItems]}
            </ul>
          );
          listItems.length = 0;
          inList = false;
        }
        if (trimmed === "") {
          renderedBlocks.push(
            <div key={`space-${idx}`} className="h-2" />
          );
        } else {
          renderedBlocks.push(
            <p
              key={`p-${idx}`}
              className="text-xs leading-relaxed text-gray-800"
            >
              {parseInlineMarkdown(line)}
            </p>
          );
        }
      }
    });

    if (inList && listItems.length > 0) {
      renderedBlocks.push(
        <ul
          key="ul-end"
          className="space-y-1 my-1.5 list-disc list-inside"
        >
          {[...listItems]}
        </ul>
      );
    }

    return renderedBlocks;
  };

  return (
    <div className="h-full p-[18px]">
      <div
        className="h-full grid gap-4"
        style={{
          gridTemplateColumns: "minmax(0, 1fr) 300px",
        }}
      >
        {/* LEFT: Chat panel */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl flex flex-col overflow-hidden min-h-0">
          {/* Chat header */}
          <div className="flex items-center gap-[11px] px-4 py-[13px] border-b border-[#F0F0F2] flex-shrink-0">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #111113, #A855F7)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#fff"
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
              </div>
              <span className="absolute right-0 bottom-0 w-[9px] h-[9px] rounded-full bg-[#56dfe0] border-2 border-white" />
            </div>
            <div>
              <div className="text-[13px] font-extrabold text-[#111113]">Sofía</div>
              <div className="text-[10px] text-[#56dfe0] font-bold">
                En línea · recuerda tus conversaciones
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-[18px] px-4 flex flex-col gap-3 bg-[#FCFCFD]">
            {coachMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "coach" ? (
                  <div className="flex gap-[9px] max-w-[78%]">
                    <div
                      className="w-[26px] h-[26px] rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #111113, #A855F7)",
                      }}
                    >
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="#fff"
                      >
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                      </svg>
                    </div>
                    <div className="bg-white border border-[#EAEAEC] rounded-[3px_14px_14px_14px] px-[14px] py-[11px] text-[12.5px] leading-[1.55] text-[#27272A]">
                      <div className="space-y-2 text-left">
                        {renderMessageText(msg.text)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[78%] bg-[#111113] text-white rounded-[14px_3px_14px_14px] px-[14px] py-[11px] text-[12.5px] leading-[1.55]">
                    {msg.text}
                  </div>
                )}
              </div>
            ))}

            {isCoachLoading && (
              <div className="flex justify-start">
                <div className="flex gap-[9px] max-w-[78%]">
                  <div
                    className="w-[26px] h-[26px] rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #111113, #A855F7)",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="#fff"
                    >
                      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                    </svg>
                  </div>
                  <div className="bg-white border border-[#EAEAEC] rounded-[3px_14px_14px_14px] px-[14px] py-[11px] text-[12.5px] text-[#71717A] animate-pulse">
                    Sofía está pensando en tu estrategia comercial...
                  </div>
                </div>
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>

          {/* Input area */}
          <div className="px-[14px] py-3 border-t border-[#F0F0F2] bg-white flex-shrink-0">
            {/* Suggestion chips */}
            <div className="flex gap-[6px] mb-[9px] flex-wrap">
              <button
                onClick={() =>
                  handleQuickQuestion(
                    "¿Cómo manejo la objeción de precio cuando dicen que es caro?"
                  )
                }
                disabled={isCoachLoading}
                className="bg-[#F4F4F5] border-none rounded-full px-[11px] py-[5px] text-[10.5px] font-bold text-[#52525B] font-sans cursor-pointer hover:bg-[#E8E8EA] transition-colors disabled:opacity-50"
              >
                Manejo de objeción
              </button>
              <button
                onClick={() =>
                  handleQuickQuestion(
                    "Dame un pitch de ventas de 30 segundos para Nexor"
                  )
                }
                disabled={isCoachLoading}
                className="bg-[#F4F4F5] border-none rounded-full px-[11px] py-[5px] text-[10.5px] font-bold text-[#52525B] font-sans cursor-pointer hover:bg-[#E8E8EA] transition-colors disabled:opacity-50"
              >
                Pitch 30 segundos
              </button>
              <button
                onClick={() =>
                  handleQuickQuestion(
                    "Enséñame una técnica de cierre con urgencia"
                  )
                }
                disabled={isCoachLoading}
                className="bg-[#F4F4F5] border-none rounded-full px-[11px] py-[5px] text-[10.5px] font-bold text-[#52525B] font-sans cursor-pointer hover:bg-[#E8E8EA] transition-colors disabled:opacity-50"
              >
                Cierre con urgencia
              </button>
            </div>

            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pregúntale a Sofía sobre técnicas de cierre..."
                className="flex-1 border border-[#E8E8EA] rounded-[11px] px-[14px] py-[11px] text-[12.5px] font-sans outline-none bg-[#FAFAFA] focus:border-[#111113] focus:bg-white transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isCoachLoading}
                className="w-[42px] h-[42px] rounded-[11px] bg-[#111113] border-none flex items-center justify-center cursor-pointer flex-shrink-0 hover:bg-[#111113] transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar rail */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {/* Entrenamientos del día */}
          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
            <div
              className="text-[11px] font-extrabold tracking-[1px] uppercase text-[#52525B] mb-[10px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Entrenamientos del día
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="/dashboard/simulator"
                className="flex items-center gap-[10px] bg-[#FAFAFA] border border-[#F0F0F2] rounded-[11px] px-3 py-[10px] hover:border-[#C7C7CC] transition-colors"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[rgba(254,88,82,0.08)] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fe5852"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-extrabold text-[#111113]">
                    Simula la llamada con Marcos
                  </div>
                  <div className="text-[9.5px] text-[#71717A]">
                    Objeción de quincena · 5 min
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-[#111113] bg-[rgba(254,88,82,0.08)] rounded-full px-[7px] py-[2px] flex-shrink-0">
                  +15 XP
                </span>
              </a>

              <a
                href="/dashboard/resources"
                className="flex items-center gap-[10px] bg-[#FAFAFA] border border-[#F0F0F2] rounded-[11px] px-3 py-[10px] hover:border-[#C7C7CC] transition-colors cursor-pointer"
              >
                <div className="w-[30px] h-[30px] rounded-[9px] bg-[#F4F4F5] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111113"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-extrabold text-[#111113]">
                    Repasa el pitch inmobiliario
                  </div>
                  <div className="text-[9.5px] text-[#71717A]">
                    Para Inmobiliaria Horizons
                  </div>
                </div>
                <span className="text-[9px] font-extrabold text-[#111113] bg-[rgba(254,88,82,0.08)] rounded-full px-[7px] py-[2px] flex-shrink-0">
                  +10 XP
                </span>
              </a>
            </div>
          </div>

          {/* Sofía sabe de ti */}
          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
            <div
              className="text-[11px] font-extrabold tracking-[1px] uppercase text-[#52525B] mb-[10px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Sofía sabe de ti
            </div>
            <div className="flex flex-col gap-2 text-[11px] text-[#52525B] leading-[1.5]">
              <div className="flex gap-2">
                <span className="text-[#56dfe0] font-extrabold flex-shrink-0">
                  ·
                </span>
                <span>
                  Tu cartera: 5 empresas, fuerte en{" "}
                  <strong className="text-[#111113]">automotriz e inmobiliaria</strong>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#56dfe0] font-extrabold flex-shrink-0">
                  ·
                </span>
                <span>
                  Tu mejor cierre:{" "}
                  <strong className="text-[#111113]">
                    Automotores del Sur ($900 MRR)
                  </strong>
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[#fe5852] font-extrabold flex-shrink-0">
                  ·
                </span>
                <span>
                  Área de mejora:{" "}
                  <strong className="text-[#111113]">
                    seguimiento post-demo
                  </strong>{" "}
                  (2 leads sin contactar)
                </span>
              </div>
            </div>
          </div>

          {/* Mission prompt */}
          <div className="bg-[#F4F4F5] border border-[#E8E8EA] rounded-2xl p-[14px] flex items-center gap-[11px]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111113"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z" />
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
            </svg>
            <div className="text-[10.5px] text-[#111113] leading-[1.5] font-semibold">
              Completa 10 chats con Sofía y desbloquea la misión{" "}
              <strong>Alumno estrella</strong> · vas 7/10
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
