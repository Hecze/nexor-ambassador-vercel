import React, { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Trophy, BookOpen, User, Phone, CheckCircle, XCircle, Send, ChevronRight, ArrowLeft, Building, Users, Search, HelpCircle, Volume2, Mic, Check, PhoneOff, Video, MessageSquare, Hand, MoreVertical, ChevronUp } from "lucide-react";
import { Prospect } from "@/lib/types";

import Vapi from "@vapi-ai/web";

interface Simulation {
  id: string;
  clientName: string;
  role: string;
  industry: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  companyName: string;
  employeeCount: string;
  goals: string[];
  objections: string[];
  initialPrompt: string;
}

interface SimulationHistoryItem {
  id: string;
  clientName: string;
  industry: string;
  score: number;
  date: string;
  status: "Aprobado" | "Fayado";
  feedback: {
    good: string[];
    opportunities: string[];
  };
}

interface SalesSimulatorProps {
  prospects: Prospect[];
}

// Instantiate Vapi Web SDK lazily outside component scope
const vapiApiKey = (import.meta as any).env?.VITE_VAPI_API_KEY || "";
const vapiAssistantId = (import.meta as any).env?.VITE_VAPI_ASSISTANT_ID || "";
let vapiInstance: any = null;

if (vapiApiKey) {
  vapiInstance = new Vapi(vapiApiKey);
}

export default function SalesSimulator({ prospects }: SalesSimulatorProps) {
  // Navigation: list, calling, analyzing, feedback
  const [simulationState, setSimulationState] = useState<"list" | "calling" | "analyzing" | "feedback">("calling");
  const [selectedSim, setSelectedSim] = useState<Simulation | null>(null);
  const [showClientPanel, setShowClientPanel] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  // Custom generator fields
  const [customIndustry, setCustomIndustry] = useState("Automotriz & Concesionarias");
  const [customRole, setCustomRole] = useState("Gerente Comercial");
  const [customEmployees, setCustomEmployees] = useState("50-200 empleados");
  const [customCompany, setCustomCompany] = useState("");
  const [customName, setCustomName] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isScraping, setIsScraping] = useState(false);

  // Audio configuration states (Google Meet layout controls)
  const [selectedMic, setSelectedMic] = useState("Micrófono Predeterminado");
  const [selectedSpeaker, setSelectedSpeaker] = useState("Altavoz Predeterminado");
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isCcActive, setIsCcActive] = useState(true);

  // Dropdown lists toggle for audio/speakers in Google Meet bar
  const [showMicDropdown, setShowMicDropdown] = useState(false);
  const [showSpeakerDropdown, setShowSpeakerDropdown] = useState(false);

  // Dropdown lists content retrieved dynamically from navigator.mediaDevices
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);

  // Hover state for Mic menu to transition sound bars to ChevronUp
  const [isMicHovered, setIsMicHovered] = useState(false);

  // Audio detection state for active talking icon
  const [isUserSpeakingSim, setIsUserSpeakingSim] = useState(false);

  const [history, setHistory] = useState<SimulationHistoryItem[]>([
    {
      id: "hist-1",
      clientName: "Javier Ortega",
      industry: "Automotriz (Nexor SUV)",
      score: 85,
      date: "Ayer",
      status: "Aprobado",
      feedback: {
        good: [
          "Identificaste correctamente los cuellos de botella de llamadas perdidas.",
          "Explicaste con precisión que el tiempo de contacto en 60s eleva la tasa de conversión en 39%."
        ],
        opportunities: [
          "Ofreciste flexibilidad de precios en el minuto 2:15 sin que el cliente lo pidiera formalmente.",
          "No preguntaste qué CRM utilizan actualmente."
        ]
      }
    }
  ]);

  useEffect(() => {
    if (hasAutoStarted) return;
    if (prospects.length > 0) {
      setHasAutoStarted(true);
      const p = prospects[0];
      const sim: Simulation = {
        id: "auto-" + p.id,
        clientName: p.name,
        role: "Gerente Comercial",
        industry: p.industry,
        difficulty: "Medio",
        companyName: p.company,
        employeeCount: "50-200 empleados",
        goals: ["Usar la Técnica del Eco", "Preguntar por su stack de herramientas", "Evidenciar ROI en menos de 60 segundos", "Evitar descuentos prematuros", "Cerrar agenda de demo"],
        objections: ["El servicio de Nexor parece costoso", "Nos preocupa la calidez de la voz IA"],
        initialPrompt: `Hola, habla ${p.name} de ${p.company}. Me dijeron que eres partner de Nexor AI. La verdad estamos evaluando opciones. ¿Por qué deberíamos elegirlos a ustedes?`,
      };
      setSelectedSim(sim);
      setDialogue([{ role: "client", text: sim.initialPrompt }]);
      setCurrentGoalProgress(new Array(sim.goals.length).fill(false));
      setTimeLeft(240);
    } else if (prospects.length === 0 && prospects !== undefined) {
      setHasAutoStarted(true);
      setSimulationState("list");
    }
  }, [prospects, hasAutoStarted]);

  // Live call states
  const [dialogue, setDialogue] = useState<{ role: "client" | "user"; text: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(240); // 4 mins
  const [currentGoalProgress, setCurrentGoalProgress] = useState<boolean[]>([]);
  const [isSending, setIsSending] = useState(false);

  // Simulated live wave animation ticks
  const [waveHeights, setWaveHeights] = useState<number[]>([20, 40, 15, 30, 50, 25, 45, 10, 35, 20, 40, 15, 30]);

  // Vapi events tracking
  useEffect(() => {
    if (!vapiInstance) return;

    const onCallStart = () => {
      console.log("Vapi Call started successfully");
      setIsSending(false);
    };

    const onCallEnd = () => {
      console.log("Vapi Call ended");
      handleEndCallCleanup();
    };

    const onMessage = (message: any) => {
      // Listen to speech transcription message from Vapi
      if (message.type === "transcript") {
        const text = message.transcript;
        const role = message.role === "assistant" ? "client" : "user";
        
        if (message.transcriptType === "final" && text.trim()) {
          setDialogue((prev) => {
            // Avoid duplicate transcripts
            const last = prev[prev.length - 1];
            if (last && last.role === role && last.text === text) {
              return prev;
            }
            return [...prev, { role, text }];
          });

          // Check objectives dynamically in user speech transcript
          if (role === "user") {
            const textLower = text.toLowerCase();
            setCurrentGoalProgress((prev) => {
              const updated = [...prev];
              if (selectedSim && selectedSim.goals.length > 0) {
                if (textLower.includes("eco") || textLower.includes("entiendo") || textLower.includes("mencionas")) {
                  updated[0] = true;
                }
                if (textLower.includes("herramienta") || textLower.includes("cuántas") || textLower.includes("canal") || textLower.includes("dónde") || textLower.includes("crm")) {
                  updated[1] = true;
                }
                if (textLower.includes("60 segund") || textLower.includes("contacto") || textLower.includes("integración") || textLower.includes("minut") || textLower.includes("inmediat")) {
                  updated[2] = true;
                }
                if (textLower.includes("descuento") || textLower.includes("rebaja") || textLower.includes("barato")) {
                  updated[3] = false;
                } else {
                  updated[3] = true;
                }
                if (textLower.includes("reunión") || textLower.includes("agenda") || textLower.includes("demo") || textLower.includes("llamada") || textLower.includes("videollamada")) {
                  updated[4] = true;
                }
              }
              return updated;
            });
          }
        }
      }

      // Check audio status activity
      if (message.type === "speech-update") {
        if (message.status === "started") {
          setIsUserSpeakingSim(true);
        } else if (message.status === "stopped") {
          setIsUserSpeakingSim(false);
        }
      }
    };

    vapiInstance.on("call-start", onCallStart);
    vapiInstance.on("call-end", onCallEnd);
    vapiInstance.on("message", onMessage);

    return () => {
      if (vapiInstance) {
        vapiInstance.off("call-start", onCallStart);
        vapiInstance.off("call-end", onCallEnd);
        vapiInstance.off("message", onMessage);
      }
    };
  }, [selectedSim]);

  // Load hardware devices list dynamically
  useEffect(() => {
    async function getDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
        const devices = await navigator.mediaDevices.enumerateDevices();
        
        const mics = devices.filter(d => d.kind === "audioinput");
        const speakers = devices.filter(d => d.kind === "audiooutput");
        
        setAudioInputDevices(mics);
        setAudioOutputDevices(speakers);

        if (mics.length > 0) {
          setSelectedMic(mics[0].label || `Micrófono (${mics[0].deviceId.substring(0,5)})`);
        }
        if (speakers.length > 0) {
          setSelectedSpeaker(speakers[0].label || `Altavoz (${speakers[0].deviceId.substring(0,5)})`);
        }
      } catch (err) {
        console.warn("Media devices not accessible:", err);
      }
    }
    getDevices();
  }, []);

  useEffect(() => {
    let timer: any;
    if (simulationState === "calling" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setWaveHeights(Array.from({ length: 16 }, () => Math.floor(Math.random() * 45) + 8));
      }, 1000);
    } else if (timeLeft === 0 && simulationState === "calling") {
      handleEndCall();
    }
    return () => clearInterval(timer);
  }, [simulationState, timeLeft]);

  // Run Apify LinkedIn simulated scraper
  const handleApifyScrape = async () => {
    if (!linkedinUrl.trim()) {
      alert("Por favor ingresa un link de perfil de LinkedIn válido.");
      return;
    }
    setIsScraping(true);
    try {
      const response = await fetch("/api/apify/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl: linkedinUrl, clientName: customName })
      });
      const data = await response.json();
      if (data) {
        setCustomName(data.name || "Contacto Scrapeado");
        setCustomRole(data.role || "VP de Compras");
        setCustomCompany(data.company || "Corporativo Enterprise");
        setCustomIndustry(data.industry || "Servicios & SaaS");
        setCustomEmployees(data.employeeCount || "100-500 empleados");
        alert("¡Datos extraídos con éxito de LinkedIn usando Apify! Revisa y edita los campos si es necesario.");
      }
    } catch (e) {
      console.error(e);
      alert("Error al simular scraping de Apify. Se aplicarán datos demo predeterminados.");
    } finally {
      setIsScraping(false);
    }
  };

  // Populate from existing CRM lead
  const handleSelectProspect = (prospect: Prospect) => {
    setCustomName(prospect.name || "Contacto");
    setCustomCompany(prospect.company || "Empresa Clave");
    setCustomIndustry(prospect.industry || "General");
    setCustomRole("Gerente General (Decision Maker)");
    setCustomEmployees("50-200 empleados");
  };

  const handleStartCustomCall = () => {
    const finalName = customName.trim() || "Marcus Reyes";
    const finalCompany = customCompany.trim() || "Northwind Logistics";
    const finalIndustry = customIndustry.trim();
    
    const isTech = customRole.toLowerCase().includes("ing") || customRole.toLowerCase().includes("tech") || customRole.toLowerCase().includes("cto");
    
    const generatedGoals = isTech ? [
      "Usar la 'Técnica del Eco' antes de responder a las objeciones de TCO",
      "Preguntar cuántas herramientas integradas maneja su equipo",
      "Evidenciar los costos ocultos de migración con preguntas tácticas",
      "Evitar dar rebajas rápidas de precio en frío",
      "Cerrar agenda para demo técnica en los próximos 30 días"
    ] : [
      "Validar el canal del cual proceden sus prospectos de preventa",
      "Explicar que la IA de Nexor califica leads en menos de 60 segundos",
      "Desmontar la objeción: 'Nuestros clientes prefieren hablar solo con personas'",
      "Evitar ofrecer descuentos en la llamada inicial",
      "Agendar visita virtual guiada o llamada de descubrimiento"
    ];

    const sim: Simulation = {
      id: "sim-custom",
      clientName: finalName,
      role: customRole,
      industry: finalIndustry,
      difficulty: "Medio",
      companyName: finalCompany,
      employeeCount: customEmployees,
      goals: generatedGoals,
      objections: [
        "El servicio de Nexor parece costoso en relación con los chats de Vambe.",
        "Nos preocupa la calidez y el acento de la voz de IA."
      ],
      initialPrompt: `Hola, habla ${finalName} de ${finalCompany}. Me dijeron que llamabas de Nexor AI. La verdad estamos viendo opciones y Vambe nos cobra una fracción. ¿Por qué deberíamos pagar más con ustedes?`
    };

    setSelectedSim(sim);
    setDialogue([{ role: "client", text: sim.initialPrompt }]);
    setCurrentGoalProgress(new Array(sim.goals.length).fill(false));
    setTimeLeft(240);
    setSimulationState("calling");

    // Launch Vapi calling WebRTC connection with assistant overrides
    if (vapiInstance && vapiAssistantId) {
      const systemPrompt = `Eres un prospecto comercial difícil y escéptico de llamarte ${sim.clientName}, con el cargo de ${sim.role} en la empresa '${sim.companyName}' que opera en la industria de ${sim.industry} con un tamaño aproximado de ${sim.employeeCount}.
Te ha contactado un vendedor (partner) de la startup de IA 'Nexor'.
Tu empresa actualmente tiene pérdidas por leads de ventas no atendidos y un equipo comercial saturado.
Tu principal competidor en el radar es 'Vambe', pero el vendedor de Nexor te está llamando para convencerte de que implementes los agentes de voz de Nexor.

Tus objeciones son:
- Dudar de la efectividad del agente conversacional de Nexor.
- Que el costo de Nexor es alto (el ticket promedio de Nexor es 6 veces más alto que el de Vambe).
- En caso de tecnología: preocupaciones técnicas de integración.
- En caso de inmobiliaria/B2C: preocupaciones de empatía con los clientes finales.

Reglas de comportamiento:
1. Responde de manera corta, al grano y directa, tal como respondería un ejecutivo ocupado en una llamada telefónica (1 o 2 frases máximo).
2. Si el vendedor te presiona de forma correcta usando datos del ROI, pregunta por la integración o muestra interés de forma sutil.
3. Si el vendedor ofrece un descuento rápido, muéstrate escéptico o pierde el interés.
4. Si el vendedor es convincente, te propone agendar un paso siguiente claro (reunión de 45 min) y demuestra el valor, accede de forma profesional.`;

      vapiInstance.start(vapiAssistantId, {
        model: {
          messages: [
            {
              role: "system",
              content: systemPrompt
            }
          ]
        },
        firstMessage: sim.initialPrompt
      } as any);
    } else {
      console.warn("Vapi.ai credentials missing in environment. Running local voice recognition mock.");
    }
  };

  const handleEndCall = () => {
    if (vapiInstance) {
      vapiInstance.stop();
    } else {
      handleEndCallCleanup();
    }
  };

  const handleEndCallCleanup = () => {
    setSimulationState("analyzing");
    setTimeout(() => {
      const goalsCompletedCount = currentGoalProgress.filter(Boolean).length;
      const score = Math.min(Math.round((goalsCompletedCount / Math.max(currentGoalProgress.length, 1)) * 100), 100);
      const isApproved = score >= 70;

      const newHistoryItem: SimulationHistoryItem = {
        id: "hist-" + Date.now(),
        clientName: selectedSim?.clientName || "Cliente",
        industry: selectedSim?.industry || "General",
        score,
        date: "Hoy",
        status: isApproved ? "Aprobado" : "Fayado",
        feedback: {
          good: currentGoalProgress.map((g, idx) => g ? selectedSim?.goals[idx] : null).filter(Boolean) as string[],
          opportunities: currentGoalProgress.map((g, idx) => !g ? selectedSim?.goals[idx] : null).filter(Boolean) as string[]
        }
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setSimulationState("feedback");
    }, 2500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const toggleMute = () => {
    if (!vapiInstance) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    vapiInstance.setMuted(nextMuted);
  };

  const lastDialogue = dialogue.length > 0 ? dialogue[dialogue.length - 1] : null;

  return (
    <div className="flex flex-col text-left" id="simulator-section">
      
      {/* 1. CONFIGURADOR DINÁMICO DE ESCENARIO */}
      {simulationState === "list" && (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-150">
            <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900">Simulador de Ventas Nexor</h3>
              <p className="text-xs text-gray-400 mt-0.5">Define las características de tu prospecto o impórtalo desde tu cartera de clientes.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Formulario de Configuración (Izquierda) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Parámetros del Cliente</h4>
                
                {/* Seleccionar de cartera de clientes */}
                {prospects.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400">Importar Cliente Cartera</label>
                    <div className="flex flex-wrap gap-2">
                      {prospects.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSelectProspect(p)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-neutral-900 bg-gray-50 text-[11px] font-bold text-gray-700 hover:text-neutral-900 transition-all cursor-pointer"
                        >
                          💼 {p.company} ({p.name})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* LinkedIn Scrape / Apify */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">Extraer datos con Apify (LinkedIn)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Pega el link de LinkedIn del prospecto..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleApifyScrape}
                      disabled={isScraping}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer shrink-0"
                    >
                      {isScraping ? (
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Search className="h-3.5 w-3.5" />
                      )}
                      <span>Scrapear</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Nombre del Lead</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ej. Marcus Reyes"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Empresa</label>
                    <input
                      type="text"
                      value={customCompany}
                      onChange={(e) => setCustomCompany(e.target.value)}
                      placeholder="Ej. Northwind Logistics"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Industria</label>
                    <select
                      value={customIndustry}
                      onChange={(e) => setCustomIndustry(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    >
                      <option value="Automotriz & Concesionarias">Automotriz</option>
                      <option value="Inmobiliaria & Preventa">Inmobiliaria</option>
                      <option value="SaaS & Software B2B">SaaS / B2B</option>
                      <option value="Salud & Clínicas">Salud / Estética</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Cargo / Rol</label>
                    <select
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    >
                      <option value="Gerente Comercial">Gerente Comercial</option>
                      <option value="VP de Ingeniería (CTO)">VP de Ingeniería / CTO</option>
                      <option value="Director General (CEO)">Director General / CEO</option>
                      <option value="Gerente de Compras">Gerente de Compras</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-gray-400">Tamaño Empresa</label>
                    <select
                      value={customEmployees}
                      onChange={(e) => setCustomEmployees(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs outline-none focus:border-neutral-900 bg-white"
                    >
                      <option value="10-50 empleados (PyME)">10-50 (PyME)</option>
                      <option value="50-200 empleados">50-200</option>
                      <option value="200-1000 empleados">200-1000 (Corporativo)</option>
                      <option value="1000+ empleados (Enterprise)">1000+ (Enterprise)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartCustomCall}
                className="w-full py-4 rounded-2xl bg-neutral-950 hover:bg-neutral-900 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Phone className="h-4 w-4" />
                <span>Iniciar Simulación Conectada</span>
              </button>
            </div>

            {/* Historial de Prácticas (Derecha) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50/50">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">Tu Historial de Práctica</h4>
                <div className="space-y-3">
                  {history.map((h) => (
                    <div key={h.id} className="border border-gray-200 bg-white rounded-xl p-3 flex justify-between items-center shadow-3xs">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{h.clientName}</p>
                        <p className="text-[9px] text-gray-400 font-semibold">{h.industry}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-gray-900">{h.score}/100</span>
                        <span className={`block text-[8px] font-bold uppercase tracking-wider ${
                          h.status === "Aprobado" ? "text-emerald-600" : "text-rose-600"
                        }`}>{h.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LLAMADA EN VIVO (Premium - Estilo Google Meet Exacto con Altura Fluida) */}
      {simulationState === "calling" && selectedSim && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-[#111] text-white rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden h-[calc(100vh-140px)]">
          {/* Fondo Radial de Nexor */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

          {/* Panel Principal de Llamada (Estilo Google Meet) */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full relative z-10">
            {/* Cabecera del Escenario */}
            <div className="pb-2 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-black text-white">{selectedSim.role} Objections</h3>
                <p className="text-[10px] text-neutral-400 mt-0.5">SDR Lead Qualification & Negotiation Training</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-black text-white block">{formatTime(timeLeft)}</span>
                <span className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Time remaining</span>
              </div>
            </div>

            {/* Avatar Central y Subtítulo de Transcripción (Google Meet Video Tile Style) */}
            <div className="my-2 bg-[#202124] rounded-2xl flex flex-col items-center justify-center text-center p-6 flex-1 relative border border-neutral-800 shadow-inner overflow-hidden">
              
              {/* Microfono indicador y estado superior */}
              <div className="absolute top-4 right-4 bg-neutral-900/80 px-2.5 py-1 rounded-full text-[9px] font-bold text-neutral-400 border border-neutral-850 flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>Voz Conectada</span>
              </div>

              <div className="relative mb-3 flex-shrink-0">
                {/* Avatar Blanco/Gris con borde fino de Nexor */}
                <div className="h-20 w-20 rounded-full bg-[#3c4043] flex items-center justify-center border border-neutral-700 text-white font-black text-2xl shadow-md">
                  {selectedSim.clientName.substring(0, 1).toUpperCase()}
                </div>
                <span className="absolute bottom-1 right-1 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-[#202124]" />
              </div>

              <div className="mb-4 flex-shrink-0">
                <h4 className="text-sm font-black text-white">{selectedSim.clientName}</h4>
                <p className="text-xs text-neutral-400 font-medium">{selectedSim.role} en {selectedSim.companyName}</p>
              </div>

              {/* Onda de Audio Dinámica Blanca/Gris Nexor */}
              <div className="flex items-end justify-center space-x-1 h-6 mb-4 flex-shrink-0">
                {waveHeights.map((h, i) => (
                  <span 
                    key={i} 
                    className="w-0.5 bg-neutral-300 rounded-full transition-all duration-300"
                    style={{ height: `${isSending ? 3 : h * 0.5}px`, opacity: isSending ? 0.2 : 0.7 }}
                  />
                ))}
              </div>

              {/* Transcripción en Vivo de Último Mensaje (Estilo Subtítulos de Google Meet - Conmutado por CC) */}
              {isCcActive && (
                <div className="w-full max-w-lg bg-black/50 border border-neutral-850 rounded-xl p-3 min-h-[50px] flex flex-col justify-center text-center backdrop-blur-xs flex-shrink-0">
                  {lastDialogue ? (
                    <p className="text-xs text-gray-200 leading-relaxed font-sans">
                      <strong className="text-[9px] uppercase tracking-wider text-emerald-400 block mb-0.5">
                        {lastDialogue.role === "user" ? "Tú" : selectedSim.clientName}
                      </strong>
                      "{lastDialogue.text}"
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-400 italic">Di tu pitch de ventas usando tu micrófono real. Empieza saludando...</p>
                  )}
                  {isSending && (
                    <span className="text-[9px] text-neutral-400 animate-pulse font-bold mt-1 block">
                      Respondiendo...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Google Meet Style Bottom Control Bar (Cápsulas idénticas a Meet con animación en Mic e Iconos exactos) */}
            <div className="mt-2 pt-2 border-t border-neutral-900 flex justify-center items-center relative flex-shrink-0">
              
              {/* Meet Control Buttons Layout */}
              <div className="bg-[#202124] rounded-full px-6 py-2 border border-neutral-800 flex items-center space-x-4 shadow-lg relative z-20">
                
                {/* 1. Mute Mic Button con Flecha Desplegable acoplada (Cápsula unificada Meet) */}
                <div className="flex items-center bg-[#3c4043] hover:bg-[#4f5357] rounded-full p-0.5 transition-all">
                  
                  {/* Flecha a la izquierda / Feedback de columnas si habla */}
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setIsMicHovered(true)}
                      onMouseLeave={() => setIsMicHovered(false)}
                      onClick={() => { setShowMicDropdown(!showMicDropdown); setShowSpeakerDropdown(false); }}
                      className="pl-3.5 pr-2 py-2 text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center justify-center min-w-[32px]"
                    >
                      {isUserSpeakingSim && !isMuted && !isMicHovered ? (
                        <div className="flex items-end space-x-0.5 h-3.5 w-3.5 mr-0.5 transition-all">
                          <span className="w-0.5 bg-[#10b981] animate-pulse h-2" />
                          <span className="w-0.5 bg-[#10b981] animate-pulse h-3.5" />
                          <span className="w-0.5 bg-[#10b981] animate-pulse h-2.5" />
                        </div>
                      ) : (
                        <ChevronUp className="h-3.5 w-3.5 text-neutral-300" />
                      )}
                    </button>

                    {/* Dropdown de Selección de Micrófono con transición animada CSS */}
                    {showMicDropdown && (
                      <div className="absolute bottom-12 left-0 bg-[#282a2d] border border-neutral-850 rounded-xl p-2 w-56 shadow-2xl text-xs space-y-1 z-30 transition-all duration-200 animate-fade-in text-neutral-200 text-left">
                        <p className="text-[9px] font-black uppercase text-neutral-500 px-2 py-1 border-b border-neutral-800 mb-1">Entrada (Micrófono)</p>
                        {audioInputDevices.length > 0 ? (
                          audioInputDevices.map((device) => (
                            <button
                              key={device.deviceId}
                              onClick={() => { setSelectedMic(device.label || device.deviceId); setShowMicDropdown(false); }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#3c4043] transition-colors truncate block text-[11px] ${
                                selectedMic === (device.label || device.deviceId) ? "text-emerald-400 font-bold bg-[#3c4043]/50" : ""
                              }`}
                            >
                              🎤 {device.label || `Micrófono (${device.deviceId.substring(0,5)})`}
                            </button>
                          ))
                        ) : (
                          <p className="text-[10px] text-neutral-500 px-2 py-1 italic">No se detectaron dispositivos</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Icono del Micrófono */}
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      isMuted ? "bg-[#ea4335] text-white" : "bg-transparent text-white"
                    }`}
                    title={isMuted ? "Activar Micrófono" : "Silenciar Micrófono"}
                  >
                    <Mic className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* 2. Audio Speaker Button con Flecha Desplegable acoplada */}
                <div className="flex items-center bg-[#3c4043] hover:bg-[#4f5357] rounded-full p-0.5 transition-all">
                  
                  {/* Flecha simple a la izquierda */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => { setShowSpeakerDropdown(!showSpeakerDropdown); setShowMicDropdown(false); }}
                      className="pl-3.5 pr-2 py-2 text-neutral-200 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      <ChevronUp className="h-3.5 w-3.5 text-neutral-300" />
                    </button>

                    {/* Dropdown de Selección de Altavoz */}
                    {showSpeakerDropdown && (
                      <div className="absolute bottom-12 left-0 bg-[#282a2d] border border-neutral-850 rounded-xl p-2 w-56 shadow-2xl text-xs space-y-1 z-30 transition-all duration-200 animate-fade-in text-neutral-200 text-left">
                        <p className="text-[9px] font-black uppercase text-neutral-500 px-2 py-1 border-b border-neutral-800 mb-1">Salida (Altavoces)</p>
                        {audioOutputDevices.length > 0 ? (
                          audioOutputDevices.map((device) => (
                            <button
                              key={device.deviceId}
                              onClick={() => { setSelectedSpeaker(device.label || device.deviceId); setShowSpeakerDropdown(false); }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#3c4043] transition-colors truncate block text-[11px] ${
                                selectedSpeaker === (device.label || device.deviceId) ? "text-emerald-400 font-bold bg-[#3c4043]/50" : ""
                              }`}
                            >
                              🔊 {device.label || `Altavoz (${device.deviceId.substring(0,5)})`}
                            </button>
                          ))
                        ) : (
                          // Fallback list as browsers restrict output devices enumeration on certain scopes
                          [
                            "Altavoz Predeterminado del Sistema",
                            "Auriculares Estéreo (Hands-Free)",
                            "Altavoces Realtek High Definition Audio"
                          ].map((fallbackSpk) => (
                            <button
                              key={fallbackSpk}
                              onClick={() => { setSelectedSpeaker(fallbackSpk); setShowSpeakerDropdown(false); }}
                              className={`w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#3c4043] transition-colors truncate block text-[11px] ${
                                selectedSpeaker === fallbackSpk ? "text-emerald-400 font-bold bg-[#3c4043]/50" : ""
                              }`}
                            >
                              🔊 {fallbackSpk}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {/* Icono de Altavoz */}
                  <button
                    type="button"
                    onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    className={`p-2 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                      !isSpeakerOn ? "bg-[#ea4335] text-white" : "bg-transparent text-white"
                    }`}
                    title={isSpeakerOn ? "Silenciar Voz" : "Habilitar Voz"}
                  >
                    <Volume2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* 3. CC Button para Conmutar Subtítulos de Transcripción */}
                <button
                  type="button"
                  onClick={() => setIsCcActive(!isCcActive)}
                  className={`p-3 rounded-full transition-all cursor-pointer flex items-center justify-center ${
                    isCcActive 
                      ? "bg-emerald-600 text-neutral-950 font-bold" 
                      : "bg-[#3c4043] hover:bg-[#4f5357] text-neutral-400"
                  }`}
                  title="Activar/Desactivar Subtítulos (CC)"
                >
                  <span className="text-[10px] font-black uppercase">CC</span>
                </button>

                {/* 4. Classic Red Hangup Button (Google Meet Circular style de 40px) */}
                <button
                  type="button"
                  onClick={handleEndCall}
                  className="h-10 w-16 bg-[#ea4335] hover:bg-[#d93025] text-white rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center"
                  title="Colgar y Evaluar Llamada"
                >
                  <PhoneOff className="h-5 w-5 fill-current" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Metas y Objetivos (Derecha) */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full relative z-10 border-l border-neutral-850 pl-0 lg:pl-8">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Goals</h4>
                <p className="text-[10px] text-neutral-400 mt-1">Cumple estas metas tácticas durante la conversación para pasar.</p>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {selectedSim.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-neutral-900 border border-neutral-850 rounded-2xl">
                    <span className={`h-4.5 w-4.5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      currentGoalProgress[idx] ? "bg-white text-neutral-950" : "bg-neutral-800 text-neutral-500"
                    }`}>
                      {currentGoalProgress[idx] ? "✓" : "●"}
                    </span>
                    <span className={`text-[10.5px] leading-normal font-semibold ${
                      currentGoalProgress[idx] ? "text-white font-bold" : "text-neutral-500"
                    }`}>{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selector de Cliente */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Cliente Simulado</span>
              {prospects.length > 0 && (
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {prospects.map((p) => {
                    const isActive = selectedSim?.clientName === p.name && selectedSim?.companyName === p.company;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleSelectProspect(p);
                          setShowClientPanel(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                          isActive ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800 border border-transparent"
                        }`}
                      >
                        {p.company} ({p.name})
                      </button>
                    );
                  })}
                </div>
              )}
              <button
                onClick={() => { handleEndCall(); setSimulationState("list"); }}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold transition-all cursor-pointer"
              >
                + Nuevo cliente personalizado
              </button>
            </div>

            {/* Información del Cliente */}
            <div className="bg-neutral-900 border border-neutral-850 rounded-2xl p-4.5 space-y-3 flex-shrink-0">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Business Information</span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-neutral-400">Target Industry:</span>
                <span className="text-white font-bold">{selectedSim.industry}</span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Recuerda: Los agentes de Nexor se integran al stack existente. Atienden leads en &lt;60s.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. EVALUACIÓN Y FEEDBACK */}
      {simulationState === "analyzing" && (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto">
          <div className="animate-spin h-8 w-8 border-4 border-neutral-900 border-t-transparent rounded-full" />
          <h3 className="text-sm font-bold text-gray-800">Analizando la llamada comercial...</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Nuestro evaluador de IA está validando el cumplimiento de metas y si rebatiste correctamente las objeciones de costo.
          </p>
        </div>
      )}

      {simulationState === "feedback" && selectedSim && (
        <div className="space-y-6 max-w-2xl mx-auto text-center py-4">
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Análisis Completo</span>
            <h2 className="text-xl font-bold text-gray-900">Resultado de la Simulación</h2>
          </div>

          <div className="border border-gray-150 bg-gray-50 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-28 w-28 rounded-full border-4 border-neutral-900 flex flex-col items-center justify-center bg-white shadow-xs">
                <span className="text-2xl font-mono font-black text-neutral-900">
                  {history[0]?.score}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Score</span>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                history[0]?.status === "Aprobado" ? "text-neutral-900" : "text-rose-600"
              }`}>
                {history[0]?.status === "Aprobado" ? "Aprobado para Vender" : "Necesita Mejorar"}
              </span>
            </div>

            <div className="text-left space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-neutral-800">
                  <CheckCircle className="h-4 w-4" />
                  <span>Lo que hiciste bien</span>
                </div>
                <ul className="space-y-1.5">
                  {history[0]?.feedback.good.map((f, i) => (
                    <li key={i} className="text-[10px] text-gray-600 flex items-start space-x-1.5">
                      <span className="text-neutral-900 mt-0.5">✔</span>
                      <span>{f}</span>
                    </li>
                  ))}
                  {history[0]?.feedback.good.length === 0 && (
                    <li className="text-[10px] text-gray-400 italic">No se cumplió ninguna meta establecida.</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700">
                  <XCircle className="h-4 w-4" />
                  <span>Áreas de oportunidad</span>
                </div>
                <ul className="space-y-1.5">
                  {history[0]?.feedback.opportunities.map((f, i) => (
                    <li key={i} className="text-[10px] text-gray-600 flex items-start space-x-1.5">
                      <span className="text-rose-400 mt-0.5">■</span>
                      <span>{f}</span>
                    </li>
                  ))}
                  {history[0]?.feedback.opportunities.length === 0 && (
                    <li className="text-[10px] text-gray-400 italic">¡Perfecto! Cumpliste todas las directrices.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-2">
            <button
              onClick={() => setSimulationState("list")}
              className="px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-900 text-gray-700 font-bold text-xs transition-all cursor-pointer"
            >
              Volver al Temario
            </button>
            <button
              onClick={handleStartCustomCall}
              className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-md"
            >
              Repetir Simulación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
