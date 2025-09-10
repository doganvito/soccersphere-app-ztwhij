
export interface User {
  id: string;
  name: string;
  club: string;
  position: string;
  avatar?: string;
  stats: UserStats;
}

export interface UserStats {
  playedGames: number;
  goals: number;
  assists: number;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  type: 'text' | 'image' | 'video' | 'reel';
  media?: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

export interface Event {
  id: string;
  userId: string;
  user: User;
  title: string;
  club: string;
  address: string;
  game: string;
  date: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
  participants: number;
  isJoined: boolean;
}

export interface Transfer {
  id: string;
  userId: string;
  user: User;
  type: 'player_seeking' | 'team_seeking';
  position?: string;
  description: string;
  timestamp: Date;
  location?: string;
}

export interface SearchResult {
  type: 'post' | 'user' | 'event' | 'transfer';
  data: Post | User | Event | Transfer;
}
