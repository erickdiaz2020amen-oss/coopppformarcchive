import { Outlet } from '@tanstack/react-router';
import { ShieldCheck, Shield, Users, Lock } from 'lucide-react';

export function App() {
  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans text-gray-900 pb-12">
      {/* Top Bar (White Navigation) */}
      <header className="bg-white border-b border-gray-100 py-2 shadow-xs relative z-20">
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo.png" alt="Coopmaza Digital Logo" className="h-16 md:h-24 w-auto object-contain" />
          </div>
          
          <div className="hidden md:flex items-center gap-2.5 bg-brand-50/50 border border-brand-100/80 rounded-xl px-3 py-1.5">
            <ShieldCheck className="w-5 h-5 text-brand-600 flex-shrink-0" />
            <div className="text-left leading-tight">
              <span className="block text-xs font-bold text-gray-800">Seguridad y confianza</span>
              <span className="block text-[10px] text-gray-500 font-medium">Tus datos están protegidos</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner Section (Green Gradient) */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-6 pb-12 md:pt-8 md:pb-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left side text */}
            <div className="md:col-span-7 text-left">
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Solicitud de Admisión
              </h1>
              <p className="text-sm md:text-base text-brand-100 font-medium leading-relaxed mt-3 opacity-95">
                Da el primer paso para formar parte de Coopmaza Digital y accede a todos nuestros beneficios financieros.
              </p>
            </div>
            
            {/* Right side CSS-only mockup */}
            <div className="hidden md:flex md:col-span-5 justify-end relative h-36">
              <div className="relative">
                {/* Phone mockup body */}
                <div className="w-32 h-56 bg-slate-900 rounded-[24px] p-1.5 shadow-2xl border-4 border-slate-800 transform -rotate-6 hover:rotate-0 transition-all duration-500 flex flex-col relative z-10 overflow-hidden -top-8">
                  {/* Screen */}
                  <div className="w-full h-full bg-[#f8fafc] rounded-[18px] p-2 flex flex-col justify-between overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-slate-900 rounded-b-xl z-20" />
                    
                    {/* Screen Content */}
                    <div className="flex flex-col items-center pt-3 flex-grow">
                      {/* Mini Logo */}
                      <img src="/logo.png" alt="logo" className="h-3 w-auto object-contain mb-2" />
                      
                      {/* Mock Form Lines */}
                      <div className="w-full space-y-1 mt-1">
                        <div className="h-2 bg-gray-200/80 rounded-sm w-full" />
                        <div className="h-2 bg-gray-200/80 rounded-sm w-5/6" />
                        <div className="h-2 bg-gray-200/80 rounded-sm w-4/6" />
                        <div className="h-4 bg-brand-100/60 rounded-md w-full border border-brand-200/30 flex items-center justify-center">
                          <div className="h-1 bg-brand-500 rounded-sm w-8" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Mock Button */}
                    <div className="w-full bg-brand-600 h-4.5 rounded-md flex items-center justify-center shadow-sm">
                      <div className="w-6 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating badge 1: User */}
                <div className="absolute -left-10 top-2 bg-white/95 backdrop-blur-xs text-brand-700 p-1.5 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-8 h-8 animate-bounce duration-1000 z-20">
                  <Users className="w-4 h-4 text-brand-600" />
                </div>

                {/* Floating badge 2: Shield */}
                <div className="absolute -right-6 top-10 bg-white/95 backdrop-blur-xs text-brand-700 p-1.5 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-8 h-8 animate-pulse z-20">
                  <Shield className="w-4 h-4 text-brand-600" />
                </div>

                {/* Floating badge 3: Lock */}
                <div className="absolute -left-6 bottom-8 bg-white/95 backdrop-blur-xs text-brand-700 p-1.5 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-8 h-8 z-20">
                  <Lock className="w-3.5 h-3.5 text-brand-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content overlapping slightly */}
      <main className="container mx-auto px-4 max-w-4xl -mt-6 relative z-30">
        <Outlet />
      </main>
      
      <footer className="container mx-auto px-4 mt-12 text-center text-xs text-gray-500 pb-8">
        <p>© {new Date().getFullYear()} COOPMAZA — Cooperativa de Ahorro, Crédito y Servicios Múltiples</p>
      </footer>
    </div>
  );
}
