// src/components/listings/ListingEditor.js
import React, { useState, useCallback } from 'react';
import { 
  Card, FormLayout, TextField, Button, Page, 
  Layout, Banner, Tabs, Select, BlockStack, Text
} from '@shopify/polaris';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';
import EquipmentSelector from './EquipmentSelector';

export default function ListingEditor() {
  const { user } = useAuth();
  
  // État pour le formulaire multi-étapes
  const [currentStep, setCurrentStep] = useState(0);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    type: '',
    adresse: {
      rue: '',
      ville: '',
      codePostal: '',
      pays: 'France',
    },
    tarifs: {
      min: '',
      max: '',
      semaine_standard: '',
      weekend_standard: '',
      semaine_vacances: '',
      weekend_vacances: '',
      jours_speciaux: ''
    },
    zone_vacances: '',
    equipements: [],
    photos: []
  });
  
  // États pour les messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Options pour les types d'hébergement
  const typeOptions = [
    { label: 'Chambre d\'hôte', value: 'chambre_hote' },
    { label: 'Gîte', value: 'gite' },
    { label: 'Appartement', value: 'appartement' },
    { label: 'Maison', value: 'maison' },
    { label: 'Hôtel', value: 'hotel' },
    { label: 'Cabane', value: 'cabane' },
    { label: 'Autre', value: 'autre' }
  ];
  
  // Options pour les zones de vacances scolaires
  const zoneOptions = [
    { label: 'Zone A', value: 'A' },
    { label: 'Zone B', value: 'B' },
    { label: 'Zone C', value: 'C' }
  ];

  // Définition des étapes du formulaire
  const steps = [
    { id: 'basic', title: 'Informations de base' },
    { id: 'location', title: 'Localisation' },
    { id: 'equipment', title: 'Équipements' },
    { id: 'pricing', title: 'Tarification' },
    { id: 'photos', title: 'Photos' },
    { id: 'review', title: 'Récapitulatif' }
  ];

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
  
  // Fonction pour gérer les changements d'équipements
  const handleEquipmentChange = (selectedEquipments) => {
    setFormData(prev => ({
      ...prev,
      equipements: selectedEquipments
    }));
  };

  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
          adresse: formData.adresse,
          tarif_min: formData.tarifs.min,
          tarif_max: formData.tarifs.max,
          tarif_semaine_standard: formData.tarifs.semaine_standard,
          tarif_weekend_standard: formData.tarifs.weekend_standard,
          tarif_semaine_vacances: formData.tarifs.semaine_vacances,
          tarif_weekend_vacances: formData.tarifs.weekend_vacances,
          tarif_jours_speciaux: formData.tarifs.jours_speciaux,
          zone_vacances: formData.zone_vacances,
          equipements: formData.equipements,
          user_id: user.id,
          status: 'draft'
        }])
        .select();
        
      if (error) throw error;
      
      // 2. Créer le produit correspondant dans Shopify
      // Ceci reste à implémenter via la fonction Netlify
      
      // Afficher le succès
      setSuccess(true);
      // Réinitialiser le formulaire
      setFormData({
        nom: '',
        description: '',
        type: '',
        adresse: {
          rue: '',
          ville: '',
          codePostal: '',
          pays: 'France',
        },
        tarifs: {
          min: '',
          max: '',
          semaine_standard: '',
          weekend_standard: '',
          semaine_vacances: '',
          weekend_vacances: '',
          jours_speciaux: ''
        },
        zone_vacances: '',
        equipements: [],
        photos: []
      });
      setCurrentStep(0);
      
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors de la création de l\'hébergement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Contenu des différentes étapes du formulaire
  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Informations de base
        return (
          <Card sectioned>
            <FormLayout>
              <TextField
                label="Nom de l'hébergement"
                value={formData.nom}
                onChange={(value) => handleChange(value, 'nom')}
                required
                helpText="Choisissez un nom accrocheur pour votre Love Room"
              />
              
              <Select
                label="Type d'hébergement"
                options={typeOptions}
                value={formData.type}
                onChange={(value) => handleChange(value, 'type')}
                required
              />
              
              <TextField
                label="Description"
                value={formData.description}
                onChange={(value) => handleChange(value, 'description')}
                multiline={4}
                required
                helpText="Décrivez votre hébergement en détail"
              />
            </FormLayout>
          </Card>
        );
        
      case 1: // Localisation
        return (
          <Card sectioned>
            <FormLayout>
              <TextField
                label="Adresse"
                value={formData.adresse.rue}
                onChange={(value) => handleChange(value, 'adresse.rue')}
                required
              />
              
              <FormLayout.Group>
                <TextField
                  label="Ville"
                  value={formData.adresse.ville}
                  onChange={(value) => handleChange(value, 'adresse.ville')}
                  required
                />
                
                <TextField
                  label="Code postal"
                  value={formData.adresse.codePostal}
                  onChange={(value) => handleChange(value, 'adresse.codePostal')}
                  type="text"
                  required
                />
              </FormLayout.Group>
              
              <Select
                label="Pays"
                options={[{ label: 'France', value: 'France' }]}
                value={formData.adresse.pays}
                onChange={(value) => handleChange(value, 'adresse.pays')}
                required
              />
            </FormLayout>
          </Card>
        );
        
      case 2: // Équipements
        return (
          <EquipmentSelector 
            selectedEquipments={formData.equipements} 
            onChange={handleEquipmentChange} 
          />
        );
        
      case 3: // Tarification
        return (
          <Card sectioned>
            <FormLayout>
              <Text as="h2">Tarifs standards</Text>
              <FormLayout.Group>
                <TextField
                  label="Prix minimum (€)"
                  value={formData.tarifs.min}
                  onChange={(value) => handleChange(value, 'tarifs.min')}
                  type="number"
                  required
                  helpText="Prix le plus bas possible"
                />
                
                <TextField
                  label="Prix maximum (€)"
                  value={formData.tarifs.max}
                  onChange={(value) => handleChange(value, 'tarifs.max')}
                  type="number"
                  required
                  helpText="Prix le plus élevé possible"
                />
              </FormLayout.Group>
              
              <Text as="h2">Détail des tarifs</Text>
              <FormLayout.Group>
                <TextField
                  label="Tarif semaine standard (lun-jeu)"
                  value={formData.tarifs.semaine_standard}
                  onChange={(value) => handleChange(value, 'tarifs.semaine_standard')}
                  type="number"
                  suffix="€"
                />
                
                <TextField
                  label="Tarif weekend standard (ven-dim)"
                  value={formData.tarifs.weekend_standard}
                  onChange={(value) => handleChange(value, 'tarifs.weekend_standard')}
                  type="number"
                  suffix="€"
                />
              </FormLayout.Group>
              
              <Select
                label="Votre zone (vacances scolaires)"
                options={zoneOptions}
                value={formData.zone_vacances}
                onChange={(value) => handleChange(value, 'zone_vacances')}
              />
              
              <FormLayout.Group>
                <TextField
                  label="Tarif semaine vacances scolaires (lun-jeu)"
                  value={formData.tarifs.semaine_vacances}
                  onChange={(value) => handleChange(value, 'tarifs.semaine_vacances')}
                  type="number"
                  suffix="€"
                />
                
                <TextField
                  label="Tarif weekend vacances scolaires (ven-dim)"
                  value={formData.tarifs.weekend_vacances}
                  onChange={(value) => handleChange(value, 'tarifs.weekend_vacances')}
                  type="number"
                  suffix="€"
                />
              </FormLayout.Group>
              
              <TextField
                label="Tarif jours spéciaux (Saint Valentin, Nouvel An...)"
                value={formData.tarifs.jours_speciaux}
                onChange={(value) => handleChange(value, 'tarifs.jours_speciaux')}
                type="number"
                suffix="€"
              />
            </FormLayout>
          </Card>
        );
        
      case 4: // Photos
        return (
          <Card sectioned>
            <Text variation="subdued">
              Cette fonctionnalité est en cours de développement. Vous pourrez bientôt ajouter des photos à votre hébergement.
            </Text>
          </Card>
        );
        
      case 5: // Récapitulatif
        return (
          <Card sectioned>
            <BlockStack>
              <Text variation="strong">Récapitulatif de votre hébergement</Text>
              
              <Card.Section title="Informations de base">
                <BlockStack gap="200">
                  <p><Text variation="strong">Nom:</Text> {formData.nom}</p>
                  <p><Text variation="strong">Type:</Text> {formData.type}</p>
                  <p><Text variation="strong">Description:</Text> {formData.description}</p>
                </BlockStack>
              </Card.Section>
              
              <Card.Section title="Localisation">
                <p>{formData.adresse.rue}, {formData.adresse.codePostal} {formData.adresse.ville}, {formData.adresse.pays}</p>
              </Card.Section>
              
              <Card.Section title="Équipements">
                <BlockStack gap="200">
                  {formData.equipements.map(equipment => (
                    <span key={equipment} className="tag">{equipment}</span>
                  ))}
                </BlockStack>
              </Card.Section>
              
              <Card.Section title="Tarification">
                <BlockStack gap="200">
                  <p><Text variation="strong">Prix min/max:</Text> {formData.tarifs.min}€ - {formData.tarifs.max}€</p>
                  <p><Text variation="strong">Semaine standard:</Text> {formData.tarifs.semaine_standard}€</p>
                  <p><Text variation="strong">Weekend standard:</Text> {formData.tarifs.weekend_standard}€</p>
                  <p><Text variation="strong">Zone vacances:</Text> {formData.zone_vacances}</p>
                </BlockStack>
              </Card.Section>
            </BlockStack>
          </Card>
        );
        
      default:
        return null;
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
          
          <Card>
            <Tabs
              tabs={steps.map((step, index) => ({
                id: step.id,
                content: step.title,
                accessibilityLabel: step.title,
                panelID: step.id,
                active: currentStep === index
              }))}
              selected={currentStep}
              onSelect={setCurrentStep}
              fitted
            />
            
            <FormLayout onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === steps.length - 1) {
                handleSubmit();
              } else {
                handleNextStep();
              }
            }}>
              {renderStepContent()}
              
              <Card.Section>
                <BlockStack gap="400">
                  <Button 
                    onClick={handlePrevStep}
                    disabled={currentStep === 0}
                  >
                    Précédent
                  </Button>
                  
                  {currentStep === steps.length - 1 ? (
                    <Button primary submit loading={loading}>
                      Soumettre l'hébergement
                    </Button>
                  ) : (
                    <Button primary onClick={handleNextStep}>
                      Suivant
                    </Button>
                  )}
                </BlockStack>
              </Card.Section>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}