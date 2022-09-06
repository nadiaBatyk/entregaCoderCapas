const express = require("express");
require("dotenv").config({ path: "./config/DBconfig/.env" });
const rutasProducto = require("./routes/productosRutas");
const loginRutas = require("./routes/loginRutas");
const infoRutas = require("./routes/infoRutas");
const randomsRutas = require("./routes/randomsRutas");
const { engine } = require("express-handlebars");
const { Server: ioServer } = require("socket.io");
const http = require("http");
const mongo = require("./config/DBconfig/DBConfig");
const { inspect } = require("util");
const session = require("express-session");
const passport = require("passport");
const pass = require("./passport/local");
const parseArgs = require("minimist");
const compression = require("compression");
const logger = require("./config/winstonConfig");
const sessionConfig = require("./config/DBconfig/MongosessionConfig");
const {
  getProductosController,
  addNewProduct,
} = require("./controllers/productosControllers");
const {
  getMensajesController,
  sendNewMessage,
} = require("./controllers/mensajeController");
const normalizar = require("./servicios/normalizr");
const logWinston = require("./utils/logger");
const app = express();

//SERVIDOR HTTP CON FUNCIONALIDADES DE APP (EXPRESS)
const httpServer = http.createServer(app);
//SERVIDOR WEBSOCKET CON FUNCIONALIDADES DE HTTP
const socketServer = new ioServer(httpServer);

//middlewares
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
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

socketServer.on("connection", async (socket) => {
  try {
    const productos = await getProductosController();
    socket.emit("datosTabla", productos);
  } catch (error) {
    logger.error(error);
  }

  socket.on("nuevo-producto", async (producto) => {
    try {
      await addNewProduct(producto);
      const productos = await getProductosController();
      socketServer.sockets.emit("datosTabla", productos);
    } catch (error) {
      logger.error(error);
    }
  });

  try {
    const mensajes = await getMensajesController();
    const data = normalizar(JSON.parse(JSON.stringify(mensajes)));
    socket.emit("datosMensajes", data);
  } catch (error) {
    logger.error(error);
  }

  socket.on("nuevo-mensaje", async (mensaje) => {
    try {
      await sendNewMessage(mensaje);
      const mensajes = await getMensajesController();
      const data = normalizar(JSON.parse(JSON.stringify(mensajes)));
      socket.emit("datosMensajes", data);
    } catch (error) {
      logger.error(error);
    }
  });
});


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
