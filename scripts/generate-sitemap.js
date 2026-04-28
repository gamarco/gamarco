const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BASE_URL = "https://www.gamarco.com.br";

const fixedRoutes = [
    "/",
    "/inicio",
    "/gamarco",
    "/equipe",
    "/solucoes",
    "/aprenda",
    "/contato"
];

const mdDir = path.join(__dirname, "..", "conteudos-md");

const contentRoutes = fs
    .readdirSync(mdDir)
    .filter(file => file.endsWith(".md"))
    .map(file => {
        const raw = fs.readFileSync(path.join(mdDir, file), "utf8");
        const { data } = matter(raw);
        return data.slug ? `/${data.slug}` : null;
    })
    .filter(Boolean);

const routes = [...fixedRoutes, ...contentRoutes];

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