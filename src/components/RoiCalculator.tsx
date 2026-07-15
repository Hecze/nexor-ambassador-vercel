"use client";

import React, { useState } from "react";
import { TrendingUp, DollarSign, Users, Target, Coins } from "lucide-react";
import { useDashboard } from "@/lib/dashboard-context";

export default function RoiCalculator() {
  const { activeCount } = useDashboard();
  const [mode, setMode] = useState<"prepago" | "suscripcion">("prepago");
  const [partnerClients, setPartnerClients] = useState(3);
  const [partnerLeadsPerClient, setPartnerLeadsPerClient] = useState(300);
  const [clientLeads, setClientLeads] = useState(400);
  const [clientTicket, setClientTicket] = useState(850);
  const [clientCloseRate, setClientCloseRate] = useState(8);

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
  const roi = costoNexor > 0 ? (retornoDemo / costoNexor).toFixed(1) : "0";

  const leadsAtendidosSinNexor = Math.round(clientLeads * 0.35);
  const leadsAtendidosConNexor = clientLeads;

  return (
    <div className="p-5 space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Mode toggle */}
      <div className="flex gap-1 bg-[#F4F4F5] rounded-xl p-1 w-fit">
        <button
          onClick={() => setMode("prepago")}
          className={`px-4 py-2 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
            mode === "prepago" ? "bg-white text-[#111113] shadow-sm" : "text-[#71717A]"
          }`}
        >
          Para el cliente
        </button>
        <button
          onClick={() => setMode("suscripcion")}
          className={`px-4 py-2 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
            mode === "suscripcion" ? "bg-white text-[#111113] shadow-sm" : "text-[#71717A]"
          }`}
        >
          Mis ganancias
        </button>
      </div>

      {mode === "prepago" ? (
        <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-4 items-start">
          {/* INPUTS */}
          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-5 space-y-5">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-[#3F3F46]">Leads mensuales que recibe</span>
                  <span className="text-xs font-bold bg-[#F4F4F5] rounded-lg px-2 py-0.5 font-mono">{clientLeads}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={10}
                  value={clientLeads}
                  onChange={(e) => setClientLeads(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-[#111113]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-[#3F3F46]">Conversión actual a venta</span>
                  <span className="text-xs font-bold bg-[#F4F4F5] rounded-lg px-2 py-0.5 font-mono">{clientCloseRate}%</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={clientCloseRate}
                  onChange={(e) => setClientCloseRate(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-[#111113]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-[#3F3F46]">Ticket promedio por venta</span>
                  <span className="text-xs font-bold bg-[#F4F4F5] rounded-lg px-2 py-0.5 font-mono">${clientTicket}</span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={50}
                  value={clientTicket}
                  onChange={(e) => setClientTicket(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-[#111113]"
                />
              </div>
            </div>

            <div className="bg-[#FAFAFA] border border-[#F0F0F2] rounded-xl p-3.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A] mb-2">Supuestos de Nexor</div>
              <div className="space-y-1.5 text-[11px] text-[#52525B]">
                <div className="flex justify-between"><span>Respuesta al lead</span><strong className="font-mono">&lt; 60 seg</strong></div>
                <div className="flex justify-between"><span>Leads atendidos 24/7</span><strong className="font-mono">100%</strong></div>
                <div className="flex justify-between"><span>Mejora típica de conversión</span><strong className="font-mono">+50%</strong></div>
                <div className="flex justify-between"><span>Costo por lead calificado</span><strong className="font-mono">$15</strong></div>
              </div>
            </div>
          </div>

          {/* RESULTS */}
          <div className="space-y-3">
            <div className="bg-[#101018] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-[-60px] right-[-30px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.25),transparent_70%)] pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6EE7B7]">Revenue extra proyectado para el cliente</div>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-[44px] font-bold tracking-tight leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+${retornoDemo.toLocaleString()}</span>
                  <span className="text-[13px] text-[#A1A1AA] font-semibold">/ mes</span>
                </div>
                <div className="flex gap-5 mt-3.5">
                  <div>
                    <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#71717A]">ROI</div>
                    <div className="text-[19px] font-bold text-[#34D399]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{roi}x</div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#71717A]">Ventas extra</div>
                    <div className="text-[19px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>+{ventasAdicionales} / mes</div>
                  </div>
                  <div>
                    <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#71717A]">Inversión</div>
                    <div className="text-[19px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>${costoNexor.toLocaleString()} / mes</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4 space-y-3">
              <div className="text-xs font-extrabold">Cálculo mensual</div>
              <div className="flex items-center gap-2 text-[11px] text-[#52525B] font-mono">
                <span>{clientLeads} leads</span>
                <span className="text-[#A1A1AA]">×</span>
                <span>{tasaIncrementada.toFixed(0)}% conversión</span>
                <span className="text-[#A1A1AA]">×</span>
                <span>${clientTicket} ticket</span>
                <span className="text-[#A1A1AA]">=</span>
                <strong className="text-[#111113] text-sm">{ventasConNexor} ventas</strong>
              </div>
              <div className="flex justify-between text-xs pt-2 border-t border-[#F0F0F2]">
                <span className="text-[#71717A]">Costo Nexor ({clientLeads} × ${nexorLeadRate})</span>
                <strong className="font-mono text-[#111113]">${costoNexor.toLocaleString()}/mes</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#71717A]">Revenue proyectado</span>
                <strong className="font-mono text-[#059669]">${(ventasConNexor * clientTicket).toLocaleString()}/mes</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#71717A]">ROI</span>
                <strong className="font-mono text-[#111113]">{roi}x</strong>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-[#D97706]" />
              </div>
              <div className="flex-1">
                <div className="text-[12.5px] font-extrabold text-[#78350F]">Si cierras este cliente, tú ganas</div>
                <div className="text-[11px] text-[#92400E] mt-0.5">{Math.round(activeCommissionPct * 100)}% de comisión recurrente sobre ${costoNexor.toLocaleString()}/mes de consumo estimado</div>
              </div>
              <div className="text-right">
                <div className="text-[26px] font-bold text-[#B45309] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  ${Math.round(costoNexor * activeCommissionPct)}<span className="text-[13px] font-semibold text-[#92400E]">/mes</span>
                </div>
                <div className="text-[10px] font-bold text-[#92400E] mt-0.5">${Math.round(costoNexor * activeCommissionPct * 12).toLocaleString()} al año · recurrente</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-4 items-start">
          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-5 space-y-5">
            <div className="text-xs font-extrabold">Tu cartera de clientes</div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-[#3F3F46]">Clientes activos</span>
                  <span className="text-xs font-bold bg-[#F4F4F5] rounded-lg px-2 py-0.5 font-mono">{partnerClients}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={partnerClients}
                  onChange={(e) => setPartnerClients(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-[#111113]"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[11.5px] font-bold text-[#3F3F46]">Leads/mes por cliente</span>
                  <span className="text-xs font-bold bg-[#F4F4F5] rounded-lg px-2 py-0.5 font-mono">{partnerLeadsPerClient}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={2000}
                  step={10}
                  value={partnerLeadsPerClient}
                  onChange={(e) => setPartnerLeadsPerClient(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#F0F0F2] rounded-full appearance-none cursor-pointer accent-[#111113]"
                />
              </div>
            </div>
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3.5">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#92400E]">Tarifa Nexor</div>
              <div className="text-sm font-extrabold text-[#78350F] mt-1">${nexorLeadRate} USD por lead calificado</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-[#101018] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="absolute top-[-60px] right-[-30px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.25),transparent_70%)] pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#6EE7B7]">Facturación total de tu cartera</div>
                <div className="flex items-baseline gap-3 mt-1.5">
                  <span className="text-[44px] font-bold tracking-tight leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>${facturacionTotal.toLocaleString()}</span>
                  <span className="text-[13px] text-[#A1A1AA] font-semibold">/ mes</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#ECFDF5] flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5 text-[#059669]" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#71717A]">Tu comisión ({(activeCommissionPct * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <div className="text-[32px] font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>${gananciasSocio.toLocaleString()}<span className="text-[13px] font-semibold text-[#71717A]">/mes</span></div>
              <div className="text-[11px] text-[#71717A] mt-1">Recurrente mientras el cliente use Nexor</div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4">
              <div className="text-[11px] font-extrabold text-[#78350F]">Proyección anual</div>
              <div className="text-[20px] font-bold text-[#B45309] mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>${(gananciasSocio * 12).toLocaleString()} <span className="text-xs font-semibold text-[#92400E]">USD al año</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
