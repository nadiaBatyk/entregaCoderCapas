
const { obtenerProductos, agregarProducto } = require("../servicios/productosServicio");

async function getProductosController() {
  return obtenerProductos()
}
async function addNewProduct(producto){
await agregarProducto(producto)
}
module.exports = { getProductosController,addNewProduct}