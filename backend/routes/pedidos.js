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

    if (req.usuario.rol === 'owner') {
      pedidos = await Pedido.find();
    } else if (req.usuario.rol === 'delivery') {
      pedidos = await Pedido.find({ estado: 'en reparto' }); 
    } else {
      pedidos = [];
    }

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// Actualizar estado del pedido (solo owner)
router.patch('/:id/estado', protect, restrictTo('owner'), async (req, res) => {
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
    const {
      nombreCliente,
      telefono,
      productos,
      total,
      tipoEntrega,
      metodoPago,
      address, 
      comentario
    } = req.body;

    if (!nombreCliente || !productos || productos.length === 0 || !total) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const nuevoPedido = new Pedido({
      nombreCliente,
      telefono,
      productos,
      total,
      tipoEntrega,
      metodoPago,
      address, 
      comentario
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
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     ProductoPedido:
 *       type: object
 *       required:
 *         - producto
 *         - cantidad
 *         - precio
 *       properties:
 *         producto:
 *           type: string
 *           description: ID del producto
 *         cantidad:
 *           type: number
 *         precio:
 *           type: number
 *
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
 *             $ref: '#/components/schemas/ProductoPedido'
 *         total:
 *           type: number
 *         estado:
 *           type: string
 *           enum: [pendiente, en preparación, en reparto, entregado]
 *         fechaPedido:
 *           type: string
 *           format: date-time
 *         usuario:
 *           type: string
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
 *                   $ref: '#/components/schemas/ProductoPedido'
 *               total:
 *                 type: number
 *               tipoEntrega:
 *                 type: string
 *               metodoPago:
 *                 type: string
 *               address:
 *                 type: string
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
 * /api/pedidos:
 *   post:
 *     summary: Crear un pedido autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productos
 *               - total
 *             properties:
 *               productos:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductoPedido'
 *               total:
 *                 type: number
 *               tipoEntrega:
 *                 type: string
 *               metodoPago:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Error creando pedido
 */

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener pedidos (según rol)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Error al obtener pedidos
 */

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   patch:
 *     summary: Actualizar el estado de un pedido (solo owner)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, en preparación, en reparto, entregado]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error actualizando estado
 */
