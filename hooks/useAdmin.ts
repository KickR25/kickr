
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { AdminLevel, Sanction, AdminChatMessage, AuditLogEntry, SanctionType, User } from '@/types';

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLevel, setAdminLevel] = useState<AdminLevel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        setAdminLevel(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('admin_level')
        .eq('id', user.id)
        .single();

      if (profile?.admin_level) {
        setIsAdmin(true);
        setAdminLevel(profile.admin_level as AdminLevel);
      } else {
        setIsAdmin(false);
        setAdminLevel(null);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminLevel(null);
    } finally {
      setLoading(false);
    }
  };

  const canManageAdmins = () => {
    return adminLevel === 'ADMIN_3' || adminLevel === 'ADMIN_4';
  };

  const canCreateBans = () => {
    return adminLevel === 'ADMIN_2' || adminLevel === 'ADMIN_3' || adminLevel === 'ADMIN_4';
  };

  const canAccessAdminChat = () => {
    return isAdmin;
  };

  // Get active sanctions for a user
  const getActiveSanctions = async (userId: string): Promise<Sanction[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_sanctions', { p_user_id: userId });

      if (error) throw error;

      return (data || []).map((s: any) => ({
        id: s.id,
        userId: userId,
        type: s.type,
        reason: s.reason,
        createdByAdmin: '',
        createdByAdminName: s.created_by_admin_name,
        createdAt: new Date(s.created_at),
        isPermanent: s.is_permanent,
        endsAt: s.ends_at ? new Date(s.ends_at) : undefined,
        status: 'ACTIVE',
      }));
    } catch (error) {
      console.error('Error getting active sanctions:', error);
      return [];
    }
  };

  // Create a sanction
  const createSanction = async (
    userId: string,
    type: SanctionType,
    reason: string,
    isPermanent: boolean,
    endsAt?: Date
  ): Promise<{ success: boolean; error?: string }> => {
    if (!canCreateBans()) {
      return { success: false, error: 'Keine Berechtigung' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nicht angemeldet' };
      }

      const { error: sanctionError } = await supabase
        .from('sanctions')
        .insert({
          user_id: userId,
          type,
          reason,
          created_by_admin: user.id,
          is_permanent: isPermanent,
          ends_at: endsAt?.toISOString(),
          status: 'ACTIVE',
        });

      if (sanctionError) throw sanctionError;

      // Log to audit
      await supabase.from('audit_log').insert({
        actor_admin_id: user.id,
        target_user_id: userId,
        action_type: 'sanction_created',
        details: { type, reason, isPermanent, endsAt },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error creating sanction:', error);
      return { success: false, error: error.message };
    }
  };

  // Revoke a sanction
  const revokeSanction = async (sanctionId: string): Promise<{ success: boolean; error?: string }> => {
    if (!canCreateBans()) {
      return { success: false, error: 'Keine Berechtigung' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nicht angemeldet' };
      }

      const { error: updateError } = await supabase
        .from('sanctions')
        .update({
          status: 'REVOKED',
          revoked_at: new Date().toISOString(),
          revoked_by_admin: user.id,
        })
        .eq('id', sanctionId);

      if (updateError) throw updateError;

      // Log to audit
      await supabase.from('audit_log').insert({
        actor_admin_id: user.id,
        action_type: 'sanction_revoked',
        details: { sanctionId },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error revoking sanction:', error);
      return { success: false, error: error.message };
    }
  };

  // Promote user to admin
  const promoteToAdmin = async (
    userId: string,
    level: AdminLevel
  ): Promise<{ success: boolean; error?: string }> => {
    if (!canManageAdmins()) {
      return { success: false, error: 'Keine Berechtigung' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nicht angemeldet' };
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ admin_level: level })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log to audit
      await supabase.from('audit_log').insert({
        actor_admin_id: user.id,
        target_user_id: userId,
        action_type: 'admin_promoted',
        details: { level },
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      return { success: false, error: error.message };
    }
  };

  // Demote admin
  const demoteAdmin = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (!canManageAdmins()) {
      return { success: false, error: 'Keine Berechtigung' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nicht angemeldet' };
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ admin_level: null })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Log to audit
      await supabase.from('audit_log').insert({
        actor_admin_id: user.id,
        target_user_id: userId,
        action_type: 'admin_demoted',
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error demoting admin:', error);
      return { success: false, error: error.message };
    }
  };

  // Get all sanctions
  const getAllSanctions = async (): Promise<Sanction[]> => {
    try {
      const { data, error } = await supabase
        .from('sanctions')
        .select(`
          *,
          profiles!sanctions_created_by_admin_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((s: any) => ({
        id: s.id,
        userId: s.user_id,
        type: s.type,
        reason: s.reason,
        createdByAdmin: s.created_by_admin,
        createdByAdminName: s.profiles?.name,
        createdAt: new Date(s.created_at),
        isPermanent: s.is_permanent,
        endsAt: s.ends_at ? new Date(s.ends_at) : undefined,
        status: s.status,
        revokedAt: s.revoked_at ? new Date(s.revoked_at) : undefined,
        revokedByAdmin: s.revoked_by_admin,
      }));
    } catch (error) {
      console.error('Error getting all sanctions:', error);
      return [];
    }
  };

  // Get admin chat messages
  const getAdminChatMessages = async (): Promise<AdminChatMessage[]> => {
    try {
      const { data, error } = await supabase
        .from('admin_chat_messages')
        .select(`
          *,
          profiles(name, avatar)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map((m: any) => ({
        id: m.id,
        adminId: m.admin_id,
        adminName: m.profiles?.name,
        adminAvatar: m.profiles?.avatar,
        content: m.content,
        imageUrl: m.image_url,
        createdAt: new Date(m.created_at),
      }));
    } catch (error) {
      console.error('Error getting admin chat messages:', error);
      return [];
    }
  };

  // Send admin chat message
  const sendAdminChatMessage = async (
    content: string,
    imageUrl?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!canAccessAdminChat()) {
      return { success: false, error: 'Keine Berechtigung' };
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Nicht angemeldet' };
      }

      const { error } = await supabase
        .from('admin_chat_messages')
        .insert({
          admin_id: user.id,
          content,
          image_url: imageUrl,
        });

      if (error) throw error;

      return { success: true };
    } catch (error: any) {
      console.error('Error sending admin chat message:', error);
      return { success: false, error: error.message };
    }
  };

  // Get audit log
  const getAuditLog = async (): Promise<AuditLogEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select(`
          *,
          actor:profiles!audit_log_actor_admin_id_fkey(name),
          target:profiles!audit_log_target_user_id_fkey(name)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;

      return (data || []).map((log: any) => ({
        id: log.id,
        actorAdminId: log.actor_admin_id,
        actorAdminName: log.actor?.name,
        targetUserId: log.target_user_id,
        targetUserName: log.target?.name,
        actionType: log.action_type,
        details: log.details,
        timestamp: new Date(log.timestamp),
      }));
    } catch (error) {
      console.error('Error getting audit log:', error);
      return [];
    }
  };

  // Search users
  const searchUsers = async (query: string): Promise<User[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        avatar: p.avatar,
        coverImage: p.cover_image,
        bio: p.bio,
        location: p.location,
        friends: [],
        friendRequests: [],
        adminLevel: p.admin_level,
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  return {
    isAdmin,
    adminLevel,
    loading,
    canManageAdmins: canManageAdmins(),
    canCreateBans: canCreateBans(),
    canAccessAdminChat: canAccessAdminChat(),
    getActiveSanctions,
    createSanction,
    revokeSanction,
    promoteToAdmin,
    demoteAdmin,
    getAllSanctions,
    getAdminChatMessages,
    sendAdminChatMessage,
    getAuditLog,
    searchUsers,
  };
}
