"use client";

import React, { useState } from "react";

interface VideoResource {
  id: string;
  title: string;
  duration: string;
  totalMinutes: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
  category: string;
  tags: string[];
  notes: string[];
  pdfName?: string;
  pdfSize?: string;
}

const RESOURCES: VideoResource[] = [
  {
    id: "vid-1",
    title: "1. Cómo vender la automatización de Nexor AI",
    duration: "4:12",
    totalMinutes: "18 min",
    thumbnail: "/thumbnails/001_como_vender.avif",
    description: "Aprende los conceptos básicos del pitch comercial de Nexor, cómo abordar objeciones comunes y el valor del lead qualification en menos de 60 segundos.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
    category: "Fundamentos",
    tags: ["Fundamentos", "18 min"],
    notes: [
      "Foco principal: El tiempo de respuesta de 60 segundos es el gancho clave.",
      "Los clientes potenciales valoran la integración con su stack existente (no reemplaza software).",
      "Mostrar siempre el ROI directo calculando la reducción de leads perdidos.",
      "Usa la demo interactiva para mostrar el flujo en vivo."
    ],
    pdfName: "guia_pitch_comercial_nexor.pdf",
    pdfSize: "1.4 MB"
  },
  {
    id: "vid-2",
    title: "2. Masterclass de Negocios y Cierre Corporativo",
    duration: "6:45",
    totalMinutes: "32 min",
    thumbnail: "/thumbnails/002_masterclass_negocios.avif",
    description: "Cómo negociar planes Enterprise ($1,500+/mes) y estructurar el contrato de débito automático.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
    category: "Cierre Enterprise",
    tags: ["Cierre Enterprise", "Pricing", "32 min"],
    notes: [
      "Los tickets de Nexor son hasta 6 veces más altos que los de Vambe debido a la automatización multicanal avanzada y voz realista.",
      "Enfocarse en grandes flujos (Automotriz, Inmobiliaria y SaaS).",
      "Explicar que la IA de voz incluye ruido de oficina de fondo para simular realismo humano.",
      "Estructurar propuestas prepago (leads prepago en alcancía) para asegurar valor recurrente."
    ],
    pdfName: "presentacion_ventas_enterprise.pdf",
    pdfSize: "2.8 MB"
  },
  {
    id: "vid-3",
    title: "3. Caso de Éxito: Mudango y el canal automotriz",
    duration: "5:20",
    totalMinutes: "14 min",
    thumbnail: "/thumbnails/003_caso_exito.avif",
    description: "Análisis del caso real de Mudango. Cómo pasaron de calificar leads manualmente a automatizar el 100% de la preventa de mudanzas.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
    category: "Casos reales",
    tags: ["Casos reales", "14 min"],
    notes: [
      "Mudango logró una tasa de conversión superior gracias al contacto inmediato vía WhatsApp y llamadas autónomas.",
      "La IA actúa como filtro para el equipo interno, evitando la sobrecarga en horas pico.",
      "La tasa de agendamiento autónomo en calendarios creció un 45%.",
      "Los clientes piloto reportan que algunos usuarios finales no se percatan de que hablan con una IA."
    ],
    pdfName: "caso_exito_mudango.pdf",
    pdfSize: "1.9 MB"
  }
];

export default function VideosPage() {
  const [activeVideo, setActiveVideo] = useState<VideoResource>(RESOURCES[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeIndex = RESOURCES.findIndex((v) => v.id === activeVideo.id);
  const completedCount = activeIndex;

  const getVideoStatus = (index: number): "visto" | "viendo" | null => {
    if (index < activeIndex) return "visto";
    if (index === activeIndex) return "viendo";
    return null;
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="grid gap-4 p-[18px_20px]" style={{ gridTemplateColumns: "minmax(0,1.6fr) 320px", alignItems: "start" }}>
        <div className="flex flex-col gap-3">
          <div className="bg-[#101018] rounded-2xl overflow-hidden relative">
            {isPlaying ? (
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full aspect-video"
              />
            ) : (
              <>
                <img
                  src={activeVideo.thumbnail}
                  alt={activeVideo.title}
                  className="w-full aspect-video object-cover block opacity-85"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-[62px] h-[62px] rounded-full bg-white/95 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] cursor-pointer transition-transform hover:scale-[1.06]"
                    onClick={() => setIsPlaying(true)}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#111113" className="ml-[3px]"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="absolute left-0 right-0 bottom-0 px-4 py-[14px]" style={{ background: "linear-gradient(transparent,rgba(0,0,0,0.75))" }}>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
                      <div className="w-[38%] h-full bg-[#FBBF24] rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {activeIndex === 1 ? "12:24 / 32:10" : `0:00 / ${activeVideo.duration}`}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-extrabold">{activeVideo.title.substring(3)}</div>
                <div className="text-[11px] text-[#71717A] mt-[3px]">{activeVideo.description}</div>
              </div>
              <span className="text-[9.5px] font-extrabold text-[#92400E] bg-[#FEF3C7] rounded-full px-2.5 py-1 flex-shrink-0">
                +20 XP al terminar
              </span>
            </div>
            <div className="flex gap-1.5 mt-[11px]">
              {activeVideo.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9.5px] font-bold text-[#52525B] bg-[#F4F4F5] rounded-full px-[9px] py-[3px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl overflow-hidden">
          <div className="px-4 py-[14px] border-b border-[#F0F0F2] text-xs font-extrabold">Temario de capacitación</div>

          {RESOURCES.map((video, index) => {
            const status = getVideoStatus(index);
            const isSelected = activeVideo.id === video.id;
            return (
              <div
                key={video.id}
                onClick={() => {
                  setActiveVideo(video);
                  setIsPlaying(false);
                }}
                className="flex gap-[11px] px-4 py-3 border-b border-[#F6F6F7] cursor-pointer transition-colors hover:bg-[#FAFAFA]"
                style={isSelected && status === "viendo" ? { background: "#EEF2FF", boxShadow: "inset 3px 0 0 #4F46E5" } : undefined}
              >
                <div className="relative w-[92px] flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-[92px] aspect-video object-cover rounded-lg block"
                  />
                  {status === "visto" && (
                    <div className="absolute right-1 bottom-1 bg-[#059669] rounded-[5px] px-[5px] py-px flex items-center gap-[3px]">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      <span className="text-[8px] font-extrabold text-white">VISTO</span>
                    </div>
                  )}
                  {status === "viendo" && (
                    <div className="absolute right-1 bottom-1 bg-[#4F46E5] rounded-[5px] px-[5px] py-px">
                      <span className="text-[8px] font-extrabold text-white">VIENDO</span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[11.5px] font-extrabold leading-[1.35]"
                    style={{ color: status === "viendo" ? "#312E81" : "#111113" }}
                  >
                    {video.title}
                  </div>
                  <div
                    className="text-[9.5px] mt-[3px]"
                    style={{ color: status === "viendo" ? "#4338CA" : "#71717A", fontWeight: status === "viendo" ? 700 : 400 }}
                  >
                    {status === "viendo" ? "32 min · vas en 12:24" : `${video.totalMinutes} · ${video.category}`}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="m-3 mb-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" /></svg>
            <span className="text-[10.5px] text-[#78350F] font-semibold leading-[1.5]">
              Termina los 3 videos y desbloquea la insignia <strong>Vendedor Certificado Nexor</strong> · +60 XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
