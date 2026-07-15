"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { CheckCircle2, Gift, Star, Zap, Trophy, Target, Users, DollarSign } from "lucide-react";

interface Mision {
  id: string;
  titulo: string;
  descripcion: string;
  icon: React.ElementType;
  recompensa: string;
  condicion: (data: { prospects: any[]; activeCount: number; user: any }) => boolean;
}

export default function PremiosPage() {
  const { prospects, activeCount } = useDashboard();
  const { user } = useAuth();

  const misiones: Mision[] = [
    {
      id: "m1",
      titulo: "Primera empresa registrada",
      descripcion: "Registra tu primera empresa en la cartera de clientes",
      icon: Target,
      recompensa: "Badge Explorer",
      condicion: (d) => d.prospects.length >= 1,
    },
    {
      id: "m2",
      titulo: "Constructor de cartera",
      descripcion: "Ten 5 empresas en tu cartera de clientes",
      icon: Users,
      recompensa: "Plantillas premium de WhatsApp",
      condicion: (d) => d.prospects.length >= 5,
    },
    {
      id: "m3",
      titulo: "Primera cuenta activada",
      descripcion: "Consigue que un cliente active su cuenta de Nexor",
      icon: Zap,
      recompensa: "Gorra Nexor edición limitada",
      condicion: (d) => d.activeCount >= 1,
    },
    {
      id: "m4",
      titulo: "Growth Partner",
      descripcion: "Activa 5 cuentas para subir a nivel Growth (20% comisión)",
      icon: Star,
      recompensa: "Audífonos Sony WH-1000XM6",
      condicion: (d) => d.activeCount >= 5,
    },
    {
      id: "m5",
      titulo: "Elite Partner",
      descripcion: "Activa 10 cuentas para llegar a nivel Elite (25% comisión)",
      icon: Trophy,
      recompensa: "PlayStation 5 Pro",
      condicion: (d) => d.activeCount >= 10,
    },
    {
      id: "m6",
      titulo: "Lead Master",
      descripcion: "Consigue que tus clientes procesen 1,000 leads en total",
      icon: Target,
      recompensa: "Gift Card Amazon $200 USD",
      condicion: (d) => {
        const totalLeads = d.prospects.reduce((s, p) => s + (p.leadsConsumed || 0), 0);
        return totalLeads >= 1000;
      },
    },
    {
      id: "m7",
      titulo: "Comisionista Pro",
      descripcion: "Genera más de $5,000 USD en comisiones totales",
      icon: DollarSign,
      recompensa: "Viaje todo pagado a Nexor Summit 2026",
      condicion: (d) => {
        const total = d.prospects
          .filter((p) => p.status === "Generando comisiones")
          .reduce((s, p) => s + (p.commissionEarned || 0), 0);
        return total >= 5000;
      },
    },
    {
      id: "m8",
      titulo: "Embajador Global",
      descripcion: "Ten clientes en 3 industrias diferentes",
      icon: Star,
      recompensa: "MacBook Air M4",
      condicion: (d) => {
        const industries = new Set(d.prospects.map((p) => p.industry));
        return industries.size >= 3;
      },
    },
  ];

  const completedCount = misiones.filter((m) => m.condicion({ prospects, activeCount, user })).length;
  const progressPct = Math.round((completedCount / misiones.length) * 100);

  const totalLeads = prospects.reduce((s, p) => s + (p.leadsConsumed || 0), 0);
  const totalComisiones = prospects
    .filter((p) => p.status === "Generando comisiones")
    .reduce((s, p) => s + (p.commissionEarned || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-3xl p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black">Pase de Batalla Nexor</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Completa misiones y desbloquea recompensas exclusivas</p>
          </div>
          <div className="text-right">
            <div className="h-16 w-16 rounded-full border-4 border-white/20 flex flex-col items-center justify-center">
              <span className="text-xl font-black">{completedCount}</span>
              <span className="text-[9px] text-neutral-400">/ {misiones.length}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Progreso total</span>
            <span className="font-bold">{progressPct}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-lg font-black">{activeCount}</p>
            <p className="text-[10px] text-neutral-400">Cuentas activas</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-lg font-black">{totalLeads.toLocaleString()}</p>
            <p className="text-[10px] text-neutral-400">Leads procesados</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-lg font-black">${totalComisiones.toLocaleString()}</p>
            <p className="text-[10px] text-neutral-400">Comisiones</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {misiones.map((mision, index) => {
          const Icon = mision.icon;
          const completed = mision.condicion({ prospects, activeCount, user });
          return (
            <div
              key={mision.id}
              className={`border rounded-2xl p-5 transition-all ${
                completed
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-white border-gray-150 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`p-2.5 rounded-xl ${completed ? "bg-emerald-100" : "bg-gray-100"}`}>
                    <Icon className={`h-4 w-4 ${completed ? "text-emerald-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className={`text-sm font-bold ${completed ? "text-emerald-900" : "text-gray-500"}`}>
                        {mision.titulo}
                      </h4>
                      {completed && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    </div>
                    <p className={`text-[11px] mt-0.5 ${completed ? "text-emerald-700" : "text-gray-400"}`}>
                      {mision.descripcion}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`mt-3 pt-3 border-t ${completed ? "border-emerald-150" : "border-gray-100"}`}>
                <div className="flex items-center space-x-2">
                  <Gift className={`h-3.5 w-3.5 ${completed ? "text-emerald-600" : "text-gray-300"}`} />
                  <span className={`text-[11px] font-bold ${completed ? "text-emerald-800" : "text-gray-400"}`}>
                    {mision.recompensa}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
