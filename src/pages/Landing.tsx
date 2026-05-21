import { Link } from '@tanstack/react-router';
import { ShieldCheck, Zap, Heart, CircleDollarSign, UserPlus, Lock, Shield, DollarSign } from 'lucide-react';

function TrustBadge({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <span className="block text-sm font-bold text-white">{title}</span>
        <span className="block text-xs text-brand-200 font-medium">{desc}</span>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-10 pb-16 md:pb-20 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-landing" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-landing)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 text-left">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                ¿Qué deseas realizar hoy?
              </h1>
              <p className="text-base md:text-lg text-brand-100 font-medium leading-relaxed mt-4 opacity-95 max-w-lg">
                Elige la opción que mejor se adapte a tus necesidades.
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mt-8">
                <TrustBadge
                  icon={<ShieldCheck className="w-5 h-5 text-brand-300" />}
                  title="Seguro"
                  desc="Protegemos tu información"
                />
                <TrustBadge
                  icon={<Zap className="w-5 h-5 text-brand-300" />}
                  title="Rápido"
                  desc="Procesos simples y ágiles"
                />
                <TrustBadge
                  icon={<Heart className="w-5 h-5 text-brand-300" />}
                  title="Confiable"
                  desc="Tu cooperativa de siempre"
                />
              </div>
            </div>

            {/* Right: Phone Mockup */}
            <div className="hidden md:flex md:col-span-5 justify-end relative h-52">
              <div className="relative">
                {/* Phone */}
                <div className="w-36 h-60 bg-slate-900 rounded-[26px] p-1.5 shadow-2xl border-4 border-slate-800 transform -rotate-6 hover:rotate-0 transition-all duration-500 flex flex-col relative z-10 overflow-hidden -top-4">
                  <div className="w-full h-full bg-[#f8fafc] rounded-[20px] p-2.5 flex flex-col justify-between overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-14 h-3.5 bg-slate-900 rounded-b-xl z-20" />
                    <div className="flex flex-col items-center pt-5 flex-grow">
                      <img src="/logo.png" alt="logo" className="h-4 w-auto object-contain mb-3" />
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="w-full space-y-1.5 mt-2">
                        <div className="h-2 bg-gray-200/80 rounded-sm w-full" />
                        <div className="h-2 bg-gray-200/80 rounded-sm w-5/6" />
                        <div className="h-2 bg-gray-200/80 rounded-sm w-4/6" />
                      </div>
                    </div>
                    <div className="w-full bg-brand-600 h-5 rounded-md flex items-center justify-center shadow-sm">
                      <div className="w-8 h-0.5 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Floating Badges */}
                <div className="absolute -left-10 top-4 bg-white/95 backdrop-blur-xs text-brand-700 p-2 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-10 h-10 animate-bounce z-20">
                  <Shield className="w-5 h-5 text-brand-600" />
                </div>
                <div className="absolute -right-8 top-12 bg-white/95 backdrop-blur-xs text-brand-700 p-2 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-10 h-10 animate-pulse z-20">
                  <DollarSign className="w-5 h-5 text-brand-600" />
                </div>
                {/* Decorative leaf */}
                <div className="absolute -right-6 -top-2 text-brand-400/60 z-10">
                  <svg width="40" height="50" viewBox="0 0 40 50" fill="currentColor" className="transform rotate-12">
                    <path d="M20 0C20 0 35 15 35 30C35 40 28 48 20 50C12 48 5 40 5 30C5 15 20 0 20 0Z" opacity="0.6" />
                    <path d="M22 0C22 0 37 12 37 27C37 37 30 45 22 47" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Options Cards */}
      <main className="container mx-auto px-4 max-w-4xl mt-8 md:mt-12 relative z-30 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Solicitar Préstamo */}
          <Link
            to="/prestamos"
            className="group bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-8 md:p-10 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-200 group-hover:scale-105 transition-all duration-300">
              <CircleDollarSign className="w-10 h-10 text-brand-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Solicitar Préstamo</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              Obtén el financiamiento que necesitas de forma rápida y segura.
            </p>
            <span className="inline-flex items-center justify-center w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-brand-700/20 group-hover:shadow-lg group-hover:shadow-brand-700/30">
              Solicitar préstamo
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>

          {/* Card: Abrir Cuenta */}
          <Link
            to="/abrir-cuenta"
            className="group bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-8 md:p-10 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-brand-200 group-hover:scale-105 transition-all duration-300">
              <UserPlus className="w-10 h-10 text-brand-600" />
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Abrir Cuenta</h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs">
              Únete a nuestra cooperativa y comienza a disfrutar de todos nuestros beneficios.
            </p>
            <span className="inline-flex items-center justify-center w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-brand-700/20 group-hover:shadow-lg group-hover:shadow-brand-700/30">
              Abrir cuenta
              <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </Link>
        </div>

        {/* Security Footer */}
        <div className="text-center mt-10">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Tu información está protegida con los más altos estándares de seguridad.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
