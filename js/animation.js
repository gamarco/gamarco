const frases = [
    {
        titulo: "Gestão educacional baseada em evidências",
        texto: "Soluções estratégicas para resultados reais, consistentes e socialmente relevantes"
    },
    {
        titulo: "Transparência e responsabilidade",
        texto: "Trabalho pautado pela clareza, responsabilidade técnica e compromisso"
    },
    {
        titulo: "Aprendizagem, desenvolvimento e equidade",
        texto: "Resultados com foco no desenvolvimento das aprendizagens dos estudante"
    }
];

let index = 0;
let interval = null;

export function initHeroAnimation() {
    const title = document.getElementById("hero-title");
    const subtitle = document.getElementById("hero-subtitle");

    if (!title || !subtitle) return;

    if (interval) clearInterval(interval);

    function trocarTexto() {
        title.classList.remove("show");
        subtitle.classList.remove("show");

        setTimeout(() => {
            title.textContent = frases[index].titulo;
            subtitle.textContent = frases[index].texto;

            title.classList.add("show");
            subtitle.classList.add("show");

            index = (index + 1) % frases.length;
        }, 700);
    }

    trocarTexto();
    interval = setInterval(trocarTexto, 7000);
}