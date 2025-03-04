import React from 'react';
import { Page, Layout, Card, Button } from '@shopify/polaris';
import { useAuth } from '../../contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <Page title="Tableau de bord">
      <Layout>
        <Layout.Section>
          <Card sectioned title="Bienvenue">
            <p>Vous êtes connecté avec l'adresse {user?.email}</p>
            <Button onClick={logout}>Se déconnecter</Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}