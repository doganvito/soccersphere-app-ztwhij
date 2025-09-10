
import { colors, commonStyles } from '../../styles/commonStyles';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useCallback } from 'react';
import { mockPosts, currentUser } from '../../data/mockData';
import { Post } from '../../types';
import PostCard from '../../components/PostCard';
import CreatePostModal from '../../components/CreatePostModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleComment = (postId: string) => {
    console.log('Opening comments for post:', postId);
    // TODO: Navigate to comments screen
  };

  const handleCreatePost = (content: string, type: 'text' | 'image' | 'video' | 'reel') => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      content,
      type,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    
    console.log('Creating new post:', newPost);
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { padding: 16, paddingBottom: 8 }]}>
        <Text style={commonStyles.title}>Sports Feed</Text>
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
            <Text style={{ color: colors.background, marginLeft: 4, fontWeight: '600' }}>Post</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <CreatePostModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreatePost={handleCreatePost}
      />
    </View>
  );
}
