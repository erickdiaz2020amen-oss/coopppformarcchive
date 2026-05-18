import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from '@tanstack/react-router';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { cn } from '../lib/utils';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for smooth animation
    await new Promise(r => setTimeout(r, 600));

    if (login(password)) {
      navigate({ to: '/admin' });
    } else {
      setError('Contraseña incorrecta');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-brand-500/10 p-8 md:p-10 animate-fade-in-up border border-brand-50">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">Panel COOPMAZA</h1>
          <p className="text-sm text-gray-500">Acceso para personal autorizado</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={cn(
                "h-12 text-lg text-center tracking-widest transition-all",
                error && "border-red-500 focus-visible:ring-red-500"
              )}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2 text-center animate-pulse">{error}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold shadow-md shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all"
            isLoading={isLoading}
          >
            Entrar
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <Link to="/" className="inline-flex items-center text-sm text-brand-600 hover:text-brand-800 transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al formulario público
          </Link>
        </div>
      </div>
    </div>
  );
}
