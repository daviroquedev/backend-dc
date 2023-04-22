var express = require("express");
var router = express.Router();
var fs = require("fs");

const db = require('../db')

router.get('/', async function (req, res, next) {
	const todosUsuarios = await db.Usuario.findAll()
	console.log('todosUsuarios', todosUsuarios)
	fs.readFile('./data/users.json', "utf-8", (err, data) => {
		try {
			const userSearched = JSON.parse(data)
			res.status(200).send(userSearched)
		} catch {
			res.status(404).send({
				"erro": "arquivo não encontrado"
			})
		}
	})
});

router.get('/:id', function (req, res, next) {
	fs.readFile('./data/users.json', "utf-8", (err, data) => {
		const { id } = req.params

		try {
			const users = JSON.parse(data)

			const usuarioSelecionado = users.find((usuario) => usuario.id === id)
			if (usuarioSelecionado) {
				res.send(usuarioSelecionado)
			} else {
				res.send("Nenhum usuario encontrado para esse id")
			}
		}
		catch {
			res.send('Ocorreu um  erro:' + err)
		}

	})
});

router.post('/', (req, res) => {
	// Lê o conteúdo atual do arquivo users.json
	fs.readFile('./data/users.json', 'utf-8', (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send('Erro ao ler o arquivo users.json');
			return;
		}
		try {
			// Converte o conteúdo para um objeto JavaScript
			const users = JSON.parse(data);
			// Adiciona o novo usuário ao array de usuários
			// Verificar dados

			// Verifica se o email já existe na lista de usuários
			const emailExistente = users.find((user) => user.email === req.body.email);

			if (emailExistente) {
				res.status(400).send('Email já existente na lista de usuários');
				return;
			}
			const idExistente = users.find((user) => user.id === req.body.id);

			if (idExistente) {
				res.status(400).send('ID já existente na lista de usuários');
				return;
			}

			if (!req.body.user || !req.body.email || !req.body.password) {
				res.status(400).send('Dados incompletos para criação de novo usuário');
				return;
			}

			users.push(req.body);
			// Converte o objeto JavaScript de volta para JSON
			const usersJSON = JSON.stringify(users);
			// Escreve o novo conteúdo no arquivo users.json
			fs.writeFile('./data/users.json', usersJSON, (err) => {
				if (err) {
					console.error(err);
					res.status(500).send('Erro ao escrever no arquivo users.json');
					return;
				}
				// Retorna o novo usuário adicionado como resposta
				res.json(req.body);
			});
		} catch (err) {
			console.error(err);
			res.status(400).send('JSON inválido');
		}
	});
});


// Função para atualizar dados de usuário. PUT e PATCH mesmo resultado apos testes, por isso associei a função "update" aos dois métodos.
function update(req, res, next) {
	fs.readFile('./data/users.json', 'utf-8', (err, data) => {
		if (err) {
			return res.status(500).send('Erro ao ler arquivo de usuário.');
		}

		const users = JSON.parse(data)
		const id = req.params.id

		const updatedUser = users.find((user) => user.id === id)
		if (!updatedUser) {
			return res.status(404).send('Não foi encontrado o usuário.');
		}

		//retorna updatedUser atualizado com dados passados no body da requisição
		Object.assign(updatedUser, req.body)

		//já com 'users' atualizado repopula-se o arquivo com os novos dados
		fs.writeFileSync('./data/users.json', JSON.stringify(users))
		res.send(updatedUser);
	})
}

router.put("/:id", update)
router.patch("/:id", update)

router.delete("/:id", function (req, res, next) {
	fs.readFile("./data/users.json", "utf-8", (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).send("Erro ao ler arquivo de usuário.");
		}

		const users = JSON.parse(data);
		const id = req.params.id;

		const deletedUser = users.find((user) => user.id === id);
		const newUsers = users.filter((user) => user.id !== id);

		fs.writeFile("./data/users.json", JSON.stringify(newUsers), (err) => {
			if (err) {
				return res.status(500).send("Erro ao salvar novo usuário.");
			}

			deletedUser
				? res.send(deletedUser)
				: res.status(404).send("usuário não encontrado");
		});
	});
});

module.exports = router;
