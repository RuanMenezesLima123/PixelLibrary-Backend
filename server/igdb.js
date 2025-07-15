const express = require('express');
const axios = require('axios');
const router = express.Router();
const getIGDBToken = require('./token');

// Middleware para autenticação IGDB
const authenticateIGDB = async (req, res, next) => {
  try {
    const token = await getIGDBToken();
    req.igdbHeaders = {
      'Client-ID': process.env.CLIENT_ID,
      'Authorization': `Bearer ${token}`
    };
    next();
  } catch (error) {
    console.error('Erro na autenticação IGDB:', error.message);
    res.status(500).json({ erro: 'Erro de autenticação com a IGDB' });
  }
};

// 🔍 Rota de busca por jogo específico
router.post('/jogos', authenticateIGDB, async (req, res) => {
  const { query } = req.body;

  try {
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `search "${query}"; 
       fields name, cover.url, first_release_date, genres.name, rating, 
              involved_companies.company.name, summary; 
       limit 10;`,
      { headers: req.igdbHeaders }
    );

    const jogos = response.data.filter(jogo => jogo.cover);
    res.json(jogos.length > 0 ? jogos : []);
  } catch (error) {
    console.error('Erro na rota /jogos:', error.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao buscar jogos' });
  }
});

// ⭐ Rota para recomendações
router.get('/jogos/recomendacoes', authenticateIGDB, async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `fields name, cover.url, rating, popularity; 
       where cover != null & rating >= 80;
       sort popularity desc; 
       limit 12;`,
      { headers: req.igdbHeaders }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar recomendações:', error);
    res.status(500).json({ erro: 'Erro ao buscar recomendações' });
  }
});

// 🆕 Rota para novidades
router.get('/novidades', authenticateIGDB, async (req, res) => {
  try {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const twoMonthsAgo = currentTimestamp - (60 * 60 * 24 * 60);

    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `fields name, cover.url, first_release_date, genres.name, rating;
       where first_release_date >= ${twoMonthsAgo} & cover != null;
       sort first_release_date desc;
       limit 8;`,
      { headers: req.igdbHeaders }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar novidades:', error);
    res.status(500).json({ erro: 'Erro ao buscar novidades' });
  }
});

// 🎮 Rota para buscar por categoria/gênero
router.get('/jogos/categoria/:genero', authenticateIGDB, async (req, res) => {
  try {
    const { genero } = req.params;
    
    // Busca o ID do gênero
    const genreResponse = await axios.post(
      'https://api.igdb.com/v4/genres',
      `fields id; where name ~ "${genero}"*; limit 1;`,
      { headers: req.igdbHeaders }
    );
    
    if (genreResponse.data.length === 0) {
      return res.json([]);
    }
    
    const genreId = genreResponse.data[0].id;
    
    // Busca jogos com esse gênero
    const gamesResponse = await axios.post(
      'https://api.igdb.com/v4/games',
      `fields name, cover.url, genres.name, rating;
       where genres = ${genreId} & cover != null;
       sort popularity desc;
       limit 12;`,
      { headers: req.igdbHeaders }
    );
    
    res.json(gamesResponse.data);
  } catch (error) {
    console.error('Erro ao buscar por categoria:', error);
    res.status(500).json({ erro: 'Erro ao buscar por categoria' });
  }
});

module.exports = router;
