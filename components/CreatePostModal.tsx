
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onCreatePost: (content: string, type: 'text' | 'image' | 'video' | 'reel') => void;
}

export default function CreatePostModal({ visible, onClose, onCreatePost }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'reel'>('text');

  const handleCreate = () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }
    
    console.log('Creating post:', { content, type: postType });
    onCreatePost(content, postType);
    setContent('');
    setPostType('text');
    onClose();
  };

  const postTypes = [
    { key: 'text', label: 'Text', icon: 'text-outline' },
    { key: 'image', label: 'Photo', icon: 'image-outline' },
    { key: 'video', label: 'Video', icon: 'videocam-outline' },
    { key: 'reel', label: 'Reel', icon: 'play-circle-outline' },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[commonStyles.container, { padding: 16 }]}>
        <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 20 }]}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.subtitle}>Create Post</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Post</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          {postTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[
                {
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 12,
                  marginHorizontal: 4,
                  borderRadius: 8,
                  backgroundColor: postType === type.key ? colors.primary : colors.backgroundAlt,
                },
              ]}
              onPress={() => setPostType(type.key as any)}
            >
              <Ionicons 
                name={type.icon as any} 
                size={20} 
                color={postType === type.key ? colors.background : colors.text} 
              />
              <Text style={{
                fontSize: 12,
                color: postType === type.key ? colors.background : colors.text,
                marginTop: 4,
              }}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[
            commonStyles.input,
            { 
              height: 120,
              textAlignVertical: 'top',
              fontSize: 16,
            }
          ]}
          placeholder="What's happening in your sports world?"
          placeholderTextColor={colors.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
          maxLength={280}
        />

        <Text style={[commonStyles.textSecondary, { textAlign: 'right', marginTop: 8 }]}>
          {content.length}/280
        </Text>
      </View>
    </Modal>
  );
}
