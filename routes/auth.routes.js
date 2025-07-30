const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db'); // conexión PostgreSQL Supabase

// Registro de usuario
router.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const estado = 'pendiente';

  try {
    await pool.query(
      'INSERT INTO users (username, email, password, role, estado) VALUES ($1, $2, $3, $4, $5)',
      [full_name, email, hashedPassword, role, estado]
    );
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// 👇 Esta línea es FUNDAMENTAL
module.exports = router;
