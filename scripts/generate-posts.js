const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const inputDir = path.join(__dirname, "..", "conteudos-md");
const partialOutputDir = path.join(__dirname, "..", "pages", "conteudos");
const templatesDir = path.join(__dirname, "..", "templates");

const headTemplate = fs.readFileSync(path.join(templatesDir, "head.html"), "utf8");
const headerTemplate = fs.readFileSync(path.join(templatesDir, "header.html"), "utf8");
const footerTemplate = fs.readFileSync(path.join(templatesDir, "footer.html"), "utf8");
const pageTemplate = fs.readFileSync(path.join(templatesDir, "page.html"), "utf8");

if (!fs.existsSync(partialOutputDir)) {
    fs.mkdirSync(partialOutputDir, { recursive: true });
}

function escapeHtml(text = "") {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function replaceTemplate(template, values) {
    let output = template;

    Object.entries(values).forEach(([key, value]) => {
        output = output.replaceAll(`{{${key}}}`, value ?? "");
    });

    return output;
}

function normalizeRootPath(value) {
    if (!value) return "";
    if (value.startsWith("http")) return value;
    if (value.startsWith("/")) return value;
    return "/" + value;
}

function renderVideoBlock(block) {
    const youtubeMatch = block.match(/youtube:\s*(.+)/);
    const citacaoMatch = block.match(/citacao:\s*["“]?(.+?)["”]?\s*$/m);

    const youtubeId = youtubeMatch ? youtubeMatch[1].trim() : "";
    const citacao = citacaoMatch ? citacaoMatch[1].trim() : "";

    return `
<div class="artigo-video-bloco">
    <div class="video-frame">
        <iframe 
            src="https://www.youtube.com/embed/${youtubeId}"
            title="Vídeo relacionado ao conteúdo"
            allowfullscreen>
        </iframe>
    </div>

    <blockquote>${citacao}</blockquote>
</div>`;
}

function extractVideoBlocks(content) {
    const videos = [];

    const newContent = content.replace(/::video([\s\S]*?)::/g, (_, block) => {
        const index = videos.length;
        videos.push(renderVideoBlock(block));
        return `\n\n@@VIDEO_${index}@@\n\n`;
    });

    return { content: newContent, videos };
}

function processCustomInline(content) {
    content = content.replace(/<mark>(.*?)<\/mark>/g, '<span class="artigo-mark">$1</span>');
    content = content.replace(/<quote>(.*?)<\/quote>/g, '<span class="artigo-quote">$1</span>');

    content = content.replace(/<ref>([\s\S]*?)<\/ref>/g, (_, ref) => {
        return `<p class="artigo-reference">${marked.parseInline(ref.trim())}</p>`;
    });

    return content;
}

function restoreVideoBlocks(html, videos) {
    videos.forEach((videoHtml, index) => {
        html = html.replace(`<p>@@VIDEO_${index}@@</p>`, videoHtml);
        html = html.replace(`@@VIDEO_${index}@@`, videoHtml);
    });

    return html;
}

function buildArticlePartial(data, bodyHtml) {
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return `<section id="${data.slug}" class="section artigo-section">

    <article class="artigo-container">

        <div class="artigo-header">
            <span class="artigo-categoria">${data.categoria}</span>
            <h1>${data.titulo}</h1>
            <p class="artigo-subtitulo">${data.subtitulo}</p>

            <div class="artigo-meta">
                <span>Por ${data.autor}</span>
                <span>Publicado em ${data.data}</span>
                <span>Leitura: ${data.leitura}</span>
            </div>
        </div>

        <img class="artigo-capa" src="${data.capa}" alt="${data.alt || data.titulo}">

        <div class="artigo-content">
            ${bodyHtml}
        </div>

        <div class="artigo-tags">
            ${tags.map(tag => `<span>${tag}</span>`).join("\n            ")}
        </div>

        <div class="artigo-cta">
            <h3>${data.cta_titulo || "Quer saber mais?"}</h3>
            <p>${data.cta_texto || "A Gamarco atua com consultoria educacional formativa para apoiar gestores públicos municipais."}</p>
            <a href="${data.cta_link || "/contato"}" data-link>${data.cta_botao || "Fale com a Gamarco"}</a>
        </div>

    </article>

</section>`;
}

function buildHead(data) {
    const description = escapeHtml(data.subtitulo || "Conteúdo técnico da Gamarco Educacional.");
    const image = normalizeRootPath(data.capa);
    const url = `https://www.gamarco.com.br/${data.slug}`;

    return replaceTemplate(headTemplate, {
        title: `${escapeHtml(data.titulo)} | Gamarco`,
        description,
        canonical: url,
        og_title: escapeHtml(data.titulo),
        og_description: description,
        og_image: `https://www.gamarco.com.br${image}`,
        og_url: url,
        og_type: "article"
    });
}

function buildFullPage(data, partialHtml) {
    const head = buildHead(data);

    return replaceTemplate(pageTemplate, {
        head,
        header: headerTemplate,
        content: partialHtml,
        footer: footerTemplate
    });
}

const files = fs.readdirSync(inputDir).filter(file => file.endsWith(".md"));

files.forEach(file => {
    const filePath = path.join(inputDir, file);
    const raw = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(raw);

    if (!data.slug) {
        console.warn(`Arquivo ignorado sem slug: ${file}`);
        return;
    }

    const { content: contentWithPlaceholders, videos } = extractVideoBlocks(content);
    const processedContent = processCustomInline(contentWithPlaceholders);

    let bodyHtml = marked(processedContent);
    bodyHtml = restoreVideoBlocks(bodyHtml, videos);

    const partialHtml = buildArticlePartial(data, bodyHtml);

    const partialOutputPath = path.join(partialOutputDir, `${data.slug}.html`);
    fs.writeFileSync(partialOutputPath, partialHtml, "utf8");

    const realPageDir = path.join(__dirname, "..", data.slug);

    if (!fs.existsSync(realPageDir)) {
        fs.mkdirSync(realPageDir, { recursive: true });
    }

    const fullHtml = buildFullPage(data, partialHtml);
    const realOutputPath = path.join(realPageDir, "index.html");

    fs.writeFileSync(realOutputPath, fullHtml, "utf8");

    console.log(`Gerado: pages/conteudos/${data.slug}.html`);
    console.log(`Gerado: ${data.slug}/index.html`);
});