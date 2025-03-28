import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if super admin already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'super_admin')
      .maybeSingle();

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Super admin already exists' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create the super admin user
    const { data: { user }, error: userError } = await supabase.auth.admin.createUser({
      email: 'admin@megarray.com',
      password: 'Admin123!@#',
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
    const { error: adminError } = await supabase
      .from('admin_users')
      .insert({
        user_id: user.id,
        role_id: roleData.id,
        is_active: true
      });

    if (adminError) throw adminError;

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: 'admin@megarray.com',
        name: 'Super Admin',
        role: 'super_admin'
      });

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ 
        message: 'Super admin created successfully',
        userId: user.id 
      }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});