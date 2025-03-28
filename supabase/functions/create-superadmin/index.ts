import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create superadmin user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@megarray.com',
      password: 'Admin123!@#', // You should change this immediately after first login
      email_confirm: true,
      user_metadata: {
        name: 'Super Admin',
        role: 'super_admin'
      }
    });

    if (userError) throw userError;

    // Get super_admin role id
    const { data: roleData, error: roleError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('name', 'super_admin')
      .single();

    if (roleError) throw roleError;

    // Create admin user record
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userData.user.id,
        role_id: roleData.id,
        is_active: true
      })
      .select()
      .single();

    if (adminError) throw adminError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userData.user.id,
        email: 'admin@megarray.com',
        role: 'super_admin'
      });

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ message: 'Superadmin created successfully' }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});