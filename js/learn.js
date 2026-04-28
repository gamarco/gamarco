export async function initAprendaPage() {
    const postsContainer = document.getElementById("posts-container");
    const filtersContainer = document.getElementById("post-filters");

    if (!postsContainer || !filtersContainer) return;

    let paginationContainer = document.getElementById("post-pagination");

    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "post-pagination";
        paginationContainer.classList.add("post-pagination");
        postsContainer.after(paginationContainer);
    }

    const response = await fetch("assets/data/conteudos_gamarco.json");
    const posts = await response.json();

    let categoriaAtiva = "Todos";
    let paginaAtual = 1;
    const postsPorPagina = 4;

    const categorias = [
        "Todos",
        ...new Set(posts.map(post => post.categoria).filter(Boolean))
    ];

    function getPostsFiltrados() {
        return categoriaAtiva === "Todos"
            ? posts
            : posts.filter(post => post.categoria === categoriaAtiva);
    }

    function renderFilters() {
        filtersContainer.innerHTML = "";

        categorias.forEach(categoria => {
            const button = document.createElement("button");
            button.classList.add("post-filter-btn");
            button.textContent = categoria;

            if (categoria === categoriaAtiva) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                categoriaAtiva = categoria;
                paginaAtual = 1;
                renderFilters();
                renderPosts();
                renderPagination();
            });

            filtersContainer.appendChild(button);
        });
    }

    function renderPosts() {
        postsContainer.innerHTML = "";

        const postsFiltrados = getPostsFiltrados();
        const inicio = (paginaAtual - 1) * postsPorPagina;
        const fim = inicio + postsPorPagina;
        const postsPagina = postsFiltrados.slice(inicio, fim);

        postsPagina.forEach(post => {
            const article = document.createElement("article");
            article.classList.add("post-card");

            article.innerHTML = `
                <img src="${post.imagem}" alt="${post.alt || post.titulo}">

                <div class="post-card-content">
                    <span>${post.categoria}</span>
                    <h3>${post.titulo}</h3>
                    <p>${post.subtitulo}</p>
                    <a href="${post.link}" data-link>Ler conteúdo</a>
                </div>
            `;

            postsContainer.appendChild(article);
        });
    }

    function renderPagination() {
        paginationContainer.innerHTML = "";

        const postsFiltrados = getPostsFiltrados();
        const totalPaginas = Math.ceil(postsFiltrados.length / postsPorPagina);

        if (totalPaginas <= 1) return;

        const criarBotao = (html, acao, disabled = false, active = false) => {
            const button = document.createElement("button");
            button.classList.add("pagination-btn");

            if (active) button.classList.add("active");
            if (disabled) button.disabled = true;

            button.innerHTML = html;

            button.addEventListener("click", () => {
                if (disabled) return;

                acao();
                renderPosts();
                renderPagination();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

            paginationContainer.appendChild(button);
        };

        criarBotao(
            `<i class="bi bi-chevron-double-left"></i>`,
            () => paginaAtual = 1,
            paginaAtual === 1
        );

        criarBotao(
            `<i class="bi bi-chevron-left"></i>`,
            () => paginaAtual--,
            paginaAtual === 1
        );

        for (let i = 1; i <= totalPaginas; i++) {
            criarBotao(
                i,
                () => paginaAtual = i,
                false,
                paginaAtual === i
            );
        }

        criarBotao(
            `<i class="bi bi-chevron-right"></i>`,
            () => paginaAtual++,
            paginaAtual === totalPaginas
        );

        criarBotao(
            `<i class="bi bi-chevron-double-right"></i>`,
            () => paginaAtual = totalPaginas,
            paginaAtual === totalPaginas
        );
    }

    renderFilters();
    renderPosts();
    renderPagination();
}