const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String, // Podés guardar una URL o path de imagen
    trim: true
  },
  disponible: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }, 
});

// El campo `id` no hace falta definirlo, MongoDB ya asigna _id automáticamente

module.exports = mongoose.model('Producto', ProductoSchema);
