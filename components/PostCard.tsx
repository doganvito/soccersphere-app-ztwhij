
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  return (
    <View style={commonStyles.card}>
      {/* Header */}
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 12 }]}>
        <View style={commonStyles.row}>
          <Image
            source={{ uri: post.user.avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
            }}
          />
          <View>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
              {post.user.name}
            </Text>
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              {post.user.club} • {formatTime(post.timestamp)}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={[commonStyles.text, { marginBottom: 12 }]}>
        {post.content}
      </Text>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <Image
          source={{ uri: post.media[0] }}
          style={{
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
          }}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={[commonStyles.row, commonStyles.spaceBetween]}>
        <View style={commonStyles.row}>
          <TouchableOpacity
            style={[commonStyles.row, { marginRight: 24 }]}
            onPress={() => onLike?.(post.id)}
          >
            <Ionicons
              name={post.isLiked ? "heart" : "heart-outline"}
              size={20}
              color={post.isLiked ? colors.error : colors.textSecondary}
            />
            <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
              {post.likes}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={commonStyles.row}
            onPress={() => onComment?.(post.id)}
          >
            <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
            <Text style={[commonStyles.textSecondary, { marginLeft: 4 }]}>
              {post.comments}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
