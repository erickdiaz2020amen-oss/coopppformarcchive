import { AwsClient } from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: '00576daad65b0f30000000001',
  secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

const bucket = 'coopmaza-documentos';
const endpoint = 's3.us-east-005.backblazeb2.com';
const key = `solicitudes/test-upload.txt`;
const url = `https://${bucket}.${endpoint}/${key}`;

const body = new TextEncoder().encode("Hello Backblaze");

async function test() {
  console.log("Testing upload to", url);
  const res = await aws.fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain' },
    body: body,
  });
  
  if (!res.ok) {
    console.error("Failed:", res.status, await res.text());
  } else {
    console.log("Success! Uploaded.");
  }
}

test();
