
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Training } from '@/types';
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';

interface TrainingCardProps {
  training: Training;
  currentUserId: string;
  onLike: (trainingId: string) => void;
  onSave: (trainingId: string) => void;
  onPress?: () => void;
}

export default function TrainingCard({ training, currentUserId, onLike, onSave, onPress }: TrainingCardProps) {
  const { isDark } = useTheme();
  const colors = getColors(isDark);
  const isLiked = training.likes.includes(currentUserId);
  const isSaved = training.saves.includes(currentUserId);

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.cardWhite, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image
          source={{ uri: training.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
          style={[styles.avatar, { borderColor: colors.borderLight }]}
        />
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>{training.userName}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.badgeText, { color: colors.white }]}>{training.teamCategory}</Text>
            </View>
            {training.gender && (
              <View style={[styles.badge, styles.badgeSecondary, { backgroundColor: colors.accent }]}>
                <Text style={[styles.badgeText, { color: colors.white }]}>{training.gender}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{training.title}</Text>
      <Text style={[styles.goal, { color: colors.textSecondary }]}>Ziel: {training.goal}</Text>

      {training.images && training.images.length > 0 && (
        <Image
          source={{ uri: training.images[0] }}
          style={styles.trainingImage}
          resizeMode="cover"
        />
      )}

      <View style={[styles.details, { backgroundColor: colors.card }]}>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="clock"
            android_material_icon_name="schedule"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.detailText, { color: colors.text }]}>{training.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="person.2"
            android_material_icon_name="group"
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.detailText, { color: colors.text }]}>{training.playerCount}</Text>
        </View>
      </View>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(training.id)}
        >
          <IconSymbol
            ios_icon_name={isLiked ? 'heart.fill' : 'heart'}
            android_material_icon_name={isLiked ? 'favorite' : 'favorite_border'}
            size={22}
            color={isLiked ? colors.secondary : colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: isLiked ? colors.secondary : colors.textSecondary }, isLiked && { fontWeight: '700' }]}>
            {training.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <IconSymbol
            ios_icon_name="bubble.left"
            android_material_icon_name="comment"
            size={22}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{training.comments.length}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onSave(training.id)}
        >
          <IconSymbol
            ios_icon_name={isSaved ? 'bookmark.fill' : 'bookmark'}
            android_material_icon_name={isSaved ? 'bookmark' : 'bookmark_border'}
            size={22}
            color={isSaved ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: isSaved ? colors.primary : colors.textSecondary }, isSaved && { fontWeight: '700' }]}>
            Speichern
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  badgeSecondary: {
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  goal: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  trainingImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
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
});
