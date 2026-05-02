export async function initServicesPage() {
    const container = document.getElementById("services-container");
    const filtersContainer = document.getElementById("service-filters");

    if (!container || !filtersContainer) return;

    const response = await fetch("assets/data/servicos_gamarco.json");
    const categorias = await response.json();

    let categoriaAtiva = "Todos";

    const filtros = [
        "Todos",
        ...categorias.map(categoria => categoria.categoria_filtro)
    ];

    function renderFilters() {
        filtersContainer.innerHTML = "";

        filtros.forEach(filtro => {
            const button = document.createElement("button");
            button.classList.add("post-filter-btn");
            button.textContent = filtro;

            if (filtro === categoriaAtiva) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                categoriaAtiva = filtro;
                renderFilters();
                renderServices();
            });

            filtersContainer.appendChild(button);
        });
    }

    function renderServices() {
        container.innerHTML = "";

        const categoriasFiltradas = categoriaAtiva === "Todos"
            ? categorias
            : categorias.filter(categoria => categoria.categoria_filtro === categoriaAtiva);

        categoriasFiltradas.forEach(categoria => {
            const section = document.createElement("div");
            section.classList.add("service-category");

            section.innerHTML = `
                <div class="service-category-header">
                    <h3>${categoria.categoria_completa}</h3>
                    <p>${categoria.descricao || ""}</p>
                </div>

                <div class="service-grid">
                    ${categoria.servicos.map(servico => `
                        <article class="service-card">

                            <div class="service-card-image">
                                <img src="${servico.imagem}" title="${servico.titulo}" alt="${servico.titulo}" loading="lazy" decoding="async" fetchpriority="high">
                            </div>

                            <div class="service-card-content">
                                <h4>${servico.titulo}</h4>

                                <p class="service-text">
                                    ${servico.descricao}
                                </p>

                                ${servico.conteudo ? `
                                    <a href="${servico.conteudo.link}" data-link class="service-content-link">
                                        ${servico.conteudo.texto}
                                    </a>
                                ` : ""}

                            </div>

                        </article>
                    `).join("")}
                </div>
            `;

            container.appendChild(section);
        });

        initServiceCards();
    }

    function initServiceCards() {
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

        document.querySelectorAll(".service-content-link").forEach(link => {
            link.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        });
    }

    renderFilters();
    renderServices();
}