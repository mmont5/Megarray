import { supabase } from './supabase';

export interface Permission {
  name: string;
  description: string;
  category: string;
}

export const PERMISSIONS = {
  // Content Management
  create_content: {
    name: 'Create Content',
    description: 'Create new content items',
    category: 'content',
  },
  edit_own_content: {
    name: 'Edit Own Content',
    description: 'Edit content created by the user',
    category: 'content',
  },
  delete_own_content: {
    name: 'Delete Own Content',
    description: 'Delete content created by the user',
    category: 'content',
  },
  edit_any_content: {
    name: 'Edit Any Content',
    description: 'Edit any content in the system',
    category: 'content',
  },
  delete_any_content: {
    name: 'Delete Any Content',
    description: 'Delete any content in the system',
    category: 'content',
  },

  // Team Management
  invite_team_members: {
    name: 'Invite Team Members',
    description: 'Invite new team members',
    category: 'team',
  },
  manage_team_roles: {
    name: 'Manage Team Roles',
    description: 'Assign and manage team member roles',
    category: 'team',
  },
  remove_team_members: {
    name: 'Remove Team Members',
    description: 'Remove team members',
    category: 'team',
  },

  // Agency Features
  manage_client_accounts: {
    name: 'Manage Client Accounts',
    description: 'Create and manage client accounts',
    category: 'agency',
  },
  white_label_reports: {
    name: 'White Label Reports',
    description: 'Generate white-labeled reports',
    category: 'agency',
  },
  api_access: {
    name: 'API Access',
    description: 'Access to the API',
    category: 'agency',
  },

  // Analytics
  view_analytics: {
    name: 'View Analytics',
    description: 'View basic analytics data',
    category: 'analytics',
  },
  view_team_analytics: {
    name: 'View Team Analytics',
    description: 'View analytics data for team members',
    category: 'analytics',
  },
  export_analytics: {
    name: 'Export Analytics',
    description: 'Export analytics data',
    category: 'analytics',
  },

  // Admin Features
  manage_users: {
    name: 'Manage Users',
    description: 'Manage all users in the system',
    category: 'admin',
  },
  manage_roles: {
    name: 'Manage Roles',
    description: 'Create and manage roles',
    category: 'admin',
  },
  manage_permissions: {
    name: 'Manage Permissions',
    description: 'Assign and manage permissions',
    category: 'admin',
  },
  view_system_logs: {
    name: 'View System Logs',
    description: 'Access system logs',
    category: 'admin',
  },
  manage_settings: {
    name: 'Manage Settings',
    description: 'Modify system settings',
    category: 'admin',
  },
} as const;

export type PermissionName = keyof typeof PERMISSIONS;

export async function getUserPermissions(userId: string): Promise<PermissionName[]> {
  try {
    // Get user's role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Get role's permissions
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('permissions')
      .eq('name', profile.role)
      .single();

    if (roleError) throw roleError;

    // Get agency permissions if user is an agency member
    const { data: agencyMember, error: agencyError } = await supabase
      .from('agency_members')
      .select('role')
      .eq('user_id', userId)
      .single();

    let permissions = roleData.permissions as PermissionName[];

    // Add agency-specific permissions
    if (!agencyError && agencyMember) {
      const agencyPermissions = getAgencyPermissions(agencyMember.role);
      permissions = [...new Set([...permissions, ...agencyPermissions])];
    }

    return permissions;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

function getAgencyPermissions(role: string): PermissionName[] {
  switch (role) {
    case 'admin':
      return [
        'manage_client_accounts',
        'white_label_reports',
        'api_access',
        'manage_team_roles',
        'invite_team_members',
        'remove_team_members',
        'view_team_analytics',
        'export_analytics',
      ];
    case 'manager':
      return [
        'white_label_reports',
        'invite_team_members',
        'view_team_analytics',
        'export_analytics',
      ];
    case 'member':
      return [
        'create_content',
        'edit_own_content',
        'delete_own_content',
        'view_analytics',
      ];
    default:
      return [];
  }
}

export function hasPermission(
  userPermissions: PermissionName[],
  requiredPermission: PermissionName
): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(
  userPermissions: PermissionName[],
  requiredPermissions: PermissionName[]
): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}

export function hasAllPermissions(
  userPermissions: PermissionName[],
  requiredPermissions: PermissionName[]
): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}