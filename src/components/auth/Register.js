import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, FormLayout, TextField, Button, Page, Layout, Banner, Select } from '@shopify/polaris';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    civilite: '',
    telephone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (value, id) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const { success, error } = await register(
        formData.email, 
        formData.password, 
        {
          nom: formData.nom,
          prenom: formData.prenom,
          civilite: formData.civilite,
          telephone: formData.telephone
        }
      );
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError(error || 'Échec de l\'inscription');
      }
    } catch (error) {
      setError('Échec de l\'inscription : ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page title="Créer un compte" narrowWidth>
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
                <Select
                  label="Civilité"
                  options={[
                    {label: 'Choisir', value: ''},
                    {label: 'Monsieur', value: 'monsieur'},
                    {label: 'Madame', value: 'madame'}
                  ]}
                  value={formData.civilite}
                  onChange={(value) => handleChange(value, 'civilite')}
                  required
                />
                
                <TextField
                  value={formData.nom}
                  onChange={(value) => handleChange(value, 'nom')}
                  label="Nom"
                  autoComplete="family-name"
                  required
                />
                
                <TextField
                  value={formData.prenom}
                  onChange={(value) => handleChange(value, 'prenom')}
                  label="Prénom"
                  autoComplete="given-name"
                  required
                />
                
                <TextField
                  value={formData.email}
                  onChange={(value) => handleChange(value, 'email')}
                  label="Email"
                  type="email"
                  autoComplete="email"
                  required
                />
                
                <TextField
                  value={formData.telephone}
                  onChange={(value) => handleChange(value, 'telephone')}
                  label="Téléphone"
                  type="tel"
                  autoComplete="tel"
                />
                
                <TextField
                  value={formData.password}
                  onChange={(value) => handleChange(value, 'password')}
                  label="Mot de passe"
                  type="password"
                  autoComplete="new-password"
                  required
                />
                
                <TextField
                  value={formData.confirmPassword}
                  onChange={(value) => handleChange(value, 'confirmPassword')}
                  label="Confirmer le mot de passe"
                  type="password"
                  autoComplete="new-password"
                  required
                />
                
                <Button submit primary loading={loading}>
                  S'inscrire
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}