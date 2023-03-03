var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res, next) {
	res.send("Exibe todos os users");
});

router.get('/:id', function (req, res, next) {
    fs.readFile('./data/users.js', "utf-8", (err, data) =>{
        const {id} = req.params

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
    // res.send("Exibe apenas um users")
router.get("/:id", function (req, res, next) {
	res.send("Exibe apenas um users");
});

router.post("/", function (req, res, next) {
	res.send("Criar novo usuario");
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
		if(!updatedUser) {
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
