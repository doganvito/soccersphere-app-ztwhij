
import { colors, commonStyles } from '../../styles/commonStyles';
import { User } from '../../types';
import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { currentUser } from '../../data/mockData';

export default function ProfileScreen() {
  const [user, setUser] = useState<User>(currentUser);

  const handleEditProfile = () => {
    console.log('Opening edit profile...');
    Alert.alert('Edit Profile', 'Profile editing will be available soon!');
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    Alert.alert('Settings', 'Settings will be available soon!');
  };

  const StatCard = ({ label, value, icon, color = colors.primary }: { 
    label: string; 
    value: number; 
    icon: string;
    color?: string;
  }) => (
    <View style={[commonStyles.card, { flex: 1, alignItems: 'center', marginHorizontal: 4 }]}>
      <View style={{
        backgroundColor: color + '20',
        borderRadius: 25,
        padding: 12,
        marginBottom: 8,
      }}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 4 }]}>{value}</Text>
      <Text style={[commonStyles.textSecondary, { fontSize: 12, textAlign: 'center' }]}>{label}</Text>
    </View>
  );

  const achievements = [
    { title: 'Top Scorer', description: 'Most goals this season', icon: 'trophy', color: colors.warning },
    { title: 'Team Player', description: 'Most assists', icon: 'people', color: colors.secondary },
    { title: 'Regular', description: '20+ games played', icon: 'calendar', color: colors.primary },
  ];

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20, marginTop: 16 }]}>
          <Text style={commonStyles.title}>Profile</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={[commonStyles.card, { alignItems: 'center', marginBottom: 20 }]}>
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 16,
            }}
          />
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 4 }]}>{user.name}</Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 16, marginBottom: 8 }]}>{user.position}</Text>
          <View style={[commonStyles.row, { alignItems: 'center', marginBottom: 16 }]}>
            <Ionicons name="shield" size={16} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 4, color: colors.primary }]}>{user.club}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleEditProfile}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: colors.background, fontWeight: '600' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Season Stats</Text>
        <View style={[commonStyles.row, { marginBottom: 20 }]}>
          <StatCard 
            label="Games Played" 
            value={user.stats.playedGames} 
            icon="football" 
            color={colors.primary}
          />
          <StatCard 
            label="Goals" 
            value={user.stats.goals} 
            icon="trophy" 
            color={colors.warning}
          />
          <StatCard 
            label="Assists" 
            value={user.stats.assists} 
            icon="people" 
            color={colors.secondary}
          />
        </View>

        {/* Performance Overview */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Performance Overview</Text>
          
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={commonStyles.text}>Goals per Game</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {(user.stats.goals / user.stats.playedGames).toFixed(2)}
            </Text>
          </View>
          
          <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
            <Text style={commonStyles.text}>Assists per Game</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {(user.stats.assists / user.stats.playedGames).toFixed(2)}
            </Text>
          </View>
          
          <View style={[commonStyles.row, commonStyles.spaceBetween]}>
            <Text style={commonStyles.text}>Goal Contributions</Text>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {user.stats.goals + user.stats.assists}
            </Text>
          </View>
        </View>

        {/* Achievements */}
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>Achievements</Text>
        {achievements.map((achievement, index) => (
          <View key={index} style={[commonStyles.card, commonStyles.row, { marginBottom: 12 }]}>
            <View style={{
              backgroundColor: achievement.color + '20',
              borderRadius: 20,
              padding: 10,
              marginRight: 16,
            }}>
              <Ionicons name={achievement.icon as any} size={20} color={achievement.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                {achievement.title}
              </Text>
              <Text style={commonStyles.textSecondary}>{achievement.description}</Text>
            </View>
          </View>
        ))}

        {/* Data Source Info */}
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginTop: 20 }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>Data Sources</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Stats are scraped from www.fupa.net and www.fussball.de to provide accurate player information.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
