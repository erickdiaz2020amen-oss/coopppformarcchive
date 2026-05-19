// @ts-nocheck — This is a Supabase Edge Function (Deno runtime), not part of the Vite project.
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { AwsClient } from "https://esm.sh/aws4fetch@1.0.17";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function uploadToB2(base64: string, contentType: string, fileName: string): Promise<string> {
  const aws = new AwsClient({
    accessKeyId: Deno.env.get("BACKBLAZE_KEY_ID") || '',
    secretAccessKey: Deno.env.get("BACKBLAZE_APP_KEY") || '',
    service: "s3",
    region: "us-east-005"
  });

  const bucket = Deno.env.get("BACKBLAZE_BUCKET") || '';
  const endpoint = Deno.env.get("BACKBLAZE_ENDPOINT") || ''; 
  
  if (!bucket || !endpoint) throw new Error("Backblaze Config Missing");

  const key = `pdfs/${crypto.randomUUID()}-${fileName}`;
  const url = `https://${bucket}.${endpoint}/${key}`;

  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const res = await aws.fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: bytes,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Fallo al subir a Backblaze: ${errorText}`);
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
    const { solicitudId, pdfBase64 } = body;

    if (!solicitudId || !pdfBase64) {
      throw new Error('Faltan parámetros requeridos');
    }

    const pdfUrl = await uploadToB2(pdfBase64, 'application/pdf', `solicitud-${solicitudId}.pdf`);

    const { data, error } = await supabaseClient
      .from('solicitudes')
      .update({ pdf_url: pdfUrl })
      .eq('id', solicitudId)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, pdfUrl, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
