const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const db = require('../db'); // Este debe usar pg.Pool
const router = express.Router();

// ✅ Registro de usuario
router.post('/register', async (req, res) => {
  const { full_name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const estado = 'pendiente';

  const query = `
    INSERT INTO users (username, email, password, role, estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, username, email, role, estado
  `;

  db.query(query, [full_name, email, hashedPassword, role, estado])
    .then(result => {
      res.json({
        message: 'Usuario registrado correctamente',
        user: result.rows[0]
      });
    })
    .catch(err => {
      console.error('Error al registrar usuario:', err);
      res.status(500).json({ error: 'Error al registrar usuario' });
    });
});

// ✅ Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = $1', [email])
    .then(async result => {
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

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
    })
    .catch(err => {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ error: 'Error en el login' });
    });
});

// ✅ Aprobar usuario (solo admin)
router.put('/aprobar/:id', (req, res) => {
  const { id } = req.params;

  db.query('UPDATE users SET estado = $1 WHERE id = $2', ['aprobado', id])
    .then(() => res.json({ message: 'Usuario aprobado correctamente' }))
    .catch(err => {
      console.error('Error al aprobar usuario:', err);
      res.status(500).json({ error: 'Error al aprobar usuario' });
    });
});

// ✅ Listar usuarios pendientes
router.get('/pendientes', (req, res) => {
  db.query('SELECT * FROM users WHERE estado = $1', ['pendiente'])
    .then(result => res.json(result.rows))
    .catch(err => {
      console.error('Error al obtener usuarios pendientes:', err);
      res.status(500).json({ error: 'Error al obtener usuarios pendientes' });
    });
});

module.exports = router;
