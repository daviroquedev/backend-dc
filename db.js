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
                length: 10
            }
        },
    })
    await Usuario.sync({ force: true });

    const Carrinho = sequelize.define('carrinho', {
        desconto: {
            type: DataTypes.DECIMAL,
        },
    })
    Carrinho.belongsTo(Usuario)
    await Carrinho.sync({ force: true });
}

createModels()