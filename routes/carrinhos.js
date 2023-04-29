var express = require("express");
var router = express.Router();
var fs = require("fs");

const db = require("../db");

//mostrando todos os carrinhos
router.get("/", async function (req, res, next) {
  try {
    const userSearched = await db.sequelize.models.carrinho.findAll();
    res.status(200).send(userSearched);
  } catch (err) {
    console.log(err);
    res.status(404).send({
      erro: "arquivo não encontrado",
    });
  }
});

// Rota para calcular o valor total do carrinho
router.get("/:id/valortotal", async (req, res, next) => {
  const carrinhoId = req.params.id; // Pega o ID do carrinho da rota
  console.log(`id do carrinho ` + carrinhoId);

  // Lê o arquivo de carrinhos
  const carrinho = await db.sequelize.models.carrinho.findOne({
    where: { id: carrinhoId },
    raw: true,
  });

  if (!carrinho) {
    return res.status(404).send("Carrinho não encontrado");
  }

  const carrinhoProduto = await db.sequelize.models.carrinhoProduto.findAll({
    where: {
      carrinhoId,
    },
  });
  console.log(
    await db.sequelize.models.carrinhoProduto.findAll({
      where: {
        carrinhoId,
      },
      raw: true,
    })
  );

  const produtosDoCarrinho = await Promise.all(
    carrinhoProduto.map(async (cp) => {
      const produto = await db.sequelize.models.produto.findOne({
        where: { id: cp.produtoId },
        raw: true,
      });
      return { produto, produtoNoCarrinho: cp };
    })
  );

  console.log("produtosDoCarrinho", produtosDoCarrinho);

  let valorFinal = 0;
  const produtosNoCarrinho = [];

  // Percorre todos os produtos do carrinho
  produtosDoCarrinho.forEach(async ({ produto, produtoNoCarrinho }) => {
    console.log("Valor do produto " + produto.valor);
    console.log("Desconto do produto" + produto.desconto);

    // Calcula o valor total do produto com desconto
    const valorComDesconto = (produto.valor * (100 - produto.desconto)) / 100;
    console.log("Valor com desconto", valorComDesconto);
    valorFinal = valorComDesconto * produtoNoCarrinho.quantidade + valorFinal;
    console.log("Quantidade de produtos", produtoNoCarrinho.quantidade);
    console.log("Valor final do produto", valorFinal);

    if (!produto) {
      return res
        .status(400)
        .send(
          `Produto não encontrado para o ID ${produtoNoCarrinho.produto_id}`
        );
    }

    // Adiciona o produto e sua quantidade ao array
    produtosNoCarrinho.push({
      id: produto.id,
      descricao: produto.descricao,
      quantidade: produtoNoCarrinho.quantidade,
      valor: produto.valor,
      desconto: produto.desconto,
    });
  });

  //const descontoTotal = carrinho.desconto / 100 * valorFinal;
  console.log("Desconto do usuario", carrinho.desconto);
  //console.log("desconto total", descontoTotal)
  totalDesconto = valorFinal * (carrinho.desconto / 100);
  valorFinal -= totalDesconto;

  // Cria o objeto com os detalhes do carrinho
  const carrinhoDetalhado = {
    idCarrinho: carrinho.id,
    produtosNoCarrinho: produtosNoCarrinho,
    valorTotal: valorFinal.toFixed(2),
    descontoUsuarioCarrinho: carrinho.desconto,
    descontoDinheiroTotal: totalDesconto.toFixed(2),
  };

  // Envia o objeto como resposta
  res.send(carrinhoDetalhado);
});

//buscar carrinho por id
router.get("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const userSearched = await db.sequelize.models.carrinho.findOne({
      where: { id },
    });
    res.status(200).send(userSearched);
  } catch (err) {
    console.log(err);
    res.status(404).send({
      erro: "arquivo não encontrado",
    });
  }
});

router.post("/", async function (req, res, next) {
  const { desconto, produtos } = req.body;
  try {
    const carrinhoCriado = await db.sequelize.models.carrinho.create({
      desconto,
    });

    produtos.forEach(async (produto) => {
      await db.sequelize.models.carrinhoProduto.create({
        quantidade: produto.quantidade,
        carrinhoId: carrinhoCriado.id,
        produtoId: produto.produto_id,
      });
    });
    res.send(carrinhoCriado);
  } catch (err) {
    console.error(err);
    res.status(400).send("JSON inválido");
  }
});

// Rota para editar os itens do carrinho
router.patch("/:id", function (req, res, next) {
  // Le o arquivo JSON com os carrinhos disponíveis
  fs.readFile("./data/carrinho.json", "utf8", (err, data) => {
    const carrinhos = JSON.parse(data);
    // declara o id enviado pelo patch
    const id = req.params.id;
    // declara o id enviado pelo corpo da requisição
    const idReqBody = req.body.id;
    // verifica se o carrinho solicitado existe no JSON
    const carrinhoEditado = carrinhos.find((carrinho) => carrinho.id === id);

    // verifica se a requisição possui informações o suficiente para serem passadas
    if (!req.body || Object.keys(req.body).length === 0) {
      res
        .status(400)
        .send(
          "Nenhuma mudança foi realizada, pois as informações não são suficientes."
        );
      return;
    }

    // caso a requisição contenha um id, o servidor não autoriza que o mesmo seja usado e avisa ao cliente
    if (idReqBody) {
      res.status(401).send("O identificador único não pode ser modificado.");
      return;
    }

    // caso o id enviado pelo patch não seja encontrado, o servidor retorna o erro not found
    if (!carrinhoEditado) {
      res.status(404).send("Carrinho não encontrado.");
      return;
    }

    //copia os valores do objeto de origem (requisição) para o objeto destino (JSON)
    Object.assign(carrinhoEditado, req.body);

    //reescreve os dados modificados no JSON
    fs.writeFileSync("./data/carrinho.json", JSON.stringify(carrinhos));

    //mensagem mostrando que a requisição foi concluida e mostra o objeto modificado com as informações novas
    res.send(
      "carrinho com o id " +
        id +
        " editado com sucesso! as novas informações são:" +
        JSON.stringify(req.body)
    );
  });
});

router.delete("/:id", async function (req, res, next) {
  const { id } = req.params;
  try {
    const carrinhoProduto = await db.sequelize.models.carrinhoProduto.destroy({
      where: { carrinhoId: id },
    });
    const carrinho = await db.sequelize.models.carrinho.destroy({
      where: { id },
    });
    res.status(200).send({ carrinhoProduto, carrinho });
  } catch (err) {
    console.log(err);
    res.status(404).send({
      erro: "arquivo não encontrado",
    });
  }
});

module.exports = router;
