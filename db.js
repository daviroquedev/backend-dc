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

auth()



// Modelo: Usuario

async function createModels() {
    const { DataTypes } = Sequelize

    const Usuario = sequelize.define('usuario', {
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

    const Carrinho = sequelize.define('carrinho', {
        desconto: {
            type: DataTypes.DECIMAL,
        },
    })
    Carrinho.belongsTo(Usuario)
    Usuario.hasOne(Carrinho)
    await Carrinho.sync();

    const usuario = await Usuario.create({
        username: 'username4',
        email: "alla4@email.com",
        password: '0123456789',
    })

    const carrinho = await Carrinho.create({
        desconto: 10,
        usuario
    })
    console.log(usuario)
}

createModels()