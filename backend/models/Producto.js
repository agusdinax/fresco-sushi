const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  disponible: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', ProductoSchema);
