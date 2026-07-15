"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle2, Gift, Star, Zap, Trophy, Target, Users, DollarSign, Award, Clock, ChevronUp, ChevronDown } from "lucide-react";

interface Mision {
  id: string;
  titulo: string;
  descripcion: string;
  icon: React.ElementType;
  recompensa: string;
  getProgreso: (data: { prospects: any[]; activeCount: number; totalLeads: number; totalComisiones: number; uniqueIndustries: number }) => { actual: number; meta: number };
}

export default function PremiosPage() {
  const { prospects, activeCount } = useDashboard();
  const { user } = useAuth();
  const [reclamados, setReclamados] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`nexor_reclamados_${user?.uid || "guest"}`);
      if (saved) {
        setReclamados(JSON.parse(saved));
      }
    }
  }, [user]);

  const handleReclamar = (id: string) => {
    const updated = { ...reclamados, [id]: true };
    setReclamados(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`nexor_reclamados_${user?.uid || "guest"}`, JSON.stringify(updated));
    }
  };

  const totalLeads = prospects.reduce((s, p) => s + (p.leadsConsumed || 0), 0);
  const totalComisiones = prospects
    .filter((p) => p.status === "Generando comisiones")
    .reduce((s, p) => s + (p.commissionEarned || 0), 0);
  const uniqueIndustries = new Set(prospects.map((p) => p.industry)).size;

  const misiones: Mision[] = [
    {
      id: "m1",
      titulo: "Primera empresa registrada",
      descripcion: "Registra tu primera empresa en tu cartera de clientes.",
      icon: Target,
      recompensa: "Insignia de Bronce + 10 XP",
      getProgreso: (d) => ({ actual: Math.min(d.prospects.length, 1), meta: 1 }),
    },
    {
      id: "m2",
      titulo: "Constructor de cartera",
      descripcion: "Agrega un mínimo de 5 empresas para ampliar tu alcance.",
      icon: Users,
      recompensa: "Plantillas VIP de WhatsApp + 30 XP",
      getProgreso: (d) => ({ actual: Math.min(d.prospects.length, 5), meta: 5 }),
    },
    {
      id: "m3",
      titulo: "Primeros leads procesados",
      descripcion: "Tus clientes deben procesar al menos 100 leads en total.",
      icon: Zap,
      recompensa: "Merch Oficial Nexor + 50 XP",
      getProgreso: (d) => ({ actual: Math.min(d.totalLeads, 100), meta: 100 }),
    },
    {
      id: "m4",
      titulo: "Nivel Growth Partner",
      descripcion: "Consigue 5 cuentas activadas en el CRM.",
      icon: Star,
      recompensa: "Audífonos Sony Premium + 100 XP",
      getProgreso: (d) => ({ actual: Math.min(d.activeCount, 5), meta: 5 }),
    },
    {
      id: "m5",
      titulo: "Nivel Elite Partner",
      descripcion: "Sube de nivel activando 10 cuentas comerciales.",
      icon: Trophy,
      recompensa: "Consola PlayStation 5 Pro + 250 XP",
      getProgreso: (d) => ({ actual: Math.min(d.activeCount, 10), meta: 10 }),
    },
    {
      id: "m6",
      titulo: "Lead Master",
      descripcion: "Consigue procesar un total de 1,000 leads calificados.",
      icon: Target,
      recompensa: "Amazon Gift Card $200 USD + 500 XP",
      getProgreso: (d) => ({ actual: Math.min(d.totalLeads, 1000), meta: 1000 }),
    },
    {
      id: "m7",
      titulo: "Comisionista Pro",
      descripcion: "Genera más de $2,000 USD en comisiones recurrentes.",
      icon: DollarSign,
      recompensa: "Ticket VIP al Nexor Summit 2026 + 1000 XP",
      getProgreso: (d) => ({ actual: Math.min(d.totalComisiones, 2000), meta: 2000 }),
    },
    {
      id: "m8",
      titulo: "Multinicho",
      descripcion: "Consigue clientes en 3 industrias o sectores diferentes.",
      icon: Award,
      recompensa: "MacBook Air M4 + 1500 XP",
      getProgreso: (d) => ({ actual: Math.min(d.uniqueIndustries, 3), meta: 3 }),
    },
  ];

  // Calculate actual dynamic points (XP) for mock ranking
  const completedCount = misiones.filter((m) => {
    const { actual, meta } = m.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
    return actual >= meta;
  }).length;

  const currentXP = completedCount * 45 + (activeCount * 12);

  // Mock Sapphire League leaderboard
  const mockRanking = [
    { name: "Janae", xp: 1200, avatar: "J", position: 1, trend: "up", isMe: false },
    { name: "Komal Rai", xp: 950, avatar: "K", position: 2, trend: "up", isMe: false },
    { name: "Kelly", xp: 750, avatar: "K", position: 3, trend: "same", isMe: false },
    { name: user?.displayName || "Tú", xp: currentXP, avatar: (user?.displayName || "T").charAt(0).toUpperCase(), position: 4, trend: "up", isMe: true },
    { name: "Javier", xp: 140, avatar: "J", position: 5, trend: "down", isMe: false },
    { name: "Brayan Capcha", xp: 95, avatar: "B", position: 6, trend: "same", isMe: false },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, position: idx + 1 }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade-in">
      {/* SECCIÓN IZQUIERDA: DESAFÍOS (8 COLS) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10 pointer-events-none">
            <Trophy className="h-40 w-40" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-extrabold text-white">Desafíos Mensuales</span>
                <h2 className="text-xl font-black mt-2">Misiones de Partner de Nexor</h2>
                <p className="text-xs text-blue-100 mt-1">Completa tareas de prospección para ganar XP y desbloquear premios.</p>
              </div>
              <div className="h-16 w-16 bg-white/10 rounded-full border-4 border-white/20 flex flex-col items-center justify-center font-mono">
                <span className="text-lg font-black">{completedCount}</span>
                <span className="text-[9px] text-blue-200">/ {misiones.length}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-100">Progreso de Desafíos</span>
                <span>{Math.round((completedCount / misiones.length) * 100)}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full transition-all duration-1000"
                  style={{ width: `${(completedCount / misiones.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* LISTADO DE MISIONES ESTILO DUOLINGO */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest pl-1">Misiones Activas</h3>
          <div className="space-y-4">
            {misiones.map((mision) => {
              const Icon = mision.icon;
              const { actual, meta } = mision.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
              const completed = actual >= meta;
              const isClaimed = reclamados[mision.id];
              const pct = Math.min((actual / meta) * 100, 100);

              return (
                <div
                  key={mision.id}
                  className={`border rounded-2xl p-5 shadow-3xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    completed
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-white border-gray-150"
                  }`}
                >
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${completed ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900 truncate">
                          {mision.titulo}
                        </h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                          {mision.descripcion}
                        </p>
                      </div>

                      {/* BARRA DE PROGRESO CON TEXTO ESTILO DUOLINGO */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                          <span className={completed ? "text-emerald-700" : "text-gray-400"}>Progreso</span>
                          <span className="font-mono">{actual.toLocaleString()} / {meta.toLocaleString()}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-150">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              completed ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-yellow-400"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 text-[10px] font-bold text-neutral-600 bg-neutral-100/50 w-fit px-2.5 py-1 rounded-lg border border-neutral-200">
                        <Gift className="h-3.5 w-3.5 text-neutral-500" />
                        <span>Recompensa: {mision.recompensa}</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTÓN DE CANJEAR PREMIO INTERACTIVO */}
                  <div className="flex-shrink-0 flex items-center justify-end sm:justify-start">
                    {completed ? (
                      isClaimed ? (
                        <button
                          disabled
                          className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-400 border border-gray-200 text-xs font-bold cursor-not-allowed"
                        >
                          ¡Reclamado! ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReclamar(mision.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer flex items-center space-x-1.5"
                        >
                          <Gift className="h-3.5 w-3.5" />
                          <span>Reclamar Premio</span>
                        </button>
                      )
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-300 border border-gray-100 text-xs font-bold cursor-not-allowed"
                      >
                        Bloqueado
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECCIÓN DERECHA: LEADERBOARD ESTILO LIGA ZAFIRO (4 COLS) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white border border-gray-150 rounded-3xl p-5 shadow-3xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-500 animate-pulse" />
              <h3 className="text-sm font-black text-gray-900">Liga Zafiro</h3>
            </div>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 text-neutral-300" />
              <span>Faltan 3 días</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
            Los 3 mejores partners de la semana reciben un boost de +5% de comisiones extras en su próximo pago mensual.
          </p>

          {/* LISTADO DEL RANKING DE DUOLINGO */}
          <div className="space-y-2.5">
            {mockRanking.map((member) => (
              <div
                key={member.name}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  member.isMe
                    ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Posición y Flechitas de Duolingo */}
                  <div className="flex flex-col items-center justify-center w-6 flex-shrink-0 font-mono">
                    <span className={`text-xs font-black ${
                      member.position === 1 ? "text-yellow-500 text-sm" :
                      member.position === 2 ? "text-gray-400" :
                      member.position === 3 ? "text-amber-600" : "text-gray-300"
                    }`}>
                      {member.position}
                    </span>
                    {member.trend === "up" && <ChevronUp className="h-3 w-3 text-emerald-500" />}
                    {member.trend === "down" && <ChevronDown className="h-3 w-3 text-rose-500" />}
                  </div>

                  {/* Avatar circular */}
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black ${
                    member.isMe ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-700"
                  }`}>
                    {member.avatar}
                  </div>

                  {/* Nombre */}
                  <p className={`text-xs truncate font-bold ${member.isMe ? "text-indigo-950 font-black" : "text-gray-700"}`}>
                    {member.name}
                  </p>
                </div>

                {/* Puntaje / XP */}
                <span className="text-xs font-mono font-black text-gray-900 flex-shrink-0">
                  {member.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
