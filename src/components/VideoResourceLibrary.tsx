import React, { useState } from "react";
import { Play, FileText, ChevronRight, Check, BookOpen } from "lucide-react";

interface VideoResource {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
  notes: string[];
  pdfName?: string;
  pdfSize?: string;
}

const RESOURCES: VideoResource[] = [
  {
    id: "vid-1",
    title: "1. Cómo vender la automatización de Nexor AI",
    duration: "4:12",
    thumbnail: "/thumbnails/001_como_vender.avif",
    description: "Aprende los conceptos básicos del pitch comercial de Nexor, cómo abordar objeciones comunes y el valor del lead qualification en menos de 60 segundos.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
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
    thumbnail: "/thumbnails/002_masterclass_negocios.avif",
    description: "Estrategias de negociación avanzadas para cerrar cuentas grandes de nivel enterprise y la justificación del ticket promedio contra competidores de bajo valor.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
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
    thumbnail: "/thumbnails/003_caso_exito.avif",
    description: "Análisis del caso real de Mudango. Cómo pasaron de calificar leads manualmente a automatizar el 100% de la preventa de mudanzas.",
    videoUrl: "https://www.youtube.com/embed/qQP7-th2ilI?autoplay=1",
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

export default function VideoResourceLibrary() {
  const [activeVideo, setActiveVideo] = useState<VideoResource>(RESOURCES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<string | null>(null);

  const handleDownloadPdf = (pdfName: string) => {
    setPdfDownloaded(pdfName);
    setTimeout(() => setPdfDownloaded(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left" id="video-resources-section">
      {/* Reproductor Activo & Notas (Izquierda) */}
      <div className="lg:col-span-8 space-y-5">
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-xs">
          {/* Contenedor del video */}
          <div className="aspect-video bg-black relative">
            {isPlaying ? (
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center justify-center cursor-pointer group"
                style={{ backgroundImage: `url(${activeVideo.thumbnail})` }}
                onClick={() => setIsPlaying(true)}
              >
                <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-neutral-950/40 transition-colors" />
                
                {/* Play Button */}
                <div className="relative z-10 h-16 w-16 bg-white text-neutral-950 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                  <Play className="h-6 w-6 fill-current ml-1" />
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-4 right-4 bg-neutral-950/80 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-xs">
                  {activeVideo.duration}
                </span>
              </div>
            )}
          </div>

          {/* Información del Video */}
          <div className="p-6 border-b border-gray-100 space-y-2">
            <h2 className="text-lg font-bold text-gray-900">{activeVideo.title}</h2>
            <p className="text-xs text-gray-500 leading-relaxed">{activeVideo.description}</p>
          </div>

          {/* Notas y Acciones de la Clase */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 border-t border-gray-100">
            {/* Notas clave estructuradas */}
            <div className="space-y-3">
              <div className="flex items-center space-x-1.5">
                <BookOpen className="h-4 w-4 text-neutral-800" />
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Notas y Resumen Clave</h4>
              </div>
              <ul className="space-y-2">
                {activeVideo.notes.map((note, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 mt-1.5 flex-shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recurso Adicional (PDF Guía de Ventas) */}
            {activeVideo.pdfName && (
              <div className="border border-gray-200/80 rounded-2xl bg-white p-4.5 flex flex-col justify-between space-y-4 shadow-3xs">
                <div className="space-y-3">
                  <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-rose-100">
                    Recurso Adicional
                  </span>
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 flex-shrink-0">
                      <FileText className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 truncate" title={activeVideo.pdfName}>{activeVideo.pdfName}</h5>
                      <p className="text-[10px] text-gray-400 font-semibold">{activeVideo.pdfSize} · Documento PDF</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadPdf(activeVideo.pdfName!)}
                  className={`w-full inline-flex items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-98 border ${
                    pdfDownloaded === activeVideo.pdfName
                      ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                      : "bg-neutral-950 border-neutral-950 text-white hover:bg-neutral-900"
                  }`}
                >
                  {pdfDownloaded === activeVideo.pdfName ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Descargado con Éxito</span>
                    </>
                  ) : (
                    <span>Descargar Guía Relacionada</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista Lateral de Videos (Derecha) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Temario de Capacitación</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Mira los videos para dominar la venta de Nexor AI.</p>
          </div>

          <div className="space-y-3">
            {RESOURCES.map((video) => {
              const isSelected = activeVideo.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => {
                    setActiveVideo(video);
                    setIsPlaying(false);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex space-x-3 text-left ${
                    isSelected
                      ? "bg-neutral-50 border-neutral-900 ring-1 ring-neutral-900"
                      : "bg-white border-gray-150 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  {/* Thumbnail pequeña */}
                  <div 
                    className="h-14 w-20 rounded-lg bg-cover bg-center relative flex-shrink-0 overflow-hidden border border-gray-100"
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-neutral-950/10" />
                    <span className="absolute bottom-1 right-1 bg-neutral-950/80 text-white text-[8px] px-1 rounded-sm">
                      {video.duration}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <p className={`text-xs font-bold truncate ${isSelected ? "text-neutral-950" : "text-gray-900"}`}>
                      {video.title.substring(3)}
                    </p>
                    <p className="text-[9px] text-gray-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
