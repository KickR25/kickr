
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Sanction } from '@/types';

export function useBanCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const [activeBans, setActiveBans] = useState<Sanction[]>([]);
  const [hasFullBan, setHasFullBan] = useState(false);
  const [hasMessageBan, setHasMessageBan] = useState(false);
  const [hasCommentBan, setHasCommentBan] = useState(false);

  useEffect(() => {
    checkBans();
  }, []);

  const checkBans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsChecking(false);
        return;
      }

      const { data, error } = await supabase
        .rpc('get_active_sanctions', { p_user_id: user.id });

      if (error) throw error;

      const bans: Sanction[] = (data || []).map((s: any) => ({
        id: s.id,
        userId: user.id,
        type: s.type,
        reason: s.reason,
        createdByAdmin: '',
        createdByAdminName: s.created_by_admin_name,
        createdAt: new Date(),
        isPermanent: s.is_permanent,
        endsAt: s.ends_at ? new Date(s.ends_at) : undefined,
        status: 'ACTIVE',
      }));

      setActiveBans(bans);
      setHasFullBan(bans.some(b => b.type === 'FULL_BAN'));
      setHasMessageBan(bans.some(b => b.type === 'MESSAGE_BAN'));
      setHasCommentBan(bans.some(b => b.type === 'COMMENT_BAN'));
    } catch (error) {
      console.error('Error checking bans:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const getFullBan = (): Sanction | null => {
    return activeBans.find(b => b.type === 'FULL_BAN') || null;
  };

  const getMessageBan = (): Sanction | null => {
    return activeBans.find(b => b.type === 'MESSAGE_BAN') || null;
  };

  const getCommentBan = (): Sanction | null => {
    return activeBans.find(b => b.type === 'COMMENT_BAN') || null;
  };

  const formatRemainingTime = (ban: Sanction): string => {
    if (ban.isPermanent) {
      return '730 Tage : 00 : 00 : 00';
    }

    if (!ban.endsAt) return '00 : 00 : 00 : 00';

    const now = new Date();
    const end = new Date(ban.endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return '00 : 00 : 00 : 00';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${days} Tage : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;
  };

  return {
    isChecking,
    activeBans,
    hasFullBan,
    hasMessageBan,
    hasCommentBan,
    getFullBan,
    getMessageBan,
    getCommentBan,
    formatRemainingTime,
    refreshBans: checkBans,
  };
}
