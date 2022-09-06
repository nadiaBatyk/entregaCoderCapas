
const Contenedor = require("../persistencia/contenedor");
const mensajeSchema = require("../schemas/mensajeSchema");

const mensajesDB = new Contenedor("mensajes",mensajeSchema);
async function obtenerMensajes() {
  return await mensajesDB.getAll();
}
async function agregarMensaje(mensaje){
    return await mensajesDB.save(mensaje)
}
module.exports = {obtenerMensajes,agregarMensaje}