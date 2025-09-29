export async function downloadFileFromBase64(base64: string, fileName: string) {
  const hasPrefix = base64.startsWith("data:");
  const dataUrl = hasPrefix ? base64 : `data:application/pdf;base64,${base64}`;

  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}