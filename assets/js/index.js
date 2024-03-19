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
