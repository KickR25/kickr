
export type UserRole = 'admin' | 'trainer' | 'club' | 'sponsor';

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
  role: UserRole;
  avatar?: string;
  bio?: string;
  location?: string;
  friends: string[];
  friendRequests: string[];
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
