const btnCarregar = document.querySelector(".btn-carregar");
const produtosContainer = document.querySelector(".produtos");
let currentPage = 1;
let produtosCarregados = 0;
const produtosPorClique = 4;
let carregando = false;
btnCarregar.addEventListener("click", () => {
    async function carregarProdutos(page) {
        if (carregando) return;
        carregando = true;
        try {
            const response = await fetch(`https://desafio-api.bold.workers.dev/products?page=${page}`);
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            const data = await response.json();
            console.log("Dados da API (página ${page}):", data);

            const novosProdutos = data.products.slice(produtosCarregados % 8, produtosCarregados % 8 + produtosPorClique);

            novosProdutos.forEach((produto) => {
                const card = document.createElement("div");
                card.classList.add("produto");
                card.innerHTML = `
              <div class="imagem-produto" style="background-image: url('${produto.image}')"></div>
              <div class="info-produto">
                <h2 class="nome">${produto.name}</h2>
                <p class="descricao-produto">${produto.description}</p>
                <p class="preco-de">De: R$${produto.oldPrice.toFixed(2).replace('.', ',')}</p>
                <p class="preco-por">Por: R$${produto.price.toFixed(2).replace('.', ',')}</p>
                <p class="preco-parcela">ou ${produto.installments.count}x de R$${produto.installments.value.toFixed(2).replace('.', ',')}</p>
                <button>Comprar</button>
              </div>
            `;
                produtosContainer.appendChild(card);
                produtosCarregados++;
            });

            // Se a página atual não tiver mais produtos para exibir no bloco de 4,
            // e houver uma próxima página, vamos para a próxima página na próxima vez que o botão for clicado.
            if (produtosCarregados % 8 === 0 && data.next) {
                currentPage++;
            } else if (!data.next && produtosCarregados % 8 === data.products.length % 8) {
                // Se não houver mais próxima página e todos os produtos da página atual foram exibidos
                btnCarregar.style.display = 'none';
            } else if (!data.next && novosProdutos.length < produtosPorClique) {
                btnCarregar.style.display = 'none'; // Oculta se a última página não tiver produtos suficientes para mais um bloco
            } else {
                btnCarregar.style.display = 'block';
            }

        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            alert("Erro ao carregar os produtos.");
            btnCarregar.style.display = 'none'; // Oculta o botão em caso de erro
        } finally {
            carregando = false;
        }
    }

    btnCarregar.addEventListener("click", function () {
        carregarProdutos(currentPage);
    });

    carregarProdutos(currentPage);
});