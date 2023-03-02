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
  console.log(`id do carrim ` + carrinhoId);

  // Lê o arquivo de produtos
  const produtos = JSON.parse(fs.readFileSync("./data/produtos.json", "utf-8"));

  // Lê o arquivo de carrinhos
  const carrinhos = JSON.parse(
    fs.readFileSync("./data/carrinho.json", "utf-8")
  );
  const carrinho = carrinhos.find((c) => c.id === carrinhoId);

  if (!carrinho) {
    return res.status(404).send("Carrinho não encontrado");
  }

  let valorFinal = 0;

  // Percorre todos os produtos do carrinho
  carrinho.produtos.forEach((produtoNoCarrinho) => {
    const produto = produtos.find((p) => p.id === produtoNoCarrinho.produto_id);
    console.log("produtoooooooo valor " + produto.valor);
    console.log("produtooooooo descontoooooo " + produto.desconto);

    // Calcula o valor total do produto com desconto
    const valorComDesconto = (produto.valor * (100 - produto.desconto)) / 100;
    console.log("valoorcomdesconto@@", valorComDesconto);
    valorFinal = valorComDesconto * produtoNoCarrinho.quantidade + valorFinal;
    console.log("carin quantidade", produtoNoCarrinho.quantidade);
    console.log("OOOOOOOOO", valorFinal);

    if (!produto) {
      return res
        .status(400)
        .send(
          `Produto não encontrado para o ID ${produtoNoCarrinho.produto_id}`
        );
    }
  });

  //const descontoTotal = carrinho.desconto / 100 * valorFinal;
  console.log("carinho desconto", carrinho.desconto);
  //console.log("desconto total", descontoTotal)
  totalDesconto = valorFinal * (carrinho.desconto / 100);
  valorFinal -= totalDesconto;
  res.send(`Valor total do carrinho ${carrinhoId}: R$${valorFinal.toFixed(2)}`);
});

router.get('/:id', function (req, res, next) {
    res.send("Exibe apenas um carrinho")
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
    res.send("carrinho com o id "+ id + " editado com sucesso! as novas informações são:" + JSON.stringify(req.body))
  });
});

router.delete("/:id", function (req, res, next) {
  res.send("deleta um carrinho");
});

module.exports = router;
