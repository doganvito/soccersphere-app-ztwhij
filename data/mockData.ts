
import { User, Post, Event, Transfer } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Max Müller',
    club: 'SG Hassendorf/Bötersen',
    position: 'Midfielder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    stats: {
      playedGames: 25,
      goals: 8,
      assists: 12,
    },
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    club: 'SG Reeßum/Taaken',
    position: 'Forward',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    stats: {
      playedGames: 22,
      goals: 15,
      assists: 6,
    },
  },
  {
    id: '3',
    name: 'Tom Weber',
    club: 'FC Bremen Nord',
    position: 'Goalkeeper',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    stats: {
      playedGames: 28,
      goals: 0,
      assists: 2,
    },
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Great training session today! Ready for the weekend match 💪⚽',
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    comments: 5,
    isLiked: false,
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    content: 'Match highlights from yesterday\'s game!',
    type: 'video',
    media: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=300&fit=crop'],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 45,
    comments: 12,
    isLiked: true,
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    content: 'Clean sheet today! Team defense was incredible 🥅',
    type: 'image',
    media: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop'],
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 32,
    comments: 8,
    isLiked: false,
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    title: 'Weekend Match',
    club: 'SG Hassendorf/Bötersen',
    address: 'Am weissen Moor',
    game: 'SG Hassendorf/Bötersen vs. SG Reeßum/Taaken',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    location: {
      latitude: 53.2194,
      longitude: 9.4083,
    },
    participants: 18,
    isJoined: false,
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    title: 'Training Session',
    club: 'SG Reeßum/Taaken',
    address: 'Sportplatz Reeßum',
    game: 'Team Training',
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    location: {
      latitude: 53.1894,
      longitude: 9.3583,
    },
    participants: 12,
    isJoined: true,
  },
];

export const mockTransfers: Transfer[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    type: 'player_seeking',
    position: 'Midfielder',
    description: 'Experienced midfielder looking for new team. Available for training 3x per week.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    location: 'Bremen Area',
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    type: 'team_seeking',
    position: 'Defender',
    description: 'SG Reeßum/Taaken looking for experienced defender for upcoming season.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    location: 'Reeßum',
  },
];

export const currentUser: User = mockUsers[0];
