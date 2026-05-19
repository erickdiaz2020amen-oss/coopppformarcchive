import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SignatureCanvas from 'react-signature-canvas';
import { Section } from '../components/ui/Section';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Upload, X, CheckCircle2, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
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

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const proxyUrl = `${baseUrl}/api/b2/${key}`;

  const res = await fetch(proxyUrl, {
    method: 'PUT',
    headers: signedReq.headers,
    body: bytes,
  });

  if (!res.ok) throw new Error('Error subiendo imagen a Backblaze');
  return url;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const formSchema = z.object({
  fechaSolicitud: z.string().nonempty('Requerido'),
  nombres: z.string().nonempty('Requerido'),
  apellidos: z.string().nonempty('Requerido'),
  cedula: z.string().nonempty('Requerido'),
  fechaNacimiento: z.string().optional(),
  estadoCivil: z.string().optional(),
  sexo: z.string().optional(),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  telefonos: z.string().optional(),
  email: z.string().optional(),
  dependientes: z.string().optional(),
  empresa: z.string().optional(),
  codigoEmpleado: z.string().optional(),
  direccionEmpresa: z.string().optional(),
  departamento: z.string().optional(),
  cargo: z.string().optional(),
  salario: z.string().optional(),
  fechaIngreso: z.string().optional(),
  aporteMensual: z.string().optional(),
  conyuge: z.string().optional(),
  ocupacionConyuge: z.string().optional(),
  salarioConyuge: z.string().optional(),
  fechaNacimientoConyuge: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [cedulaFrontal, setCedulaFrontal] = useState<File | null>(null);
  const [cedulaTrasera, setCedulaTrasera] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fechaSolicitud: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      let cedula_frontal_url = null;
      let cedula_trasera_url = null;
      let firma_url = null;

      if (cedulaFrontal) {
        const b64 = await fileToBase64(cedulaFrontal);
        cedula_frontal_url = await uploadToB2Client(b64, cedulaFrontal.type, 'cedula-frontal');
      }
      if (cedulaTrasera) {
        const b64 = await fileToBase64(cedulaTrasera);
        cedula_trasera_url = await uploadToB2Client(b64, cedulaTrasera.type, 'cedula-trasera');
      }
      
      const signatureData = sigCanvas.current?.isEmpty() ? null : sigCanvas.current?.toDataURL();
      if (signatureData) {
        firma_url = await uploadToB2Client(signatureData, 'image/png', 'firma.png');
      }

      const { error } = await supabase.from('solicitudes').insert({
        fecha_solicitud: data.fechaSolicitud,
        nombres: data.nombres,
        apellidos: data.apellidos,
        cedula: data.cedula,
        fecha_nacimiento: data.fechaNacimiento || null,
        estado_civil: data.estadoCivil || null,
        sexo: data.sexo || null,
        direccion: data.direccion || null,
        ciudad: data.ciudad || null,
        provincia: data.provincia || null,
        telefonos: data.telefonos || null,
        email: data.email || null,
        dependientes: data.dependientes || null,
        empresa: data.empresa || null,
        codigo_empleado: data.codigoEmpleado || null,
        direccion_empresa: data.direccionEmpresa || null,
        departamento: data.departamento || null,
        cargo: data.cargo || null,
        salario: data.salario || null,
        fecha_ingreso: data.fechaIngreso || null,
        aporte_mensual: data.aporteMensual || null,
        conyuge: data.conyuge || null,
        ocupacion_conyuge: data.ocupacionConyuge || null,
        salario_conyuge: data.salarioConyuge || null,
        fecha_nacimiento_conyuge: data.fechaNacimientoConyuge || null,
        cedula_frontal_url,
        cedula_trasera_url,
        firma_url,
      });

      if (error) throw new Error(error.message);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error(err);
      alert('Hubo un error al enviar la solicitud: ' + (err.message || 'Intente nuevamente.'));
      setIsSubmitting(false);
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  if (isSuccess) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8 text-center mt-8 animate-fade-in-up border border-brand-100">
        <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Solicitud Enviada con Éxito!</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Hemos recibido su solicitud de admisión. Nuestro equipo la revisará y se pondrá en contacto con usted a la brevedad posible.
        </p>
        <Button onClick={() => window.location.reload()} className="px-8 py-3 text-lg">
          Enviar Nueva Solicitud
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden mt-8 border border-brand-100/50">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
        
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required>Fecha de la Solicitud</Label>
            <Input type="date" {...register('fechaSolicitud')} className={cn(errors.fechaSolicitud && "border-red-500")} />
            {errors.fechaSolicitud && <span className="text-red-500 text-xs mt-1">{errors.fechaSolicitud.message}</span>}
          </div>
        </div>

        <Section title="Datos Personales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label required>Nombres</Label>
              <Input placeholder="Ej. Juan Pérez" {...register('nombres')} className={cn(errors.nombres && "border-red-500")} />
              {errors.nombres && <span className="text-red-500 text-xs mt-1">{errors.nombres.message}</span>}
            </div>
            <div>
              <Label required>Apellidos</Label>
              <Input placeholder="Ej. Gómez" {...register('apellidos')} className={cn(errors.apellidos && "border-red-500")} />
              {errors.apellidos && <span className="text-red-500 text-xs mt-1">{errors.apellidos.message}</span>}
            </div>
            <div>
              <Label required>Cédula</Label>
              <Input placeholder="000-0000000-0" {...register('cedula')} className={cn(errors.cedula && "border-red-500")} />
              {errors.cedula && <span className="text-red-500 text-xs mt-1">{errors.cedula.message}</span>}
            </div>
            <div>
              <Label>Fecha de Nacimiento</Label>
              <Input type="date" {...register('fechaNacimiento')} />
            </div>
            <div>
              <Label>Estado Civil</Label>
              <Select {...register('estadoCivil')}>
                <option value="">Seleccione</option>
                <option value="soltero">Soltero/a</option>
                <option value="casado">Casado/a</option>
                <option value="union_libre">Unión Libre</option>
                <option value="divorciado">Divorciado/a</option>
                <option value="viudo">Viudo/a</option>
              </Select>
            </div>
            <div>
              <Label>Sexo</Label>
              <Select {...register('sexo')}>
                <option value="">Seleccione</option>
                <option value="m">Masculino</option>
                <option value="f">Femenino</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Input placeholder="Calle, Número, Sector" {...register('direccion')} />
            </div>
            <div>
              <Label>Ciudad</Label>
              <Input placeholder="Ej. Santo Domingo" {...register('ciudad')} />
            </div>
            <div>
              <Label>Provincia</Label>
              <Input placeholder="Ej. Distrito Nacional" {...register('provincia')} />
            </div>
            <div>
              <Label>Teléfonos</Label>
              <Input placeholder="Residencial / Celular" {...register('telefonos')} />
            </div>
            <div>
              <Label>E-Mail</Label>
              <Input type="email" placeholder="correo@ejemplo.com" {...register('email')} />
            </div>
            <div>
              <Label>Dependientes</Label>
              <Input type="number" placeholder="0" {...register('dependientes')} />
            </div>
          </div>
        </Section>

        <Section title="Datos Laborales">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label>Empresa</Label>
              <Input placeholder="Nombre de la empresa" {...register('empresa')} />
            </div>
            <div>
              <Label>Código Empleado</Label>
              <Input placeholder="Código o ID" {...register('codigoEmpleado')} />
            </div>
            <div className="md:col-span-2">
              <Label>Dirección</Label>
              <Input placeholder="Dirección de la empresa" {...register('direccionEmpresa')} />
            </div>
            <div>
              <Label>Depto.</Label>
              <Input placeholder="Departamento" {...register('departamento')} />
            </div>
            <div>
              <Label>Cargo / Ocupación</Label>
              <Input placeholder="Puesto que ocupa" {...register('cargo')} />
            </div>
            <div>
              <Label>Salario</Label>
              <Input placeholder="Monto" type="number" {...register('salario')} />
            </div>
            <div>
              <Label>Fecha de Ingreso</Label>
              <Input type="date" {...register('fechaIngreso')} />
            </div>
            <div>
              <Label>Aporte Mensual</Label>
              <Input placeholder="Monto a aportar" type="number" {...register('aporteMensual')} />
            </div>
          </div>
        </Section>

        <Section title="Datos del Cónyuge">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label>Cónyuge</Label>
              <Input placeholder="Nombre completo" {...register('conyuge')} />
            </div>
            <div>
              <Label>Ocupación</Label>
              <Input placeholder="Profesión u oficio" {...register('ocupacionConyuge')} />
            </div>
            <div>
              <Label>Salario</Label>
              <Input placeholder="Monto" type="number" {...register('salarioConyuge')} />
            </div>
            <div>
              <Label>Fecha de Nacimiento</Label>
              <Input type="date" {...register('fechaNacimientoConyuge')} />
            </div>
          </div>
        </Section>

        <div className="mb-8">
          <Label required className="text-base">Firma del Solicitante</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 relative mt-2 group hover:border-brand-400 transition-colors">
            <SignatureCanvas 
              ref={sigCanvas}
              penColor="black"
              clearOnResize={false}
              canvasProps={{className: 'sigCanvas w-full h-40 bg-transparent cursor-crosshair'}}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="absolute bottom-4 right-4 bg-white shadow-sm md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              onClick={clearSignature}
            >
              Limpiar Firma
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Dibuje su firma en el recuadro (siempre en fondo claro para que sea legible).</p>
        </div>

        <Section title="Subir Cédula">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUpload 
              label="Cédula (Frontal) *"
              file={cedulaFrontal}
              onChange={setCedulaFrontal}
              onRemove={() => setCedulaFrontal(null)}
            />
            <FileUpload 
              label="Cédula (Trasera) *"
              file={cedulaTrasera}
              onChange={setCedulaTrasera}
              onRemove={() => setCedulaTrasera(null)}
            />
          </div>
        </Section>

        <div className="mt-10 border-t border-gray-100 pt-8">
          <Button 
            type="submit" 
            className="w-full py-4 text-lg font-bold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-0.5 transition-all"
            isLoading={isSubmitting}
          >
            {!isSubmitting && <Send className="mr-2 h-5 w-5" />}
            Enviar Solicitud
          </Button>
        </div>
      </form>
    </div>
  );
}

function FileUpload({ label, file, onChange, onRemove }: { label: string, file: File | null, onChange: (file: File) => void, onRemove: () => void }) {
  return (
    <div>
      <Label className="mb-2">{label}</Label>
      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-200 border-dashed rounded-lg cursor-pointer bg-brand-50/50 hover:bg-brand-50 transition-colors hover:border-brand-400">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-brand-500" />
            <p className="mb-2 text-sm text-gray-600"><span className="font-semibold text-brand-600">Click para subir</span> o arrastrar y soltar</p>
            <p className="text-xs text-gray-500">JPG, PNG o PDF (MAX. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*,.pdf" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onChange(e.target.files[0]);
              }
            }}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center truncate mr-4">
            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
          </div>
          <button 
            type="button" 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
