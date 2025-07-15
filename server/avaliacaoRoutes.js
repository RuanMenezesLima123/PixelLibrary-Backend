const express = require('express');
const router = express.Router();
const Avaliacao = require('./models/Avaliacao');

// POST - Nova avaliação
router.post('/', async (req, res) => {
  try {
    // Validar a nota
    if (!req.body.nota || typeof req.body.nota !== 'number' || req.body.nota < 1 || req.body.nota > 5) {
      return res.status(400).json({ msg: 'A nota deve ser um valor entre 1 e 5' });
    }

    // Verificar se usuário já avaliou este jogo
    const avaliacaoExistente = await Avaliacao.findOne({
      jogoId: req.body.jogoId,
      email: req.body.email
    });

    if (avaliacaoExistente) {
      return res.status(400).json({ 
        msg: 'Você já avaliou este jogo.',
        avaliacao: avaliacaoExistente
      });
    }

    const avaliacao = await Avaliacao.create(req.body);
    res.status(201).json({ msg: 'Avaliação salva!', avaliacao });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao salvar avaliação.', error: err.message });
  }
});

// GET - Buscar avaliações por jogo
router.get('/:jogoId', async (req, res) => {
  try {
    const avaliacoes = await Avaliacao.find({ jogoId: req.params.jogoId })
      .sort({ data: -1 }); // Ordenar por data decrescente
    res.status(200).json(avaliacoes);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar avaliações.', error: err.message });
  }
});

module.exports = router;