export function initSobrePage() {
    initPrincipiosSlider();
    initToggleText();
}

function initToggleText() {
    document.querySelectorAll(".toggle-text").forEach(button => {
        const card = button.closest(".sobre-card");
        const text = card.querySelector(".sobre-text");

        text.style.maxHeight = "4.6em";

        button.addEventListener("click", () => {
            const isExpanded = card.classList.contains("expanded");

            if (!isExpanded) {
                text.style.maxHeight = text.scrollHeight + "px";
            } else {
                text.style.maxHeight = "4.6em";
            }

            card.classList.toggle("expanded");
            button.textContent = isExpanded ? "Ler mais" : "Ler menos";
        });
    });
}

function initPrincipiosSlider() {
    const card = document.getElementById("principio-card");
    const count = document.getElementById("principio-count");
    const title = document.getElementById("principio-title");
    const text = document.getElementById("principio-text");
    const prev = document.getElementById("principio-prev");
    const next = document.getElementById("principio-next");

    if (!card || !count || !title || !text || !prev || !next) return;

    const principios = [
        {
            titulo: "Qualidade educacional",
            texto: "Compromisso com a qualidade da educação pública municipal."
        },
        {
            titulo: "Valorização profissional",
            texto: "Valorização e desenvolvimento de gestores e de profissionais da educação."
        },
        {
            titulo: "Transparência e responsabilidade",
            texto: "Trabalho pautado pela clareza, pela responsabilidade técnica e pelo compromisso com a gestão pública."
        },
        {
            titulo: "Gestão democrática",
            texto: "Defesa da gestão democrática do ensino público e da participação qualificada nas diversas instâncias."
        },
        {
            titulo: "Resultados concretos",
            texto: "Foco em resultados educacionais mensuráveis, consistentes e socialmente relevantes."
        },
        {
            titulo: "Rigor técnico-metodológico",
            texto: "Trabalho documentado baseado em evidências, em dados educacionais e em metodologia científica."
        }
    ];

    let index = 0;

    function renderPrincipio() {
        card.style.opacity = "0";

        setTimeout(() => {
            count.textContent = String(index + 1).padStart(2, "0");
            title.textContent = principios[index].titulo;
            text.textContent = principios[index].texto;

            card.style.opacity = "1";
        }, 180);
    }

    next.addEventListener("click", () => {
        index = (index + 1) % principios.length;
        renderPrincipio();
    });

    prev.addEventListener("click", () => {
        index = (index - 1 + principios.length) % principios.length;
        renderPrincipio();
    });

    setInterval(() => {
        index = (index + 1) % principios.length;
        renderPrincipio();
    }, 6000);
}