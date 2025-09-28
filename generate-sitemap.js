// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap"
import { createWriteStream } from "fs"

// URL de base de ton site
const BASE_URL = "https://ecoride-mobility.netlify.app"

// Liste des routes à inclure dans le sitemap
const routes = [
  { url: "/", changefreq: "weekly", priority: 1.0 },
  { url: "/a-propos", changefreq: "monthly", priority: 0.8 },
  { url: "/contact", changefreq: "monthly", priority: 0.5 },
  // Ajoute ici toutes tes autres pages
]

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: BASE_URL })
  const writeStream = createWriteStream("./public/sitemap.xml")

  // Ajouter chaque page au sitemap
  routes.forEach((page) => sitemap.write(page))

  sitemap.end()

  // Génération du fichier
  await streamToPromise(sitemap)
    .then(() => console.info("✅ Sitemap généré avec succès !"))
    .catch((err) => console.error("❌ Erreur sitemap :", err))

  sitemap.pipe(writeStream)
}

// Lancer le script
generateSitemap()
