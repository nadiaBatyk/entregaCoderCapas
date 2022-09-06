const {
  obtenerMensajes,
  agregarMensaje,
} = require("../servicios/mensajesServicio");

async function getMensajesController() {
  return obtenerMensajes();
}
async function sendNewMessage(mensaje) {
  await agregarMensaje(mensaje);
}
module.exports = { getMensajesController, sendNewMessage };
