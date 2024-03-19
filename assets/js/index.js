const apiKey = window.env.API_TOKEN; // Chave da API no config.js
const sem_capa = "assets/img/SEM_CAPA.png";
let startIndex = 0; // Começando a busca em 0
let loading = false; // Carregando livros
let lastQuery = "Sherlock Holmes"; // Última busca do usuário

const pageSize = 15; // Total de livros por páginas
let totalItems = 0; // Quantidade total de livros
let totalPages = 0; // Número total de páginas
let currentPage = 1; // Página tual

async function carregarLivros(startIndex, query) {
  mostrarCarregando();

  try {
    const maxResults = 15;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erro ao carregar os livros.");
    }

    const data = await response.json();
    esconderCarregando();

    totalItems = data.totalItems; // Atualiza a quantidade total de livros
    totalPages = Math.ceil(totalItems / pageSize); // Calcula o número total de páginas
    document.getElementById("total-paginas").textContent = totalPages; // Atualiza o número total de páginas na página

    for (let i = 0; i < data.items.length; i++) {
      const livro = data.items[i];
      const imgCapa = livro.volumeInfo.imageLinks?.thumbnail || sem_capa;
      const livroElement = criarLivroElemento(livro, imgCapa);

      document.getElementById("livros").appendChild(livroElement);
    }
  } catch (error) {
    console.error(error);
  }
}

function criarLivroElemento(livro, imgCapa) {
  const livroElement = document.createElement("div");
  livroElement.classList.add(
    "livro",
    "col-md-4",
    "text-center",
    "border-bottom",
    "p-2"
  );

  const titulo = document.createElement("p");
  titulo.textContent = livro.volumeInfo.title;
  titulo.classList.add("text-light", "titulo-livro");

  const img = document.createElement("img");
  img.src = imgCapa;
  img.classList.add("capa-livro");

  const botao = document.createElement("button");
  botao.textContent = "Ver mais";
  botao.classList.add("btn", "btn-primary", "btn-sm", "mt-3");
  botao.addEventListener("click", () =>
    mostrarDetalhes(livro.volumeInfo, imgCapa)
  );

  livroElement.appendChild(titulo);
  livroElement.appendChild(img);
  livroElement.appendChild(document.createElement("br"));
  livroElement.appendChild(botao);

  return livroElement;
}

function mostrarDetalhes(volumeInfo, imgCapa) {
  const zoomed = document.querySelector(".zoomed");
  zoomed.querySelector("img").src = imgCapa;
  zoomed.querySelector("h3").textContent = volumeInfo.title;

  const linguas = {
    "pt-BR": "Português Brasileiro",
    pt: "Português Portugal",
    en: "Inglês",
    es: "Espanhol",
    fr: "Francês",
    de: "Alemão",
    it: "Italiano",
    ru: "Russo",
    ja: "Japonês",
    zh: "Chinês",
    ar: "Árabe",
    hi: "Hindi",
    bn: "Bengali",
    jv: "Javanês",
    ko: "Coreano",
    vi: "Vietnamita",
    tr: "Turco",
    sw: "Suaíli",
    pl: "Polonês",
    ro: "Romeno",
    nl: "Holandês",
    hu: "Húngaro",
    el: "Grego",
    sv: "Sueco",
    da: "Dinamarquês",
    fi: "Finlandês",
    he: "Hebraico",
    id: "Indonésio",
    ga: "Irlandês",
    ms: "Malaio",
    no: "Norueguês",
    uk: "Ucraniano",
  };

  const data = new Date(volumeInfo.publishedDate);
  const dataFormatada =
    data.getDate() + "/" + data.getMonth() + "/" + data.getFullYear();

  document.getElementById("desc-livro").textContent =
    volumeInfo.description || "Não informado";
  document.getElementById("autor-livro").innerHTML = `<b>Autor(es): </b>${
    volumeInfo.authors?.join(", ") || "Não informado"
  }`;
  document.getElementById("genero-livro").innerHTML = `<b>Gênero(s): </b>${
    volumeInfo.categories?.join(", ") || "Não informado"
  }`;
  document.getElementById("pagina-livro").innerHTML = `<b>Páginas: </b>${
    volumeInfo.pageCount || "Não informado"
  }`;
  document.getElementById("idioma-livro").innerHTML = `<b>Idioma: </b>${
    linguas[volumeInfo.language] || "Não informado"
  }`;
  document.getElementById("edicao-livro").innerHTML = `<b>Editora: </b>${
    volumeInfo.publisher || "Não informado"
  }`;
  document.getElementById(
    "ano-livro"
  ).innerHTML = `<b>Data de Publicação: </b>${
    dataFormatada || "Não informado"
  }`;
  document.getElementById(
    "compra-livro"
  ).innerHTML = `<b>Link da Compra: </b><a href="${
    volumeInfo.canonicalVolumeLink || "#"
  }" target="_blank">clique aqui</a>`;
  document.getElementById(
    "detalhe-livro"
  ).innerHTML = `<b>Detalhes do Livro: </b><a href="${
    volumeInfo.infoLink || "#"
  }" target="_blank">clique aqui</a>`;

  zoomed.style.opacity = "1";
  zoomed.style.visibility = "visible";
  document.body.classList.add("zoom-ativo");
  document.body.style.overflow = "hidden";
}

function mostrarCarregando() {
  document.getElementById("loading").classList.remove("d-none");
}

function esconderCarregando() {
  document.getElementById("loading").classList.add("d-none");
}

function atualizarLista() {
  document.getElementById("livros").innerHTML = "";

  const startIndex = (currentPage - 1) * pageSize;
  carregarLivros(startIndex, lastQuery);
}

document
  .getElementById("pagina-anterior")
  .addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      document.getElementById("pagina-atual").textContent = currentPage;

      atualizarLista();
    }
  });

document
  .getElementById("pagina-seguinte")
  .addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      document.getElementById("pagina-atual").textContent = currentPage;

      atualizarLista();
    }
  });

// Evento disparado ao pressionar as teclas de atalho para abrir o Inspecionar
window.addEventListener(
  "keydown",
  function (event) {
    if (event.keyCode === 123) {
      // Código da tecla F12
      alert("Acesso ao código fonte não permitido!");
      event.preventDefault();
    } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
      // Ctrl+Shift+I
      alert("Acesso ao código fonte não permitido!");
      event.preventDefault();
    }
  },
  false
);

// Evento disparado ao clicar com o botão direito do mouse
window.addEventListener(
  "contextmenu",
  function (event) {
    event.preventDefault();
    alert("Acesso ao código fonte não permitido!");
  },
  false
);

window.onload = function () {
  document
    .getElementById("floatingInputGroup1")
    .addEventListener("blur", function (e) {
      const query = e.target.value;
      lastQuery = query;
      document.getElementById("livros").innerHTML = "";
      startIndex = 0;
      carregarLivros(0, query);
    });

  carregarLivros(0, lastQuery);
};
