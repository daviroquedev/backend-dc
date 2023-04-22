const Sequelize = require('sequelize')

const sequelize = new Sequelize('fs08', 'root', '1234', {
    host: 'localhost', dialect: 'mysql'
})

async function auth() {
    try {
        await sequelize.authenticate()
        // await sequelize.close()
    } catch (error) {
        console.log(error)
    }
}

let Usuario;
let Carrinho;
let Produto;
let CarrinhoProduto;
async function createModels(seed) {
    const { DataTypes } = Sequelize

    Usuario = sequelize.define('usuario', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: 10
            }
        },
    })
    await Usuario.sync();

    Carrinho = sequelize.define('carrinho', {
        desconto: {
            type: DataTypes.DECIMAL,
        },
    })
    Carrinho.belongsTo(Usuario,
        {
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        })
    Usuario.hasOne(Carrinho,
        {
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION'
        })
    await Carrinho.sync();

    Produto = sequelize.define('produto', {
        categoria: {
            type: DataTypes.STRING,
            allowNull: false, // obrigatorio/required
        },
        descricao: {
            type: DataTypes.STRING,
            allowNull: false, // obrigatorio/required
        },
        valor: {
            type: DataTypes.DECIMAL,
            allowNull: false, // obri☻gatorio/required
        },
        img: {
            type: DataTypes.STRING,
        },
        desconto: {
            type: DataTypes.DECIMAL,
        },
    })
    await Produto.sync();

    CarrinhoProduto = sequelize.define('CarrinhoProduto', {
        quantidade: {
            type: DataTypes.INTEGER,
        },
    });
    Carrinho.belongsToMany(Produto, {
        through: CarrinhoProduto,
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'

    });
    Produto.belongsToMany(Carrinho, {
        through: CarrinhoProduto,
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
    await CarrinhoProduto.sync();

    if (seed) {
        const usuario = await Usuario.create({
            username: 'username4',
            email: "alla4@email.com",
            password: '0123456789',
        })
        const carrinho = await Carrinho.create({
            desconto: 10,
            usuarioId: usuario.id
        })
        const produto = await Produto.create({
            categoria: "Calçado",
            descricao: "Ardidas",
            valor: 20,
        })
        await CarrinhoProduto.create({
            produtoId: produto.id,
            carrinhoId: carrinho.id,
            quantidade: 2
        })
    }
}

function main() {
    auth()
    // createModels(true) -- Quando quiser adicionar dados inicias do banco
    createModels()
    console.log('Usuario', Usuario)
}

module.exports = { main, usuario: Usuario, Produto, Carrinho, CarrinhoProduto };