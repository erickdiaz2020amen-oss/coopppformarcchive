import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Clock, FileText, CheckCircle2, Info } from 'lucide-react';
import { getLoanTypeById } from '../../data/loanTypes';
import VehiculosForm from './forms/VehiculosForm';
import ElectrodomesticosForm from './forms/ElectrodomesticosForm';
import MipymesForm from './forms/MipymesForm';
import GerencialForm from './forms/GerencialForm';
import EscolarForm from './forms/EscolarForm';
import CorrienteForm from './forms/CorrienteForm';

export default function PrestamoDetail() {
  const { tipo } = useParams({ strict: false });
  const loan = getLoanTypeById(tipo || '');

  if (!loan) {
    return (
      <div className="animate-fade-in-up">
        <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-8 pb-20 relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <Link to="/prestamos" className="inline-flex items-center text-brand-200 hover:text-white text-sm font-medium mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Volver a préstamos
            </Link>
            <h1 className="text-3xl font-black">Tipo de préstamo no encontrado</h1>
          </div>
        </section>
      </div>
    );
  }

  const Icon = loan.icon;

  return (
    <div className="animate-fade-in-up">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white pt-10 pb-20 md:pt-12 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-detail" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-detail)" />
          </svg>
        </div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-600/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link
            to="/prestamos"
            className="inline-flex items-center text-brand-200 hover:text-white text-sm font-medium mb-5 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" />
            Volver a préstamos
          </Link>

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-brand-200" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                {loan.title}
              </h1>
              <p className="text-brand-100 font-medium mt-1 opacity-90">
                {loan.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 max-w-4xl mt-8 md:mt-12 relative z-30 pb-12">
        {tipo === 'vehiculos' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <VehiculosForm />
          </div>
        ) : tipo === 'electrodomesticos' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <ElectrodomesticosForm />
          </div>
        ) : tipo === 'mipymes' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <MipymesForm />
          </div>
        ) : tipo === 'gerencial' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <GerencialForm />
          </div>
        ) : tipo === 'escolar' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <EscolarForm />
          </div>
        ) : tipo === 'corriente' ? (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 p-6 md:p-10">
            <CorrienteForm />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg shadow-brand-900/5 border border-brand-100/50 overflow-hidden">
            <div className="bg-brand-50 border-b border-brand-100 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <span className="text-sm font-bold text-brand-800">En desarrollo</span>
              <span className="text-xs text-brand-600 ml-2 bg-brand-100 px-2 py-0.5 rounded-full font-medium">Próximamente</span>
            </div>
          </div>

          <div className="p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon className="w-10 h-10 text-brand-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Formulario de {loan.title}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
              Estamos preparando el formulario de solicitud para este tipo de préstamo. Pronto podrás realizar tu solicitud de forma digital, rápida y segura.
            </p>

            {/* Feature Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <FileText className="w-6 h-6 text-brand-500 mb-2" />
                <span className="text-xs font-semibold text-gray-700">Solicitud Digital</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 className="w-6 h-6 text-brand-500 mb-2" />
                <span className="text-xs font-semibold text-gray-700">Aprobación Rápida</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
                <Info className="w-6 h-6 text-brand-500 mb-2" />
                <span className="text-xs font-semibold text-gray-700">Asesoría Incluida</span>
              </div>
            </div>

            <Link
              to="/prestamos"
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-800 font-semibold text-sm transition-colors border border-brand-200 hover:border-brand-300 rounded-xl px-5 py-2.5 bg-white hover:bg-brand-50 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Ver otros tipos de préstamos
            </Link>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}
