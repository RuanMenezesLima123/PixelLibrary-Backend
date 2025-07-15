require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const allowedOrigins = ['https://ruanmenezeslima123.github.io'];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // No Content
  }

  next();
});



// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB (CORRIGIDO o nome da variável)
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://pixel_user:Pixel2025@users.q6waunv.mongodb.net/pixellibraryDB?retryWrites=true&w=majority')
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch((err) => console.error('❌ Erro na conexão com o MongoDB:', err));

// Rotas
const routes = [
  { path: '/api', router: require('./server/igdb') },
  { path: '/api/auth', router: require('./server/authRoutes') },
  { path: '/api/favoritos', router: require('./server/favoritosRoutes') },
  { path: '/api/avaliacoes', router: require('./server/avaliacaoRoutes') }
];

routes.forEach(({ path, router }) => {
  app.use(path, router);
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
