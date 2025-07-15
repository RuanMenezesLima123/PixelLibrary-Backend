const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const favoritoSchema = new mongoose.Schema({}, { strict: false });
const Favorito = mongoose.model('Favorito', favoritoSchema, 'favoritos');

// POST: Salvar favorito, evitando duplicatas
router.post('/', async (req, res) => {
  const { email, jogo } = req.body;

  try {
    const jaExiste = await Favorito.findOne({
      email: email,
      'jogo.id': jogo.id
    });

    if (jaExiste) {
      return res.status(409).json({ msg: 'Este jogo já foi favoritado.' });
    }

    await Favorito.create(req.body);
    res.status(201).json({ msg: 'Jogo favoritado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao salvar favorito.', error: err.message });
  }
});

router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ msg: 'O parâmetro email é obrigatório.' });
  }

  try {
    const favoritos = await Favorito.find({ email });
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar favoritos.', error: err.message });
  }
});


module.exports = router;
