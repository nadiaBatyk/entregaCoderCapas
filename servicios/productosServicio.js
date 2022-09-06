
const Contenedor = require("../persistencia/contenedor");
const productoSchema = require("../schemas/productoSchema");

const productosDB = new Contenedor("productos",productoSchema);
async function obtenerProductos() {
  return await productosDB.getAll();
}
async function agregarProducto(producto){
    return await productosDB.save(producto)
}
module.exports = {obtenerProductos,agregarProducto}