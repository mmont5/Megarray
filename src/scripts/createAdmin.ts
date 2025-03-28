import * as dotenv from 'dotenv';
import { createSuperAdmin } from '../lib/admin';

// Load environment variables from .env file
dotenv.config();

async function init() {
  try {
    console.log('Starting super admin creation...');
    
    if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Environment variables:', {
        url: process.env.VITE_SUPABASE_URL ? 'present' : 'missing',
        key: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'present' : 'missing'
      });
      throw new Error('Missing required environment variables. Please check your .env file.');
    }

    console.log('Using Supabase URL:', process.env.VITE_SUPABASE_URL);
    
    const result = await createSuperAdmin();
    console.log('Super admin created successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error creating super admin:', error);
    process.exit(1);
  }
}

init();