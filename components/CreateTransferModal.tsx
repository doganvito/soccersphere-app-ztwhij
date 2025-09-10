
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface CreateTransferModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTransfer: (transferData: any) => void;
}

export default function CreateTransferModal({ visible, onClose, onCreateTransfer }: CreateTransferModalProps) {
  const [type, setType] = useState<'player_seeking' | 'team_seeking'>('player_seeking');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleCreate = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }
    
    const transferData = {
      type,
      position: position.trim(),
      description: description.trim(),
      location: location.trim(),
    };
    
    console.log('Creating transfer:', transferData);
    onCreateTransfer(transferData);
    
    // Reset form
    setPosition('');
    setDescription('');
    setLocation('');
    onClose();
  };

  const positions = [
    'Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker', 'Any Position'
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[commonStyles.container, { padding: 16 }]}>
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.subtitle}>Create Transfer</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.text, { marginBottom: 12, fontWeight: '600' }]}>Transfer Type</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: type === 'player_seeking' ? colors.primary : colors.backgroundAlt,
                    alignItems: 'center',
                  }
                ]}
                onPress={() => setType('player_seeking')}
              >
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={type === 'player_seeking' ? colors.background : colors.text} 
                />
                <Text style={{
                  marginTop: 8,
                  fontWeight: '600',
                  color: type === 'player_seeking' ? colors.background : colors.text,
                }}>
                  Player Seeking Team
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  {
                    flex: 1,
                    padding: 16,
                    borderRadius: 8,
                    backgroundColor: type === 'team_seeking' ? colors.primary : colors.backgroundAlt,
                    alignItems: 'center',
                  }
                ]}
                onPress={() => setType('team_seeking')}
              >
                <Ionicons 
                  name="people" 
                  size={24} 
                  color={type === 'team_seeking' ? colors.background : colors.text} 
                />
                <Text style={{
                  marginTop: 8,
                  fontWeight: '600',
                  color: type === 'team_seeking' ? colors.background : colors.text,
                }}>
                  Team Seeking Player
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Position</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {positions.map((pos) => (
                  <TouchableOpacity
                    key={pos}
                    style={[
                      {
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: position === pos ? colors.primary : colors.backgroundAlt,
                      }
                    ]}
                    onPress={() => setPosition(pos)}
                  >
                    <Text style={{
                      color: position === pos ? colors.background : colors.text,
                      fontWeight: position === pos ? '600' : '400',
                    }}>
                      {pos}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TextInput
              style={commonStyles.input}
              placeholder="Or enter custom position"
              placeholderTextColor={colors.textSecondary}
              value={position}
              onChangeText={setPosition}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Description *</Text>
            <TextInput
              style={[
                commonStyles.input,
                { 
                  height: 100,
                  textAlignVertical: 'top',
                }
              ]}
              placeholder={type === 'player_seeking' 
                ? "Describe your experience, availability, and what you're looking for..."
                : "Describe what kind of player you're looking for, team details, training schedule..."
              }
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={500}
            />
            <Text style={[commonStyles.textSecondary, { textAlign: 'right', marginTop: 4 }]}>
              {description.length}/500
            </Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={[commonStyles.text, { marginBottom: 8, fontWeight: '600' }]}>Location</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="e.g., Bremen Area, Hamburg, etc."
              placeholderTextColor={colors.textSecondary}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
