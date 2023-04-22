var express = require("express");
var router = express.Router();
var fs = require("fs");

const db = require('../db')


router.get('/', async function (req, res, next) {
	try {
		const userSearched = await db.sequelize.models.usuario.findAll()
		res.status(200).send(userSearched)
	} catch {
		res.status(404).send({
			"erro": "arquivo não encontrado"
		})
	}
});

router.get('/:id', async function (req, res, next) {

	const { id } = req.params
	try {

		const usuarioSelecionado = await db.sequelize.models.usuario.findOne({ where: { id } })
		if (usuarioSelecionado) {
			res.send(usuarioSelecionado)
		} else {
			res.send("Nenhum usuario encontrado para esse id")
		}
	}
	catch {
		res.send('Ocorreu um  erro:' + err)
	}
});

router.post('/', async (req, res) => {

	const { username, password, email } = req.body
	console.log(req.body)
	try {
		if (!username || !email || !password) {
			res.status(400).send('Dados incompletos para criação de novo usuário');
			return;
		}
		const usuarioEncontrado = await db.sequelize.models.usuario.findOne({ where: { email } })
		if (usuarioEncontrado) {
			res.status(400).send('Email já existente na lista de usuários');
			return;
		}
		const usuarioCriado = await db.sequelize.models.usuario.create(
			{
				username,
				email,
				password
			}
		)
		res.send(usuarioCriado)
	} catch (err) {
		console.error(err);
		res.status(400).send('JSON inválido');
	}


});


// Função para atualizar dados de usuário. PUT e PATCH mesmo resultado apos testes, por isso associei a função "update" aos dois métodos.
async function update(req, res, next) {
	const { id: userId } = req.params
	const { id, ...rest } = req.body
	const bichoUpdatado = await db.sequelize.models.usuario.update(rest, {
		where: {
			id: userId
		}
	})
	res.send(bichoUpdatado)
}

router.put("/:id", update)
router.patch("/:id", update)


router.delete("/:id", async function (req, res, next) {
	const { id } = req.params
	try {

		const carrinhoEncontrado = await db.sequelize.models.carrinho.findOne({ where: { usuarioId: id } })
		if (carrinhoEncontrado) {
			await db.sequelize.models.carrinhoProduto.destroy({ where: { carrinhoId: carrinhoEncontrado.id } })
			await db.sequelize.models.carrinho.destroy({ where: { usuarioId: id } })
		}

		const usuariodeletado = await db.sequelize.models.usuario.destroy({ where: { id } })
		if (usuariodeletado) {
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
