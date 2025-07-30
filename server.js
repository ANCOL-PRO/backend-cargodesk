const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

const authRoutes = require('./routes/auth.routes');
const dataRoutes = require('./routes/data.routes');
const uploadRoutes = require('./routes/upload.routes');
const auctionsRoutes = require('./routes/auctions.routes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/auctions', auctionsRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});

