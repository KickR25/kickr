
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Image, TextInput, Alert } from 'react-native';
import { getColors } from '@/styles/commonStyles';
import PostCard from '@/components/PostCard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const { user, posts, likePost, commentOnPost, sharePost, addPost } = useAuth();
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Bitte melden Sie sich an</Text>
      </View>
    );
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Fehler', 'Bitte gib einen Text ein');
      return;
    }

    await addPost({
      content: newPostContent,
    });

    setNewPostContent('');
    setShowCreatePost(false);
    Alert.alert('Erfolg', 'Beitrag wurde erstellt');
  };

  const handleRepost = async (postId: string) => {
    const originalPost = posts.find(p => p.id === postId);
    if (originalPost) {
      await addPost({
        content: `Geteilt von ${originalPost.userName}:\n\n${originalPost.content}`,
        images: originalPost.images,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Image
          source={require('@/assets/images/a782a098-0dea-4c85-9045-a026ad2ee036.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.headerSubtitle, { color: colors.white }]}>Dein Fußball-Netzwerk</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[styles.createPost, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}
          onPress={() => setShowCreatePost(!showCreatePost)}
        >
          <IconSymbol
            ios_icon_name="plus.circle.fill"
            android_material_icon_name="add_circle"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.createPostText, { color: colors.textSecondary }]}>Was gibt&apos;s Neues?</Text>
        </TouchableOpacity>

        {showCreatePost && (
          <View style={[styles.createPostForm, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
            <TextInput
              style={[styles.createPostInput, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Teile deine Gedanken..."
              placeholderTextColor={colors.textSecondary}
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              numberOfLines={4}
            />
            <View style={styles.createPostActions}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: colors.card }]}
                onPress={() => {
                  setShowCreatePost(false);
                  setNewPostContent('');
                }}
              >
                <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Abbrechen</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.postButton, { backgroundColor: colors.primary }]}
                onPress={handleCreatePost}
              >
                <Text style={[styles.postButtonText, { color: colors.white }]}>Posten</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {posts.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="doc.text"
              android_material_icon_name="article"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>Noch keine Beiträge</Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              Erstelle deinen ersten Beitrag oder folge anderen Nutzern
            </Text>
          </View>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={likePost}
              onComment={commentOnPost}
              onShare={sharePost}
              onRepost={handleRepost}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 220,
    height: 60,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.9,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  createPost: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  createPostText: {
    fontSize: 16,
  },
  createPostForm: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  createPostInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  createPostActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
