
import { colors, commonStyles } from '../../styles/commonStyles';
import { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { mockTransfers, currentUser } from '../../data/mockData';
import { Transfer } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import TransferCard from '../../components/TransferCard';
import CreateTransferModal from '../../components/CreateTransferModal';

export default function TransfersScreen() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [refreshing, setRefreshing] = useState(false);
  const [activeType, setActiveType] = useState<'all' | 'player_seeking' | 'team_seeking'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('Refreshing transfers...');
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleContact = (transferId: string) => {
    console.log('Contacting for transfer:', transferId);
    // TODO: Open contact modal or navigate to chat
    alert('Contact feature will be available soon!');
  };

  const handleCreateTransfer = (transferData: any) => {
    const newTransfer: Transfer = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      type: transferData.type,
      position: transferData.position,
      description: transferData.description,
      timestamp: new Date(),
      location: transferData.location,
    };
    
    console.log('Creating new transfer:', newTransfer);
    setTransfers(prevTransfers => [newTransfer, ...prevTransfers]);
  };

  const handleTypePress = (type: 'all' | 'player_seeking' | 'team_seeking') => {
    console.log('Filtering transfers by type:', type);
    setActiveType(type);
  };

  const filteredTransfers = activeType === 'all' 
    ? transfers 
    : transfers.filter(transfer => transfer.type === activeType);

  const filterButtons = [
    { key: 'all', label: 'All', icon: 'list' },
    { key: 'player_seeking', label: 'Players', icon: 'person' },
    { key: 'team_seeking', label: 'Teams', icon: 'people' },
  ];

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { padding: 16, paddingBottom: 8 }]}>
        <Text style={commonStyles.title}>Transfers</Text>
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
            <Text style={{ color: colors.background, marginLeft: 4, fontWeight: '600' }}>Transfer</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60, paddingHorizontal: 16, marginBottom: 8 }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {filterButtons.map((button) => (
            <TouchableOpacity
              key={button.key}
              style={[
                {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: activeType === button.key ? colors.primary : colors.backgroundAlt,
                  flexDirection: 'row',
                  alignItems: 'center',
                }
              ]}
              onPress={() => handleTypePress(button.key as any)}
            >
              <Ionicons 
                name={button.icon as any} 
                size={16} 
                color={activeType === button.key ? colors.background : colors.text} 
              />
              <Text style={{
                marginLeft: 6,
                color: activeType === button.key ? colors.background : colors.text,
                fontWeight: activeType === button.key ? '600' : '400',
              }}>
                {button.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>Transfer Market</Text>
          </View>
          <Text style={commonStyles.textSecondary}>
            Connect players with teams. Find your next opportunity or discover new talent!
          </Text>
        </View>

        {filteredTransfers.map((transfer) => (
          <TransferCard
            key={transfer.id}
            transfer={transfer}
            onContact={handleContact}
          />
        ))}
        
        {filteredTransfers.length === 0 && (
          <View style={[commonStyles.card, commonStyles.center, { paddingVertical: 40 }]}>
            <Ionicons name="search" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
              No transfers found
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Try adjusting your filters or create a new transfer post
            </Text>
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <CreateTransferModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTransfer={handleCreateTransfer}
      />
    </View>
  );
}
