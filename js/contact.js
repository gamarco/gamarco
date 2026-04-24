emailjs.init("Vt0QbkAJCWFETCvbW");

let estados = {};
let cidades = [];

async function carregarDados() {
    const response = await fetch("assets/data/cidade_estado_ibge.json");
    const data = await response.json();

    estados = data.states;
    cidades = data.cities;
}

function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", type);
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function criarAutocomplete(input, list, data, onSelect) {
    input.addEventListener("input", () => {
        const valor = input.value.toLowerCase();
        list.innerHTML = "";

        if (!valor) return;

        const filtrados = data
            .filter(item => item.toLowerCase().includes(valor))
            .slice(0, 20);

        filtrados.forEach(item => {
            const div = document.createElement("div");
            div.classList.add("autocomplete-item");
            div.textContent = item;

            div.addEventListener("click", () => {
                input.value = item;
                list.innerHTML = "";
                onSelect(item);
            });

            list.appendChild(div);
        });
    });

    document.addEventListener("click", (e) => {
        if (!input.contains(e.target)) {
            list.innerHTML = "";
        }
    });
}

export async function initContactForm() {
    const estadoInput = document.getElementById("estado");
    const estadoList = document.getElementById("estado-list");

    const cidadeInput = document.getElementById("cidade");
    const cidadeList = document.getElementById("cidade-list");

    const form = document.getElementById("formContato");

    if (!estadoInput || !cidadeInput || !form) return;

    await carregarDados();

    const listaEstados = Object.entries(estados).map(([id, nome]) => ({
        id: parseInt(id),
        nome
    }));

    let estadoSelecionadoId = null;

    criarAutocomplete(
        estadoInput,
        estadoList,
        listaEstados.map(e => e.nome),
        (nomeSelecionado) => {
            const estado = listaEstados.find(e => e.nome === nomeSelecionado);
            estadoSelecionadoId = estado.id;

            cidadeInput.value = "";
            cidadeList.innerHTML = "";
        }
    );

    cidadeInput.addEventListener("input", () => {
        const valor = cidadeInput.value.toLowerCase();
        cidadeList.innerHTML = "";

        if (!valor || !estadoSelecionadoId) return;

        const filtradas = cidades
            .filter(c => c.state_id === estadoSelecionadoId)
            .map(c => c.name)
            .filter(nome => nome.toLowerCase().includes(valor))
            .slice(0, 20);

        filtradas.forEach(nome => {
            const div = document.createElement("div");
            div.classList.add("autocomplete-item");
            div.textContent = nome;

            div.addEventListener("click", () => {
                cidadeInput.value = nome;
                cidadeList.innerHTML = "";
            });

            cidadeList.appendChild(div);
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const empresa = document.getElementById("empresa").value.trim();
        const estado = estadoInput.value.trim();
        const cidade = cidadeInput.value.trim();
        const assuntoInput = document.getElementById("assunto").value.trim();
        const mensagem = document.getElementById("mensagem").value.trim();

        const assunto = assuntoInput || "Contato pelo site";

        if (!nome || !email || !telefone || !empresa || !estado || !cidade || !mensagem) {
            showToast("Preencha todos os campos obrigatórios.", "error");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showToast("E-mail inválido.", "error");
            return;
        }

        if (!/^\d{10,11}$/.test(telefone.replace(/\D/g, ""))) {
            showToast("Telefone inválido.", "error");
            return;
        }

        const button = form.querySelector("button");
        button.textContent = "Enviando...";
        button.classList.add("loading");
        button.disabled = true;

        emailjs.send("service_xnm8pvs", "template_65qsir4", {
            nome,
            email,
            telefone,
            empresa,
            estado,
            cidade,
            assunto,
            mensagem
        })
        .then(() => {
            showToast("Mensagem enviada com sucesso!", "success");

            form.reset();
            cidadeList.innerHTML = "";
            estadoList.innerHTML = "";
        })
        .catch((error) => {
            console.error("Erro:", error);
            showToast("Erro ao enviar. Tente novamente.", "error");
        })
        .finally(() => {
            button.textContent = "Enviar";
            button.classList.remove("loading");
            button.disabled = false;
        });
    });
}