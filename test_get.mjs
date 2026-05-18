async function test() {
  const res = await fetch('https://coopmaza-documentos.s3.us-east-005.backblazeb2.com/solicitudes/test-upload.txt');
  console.log(res.status);
  console.log(await res.text());
}
test();
