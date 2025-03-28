import { createClient } from '@supabase/supabase-js';

export async function createSuperAdmin() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Environment variables:', {
        url: supabaseUrl ? 'present' : 'missing',
        key: serviceRoleKey ? 'present' : 'missing'
      });
      throw new Error('Missing Supabase environment variables');
    }

    console.log('Creating super admin with URL:', supabaseUrl);

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Test connection
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('admin_roles')
      .select('count')
      .single();

    if (testError) {
      console.error('Connection test failed:', testError);
      throw new Error('Failed to connect to Supabase');
    }
    console.log('Connection test successful');

    // First check if admin already exists
    console.log('Checking for existing admin user...');
    const { data: existingUser, error: existingError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'admin@megarray.com')
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing user:', existingError);
      throw existingError;
    }

    if (existingUser) {
      console.log('Admin user already exists:', existingUser.id);
      return { message: 'Admin user already exists', userId: existingUser.id };
    }

    // Create the super admin user
    console.log('Creating super admin user...');
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@megarray.com',
      password: 'Admin123!@#',
      email_confirm: true,
      user_metadata: {
        name: 'Super Admin',
        role: 'super_admin'
      }
    });

    if (userError) {
      console.error('Error creating user:', userError);
      throw userError;
    }

    if (!userData?.user?.id) {
      console.error('User created but no ID returned:', userData);
      throw new Error('User creation succeeded but no ID was returned');
    }

    console.log('User created successfully:', {
      id: userData.user.id,
      email: userData.user.email,
      role: userData.user.role
    });

    // Create profile first
    console.log('Creating profile...');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        email: 'admin@megarray.com',
        name: 'Super Admin',
        role: 'super_admin'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

    console.log('Profile created:', profileData.id);

    // Get super_admin role id
    console.log('Getting super_admin role...');
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('name', 'super_admin')
      .single();

    if (roleError) {
      console.error('Error getting role:', roleError);
      throw roleError;
    }

    console.log('Found role:', roleData.id);

    // Create admin user record
    console.log('Creating admin user record...');
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userData.user.id,
        role_id: roleData.id,
        is_active: true
      })
      .select()
      .single();

    if (adminError) {
      console.error('Error creating admin user record:', adminError);
      throw adminError;
    }

    console.log('Admin user record created:', adminData.id);

    return { 
      message: 'Super admin created successfully', 
      userId: userData.user.id,
      details: {
        adminUserId: adminData.id,
        profileId: profileData.id
      }
    };
  } catch (error) {
    console.error('Error creating super admin:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
    throw error;
  }
}