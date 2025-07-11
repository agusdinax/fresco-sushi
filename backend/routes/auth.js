const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  try {
    const userExists = await Usuario.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email ya registrado' });

    const usuario = new Usuario({ nombre, email, password, rol });
    await usuario.save();

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

    const isMatch = await usuario.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Email o contraseña incorrectos' });

    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
  }
});

module.exports = router;
