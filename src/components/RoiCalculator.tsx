"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, Percent, Users, Target, Coins } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";
import { TIERS } from "@/lib/data";

export default function RoiCalculator() {
  const { activeCount } = useDashboard();
  const [mode, setMode] = useState<"prepago" | "suscripcion">("prepago");
  const [partnerClients, setPartnerClients] = useState(3);
  const [partnerLeadsPerClient, setPartnerLeadsPerClient] = useState(300);
  const [clientLeads, setClientLeads] = useState(500);
  const [clientTicket, setClientTicket] = useState(2000);
  const [clientCloseRate, setClientCloseRate] = useState(10);
  const [clientIndustry, setClientIndustry] = useState<"Automotriz" | "Inmobiliaria" | "SaaS" | "Servicios">("Inmobiliaria");

  const nexorLeadRate = 15;
  const activeCommissionPct = activeCount < 5 ? 0.15 : activeCount < 10 ? 0.20 : 0.25;

  const facturacionTotal = partnerClients * partnerLeadsPerClient * nexorLeadRate;
  const gananciasSocio = Math.round(facturacionTotal * activeCommissionPct);

  const conversionBoost = 0.20;
  const tasaIncrementada = clientCloseRate * (1 + conversionBoost);
  const ventasConNexor = Math.round(clientLeads * (tasaIncrementada / 100));
  const ventasSinNexor = Math.round(clientLeads * (clientCloseRate / 100));
  const ventasAdicionales = Math.max(ventasConNexor - ventasSinNexor, 0);
  const retornoDemo = ventasAdicionales * clientTicket;
  const costoNexor = clientLeads * nexorLeadRate;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex border-b border-gray-250 pb-2 space-x-6 text-xs">
        <button
          onClick={() => setMode("prepago")}
          className={`pb-2 font-black uppercase tracking-wider transition-all cursor-pointer ${
            mode === "prepago" ? "border-b-2 border-neutral-900 text-neutral-900" : "text-gray-400"
          }`}
        >
          Simulador para Clientes
        </button>
        <button
          onClick={() => setMode("suscripcion")}
          className={`pb-2 font-black uppercase tracking-wider transition-all cursor-pointer ${
            mode === "suscripcion" ? "border-b-2 border-neutral-900 text-neutral-900" : "text-gray-400"
          }`}
        >
          Mis Ganancias (Partner)
        </button>
      </div>

      {mode === "prepago" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-neutral-900" />
                <span>Parámetros de la Empresa Cliente</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Industria</label>
                  <select
                    value={clientIndustry}
                    onChange={(e) => setClientIndustry(e.target.value as never)}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                  >
                    <option value="Automotriz">Automotriz</option>
                    <option value="Inmobiliaria">Inmobiliaria</option>
                    <option value="SaaS">SaaS / B2B</option>
                    <option value="Servicios">Salud / Servicios</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Leads Mensuales Actuales</label>
                  <input
                    type="number"
                    value={clientLeads}
                    onChange={(e) => setClientLeads(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Ticket Promedio (USD)</label>
                  <input
                    type="number"
                    value={clientTicket}
                    onChange={(e) => setClientTicket(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400">Tasa de Cierre Actual (%)</label>
                  <input
                    type="number"
                    value={clientCloseRate}
                    onChange={(e) => setClientCloseRate(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
              <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-neutral-900" />
                <span>Proyección de Impacto (ROI)</span>
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ventas c/Nexor</p>
                  <p className="text-2xl font-black text-neutral-900">{ventasConNexor}</p>
                </div>
                <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Ventas Sin Nexor</p>
                  <p className="text-2xl font-black text-neutral-900">{ventasSinNexor}</p>
                </div>
                <div className="col-span-2 bg-emerald-50 rounded-2xl p-5 border border-emerald-100 space-y-1">
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">Ventas Adicionales Recuperadas</p>
                  <p className="text-3xl font-black text-emerald-800">+{ventasAdicionales} ventas</p>
                  <p className="text-xs text-emerald-600 font-semibold">
                    Representan ${retornoDemo.toLocaleString()} USD adicionales/mes
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Inversión Estimada en Nexor</p>
                <p className="text-xl font-black text-gray-900">${costoNexor.toLocaleString()} USD/mes</p>
                <p className={`text-[11px] font-bold ${retornoDemo > costoNexor * 2 ? "text-emerald-600" : "text-amber-600"}`}>
                  ROI estimado: {costoNexor > 0 ? Math.round((retornoDemo / costoNexor) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
              <Users className="h-5 w-5 text-neutral-900" />
              <span>Tu Cartera de Clientes</span>
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Clientes Activos</label>
                <input
                  type="number"
                  value={partnerClients}
                  onChange={(e) => setPartnerClients(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400">Leads/Mes por Cliente</label>
                <input
                  type="number"
                  value={partnerLeadsPerClient}
                  onChange={(e) => setPartnerLeadsPerClient(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs font-bold outline-none focus:border-neutral-900"
                />
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-1">
              <p className="text-[10px] font-bold text-amber-700 uppercase">Tarifa Nexor</p>
              <p className="text-sm font-black text-amber-900">${nexorLeadRate} USD por lead calificado</p>
            </div>
          </div>
          <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-black text-gray-900 flex items-center space-x-2">
              <Coins className="h-5 w-5 text-neutral-900" />
              <span>Ganancias Proyectadas</span>
            </h3>
            <div className="grid gap-4">
              <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Facturación Total</p>
                <p className="text-2xl font-black text-neutral-900">${facturacionTotal.toLocaleString()}/mes</p>
              </div>
              <div className="bg-neutral-900 rounded-2xl p-5 border border-neutral-800 text-white space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase">Tu Comisión ({(activeCommissionPct * 100).toFixed(0)}%)</p>
                <p className="text-3xl font-black">${gananciasSocio.toLocaleString()}/mes</p>
                <p className="text-xs text-neutral-400">Recurrente mensual mientras el cliente use Nexor</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
