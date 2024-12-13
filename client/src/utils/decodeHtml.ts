export default function decodeHtml(text?: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text || " ";
  return txt.value;
}
