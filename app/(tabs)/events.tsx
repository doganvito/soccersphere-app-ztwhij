
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../styles/commonStyles';
import EventCard from '../../components/EventCard';
import { mockEvents } from '../../data/mockData';
import { Event } from '../../types';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('Refreshing events...');
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleJoinEvent = (eventId: string) => {
    console.log('Joining event:', eventId);
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId
          ? {
              ...event,
              isJoined: !event.isJoined,
              participants: event.isJoined ? event.participants - 1 : event.participants + 1,
            }
          : event
      )
    );
  };

  const handleCreateEvent = () => {
    console.log('Creating new event...');
    // TODO: Navigate to create event screen
  };

  const handleNearbyEvents = () => {
    console.log('Searching for nearby events...');
    // Note: react-native-maps is not supported in Natively
    alert('Location-based search is not available in Natively web version. This feature would work in the native mobile app.');
  };

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
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
          <Text style={commonStyles.title}>Events</Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={handleCreateEvent}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={{ marginLeft: 4, color: 'white', fontWeight: '500' }}>
              Create
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.row}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.backgroundAlt,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 12,
            }}
            onPress={handleNearbyEvents}
          >
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={{ marginLeft: 4, color: colors.primary, fontSize: 12, fontWeight: '500' }}>
              Nearby
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Events List */}
      <ScrollView
        style={commonStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={handleJoinEvent}
          />
        ))}

        {/* Location Note */}
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginTop: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>
              Location Features
            </Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Maps and location-based features are not supported in Natively web version. 
            In the native mobile app, you would be able to see events on a map and search for nearby games based on your location.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
