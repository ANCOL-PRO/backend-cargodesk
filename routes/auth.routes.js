const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // ✅ Importamos variables del .env
const db = require('../db');
const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const estado = 'pendiente';  // Todos los usuarios nuevos inician en 'pendiente'

  db.query(
    'INSERT INTO users (username, email, password, role, estado) VALUES (?, ?, ?, ?, ?)',
    [full_name, email, hashedPassword, role, estado],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
      res.json({ message: 'Usuario registrado correctamente' });
    }
  );
});

// Login de usuario
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // ✅ Firmar token usando la clave secreta del archivo .env
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        estado: user.estado
      }
    });
  });
});

// ✅ Aprobar usuario (admin)
router.put('/aprobar/:id', (req, res) => {
  const { id } = req.params;

  db.query('UPDATE users SET estado = "aprobado" WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al aprobar usuario' });
    res.json({ message: 'Usuario aprobado correctamente' });
  });
});

// ✅ Listar usuarios pendientes (admin)
router.get('/pendientes', (req, res) => {
  db.query('SELECT * FROM users WHERE estado = "pendiente"', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios pendientes' });
    res.json(results);
  });
});

module.exports = router;
