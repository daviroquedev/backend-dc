var express = require('express');
var router = express.Router();
var fs = require('fs');
const { stringify } = require('querystring');
const { path } = require('../app');


//ROTA BUSCANDO TODOS OS PRODUTOS DO ARQUIVO LIDO COM O MODULO FS
router.get('/', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf-8", (err, data) => {
        try{
            const produtos = JSON.parse(data)
            res.send(produtos)    
        } catch {
            res.send('Ocorreu um erro: ' + err)
        }
       
    })

});
//Rota para busca por palavra-chave
router.get('/search', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf-8", (err, data) => {
        if (err) {
            res.send("Ocorreu um erro na sua busca")
        }
        try {
            const produtos = JSON.parse(data)
            const { palavra_chave, info } = req.query


            let produtoBuscado = produtos.filter((produto) => produto[`${palavra_chave}`].toString().toLowerCase() === info)
            if (produtoBuscado) {
                res.send(produtoBuscado)
            } else {
                res.send("Nenhum produto encontrado para esssas especificacoes")
            }

        } catch (erro) {
            res.send("Ocorreu um erro:" + erro)
        }

    })
})
//--------------------------------------
//Rota para buscar um produto individualmente 
router.get('/:id', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf-8", (err, data) => {
        const { id } = req.params

        try {
            const produtos = JSON.parse(data)

            const produtoSelecionado = produtos.find((produto) => produto.id === id)
            if (produtoSelecionado) {
                res.send(produtoSelecionado)
            } else {
                res.send("Nenhum produto encontrado para essa especificação")
            }
        }
        catch {
            res.send('Ocorreu um erro:' + err)
        }


    })

});

//Rota para adicionar um produto
router.post('/', function (req, res, next) {
    fs.readFile('./data/produtos.json', 'utf8', (err, data) => {
        try {
            const produtos = JSON.parse(data)
            let novoID = null
            let maiorID = 0
            produtos.forEach((element) => {
                if (eval(element.id) > maiorID) {
                    maiorID = eval(element.id)
                }
                novoID = maiorID + 1
                console.log(maiorID)
            });
            const produtoCriado = {
                "categoria": req.body.categoria,
                "titulo": req.body.titulo,
                "descricao": req.body.descricao,
                "valor": req.body.valor,
                "desconto": req.body.desconto,
                "img": req.body.img,
                "id": String(novoID)
            }
            if (produtoCriado !== {}) {
                produtos.push(produtoCriado)
                if (produtoCriado !== {}) {
                    fs.writeFileSync('./data/produtos.json', JSON.stringify(produtos))
                    res.send('produto adicionado com o id ' + novoID + ' criado com sucesso')
                }
                else {
                    res.send('erro ao criar produto, os itens contém o mesmo Identificado Único (' + novoID + ')')
                }
            }
            else {
                res.send('nao foi possível criar o produto, erro (' + err + ')')
            }
        }
        catch {
            res.send('ocorreu um erro -' + err)
        }

    })
});

function update(req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => {
        const produtos = JSON.parse(data)
        const id = req.params.id

        const produtoAtualizado = produtos.find((produto) => produto.id === id)
        if(!produtoAtualizado){
            res.status(404).send("Produto não encontrado.")
            return
        }

        Object.assign(produtoAtualizado, req.body)

        fs.writeFileSync('./data/produtos.json', JSON.stringify(produtos))

        res.send(produtoDeletado)

    })
}
router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', function (req, res, next) {
    fs.readFile('./data/produtos.json', "utf8", (err, data) => {
        const produtos = JSON.parse(data)
        const id = req.params.id

        const produtoDeletado = produtos.find((produto) => produto.id === id)
        const novosProdutos = produtos.filter((produto) => produto.id !== id)

        fs.writeFileSync('./data/produtos.json', JSON.stringify(novosProdutos))

        res.send(produtoDeletado)
    })
    // res.send('Remove produto ' + req.params.id)
});

 
module.exports = router;
