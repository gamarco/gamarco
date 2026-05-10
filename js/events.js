export function initEventsPage() {
    const container = document.getElementById("events-container");
    const filtersContainer = document.getElementById("event-filters");
    const paginationContainer = document.getElementById("events-pagination");

    if (!container || !filtersContainer || !paginationContainer) return;

    let events = [];
    let currentStatus = "Todos";
    let currentCategory = "Todas";
    let currentPage = 1;

    const eventsPerPage = 6;

    fetch("assets/data/eventos_gamarco.json")
        .then(response => response.json())
        .then(data => {
            events = data.sort((a, b) => new Date(b.data) - new Date(a.data));

            if (events.length === 0) {
                container.innerHTML = `<p class="event-empty">Em breve...</p>`;
                filtersContainer.innerHTML = "";
                paginationContainer.innerHTML = "";
                return;
            }

            renderFilters();
            renderEvents();
        })
        .catch(error => {
            console.error("Erro ao carregar eventos:", error);
            container.innerHTML = "<p>Não foi possível carregar os eventos.</p>";
        });

    function renderFilters() {
        const statuses = ["Todos", ...new Set(events.map(event => event.status).filter(Boolean))];
        const categories = ["Todas", ...new Set(events.map(event => event.categoria).filter(Boolean))];

        filtersContainer.innerHTML = `
            <div class="event-filter-list">
                <span class="event-filter-label">Status</span>

                <div class="event-filter-options">
                    ${statuses.map(status => `
                        <button 
                            class="event-filter-btn ${status === currentStatus ? "active" : ""}" 
                            data-filter-type="status"
                            data-filter-value="${status}"
                        >
                            ${status}
                        </button>
                    `).join("")}
                </div>
            </div>

            <div class="event-filter-list">
                <span class="event-filter-label">Categoria</span>

                <div class="event-filter-options">
                    ${categories.map(category => `
                        <button 
                            class="event-filter-btn ${category === currentCategory ? "active" : ""}" 
                            data-filter-type="category"
                            data-filter-value="${category}"
                        >
                            ${category}
                        </button>
                    `).join("")}
                </div>
            </div>
        `;

        filtersContainer.querySelectorAll(".event-filter-btn").forEach(button => {
            button.addEventListener("click", () => {
                const type = button.dataset.filterType;
                const value = button.dataset.filterValue;

                if (type === "status") {
                    currentStatus = value;
                }

                if (type === "category") {
                    currentCategory = value;
                }

                currentPage = 1;

                renderFilters();
                renderEvents();
            });
        });
    }

    function getFilteredEvents() {
        return events.filter(event => {
            const statusMatch = currentStatus === "Todos" || event.status === currentStatus;
            const categoryMatch = currentCategory === "Todas" || event.categoria === currentCategory;

            return statusMatch && categoryMatch;
        });
    }

    function renderEvents() {
        const filteredEvents = getFilteredEvents();

        const start = (currentPage - 1) * eventsPerPage;
        const end = start + eventsPerPage;
        const paginatedEvents = filteredEvents.slice(start, end);

        if (paginatedEvents.length === 0) {
            container.innerHTML = "<p>Nenhum evento encontrado.</p>";
            paginationContainer.innerHTML = "";
            return;
        }

        container.innerHTML = paginatedEvents.map(event => createEventCard(event)).join("");

        renderPagination(filteredEvents.length);
    }

    container.querySelectorAll("[data-copy-link]").forEach(button => {
        button.addEventListener("click", () => {
            const link = button.dataset.copyLink;
            navigator.clipboard.writeText(link);

            button.innerHTML = `<i class="bi bi-check2"></i>`;

            setTimeout(() => {
                button.innerHTML = `<i class="bi bi-link-45deg"></i>`;
            }, 1600);
        });
    });

    function createEventCard(event) {
        const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(event.titulo + " - " + event.link)}`;
        const linkedinLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(event.link)}`;

        return `
            <article class="post-card event-card">
                <img src="${event.imagem}" alt="${event.alt}" loading="lazy">

                <div class="post-card-content">
                    <span class="event-status">${event.status}</span>

                    <h3>${event.titulo}</h3>

                    <p>${event.descricao}</p>

                    <div class="event-meta">
                        <span>${event.categoria}</span>
                        <span>${event.modalidade}</span>
                    </div>

                    <div class="event-actions">
                        <a href="${event.link}" target="_blank" rel="noopener noreferrer" class="event-main-btn">
                            Inscrever-se
                        </a>

                        <a href="${whatsappLink}" target="_blank" rel="noopener noreferrer" class="event-share-btn whatsapp" aria-label="Compartilhar no WhatsApp">
                            <i class="bi bi-whatsapp"></i>
                        </a>

                        <a href="${linkedinLink}" target="_blank" rel="noopener noreferrer" class="event-share-btn linkedin" aria-label="Compartilhar no LinkedIn">
                            <i class="bi bi-linkedin"></i>
                        </a>

                        <button class="event-share-btn copy" data-copy-link="${event.link}" aria-label="Copiar link do evento">
                            <i class="bi bi-link-45deg"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / eventsPerPage);

        if (totalPages <= 1) {
            paginationContainer.innerHTML = "";
            return;
        }

        let buttons = "";

        for (let i = 1; i <= totalPages; i++) {
            buttons += `
                <button class="pagination-btn ${i === currentPage ? "active" : ""}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        paginationContainer.innerHTML = buttons;

        paginationContainer.querySelectorAll(".pagination-btn").forEach(button => {
            button.addEventListener("click", () => {
                currentPage = Number(button.dataset.page);
                renderEvents();
            });
        });
    }
}