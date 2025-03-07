// src/components/listings/EquipmentSelector.js
import React from 'react';
import { Card, ChoiceList, Text, BlockStack } from '@shopify/polaris';

// Liste des équipements formatée
const equipmentCategories = [
  {
    title: 'Confort & Commodités',
    items: [
      'Accès PMR',
      'Animaux de compagnie acceptés',
      'Climatisation',
      'Cuisine équipée',
      'Jardin',
      'Lit King Size',
      'Lit rond',
      'Machine à café',
      'Non-fumeur',
      'Parking Privé',
      'Serviettes de toilette',
      'Télévision',
      'wifi'
    ]
  },
  {
    title: 'Bien-être & Détente',
    items: [
      'Champagne',
      'Cheminée',
      'Douche XL',
      'Hammam',
      'Piscine extérieure',
      'Piscine intérieure',
      'Spa',
      'Spa de nage',
      'Table de massage'
    ]
  },
  {
    title: 'Équipements spéciaux',
    items: [
      'Barre de pole dance',
      'Croix de Saint-André',
      'Secret Room',
      'Sofa tantrique',
      'Télévision + chaînes adultes',
      'Vidéo',
      'Musique'
    ]
  },
  {
    title: 'Services & Options',
    items: [
      'Carte cadeau',
      'Chèques vacances ANCV',
      'Day use'
    ]
  }
];

export default function EquipmentSelector({ selectedEquipments, onChange }) {
  // Fonction pour gérer les changements de sélection par catégorie
  const handleCategoryChange = (category, values) => {
    // Récupérer tous les équipements actuellement sélectionnés
    const currentSelected = [...selectedEquipments];
    
    // Trouver les équipements de cette catégorie
    const categoryEquipments = equipmentCategories.find(cat => cat.title === category).items;
    
    // Filtrer les équipements actuels pour retirer ceux de la catégorie en cours
    const filteredEquipments = currentSelected.filter(
      item => !categoryEquipments.includes(item)
    );
    
    // Ajouter les nouveaux équipements sélectionnés
    const newSelectedEquipments = [...filteredEquipments, ...values];
    
    // Mettre à jour l'état parent
    onChange(newSelectedEquipments);
  };

  return (
    <Card>
      <Card.Section>
        <Text as="h2">Équipements disponibles</Text>
        <Text variation="subdued">
          Sélectionnez les équipements disponibles dans votre hébergement
        </Text>
      </Card.Section>

      <BlockStack gap="800">
        {equipmentCategories.map((category) => (
          <Card.Section key={category.title}>
            <Text as="h3">{category.title}</Text>
            <ChoiceList
              allowMultiple
              choices={category.items.map(item => ({
                label: item,
                value: item
              }))}
              selected={selectedEquipments.filter(item => 
                category.items.includes(item)
              )}
              onChange={(values) => handleCategoryChange(category.title, values)}
            />
          </Card.Section>
        ))}
      </BlockStack>
    </Card>
  );

}