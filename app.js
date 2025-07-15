require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: [
    'https://ruamnenezeslimal23.github.io', // frontend no GitHub Pages
    'http://localhost:3000'                 // Para desenvolvimento local
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'] // Métodos permitidos
}));
app.use(express.static(path.join(__dirname, 'public')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://pixel_user:Pixel2025@users.q6waunv.mongodb.net/pixelLibraryDB?retryWrites=true&w=majority&appName=Users')
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

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});
