const express = require("express");
require("dotenv").config({ path: "./config/DBconfig/.env" });
const rutasProducto = require("./routes/productosRutas");
const loginRutas = require("./routes/loginRutas");
const infoRutas = require("./routes/infoRutas");
const randomsRutas = require("./routes/randomsRutas");
const { engine } = require("express-handlebars");
const { Server: ioServer } = require("socket.io");
const http = require("http");
const ContenedorMensajes = require("./persistencia/mensajesContainer");
const ContenedorProductos = require("./persistencia/productosContainer");
const { knexProducts } = require("./config/DBconfig/DBconfigProductos");
const mongo = require('./config/DBconfig/DBconfigMensajes')
const mensajeSchema = require("./schemas/mensajeSchema");
const { inspect } = require("util");
const session = require("express-session");
const passport = require("passport");
const pass = require("./passport/local");
const parseArgs = require("minimist");
const compression = require("compression");
const logger = require("./config/winstonConfig");
const sessionConfig = require("./config/DBconfig/MongosessionConfig");
const { getProductosController, addNewProduct } = require("./controllers/productosControllers");
const app = express();

//SERVIDOR HTTP CON FUNCIONALIDADES DE APP (EXPRESS)
const httpServer = http.createServer(app);
//SERVIDOR WEBSOCKET CON FUNCIONALIDADES DE HTTP
const socketServer = new ioServer(httpServer);

//middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session(sessionConfig)
);
app.use(passport.initialize());
app.use(passport.session());
//middleware para cargar archivos
app.use(express.static(__dirname + "/public"));

//MOTOR DE PLANTILLAS
app.set("view engine", "hbs");
///CONFIGURACION HANDLEBARS
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

//DONDE ESTAN LOS ARCHIVOS DE PLANTILLA
app.set("views", "/views");

const mensajesDB = new ContenedorMensajes("mensajes", mensajeSchema);
const productosDB = new ContenedorProductos(knexProducts, "productos");


socketServer.on("connection", (socket) => {
  getProductosController
    .then((productos) => {
      socket.emit("datosTabla", productos);
    })
    
  socket.on("nuevo-producto", async (producto) => {
    await addNewProduct(producto)
    getProductosController
      .then((productos) => {
        socketServer.sockets.emit("datosTabla", productos);
      })
      
  });

  mensajesDB
    .getAllMessages()
    .then((res) => {
      //console.log(JSON.stringify(res));
      const data = normalizar(JSON.parse(JSON.stringify(res)));
      console.log("DATA NORMALIZADA", inspect(data, false, 12, true));
      socket.emit("datosMensajes", data);
    })
    .catch((err) => {
      logger.error(err);
    });

  socket.on("nuevo-mensaje", async (mensaje) => {
    console.log(mensaje);
    await mensajesDB.save(mensaje);
    await mensajesDB
      .getAllMessages()
      .then((res) => {
        const data = normalizar(JSON.parse(JSON.stringify(res)));
        socketServer.sockets.emit("datosMensajes", data);
      })
      .catch((err) => {
        logger.error(err);
      });
  });
});

function logWinston(req, res, next) {
  logger.info(`Ruta ${req.originalUrl}, method ${req.method}`);
  next();
}
//RUTAS
app.use("/productos", logWinston, rutasProducto);
app.use("/info", logWinston, infoRutas);
app.use("/api/randoms", logWinston, randomsRutas);
app.use("/", logWinston, loginRutas);
app.get("*.ico", function () {});
/* app.use("*", (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  if (err) {
    logger.warn(`ruta inexistente`);
    res.send(`ruta inexistente`);
  }
}); */
//PUERTO


const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, () => {
  logger.info(`Sever started on ${PORT} proceso ${process.pid}`);
});
//por si hay errores en el servidor
server.on("error", (error) => logger.error(`error en el servidor ${error}`));
