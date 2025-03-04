import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, FormLayout, TextField, Button, Page, Layout, Banner } from '@shopify/polaris';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const { success, error } = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError(error || 'Échec de la connexion');
      }
    } catch (error) {
      setError('Échec de la connexion : ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card title="Connexion" sectioned>
            {error && <Banner status="critical">{error}</Banner>}
            
            <form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="email"
                  required
                />

                <TextField
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="current-password"
                  required
                />

                <Button primary submit loading={loading}>
                  Se connecter
                </Button>
              </FormLayout>
            </form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}