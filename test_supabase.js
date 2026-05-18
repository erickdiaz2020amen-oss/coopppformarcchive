import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcajcnprlvbnqelamqnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWpjbnBybHZibnFlbGFtcW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDI4NTIsImV4cCI6MjA5NDY3ODg1Mn0.pFQ4lhjOYwyZbJnBdMs1Sp_6JyafH7dlZjF6oW4Jlpg';
const supabaseSecretKey = 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('solicitudes').select('*');
  console.log('Anon:', data, error);

  try {
    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey);
    const { data: data2, error: err2 } = await supabaseAdmin.from('solicitudes').select('*');
    console.log('Admin:', data2, err2);
  } catch (e) {
    console.log('Admin Error:', e.message);
  }
}

test();
