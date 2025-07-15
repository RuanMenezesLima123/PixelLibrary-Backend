const mongoose = require('mongoose');

const avaliacaoSchema = new mongoose.Schema({
  jogoId: { type: Number, required: true },
  jogoNome: { type: String, required: true },
  email: { type: String, required: true },
  nome: { type: String, required: true },
  nota: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'A nota deve ser um número inteiro entre 1 e 5'
    }
  },
  texto: { type: String, required: true },
  data: { type: Date, default: Date.now }
});

// Índice para evitar avaliações duplicadas
avaliacaoSchema.index({ jogoId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model('Avaliacao', avaliacaoSchema);