import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.0';
import { z } from 'npm:zod@3.22.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CreateAgencySchema = z.object({
  name: z.string().min(1),
  website: z.string().url().optional(),
  brandColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

const UpdateAgencySchema = CreateAgencySchema.partial();

const InviteMemberSchema = z.object({
  agencyId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'member']),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    switch (req.method) {
      case 'POST': {
        const body = await req.json();
        
        if (body.action === 'invite') {
          const { agencyId, email, role } = InviteMemberSchema.parse(body);

          // Verify user is agency admin
          const { data: membership } = await supabase
            .from('agency_members')
            .select('role')
            .eq('agency_id', agencyId)
            .eq('user_id', user.id)
            .single();

          if (!membership || membership.role !== 'admin') {
            throw new Error('Only agency admins can invite members');
          }

          // Create invitation
          const { data, error } = await supabase
            .from('agency_invitations')
            .insert({
              agency_id: agencyId,
              email,
              role,
              invited_by: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          // Send invitation email (implement separately)
          await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              template: 'agency-invitation',
              data: {
                invitationId: data.id,
                agencyName: data.agency.name,
                role,
              },
            }),
          });

          return new Response(
            JSON.stringify(data),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Create new agency
        const agencyData = CreateAgencySchema.parse(body);
        
        const { data, error } = await supabase
          .from('agencies')
          .insert(agencyData)
          .select()
          .single();

        if (error) throw error;

        // Add creator as admin
        await supabase
          .from('agency_members')
          .insert({
            agency_id: data.id,
            user_id: user.id,
            role: 'admin',
          });

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'PUT': {
        const { agencyId, ...updateData } = UpdateAgencySchema.parse(await req.json());

        // Verify user is agency admin
        const { data: membership } = await supabase
          .from('agency_members')
          .select('role')
          .eq('agency_id', agencyId)
          .eq('user_id', user.id)
          .single();

        if (!membership || membership.role !== 'admin') {
          throw new Error('Only agency admins can update agency details');
        }

        const { data, error } = await supabase
          .from('agencies')
          .update(updateData)
          .eq('id', agencyId)
          .select()
          .single();

        if (error) throw error;

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'DELETE': {
        const { agencyId } = await req.json();

        // Verify user is agency admin
        const { data: membership } = await supabase
          .from('agency_members')
          .select('role')
          .eq('agency_id', agencyId)
          .eq('user_id', user.id)
          .single();

        if (!membership || membership.role !== 'admin') {
          throw new Error('Only agency admins can delete agencies');
        }

        const { error } = await supabase
          .from('agencies')
          .delete()
          .eq('id', agencyId);

        if (error) throw error;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response('Method not allowed', { status: 405 });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: error.message === 'Unauthorized' ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});