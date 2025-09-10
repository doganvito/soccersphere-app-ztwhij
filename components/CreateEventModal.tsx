
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateEvent: (eventData: any) => void;
}

export default function CreateEventModal({ visible, onClose, onCreateEvent }: CreateEventModalProps) {
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');
  const [address, setAddress] = useState('');
  const [game, setGame] = useState('');
  const [date, setDate] = useState('');

  const handleCreate = () => {
    if (!title.trim() || !club.trim() || !address.trim() || !game.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    const eventData = {
      title: title.trim(),
      club: club.trim(),
      address: address.trim(),
      game: game.trim(),
      date: date || new Date().toISOString(),
    };
    
    console.log('Creating event:', eventData);
    onCreateEvent(eventData);
    
    // Reset form
    setTitle('');
    setClub('');
    setAddress('');
    setGame('');
    setDate('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[commonStyles.container, { padding: 16 }]}>
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.subtitle}>Create Event</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Create</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Event Title *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Weekend Match, Training Session"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Club *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., SG Hassendorf/Bötersen"
              placeholderTextColor={colors.textSecondary}
              value={club}
              onChangeText={setClub}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Address *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Am weissen Moor"
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Game Details *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., SG Hassendorf/Bötersen vs. SG Reeßum/Taaken"
              placeholderTextColor={colors.textSecondary}
              value={game}
              onChangeText={setGame}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Date & Time</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., 2024-01-15 15:00"
              placeholderTextColor={colors.textSecondary}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginTop: 16 }]}>
            <View style={[commonStyles.row, { marginBottom: 8 }]}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>Event Info</Text>
            </View>
            <Text style={commonStyles.textSecondary}>
              Your event will be visible to all users. Players can join and see the location details.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
