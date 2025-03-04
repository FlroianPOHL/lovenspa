import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://usobmudwiadefjoydufr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzb2JtdWR3aWFkZWZqb3lkdWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MzI4MzgsImV4cCI6MjA1NjUwODgzOH0.wMGQoG4xeZQnwdhuOK3yp2tCZY3Ww_cZcqs4NgXbzE4';

export const supabase = createClient(supabaseUrl, supabaseKey);