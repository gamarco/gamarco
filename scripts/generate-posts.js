const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const inputDir = path.join(__dirname, "..", "conteudos-md");
const outputDir = path.join(__dirname, "..", "pages", "conteudos");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
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

    <blockquote>
        ${citacao}
    </blockquote>
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
        return `<p class="artigo-reference" style="text-decoration: none; color: #0f1147">${marked.parseInline(ref.trim())}</p>`;
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

function buildArticleHtml(data, bodyHtml) {
    const tags = Array.isArray(data.tags) ? data.tags : [];

    return `<section id="${data.slug}" class="section artigo-section">

    <article class="artigo-container">

        <div class="artigo-header">
            <span class="artigo-categoria">${data.categoria}</span>
            <h1>${data.titulo}</h1>
            <p class="artigo-subtitulo">
                ${data.subtitulo}
            </p>
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

    const finalHtml = buildArticleHtml(data, bodyHtml);

    const outputPath = path.join(outputDir, `${data.slug}.html`);

    fs.writeFileSync(outputPath, finalHtml, "utf8");

    console.log(`Gerado: pages/conteudos/${data.slug}.html`);
});