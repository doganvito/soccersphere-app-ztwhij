
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { Event } from '../types';

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
}

export default function EventCard({ event, onJoin }: EventCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={commonStyles.card}>
      {/* Header */}
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text }}>
            {event.title}
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
            {event.club}
          </Text>
        </View>
        <View style={[commonStyles.row, { alignItems: 'center' }]}>
          <Ionicons name="people" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {event.participants}
          </Text>
        </View>
      </View>

      {/* Game Info */}
      <View style={{ marginBottom: 12 }}>
        <Text style={[commonStyles.text, { fontWeight: '500', marginBottom: 4 }]}>
          {event.game}
        </Text>
        <View style={[commonStyles.row, { marginBottom: 4 }]}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {event.address}
          </Text>
        </View>
        <View style={commonStyles.row}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
            {formatDate(event.date)}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={[commonStyles.row, commonStyles.spaceBetween]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor: event.isJoined ? colors.backgroundAlt : colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }
          ]}
          onPress={() => onJoin?.(event.id)}
        >
          <Ionicons
            name={event.isJoined ? "checkmark" : "add"}
            size={16}
            color={event.isJoined ? colors.text : 'white'}
          />
          <Text
            style={{
              marginLeft: 4,
              color: event.isJoined ? colors.text : 'white',
              fontWeight: '500',
            }}
          >
            {event.isJoined ? 'Joined' : 'Join'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
