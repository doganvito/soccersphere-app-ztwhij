
import { colors, commonStyles } from '../../styles/commonStyles';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import EventCard from '../../components/EventCard';
import { useState } from 'react';
import { mockPosts, mockEvents, mockTransfers, mockUsers } from '../../data/mockData';
import PostCard from '../../components/PostCard';
import SearchBar from '../../components/SearchBar';
import TransferCard from '../../components/TransferCard';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'posts' | 'events' | 'transfers' | 'users'>('all');

  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
    setSearchText(text);
  };

  const handleCategoryPress = (category: 'all' | 'posts' | 'events' | 'transfers' | 'users') => {
    console.log('Filtering by category:', category);
    setActiveCategory(category);
  };

  const categories = [
    { key: 'all', label: 'All', icon: 'search' },
    { key: 'posts', label: 'Posts', icon: 'document-text' },
    { key: 'events', label: 'Events', icon: 'calendar' },
    { key: 'transfers', label: 'Transfers', icon: 'swap-horizontal' },
    { key: 'users', label: 'Players', icon: 'people' },
  ];

  const filterData = () => {
    const query = searchText.toLowerCase();
    
    const filteredPosts = mockPosts.filter(post => 
      post.content.toLowerCase().includes(query) ||
      post.user.name.toLowerCase().includes(query) ||
      post.user.club.toLowerCase().includes(query)
    );
    
    const filteredEvents = mockEvents.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.club.toLowerCase().includes(query) ||
      event.game.toLowerCase().includes(query) ||
      event.address.toLowerCase().includes(query)
    );
    
    const filteredTransfers = mockTransfers.filter(transfer => 
      transfer.description.toLowerCase().includes(query) ||
      transfer.position?.toLowerCase().includes(query) ||
      transfer.user.name.toLowerCase().includes(query) ||
      transfer.location?.toLowerCase().includes(query)
    );
    
    const filteredUsers = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.club.toLowerCase().includes(query) ||
      user.position.toLowerCase().includes(query)
    );

    return { filteredPosts, filteredEvents, filteredTransfers, filteredUsers };
  };

  const renderContent = () => {
    if (!searchText.trim()) {
      return (
        <View style={[commonStyles.center, { paddingVertical: 60 }]}>
          <Ionicons name="search" size={64} color={colors.textSecondary} />
          <Text style={[commonStyles.subtitle, { marginTop: 16, color: colors.textSecondary }]}>
            Search Sports Content
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }]}>
            Find posts, events, transfers, and players in your sports community
          </Text>
        </View>
      );
    }

    const { filteredPosts, filteredEvents, filteredTransfers, filteredUsers } = filterData();
    const hasResults = filteredPosts.length > 0 || filteredEvents.length > 0 || 
                     filteredTransfers.length > 0 || filteredUsers.length > 0;

    if (!hasResults) {
      return (
        <View style={[commonStyles.center, { paddingVertical: 60 }]}>
          <Ionicons name="search" size={48} color={colors.textSecondary} />
          <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
            No results found for "{searchText}"
          </Text>
          <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
            Try different keywords or check your spelling
          </Text>
        </View>
      );
    }

    return (
      <View>
        {/* Users */}
        {(activeCategory === 'all' || activeCategory === 'users') && filteredUsers.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Players</Text>
            {filteredUsers.map((user) => (
              <View key={user.id} style={[commonStyles.card, commonStyles.row]}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[commonStyles.text, { fontWeight: '600', marginBottom: 4 }]}>
                    {user.name}
                  </Text>
                  <Text style={[commonStyles.textSecondary, { marginBottom: 2 }]}>
                    {user.position} • {user.club}
                  </Text>
                  <Text style={commonStyles.textSecondary}>
                    {user.stats.playedGames} games • {user.stats.goals} goals • {user.stats.assists} assists
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Posts */}
        {(activeCategory === 'all' || activeCategory === 'posts') && filteredPosts.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Posts</Text>
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </View>
        )}

        {/* Events */}
        {(activeCategory === 'all' || activeCategory === 'events') && filteredEvents.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Events</Text>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </View>
        )}

        {/* Transfers */}
        {(activeCategory === 'all' || activeCategory === 'transfers') && filteredTransfers.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>Transfers</Text>
            {filteredTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <Text style={[commonStyles.title, { marginBottom: 16 }]}>Search</Text>
        <SearchBar
          value={searchText}
          onChangeText={handleSearch}
          placeholder="Search posts, events, players..."
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 60, paddingHorizontal: 16, marginBottom: 8 }}
      >
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: activeCategory === category.key ? colors.primary : colors.backgroundAlt,
                  flexDirection: 'row',
                  alignItems: 'center',
                }
              ]}
              onPress={() => handleCategoryPress(category.key as any)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={activeCategory === category.key ? colors.background : colors.text} 
              />
              <Text style={{
                marginLeft: 6,
                color: activeCategory === category.key ? colors.background : colors.text,
                fontWeight: activeCategory === category.key ? '600' : '400',
              }}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
