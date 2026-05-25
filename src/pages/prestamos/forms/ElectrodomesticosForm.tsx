import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import SignatureCanvas from 'react-signature-canvas';
import { UploadCloud, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';

import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Section } from '../../../components/ui/Section';
import { supabase } from '../../../lib/supabase';
import { AwsClient } from 'aws4fetch';

// Upload function directly from client to Backblaze
const uploadToB2Client = async (fileBase64: string, contentType: string, fileName: string) => {
  if (!fileBase64) return null;
  
  const aws = new AwsClient({
    accessKeyId: import.meta.env.VITE_BACKBLAZE_KEY_ID || import.meta.env.BACKBLAZE_KEY_ID || '00576daad65b0f30000000001',
    secretAccessKey: import.meta.env.VITE_BACKBLAZE_APP_KEY || import.meta.env.BACKBLAZE_APP_KEY || 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
    service: "s3",
    region: "us-east-005"
  });

  const bucket = import.meta.env.VITE_BACKBLAZE_BUCKET || import.meta.env.BACKBLAZE_BUCKET || 'coopmaza-documentos';
  const endpoint = import.meta.env.VITE_BACKBLAZE_ENDPOINT || import.meta.env.BACKBLAZE_ENDPOINT || 's3.us-east-005.backblazeb2.com'; 
  
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

  if (!res.ok) throw new Error('Error subiendo imagen a Backblaze');
  return url;
};

// Schema Validation
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const electrodomesticoSchema = z.object({
  numero_cuenta: z.string().min(1, 'Requerido'),
  nombres_apellidos: z.string().min(3, 'Requerido'),
  apodo: z.string().optional(),
  cedula: z.string().min(11, 'Mínimo 11 caracteres').max(13, 'Máximo 13 caracteres'),
  sexo: z.enum(['m', 'f'], { message: 'Requerido' }),
  estado_civil: z.enum(['soltero', 'casado', 'union_libre', 'divorciado', 'viudo'], { message: 'Requerido' }),
  nacionalidad: z.string().min(1, 'Requerido'),
  telefono: z.string().min(10, 'Mínimo 10 dígitos'),
  direccion: z.string().min(5, 'Requerido'),
  monto_letras: z.string().min(1, 'Requerido'),
  monto_prestamo: z.string().min(1, 'Requerido'),
  plazo_prestamo: z.string().min(1, 'Requerido'),
  forma_pago: z.string().min(1, 'Requerido'),
  cantidad_acciones: z.string().min(1, 'Requerido'),
  numero_cotizacion: z.string().min(1, 'Requerido'),
  articulo_seleccionado: z.string().min(1, 'Requerido'),
  
  // Referencias Personales
  ref_per_nombres: z.string().min(1, 'Requerido'),
  ref_per_apodo: z.string().optional(),
  ref_per_direccion: z.string().min(1, 'Requerido'),
  ref_per_tel: z.string().min(10, 'Requerido'),

  cedulaFrontal: z.any()
    .refine((files) => files?.length === 1, "Imagen requerida.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamaño máximo 5MB.")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Solo formato .jpg, .jpeg, .png y .webp"),
  cedulaTrasera: z.any()
    .refine((files) => files?.length === 1, "Imagen requerida.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamaño máximo 5MB.")
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Solo formato .jpg, .jpeg, .png y .webp"),
});

type ElectrodomesticoFormValues = z.infer<typeof electrodomesticoSchema>;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function ElectrodomesticosForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd / MM / yyyy');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ElectrodomesticoFormValues>({
    resolver: zodResolver(electrodomesticoSchema),
    defaultValues: {
      nacionalidad: 'Dominicana',
    }
  });

  const onSubmit = async (data: ElectrodomesticoFormValues) => {
    try {
      if (signatureRef.current?.isEmpty()) {
        setSignatureError(true);
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        return;
      }
      setSignatureError(false);
      setIsSubmitting(true);
      setError(null);

      const cedulaFrontalFile = data.cedulaFrontal[0] as File;
      const cedulaTraseraFile = data.cedulaTrasera[0] as File;
      const firmaDataUrl = signatureRef.current?.toDataURL('image/png') || '';

      const [cedulaFrontalB64, cedulaTraseraB64] = await Promise.all([
        fileToBase64(cedulaFrontalFile),
        fileToBase64(cedulaTraseraFile)
      ]);

      const cedula_frontal_url = await uploadToB2Client(cedulaFrontalB64, cedulaFrontalFile.type, 'cedula-frontal');
      const cedula_trasera_url = await uploadToB2Client(cedulaTraseraB64, cedulaTraseraFile.type, 'cedula-trasera');
      const firma_url = await uploadToB2Client(firmaDataUrl, 'image/png', 'firma.png');

      const { error: dbError } = await supabase.from('solicitudes').insert({
        nombres: data.nombres_apellidos,
        apellidos: data.apodo || 'N/A', 
        cedula: data.cedula,
        fecha_solicitud: currentDate.toISOString().split('T')[0],
        estado_civil: data.estado_civil,
        sexo: data.sexo,
        direccion: data.direccion,
        telefonos: data.telefono,
        cargo: 'PRESTAMO_ELECTRODOMESTICOS',
        dependientes: JSON.stringify({
          nacionalidad: data.nacionalidad,
          numero_cuenta: data.numero_cuenta,
          monto_letras: data.monto_letras,
          monto_prestamo: data.monto_prestamo,
          plazo_prestamo: data.plazo_prestamo,
          forma_pago: data.forma_pago,
          cantidad_acciones: data.cantidad_acciones,
          numero_cotizacion: data.numero_cotizacion,
          articulo_seleccionado: data.articulo_seleccionado,
          ref_per_nombres: data.ref_per_nombres,
          ref_per_apodo: data.ref_per_apodo,
          ref_per_direccion: data.ref_per_direccion,
          ref_per_tel: data.ref_per_tel
        }),
        ciudad: 'N/A',
        provincia: 'N/A',
        email: 'N/A',
        cedula_frontal_url,
        cedula_trasera_url,
        firma_url,
      });

      if (dbError) throw new Error(dbError.message);
      
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ha ocurrido un error al enviar la solicitud.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-brand-100/50 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">¡Solicitud Enviada!</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Su solicitud de Préstamo de Enseres/Electrodomésticos ha sido enviada exitosamente. Nuestro equipo la revisará y le contactará pronto.
        </p>
        <Link to="/prestamos">
          <Button size="lg" className="px-8 font-bold text-base h-14 bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-lg">
            Volver a Préstamos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-fade-in-up">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Punto I - Datos Personales */}
      <Section title="I. Datos personales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Fecha <span className="text-red-500">*</span></Label>
            <Input value={formattedDate} readOnly className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed font-medium" />
            <p className="text-xs text-gray-400">Fecha actual del sistema</p>
          </div>
          
          <div className="space-y-1.5">
            <Label>Número de cuenta <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. 1000234" {...register('numero_cuenta')} />
            {errors.numero_cuenta && <p className="text-sm text-red-600">{errors.numero_cuenta.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Nombres y apellidos <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. Juan Pérez" {...register('nombres_apellidos')} />
            {errors.nombres_apellidos && <p className="text-sm text-red-600">{errors.nombres_apellidos.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Apodo</Label>
            <Input placeholder="Ej. Juancito" {...register('apodo')} />
            {errors.apodo && <p className="text-sm text-red-600">{errors.apodo.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Cédula <span className="text-red-500">*</span></Label>
            <Input placeholder="000-0000000-0" {...register('cedula')} />
            {errors.cedula && <p className="text-sm text-red-600">{errors.cedula.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Sexo <span className="text-red-500">*</span></Label>
            <Select {...register('sexo')}>
              <option value="">Seleccione...</option>
              <option value="m">Masculino</option>
              <option value="f">Femenino</option>
            </Select>
            {errors.sexo && <p className="text-sm text-red-600">{errors.sexo.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Estado civil <span className="text-red-500">*</span></Label>
            <Select {...register('estado_civil')}>
              <option value="">Seleccione...</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="union_libre">Unión Libre</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="viudo">Viudo/a</option>
            </Select>
            {errors.estado_civil && <p className="text-sm text-red-600">{errors.estado_civil.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Nacionalidad <span className="text-red-500">*</span></Label>
            <Input placeholder="Dominicana" {...register('nacionalidad')} />
            {errors.nacionalidad && <p className="text-sm text-red-600">{errors.nacionalidad.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono <span className="text-red-500">*</span></Label>
            <Input placeholder="(000) 000-0000" type="tel" {...register('telefono')} />
            {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Dirección <span className="text-red-500">*</span></Label>
            <Input placeholder="Calle, Sector, Ciudad" {...register('direccion')} />
            {errors.direccion && <p className="text-sm text-red-600">{errors.direccion.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      {/* Punto II - Datos del Préstamo */}
      <Section title="II. Datos del Préstamo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Monto en letras <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. Quinientos mil pesos" {...register('monto_letras')} />
            {errors.monto_letras && <p className="text-sm text-red-600">{errors.monto_letras.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Monto del préstamo <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. 500,000" type="number" {...register('monto_prestamo')} />
            {errors.monto_prestamo && <p className="text-sm text-red-600">{errors.monto_prestamo.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Plazo del préstamo <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. 12 meses" {...register('plazo_prestamo')} />
            {errors.plazo_prestamo && <p className="text-sm text-red-600">{errors.plazo_prestamo.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Forma de pago <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. Cuotas mensuales" {...register('forma_pago')} />
            {errors.forma_pago && <p className="text-sm text-red-600">{errors.forma_pago.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Cantidad de acciones <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. 100" type="number" {...register('cantidad_acciones')} />
            {errors.cantidad_acciones && <p className="text-sm text-red-600">{errors.cantidad_acciones.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Número de cotización <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. COT-2023-001" {...register('numero_cotizacion')} />
            {errors.numero_cotizacion && <p className="text-sm text-red-600">{errors.numero_cotizacion.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Artículo seleccionado <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. Nevera Samsung 22 pies, Estufa Mabe, etc." {...register('articulo_seleccionado')} />
            {errors.articulo_seleccionado && <p className="text-sm text-red-600">{errors.articulo_seleccionado.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      {/* Punto III - Referencias Personales */}
      <Section title="III. Referencias Personales del Socio (No familiar)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Nombres y Apellidos <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. Jane Doe" {...register('ref_per_nombres')} />
            {errors.ref_per_nombres && <p className="text-sm text-red-600">{errors.ref_per_nombres.message?.toString()}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Apodo</Label>
            <Input placeholder="Ej. La rubia" {...register('ref_per_apodo')} />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono <span className="text-red-500">*</span></Label>
            <Input placeholder="(000) 000-0000" type="tel" {...register('ref_per_tel')} />
            {errors.ref_per_tel && <p className="text-sm text-red-600">{errors.ref_per_tel.message?.toString()}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Dirección <span className="text-red-500">*</span></Label>
            <Input placeholder="Calle, Sector, Ciudad" {...register('ref_per_direccion')} />
            {errors.ref_per_direccion && <p className="text-sm text-red-600">{errors.ref_per_direccion.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      {/* Documentos y Firma */}
      <Section title="Documentos Requeridos">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Cédula de Identidad (Frontal) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaFrontal')} />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
              </div>
            </div>
            {errors.cedulaFrontal && <p className="text-sm text-red-600">{errors.cedulaFrontal.message?.toString()}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Cédula de Identidad (Trasera) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaTrasera')} />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 5MB</p>
              </div>
            </div>
            {errors.cedulaTrasera && <p className="text-sm text-red-600">{errors.cedulaTrasera.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      <Section title="Firma Digital">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Dibuje su firma en el recuadro blanco a continuación. Debe coincidir con la firma de su cédula. <span className="text-red-500">*</span>
          </p>
          <div className={`border-2 rounded-xl bg-white overflow-hidden shadow-inner ${signatureError ? 'border-red-500' : 'border-gray-300'}`}>
            <SignatureCanvas 
              ref={signatureRef}
              canvasProps={{
                className: 'w-full h-48 sm:h-64 cursor-crosshair',
              }}
              backgroundColor="white"
            />
          </div>
          {signatureError && <p className="text-sm text-red-600 font-medium">Por favor proporcione su firma digital.</p>}
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => {
              signatureRef.current?.clear();
              setSignatureError(false);
            }}
            className="text-gray-600 border-gray-300"
          >
            Limpiar firma
          </Button>
        </div>
      </Section>

      {/* Submit */}
      <div className="pt-6 border-t border-gray-200">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto min-w-[240px] h-14 text-base font-bold bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-lg shadow-brand-700/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Procesando solicitud...
            </>
          ) : (
            'Enviar Solicitud de Préstamo'
          )}
        </Button>
        <p className="mt-4 text-xs text-gray-500 text-center sm:text-left">
          Al enviar esta solicitud, confirmo que todos los datos proporcionados son verídicos.
        </p>
      </div>
    </form>
  );
}
