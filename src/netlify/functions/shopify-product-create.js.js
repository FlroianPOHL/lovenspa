const axios = require('axios');

exports.handler = async (event, context) => {
  // Vérifier la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const shopifyStore = process.env.SHOPIFY_STORE_URL;
    const apiKey = process.env.SHOPIFY_API_KEY;
    const password = process.env.SHOPIFY_API_PASSWORD;
    
    // Extraire les données de la requête
    const data = JSON.parse(event.body);
    
    // Effectuer l'appel API vers Shopify
    const response = await axios({
      method: 'post',
      url: `https://${shopifyStore}/admin/api/2023-01/products.json`,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: apiKey,
        password: password
      },
      data: data
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log('Erreur:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};