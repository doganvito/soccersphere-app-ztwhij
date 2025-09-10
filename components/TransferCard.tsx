
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { Transfer } from '../types';

interface TransferCardProps {
  transfer: Transfer;
  onContact?: (transferId: string) => void;
}

export default function TransferCard({ transfer, onContact }: TransferCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return `${days} days ago`;
    }
  };

  const getTypeIcon = () => {
    return transfer.type === 'player_seeking' ? 'person-outline' : 'people-outline';
  };

  const getTypeText = () => {
    return transfer.type === 'player_seeking' ? 'Player Seeking Team' : 'Team Seeking Player';
  };

  return (
    <View style={commonStyles.card}>
      {/* Header */}
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <View style={commonStyles.row}>
          <Image
            source={{ uri: transfer.user.avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
            }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
              {transfer.user.name}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {transfer.user.club} • {formatTime(transfer.timestamp)}
            </Text>
          </View>
        </View>
        <View style={[commonStyles.row, { alignItems: 'center' }]}>
          <Ionicons name={getTypeIcon() as any} size={16} color={colors.primary} />
        </View>
      </View>

      {/* Type Badge */}
      <View style={{
        backgroundColor: colors.backgroundAlt,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-start',
        marginBottom: 12,
      }}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, fontWeight: '500' }]}>
          {getTypeText()}
        </Text>
      </View>

      {/* Position */}
      {transfer.position && (
        <View style={[commonStyles.row, { marginBottom: 8 }]}>
          <Ionicons name="football-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4, fontWeight: '500' }]}>
            Position: {transfer.position}
          </Text>
        </View>
      )}

      {/* Location */}
      {transfer.location && (
        <View style={[commonStyles.row, { marginBottom: 12 }]}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {transfer.location}
          </Text>
        </View>
      )}

      {/* Description */}
      <Text style={[commonStyles.text, { marginBottom: 16 }]}>
        {transfer.description}
      </Text>

      {/* Actions */}
      <View style={[commonStyles.row, commonStyles.spaceBetween]}>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => onContact?.(transfer.id)}
        >
          <Ionicons name="mail-outline" size={16} color="white" />
          <Text style={{ marginLeft: 6, color: 'white', fontWeight: '500' }}>
            Contact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
