
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../../styles/commonStyles';
import TransferCard from '../../components/TransferCard';
import { mockTransfers } from '../../data/mockData';
import { Transfer } from '../../types';

const transferTypes = ['All', 'Players Seeking', 'Teams Seeking'];

export default function TransfersScreen() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [activeType, setActiveType] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('Refreshing transfers...');
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleContact = (transferId: string) => {
    console.log('Contacting for transfer:', transferId);
    // TODO: Open contact modal or navigate to chat
    alert('Contact feature would open messaging in the full app');
  };

  const handleCreateTransfer = () => {
    console.log('Creating new transfer post...');
    // TODO: Navigate to create transfer screen
  };

  const handleTypePress = (type: string) => {
    console.log('Selected transfer type:', type);
    setActiveType(type);
  };

  const filteredTransfers = transfers.filter(transfer => {
    if (activeType === 'All') return true;
    if (activeType === 'Players Seeking') return transfer.type === 'player_seeking';
    if (activeType === 'Teams Seeking') return transfer.type === 'team_seeking';
    return true;
  });

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
          <Text style={commonStyles.title}>Transfers</Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.secondary,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={handleCreateTransfer}
          >
            <Ionicons name="add" size={16} color="white" />
            <Text style={{ marginLeft: 4, color: 'white', fontWeight: '500' }}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Types */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {transferTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={{
              backgroundColor: activeType === type ? colors.secondary : colors.backgroundAlt,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 12,
            }}
            onPress={() => handleTypePress(type)}
          >
            <Text
              style={{
                color: activeType === type ? 'white' : colors.text,
                fontWeight: '500',
              }}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transfers List */}
      <ScrollView
        style={commonStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredTransfers.map((transfer) => (
          <TransferCard
            key={transfer.id}
            transfer={transfer}
            onContact={handleContact}
          />
        ))}

        {filteredTransfers.length === 0 && (
          <View style={[commonStyles.card, commonStyles.center, { marginTop: 32 }]}>
            <Ionicons name="swap-horizontal-outline" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
              No transfers found for this category
            </Text>
            <Text style={[commonStyles.textSecondary, { marginTop: 8, textAlign: 'center' }]}>
              Be the first to post a transfer request!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
