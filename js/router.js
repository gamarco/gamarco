import { initHeroAnimation } from "./animation.js";
import { initContactForm } from "./contact.js";
import { initServicesPage } from "./services.js";
import { initSobrePage } from "./about.js";
import { initEquipePage } from "./team.js";

const routes = {
    "/": "pages/inicio.html",
    "/inicio": "pages/inicio.html",
    "/gamarco": "pages/gamarco.html",
    "/equipe": "pages/equipe.html",
    "/solucoes": "pages/solucoes.html",
    "/contato": "pages/contato.html"
};

export function navigateTo(url) {
    const path = new URL(url).hash || "#/";
    history.pushState(null, null, path);
    router();
}

export async function router() {
    const path = window.location.hash.replace("#", "") || "/";
    const route = routes[path] || routes["/"];

    const html = await fetch(route).then(res => res.text());
    document.querySelector("#app").innerHTML = html;

    const footer = document.querySelector("footer");

    if (path === "/" || path === "/inicio") {
        document.title = "Gamarco | Consultoria Educacional para Gestão Pública";
        footer.style.display = "none";
        initHeroAnimation();
    } else {
        footer.style.display = "block";
    }

    const body = document.body;

    body.classList.remove("home", "internal");

    if (path === "/" || path === "/inicio") {
        body.classList.add("home");
    } else {
        body.classList.add("internal");
    }

    if (path === "/contato") {
        document.title = "Contato | Gamarco";
        initContactForm();
    }

    if (path === "/solucoes") {
        document.title = "Soluções em Gestão Educacional | Gamarco";
        initServicesPage();
    }

    if (path === "/gamarco") {
        document.title = "Sobre | Gamarco";
        initSobrePage();
    }

    if (path === "/equipe") {
        document.title = "Equipe | Gamarco";
        initEquipePage();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth" 
    });
}