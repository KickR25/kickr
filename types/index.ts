
export type UserRole = 'admin' | 'trainer' | 'club' | 'sponsor';

export type AdminLevel = 'ADMIN_1' | 'ADMIN_2' | 'ADMIN_3' | 'ADMIN_4';

export type SanctionType = 'MESSAGE_BAN' | 'COMMENT_BAN' | 'FULL_BAN';

export type SanctionStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export type ActionType = 'sanction_created' | 'sanction_revoked' | 'admin_promoted' | 'admin_demoted' | 'admin_removed';

export type TeamCategory = 
  | 'G-Jugend'
  | 'F-Jugend'
  | 'E-Jugend'
  | 'D-Jugend'
  | 'C-Jugend'
  | 'B-Jugend'
  | 'A-Jugend'
  | '2. Mannschaft'
  | '1. Mannschaft'
  | 'Frauen'
  | 'AH';

export type Gender = 'Jungs' | 'Mädels' | 'Gemischt';

export type TrainingGoal = 'Technik' | 'Taktik' | 'Passspiel' | 'Pressing' | 'Kondition' | 'Torschuss';

export type DealStatus = 'Angefragt' | 'Verhandlung' | 'Akzeptiert' | 'Aktiv' | 'Abgeschlossen';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  friends: string[];
  friendRequests: string[];
  adminLevel?: AdminLevel;
}

export interface Sanction {
  id: string;
  userId: string;
  type: SanctionType;
  reason: string;
  createdByAdmin: string;
  createdByAdminName?: string;
  createdAt: Date;
  isPermanent: boolean;
  endsAt?: Date;
  status: SanctionStatus;
  revokedAt?: Date;
  revokedByAdmin?: string;
}

export interface AdminChatMessage {
  id: string;
  adminId: string;
  adminName?: string;
  adminAvatar?: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface AuditLogEntry {
  id: string;
  actorAdminId: string;
  actorAdminName?: string;
  targetUserId?: string;
  targetUserName?: string;
  actionType: ActionType;
  details?: any;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  images?: string[];
  likes: string[];
  comments: Comment[];
  shares: number;
  timestamp: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
}

export interface Training {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  goal: TrainingGoal;
  teamCategory: TeamCategory;
  gender?: Gender;
  duration: string;
  playerCount: string;
  materials: string;
  description: string;
  images?: string[];
  videos?: string[];
  likes: string[];
  comments: Comment[];
  saves: string[];
  timestamp: Date;
}

export interface SponsorPackage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  packageName: string;
  price: string;
  duration: string;
  region: string;
  benefits: string;
  images?: string[];
  available: boolean;
  timestamp: Date;
}

export interface Deal {
  id: string;
  packageId: string;
  sponsorId: string;
  clubId: string;
  status: DealStatus;
  commission: number;
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'friend_request' | 'deal' | 'message';
  content: string;
  timestamp: Date;
  read: boolean;
}
