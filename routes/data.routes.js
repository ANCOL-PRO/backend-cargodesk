const express = require('express');
const db = require('../db');
const router = express.Router();

router.post('/', (req, res) => {
  const { nombre, descripcion } = req.body;

  db.query('INSERT INTO datos (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error al guardar datos' });
      res.json({ message: 'Datos guardados correctamente' });
    });
});

router.get('/', (req, res) => {
  db.query('SELECT * FROM datos', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener datos' });
    res.json(results);
  });
});

module.exports = router;
