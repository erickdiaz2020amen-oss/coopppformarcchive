import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcajcnprlvbnqelamqnj.supabase.co';
const supabaseKey = 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Fetching solicitudes...");
  const { data, error } = await supabase.from('solicitudes').select('*');
  console.log("Data count:", data?.length);
  console.log("Data:", data);
  console.log("Error:", error);
}

check();
