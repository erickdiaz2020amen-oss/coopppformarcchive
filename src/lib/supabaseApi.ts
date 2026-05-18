// Direct REST API helper for Supabase admin operations
// Uses the secret key which bypasses RLS policies

const SUPABASE_URL = 'https://lcajcnprlvbnqelamqnj.supabase.co';
const SECRET_KEY = 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk';

const adminHeaders = {
  'apikey': SECRET_KEY,
  'Authorization': `Bearer ${SECRET_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

export const supabaseApi = {
  async select(table: string, query: string = '*', filters: string = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${query}${filters ? '&' + filters : ''}`;
    const res = await fetch(url, { headers: adminHeaders });
    if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
    return res.json();
  },

  async selectSingle(table: string, query: string = '*', filters: string = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${query}&${filters}`;
    const res = await fetch(url, {
      headers: { ...adminHeaders, 'Accept': 'application/vnd.pgrst.object+json' },
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
    return res.json();
  },

  async update(table: string, filters: string, data: Record<string, any>) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filters}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
    return res.json();
  },

  async remove(table: string, filters: string) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filters}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: adminHeaders,
    });
    if (!res.ok) throw new Error(`Supabase error: ${res.status} ${await res.text()}`);
    return true;
  },
};
