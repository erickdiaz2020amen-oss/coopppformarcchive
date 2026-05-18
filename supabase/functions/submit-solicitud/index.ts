import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://esm.sh/zod@3.22.4";
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Zod Schema para validación backend (arquitectura limpia)
const formSchema = z.object({
  fechaSolicitud: z.string().nonempty(),
  nombres: z.string().nonempty(),
  apellidos: z.string().nonempty(),
  cedula: z.string().nonempty(),
  fechaNacimiento: z.string().optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  sexo: z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  ciudad: z.string().optional().nullable(),
  provincia: z.string().optional().nullable(),
  telefonos: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  dependientes: z.string().optional().nullable(),
  empresa: z.string().optional().nullable(),
  codigoEmpleado: z.string().optional().nullable(),
  direccionEmpresa: z.string().optional().nullable(),
  departamento: z.string().optional().nullable(),
  cargo: z.string().optional().nullable(),
  salario: z.string().optional().nullable(),
  fechaIngreso: z.string().optional().nullable(),
  aporteMensual: z.string().optional().nullable(),
  conyuge: z.string().optional().nullable(),
  ocupacionConyuge: z.string().optional().nullable(),
  salarioConyuge: z.string().optional().nullable(),
  fechaNacimientoConyuge: z.string().optional().nullable(),
  // Archivos en Base64
  cedulaFrontalBase64: z.string().optional().nullable(),
  cedulaFrontalType: z.string().optional().nullable(),
  cedulaTraseraBase64: z.string().optional().nullable(),
  cedulaTraseraType: z.string().optional().nullable(),
  firmaBase64: z.string().optional().nullable(),
});

// Función para subir archivos a Backblaze B2 (S3 compatible)
async function uploadToB2(base64: string, contentType: string, fileName: string): Promise<string> {
  const aws = new AwsClient({
    accessKeyId: Deno.env.get("BACKBLAZE_KEY_ID") || '',
    secretAccessKey: Deno.env.get("BACKBLAZE_APP_KEY") || '',
    service: "s3",
    region: "us-east-005" // Extraido del endpoint
  });

  const bucket = Deno.env.get("BACKBLAZE_BUCKET") || '';
  const endpoint = Deno.env.get("BACKBLAZE_ENDPOINT") || ''; 
  
  if (!bucket || !endpoint) throw new Error("Backblaze Config Missing");

  const key = `solicitudes/${crypto.randomUUID()}-${fileName}`;
  const url = `https://${bucket}.${endpoint}/${key}`;

  // Extraer la data base64 (remover el prefijo si existe)
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const res = await aws.fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
    },
    body: bytes,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('B2 Upload Error:', errorText);
    throw new Error('Fallo al subir a Backblaze');
  }

  return url;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    
    // Validación de datos backend
    const validatedData = formSchema.parse(body);

    let cedula_frontal_url = null;
    let cedula_trasera_url = null;
    let firma_url = null;

    // Subir archivos a Backblaze si existen
    if (validatedData.cedulaFrontalBase64 && validatedData.cedulaFrontalType) {
      cedula_frontal_url = await uploadToB2(validatedData.cedulaFrontalBase64, validatedData.cedulaFrontalType, 'cedula-frontal');
    }
    if (validatedData.cedulaTraseraBase64 && validatedData.cedulaTraseraType) {
      cedula_trasera_url = await uploadToB2(validatedData.cedulaTraseraBase64, validatedData.cedulaTraseraType, 'cedula-trasera');
    }
    if (validatedData.firmaBase64) {
      firma_url = await uploadToB2(validatedData.firmaBase64, 'image/png', 'firma.png');
    }

    // Insertar en base de datos
    const { data, error } = await supabaseClient
      .from('solicitudes')
      .insert({
        fecha_solicitud: validatedData.fechaSolicitud,
        nombres: validatedData.nombres,
        apellidos: validatedData.apellidos,
        cedula: validatedData.cedula,
        fecha_nacimiento: validatedData.fechaNacimiento || null,
        estado_civil: validatedData.estadoCivil || null,
        sexo: validatedData.sexo || null,
        direccion: validatedData.direccion || null,
        ciudad: validatedData.ciudad || null,
        provincia: validatedData.provincia || null,
        telefonos: validatedData.telefonos || null,
        email: validatedData.email || null,
        dependientes: validatedData.dependientes || null,
        empresa: validatedData.empresa || null,
        codigo_empleado: validatedData.codigoEmpleado || null,
        direccion_empresa: validatedData.direccionEmpresa || null,
        departamento: validatedData.departamento || null,
        cargo: validatedData.cargo || null,
        salario: validatedData.salario || null,
        fecha_ingreso: validatedData.fechaIngreso || null,
        aporte_mensual: validatedData.aporteMensual || null,
        conyuge: validatedData.conyuge || null,
        ocupacion_conyuge: validatedData.ocupacionConyuge || null,
        salario_conyuge: validatedData.salarioConyuge || null,
        fecha_nacimiento_conyuge: validatedData.fechaNacimientoConyuge || null,
        cedula_frontal_url,
        cedula_trasera_url,
        firma_url,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
