import { Outlet, useNavigate, Link, useLocation } from '@tanstack/react-router';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { LogOut, LayoutDashboard, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminLayout() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login', replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-900 text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-6 border-b border-brand-800 flex items-center justify-center md:justify-start">
          <ShieldCheck className="w-8 h-8 text-brand-400 mr-3" />
          <div>
            <h1 className="font-bold text-lg tracking-tight">COOPMAZA</h1>
            <p className="text-xs text-brand-300 font-medium">Panel Administrativo</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm",
              location.pathname === '/admin' ? "bg-brand-800 text-white" : "text-brand-200 hover:bg-brand-800/50 hover:text-white"
            )}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link 
            to="/admin/solicitudes" 
            className={cn(
              "flex items-center px-4 py-3 rounded-lg transition-colors font-medium text-sm",
              location.pathname.startsWith('/admin/solicitudes') ? "bg-brand-800 text-white" : "text-brand-200 hover:bg-brand-800/50 hover:text-white"
            )}
          >
            <Users className="w-5 h-5 mr-3" />
            Solicitudes
          </Link>
        </nav>
        
        <div className="p-4 border-t border-brand-800">
          <button 
            onClick={() => {
              logout();
              navigate({ to: '/login' });
            }}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4 md:px-8 md:py-6 shadow-sm flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Administración</h2>
          <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Conectado como Admin
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
