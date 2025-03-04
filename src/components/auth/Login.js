import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, FormLayout, TextField, Button, Page, Layout, Banner } from '@shopify/polaris';
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
    <Page title="Connexion" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {error && (
              <Banner status="critical" title="Erreur">
                {error}
              </Banner>
            )}
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={email}
                  onChange={setEmail}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <TextField
                  value={password}
                  onChange={setPassword}
                  label="Mot de passe"
                  type="password"
                  autoComplete="current-password"
                  required
                />
                <Button submit primary loading={loading}>
                  Se connecter
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}