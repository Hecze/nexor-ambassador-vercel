"use client";

import React, { useState, useEffect } from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { Star, Zap, Trophy, Target, Users, DollarSign, Award } from "lucide-react";

interface Mision {
  id: string;
  titulo: string;
  descripcion: string;
  icon: React.ElementType;
  recompensa: string;
  xp: number;
  getProgreso: (data: { prospects: any[]; activeCount: number; totalLeads: number; totalComisiones: number; uniqueIndustries: number }) => { actual: number; meta: number };
}

const LEVEL_THRESHOLDS = [0, 100, 300, 500, 800, 1200, 1800, 2600, 4000];

function computeLevel(xp: number) {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return { level: i + 1, current: LEVEL_THRESHOLDS[i], next: LEVEL_THRESHOLDS[i + 1] ?? LEVEL_THRESHOLDS[i] };
  }
  return { level: 1, current: 0, next: LEVEL_THRESHOLDS[1] };
}

const REWARD_PATH = [
  { id: "m1", label: "Insignia Bronce", lvl: 1 },
  { id: "m2", label: "Plantillas VIP", lvl: 2 },
  { id: "m3", label: "Merch Nexor", lvl: 3 },
  { id: "m4", label: "Audífonos Sony", lvl: 4 },
  { id: "m5", label: "PS5 Pro", lvl: 6 },
  { id: "m8", label: "MacBook Air M4", lvl: 8 },
];

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
      xp: 10,
      getProgreso: (d) => ({ actual: Math.min(d.prospects.length, 1), meta: 1 }),
    },
    {
      id: "m2",
      titulo: "Constructor de cartera",
      descripcion: "Agrega un mínimo de 5 empresas para ampliar tu alcance.",
      icon: Users,
      recompensa: "Plantillas VIP de WhatsApp + 30 XP",
      xp: 30,
      getProgreso: (d) => ({ actual: Math.min(d.prospects.length, 5), meta: 5 }),
    },
    {
      id: "m3",
      titulo: "Primeros leads procesados",
      descripcion: "Tus clientes deben procesar al menos 100 leads en total.",
      icon: Zap,
      recompensa: "Merch Oficial Nexor + 50 XP",
      xp: 50,
      getProgreso: (d) => ({ actual: Math.min(d.totalLeads, 100), meta: 100 }),
    },
    {
      id: "m4",
      titulo: "Nivel Growth Partner",
      descripcion: "Consigue 5 cuentas activadas en el CRM.",
      icon: Star,
      recompensa: "Audífonos Sony Premium + 100 XP",
      xp: 100,
      getProgreso: (d) => ({ actual: Math.min(d.activeCount, 5), meta: 5 }),
    },
    {
      id: "m5",
      titulo: "Nivel Elite Partner",
      descripcion: "Sube de nivel activando 10 cuentas comerciales.",
      icon: Trophy,
      recompensa: "Consola PlayStation 5 Pro + 250 XP",
      xp: 250,
      getProgreso: (d) => ({ actual: Math.min(d.activeCount, 10), meta: 10 }),
    },
    {
      id: "m6",
      titulo: "Lead Master",
      descripcion: "Consigue procesar un total de 1,000 leads calificados.",
      icon: Target,
      recompensa: "Amazon Gift Card $200 USD + 500 XP",
      xp: 500,
      getProgreso: (d) => ({ actual: Math.min(d.totalLeads, 1000), meta: 1000 }),
    },
    {
      id: "m7",
      titulo: "Comisionista Pro",
      descripcion: "Genera más de $2,000 USD en comisiones recurrentes.",
      icon: DollarSign,
      recompensa: "Ticket VIP al Nexor Summit 2026 + 1000 XP",
      xp: 1000,
      getProgreso: (d) => ({ actual: Math.min(d.totalComisiones, 2000), meta: 2000 }),
    },
    {
      id: "m8",
      titulo: "Multinicho",
      descripcion: "Consigue clientes en 3 industrias o sectores diferentes.",
      icon: Award,
      recompensa: "MacBook Air M4 + 1500 XP",
      xp: 1500,
      getProgreso: (d) => ({ actual: Math.min(d.uniqueIndustries, 3), meta: 3 }),
    },
  ];

  const missionMap = Object.fromEntries(misiones.map((m) => [m.id, m]));

  const claimedXP = misiones
    .filter((m) => reclamados[m.id])
    .reduce((s, m) => s + m.xp, 0);
  const totalXP = claimedXP + activeCount * 100;

  const { level, current: currentThreshold, next: nextThreshold } = computeLevel(totalXP);
  const levelXP = totalXP - currentThreshold;
  const levelMax = nextThreshold - currentThreshold;
  const levelPct = Math.min((levelXP / levelMax) * 100, 100);
  const xpToNext = nextThreshold - totalXP;

  const completedCount = misiones.filter((m) => {
    const { actual, meta } = m.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
    return actual >= meta;
  }).length;
  const readyToClaim = misiones.filter((m) => {
    const { actual, meta } = m.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
    return actual >= meta && !reclamados[m.id];
  }).length;

  const mockRanking = [
    { name: "Janae", xp: 1200, avatar: "J", position: 1, trend: "up" as const, isMe: false },
    { name: "Komal Rai", xp: 950, avatar: "K", position: 2, trend: "up" as const, isMe: false },
    { name: "Kelly", xp: 750, avatar: "K", position: 3, trend: "same" as const, isMe: false },
    { name: user?.displayName || "Tú", xp: totalXP, avatar: (user?.displayName || "T").charAt(0).toUpperCase(), position: 4, trend: "up" as const, isMe: true },
    { name: "Javier", xp: 140, avatar: "J", position: 5, trend: "down" as const, isMe: false },
    { name: "Brayan Capcha", xp: 95, avatar: "B", position: 6, trend: "same" as const, isMe: false },
  ].sort((a, b) => b.xp - a.xp).map((item, idx) => ({ ...item, position: idx + 1 }));

  const currentUser = mockRanking.find((m) => m.isMe);
  const top3 = mockRanking.slice(0, 3);
  const xpToTop3 = currentUser ? top3[2].xp - currentUser.xp : 0;

  const weeklyClaimed = Object.values(reclamados).filter(Boolean).length;
  const WEEKLY_GOAL = 3;

  const ringRadius = 39;
  const ringCircumference = 2 * Math.PI * ringRadius;

  return (
    <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 text-left animate-fade-in" style={{ fontFamily: "Inter, sans-serif", color: "#111113" }}>

      {/* ──────────────── LEFT COLUMN ──────────────── */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">

        {/* ── HERO CARD: PASE DE TEMPORADA ── */}
        <div className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "#101018" }}>
          <div
            className="absolute pointer-events-none"
            style={{ top: -70, right: -40, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.35), transparent 70%)" }}
          />
          <div className="relative flex items-center gap-4">
            {/* Level circle */}
            <div className="relative w-[92px] h-[92px] flex-shrink-0">
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="46" cy="46" r={ringRadius}
                  fill="none" stroke="#FBBF24" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${ringCircumference * (levelPct / 100)} ${ringCircumference}`}
                  transform="rotate(-90 46 46)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[8px] font-extrabold tracking-[1.5px] text-[#A1A1AA]">NIVEL</span>
                <span className="text-3xl font-bold leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{level}</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[9px] font-extrabold uppercase tracking-[1.5px] rounded-full px-2.5 py-0.5 border"
                  style={{ background: "rgba(251,191,36,0.15)", color: "#FBBF24", borderColor: "rgba(251,191,36,0.3)" }}
                >
                  Pase de temporada · Julio
                </span>
              </div>
              <div className="text-lg font-bold mt-1.5 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Te faltan {xpToNext} XP para el Nivel {level + 1}
              </div>
              <div className="text-[11.5px] text-[#A1A1AA] mt-0.5">
                Cada cuenta activa suma 100 XP · cada misión reclamada suma su bono
              </div>
              <div className="flex items-center gap-2.5 mt-2.5">
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${levelPct}%`, background: "linear-gradient(90deg, #F59E0B, #FBBF24)" }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[#FBBF24]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {levelXP}/{levelMax}
                </span>
              </div>
            </div>

            {/* Weekly streak */}
            <div
              className="flex-shrink-0 rounded-2xl p-3 text-center border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}
            >
              <div className="text-[8.5px] font-extrabold tracking-[1.2px] text-[#A1A1AA] uppercase mb-1.5">Racha semanal</div>
              <div className="flex gap-1">
                {["L", "M", "X", "J", "V", "S", "D"].map((dia, i) => {
                  const done = i < 5;
                  const today = i === 4;
                  return (
                    <div key={dia} className="flex flex-col items-center gap-0.5">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: 16, height: 16,
                          background: done ? "#F59E0B" : "rgba(255,255,255,0.08)",
                          border: today && !done ? "2px solid #F59E0B" : undefined,
                          boxSizing: "border-box",
                          ...(today ? { animation: "glowPulse 2s infinite" } : {}),
                        }}
                      >
                        {done && (
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#101018" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-[8px] font-bold"
                        style={{ color: today ? "#FBBF24" : done ? "#71717A" : "#52525B", fontWeight: today ? 800 : 700 }}
                      >
                        {dia}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reward path */}
          <div className="mt-5 relative">
            <div className="absolute left-6 right-6 top-[23px] h-1 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
            {(() => {
              const pathDone = REWARD_PATH.filter((r) => reclamados[r.id]).length;
              const pathPct = Math.min((pathDone / REWARD_PATH.length) * 100, 100);
              return (
                <div
                  className="absolute left-6 top-[23px] h-1 rounded-full transition-all duration-700"
                  style={{ width: `${pathPct > 0 ? pathPct : 2}%`, background: "linear-gradient(90deg, #F59E0B, #FBBF24)" }}
                />
              );
            })()}
            <div className="flex justify-between relative">
              {REWARD_PATH.map((reward) => {
                const mision = missionMap[reward.id];
                const { actual, meta } = mision.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
                const completed = actual >= meta;
                const claimed = reclamados[mision.id];
                const isNext = completed && !claimed;

                return (
                  <div key={reward.id} className="flex flex-col items-center gap-1.5" style={{ width: 80, opacity: claimed ? 1 : completed ? 1 : 0.55 }}>
                    <div
                      className="rounded-2xl flex items-center justify-center"
                      style={{
                        width: isNext ? 54 : 48, height: isNext ? 54 : 48,
                        marginTop: isNext ? -3 : 0,
                        background: claimed ? "#1C2B22" : isNext ? "#2A2010" : "rgba(255,255,255,0.04)",
                        border: claimed ? "2px solid #10B981" : isNext ? "2px solid #FBBF24" : "2px solid rgba(255,255,255,0.12)",
                        ...(isNext ? { animation: "glowPulse 2s infinite" } : {}),
                      }}
                    >
                      {claimed ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : isNext ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                        </svg>
                      ) : (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-[9.5px] font-bold text-center leading-tight"
                      style={{ color: claimed ? "#6EE7B7" : isNext ? "#FBBF24" : "#A1A1AA", fontWeight: isNext ? 800 : 700 }}
                    >
                      {reward.label.split(" ").map((w, i) => (
                        <React.Fragment key={i}>{i > 0 && <br />}{w}</React.Fragment>
                      ))}
                    </span>
                    <span
                      className="text-[8.5px]"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: isNext ? "#FBBF24" : "#52525B" }}
                    >
                      {isNext ? "SIGUIENTE" : `NIVEL ${reward.lvl}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── MISSIONS ── */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-[#52525B]">Misiones activas</span>
            <span className="text-[10.5px] text-[#71717A] font-semibold">
              {completedCount} completadas · {readyToClaim} listas para reclamar
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {misiones.map((mision) => {
              const Icon = mision.icon;
              const { actual, meta } = mision.getProgreso({ prospects, activeCount, totalLeads, totalComisiones, uniqueIndustries });
              const completed = actual >= meta;
              const isClaimed = reclamados[mision.id];
              const pct = Math.min((actual / meta) * 100, 100);
              const ready = completed && !isClaimed;

              return (
                <div
                  key={mision.id}
                  className="bg-white rounded-2xl p-3.5 relative transition-all"
                  style={{
                    border: ready ? "1.5px solid #FBBF24" : "1px solid #E8E8EA",
                    boxShadow: ready ? "0 4px 14px rgba(245,158,11,0.12)" : undefined,
                    opacity: completed && isClaimed ? 0.85 : 1,
                  }}
                >
                  {ready && (
                    <span
                      className="absolute -top-2 right-3 text-white text-[8.5px] font-extrabold uppercase tracking-[1px] rounded-full px-2 py-0.5"
                      style={{ background: "#F59E0B" }}
                    >
                      Lista para reclamar
                    </span>
                  )}

                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: completed ? "#FEF3C7" : isClaimed ? "#ECFDF5" : "#EEF2FF",
                      }}
                    >
                      <Icon
                        className="h-[17px] w-[17px]"
                        style={{ color: completed ? "#D97706" : isClaimed ? "#059669" : "#4F46E5" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-extrabold truncate">{mision.titulo}</div>
                      <div className="text-[10.5px] text-[#71717A] truncate">{mision.descripcion}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex-1 h-[7px] bg-[#F4F4F5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: completed ? "#10B981" : "linear-gradient(90deg, #F59E0B, #FBBF24)",
                        }}
                      />
                    </div>
                    <span
                      className="text-[10px] font-bold"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: completed ? "#065F46" : "#B45309" }}
                    >
                      {actual.toLocaleString()}/{meta.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2.5">
                    <span
                      className="text-[10px] font-bold rounded-lg px-2 py-1 border"
                      style={{
                        color: completed || ready ? "#92400E" : "#52525B",
                        background: completed || ready ? "#FFFBEB" : "#FAFAFA",
                        borderColor: completed || ready ? "#FDE68A" : "#E8E8EA",
                      }}
                    >
                      {mision.recompensa}
                    </span>

                    {completed ? (
                      isClaimed ? (
                        <button
                          disabled
                          className="rounded-xl px-4 py-2 text-[11px] font-extrabold cursor-not-allowed"
                          style={{ background: "#F4F4F5", color: "#A1A1AA", border: "1px solid #E8E8EA" }}
                        >
                          Reclamado ✓
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReclamar(mision.id)}
                          className="rounded-xl px-4 py-2 text-[11px] font-extrabold text-white cursor-pointer active:scale-95 transition-transform"
                          style={{ background: "linear-gradient(180deg, #F59E0B, #D97706)", border: "none", animation: "glowPulse 2s infinite" }}
                        >
                          Reclamar
                        </button>
                      )
                    ) : (
                      <span className="text-[10.5px] font-bold text-[#B45309]">
                        {meta - actual > 0 ? `Te faltan ${(meta - actual).toLocaleString()} ${actual === 0 ? "" : "más"}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ──────────────── RIGHT PANEL ──────────────── */}
      <div className="w-full lg:w-[330px] flex-shrink-0 flex flex-col gap-3.5">

        {/* ── LIGA ZAFIRO ── */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden border border-[#E8E8EA] flex flex-col min-h-0">
          <div className="p-4 text-white" style={{ background: "linear-gradient(160deg, #1E2A5E, #101018)" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#60A5FA" stroke="#93C5FD" strokeWidth="1">
                  <path d="M6 3h12l4 6-10 13L2 9l4-6z" />
                </svg>
                <span className="text-[15px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Liga Zafiro</span>
              </div>
              <span
                className="text-[9.5px] font-extrabold rounded-full px-2.5 py-0.5"
                style={{ fontFamily: "'JetBrains Mono', monospace", background: "rgba(255,255,255,0.1)" }}
              >
                Termina en 3d 07h
              </span>
            </div>
            <div className="text-[10.5px] text-[#BFDBFE] mt-1.5 leading-relaxed">
              Top 3 asciende a Liga Diamante y gana <strong className="text-white">+5% de comisión</strong> en el próximo pago.
            </div>

            {/* Podium */}
            <div className="flex items-end justify-center gap-2 mt-4">
              {mockRanking.slice(0, 3).map((member, i) => {
                const posOrder = [1, 0, 2]; // 2nd, 1st, 3rd visual order
                const ordered = mockRanking.slice(0, 3)[posOrder[i]];
                const podiumHeights = [34, 48, 26];
                return (
                  <div key={ordered.name} className="flex flex-col items-center gap-1">
                    {ordered.position === 1 && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#FBBF24">
                        <path d="M2 8l5 4 5-8 5 8 5-4-2 12H4L2 8z" />
                      </svg>
                    )}
                    <div
                      className="rounded-full flex items-center justify-center font-extrabold border-2 flex-shrink-0"
                      style={{
                        width: ordered.position === 1 ? 38 : 34, height: ordered.position === 1 ? 38 : 34,
                        background: ordered.position === 1 ? "#FBBF24" : ordered.position === 2 ? "#CBD5E1" : "#D97706",
                        color: ordered.position === 1 ? "#78350F" : ordered.position === 2 ? "#334155" : "#fff",
                        borderColor: ordered.position === 1 ? "#FDE68A" : ordered.position === 2 ? "#E2E8F0" : "#F59E0B",
                        fontSize: ordered.position === 1 ? 13 : 12,
                        marginTop: ordered.position === 1 ? 0 : 16, // compensate for crown height
                      }}
                    >
                      {ordered.avatar}
                    </div>
                    <div
                      className="w-14 flex items-center justify-center rounded-t-lg"
                      style={{
                        height: podiumHeights[i],
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: ordered.position === 1 ? 15 : ordered.position === 2 ? 13 : 12,
                        fontWeight: 700,
                        color: ordered.position === 1 ? "#FBBF24" : ordered.position === 2 ? "#CBD5E1" : "#FDBA74",
                        background: ordered.position === 1
                          ? "rgba(251,191,36,0.2)"
                          : ordered.position === 2
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(255,255,255,0.08)",
                        border: ordered.position === 1 ? "1px solid rgba(251,191,36,0.35)" : "none",
                        borderBottom: "none",
                      }}
                    >
                      {ordered.position}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3">
            {mockRanking.map((member) => {
              const isInTop3 = member.position <= 3;
              return (
                <div
                  key={member.name}
                  className="flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors hover:bg-[#FAFAFA]"
                  style={{
                    background: member.isMe ? "#EEF2FF" : undefined,
                    border: member.isMe ? "1px solid #C7D2FE" : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-[18px] text-center text-[11px] font-bold"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isInTop3 ? "#D97706" : member.position === 4 ? "#4338CA" : member.position <= 5 ? "#A1A1AA" : "#A1A1AA",
                      }}
                    >
                      {member.position}
                    </span>
                    <div
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0"
                      style={{
                        background: member.isMe
                          ? "linear-gradient(135deg, #4F46E5, #7C3AED)"
                          : isInTop3
                          ? member.position === 1 ? "#FEF3C7" : member.position === 2 ? "#F1F5F9" : "#FFF7ED"
                          : "#F4F4F5",
                        color: member.isMe ? "#fff" : isInTop3 ? (member.position === 1 ? "#92400E" : member.position === 2 ? "#475569" : "#C2410C") : "#52525B",
                      }}
                    >
                      {member.avatar}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="text-xs font-bold truncate"
                        style={{ color: member.isMe ? "#312E81" : undefined, fontWeight: member.isMe ? 800 : 700 }}
                      >
                        {member.name}
                      </span>
                      {member.isMe && xpToTop3 > 0 && (
                        <span className="text-[9px] font-extrabold text-[#4338CA] bg-[#E0E7FF] rounded-full px-1.5 py-0.5 whitespace-nowrap">
                          A {xpToTop3} XP del Top 3
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold flex-shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace", color: member.isMe ? "#312E81" : undefined, fontWeight: member.isMe ? 800 : 700 }}>
                    {member.xp.toLocaleString()} XP
                  </span>
                </div>
              );
            })}

          </div>
        </div>

        {/* ── COFRE SEMANAL ── */}
        <div
          className="rounded-2xl p-4 text-white flex items-center gap-3.5 border"
          style={{ background: "linear-gradient(160deg, #2A2010, #171208)", borderColor: "#78350F" }}
        >
          <div
            className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center flex-shrink-0 border"
            style={{ background: "rgba(251,191,36,0.12)", borderColor: "rgba(251,191,36,0.3)", animation: "glowPulse 2.5s infinite" }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 8v13H3V8 M1 3h22v5H1z M10 12h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-extrabold text-[#FDE68A]">Cofre semanal</div>
            <div className="text-[10.5px] text-[#D6BC8A] leading-relaxed mt-0.5">
              Reclama {WEEKLY_GOAL} misiones esta semana y ábrelo: XP doble o una plantilla premium.
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(weeklyClaimed / WEEKLY_GOAL) * 100}%`, background: "#FBBF24" }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#FBBF24]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {weeklyClaimed}/{WEEKLY_GOAL}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* glowPulse animation */}
      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.45); }
          50% { box-shadow: 0 0 0 9px rgba(245,158,11,0); }
        }
      `}</style>
    </div>
  );
}
