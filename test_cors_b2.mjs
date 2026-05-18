import { AwsClient } from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: '00576daad65b0f30000000001',
  secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

async function testSign() {
  const url = 'https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/solicitudes/test-upload.txt';
  
  const signedReq = await aws.sign(url, {
    method: 'GET',
    aws: { signQuery: true }
  });
  
  const res = await fetch(signedReq.url, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'GET'
    }
  });
  console.log("OPTIONS status:", res.status);
  console.log("CORS Headers:", res.headers.get('Access-Control-Allow-Origin'));
}

testSign();
