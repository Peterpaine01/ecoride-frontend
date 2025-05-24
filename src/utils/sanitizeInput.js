export function sanitizeText(input) {
  if (typeof input !== "string") return ""

  return input
    .replace(/<[^>]*>?/gm, "") // supprime les balises HTML
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // supprime les caractères invisibles
    .replace(/\s{2,}/g, " ") // remplace les doubles espaces par un seul
}
