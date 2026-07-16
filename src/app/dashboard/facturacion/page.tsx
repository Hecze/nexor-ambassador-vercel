"use client";

import React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/lib/auth-context";
import { TIERS } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const COLORS = [
  "#111113", "#4F46E5", "#059669", "#D97706", "#DC2626", "#7C3AED", "#0891B2", "#E11D48",
  "#2563EB", "#C026D3", "#0D9488", "#CA8A04", "#BE123C", "#3730A3", "#15803D", "#B45309",
];

function getInitialColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function FacturacionPage() {
  const { prospects, activeCount } = useDashboard();
  const { user } = useAuth();

  const activeCommissionPct = activeCount < 5 ? 0.15 : activeCount < 10 ? 0.20 : 0.25;
  const currentTier = activeCount < 5 ? TIERS[0] : activeCount < 10 ? TIERS[1] : TIERS[2];
  const currentTierIdx = activeCount < 5 ? 0 : activeCount < 10 ? 1 : 2;

  const totalComisiones = prospects
    .filter((p) => p.status === "Generando comisiones")
    .reduce((sum, p) => sum + (p.commissionEarned || 0), 0);

  const facturacionTotal = prospects.reduce((sum, p) => sum + p.estimatedValue, 0);
  const clientesGenerando = prospects.filter((p) => p.status === "Generando comisiones");
  const cuentasActivas = prospects.filter((p) => p.status === "Cuenta activada" || p.status === "Generando comisiones");
  const pendingInvoices = prospects.flatMap((p) => (p.invoices || []).filter((inv) => inv.status === "Pendiente"));
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const now = new Date();
  const monthName = MESES[now.getMonth()];

  const nextPaymentDate = new Date();
  nextPaymentDate.setDate(10);
  if (nextPaymentDate.getTime() < Date.now()) nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const nextPaymentMonth = MESES[nextPaymentDate.getMonth()];
  const nextPaymentDay = nextPaymentDate.getDate();

  const allInvoices = prospects.flatMap((p) =>
    (p.invoices || []).map((inv) => ({ ...inv, company: p.company }))
  );
  const recentInvoices = [...allInvoices]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const monthsSince = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    if (isNaN(d.getTime())) return 0;
    return Math.max(1, Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30)));
  };

  const chartData = (() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const progress = (5 - i) / 5;
      const val = Math.round(totalComisiones * (0.35 + progress * 0.65));
      data.push({
        mes: MESES[d.getMonth()].slice(0, 3),
        ganancias: i === 0 ? totalComisiones : val,
      });
    }
    return data;
  })();

  const commissionTable = [...prospects].filter(
    (p) => p.status === "Generando comisiones" || (p.invoices || []).some((inv) => inv.status === "Pendiente")
  );

  const nextTier = currentTierIdx < TIERS.length - 1 ? TIERS[currentTierIdx + 1] : null;
  const nextTierPct = currentTierIdx < 2 ? [0.20, 0.25][currentTierIdx] : null;
  const tierProgress = currentTierIdx === 0
    ? Math.min(activeCount / 5 * 100, 100)
    : currentTierIdx === 1
      ? Math.min((activeCount - 5) / 5 * 100, 100)
      : 100;

  // Estimate additional MRR at next tier
  const currentMRR = prospects
    .filter((p) => p.status === "Generando comisiones")
    .reduce((sum, p) => sum + (p.estimatedValue || 0), 0);
  const extraAtNextTier = nextTierPct ? Math.round(currentMRR * (nextTierPct - activeCommissionPct)) : 0;

  return (
    <div className="space-y-4 animate-fade-in" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-base tracking-tight text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Facturación
          </div>
          <div className="text-[11px] text-[#71717A]">Cuánto ganas, cuándo cobras y de dónde viene cada dólar</div>
        </div>
        <button
          className="inline-flex items-center gap-[6px] bg-white text-[#111113] border border-[#E8E8EA] rounded-[10px] px-[14px] py-[9px] text-xs font-bold cursor-pointer hover:bg-[#FAFAFA] transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" />
          </svg>
          Descargar estado de cuenta
        </button>
      </div>

      {/* HERO + NEXT PAYMENT + PENDING */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr)" }}>
        <div className="bg-[#0F1712] rounded-2xl p-[18px] text-white relative overflow-hidden">
          <div className="absolute top-[-60px] right-[-30px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)" }} />
          <div className="text-[10px] font-extrabold tracking-[1.2px] uppercase text-[#6EE7B7] relative">
            Comisión acumulada · {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </div>
          <div className="flex items-baseline gap-[10px] mt-[6px] relative">
            <span className="text-[40px] font-bold tracking-[-1px] leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ${totalComisiones.toLocaleString()}
            </span>
            {totalComisiones > 0 && (
              <span className="inline-flex items-center gap-[3px] text-[11px] font-extrabold text-[#34D399] rounded-full px-[9px] py-[3px]" style={{ background: "rgba(16,185,129,0.12)" }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
                {clientesGenerando.length} {clientesGenerando.length === 1 ? "cliente" : "clientes"} activo{clientesGenerando.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#86C7A8] mt-[8px] relative">
            {(activeCommissionPct * 100).toFixed(0)}% de comisión ({currentTier.name.replace(" Partner", "")}) · {clientesGenerando.length} {clientesGenerando.length === 1 ? "cliente generando MRR" : "clientes generando MRR"}
          </div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-[7px]">
            <div className="w-7 h-7 rounded-[9px] bg-[#ECFDF5] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round">
                <path d="M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#71717A]">Próximo pago</span>
          </div>
          <div className="text-[22px] font-bold mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {nextPaymentDay} de {nextPaymentMonth}
          </div>
          <div className="text-[11px] text-[#71717A] mt-[2px]">en {daysUntilPayment} días · transferencia directa</div>
        </div>

        <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
          <div className="flex items-center gap-[7px]">
            <div className="w-7 h-7 rounded-[9px] bg-[#FFFBEB] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M12 6v6l4 2" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold tracking-[1px] uppercase text-[#71717A]">Pendiente de cobro</span>
          </div>
          <div className="text-[22px] font-bold mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            ${pendingTotal.toLocaleString()}
          </div>
          {pendingInvoices.length > 0 ? (
            <div className="text-[11px] text-[#B45309] mt-[2px] font-bold">
              {pendingInvoices.length} factura{pendingInvoices.length !== 1 ? "s" : ""} · {prospects.find((p) => (p.invoices || []).some((inv) => inv.status === "Pendiente"))?.company || ""}
            </div>
          ) : (
            <div className="text-[11px] text-[#71717A] mt-[2px]">Sin facturas pendientes</div>
          )}
        </div>
      </div>

      {/* CAMINO AL SIGUIENTE TIER */}
      {nextTier && (
        <div className="bg-white border border-[#E8E8EA] rounded-2xl px-[18px] py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" />
              </svg>
              <span className="text-xs font-extrabold">Camino a {nextTier.name}</span>
              <span className="text-[10px] font-bold text-[#4338CA] bg-[#EEF2FF] rounded-full px-[9px] py-[2px]">
                Tu comisión sube de {(activeCommissionPct * 100).toFixed(0)}% → {(nextTierPct! * 100).toFixed(0)}%
              </span>
            </div>
            {extraAtNextTier > 0 && (
              <span className="text-[11px] font-bold text-[#71717A]">
                Con tu MRR actual serían <strong className="text-[#059669]">+${extraAtNextTier}/mes</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-[10px] mt-3">
            <span className="text-[10px] font-extrabold text-[#92400E] bg-[#FEF3C7] rounded-full px-[10px] py-[3px] flex-shrink-0">
              {currentTier.name.replace(" Partner", "")} · {(activeCommissionPct * 100).toFixed(0)}%
            </span>
            <div className="flex-1 h-[9px] bg-[#F4F4F5] rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full"
                style={{ width: `${tierProgress}%`, background: "linear-gradient(90deg, #F59E0B, #FBBF24)" }}
              />
            </div>
            <span className="text-[11px] font-bold text-[#B45309] flex-shrink-0" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {activeCount}/{currentTierIdx === 0 ? 5 : 10} cuentas activas
            </span>
            <span className="text-[10px] font-extrabold text-[#3730A3] bg-[#E0E7FF] rounded-full px-[10px] py-[3px] flex-shrink-0">
              {nextTier.name.replace(" Partner", "")} · {(nextTierPct! * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* EARNINGS CHART — in right column, replaces payment history */}
      <div className="grid gap-3 items-start" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)" }}>
        {/* COMMISSIONS TABLE */}
        <div className="bg-white border border-[#E8E8EA] rounded-2xl overflow-hidden">
          <div className="px-[18px] py-[14px] border-b border-[#F0F0F2] flex items-center justify-between">
            <span className="text-xs font-extrabold">Comisiones por cliente</span>
            <span className="text-[10px] font-bold text-[#71717A]">{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {now.getFullYear()}</span>
          </div>
          <div className="grid gap-[10px] px-[18px] py-[9px] border-b border-[#F0F0F2] text-[9.5px] font-extrabold tracking-[1px] uppercase text-[#A1A1AA]" style={{ gridTemplateColumns: "minmax(140px, 1.4fr) 90px 90px 100px 90px" }}>
            <span>Cliente</span>
            <span>Plan</span>
            <span>Facturado</span>
            <span>Tiempo usando</span>
            <span className="text-right">Tu comisión</span>
          </div>

          {commissionTable.length === 0 ? (
            <div className="px-[18px] py-6 text-xs text-[#71717A] text-center">
              Aún no tienes clientes generando comisiones. ¡Activa tu primera cuenta!
            </div>
          ) : (
            commissionTable.map((p) => {
              const isGenerating = p.status === "Generando comisiones";
              const hasPending = (p.invoices || []).some((inv) => inv.status === "Pendiente");
              const pendingAmount = (p.invoices || []).filter((inv) => inv.status === "Pendiente").reduce((s, inv) => s + inv.amount, 0);
              const pendingCommission = Math.round(pendingAmount * activeCommissionPct);
              const initial = (p.company || "?").charAt(0).toUpperCase();

              return (
                <div
                  key={p.id}
                  className="grid gap-[10px] items-center px-[18px] py-3 border-b border-[#F6F6F7]"
                    style={{ gridTemplateColumns: "minmax(140px, 1.4fr) 90px 90px 100px 90px", opacity: isGenerating ? 1 : 0.6 }}
                >
                  <div className="flex items-center gap-[9px]">
                    <div
                      className="w-7 h-7 rounded-[9px] text-white flex items-center justify-center font-extrabold text-[11px] flex-shrink-0"
                      style={{ background: isGenerating ? getInitialColor(p.company) : "#F4F4F5", color: isGenerating ? "#fff" : "#52525B" }}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{p.company}</div>
                      <div className="text-[9.5px] text-[#71717A] truncate">{p.industry}</div>
                    </div>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#52525B]">
                    {((p.invoices || [])[0]?.concept) || "Prepago"}
                  </span>
                  {hasPending && !isGenerating ? (
                    <span className="text-[11.5px] font-bold text-[#B45309]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ${p.estimatedValue.toLocaleString()} pend.
                    </span>
                  ) : (
                    <span className="text-[11.5px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ${p.estimatedValue.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[10.5px] font-bold text-[#52525B]">
                    {monthsSince(p.createdAt)} {monthsSince(p.createdAt) === 1 ? "mes" : "meses"}
                  </span>
                  {isGenerating ? (
                    <span className="text-xs font-bold text-[#059669] text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ${(p.commissionEarned || 0).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#A1A1AA] text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      ${pendingCommission.toLocaleString()} al pagar
                    </span>
                  )}
                </div>
              );
            })
          )}

          <div className="flex justify-between px-[18px] py-3 bg-[#FAFAFA] border-t border-[#F0F0F2]">
            <span className="text-[11px] font-extrabold text-[#52525B]">Total del mes</span>
            <span className="text-[13px] font-bold text-[#059669]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ${totalComisiones.toLocaleString()}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: INVOICES + HISTORY */}
        <div className="flex flex-col gap-3">
          {/* RECENT INVOICES */}
          <div className="bg-white border border-[#E8E8EA] rounded-2xl overflow-hidden">
            <div className="px-4 py-[14px] border-b border-[#F0F0F2] text-xs font-extrabold">Facturas recientes</div>
            {recentInvoices.length === 0 ? (
              <div className="px-4 py-6 text-xs text-[#71717A] text-center">No hay facturas registradas</div>
            ) : (
              recentInvoices.map((inv) => {
                const invDate = inv.date ? new Date(inv.date) : new Date();
                const monthIdx = isNaN(invDate.getTime()) ? 0 : invDate.getMonth();
                const day = isNaN(invDate.getTime()) ? 1 : invDate.getDate();
                const shortMonth = (MESES[monthIdx] || "ene").slice(0, 3);
                const isPending = inv.status === "Pendiente";

                return (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between px-4 py-[11px] border-b border-[#F6F6F7]"
                    style={{ background: isPending ? "#FFFBEB" : "transparent" }}
                  >
                    <div>
                      <div className="text-[11px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {inv.id.length > 10 ? `FAC-${inv.id.slice(0, 4).toUpperCase()}` : inv.id}
                      </div>
                      <div className="text-[10px]" style={{ color: isPending ? "#B45309" : "#71717A" }}>
                        {inv.company} · {day} {shortMonth}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11.5px] font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        ${inv.amount.toLocaleString()}
                      </span>
                      {inv.status === "Pagado" ? (
                        <span className="text-[9px] font-extrabold text-[#065F46] bg-[#D1FAE5] rounded-full px-2 py-[2px]">
                          Pagado
                        </span>
                      ) : (
                        <button
                          className="bg-[#111113] text-white border-none rounded-lg px-[10px] py-[5px] text-[10px] font-extrabold cursor-pointer hover:bg-[#27272A] transition-colors"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          onClick={() => {
                            if (inv.paymentLink) window.open(inv.paymentLink, "_blank");
                          }}
                          title={inv.paymentLink ? "Abrir link de pago" : "Sin link de pago"}
                        >
                          Reenviar link
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* EARNINGS CHART */}
          <div className="bg-white border border-[#E8E8EA] rounded-2xl p-4">
            <div className="text-xs font-extrabold mb-2">Evolución de ganancias</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F2" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 9, fill: "#A1A1AA", fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#A1A1AA", fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #E8E8EA", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 11 }}
                  labelFormatter={(label) => `${label}`}
                />
                <Line type="monotone" dataKey="ganancias" stroke="#059669" strokeWidth={2} dot={{ r: 3, fill: "#fff", stroke: "#059669", strokeWidth: 1.5 }} activeDot={{ r: 5, fill: "#059669" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
