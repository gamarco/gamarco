document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".accordion button").forEach(button => {
        button.addEventListener("click", () => {

            const panel = button.nextElementSibling;
            document.querySelectorAll(".accordion .panel").forEach(p => {
                if (p !== panel) {
                    p.style.maxHeight = null;
                }
            });
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }

        });
    });
    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }
});
