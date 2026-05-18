import { AwsClient } from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: '00576daad65b0f30000000001',
  secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

async function testProxy() {
  const url = 'https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/solicitudes/test-upload.txt';
  const signedReq = await aws.sign(url, {
    method: 'GET',
    aws: { signQuery: true }
  });
  
  const parsed = new URL(signedReq.url);
  const proxyUrl = `http://localhost:5173/api/b2${parsed.pathname}${parsed.search}`;
  
  console.log("Fetching from proxy:", proxyUrl);
  const res = await fetch(proxyUrl);
  console.log(res.status);
  console.log(await res.text());
}

testProxy();
