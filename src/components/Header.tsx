import React from "react";
import { LogIn, LogOut, Trophy } from "lucide-react";
import NexorLogo from "./NexorLogo";

interface HeaderProps {
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
  onNavigateToSection: (section: string) => void;
  partnerName?: string;
  partnerTier?: string;
}

export default function Header({
  isLoggedIn,
  onLoginClick,
  onLogout,
  onNavigateToSection,
  partnerName = "Usuario de Nexor",
  partnerTier = "Explorer Partner",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Nexor Logo */}
        <div 
          onClick={() => onNavigateToSection("hero")} 
          className="flex cursor-pointer items-center space-x-3"
          id="btn-nav-logo"
        >
          <NexorLogo />
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
            Socios
          </span>
        </div>

        {/* Desktop Navigation */}
        {!isLoggedIn ? (
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigateToSection("methodology")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              id="nav-link-metodologia"
            >
              Metodología
            </button>
            <button
              onClick={() => onNavigateToSection("tiers")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              id="nav-link-niveles"
            >
              Niveles y Comisiones
            </button>
            <button
              onClick={() => onNavigateToSection("faq")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              id="nav-link-faq"
            >
              Preguntas Frecuentes
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
              <Trophy className="h-3.5 w-3.5" />
              <span>{partnerTier}</span>
            </div>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-700">
              Hola, <span className="font-semibold text-gray-900">{partnerName}</span>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button
              onClick={onLoginClick}
              className="inline-flex items-center justify-center rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              id="btn-login-header"
            >
              <LogIn className="h-4 w-4 mr-2" />
              <span>Iniciar Sesión con Google</span>
            </button>
          ) : (
            <button
              onClick={onLogout}
              className="inline-flex items-center space-x-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors active:scale-95"
              id="btn-logout-header"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
