import { AwsClient } from 'aws4fetch';
import crypto from 'crypto';

const aws = new AwsClient({
  accessKeyId: '00576daad65b0f30000000001',
  secretAccessKey: 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

const corsConfiguration = `<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
        <ExposeHeader>ETag</ExposeHeader>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
    </CORSRule>
</CORSConfiguration>`;

const md5 = crypto.createHash('md5').update(corsConfiguration).digest('base64');

const res = await aws.fetch('https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/?cors', {
  method: 'PUT',
  body: corsConfiguration,
  headers: {
    'Content-Type': 'application/xml',
    'Content-MD5': md5
  }
});

console.log(res.status);
console.log(await res.text());
