
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Share, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Post } from '@/types';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useBanCheck } from '@/hooks/useBanCheck';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onRepost?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment, onShare, onRepost }: PostCardProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const { hasCommentBan, getCommentBan, formatRemainingTime } = useBanCheck();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  if (!user) {
    return null;
  }

  const isLiked = post.likes.includes(user.id);

  const handleComment = () => {
    if (hasCommentBan) {
      const ban = getCommentBan();
      if (ban) {
        const timeText = ban.isPermanent
          ? 'dauerhaft gesperrt'
          : `bis ${ban.endsAt?.toLocaleString('de-DE')} gesperrt`;
        Alert.alert(
          'Kommentieren nicht möglich',
          `Du bist ${timeText}.\n\nGrund: ${ban.reason}`,
          [{ text: 'OK' }]
        );
      }
      return;
    }

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
    <View style={[styles.container, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Image
          source={{ uri: post.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
          style={[styles.avatar, { borderColor: colors.borderLight }]}
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{post.userName}</Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{formatTimestamp(post.timestamp)}</Text>
        </View>
      </View>

      <Text style={[styles.content, { color: colors.text }]}>{post.content}</Text>

      {post.images && post.images.length > 0 && (
        <Image
          source={{ uri: post.images[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={[styles.stats, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>{post.likes.length} Likes</Text>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>{post.comments.length} Kommentare</Text>
        <Text style={[styles.statsText, { color: colors.textSecondary }]}>{post.shares} Mal geteilt</Text>
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
          <Text style={[styles.actionText, { color: isLiked ? colors.secondary : colors.textSecondary }, isLiked && { fontWeight: '700' }]}>Like</Text>
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
          <Text style={[styles.actionText, { color: showComments ? colors.primary : colors.textSecondary }, showComments && { fontWeight: '700' }]}>Kommentar</Text>
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
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Teilen</Text>
        </TouchableOpacity>
      </View>

      {showComments && (
        <View style={[styles.commentsSection, { borderTopColor: colors.border }]}>
          {post.comments.map((comment, index) => (
            <View key={index} style={styles.comment}>
              <Image
                source={{ uri: comment.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
                style={[styles.commentAvatar, { borderColor: colors.borderLight }]}
              />
              <View style={[styles.commentContent, { backgroundColor: colors.card }]}>
                <Text style={[styles.commentUserName, { color: colors.text }]}>{comment.userName}</Text>
                <Text style={[styles.commentText, { color: colors.text }]}>{comment.content}</Text>
              </View>
            </View>
          ))}

          <View style={styles.commentInput}>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.borderLight }]}
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
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    fontSize: 15,
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
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
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
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
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
  },
  commentContent: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
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
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 14,
    borderWidth: 1,
  },
});
