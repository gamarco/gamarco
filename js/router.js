import { initHeroAnimation } from "./animation.js";
import { initContactForm } from "./contact.js";
import { initServicesPage } from "./services.js";
import { initSobrePage } from "./about.js";
import { initVideoGamarco } from "./video.js";
import { initAprendaPage } from "./learn.js";
import { initEventsPage } from "./events.js";
import { initEquipePage } from "./team.js";

const BASE_URL = "https://www.gamarco.com.br";

const routes = {
    "/": "pages/inicio.html",
    "/inicio": "/pages/inicio.html",
    "/gamarco": "/pages/gamarco.html",
    "/equipe": "/pages/equipe.html",
    "/solucoes": "/pages/solucoes.html",
    "/gamarco-plus": "/pages/gamarco-plus.html",
    "/dupla-matricula-aee": "/pages/conteudos/dupla-matricula-aee.html",
    "/fundeb": "/pages/conteudos/fundeb.html",
    "/contato": "/pages/contato.html"
};

const titles = {
    "/": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/inicio": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/gamarco": "Sobre | Gamarco",
    "/equipe": "Equipe | Gamarco",
    "/solucoes": "Soluções em Gestão Educacional | Gamarco",
    "/gamarco-plus": "Gamarco+ | Conheça nossos conteúdos e formações",
    "/contato": "Contato | Gamarco",
    "/dupla-matricula-aee": "Dupla Matrícula no AEE | Gamarco",
    "/fundeb": "Conheça o FUNDEB | Gamarco"
};

const descriptions = {
    "/": "Consultoria educacional para gestão pública municipal, com foco em planejamento estratégico, dados e financiamento da educação.",
    "/inicio": "Consultoria educacional para gestão pública municipal, com foco em planejamento estratégico, dados e financiamento da educação.",
    "/gamarco": "Conheça a Gamarco Educacional, consultoria especializada em gestão pública educacional baseada em evidências.",
    "/equipe": "Conheça a equipe técnica da Gamarco Educacional e sua atuação em gestão, planejamento, dados e políticas educacionais.",
    "/solucoes": "Soluções em consultoria administrativa, financeira, pedagógica, organizacional e formativa para redes municipais de educação.",
    "/gamarco-plus": "Conteúdos técnicos e formações da Gamarco sobre FUNDEB, planejamento educacional, AEE, gestão pública e políticas educacionais.",
    "/contato": "Entre em contato com a Gamarco Educacional para conhecer soluções em consultoria para redes municipais de ensino.",
    "/dupla-matricula-aee": "Entenda sobre a Dupla Matrícula como um direito do estudante com deficiência, matriculado ou não na Educação Especial, que garante os aportes adequados para a melhoria do Custo Aluno-Qualidade (CAQ) no Atendimento Educacional Especializado (AEE).",
    "/fundeb": "Conheça o FUNDEB, critérios de distribuição, impactos na gestão da educação municipal e suas complementações: Conheça sobre o Fundo e suas modalidades de complementação, o Valor Aluno Ano Fundeb (VAAF), o Valor Aluno Ano Total (VAAT) e o Valor Aluno Ano Resultado (VAAR)."
};

function updateLogos(path) {
    const logoMenu = document.querySelector(".logo-img");
    const logoFooter = document.querySelector(".footer-logo");

    const isHome = path === "/" || path === "/inicio";

    if (logoMenu) {
        logoMenu.src = isHome
            ? "/assets/images/logo_light.webp"
            : "/assets/images/logo_dark.webp";
    }

    if (logoFooter) {
        logoFooter.src = "/assets/images/logo_light.webp";
    }
}

function getCanonicalUrl(path) {
    if (path === "/" || path === "/inicio") {
        return `${BASE_URL}/`;
    }

    return `${BASE_URL}${path}`;
}

function updateMetaName(name, content) {
    let tag = document.querySelector(`meta[name="${name}"]`);

    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
}

function updateMetaProperty(property, content) {
    let tag = document.querySelector(`meta[property="${property}"]`);

    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
    }

    tag.setAttribute("content", content);
}

function updateCanonical(url) {
    let canonicalTag = document.querySelector('link[rel="canonical"]');

    if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
    }

    canonicalTag.setAttribute("href", url);
}

function updateSEO(path) {
    const title = titles[path] || "Gamarco | Consultoria Educacional";
    const description = descriptions[path] || "Consultoria educacional para gestão pública municipal baseada em evidências.";
    const canonicalUrl = getCanonicalUrl(path);

    document.title = title;

    updateMetaName("description", description);

    updateCanonical(canonicalUrl);

    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:url", canonicalUrl);
    updateMetaProperty("og:site_name", "Gamarco | Consultoria Educacional para Gestão Pública");
    updateMetaProperty("og:locale", "pt_BR");
}

function getCurrentPath() {
    if (window.location.hash) {
        return window.location.hash.replace("#", "") || "/";
    }

    return window.location.pathname || "/";
}

export function navigateTo(url) {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.pathname;

    history.pushState(null, null, path);
    router();
}

export async function router() {
    let path = getCurrentPath();

    if (!routes[path]) {
        path = "/";
        history.replaceState(null, null, "/");
    }

    const route = routes[path];

    const html = await fetch(route).then(res => res.text());
    document.querySelector("#app").innerHTML = html;

    updateSEO(path);

    const footer = document.querySelector("footer");
    const body = document.body;

    body.classList.remove("home", "internal", "static-page");

    if (path === "/" || path === "/inicio") {
        body.classList.add("home");

        if (footer) footer.style.display = "none";

        initHeroAnimation();
    } else {
        body.classList.add("internal");

        if (footer) footer.style.display = "block";
    }

    updateLogos(path);

    if (path === "/contato") {
        initContactForm();
    }

    if (path === "/solucoes") {
        initServicesPage();
    }

    if (path === "/gamarco") {
        initSobrePage();
        initVideoGamarco();
    }

    if (path === "/equipe") {
        initEquipePage();
    }

    if (path === "/gamarco-plus") {
        initEventsPage();
        initAprendaPage();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}