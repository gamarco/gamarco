export function initEquipePage() {
    document.querySelectorAll(".btn-curriculo").forEach(btn => {
        btn.addEventListener("click", () => {
            const link = btn.dataset.link;
            window.open(link, "_blank");
        });
    });
}