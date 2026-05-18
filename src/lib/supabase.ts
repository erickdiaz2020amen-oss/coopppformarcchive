import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lcajcnprlvbnqelamqnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYWpjbnBybHZibnFlbGFtcW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMDI4NTIsImV4cCI6MjA5NDY3ODg1Mn0.pFQ4lhjOYwyZbJnBdMs1Sp_6JyafH7dlZjF6oW4Jlpg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Faltan las credenciales de Supabase en el archivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
