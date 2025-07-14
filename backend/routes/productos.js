const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { protect, restrictTo } = require('../middleware/auth');

// ✅ Crear producto (solo "owner")
router.post('/', protect, restrictTo('owner'), async (req, res) => {
  try {
    const { category, name, description, price, image, disponible } = req.body;

    const nuevoProducto = new Producto({
      category,
      name,
      description,
      price,
      image,
      disponible
    });

    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado correctamente', producto: nuevoProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el producto' });
  }
});

// ✅ Obtener todos los productos (público)
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ fechaCreacion: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos con filtros opcionales
 *     tags: [Productos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (insensible a mayúsculas)
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *         description: Filtrar por disponibilidad
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error al obtener productos
 *
 *   post:
 *     summary: Crear un nuevo producto (requiere rol owner)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       500:
 *         description: Error al crear el producto
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del producto
 *         category:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         disponible:
 *           type: boolean
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *
 *     ProductoInput:
 *       type: object
 *       required:
 *         - category
 *         - name
 *         - price
 *       properties:
 *         category:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         disponible:
 *           type: boolean
 */