const logger = require("../config/winstonConfig");
const { obtenerProductos, agregarProducto } = require("../servicios/productosServicio");

async function getProductosController() {
  return await obtenerProductos().catch((err) => {
    logger.error(err);
  })
}
async function addNewProduct(producto){
await agregarProducto(producto)
}
module.exports = { getProductosController,addNewProduct}