const mongoose = require('mongoose');

// Aceita qualquer estrutura de documento
const userSchema = new mongoose.Schema({}, { strict: false });

// Usa exatamente a coleção existente chamada "users"
module.exports = mongoose.model('User', userSchema, 'users');
