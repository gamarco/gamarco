const fs = require("fs");

const BASE_URL = "https://www.gamarco.com.br";

const routes = [
    "/",
    "/inicio",
    "/gamarco",
    "/equipe",
    "/solucoes",
    "/aprenda",
    "/contato",
    "/dupla-matricula-aee",
    "/fundeb"
];

const today = new Date().toISOString().split("T")[0];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "/" ? "1.0" : "0.8"}</priority>
  </url>`).join("\n")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap, "utf8");

console.log("sitemap.xml gerado com sucesso!");