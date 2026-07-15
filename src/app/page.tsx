"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import {
  Sparkles, TrendingUp, Target, DollarSign,
  Users, CheckCircle2, ArrowRight, BookOpen,
  Trophy, HelpCircle, LogIn, Menu, X,
} from "lucide-react";
import { TIERS, FAQS } from "@/lib/data";

const NexorLogo = () => (
  <svg width="108" height="32" viewBox="0 0 1722 505" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Nexor" className="h-8 w-auto">
    <defs>
      <linearGradient id="nxLogoGrad" x1="1195.44" y1="21.3423" x2="1195.44" y2="504.454" gradientUnits="userSpaceOnUse">
        <stop stopColor="#232522" />
        <stop offset="1" stopColor="#A1A1A1" />
      </linearGradient>
    </defs>
    <path d="M31.824 416.676V103.332H67.32L82.008 147.396C92.412 125.976 125.46 99.0477 196.452 99.0477C299.268 99.0477 319.464 159.024 319.464 247.764V416.676H254.592V242.256C254.592 186.564 244.8 153.516 178.092 153.516C111.384 153.516 97.308 185.952 97.308 242.256V416.676H31.824ZM506.373 420.96C380.301 420.96 349.089 343.236 349.089 259.392C349.089 175.548 380.913 99.0477 505.761 99.0477C621.429 99.0477 653.865 187.176 645.909 285.708H417.021C420.693 339.564 447.621 370.776 503.925 370.776C555.945 370.776 572.469 345.684 578.589 320.592H647.133C641.625 373.836 604.905 420.96 506.373 420.96ZM417.633 233.688H578.589V232.464C579.201 189.624 559.005 149.844 499.641 149.844C438.441 149.844 420.693 187.788 417.633 233.688ZM622.452 416.676L747.912 254.496L631.02 103.332H706.296L788.916 217.164L872.76 103.332H946.2L829.92 254.496L955.38 416.676H876.432L789.528 290.604L702.012 416.676H622.452Z" fill="#232522" />
    <path d="M1490.82 416.676V103.332H1525.71L1541.01 146.784C1559.98 106.392 1596.7 95.3758 1652.39 99.0477V155.964C1588.13 146.784 1556.31 177.996 1556.31 251.436V416.676H1490.82Z" fill="#232522" />
    <path d="M1681.68 78.9118C1650.58 78.9118 1642.32 61.0558 1642.32 39.3598C1642.32 17.9518 1650.86 -0.000219345 1681.68 -0.000219345C1712.88 -0.000219345 1721.04 17.9518 1721.04 39.4558C1721.04 61.0558 1712.88 78.9118 1681.68 78.9118ZM1651.82 39.4558C1651.82 57.3118 1658.26 70.7518 1681.68 70.7518C1705.2 70.7518 1711.54 57.3118 1711.54 39.4558C1711.54 21.5998 1705.2 8.15978 1681.68 8.15978C1658.35 8.15978 1651.82 21.6958 1651.82 39.4558ZM1662.1 39.8398C1662.1 28.2238 1666.9 18.3358 1681.87 18.3358C1693.87 18.3358 1700.11 25.0558 1700.11 36.1918H1691.28C1690.7 29.2798 1687.82 26.3998 1681.78 26.3998C1674.1 26.3998 1671.02 31.2958 1671.02 39.5518C1671.02 47.9038 1674.1 52.8958 1681.78 52.8958C1687.82 52.8958 1690.8 50.0158 1691.28 43.3918H1700.11C1700.11 54.6238 1694.16 61.0558 1682.16 61.0558C1666.9 61.0558 1662.1 51.2638 1662.1 39.8398Z" fill="#232522" />
  </svg>
);

export default function LandingPage() {
  const { isLoggedIn, loginWithGoogle, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number[]>([0]);

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, router]);

  const toggleFaq = (index: number) => {
    setFaqOpen((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollTo("hero")} className="flex items-center space-x-3">
            <NexorLogo />
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
              Socios
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo("methodology")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Metodología
            </button>
            <button onClick={() => scrollTo("tiers")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Niveles y Comisiones
            </button>
            <button onClick={() => scrollTo("faq")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="inline-flex items-center space-x-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>Cerrar Sesión</span>
              </button>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 shadow-sm"
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Iniciar Sesión con Google</span>
              </button>
            )}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
            <button onClick={() => scrollTo("methodology")} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              Metodología
            </button>
            <button onClick={() => scrollTo("tiers")} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              Niveles y Comisiones
            </button>
            <button onClick={() => scrollTo("faq")} className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
              FAQ
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative overflow-hidden bg-white pt-16 pb-32 sm:pt-24 sm:pb-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center space-x-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-bold text-amber-800">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Programa Oficial de Partners 2026</span>
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-tight">
                  Vende Nexor AI.
                  <br />
                  <span className="bg-gradient-to-r from-neutral-900 to-gray-600 bg-clip-text text-transparent">
                    Gana comisiones ilimitadas.
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-gray-500 max-w-lg leading-relaxed">
                  Únete al ecosistema de embajadores que está transformando la prospección comercial con inteligencia artificial conversacional en 10 países. Sin inversión inicial.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={loginWithGoogle}
                  className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-neutral-950 px-8 py-4 text-sm font-bold text-white hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
                >
                  <span>Registrarme como Partner</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollTo("methodology")}
                  className="inline-flex items-center justify-center space-x-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Conocer el Modelo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {[
                  { value: "10+", label: "Países Activos" },
                  { value: "24/7", label: "IA Conversacional" },
                  { value: "85%", label: "Retención de Partners" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-[11px] text-gray-400 font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative z-10 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 shadow-2xl">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-xs font-bold">Dashboard de Embajador</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Clientes Activos", value: "12", icon: Users },
                      { label: "Comisiones (MTD)", value: "$4,850", icon: DollarSign },
                      { label: "Leads Procesados", value: "2,340", icon: TrendingUp },
                      { label: "Tasa de Conversión", value: "22%", icon: Target },
                    ].map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                          <Icon className="h-4 w-4 text-neutral-400 mb-2" />
                          <p className="text-xl font-black text-white">{card.value}</p>
                          <p className="text-[10px] text-neutral-400">{card.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-64 w-64 rounded-full bg-amber-100 blur-3xl opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
      <section id="methodology" className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">¿Cómo funciona el modelo de Partners?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Un sistema probado de 4 pasos que convierte tus contactos comerciales en ingresos recurrentes automatizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Regístrate", desc: "Crea tu cuenta de embajador gratis con Google. Recibe tu enlace de afiliado único y acceso al portal.", icon: LogIn },
              { step: "02", title: "Refiere Empresas", desc: "Comparte tu enlace o registra prospectos manualmente en tu Mini-CRM. El sistema rastrea todo automáticamente.", icon: Users },
              { step: "03", title: "Activa Leads", desc: "Tus clientes compran paquetes de leads prepago. La IA de Nexor califica y atiende prospectos en segundos.", icon: Sparkles },
              { step: "04", title: "Gana Comisiones", desc: "Recibe hasta el 25% de la facturación mensual de tus referidos. Pagos internacionales cada mes.", icon: DollarSign },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative group">
                  <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-xs hover:shadow-md transition-all h-full">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Paso {item.step}</span>
                    <div className="p-3 bg-neutral-900 text-white rounded-xl w-fit mt-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mt-4">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section id="tiers" className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Niveles de Partner y Comisiones</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
              Escala tu negocio conforme crece tu cartera. Mientras más cuentas actives, mayor será tu porcentaje de comisión y beneficios exclusivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {TIERS.map((tier, index) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 border shadow-xs flex flex-col ${tier.name === "Elite Partner"
                  ? "bg-neutral-900 border-neutral-800 text-white scale-[1.02]"
                  : "bg-white border-gray-150"
                }`}
              >
                {index === 2 && (
                  <span className="inline-flex self-start rounded-full bg-amber-400 text-neutral-900 px-3 py-1 text-[10px] font-black mb-4 uppercase tracking-wider">
                    Más Popular
                  </span>
                )}
                <h3 className={`text-lg font-black ${tier.name === "Elite Partner" ? "text-white" : "text-gray-900"}`}>
                  {tier.name}
                </h3>
                <p className={`text-[11px] mt-1 ${tier.name === "Elite Partner" ? "text-neutral-400" : "text-gray-400"}`}>
                  {tier.companiesRequired}
                </p>

                <div className="mt-6 space-y-2">
                  <p className="text-3xl font-black">{tier.commission}</p>
                  <p className={`text-xs ${tier.name === "Elite Partner" ? "text-neutral-400" : "text-gray-400"}`}>
                    {tier.networkOverride}
                  </p>
                </div>

                <ul className="mt-8 space-y-3 flex-1">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-start space-x-2.5">
                      <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${tier.name === "Elite Partner" ? "text-amber-400" : "text-neutral-900"}`} />
                      <span className={`text-xs leading-relaxed ${tier.name === "Elite Partner" ? "text-neutral-300" : "text-gray-600"}`}>{b}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={loginWithGoogle}
                  className={`mt-8 w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                    tier.name === "Elite Partner"
                      ? "bg-white text-neutral-900 hover:bg-gray-100"
                      : "bg-neutral-900 text-white hover:bg-neutral-800"
                  }`}
                >
                  Empezar ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Preguntas Frecuentes</h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Todo lo que necesitas saber para empezar a generar con Nexor.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-150 overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-gray-900 pr-4">{faq.question}</span>
                  <HelpCircle className={`h-5 w-5 flex-shrink-0 transition-transform ${faqOpen.includes(index) ? "rotate-180 text-neutral-900" : "text-gray-300"}`} />
                </button>
                {faqOpen.includes(index) && (
                  <div className="px-6 pb-5">
                    <p className="text-xs text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-neutral-950 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 text-xs font-bold text-amber-400">
            <Trophy className="h-3.5 w-3.5" />
            <span>Sin inversión · Sin cuotas · Sin riesgo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Empieza a generar comisiones este mismo mes.
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm sm:text-base">
            Regístrate gratis, comparte tu enlace de afiliado, y nosotros hacemos el resto con IA. Tú cobras cada mes sin mover un dedo más.
          </p>
          <button
            onClick={loginWithGoogle}
            className="inline-flex items-center justify-center space-x-2 rounded-2xl bg-white text-neutral-950 px-8 py-4 text-sm font-bold hover:bg-gray-100 transition-all shadow-xl"
          >
            <LogIn className="h-4 w-4" />
            <span>Quiero ser Embajador de Nexor</span>
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 border-t border-neutral-800 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <NexorLogo />
          <p className="text-[11px] text-neutral-500">
            © 2026 Nexor AI. Todos los derechos reservados. Programa de Partners Global.
          </p>
        </div>
      </footer>
    </div>
  );
}
