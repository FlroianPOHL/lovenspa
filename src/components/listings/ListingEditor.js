import React, { useState } from 'react';
import { Card, Form, FormLayout, TextField, Button, Page, Layout, Banner } from '@shopify/polaris';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import { createShopifyProduct } from '../../services/shopifyService';

export default function ListingEditor() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: '',
    tarifs: {
      min: '',
      max: ''
    },
    photos: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fonction pour gérer les changements de formulaire
  const handleChange = (value, field) => {
    if (field.includes('.')) {
      // Pour les champs imbriqués comme "tarifs.min"
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Pour les champs simples
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Enregistrer l'hébergement dans Supabase
      const { data, error } = await supabase
        .from('hebergements')
        .insert([{
          nom: formData.nom,
          description: formData.description,
          type: formData.type,
          tarif_min: formData.tarifs.min,
          tarif_max: formData.tarifs.max,
          user_id: user.id,
          status: 'draft'
        }])
        .select();
        
      if (error) throw error;
      
      // 2. Créer le produit correspondant dans Shopify
      const shopifyData = {
        product: {
          title: formData.nom,
          body_html: formData.description,
          vendor: `Propriétaire: ${user.nom || user.email}`,
          product_type: formData.type,
          variants: [
            {
              price: formData.tarifs.min,
              compare_at_price: formData.tarifs.max,
              requires_shipping: false,
              taxable: true,
            }
          ],
          images: formData.photos.map((photo, index) => ({
            src: photo.url,
            position: index + 1
          }))
        }
      };
      
      // Appel à notre fonction Netlify via l'API
      const response = await fetch('/api/shopify-product-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopifyData),
      });
      
      const shopifyResult = await response.json();
      
      // 3. Mettre à jour l'enregistrement avec l'ID du produit Shopify
      if (shopifyResult.product && shopifyResult.product.id) {
        await supabase
          .from('hebergements')
          .update({ 
            shopify_product_id: shopifyResult.product.id,
            shopify_product_handle: shopifyResult.product.handle
          })
          .eq('id', data[0].id);
      }
      
      // Afficher le succès
      setSuccess(true);
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        description: '',
        type: '',
        tarifs: {
          min: '',
          max: ''
        },
        photos: []
      });
      
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la création de l\'hébergement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Créer un nouvel hébergement">
      <Layout>
        <Layout.Section>
          {error && (
            <Banner status="critical" title="Erreur">
              {error}
            </Banner>
          )}
          
          {success && (
            <Banner status="success" title="Succès">
              L'hébergement a été créé avec succès et sera examiné par notre équipe.
            </Banner>
          )}
          
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Nom de l'hébergement"
                  value={formData.nom}
                  onChange={(value) => handleChange(value, 'nom')}
                  required
                />
                
                <TextField
                  label="Description"
                  value={formData.description}
                  onChange={(value) => handleChange(value, 'description')}
                  multiline={4}
                  required
                />
                
                <TextField
                  label="Type d'hébergement"
                  value={formData.type}
                  onChange={(value) => handleChange(value, 'type')}
                  required
                />
                
                <FormLayout.Group>
                  <TextField
                    label="Prix minimum (€)"
                    value={formData.tarifs.min}
                    onChange={(value) => handleChange(value, 'tarifs.min')}
                    type="number"
                    required
                  />
                  
                  <TextField
                    label="Prix maximum (€)"
                    value={formData.tarifs.max}
                    onChange={(value) => handleChange(value, 'tarifs.max')}
                    type="number"
                    required
                  />
                </FormLayout.Group>
                
                {/* Ici, vous pourriez ajouter un composant pour télécharger des photos */}
                
                <Button primary submit loading={loading}>
                  Soumettre l'hébergement
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}