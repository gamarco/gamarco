export async function initServicesPage() {
    const container = document.getElementById("services-container");
    if (!container) return;

    const response = await fetch("assets/data/servicos_gamarco.json");
    const categorias = await response.json();

    container.innerHTML = "";

    categorias.forEach(categoria => {
        const section = document.createElement("div");
        section.classList.add("service-category");

        section.innerHTML = `
            <div class="service-category-header">
                <h3>${categoria.categoria}</h3>
                <p>${categoria.descricao || ""}</p>
            </div>

            <div class="service-grid">
                ${categoria.servicos.map(servico => `
                    <article class="service-card">
                        <div class="service-card-image">
                            <img src="${servico.imagem}" alt="${servico.titulo}">
                        </div>

                        <div class="service-card-content">
                            <h4>${servico.titulo}</h4>

                            <p class="service-text">
                                ${servico.descricao}
                            </p>
                        </div>
                    </article>
                `).join("")}
            </div>
        `;

        container.appendChild(section);
    });

    document.querySelectorAll(".service-card").forEach(card => {
        card.addEventListener("click", () => {
            const isActive = card.classList.contains("active");

            document.querySelectorAll(".service-card").forEach(c => {
                c.classList.remove("active");
            });

            if (!isActive) {
                card.classList.add("active");
            }
        });
    });
}