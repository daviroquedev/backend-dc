var createError = require("http-errors"); // lib de tratar errors
var express = require("express"); // lib do express
var cors = require('cors')
app.use(cors())

var logger = require("morgan"); // lib lib log (coloca no console o que esta acontecendo no servidor)

var indexRouter = require("./routes/index");
var produtosRouter = require("./routes/produtos");
var userRouter = require("./routes/users")
var carroCompras = require("./routes/carrinhos")
var app = express();

const db = require('./db')
db.main()
console.log('app.js', db.usuario)

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rotas - Modificar para adicionar rotas
app.use("/", indexRouter);
app.use("/produtos", produtosRouter);
app.use("/users", userRouter);
app.use("/carrinho", carroCompras);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;