const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  nombreCliente: { type: String, required: true },
  telefono: String,
  productos: [
    {
      producto: { type: String, required: true },
      cantidad: { type: Number, required: true },
      precio: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  metodoPago: { type: String, required: true },
  tipoEntrega: { type: String, required: true },
  address: { type: String},
  comentario: { type: String},
  estado: {
    type: String,
    enum: ['pendiente', 'en preparación', 'en reparto', 'entregado'],
    default: 'pendiente'
  },
  fechaPedido: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Pedido', PedidoSchema);