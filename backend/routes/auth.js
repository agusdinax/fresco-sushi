const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registro
router.post('/register', async (req, res) => {
  const { nombre,nombreUsuario, email, password, rol } = req.body;
  console.log(nombreUsuario)
  try {
    const userExists = await Usuario.findOne({ nombreUsuario });
    if (userExists) return res.status(400).json({ message: 'Usuario ya registrado' });

    const usuario = new Usuario({ nombre, nombreUsuario, email, password, rol });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { nombreUsuario, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ nombreUsuario });
    if (!usuario) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos', usuario:nombreUsuario });
    }

    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // ✅ Asegurate de devolver también el rol
    res.json({
      token,
      rol: usuario.rol,
      nombre: usuario.nombre, // opcional: podés usarlo en Sidebar
      id: usuario._id, // si lo necesitás para frontend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en login' });
  }
});

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [owner, delivery]
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente con token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Email ya registrado
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Email o contraseña incorrectos
 *       500:
 *         description: Error en el servidor
 */