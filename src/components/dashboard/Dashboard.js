// src/components/dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { 
  Page, Layout, Card, Button, EmptyState, 
  ResourceList, Avatar, TextStyle, Filters, 
  Badge, BlockStack, Heading, Banner, Spinner
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
  
  // Charger les hébergements de l'utilisateur au chargement du composant
  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return;
      
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
  }, [user]);
  
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
        <Filters.ResourceList
          resourceName={{ singular: 'hébergement', plural: 'hébergements' }}
          filterValueKey="filterValue"
          filters={[
            {
              key: 'all',
              label: 'Tous',
            },
            {
              key: 'draft',
              label: 'Brouillons',
            },
            {
              key: 'pending',
              label: 'En attente',
            },
            {
              key: 'published',
              label: 'Publiés',
            },
            {
              key: 'rejected',
              label: 'Refusés',
            },
          ]}
          onFiltersChange={(selectedFilters) => setFilterValue(selectedFilters.filterValue)}
          appliedFilters={filterValue !== 'all' ? [{key: 'status', value: filterValue}] : []}
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
      heading="Créez votre premier hébergement"
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
                <Heading>Vos hébergements</Heading>
                <TextStyle variation="subdued">
                  {listings.length} hébergement{listings.length !== 1 ? 's' : ''}
                </TextStyle>
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
                    <TextStyle variation="subdued">Chargement de vos hébergements...</TextStyle>
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
                            <TextStyle variation="strong">{nom}</TextStyle>
                            <TextStyle variation="subdued">{type}</TextStyle>
                            <TextStyle>Prix: {tarif_min}€ - {tarif_max}€</TextStyle>
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
                    <Filters
                      queryValue=""
                      filters={filters}
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
                <TextStyle variation="strong">Total des hébergements</TextStyle>
                <TextStyle>{listings.length}</TextStyle>
              </BlockStack>
              
              <BlockStack gap="200">
                <TextStyle variation="strong">Publiés</TextStyle>
                <TextStyle>{listings.filter(l => l.status === 'published').length}</TextStyle>
              </BlockStack>
              
              <BlockStack gap="200">
                <TextStyle variation="strong">En attente</TextStyle>
                <TextStyle>{listings.filter(l => l.status === 'pending').length}</TextStyle>
              </BlockStack>
              
              <BlockStack gap="200">
                <TextStyle variation="strong">Brouillons</TextStyle>
                <TextStyle>{listings.filter(l => l.status === 'draft').length}</TextStyle>
              </BlockStack>
            </BlockStack>
          </Card>
          
          <Card title="Aide" sectioned>
            <TextStyle>
              Si vous avez besoin d'aide pour créer ou gérer vos hébergements, 
              n'hésitez pas à contacter notre équipe.
            </TextStyle>
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