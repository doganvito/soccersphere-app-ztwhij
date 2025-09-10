
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import { colors, commonStyles } from '../../styles/commonStyles';
import PostCard from '../../components/PostCard';
import { mockPosts } from '../../data/mockData';
import { Post } from '../../types';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    console.log('Refreshing home feed...');
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLike = (postId: string) => {
    console.log('Liking post:', postId);
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    console.log('Opening comments for post:', postId);
    // TODO: Navigate to comments screen
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
        <Text style={commonStyles.title}>Sports Feed</Text>
      </View>

      {/* Feed */}
      <ScrollView
        style={commonStyles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </ScrollView>
    </View>
  );
}
