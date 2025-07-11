const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const { protect, restrictTo } = require('../middleware/auth');

// Crear pedido (cualquier usuario autenticado)
router.post('/', protect, async (req, res) => {
  try {
    const pedidoData = req.body;
    pedidoData.usuario = req.usuario.id;

    const pedido = new Pedido(pedidoData);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error creando pedido' });
  }
});

// Listar pedidos
router.get('/', protect, async (req, res) => {
  try {
    let pedidos;
    if (req.usuario.rol === 'dueño') {
      pedidos = await Pedido.find().populate('usuario productos.producto');
    } else if (req.usuario.rol === 'delivery') {
      pedidos = await Pedido.find({ estado: 'en reparto' }).populate('usuario productos.producto');
    } else {
      pedidos = [];
    }
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// Actualizar estado del pedido (solo dueño)
router.patch('/:id/estado', protect, restrictTo('dueño'), async (req, res) => {
  try {
    const { estado } = req.body;
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    pedido.estado = estado;
    await pedido.save();

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado' });
  }
});

module.exports = router;
