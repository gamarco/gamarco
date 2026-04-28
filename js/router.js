import { initHeroAnimation } from "./animation.js";
import { initContactForm } from "./contact.js";
import { initServicesPage } from "./services.js";
import { initSobrePage } from "./about.js";
import { initAprendaPage } from "./learn.js";
import { initEquipePage } from "./team.js";

const routes = {
    "/": "pages/inicio.html",
    "/inicio": "pages/inicio.html",
    "/gamarco": "pages/gamarco.html",
    "/equipe": "pages/equipe.html",
    "/solucoes": "pages/solucoes.html",
    "/aprenda": "pages/aprenda.html",
    // "/censo-e-financiamento": "pages/conteudos/censo-e-financiamento.html",
    // "/dados-e-indicadores-educacionais": "pages/conteudos/dados-e-indicadores-educacionais.html",
    "/dupla-matricula-aee": "pages/conteudos/dupla-matricula-aee.html",
    // "/ensino-religioso-e-formacao-profissional": "pages/conteudos/ensino-religioso-e-formacao-profissional.html",
    // "/eti-e-aee": "pages/conteudos/eti-e-aee.html",
    // "/ferramentas-e-sistemas-de-gestao": "pages/conteudos/ferramentas-e-sistemas-de-gestao.html",
    // "/formacao-profissional-para-resultados": "pages/conteudos/formacao-profissional-para-resultados.html",
    "/fundeb": "pages/conteudos/fundeb.html",
    // "/gestao-administrativa-financeira": "pages/conteudos/gestao-administrativa-financeira.html",
    // "/metas-indicadores-e-acoes-estrategicas": "pages/conteudos/metas-indicadores-e-acoes-estrategicas.html",
    // "/metodologias-para-transformar-a-gestao": "pages/conteudos/metodologias-para-transformar-a-gestao.html",
    // "/novo-par": "pages/conteudos/novo-par.html",
    "/contato": "pages/contato.html"
};

const titles = {
    "/": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/inicio": "Gamarco | Consultoria Educacional para Gestão Pública",
    "/gamarco": "Sobre | Gamarco",
    "/equipe": "Equipe | Gamarco",
    "/solucoes": "Soluções em Gestão Educacional | Gamarco",
    "/aprenda": "Conteúdos | Gamarco",
    "/contato": "Contato | Gamarco",
    "/censo-e-financiamento": "Censo Escolar e Financiamento Educacional | Gamarco",
    "/dados-e-indicadores-educacionais": "Dados e Indicadores Educacionais | Gamarco",
    "/dupla-matricula-aee": "Dupla Matrícula no AEE | Gamarco",
    "/ensino-religioso-e-formacao-profissional": "Ensino Religioso e Formação Profissional | Gamarco",
    "/eti-e-aee": "Educação em Tempo Integral e AEE | Gamarco",
    "/ferramentas-e-sistemas-de-gestao": "Ferramentas e Sistemas de Gestão | Gamarco",
    "/formacao-profissional-para-resultados": "Formação Profissional para Resultados | Gamarco",
    "/fundeb": "Conheça o FUNDEB | Gamarco",
    "/gestao-administrativa-financeira": "Gestão Administrativa e Financeira | Gamarco",
    "/metas-indicadores-e-acoes-estrategicas": "Metas, Indicadores e Ações Estratégicas | Gamarco",
    "/metodologias-para-transformar-a-gestao": "Metodologias para Transformar a Gestão | Gamarco",
    "/novo-par": "Novo PAR | Gamarco"
};

function getCurrentPath() {
    if (window.location.hash) {
        return window.location.hash.replace("#", "") || "/";
    }

    return window.location.pathname || "/";
}

export function navigateTo(url) {
    const parsedUrl = new URL(url, window.location.origin);
    const path = parsedUrl.hash
        ? parsedUrl.hash.replace("#", "")
        : parsedUrl.pathname;

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

    document.title = titles[path] || "Gamarco | Consultoria Educacional";

    const footer = document.querySelector("footer");
    const body = document.body;

    body.classList.remove("home", "internal");

    if (path === "/" || path === "/inicio") {
        body.classList.add("home");

        if (footer) footer.style.display = "none";

        initHeroAnimation();
    } else {
        body.classList.add("internal");

        if (footer) footer.style.display = "block";
    }

    if (path === "/contato") {
        initContactForm();
    }

    if (path === "/solucoes") {
        initServicesPage();
    }

    if (path === "/gamarco") {
        initSobrePage();
    }

    if (path === "/equipe") {
        initEquipePage();
    }

    if (path === "/aprenda") {
        initAprendaPage();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}