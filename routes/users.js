var express = require('express');
var router = express.Router();
var fs = require('fs');


router.get('/', function (req, res, next) {
    res.send("Exibe todos os users")
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
});

router.post('/', function(req, res, next) {
    res.send('Criar novo usuario')
});

router.patch('/:id', function(req, res, next) {
    res.send('edita um usuario')
});


router.delete('/:id', function(req, res, next) {
    res.send('deleta um usuario')
});




module.exports = router;