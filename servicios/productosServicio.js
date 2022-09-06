const { knexProducts } = require("../config/DBconfig/DBconfigProductos");
const ContenedorProductos = require("../persistencia/productosContainer");

const productosDB = new ContenedorProductos(knexProducts, "productos");
async function obtenerProductos() {
  return await productosDB.getAll();
}
async function agregarProducto(producto){
    return await productosDB.save(producto)
}
module.exports = {obtenerProductos,agregarProducto}