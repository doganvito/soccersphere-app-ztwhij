
import { colors, commonStyles } from '../../styles/commonStyles';
import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import EventCard from '../../components/EventCard';
import CreateEventModal from '../../components/CreateEventModal';
import { mockEvents, currentUser } from '../../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../../types';

export default function EventsScreen() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('Refreshing events...');
    setRefreshing(true);
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
              participants: event.isJoined ? event.participants - 1 : event.participants + 1
            }
          : event
      )
    );
  };

  const handleCreateEvent = (eventData: any) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      title: eventData.title,
      club: eventData.club,
      address: eventData.address,
      game: eventData.game,
      date: new Date(eventData.date || Date.now() + 24 * 60 * 60 * 1000),
      participants: 1,
      isJoined: true,
    };
    
    console.log('Creating new event:', newEvent);
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleNearbyEvents = () => {
    console.log('Searching for nearby events...');
    // Note: react-native-maps is not supported in Natively
    alert('Location-based search is not available in the web version. This feature works on mobile devices.');
  };

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { padding: 16, paddingBottom: 8 }]}>
        <Text style={commonStyles.title}>Events</Text>
        <View style={[commonStyles.row, { gap: 12 }]}>
          <TouchableOpacity 
            onPress={handleNearbyEvents}
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="location" size={20} color={colors.background} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowCreateModal(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <View style={[commonStyles.row, { alignItems: 'center' }]}>
              <Ionicons name="add" size={20} color={colors.background} />
              <Text style={{ color: colors.background, marginLeft: 4, fontWeight: '600' }}>Event</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>Upcoming Events</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Find and join football events in your area. Create your own events and invite players!
          </Text>
        </View>

        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={handleJoinEvent}
          />
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <CreateEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateEvent={handleCreateEvent}
      />
    </View>
  );
}
