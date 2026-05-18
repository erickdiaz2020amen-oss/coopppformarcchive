import { AwsClient } from 'aws4fetch';

const aws = new AwsClient({
  accessKeyId: import.meta.env.VITE_BACKBLAZE_KEY_ID || import.meta.env.BACKBLAZE_KEY_ID || '00576daad65b0f30000000001',
  secretAccessKey: import.meta.env.VITE_BACKBLAZE_APP_KEY || import.meta.env.BACKBLAZE_APP_KEY || 'K005/U/val4RsxoeunxbDA7kSCX8F2k',
  service: "s3",
  region: "us-east-005"
});

export const getSignedUrl = async (url: string) => {
  if (!url) return null;
  const signedReq = await aws.sign(url, {
    method: 'GET',
    aws: { signQuery: true }
  });
  
  // Rewrite the URL to use our Vite proxy to bypass CORS
  // Use absolute URL because @react-pdf/renderer might need it
  const parsed = new URL(signedReq.url);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/api/b2${parsed.pathname}${parsed.search}`;
};
