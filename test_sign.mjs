import { AwsClient } from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: '00576daad65b0f30000000001',
  secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

async function testSign() {
  const url = 'https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/solicitudes/test-upload.txt';
  
  // Create a presigned URL valid for 1 hour (3600 seconds)
  const signedReq = await aws.sign(url, {
    method: 'GET',
    aws: { signQuery: true }
  });
  
  console.log("Signed URL:", signedReq.url);
  
  const res = await fetch(signedReq.url);
  console.log("Fetch status:", res.status);
  console.log("Fetch body:", await res.text());
}

testSign();
