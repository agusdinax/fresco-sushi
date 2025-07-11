const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { protect, restrictTo } = require('../middleware/auth');

// Crear producto (solo dueño)
router.post('/', protect, restrictTo('dueño'), async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// Listar productos
router.get('/', protect, async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

module.exports = router;
