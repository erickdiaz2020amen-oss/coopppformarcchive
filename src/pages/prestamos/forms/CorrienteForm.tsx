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
import { sendLoanNotification } from '../../../lib/utils';
import { AwsClient } from 'aws4fetch';

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileSchema = z.any()
  .refine((files) => files?.length === 1, "Imagen requerida.")
  .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Tamaño máximo 5MB.")
  .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Solo formato .jpg, .jpeg, .png y .webp");

const corrienteSchema = z.object({
  // I. Datos Personales
  numero_cuenta: z.string().min(1, 'Requerido'),
  nombres_apellidos: z.string().min(3, 'Requerido'),
  apodo: z.string().optional(),
  cedula: z.string().min(11, 'Mínimo 11 caracteres').max(13, 'Máximo 13 caracteres'),
  sexo: z.enum(['m', 'f'], { message: 'Requerido' }),
  estado_civil: z.enum(['soltero', 'casado', 'union_libre', 'divorciado', 'viudo'], { message: 'Requerido' }),
  nacionalidad: z.string().min(1, 'Requerido'),
  telefono: z.string().min(10, 'Mínimo 10 dígitos'),
  direccion: z.string().min(5, 'Requerido'),
  
  // II. Fuente de Ingreso
  actividad_dedica: z.string().min(1, 'Requerido'),
  tipo_ingreso: z.enum(['empleado', 'negocio_propio', 'otros'], { message: 'Requerido' }),
  negocio_propio_especifique: z.string().optional(),
  empresa_nombre: z.string().optional(),
  empresa_direccion_tel: z.string().optional(),
  ingreso_mensual: z.string().min(1, 'Requerido'),
  gastos_fijos: z.string().min(1, 'Requerido'),
  otros_ingresos: z.string().optional(),

  // III. Datos del Préstamo
  monto_letras: z.string().min(1, 'Requerido'),
  monto_prestamo: z.string().min(1, 'Requerido'),
  plazo_prestamo: z.string().min(1, 'Requerido'),
  forma_pago: z.string().min(1, 'Requerido'),
  cantidad_acciones: z.string().min(1, 'Requerido'),
  fines: z.string().min(1, 'Requerido'),
  fecha_vencimiento: z.string().min(1, 'Requerido'),

  // IV. Referencias Personales
  ref_per_nombres: z.string().min(1, 'Requerido'),
  ref_per_apodo: z.string().optional(),
  ref_per_direccion: z.string().min(1, 'Requerido'),
  ref_per_tel: z.string().min(10, 'Requerido'),

  // V. Referencias Comerciales
  ref_com_empresa: z.string().optional(),
  ref_com_direccion: z.string().optional(),
  ref_com_tel: z.string().optional(),
  ref_com_tipo: z.string().optional(),

  // VI. Datos de Garante
  gar_nombres: z.string().min(1, 'Requerido'),
  gar_apodo: z.string().optional(),
  gar_cedula: z.string().min(11, 'Requerido'),
  gar_sexo: z.enum(['m', 'f'], { message: 'Requerido' }),
  gar_estado_civil: z.string().min(1, 'Requerido'),
  gar_nacionalidad: z.string().min(1, 'Requerido'),
  gar_tel: z.string().min(10, 'Requerido'),
  gar_direccion: z.string().min(1, 'Requerido'),
  gar_empresa_labora: z.string().optional(),
  gar_empresa_direccion: z.string().optional(),
  gar_empresa_tel: z.string().optional(),
  gar_tiempo_empresa: z.string().optional(),
  gar_ingreso_mensual: z.string().min(1, 'Requerido'),
  gar_gastos_fijos: z.string().min(1, 'Requerido'),
  gar_otros_ingresos: z.string().optional(),

  cedulaFrontal: fileSchema,
  cedulaTrasera: fileSchema,
  cedulaGaranteFrontal: fileSchema,
  cedulaGaranteTrasera: fileSchema,
});

type CorrienteFormValues = z.infer<typeof corrienteSchema>;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function CorrienteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const signatureRef = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);

  const signatureGaranteRef = useRef<SignatureCanvas>(null);
  const [signatureGaranteError, setSignatureGaranteError] = useState(false);

  const currentDate = new Date();
  const formattedDate = format(currentDate, 'dd / MM / yyyy');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CorrienteFormValues>({
    resolver: zodResolver(corrienteSchema),
    defaultValues: {
      nacionalidad: 'Dominicana',
      gar_nacionalidad: 'Dominicana'
    }
  });

  const tipoIngreso = watch('tipo_ingreso');

  const onSubmit = async (data: CorrienteFormValues) => {
    try {
      let hasError = false;
      if (signatureRef.current?.isEmpty()) {
        setSignatureError(true);
        hasError = true;
      } else {
        setSignatureError(false);
      }

      if (signatureGaranteRef.current?.isEmpty()) {
        setSignatureGaranteError(true);
        hasError = true;
      } else {
        setSignatureGaranteError(false);
      }

      if (hasError) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const cedulaFrontalFile = data.cedulaFrontal[0] as File;
      const cedulaTraseraFile = data.cedulaTrasera[0] as File;
      const cedulaGaranteFrontalFile = data.cedulaGaranteFrontal[0] as File;
      const cedulaGaranteTraseraFile = data.cedulaGaranteTrasera[0] as File;

      const firmaDataUrl = signatureRef.current?.toDataURL('image/png') || '';
      const firmaGaranteDataUrl = signatureGaranteRef.current?.toDataURL('image/png') || '';

      const [
        cedulaFrontalB64, 
        cedulaTraseraB64,
        cedulaGarFrontalB64,
        cedulaGarTraseraB64
      ] = await Promise.all([
        fileToBase64(cedulaFrontalFile),
        fileToBase64(cedulaTraseraFile),
        fileToBase64(cedulaGaranteFrontalFile),
        fileToBase64(cedulaGaranteTraseraFile)
      ]);

      const [
        cedula_frontal_url,
        cedula_trasera_url,
        firma_url,
        cedula_garante_frontal_url,
        cedula_garante_trasera_url,
        firma_garante_url
      ] = await Promise.all([
        uploadToB2Client(cedulaFrontalB64, cedulaFrontalFile.type, 'cedula-frontal'),
        uploadToB2Client(cedulaTraseraB64, cedulaTraseraFile.type, 'cedula-trasera'),
        uploadToB2Client(firmaDataUrl, 'image/png', 'firma'),
        uploadToB2Client(cedulaGarFrontalB64, cedulaGaranteFrontalFile.type, 'cedula-garante-frontal'),
        uploadToB2Client(cedulaGarTraseraB64, cedulaGaranteTraseraFile.type, 'cedula-garante-trasera'),
        uploadToB2Client(firmaGaranteDataUrl, 'image/png', 'firma-garante')
      ]);

      const { error: dbError } = await supabase.from('solicitudes').insert({
        nombres: data.nombres_apellidos,
        apellidos: data.apodo || 'N/A', 
        cedula: data.cedula,
        fecha_solicitud: currentDate.toISOString().split('T')[0],
        estado_civil: data.estado_civil,
        sexo: data.sexo,
        direccion: data.direccion,
        telefonos: data.telefono,
        cargo: 'PRESTAMO_CORRIENTE',
        dependientes: JSON.stringify({
          // I
          nacionalidad: data.nacionalidad,
          numero_cuenta: data.numero_cuenta,
          // II
          actividad_dedica: data.actividad_dedica,
          tipo_ingreso: data.tipo_ingreso,
          negocio_propio_especifique: data.negocio_propio_especifique,
          empresa_nombre: data.empresa_nombre,
          empresa_direccion_tel: data.empresa_direccion_tel,
          ingreso_mensual: data.ingreso_mensual,
          gastos_fijos: data.gastos_fijos,
          otros_ingresos: data.otros_ingresos,
          // III
          monto_letras: data.monto_letras,
          monto_prestamo: data.monto_prestamo,
          plazo_prestamo: data.plazo_prestamo,
          forma_pago: data.forma_pago,
          cantidad_acciones: data.cantidad_acciones,
          fines: data.fines,
          fecha_vencimiento: data.fecha_vencimiento,
          // IV
          ref_per_nombres: data.ref_per_nombres,
          ref_per_apodo: data.ref_per_apodo,
          ref_per_direccion: data.ref_per_direccion,
          ref_per_tel: data.ref_per_tel,
          // V
          ref_com_empresa: data.ref_com_empresa,
          ref_com_direccion: data.ref_com_direccion,
          ref_com_tel: data.ref_com_tel,
          ref_com_tipo: data.ref_com_tipo,
          // VI
          gar_nombres: data.gar_nombres,
          gar_apodo: data.gar_apodo,
          gar_cedula: data.gar_cedula,
          gar_sexo: data.gar_sexo,
          gar_estado_civil: data.gar_estado_civil,
          gar_nacionalidad: data.gar_nacionalidad,
          gar_tel: data.gar_tel,
          gar_direccion: data.gar_direccion,
          gar_empresa_labora: data.gar_empresa_labora,
          gar_empresa_direccion: data.gar_empresa_direccion,
          gar_empresa_tel: data.gar_empresa_tel,
          gar_tiempo_empresa: data.gar_tiempo_empresa,
          gar_ingreso_mensual: data.gar_ingreso_mensual,
          gar_gastos_fijos: data.gar_gastos_fijos,
          gar_otros_ingresos: data.gar_otros_ingresos,
          
          cedula_garante_frontal_url,
          cedula_garante_trasera_url,
          firma_garante_url
        }),
        ciudad: 'N/A',
        provincia: 'N/A',
        email: 'N/A',
        cedula_frontal_url,
        cedula_trasera_url,
        firma_url,
      });

      if (dbError) throw new Error(dbError.message);

      // WhatsApp Notification
      await sendLoanNotification({
        cargo: 'PRÉSTAMO CORRIENTE',
        nombres_apellidos: data.nombres_apellidos,
        cedula: data.cedula,
        telefono: data.telefono,
        monto_prestamo: data.monto_prestamo,
        plazo_prestamo: data.plazo_prestamo
      });
      
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
          Su Solicitud de Préstamo Corriente ha sido enviada exitosamente. Nuestro equipo la revisará y le contactará pronto.
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
          </div>
          <div className="space-y-1.5">
            <Label>Número de cuenta <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. 1000234" {...register('numero_cuenta')} />
            {errors.numero_cuenta && <p className="text-sm text-red-600">{errors.numero_cuenta.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Nombres y apellidos <span className="text-red-500">*</span></Label>
            <Input {...register('nombres_apellidos')} />
            {errors.nombres_apellidos && <p className="text-sm text-red-600">{errors.nombres_apellidos.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Apodo</Label>
            <Input {...register('apodo')} />
          </div>
          <div className="space-y-1.5">
            <Label>Cédula <span className="text-red-500">*</span></Label>
            <Input placeholder="000-0000000-0" {...register('cedula')} />
            {errors.cedula && <p className="text-sm text-red-600">{errors.cedula.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Sexo <span className="text-red-500">*</span></Label>
            <Select {...register('sexo')}>
              <option value="">Seleccione...</option>
              <option value="m">Masculino</option>
              <option value="f">Femenino</option>
            </Select>
            {errors.sexo && <p className="text-sm text-red-600">{errors.sexo.message}</p>}
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
            {errors.estado_civil && <p className="text-sm text-red-600">{errors.estado_civil.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Nacionalidad <span className="text-red-500">*</span></Label>
            <Input {...register('nacionalidad')} />
            {errors.nacionalidad && <p className="text-sm text-red-600">{errors.nacionalidad.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono <span className="text-red-500">*</span></Label>
            <Input type="tel" {...register('telefono')} />
            {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Dirección <span className="text-red-500">*</span></Label>
            <Input {...register('direccion')} />
            {errors.direccion && <p className="text-sm text-red-600">{errors.direccion.message}</p>}
          </div>
        </div>
      </Section>

      {/* Punto II - Fuente de Ingreso */}
      <Section title="II. Fuente de Ingreso">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Actividad a la que se dedica <span className="text-red-500">*</span></Label>
            <Input {...register('actividad_dedica')} />
            {errors.actividad_dedica && <p className="text-sm text-red-600">{errors.actividad_dedica.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Tipo de ingreso <span className="text-red-500">*</span></Label>
            <Select {...register('tipo_ingreso')}>
              <option value="">Seleccione...</option>
              <option value="empleado">Empleado</option>
              <option value="negocio_propio">Negocio Propio</option>
              <option value="otros">Otros</option>
            </Select>
            {errors.tipo_ingreso && <p className="text-sm text-red-600">{errors.tipo_ingreso.message}</p>}
          </div>
          
          {tipoIngreso === 'negocio_propio' && (
            <div className="space-y-1.5 md:col-span-2">
              <Label>En caso de negocio propio especifique</Label>
              <Input {...register('negocio_propio_especifique')} />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Nombre de la empresa</Label>
            <Input {...register('empresa_nombre')} />
          </div>
          <div className="space-y-1.5">
            <Label>Dirección y teléfono de la empresa</Label>
            <Input {...register('empresa_direccion_tel')} />
          </div>
          <div className="space-y-1.5">
            <Label>Ingreso mensual <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('ingreso_mensual')} />
            {errors.ingreso_mensual && <p className="text-sm text-red-600">{errors.ingreso_mensual.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Gastos fijos <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('gastos_fijos')} />
            {errors.gastos_fijos && <p className="text-sm text-red-600">{errors.gastos_fijos.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Otros ingresos</Label>
            <Input type="number" {...register('otros_ingresos')} />
          </div>
        </div>
      </Section>

      {/* Punto III - Datos del Préstamo */}
      <Section title="III. Datos del Préstamo">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Monto en letras <span className="text-red-500">*</span></Label>
            <Input {...register('monto_letras')} />
            {errors.monto_letras && <p className="text-sm text-red-600">{errors.monto_letras.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Monto del préstamo <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('monto_prestamo')} />
            {errors.monto_prestamo && <p className="text-sm text-red-600">{errors.monto_prestamo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Plazo del préstamo <span className="text-red-500">*</span></Label>
            <Input {...register('plazo_prestamo')} />
            {errors.plazo_prestamo && <p className="text-sm text-red-600">{errors.plazo_prestamo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Forma de pago <span className="text-red-500">*</span></Label>
            <Input {...register('forma_pago')} />
            {errors.forma_pago && <p className="text-sm text-red-600">{errors.forma_pago.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Cantidad de acciones <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('cantidad_acciones')} />
            {errors.cantidad_acciones && <p className="text-sm text-red-600">{errors.cantidad_acciones.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Fines <span className="text-red-500">*</span></Label>
            <Input {...register('fines')} />
            {errors.fines && <p className="text-sm text-red-600">{errors.fines.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Fecha de vencimiento <span className="text-red-500">*</span></Label>
            <Input placeholder="DD/MM/AAAA" {...register('fecha_vencimiento')} />
            {errors.fecha_vencimiento && <p className="text-sm text-red-600">{errors.fecha_vencimiento.message}</p>}
          </div>
        </div>
      </Section>

      {/* Punto IV - Referencias Personales */}
      <Section title="IV. Referencias Personales del Socio (No familiar)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Nombres y Apellidos <span className="text-red-500">*</span></Label>
            <Input placeholder="Ej. José Miguel Rodríguez" {...register('ref_per_nombres')} />
            {errors.ref_per_nombres && <p className="text-sm text-red-600">{errors.ref_per_nombres.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Apodo</Label>
            <Input placeholder="Ej. Miguel" {...register('ref_per_apodo')} />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono <span className="text-red-500">*</span></Label>
            <Input type="tel" {...register('ref_per_tel')} />
            {errors.ref_per_tel && <p className="text-sm text-red-600">{errors.ref_per_tel.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Dirección <span className="text-red-500">*</span></Label>
            <Input {...register('ref_per_direccion')} />
            {errors.ref_per_direccion && <p className="text-sm text-red-600">{errors.ref_per_direccion.message}</p>}
          </div>
        </div>
      </Section>

      {/* Punto V - Referencias Comerciales */}
      <Section title="V. Referencias Comerciales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Nombres de la empresa</Label>
            <Input {...register('ref_com_empresa')} />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input type="tel" {...register('ref_com_tel')} />
          </div>
          <div className="space-y-1.5">
            <Label>Dirección</Label>
            <Input {...register('ref_com_direccion')} />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo de empresa</Label>
            <Input {...register('ref_com_tipo')} />
          </div>
        </div>
      </Section>

      {/* Punto VI - Datos de Garante */}
      <Section title="VI. Datos de Garante o Fiador Solidario">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Nombres y apellidos <span className="text-red-500">*</span></Label>
            <Input {...register('gar_nombres')} />
            {errors.gar_nombres && <p className="text-sm text-red-600">{errors.gar_nombres.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Apodo</Label>
            <Input {...register('gar_apodo')} />
          </div>
          <div className="space-y-1.5">
            <Label>Cédula <span className="text-red-500">*</span></Label>
            <Input {...register('gar_cedula')} />
            {errors.gar_cedula && <p className="text-sm text-red-600">{errors.gar_cedula.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Sexo <span className="text-red-500">*</span></Label>
            <Select {...register('gar_sexo')}>
              <option value="">Seleccione...</option>
              <option value="m">Masculino</option>
              <option value="f">Femenino</option>
            </Select>
            {errors.gar_sexo && <p className="text-sm text-red-600">{errors.gar_sexo.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Estado civil <span className="text-red-500">*</span></Label>
            <Select {...register('gar_estado_civil')}>
              <option value="">Seleccione...</option>
              <option value="soltero">Soltero/a</option>
              <option value="casado">Casado/a</option>
              <option value="union_libre">Unión Libre</option>
              <option value="divorciado">Divorciado/a</option>
              <option value="viudo">Viudo/a</option>
            </Select>
            {errors.gar_estado_civil && <p className="text-sm text-red-600">{errors.gar_estado_civil.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Nacionalidad <span className="text-red-500">*</span></Label>
            <Input {...register('gar_nacionalidad')} />
            {errors.gar_nacionalidad && <p className="text-sm text-red-600">{errors.gar_nacionalidad.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono <span className="text-red-500">*</span></Label>
            <Input type="tel" {...register('gar_tel')} />
            {errors.gar_tel && <p className="text-sm text-red-600">{errors.gar_tel.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Dirección <span className="text-red-500">*</span></Label>
            <Input {...register('gar_direccion')} />
            {errors.gar_direccion && <p className="text-sm text-red-600">{errors.gar_direccion.message}</p>}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Nombre de la empresa donde labora</Label>
            <Input {...register('gar_empresa_labora')} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Dirección empresa</Label>
            <Input {...register('gar_empresa_direccion')} />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono Empresa</Label>
            <Input {...register('gar_empresa_tel')} />
          </div>
          <div className="space-y-1.5">
            <Label>Tiempo en la empresa</Label>
            <Input {...register('gar_tiempo_empresa')} />
          </div>
          <div className="space-y-1.5">
            <Label>Ingreso mensual <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('gar_ingreso_mensual')} />
            {errors.gar_ingreso_mensual && <p className="text-sm text-red-600">{errors.gar_ingreso_mensual.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Gastos fijos <span className="text-red-500">*</span></Label>
            <Input type="number" {...register('gar_gastos_fijos')} />
            {errors.gar_gastos_fijos && <p className="text-sm text-red-600">{errors.gar_gastos_fijos.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Otros ingresos</Label>
            <Input type="number" {...register('gar_otros_ingresos')} />
          </div>
        </div>
      </Section>

      {/* Documentos */}
      <Section title="Documentos del Socio">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Cédula de Identidad Socio (Frontal) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaFrontal')} />
                  </label>
                </div>
              </div>
            </div>
            {errors.cedulaFrontal && <p className="text-sm text-red-600">{errors.cedulaFrontal.message?.toString()}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Cédula de Identidad Socio (Trasera) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaTrasera')} />
                  </label>
                </div>
              </div>
            </div>
            {errors.cedulaTrasera && <p className="text-sm text-red-600">{errors.cedulaTrasera.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      <Section title="Documentos del Garante">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label>Cédula Garante (Frontal) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaGaranteFrontal')} />
                  </label>
                </div>
              </div>
            </div>
            {errors.cedulaGaranteFrontal && <p className="text-sm text-red-600">{errors.cedulaGaranteFrontal.message?.toString()}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Cédula Garante (Trasera) <span className="text-red-500">*</span></Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-500 transition-colors bg-gray-50">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-brand-600 hover:text-brand-500">
                    <span>Subir archivo</span>
                    <input type="file" className="sr-only" accept="image/*" {...register('cedulaGaranteTrasera')} />
                  </label>
                </div>
              </div>
            </div>
            {errors.cedulaGaranteTrasera && <p className="text-sm text-red-600">{errors.cedulaGaranteTrasera.message?.toString()}</p>}
          </div>
        </div>
      </Section>

      <Section title="Firmas Digitales">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium">Firma del Socio <span className="text-red-500">*</span></p>
            <div className={`border-2 rounded-xl bg-white overflow-hidden shadow-inner ${signatureError ? 'border-red-500' : 'border-gray-300'}`}>
              <SignatureCanvas 
                ref={signatureRef}
                canvasProps={{ className: 'w-full h-48 cursor-crosshair' }}
                backgroundColor="white"
              />
            </div>
            {signatureError && <p className="text-sm text-red-600">Firma requerida.</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => signatureRef.current?.clear()}>Limpiar firma</Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-medium">Firma del Garante <span className="text-red-500">*</span></p>
            <div className={`border-2 rounded-xl bg-white overflow-hidden shadow-inner ${signatureGaranteError ? 'border-red-500' : 'border-gray-300'}`}>
              <SignatureCanvas 
                ref={signatureGaranteRef}
                canvasProps={{ className: 'w-full h-48 cursor-crosshair' }}
                backgroundColor="white"
              />
            </div>
            {signatureGaranteError && <p className="text-sm text-red-600">Firma requerida.</p>}
            <Button type="button" variant="outline" size="sm" onClick={() => signatureGaranteRef.current?.clear()}>Limpiar firma</Button>
          </div>
        </div>
      </Section>

      <div className="pt-6 border-t border-gray-200">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full sm:w-auto min-w-[240px] h-14 text-base font-bold bg-brand-700 hover:bg-brand-800 text-white rounded-xl shadow-lg"
        >
          {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</> : 'Enviar Solicitud de Préstamo'}
        </Button>
      </div>
    </form>
  );
}
