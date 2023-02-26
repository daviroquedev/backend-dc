var express = require('express');
var router = express.Router();
var fs = require('fs');


//mostrando todos os carrinhos
router.get('/', function (req, res, next) {
    const carrinho = JSON.parse(fs.readFileSync('./data/carrinho.json', 'utf-8'));
    res.json(carrinho);
});

// Rota para calcular o valor total do carrinho
router.get('/:id/valortotal', (req, res, next) => {
    const carrinhoId = req.params.id; // Pega o ID do carrinho da rota
    console.log(`id do carrim ` + carrinhoId)

    // Lê o arquivo de produtos
    const produtos = JSON.parse(fs.readFileSync('./data/produtos.json', 'utf-8'));

    // Lê o arquivo de carrinhos
    const carrinhos = JSON.parse(fs.readFileSync('./data/carrinho.json', 'utf-8'));
    const carrinho = carrinhos.find((c) => c.id === carrinhoId);

    if (!carrinho) {
        return res.status(404).send('Carrinho não encontrado');
    }

    let valorFinal = 0;

    // Percorre todos os produtos do carrinho
    carrinho.produtos.forEach((produtoNoCarrinho) => {
        const produto = produtos.find((p) => p.id === produtoNoCarrinho.produto_id);
        console.log("produtoooooooo valor " + produto.valor)
        console.log("produtooooooo descontoooooo " + produto.desconto)

        // Calcula o valor total do produto com desconto
        const valorComDesconto = produto.valor * (100 - produto.desconto) / 100;
        console.log("valoorcomdesconto@@", valorComDesconto)
        valorFinal = valorComDesconto * produtoNoCarrinho.quantidade + valorFinal
        console.log("carin quantidade", produtoNoCarrinho.quantidade)
        console.log("OOOOOOOOO", valorFinal)

        if (!produto) {
            return res.status(400).send(`Produto não encontrado para o ID ${produtoNoCarrinho.produto_id}`);
        }
    });

    //const descontoTotal = carrinho.desconto / 100 * valorFinal;
    console.log("carinho desconto", carrinho.desconto)
    //console.log("desconto total", descontoTotal)
    totalDesconto = valorFinal * (carrinho.desconto / 100)
    valorFinal -= totalDesconto
    res.send(`Valor total do carrinho ${carrinhoId}: R$${valorFinal.toFixed(2)}`);
});

router.get('/:id', function (req, res, next) {
    res.send("Exibe apenas um carrinho")
});

router.post('/', function (req, res, next) {
    res.send('Criar novo carrinho')
});

router.patch('/:id', function (req, res, next) {
    res.send('edita um carrinho')
});

router.delete('/:id', function (req, res, next) {
    res.send('deleta um carrinho')
});


module.exports = router;