import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

// Vérification de la présence des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('Variables d\'environnement Supabase manquantes:', { 
    url: supabaseUrl ? 'OK' : 'Manquant', 
    key: supabaseKey ? 'OK' : 'Manquant' 
  });
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');