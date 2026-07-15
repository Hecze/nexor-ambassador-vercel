"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { TIERS } from "@/lib/data";
import { DollarSign, TrendingUp, Calendar, Trophy, Users, Coins, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

export default function FacturacionPage() {
  const { prospects, activeCount } = useDashboard();
  const { user } = useAuth();

  const activeCommissionPct = activeCount < 5 ? 0.15 : activeCount < 10 ? 0.20 : 0.25;
  const currentTier = activeCount < 5 ? TIERS[0] : activeCount < 10 ? TIERS[1] : TIERS[2];

  const totalComisiones = prospects
    .filter((p) => p.status === "Generando comisiones")
    .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);

  const facturacionTotal = prospects.reduce((sum, p) => sum + p.estimatedValue, 0);
  const clientesGenerando = prospects.filter((p) => p.status === "Generando comisiones");
  const cuentasActivas = prospects.filter((p) => p.status === "Cuenta activada" || p.status === "Generando comisiones");
  const pendingInvoices = prospects.flatMap((p) => (p.invoices || []).filter((inv) => inv.status === "Pendiente"));
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(10);
  if (nextPaymentDate.getTime() < Date.now()) nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const topClients = [...prospects]
    .filter((p) => p.commissionEarned && p.commissionEarned > 0)
    .sort((a, b) => (b.commissionEarned || 0) - (a.commissionEarned || 0))
    .slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-50 rounded-xl"><DollarSign className="h-4 w-4 text-emerald-600" /></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Próximo pago</span>
          </div>
          <p className="text-xl font-black text-gray-900">{nextPaymentDate.toLocaleDateString("es", { day: "numeric", month: "long" })}</p>
          <p className="text-xs text-gray-400">en {daysUntilPayment} días</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-neutral-100 rounded-xl"><Coins className="h-4 w-4 text-neutral-700" /></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Comisión estimada</span>
          </div>
          <p className="text-xl font-black text-gray-900">${totalComisiones.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{(activeCommissionPct * 100).toFixed(0)}% de comisión ({currentTier.name})</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-xl"><TrendingUp className="h-4 w-4 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Facturación total</span>
          </div>
          <p className="text-xl font-black text-gray-900">${facturacionTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{cuentasActivas.length} cuentas activas</p>
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-5 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-50 rounded-xl"><Calendar className="h-4 w-4 text-amber-600" /></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Pendiente cobro</span>
          </div>
          <p className="text-xl font-black text-gray-900">${pendingTotal.toLocaleString()}</p>
          <p className="text-xs text-gray-400">{pendingInvoices.length} facturas pendientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Top Clientes por Comisión</span>
          </h3>
          {topClients.length === 0 ? (
            <p className="text-xs text-gray-400">Aún no tienes clientes generando comisiones. ¡Activa tu primera cuenta!</p>
          ) : (
            <div className="space-y-3">
              {topClients.map((c, i) => (
                <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-mono font-bold text-gray-400">#{i + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{c.company}</p>
                      <p className="text-[10px] text-gray-400">{c.name} · {c.industry}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">${(c.commissionEarned || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-150 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-black text-gray-900 flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>Resumen de Cartera</span>
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">Empresas en cartera</span>
              <span className="text-xs font-black text-gray-900">{prospects.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">Cuentas activadas</span>
              <span className="text-xs font-black text-emerald-600">{cuentasActivas.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">Generando comisiones</span>
              <span className="text-xs font-black text-emerald-600">{clientesGenerando.length}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-bold text-gray-700">Nivel actual</span>
              <span className="text-xs font-black text-amber-700 flex items-center space-x-1">
                <Trophy className="h-3 w-3" />
                <span>{currentTier.name} ({(activeCommissionPct * 100).toFixed(0)}%)</span>
              </span>
            </div>
          </div>
          <Link
            href="/dashboard/prospects"
            className="block text-center w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all"
          >
            Ir a cartera de clientes
          </Link>
        </div>
      </div>
    </div>
  );
}
