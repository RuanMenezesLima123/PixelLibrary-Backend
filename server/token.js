const axios = require('axios');

let tokenCache = {
  value: null,
  expiresAt: 0
};

async function getIGDBToken() {
  // Verifica se tem token válido no cache
  if (tokenCache.value && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
  }

  try {
    const response = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      null,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials'
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Calcula o tempo de expiração (com margem de segurança)
    const expiresIn = (response.data.expires_in || 86400) * 1000;
    tokenCache = {
      value: response.data.access_token,
      expiresAt: Date.now() + expiresIn - 60000 // 1 minuto antes de expirar
    };

    return tokenCache.value;
  } catch (error) {
    console.error('Erro ao obter token:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a IGDB');
  }
}

module.exports = getIGDBToken;