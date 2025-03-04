import React from 'react';
import { Page, Layout, Card, Button } from '@shopify/polaris';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Page title="Tableau de bord">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Bienvenue">
            <p>Vous êtes connecté avec l'adresse {user?.email}</p>
            <Button onClick={logout}>Se déconnecter</Button>
          </Card>
        </Layout.Section>
        
        {/* Ajoutez cette section */}
        <Layout.Section>
          <Card
            sectioned
            title="Vos hébergements"
            primaryFooterAction={{
              content: 'Créer un nouvel hébergement',
              onAction: () => navigate('/listings/new')
            }}
          >
            <p>
              Créez et gérez vos hébergements à partir d'ici. 
              Chaque hébergement sera examiné par notre équipe avant d'être publié sur le site.
            </p>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}