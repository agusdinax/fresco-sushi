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

// POST /api/pedidos/publico — sin autenticación
router.post('/publico', async (req, res) => {
  try {
    const { nombreCliente, telefono, productos, total } = req.body;

    if (!nombreCliente || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevoPedido = new Pedido({
      nombreCliente,
      telefono,
      productos,
      total
    });

    await nuevoPedido.save();
    res.status(201).json({ message: 'Pedido creado correctamente', pedido: nuevoPedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
});


module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Gestión de pedidos
 */

/**
 * @swagger
 * /api/pedidos/publico:
 *   post:
 *     summary: Crear un pedido sin autenticación (cliente público)
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreCliente
 *               - productos
 *               - total
 *             properties:
 *               nombreCliente:
 *                 type: string
 *               telefono:
 *                 type: string
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto
 *                     - cantidad
 *                     - precio
 *                   properties:
 *                     producto:
 *                       type: string
 *                       description: ID del producto
 *                     cantidad:
 *                       type: number
 *                     precio:
 *                       type: number
 *               total:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 pedido:
 *                   $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Datos incompletos
 *       500:
 *         description: Error al crear el pedido
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Pedido:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         nombreCliente:
 *           type: string
 *         telefono:
 *           type: string
 *         productos:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               producto:
 *                 type: string
 *                 description: ID del producto
 *               cantidad:
 *                 type: number
 *               precio:
 *                 type: number
 *         total:
 *           type: number
 *         estado:
 *           type: string
 *           enum: [pendiente, en preparación, en reparto, entregado]
 *         fechaPedido:
 *           type: string
 *           format: date-time
 */