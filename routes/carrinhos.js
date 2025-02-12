var express = require("express");
var router = express.Router();
var fs = require("fs");

//mostrando todos os carrinhos
router.get("/", function (req, res, next) {
  const carrinho = JSON.parse(fs.readFileSync("./data/carrinho.json", "utf-8"));
  res.json(carrinho);
});

// Rota para calcular o valor total do carrinho
router.get("/:id/valortotal", (req, res, next) => {
  const carrinhoId = req.params.id; // Pega o ID do carrinho da rota
  console.log(`id do carrinho ` + carrinhoId);

  // Lê o arquivo de produtos
  const produtos = JSON.parse(fs.readFileSync("./data/produtos.json", "utf-8"));

  // Lê o arquivo de carrinhos
  const carrinhos = JSON.parse(fs.readFileSync("./data/carrinho.json", "utf-8"));
  const carrinho = carrinhos.find((c) => c.id === carrinhoId);

  if (!carrinho) {
    return res.status(404).send("Carrinho não encontrado");
  }

  let valorFinal = 0;
  const produtosNoCarrinho = [];

  // Percorre todos os produtos do carrinho
  carrinho.produtos.forEach((produtoNoCarrinho) => {
    const produto = produtos.find((p) => p.id === produtoNoCarrinho.produto_id);
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
      nome: produto.nome,
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
router.get('/:id', function (req, res, next) {
  fs.readFile('./data/carrinho.json', "utf-8", (err, data) => {
    const { id } = req.params

    try {
      const carrinhos = JSON.parse(data)

      const carrinhoSelecionado = carrinhos.find((carrinho) => carrinho.id === id)
      if (carrinhoSelecionado) {
        res.send(carrinhoSelecionado)
      } else {
        res.send("Nenhum carrinho encontrado com essa especificação")
      }
    }
    catch {
      res.send('Ocorreu um erro:' + err)
    }


  })

});

router.post('/', function (req, res, next) {
  // Lê o conteúdo atual do arquivo carrinho.json
  fs.readFile('./data/carrinho.json', 'utf-8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erro ao ler o arquivo carrinho.json');
      return;
    }
    try {
      // Converte o conteúdo para um objeto JavaScript
      const carrinho = JSON.parse(data);
      // Adiciona o novo item ao array de itens
      //console.log(carrinho)
      // Verificar dados

      // Verifica se o ID já existe no carrinho
      const idExistente = carrinho.find((item) => item.id === req.body.id);

      if (idExistente) {
        res.status(400).send('ID já existente no carrinho');
        return;
      }

      if (!req.body.id) {
        res.status(400).send('ID não informado');
        return;
      }

      carrinho.push(req.body);
      // Converte o objeto JavaScript de volta para JSON
      const carrinhoJSON = JSON.stringify(carrinho);
      // Escreve o novo conteúdo no arquivo carrinho.json
      fs.writeFile('./data/carrinho.json', carrinhoJSON, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro ao escrever no arquivo carrinho.json');
          return;
        }
        // Retorna o novo item adicionado como resposta
        res.json(req.body);
      });
    } catch (err) {
      console.error(err);
      res.status(400).send('JSON inválido');
    }
  });
});

// Rota para editar os itens do carrinho
router.patch("/:id", function (req, res, next) {
  // Le o arquivo JSON com os carrinhos disponíveis
  fs.readFile("./data/carrinho.json", "utf8", (err, data) => {
    const carrinhos = JSON.parse(data);
    // declara o id enviado pelo patch
    const id = req.params.id;
    // declara o id enviado pelo corpo da requisição 
    const idReqBody = req.body.id
    // verifica se o carrinho solicitado existe no JSON
    const carrinhoEditado = carrinhos.find((carrinho) => carrinho.id === id)

    // verifica se a requisição possui informações o suficiente para serem passadas
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send('Nenhuma mudança foi realizada, pois as informações não são suficientes.');
      return
    }

    // caso a requisição contenha um id, o servidor não autoriza que o mesmo seja usado e avisa ao cliente
    if (idReqBody) {
      res.status(401).send("O identificador único não pode ser modificado.")
      return
    }

    // caso o id enviado pelo patch não seja encontrado, o servidor retorna o erro not found
    if (!carrinhoEditado) {
      res.status(404).send("Carrinho não encontrado.")
      return
    }

    //copia os valores do objeto de origem (requisição) para o objeto destino (JSON)
    Object.assign(carrinhoEditado, req.body)

    //reescreve os dados modificados no JSON
    fs.writeFileSync('./data/carrinho.json', JSON.stringify(carrinhos))

    //mensagem mostrando que a requisição foi concluida e mostra o objeto modificado com as informações novas
    res.send("carrinho com o id " + id + " editado com sucesso! as novas informações são:" + JSON.stringify(req.body))
  });
});

router.delete('/:id', function (req, res, next) {
  fs.readFile('./data/carrinho.json', "utf8", (err, data) => {
    const carrinho = JSON.parse(data)
    const id = req.params.id

    const itemDeletado = carrinho.find((item) => item.id === id)
    const novoCarrinho = carrinho.filter((item) => item.id !== id)

    fs.writeFileSync('./data/carrinho.json', JSON.stringify(novoCarrinho))

    if (itemDeletado) {
      res.send(itemDeletado)
    } else {
      res.status(404).send("Carrinho não encontrado.")
    }

  })
});

module.exports = router;
