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
      disponible,
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

// ✅ Obtener un producto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto' });
  }
});

// ✅ Actualizar producto (solo "owner")
router.put('/:id', protect, restrictTo('owner'), async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!productoActualizado) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ message: 'Producto actualizado correctamente', producto: productoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto' });
  }
});

// ✅ Eliminar producto (solo "owner")
router.delete('/:id', protect, restrictTo('owner'), async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!productoEliminado) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el producto' });
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
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto creado correctamente
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso prohibido (no es owner)
 *       500:
 *         description: Error al crear el producto
 */

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtener un producto por ID (público)
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a obtener
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 *
 *   put:
 *     summary: Actualizar un producto por ID (requiere rol owner)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoInput'
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto actualizado correctamente
 *                 producto:
 *                   $ref: '#/components/schemas/Producto'
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso prohibido (no es owner)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al actualizar el producto
 *
 *   delete:
 *     summary: Eliminar un producto por ID (requiere rol owner)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Producto eliminado correctamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso prohibido (no es owner)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al eliminar el producto
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
 *     Producto:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del producto
 *           example: 64c9e9f1a5b72c001f2a8e3f
 *         category:
 *           type: string
 *           example: sushi
 *         name:
 *           type: string
 *           example: Roll de salmón
 *         description:
 *           type: string
 *           example: Roll de salmón fresco con aguacate
 *         price:
 *           type: number
 *           example: 1200.5
 *         image:
 *           type: string
 *           example: https://misitio.com/images/salmon-roll.jpg
 *         disponible:
 *           type: boolean
 *           example: true
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           example: 2023-07-20T15:23:30.000Z
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
 *           example: sushi
 *         name:
 *           type: string
 *           example: Roll de salmón
 *         description:
 *           type: string
 *           example: Roll de salmón fresco con aguacate
 *         price:
 *           type: number
 *           example: 1200.5
 *         image:
 *           type: string
 *           example: https://misitio.com/images/salmon-roll.jpg
 *         disponible:
 *           type: boolean
 *           example: true
 */
