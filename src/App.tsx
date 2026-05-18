import { Outlet } from '@tanstack/react-router';

export function App() {
  return (
    <div className="min-h-screen bg-[#f0fdf4] font-sans text-gray-900 pb-12">
      <header className="bg-brand-600 text-white pt-8 pb-10 shadow-md">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight mb-1">COOPERATIVA DE AHORRO, CRÉDITO Y SERVICIOS MÚLTIPLES</h1>
          <h2 className="text-sm md:text-base font-medium opacity-90 mb-3 tracking-widest">COOPMAZA</h2>
          <h3 className="text-lg md:text-xl font-bold bg-white/20 inline-block px-6 py-2 rounded-full backdrop-blur-sm shadow-inner">SOLICITUD DE ADMISIÓN</h3>
        </div>
      </header>
      
      <main className="container mx-auto px-4 -mt-6">
        <Outlet />
      </main>
      
      <footer className="container mx-auto px-4 mt-12 text-center text-xs text-gray-500 pb-8">
        <p>© {new Date().getFullYear()} COOPMAZA — Cooperativa de Ahorro, Crédito y Servicios Múltiples</p>
      </footer>
    </div>
  );
}
