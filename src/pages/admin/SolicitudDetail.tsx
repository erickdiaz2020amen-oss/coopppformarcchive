import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ArrowLeft, Download, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Section } from '../../components/ui/Section';
import { SolicitudPDF } from '../../components/pdf/SolicitudPDF';
import { pdf } from '@react-pdf/renderer';
import { AwsClient } from 'aws4fetch';
import { getSignedUrl } from '../../lib/b2';

const SUPABASE_URL = '/api/supabase';
const adminHeaders = {
  'Content-Type': 'application/json',
};

const uploadToB2Client = async (fileBase64: string, contentType: string, fileName: string) => {
  if (!fileBase64) return null;
  
  const aws = new AwsClient({
    accessKeyId: '00576daad65b0f30000000001',
    secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
    service: "s3",
    region: "us-east-005"
  });

  const bucket = 'coopmaza-documentos';
  const endpoint = 's3.us-east-005.backblazeb2.com';
  
  const key = `solicitudes/${crypto.randomUUID()}-${fileName}`;
  const url = `https://${bucket}.${endpoint}/${key}`;

  const base64Data = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const signedReq = await aws.sign(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: bytes,
  });

  const res = await fetch(url, {
    method: 'PUT',
    headers: signedReq.headers,
    body: bytes,
  });

  if (!res.ok) throw new Error('Error subiendo PDF a Backblaze');
  return url;
};

export default function SolicitudDetail() {
  const { id } = useParams({ strict: false });
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [signedUrls, setSignedUrls] = useState<{ pdf?: string, frontal?: string, trasera?: string, firma?: string }>({});

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/solicitudes?id=eq.${id}&select=*`,
        {
          headers: {
            ...adminHeaders,
            'Accept': 'application/vnd.pgrst.object+json',
          },
          cache: 'no-store'
        }
      );
      if (res.ok) {
        const row = await res.json();
        setData(row);
        
        const urls: any = {};
        if (row.pdf_url) urls.pdf = await getSignedUrl(row.pdf_url);
        if (row.cedula_frontal_url) urls.frontal = await getSignedUrl(row.cedula_frontal_url);
        if (row.cedula_trasera_url) urls.trasera = await getSignedUrl(row.cedula_trasera_url);
        if (row.firma_url) urls.firma = await getSignedUrl(row.firma_url);
        setSignedUrls(urls);
      } else {
        console.error('[SolicitudDetail] fetch error:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[SolicitudDetail] network error:', err);
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/solicitudes?id=eq.${id}`,
        {
          method: 'PATCH',
          headers: adminHeaders,
          body: JSON.stringify({ estado: status }),
        }
      );
      if (res.ok) {
        setData({ ...data, estado: status });
      } else {
        alert('Error actualizando el estado.');
      }
    } catch (err) {
      alert('Error actualizando el estado.');
    }
  };

  const handleGeneratePDF = async () => {
    if (!data) return;
    try {
      setGeneratingPdf(true);
      
      // Pre-fetch images as blobs to prevent @react-pdf/renderer from hanging
      let firmaObjUrl, frontalObjUrl, traseraObjUrl;
      
      const fetchAsObjectUrl = async (url?: string) => {
        if (!url) return undefined;
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error('Failed to fetch image');
          const blob = await res.blob();
          return URL.createObjectURL(blob);
        } catch (e) {
          console.error("Error pre-fetching image:", e);
          return undefined;
        }
      };

      firmaObjUrl = await fetchAsObjectUrl(signedUrls.firma);
      frontalObjUrl = await fetchAsObjectUrl(signedUrls.frontal);
      traseraObjUrl = await fetchAsObjectUrl(signedUrls.trasera);

      // 1. Generate PDF blob client-side using react-pdf
      const pdfData = {
        ...data,
        firma_url: firmaObjUrl || data.firma_url,
        cedula_frontal_url: frontalObjUrl || data.cedula_frontal_url,
        cedula_trasera_url: traseraObjUrl || data.cedula_trasera_url
      };
      
      const blob = await pdf(<SolicitudPDF data={pdfData} />).toBlob();
      
      // Cleanup object URLs
      if (firmaObjUrl) URL.revokeObjectURL(firmaObjUrl);
      if (frontalObjUrl) URL.revokeObjectURL(frontalObjUrl);
      if (traseraObjUrl) URL.revokeObjectURL(traseraObjUrl);
      
      // 2. Convert Blob to Base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // 3. Upload directly to Backblaze
        const pdfUrl = await uploadToB2Client(base64data, 'application/pdf', `solicitud-${id}.pdf`);
        if (!pdfUrl) throw new Error("Fallo la subida del PDF");

        // 4. Save URL in Supabase via REST
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/solicitudes?id=eq.${id}`,
          {
            method: 'PATCH',
            headers: adminHeaders,
            body: JSON.stringify({ pdf_url: pdfUrl }),
          }
        );

        if (!res.ok) throw new Error('Error guardando URL del PDF');
        
        setData({ ...data, pdf_url: pdfUrl });
        alert('PDF Generado y guardado con éxito.');
        
        const signedPdfUrl = await getSignedUrl(pdfUrl);
        if (signedPdfUrl) {
          setSignedUrls(prev => ({ ...prev, pdf: signedPdfUrl }));
          window.open(signedPdfUrl, '_blank');
        }
        
        setGeneratingPdf(false);
      };
    } catch (err) {
      console.error(err);
      alert('Error generando PDF.');
      setGeneratingPdf(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-brand-600" /></div>;
  if (!data) return <div>No encontrada.</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="outline" className="h-10 px-3"><ArrowLeft className="w-4 h-4 mr-2"/> Volver</Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Solicitud de {data.nombres}</h2>
            <p className="text-sm text-gray-500">ID: {data.id} • {format(new Date(data.fecha_solicitud), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {signedUrls.pdf ? (
            <a href={signedUrls.pdf} target="_blank" rel="noreferrer">
              <Button variant="outline" className="h-10 text-brand-700 border-brand-200 bg-brand-50 hover:bg-brand-100">
                <FileText className="w-4 h-4 mr-2" />
                Ver PDF Oficial
              </Button>
            </a>
          ) : (
            <Button onClick={handleGeneratePDF} isLoading={generatingPdf} className="h-10 bg-brand-700">
              <Download className="w-4 h-4 mr-2" />
              Generar y Guardar PDF
            </Button>
          )}
          
          <div className="h-10 flex border border-gray-200 rounded-md overflow-hidden ml-2 shadow-sm">
            <button 
              onClick={() => handleUpdateStatus('aprobada')}
              className={`px-4 flex items-center font-medium text-sm transition-colors ${data.estado === 'aprobada' ? 'bg-green-100 text-green-700' : 'bg-white hover:bg-green-50 text-gray-600'}`}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
            </button>
            <button 
              onClick={() => handleUpdateStatus('rechazada')}
              className={`px-4 border-l border-gray-200 flex items-center font-medium text-sm transition-colors ${data.estado === 'rechazada' ? 'bg-red-100 text-red-700' : 'bg-white hover:bg-red-50 text-gray-600'}`}
            >
              <XCircle className="w-4 h-4 mr-1" /> Rechazar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Datos Personales" className="mb-0 shadow-sm border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <DataField label="Nombres" value={data.nombres} />
              <DataField label="Apellidos" value={data.apellidos} />
              <DataField label="Cédula" value={data.cedula} />
              <DataField label="Estado Civil" value={data.estado_civil} className="capitalize" />
              <DataField label="Sexo" value={data.sexo === 'm' ? 'Masculino' : data.sexo === 'f' ? 'Femenino' : ''} />
              <DataField label="Nacimiento" value={data.fecha_nacimiento} />
              <DataField label="Teléfonos" value={data.telefonos} />
              <DataField label="Email" value={data.email} className="col-span-2" />
              <DataField label="Dirección" value={data.direccion} className="col-span-3" />
              <DataField label="Ciudad" value={data.ciudad} />
              <DataField label="Provincia" value={data.provincia} />
            </div>
          </Section>

          <Section title="Datos Laborales" className="mb-0 shadow-sm border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <DataField label="Empresa" value={data.empresa} />
              <DataField label="Cód. Empleado" value={data.codigo_empleado} />
              <DataField label="Cargo" value={data.cargo} />
              <DataField label="Departamento" value={data.departamento} />
              <DataField label="Salario" value={data.salario ? `$${data.salario}` : ''} />
              <DataField label="Aporte Mensual" value={data.aporte_mensual ? `$${data.aporte_mensual}` : ''} />
            </div>
          </Section>

          <Section title="Datos Cónyuge" className="mb-0 shadow-sm border-gray-100">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <DataField label="Cónyuge" value={data.conyuge} />
              <DataField label="Ocupación" value={data.ocupacion_conyuge} />
            </div>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Firma Digital" className="mb-0 shadow-sm border-gray-100">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-32">
              {signedUrls.firma ? (
                <img src={signedUrls.firma} alt="Firma" className="max-w-full h-auto max-h-24 object-contain mix-blend-multiply" />
              ) : (
                <span className="text-gray-400 text-sm">Sin firma registrada</span>
              )}
            </div>
          </Section>
          
          <Section title="Documentos de Identidad" className="mb-0 shadow-sm border-gray-100">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Frontal</p>
                <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-[1.6]">
                  {signedUrls.frontal ? (
                    <img src={signedUrls.frontal} alt="Cédula Frontal" className="w-full h-full object-cover hover:object-contain transition-all" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No disponible</div>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Trasera</p>
                <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-[1.6]">
                  {signedUrls.trasera ? (
                    <img src={signedUrls.trasera} alt="Cédula Trasera" className="w-full h-full object-cover hover:object-contain transition-all" />
                  ) : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No disponible</div>}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function DataField({ label, value, className }: { label: string, value: any, className?: string }) {
  return (
    <div className={className}>
      <span className="block text-xs font-medium text-gray-500 mb-1">{label}</span>
      <span className="block text-sm text-gray-900 font-medium bg-gray-50 p-2 rounded border border-gray-100 min-h-9 break-words">
        {value || '-'}
      </span>
    </div>
  );
}
