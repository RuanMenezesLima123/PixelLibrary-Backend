const express = require('express');
const router = express.Router();
const User = require('./models/User');

// REGISTRO
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'Usuário já existe.' });

    const newUser = new User({
      email,
      passwordHash: password,
      createdAt: new Date()
    });

    await newUser.save();
    res.status(201).json({ msg: 'Usuário registrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao registrar usuário.', error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, passwordHash: password });

    if (!user) return res.status(401).json({ msg: 'Credenciais inválidas.' });

    res.json({
      msg: 'Login bem-sucedido!',
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao fazer login.', error: err.message });
  }
});

module.exports = router;
