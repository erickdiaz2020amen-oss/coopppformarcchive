import { Link } from '@tanstack/react-router';
import { Shield, Users, Lock, ArrowLeft } from 'lucide-react';
import Home from './Home';

export default function AbrirCuenta() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Banner Section — moved from old App.tsx */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-4 pb-20 md:pb-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-cuenta" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-cuenta)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-brand-200 hover:text-white text-sm font-medium mb-5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Volver al inicio
          </Link>

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
      <main className="container mx-auto px-4 max-w-4xl mt-8 md:mt-12 relative z-30 pb-12">
        <Home />
      </main>
    </div>
  );
}
