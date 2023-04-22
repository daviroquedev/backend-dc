var express = require('express');
var router = express.Router();
var fs = require('fs');

const db = require('../db');
const { Op } = require('sequelize');

//ROTA BUSCANDO TODOS OS PRODUTOS DO ARQUIVO LIDO COM O MODULO FS
router.get('/', async function (req, res, next) {
    try {
        const userSearched = await db.sequelize.models.produto.findAll()
        res.status(200).send(userSearched)
    } catch {
        res.status(404).send({
            "erro": "arquivo não encontrado"
        })
    }
});
//Rota para busca por palavra-chave
router.get('/search', async function (req, res, next) {
    console.log(1)
    const { palavra_chave, info } = req.query
    try {
        const userSearched = await db.sequelize.models.produto.findAll({
            where: {
                descricao: {
                    [Op.like]: `%${palavra_chave}%`,
                }
            }
        })
        res.status(200).send(userSearched)
    } catch (err) {
        console.error(err)
        res.status(404).send({
            "erro": "arquivo não encontrado"
        })
    }
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
router.post('/', async function (req, res, next) {
    const { categoria,
        titulo,
        descricao,
        valor,
        desconto,
        img, } = req.body
    try {
        if (!categoria || !titulo || !descricao || !valor) {
            res.status(400).send('Dados incompletos para criação de novo usuário');
            return;
        }
        const produtoCriado = await db.sequelize.models.produto.create(
            {
                categoria,
                titulo,
                descricao,
                valor,
                desconto,
                img,
            }
        )
        res.send(produtoCriado)
    } catch (err) {
        console.error(err);
        res.status(400).send('JSON inválido');
    }
});


// function para atualizar um produto existente. Pode usar a mesma função tanto para PUT quanto para PATCH, sendo a diferença no corpo da request.
async function update(req, res, next) {
    const { id: produtoId } = req.params
	const { id, ...rest } = req.body
	const bichoUpdatado = await db.sequelize.models.produto.update(rest, {
		where: {
			id: produtoId
		}
	})
	res.send(bichoUpdatado)
}

router.put('/:id', update);
router.patch('/:id', update);
router.delete('/:id', async function (req, res, next) {
    const { id } = req.params
    try {
        await db.sequelize.models.carrinhoProduto.destroy({ where: { produtoId: id } })

        const produtoDeletado = await db.sequelize.models.produto.destroy({ where: { id } })
        if (produtoDeletado) {
            res.send("deletado")
        } else {
            res.send("Nenhum usuario encontrado para esse id")
        }
    }
    catch (err) {
        res.send('Ocorreu um  erro:' + err)
    }
});


module.exports = router;
