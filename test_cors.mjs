import fetch from 'node-fetch'; // if not available, we will use builtin

async function test() {
  const url = 'https://lcajcnprlvbnqelamqnj.supabase.co/rest/v1/solicitudes?select=*';
  const token = 'sb_secret_DQsWdev6KYsnSdTbEGK1xw_cJOkkgqk';
  
  const res = await fetch(url, {
    headers: {
      'apikey': token,
      'Authorization': `Bearer ${token}`,
      'Origin': 'http://localhost:5173'
    }
  });

  const text = await res.text();
  console.log(res.status, text);
}

test();
