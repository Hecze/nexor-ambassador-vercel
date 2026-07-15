"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { DashboardProvider } from "@/lib/dashboard-context";
import { useRouter, usePathname } from "next/navigation";
import {
  Users, DollarSign, BookOpen,
  Sparkles, Phone, LifeBuoy,
  LogOut, Menu, X, Trophy,
  User, Receipt, Gift,
} from "lucide-react";
import FloatingChatbot from "@/components/FloatingChatbot";
import { TIERS } from "@/lib/data";
import Link from "next/link";

const navItems = [
  { id: "/dashboard/prospects", label: "Cartera de clientes", icon: Users },
  { id: "/dashboard/roi", label: "Calculadora de ROI", icon: DollarSign },
  { id: "/dashboard/resources", label: "Biblioteca de Copys", icon: BookOpen },
  { id: "/dashboard/videos", label: "Librería de Recursos", icon: BookOpen },
  { id: "/dashboard/coach", label: "Coach de Ventas (Sofía)", icon: Sparkles },
  { id: "/dashboard/simulator", label: "Simulador de Ventas", icon: Phone },
  { id: "/dashboard/support", label: "Soporte", icon: LifeBuoy },
  { id: "/dashboard/facturacion", label: "Facturación", icon: Receipt },
  { id: "/dashboard/premios", label: "Premios", icon: Gift },
  { id: "/dashboard/perfil", label: "Perfil", icon: User },
];

const tierNames: Record<string, string> = {
  "/dashboard/prospects": "Cartera de Clientes",
  "/dashboard/roi": "Simulación de ROI Comercial",
  "/dashboard/resources": "Recursos de Ventas",
  "/dashboard/videos": "Librería de Recursos (Videos y PDF)",
  "/dashboard/coach": "Asistente Sofía AI",
  "/dashboard/simulator": "Simulador de Ventas",
  "/dashboard/support": "Soporte con Nexor Raíz",
  "/dashboard/facturacion": "Facturación y Métricas",
  "/dashboard/premios": "Premios y Misiones",
  "/dashboard/perfil": "Mi Perfil",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, isLoading, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-3 border-gray-200 border-t-neutral-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  const currentTier = TIERS[0];

  return (
    <DashboardProvider>
    <div className="flex h-screen bg-gray-50/50 font-sans antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-150 bg-white lg:flex">
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-150">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-gray-900">nexor</span>
            <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
              Portal
            </span>
          </div>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3 rounded-xl bg-gray-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white font-bold text-sm">
              {(user?.displayName || "S").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">
                {user?.displayName || "Socio Embajador"}
              </p>
              <p className="text-[10px] text-gray-400 truncate">
                {user?.email || "socio@nexor.ai"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.id || pathname?.startsWith(item.id + "/");
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-gray-400"}`} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-600 hover:bg-red-50 hover:border-red-150 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button onClick={() => setIsSidebarOpen(false)} className="ml-1 flex h-10 w-10 items-center justify-center rounded-full">
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-shrink-0 items-center px-4 space-x-2">
              <span className="text-xl font-black text-gray-900">nexor</span>
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto px-2">
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={item.id}
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md w-full ${
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="mr-4 h-6 w-6 text-gray-400" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-150 bg-white px-6">
          <div className="flex items-center space-x-4">
            <button
              className="rounded-lg p-1.5 hover:bg-gray-100 lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              {tierNames[pathname] || "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
              <Trophy className="h-3.5 w-3.5" />
              <span>{currentTier.name}</span>
            </div>
            <div className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Partner ID: #{user?.uid ? user.uid.substring(0, 6).toUpperCase() : "6289A"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          {children}
        </main>
      </div>
    </div>
      <FloatingChatbot />
    </DashboardProvider>
  );
}
