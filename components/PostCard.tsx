
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Share, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Post } from '@/types';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onRepost?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onRepost }: PostCardProps) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  if (!user) {
    return null;
  }

  const isLiked = post.likes.includes(user.id);

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleShare = async () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Abbrechen', 'In meinem Profil teilen', 'Über System teilen'],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Repost to own profile
            if (onRepost) {
              onRepost(post.id);
            }
            onShare(post.id);
            Alert.alert('Erfolg', 'Beitrag wurde in deinem Profil geteilt');
          } else if (buttonIndex === 2) {
            // Native share
            try {
              await Share.share({
                message: `${post.userName}: ${post.content}\n\nGeteilt über KickR`,
                title: 'KickR Beitrag',
              });
              onShare(post.id);
            } catch (error) {
              console.error('Error sharing:', error);
            }
          }
        }
      );
    } else {
      // Android - show custom dialog
      Alert.alert(
        'Beitrag teilen',
        'Wie möchtest du diesen Beitrag teilen?',
        [
          {
            text: 'Abbrechen',
            style: 'cancel',
          },
          {
            text: 'In meinem Profil teilen',
            onPress: () => {
              if (onRepost) {
                onRepost(post.id);
              }
              onShare(post.id);
              Alert.alert('Erfolg', 'Beitrag wurde in deinem Profil geteilt');
            },
          },
          {
            text: 'Über System teilen',
            onPress: async () => {
              try {
                await Share.share({
                  message: `${post.userName}: ${post.content}\n\nGeteilt über KickR`,
                  title: 'KickR Beitrag',
                });
                onShare(post.id);
              } catch (error) {
                console.error('Error sharing:', error);
              }
            },
          },
        ]
      );
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `vor ${minutes} Min`;
    if (hours < 24) return `vor ${hours} Std`;
    return `vor ${days} Tag${days > 1 ? 'en' : ''}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.stats}>
        <Text style={styles.statsText}>{post.likes.length} Likes</Text>
        <Text style={styles.statsText}>{post.comments.length} Kommentare</Text>
        <Text style={styles.statsText}>{post.shares} Mal geteilt</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(post.id)}
        >
          <IconSymbol
            ios_icon_name={isLiked ? 'heart.fill' : 'heart'}
            android_material_icon_name={isLiked ? 'favorite' : 'favorite_border'}
            size={22}
            color={isLiked ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.actionText, isLiked && { color: colors.secondary, fontWeight: '700' }]}>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <IconSymbol
            ios_icon_name="bubble.left"
            android_material_icon_name="comment"
            size={22}
            color={showComments ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.actionText, showComments && { color: colors.primary, fontWeight: '700' }]}>Kommentar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <IconSymbol
            ios_icon_name="arrowshape.turn.up.right"
            android_material_icon_name="share"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={styles.actionText}>Teilen</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Image
                source={{ uri: comment.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>{comment.userName}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
              </View>
            </View>
          ))}

          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Schreibe einen Kommentar..."
              placeholderTextColor={colors.textSecondary}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleComment} disabled={!commentText.trim()}>
              <IconSymbol
                ios_icon_name="paperplane.fill"
                android_material_icon_name="send"
                size={24}
                color={commentText.trim() ? colors.primary : colors.mediumGray}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  commentContent: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 10,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
});
