async function testProxy() {
  const res = await fetch('http://localhost:5173/api/b2/solicitudes/test-upload.txt');
  console.log(res.status);
}
testProxy();
