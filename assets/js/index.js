const apiKey = window.env.API_TOKEN;
const sem_capa = "assets/img/SEM_CAPA.png";
let startIndex = 0;
let loading = false;
let lastQuery = "Sherlock Holmes";

function carregarLivros(startIndex, query) {
  const maxResults = 40;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&startIndex=${startIndex}&maxResults=${maxResults}&key=${apiKey}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao carregar os livros.");
      }

      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < data.items.length; i++) {
        const livro = data.items[i];
        const imgCapa = livro.volumeInfo.imageLinks?.thumbnail || sem_capa;

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

        document.getElementById("livros").appendChild(livroElement);
      }
    })
    .catch((error) => console.error(error));
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
    volumeInfo.publishedDate || "Não informado"
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

window.onscroll = function () {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
    !loading
  ) {
    loading = true;
    carregarLivros(startIndex, lastQuery);
    startIndex += 40;
    loading = false;
  }
};

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
