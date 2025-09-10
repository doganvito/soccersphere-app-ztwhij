
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../styles/commonStyles';
import { currentUser } from '../../data/mockData';
import { User } from '../../types';

export default function ProfileScreen() {
  const [user, setUser] = useState<User>(currentUser);

  const handleEditProfile = () => {
    console.log('Editing profile...');
    // TODO: Navigate to edit profile screen
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    // TODO: Navigate to settings screen
  };

  const StatCard = ({ label, value, icon }: { label: string; value: number; icon: string }) => (
    <View style={[commonStyles.card, { flex: 1, marginHorizontal: 4, alignItems: 'center' }]}>
      <Ionicons name={icon as any} size={24} color={colors.primary} />
      <Text style={[commonStyles.title, { fontSize: 20, marginTop: 8, marginBottom: 4 }]}>
        {value}
      </Text>
      <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={{
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.card,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}>
        <View style={[commonStyles.row, commonStyles.spaceBetween]}>
          <Text style={commonStyles.title}>Profile</Text>
          <TouchableOpacity onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={[commonStyles.card, { alignItems: 'center', marginTop: 16 }]}>
          <Image
            source={{ uri: user.avatar }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 16,
            }}
          />
          <Text style={[commonStyles.title, { fontSize: 24, marginBottom: 4 }]}>
            {user.name}
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 16, marginBottom: 8 }]}>
            {user.position}
          </Text>
          <View style={[commonStyles.row, { marginBottom: 16 }]}>
            <Ionicons name="shield-outline" size={16} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
              {user.club}
            </Text>
          </View>
          
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 20,
            }}
            onPress={handleEditProfile}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={[commonStyles.subtitle, { marginTop: 24, marginBottom: 12, paddingHorizontal: 4 }]}>
          Season Stats
        </Text>
        <View style={[commonStyles.row, { marginBottom: 24 }]}>
          <StatCard
            label="Games"
            value={user.stats.playedGames}
            icon="football-outline"
          />
          <StatCard
            label="Goals"
            value={user.stats.goals}
            icon="trophy-outline"
          />
          <StatCard
            label="Assists"
            value={user.stats.assists}
            icon="hand-left-outline"
          />
        </View>

        {/* Data Source Info */}
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
              Stats Integration
            </Text>
          </View>
          <Text style={[commonStyles.textSecondary, { marginBottom: 8 }]}>
            In the full version, stats would be automatically scraped from:
          </Text>
          <Text style={[commonStyles.textSecondary, { marginLeft: 16 }]}>
            • www.fupa.net
          </Text>
          <Text style={[commonStyles.textSecondary, { marginLeft: 16 }]}>
            • www.fussball.de
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={[commonStyles.card, { marginTop: 16 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Quick Actions
          </Text>
          
          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12 }]}>
            <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12 }]}>
              Create Post
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12 }]}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12 }]}>
              Create Event
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[commonStyles.row, { paddingVertical: 12 }]}>
            <Ionicons name="swap-horizontal-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginLeft: 12 }]}>
              Post Transfer
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
