import SHOPIFY_CONFIG from '../config/shopify';

// Fonction pour créer un produit (hébergement) dans Shopify
export const createShopifyProduct = async (hebergementData) => {
  try {
    const response = await fetch(`/api/shopify/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: {
          title: hebergementData.nom,
          body_html: hebergementData.description,
          vendor: `Propriétaire: ${hebergementData.proprietaire.nom}`,
          product_type: hebergementData.type,
          variants: [
            {
              price: hebergementData.tarifs.min,
              compare_at_price: hebergementData.tarifs.max,
              requires_shipping: false,
              taxable: true,
            }
          ],
          images: hebergementData.photos.map(photo => ({
            src: photo.url,
            position: photo.position
          }))
        }
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création du produit Shopify:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un produit existant
export const updateShopifyProduct = async (productId, hebergementData) => {
  try {
    const response = await fetch(`/api/shopify/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product: {
          title: hebergementData.nom,
          body_html: hebergementData.description,
          variants: [
            {
              price: hebergementData.tarifs.min,
              compare_at_price: hebergementData.tarifs.max,
            }
          ],
          images: hebergementData.photos.map(photo => ({
            src: photo.url,
            position: photo.position
          }))
        }
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit Shopify:', error);
    throw error;
  }
};