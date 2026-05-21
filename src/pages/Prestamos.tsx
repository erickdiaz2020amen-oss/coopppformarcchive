import { Link } from '@tanstack/react-router';
import { ArrowLeft, ArrowRight, ShieldCheck, DollarSign, Shield } from 'lucide-react';
import { LOAN_TYPES, type LoanType } from '../data/loanTypes';

function LoanCard({ loan }: { loan: LoanType }) {
  const Icon = loan.icon;
  return (
    <Link
      to="/prestamos/$tipo"
      params={{ tipo: loan.id } as any}
      className="group bg-white rounded-2xl shadow-md shadow-brand-900/5 border border-brand-100/50 p-6 md:p-8 text-center hover:-translate-y-1.5 hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col items-center"
    >
      <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-brand-200 group-hover:scale-110 transition-all duration-300">
        <Icon className="w-8 h-8 text-brand-600" />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-2">{loan.title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{loan.description}</p>
      <span className="inline-flex items-center text-brand-600 font-semibold text-sm group-hover:text-brand-700 transition-colors">
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
      </span>
    </Link>
  );
}

export default function Prestamos() {
  return (
    <div className="animate-fade-in-up">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-10 pb-16 md:pb-20 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-prestamos" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-prestamos)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          {/* Back Link */}
          <Link
            to="/"
            className="inline-flex items-center text-brand-200 hover:text-white text-sm font-medium mb-5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Volver al inicio
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 text-left">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                ¿Qué tipo de préstamo necesitas?
              </h1>
              <p className="text-base md:text-lg text-brand-100 font-medium leading-relaxed mt-4 opacity-95 max-w-lg">
                Selecciona la opción que mejor se adapte a tus necesidades.
              </p>
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
                <div className="absolute -right-8 top-2 bg-white/95 backdrop-blur-xs text-brand-700 p-2 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-10 h-10 animate-pulse z-20">
                  <DollarSign className="w-5 h-5 text-brand-600" />
                </div>
                <div className="absolute -left-10 bottom-10 bg-white/95 backdrop-blur-xs text-brand-700 p-2 rounded-xl shadow-lg border border-brand-100/40 flex items-center justify-center w-10 h-10 animate-bounce z-20">
                  <Shield className="w-5 h-5 text-brand-600" />
                </div>
                {/* Decorative leaf */}
                <div className="absolute -right-4 -top-4 text-brand-400/50 z-10">
                  <svg width="44" height="55" viewBox="0 0 40 50" fill="currentColor" className="transform rotate-12">
                    <path d="M20 0C20 0 35 15 35 30C35 40 28 48 20 50C12 48 5 40 5 30C5 15 20 0 20 0Z" opacity="0.6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Type Cards */}
      <main className="container mx-auto px-4 max-w-5xl mt-8 md:mt-12 relative z-30 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {LOAN_TYPES.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>

        {/* Bottom Back Link */}
        <div className="text-center mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-semibold text-sm transition-colors border border-brand-200 hover:border-brand-300 rounded-xl px-5 py-2.5 bg-white hover:bg-brand-50 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a las opciones principales
          </Link>
        </div>
      </main>
    </div>
  );
}
