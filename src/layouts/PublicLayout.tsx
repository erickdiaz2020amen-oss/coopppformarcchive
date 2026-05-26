import { Outlet, Link } from '@tanstack/react-router';
import { ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans text-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-2 shadow-xs relative z-40">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Coopmaza Digital Logo" className="h-16 md:h-24 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-2.5 bg-brand-50/50 border border-brand-100/80 rounded-xl px-3 py-1.5">
            <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-gray-800">Seguridad y confianza</span>
              <span className="block text-[10px] text-gray-500 font-medium">Tus datos están protegidos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 mt-auto pt-8 text-center text-xs text-gray-500 pb-8">
        <p>© {new Date().getFullYear()} COOPMAZA — Cooperativa de Ahorro, Crédito y Servicios Múltiples</p>
      </footer>
    </div>
  );
}
