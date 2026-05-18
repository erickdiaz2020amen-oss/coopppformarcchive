import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText, Clock, CheckCircle, Search, Eye, Download, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { cn } from '../../lib/utils';
import { getSignedUrl } from '../../lib/b2';

interface Solicitud {
  id: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefonos: string;
  email: string;
  fecha_solicitud: string;
  estado: string;
  pdf_url: string | null;
}

export default function Dashboard() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Stats
  const [stats, setStats] = useState({ total: 0, pendientes: 0, aprobadas: 0 });

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const SUPABASE_URL = '/api/supabase';
      
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/solicitudes?select=id,nombres,apellidos,cedula,telefonos,email,fecha_solicitud,estado,pdf_url&order=created_at.desc`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[Dashboard] Fetch error:', res.status, errorText);
        setLoading(false);
        return;
      }

      const data: Solicitud[] = await res.json();
      console.log('[Dashboard] Fetched', data.length, 'solicitudes');
      
      // Convert pdf_url to signed URLs for immediate use
      for (const item of data) {
        if (item.pdf_url) {
          item.pdf_url = await getSignedUrl(item.pdf_url);
        }
      }

      setSolicitudes(data);
      setStats({
        total: data.length,
        pendientes: data.filter(s => s.estado === 'pendiente').length,
        aprobadas: data.filter(s => s.estado === 'aprobada').length,
      });
    } catch (err) {
      console.error('[Dashboard] Network error:', err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de eliminar esta solicitud?')) return;
    try {
      const SUPABASE_URL = '/api/supabase';
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/solicitudes?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (res.ok) {
        setSolicitudes(s => s.filter(x => x.id !== id));
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      } else {
        alert('Error eliminando la solicitud.');
      }
    } catch {
      alert('Error eliminando la solicitud.');
    }
  };

  const filteredData = solicitudes.filter(s => {
    const matchSearch = `${s.nombres} ${s.apellidos} ${s.cedula}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? s.estado === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Solicitudes" value={stats.total} icon={<FileText />} color="text-blue-600" bgColor="bg-blue-100" />
        <StatCard title="Solicitudes Pendientes" value={stats.pendientes} icon={<Clock />} color="text-amber-600" bgColor="bg-amber-100" />
        <StatCard title="Solicitudes Aprobadas" value={stats.aprobadas} icon={<CheckCircle />} color="text-green-600" bgColor="bg-green-100" />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h3 className="font-semibold text-lg text-gray-800">Listado de Solicitudes</h3>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input 
                placeholder="Buscar nombre o cédula..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <Select 
              className="w-full sm:w-40 h-10"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="aprobada">Aprobada</option>
              <option value="rechazada">Rechazada</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Solicitante</th>
                <th className="px-6 py-4">Cédula</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-100 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-20 float-right"></div></td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-base font-medium">No se encontraron solicitudes</p>
                      <p className="text-sm">Intente cambiar los filtros o realizar otra búsqueda.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{s.nombres} {s.apellidos}</div>
                    </td>
                    <td className="px-6 py-4">{s.cedula}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <div>{s.telefonos}</div>
                      <div className="text-xs">{s.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(s.fecha_solicitud), "d MMM, yyyy", { locale: es })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                        s.estado === 'pendiente' ? "bg-amber-100 text-amber-700" :
                        s.estado === 'aprobada' ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to="/admin/solicitudes/$id" params={{ id: s.id }}>
                          <Button variant="outline" size="sm" className="h-8 px-2 text-gray-600 hover:text-brand-600 hover:border-brand-600">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        {s.pdf_url && (
                          <a href={s.pdf_url} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm" className="h-8 px-2 text-gray-600 hover:text-blue-600 hover:border-blue-600">
                              <Download className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(s.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Skeleton (Simulated) */}
        {!loading && filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>Mostrando {filteredData.length} resultados</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-8 px-2" disabled><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 px-2" disabled><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, bgColor }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mr-4", bgColor, color)}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
