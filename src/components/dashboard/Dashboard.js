// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Page, Layout, Card, Button, EmptyState, 
  ResourceList, Avatar, Text, IndexFilters, 
  Badge, BlockStack, Banner, Spinner
} from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../supabase';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // États pour gérer les données et le chargement
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterValue, setFilterValue] = useState('all');
  const [envError, setEnvError] = useState(false);
  
  // Vérification des variables d'environnement à l'initialisation
  useEffect(() => {
    // Vérifier que Supabase est correctement configuré
    const checkEnvironment = () => {
      if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_KEY) {
        console.error('Variables d\'environnement Supabase manquantes');
        setEnvError(true);
        setLoading(false);
      }
    };
    
    checkEnvironment();
  }, []);
  
  // Charger les hébergements de l'utilisateur au chargement du composant
  useEffect(() => {
    const fetchListings = async () => {
      if (!user || envError) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('hebergements')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setListings(data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des hébergements:", err);
        setError("Impossible de charger vos hébergements. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchListings();
  }, [user, envError]);
  
  // Fonction pour obtenir la couleur du badge selon le statut
  const getBadgeStatus = (status) => {
    switch(status) {
      case 'draft':
        return 'attention';
      case 'pending':
        return 'warning';
      case 'published':
        return 'success';
      case 'rejected':
        return 'critical';
      default:
        return 'new';
    }
  };
  
  // Fonction pour obtenir le libellé du statut en français
  const getStatusLabel = (status) => {
    switch(status) {
      case 'draft':
        return 'Brouillon';
      case 'pending':
        return 'En attente';
      case 'published':
        return 'Publié';
      case 'rejected':
        return 'Refusé';
      default:
        return 'Nouveau';
    }
  };
  
  // Filtres pour les hébergements
  const filters = [
    {
      key: 'status',
      label: 'Statut',
      filter: (
        <IndexFilters
          queryValue=""
          queryPlaceholder="Rechercher un hébergement"
          onQueryChange={() => {}}
          onQueryClear={() => {}}
          onClearAll={() => {}}
          cancelAction={{
            onAction: () => {},
            disabled: false,
            loading: false,
          }}
          tabs={[
            {
              id: 'all',
              content: 'Tous',
              accessibilityLabel: 'Tous les hébergements',
              isLocked: false,
              actions: [],
            },
            {
              id: 'draft',
              content: 'Brouillons',
              accessibilityLabel: 'Hébergements en brouillon',
              isLocked: false,
              actions: [],
            },
            {
              id: 'pending',
              content: 'En attente',
              accessibilityLabel: 'Hébergements en attente',
              isLocked: false,
              actions: [],
            },
            {
              id: 'published',
              content: 'Publiés',
              accessibilityLabel: 'Hébergements publiés',
              isLocked: false,
              actions: [],
            },
            {
              id: 'rejected',
              content: 'Refusés',
              accessibilityLabel: 'Hébergements refusés',
              isLocked: false,
              actions: [],
            },
          ]}
          selected={filterValue}
          onSelect={setFilterValue}
        />
      ),
      shortcut: true,
    },
  ];
  
  // Filtrer les hébergements en fonction du filtre sélectionné
  const filteredListings = filterValue === 'all' 
    ? listings 
    : listings.filter(listing => listing.status === filterValue);
  
  // État vide (aucun hébergement)
  const emptyStateContent = (
    <EmptyState
      title="Créez votre premier hébergement"
      action={{
        content: 'Ajouter un hébergement',
        onAction: () => navigate('/listings/new'),
      }}
      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
    >
      <p>
        Partagez votre Love Room et commencez à attirer des clients.
      </p>
    </EmptyState>
  );

  // Ajouter une bannière d'erreur pour les variables d'environnement
  if (envError) {
    return (
      <Page title="Erreur de configuration">
        <Layout>
          <Layout.Section>
            <Card>
              <Card.Section>
                <Banner status="critical">
                  Erreur de configuration: Les variables d'environnement sont manquantes ou incorrectes. 
                  Veuillez contacter l'administrateur du site.
                </Banner>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page 
      title="Tableau de bord"
      subtitle={`Bienvenue ${user?.email}`}
      primaryAction={{
        content: 'Ajouter un hébergement',
        onAction: () => navigate('/listings/new'),
      }}
      secondaryActions={[
        {
          content: 'Se déconnecter',
          onAction: logout,
          destructive: true,
        },
      ]}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              <BlockStack>
                <Text as="h2">Vos hébergements</Text>
                <Text variation="subdued">
                  {listings.length} hébergement{listings.length !== 1 ? 's' : ''}
                </Text>
              </BlockStack>
            </Card.Section>
            
            {error && (
              <Card.Section>
                <Banner status="critical">{error}</Banner>
              </Card.Section>
            )}
            
            <Card.Section>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <Spinner accessibilityLabel="Chargement des hébergements" size="large" />
                  <div style={{ marginTop: '1rem' }}>
                    <Text variation="subdued">Chargement de vos hébergements...</Text>
                  </div>
                </div>
              ) : listings.length === 0 ? (
                emptyStateContent
              ) : (
                <ResourceList
                  resourceName={{ singular: 'hébergement', plural: 'hébergements' }}
                  items={filteredListings}
                  renderItem={(item) => {
                    const { id, nom, type, status, tarif_min, tarif_max } = item;
                    
                    return (
                      <ResourceList.Item
                        id={id}
                        accessibilityLabel={`Voir les détails de ${nom}`}
                        onClick={() => navigate(`/listings/edit/${id}`)}
                      >
                        <BlockStack>
                          <Avatar size="medium" name={nom} />
                          
                          <BlockStack gap="200">
                            <Text variation="strong">{nom}</Text>
                            <Text variation="subdued">{type}</Text>
                            <Text>Prix: {tarif_min}€ - {tarif_max}€</Text>
                          </BlockStack>
                          
                          <Badge status={getBadgeStatus(status)}>
                            {getStatusLabel(status)}
                          </Badge>
                          
                          <Button onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/listings/edit/${id}`);
                          }}>
                            Modifier
                          </Button>
                        </BlockStack>
                      </ResourceList.Item>
                    );
                  }}
                  filterControl={
                    <IndexFilters
                      queryValue=""
                      queryPlaceholder="Rechercher un hébergement"
                      onQueryChange={() => {}}
                      onQueryClear={() => {}}
                      onClearAll={() => {}}
                      cancelAction={{
                        onAction: () => {},
                        disabled: false,
                        loading: false,
                      }}
                      tabs={[
                        {
                          id: 'all',
                          content: 'Tous',
                          accessibilityLabel: 'Tous les hébergements',
                          isLocked: false,
                          actions: [],
                        },
                        {
                          id: 'draft',
                          content: 'Brouillons',
                          accessibilityLabel: 'Hébergements en brouillon',
                          isLocked: false,
                          actions: [],
                        },
                        {
                          id: 'pending',
                          content: 'En attente',
                          accessibilityLabel: 'Hébergements en attente',
                          isLocked: false,
                          actions: [],
                        },
                        {
                          id: 'published',
                          content: 'Publiés',
                          accessibilityLabel: 'Hébergements publiés',
                          isLocked: false,
                          actions: [],
                        },
                        {
                          id: 'rejected',
                          content: 'Refusés',
                          accessibilityLabel: 'Hébergements refusés',
                          isLocked: false,
                          actions: [],
                        },
                      ]}
                      selected={filterValue}
                      onSelect={setFilterValue}
                    />
                  }
                />
              )}
            </Card.Section>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card title="Statistiques" sectioned>
            <BlockStack gap="400">
              <BlockStack gap="200">
                <Text variation="strong">Total des hébergements</Text>
                <Text>{listings.length}</Text>
              </BlockStack>
              
              <BlockStack gap="200">
                <Text variation="strong">Publiés</Text>
                <Text>{listings.filter(l => l.status === 'published').length}</Text>
              </BlockStack>
              
              <BlockStack gap="200">
                <Text variation="strong">En attente</Text>
                <Text>{listings.filter(l => l.status === 'pending').length}</Text>
              </BlockStack>
              
              <BlockStack gap="200">
                <Text variation="strong">Brouillons</Text>
                <Text>{listings.filter(l => l.status === 'draft').length}</Text>
              </BlockStack>
            </BlockStack>
          </Card>
          
          <Card title="Aide" sectioned>
            <Text>
              Si vous avez besoin d'aide pour créer ou gérer vos hébergements, 
              n'hésitez pas à contacter notre équipe.
            </Text>
            <div style={{ marginTop: '1rem' }}>
              <Button url="mailto:support@lovenspa.fr">
                Contacter le support
              </Button>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}