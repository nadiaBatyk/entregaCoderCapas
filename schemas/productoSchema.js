const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, require: true, max: 100 },
  link: { type: String, require: true },
  precio: { type: Number, require: true, min: 0 },

  timestamp: { type: Date },
});
module.exports = productoSchema;
