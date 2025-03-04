// src/netlify/functions/shopify-product-create.js
const axios = require('axios');

exports.handler = async (event, context) => {
  // Vérification de la méthode HTTP
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  
  try {
    // Récupérer les informations de configuration de Shopify
    const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY, SHOPIFY_SHOP_URL } = process.env;
    
    // Vérifier que les variables d'environnement sont définies
    if (!SHOPIFY_API_KEY || !SHOPIFY_API_SECRET_KEY || !SHOPIFY_SHOP_URL) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Configuration Shopify manquante' })
      };
    }

    // Récupérer le corps de la requête
    const requestBody = JSON.parse(event.body);
    
    // Créer le produit dans Shopify
    const shopifyResponse = await axios({
      method: 'POST',
      url: `https://${SHOPIFY_SHOP_URL}/admin/api/2023-10/products.json`,
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_API_SECRET_KEY
      },
      data: requestBody
    });

    // Retourner la réponse de Shopify
    return {
      statusCode: 200,
      body: JSON.stringify(shopifyResponse.data)
    };
  } catch (error) {
    console.error('Erreur lors de la création du produit Shopify:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Erreur lors de la création du produit',
        details: error.message,
        ...(error.response ? { shopifyError: error.response.data } : {})
      })
    };
  }
};