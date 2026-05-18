async function testProxy() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
    'Origin': 'http://localhost:5173',
    'Referer': 'http://localhost:5173/admin',
    'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
  };

  const res = await fetch('http://localhost:5173/api/supabase/rest/v1/solicitudes?select=*', {
    headers
  });
  
  if (!res.ok) {
    console.error('Failed:', res.status, await res.text());
  } else {
    console.log('Success!', await res.json());
  }
}

testProxy();
