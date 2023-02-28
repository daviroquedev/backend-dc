var express = require("express");
var router = express.Router();
var fs = require("fs");

router.get("/", function (req, res, next) {
	res.send("Exibe todos os users");
});

router.get("/:id", function (req, res, next) {
	res.send("Exibe apenas um users");
});

router.post("/", function (req, res, next) {
	res.send("Criar novo usuario");
});

router.patch("/:id", function (req, res, next) {
	res.send("edita um usuario");
});

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
