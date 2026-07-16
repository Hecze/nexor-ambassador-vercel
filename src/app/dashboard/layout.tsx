"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardProvider } from "@/lib/dashboard-context";
import { useRouter, usePathname } from "next/navigation";
import NexorLogo from "@/components/NexorLogo";
import { LogOut, Menu, X, Phone, DollarSign, Users, BookOpen, Video, Receipt, Trophy, LifeBuoy, User, Sparkles, Target } from "lucide-react";
import FloatingChatbot from "@/components/FloatingChatbot";
import Link from "next/link";

const navGroups = [
  {
    label: "Vender",
    items: [
      { id: "/dashboard/negociaciones", label: "Negociaciones", icon: Target },
      { id: "/dashboard/prospects", label: "Cartera de clientes", icon: Users },
      { id: "/dashboard/roi", label: "Calculadora de ROI", icon: DollarSign },
      { id: "/dashboard/simulator", label: "Simulador de ventas", icon: Phone },
    ],
  },
  {
    label: "Aprender",
    items: [
      { id: "/dashboard/coach", label: "Coach Sofía", icon: Sparkles },
      { id: "/dashboard/resources", label: "Biblioteca de copys", icon: BookOpen },
      { id: "/dashboard/videos", label: "Videoteca", icon: Video },
    ],
  },
  {
    label: "Ganancias",
    items: [
      { id: "/dashboard/facturacion", label: "Facturación", icon: Receipt },
      { id: "/dashboard/premios", label: "Premios y Liga", icon: Trophy, badge: "2" },
    ],
  },
  {
    label: "Cuenta",
    items: [
      { id: "/dashboard/support", label: "Soporte", icon: LifeBuoy },
      { id: "/dashboard/perfil", label: "Mi perfil", icon: User },
    ],
  },
];

const pageTitles: Record<string, string> = {
  "/dashboard/negociaciones": "Negociaciones",
  "/dashboard/prospects": "Cartera de clientes",
  "/dashboard/roi": "Calculadora de ROI",
  "/dashboard/simulator": "Simulador de ventas",
  "/dashboard/coach": "Coach Sofía",
  "/dashboard/resources": "Biblioteca de copys",
  "/dashboard/videos": "Videoteca",
  "/dashboard/facturacion": "Facturación",
  "/dashboard/premios": "Premios y Liga",
  "/dashboard/support": "Soporte",
  "/dashboard/perfil": "Mi perfil",
};

const pageSubtitles: Record<string, string> = {
  "/dashboard/negociaciones": "Tus deals vendiendo Nexor y en qué etapa está cada uno",
  "/dashboard/prospects": "Tus empresas, sus leads y qué falta para cerrar",
  "/dashboard/roi": "Muéstrale al cliente sus números con Nexor — y mira lo que ganarías tú",
  "/dashboard/simulator": "Practica la llamada antes de hacerla de verdad",
  "/dashboard/coach": "Tu entrenadora de ventas con IA · disponible 24/7",
  "/dashboard/resources": "Mensajes probados por industria · copia, personaliza y envía",
  "/dashboard/videos": "Capacitación en video · termina el temario y gana XP",
  "/dashboard/facturacion": "Cuánto ganas, cuándo cobras y de dónde viene cada dólar",
  "/dashboard/support": "Nexi resuelve primero · si no puede, se crea el ticket solo",
  "/dashboard/premios": "Temporada Julio 2026 · gana XP vendiendo, no jugando",
  "/dashboard/perfil": "Tu identidad de partner, tu link de referidos y tu progreso",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push("/");
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F6F7]">
        <div className="h-8 w-8 border-[3px] border-gray-200 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const title = pageTitles[pathname] || "Dashboard";
  const subtitle = pageSubtitles[pathname] || "";

  return (
    <DashboardProvider>
      <div className="flex h-screen font-sans antialiased bg-[#F6F6F7]">
        {/* Desktop Sidebar */}
        <aside className="hidden w-[264px] flex-col bg-[#0B0B0E] text-white lg:flex flex-shrink-0">
          <div className="flex items-center gap-2 px-5 pt-5 pb-4">
            <NexorLogo className="h-7 w-auto" light />
          </div>

          {/* User card */}
          <div className="mx-3 mb-2 rounded-2xl bg-[#141418] border border-[#232329] p-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-sm">
                  {(user?.displayName || "S").charAt(0).toUpperCase()}
                </div>
                <div className="absolute -right-[-3px] -bottom-[-3px] bg-amber-600 border-2 border-[#141418] rounded-md text-white text-[8px] font-extrabold px-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  4
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.displayName || "Santiago V."}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] font-extrabold uppercase tracking-wide text-amber-400">Explorer</span>
                  <span className="text-[#3F3F46] text-[9px]">·</span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-orange-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#FB923C"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
                    5 días
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-2.5">
              <div className="flex justify-between text-[9px] font-bold text-[#71717A] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span>NIVEL 4</span>
                <span className="text-[#A1A1AA]">540 / 800 XP</span>
              </div>
              <div className="h-[5px] bg-[#232329] rounded-full overflow-hidden">
                <div className="w-[67%] h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300" />
              </div>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5">
            {navGroups.map((group) => (
              <div key={group.label}>
                <div className="text-[9px] font-extrabold uppercase tracking-[1.4px] text-[#52525B] px-3 pt-3.5 pb-1.5">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.id || (item.id !== "/dashboard/prospects" && pathname?.startsWith(item.id + "/"));
                  return (
                    <Link
                      key={item.id}
                      href={item.id}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-white/7 text-white shadow-[inset_2px_0_0_#FBBF24]"
                          : "text-[#A1A1AA] hover:bg-white/4 hover:text-[#E4E4E7]"
                      }`}
                    >
                      <Icon className={`h-[15px] w-[15px] flex-shrink-0 ${isActive ? "text-amber-400" : "text-[#71717A]"}`} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-amber-600 text-white rounded-full text-[9px] font-extrabold px-1.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-[#1C1C21]">
            <button
              onClick={logout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#71717A] hover:bg-[#1C1C21] hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="h-[15px] w-[15px]" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative flex w-full max-w-[264px] flex-1 flex-col bg-[#0B0B0E] text-white">
              <div className="absolute top-0 -right-10 pt-2">
                <button onClick={() => setIsSidebarOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full">
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-5 pt-5 pb-4">
                <NexorLogo className="h-7 w-auto" light />
              </div>
              <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <div className="text-[9px] font-extrabold uppercase tracking-[1.4px] text-[#52525B] px-3 pt-3.5 pb-1.5">{group.label}</div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.id;
                      return (
                        <Link
                          key={item.id}
                          href={item.id}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                            isActive ? "bg-white/7 text-white shadow-[inset_2px_0_0_#FBBF24]" : "text-[#A1A1AA]"
                          }`}
                        >
                          <Icon className="h-[15px] w-[15px]" />
                          <span>{item.label}</span>
                          {item.badge && <span className="bg-amber-600 text-white rounded-full text-[9px] font-extrabold px-1.5 ml-auto font-mono">{item.badge}</span>}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>
              <div className="p-3 border-t border-[#1C1C21]">
                <button onClick={logout} className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-[#71717A] hover:text-red-400 cursor-pointer">
                  <LogOut className="h-[15px] w-[15px]" /><span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <header className="h-[60px] bg-white border-b border-[#E8E8EA] flex items-center justify-between px-5 flex-shrink-0">
            <div>
              <button className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden lg:block">
                <div className="font-bold text-base tracking-tight text-[#111113]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
                <div className="text-[11px] text-[#71717A]">{subtitle}</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-[11px] font-extrabold text-amber-900">
                <Trophy className="h-3 w-3 text-amber-600" />
                <span>Explorer · 15%</span>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-5">
            {children}
          </main>
        </div>
      </div>
      <FloatingChatbot />
    </DashboardProvider>
  );
}
