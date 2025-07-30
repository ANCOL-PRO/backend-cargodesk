const express = require('express');
const router = express.Router();

// Ruta para obtener todas las subastas
router.get('/auctions', (req, res) => {
  const subastas = [
    { id: 1, nombre: 'Subasta de prueba 1', estado: 'abierta' },
    { id: 2, nombre: 'Subasta de prueba 2', estado: 'cerrada' }
  ];
  res.json(subastas);
});

// Ruta para obtener una subasta por ID
router.get('/auctions/:id', (req, res) => {
  const subastas = [
    { id: 1, nombre: 'Subasta de prueba 1', estado: 'abierta' },
    { id: 2, nombre: 'Subasta de prueba 2', estado: 'cerrada' }
  ];

  const subasta = subastas.find(s => s.id === parseInt(req.params.id));
  if (subasta) {
    res.json(subasta);
  } else {
    res.status(404).json({ mensaje: 'Subasta no encontrada' });
  }
});

module.exports = router;
