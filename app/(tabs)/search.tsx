
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { colors, commonStyles } from '../../styles/commonStyles';
import SearchBar from '../../components/SearchBar';
import PostCard from '../../components/PostCard';
import EventCard from '../../components/EventCard';
import TransferCard from '../../components/TransferCard';
import { mockPosts, mockEvents, mockTransfers } from '../../data/mockData';

const searchCategories = ['All', 'Posts', 'Events', 'Transfers', 'Users'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleSearch = (text: string) => {
    console.log('Searching for:', text);
    setSearchQuery(text);
  };

  const handleCategoryPress = (category: string) => {
    console.log('Selected category:', category);
    setActiveCategory(category);
  };

  const renderContent = () => {
    if (activeCategory === 'All' || activeCategory === 'Posts') {
      return mockPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ));
    }
    
    if (activeCategory === 'Events') {
      return mockEvents.map((event) => (
        <EventCard key={event.id} event={event} />
      ));
    }
    
    if (activeCategory === 'Transfers') {
      return mockTransfers.map((transfer) => (
        <TransferCard key={transfer.id} transfer={transfer} />
      ));
    }

    return null;
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
        <Text style={commonStyles.title}>Search</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search posts, events, players..."
        />
      </View>

      {/* Categories */}
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
        {searchCategories.map((category) => (
          <TouchableOpacity
            key={category}
            style={{
              backgroundColor: activeCategory === category ? colors.primary : colors.backgroundAlt,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 12,
            }}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={{
                color: activeCategory === category ? 'white' : colors.text,
                fontWeight: '500',
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}
