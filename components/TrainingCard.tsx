
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Training } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface TrainingCardProps {
  training: Training;
  currentUserId: string;
  onLike: (trainingId: string) => void;
  onSave: (trainingId: string) => void;
  onPress?: () => void;
}

export default function TrainingCard({ training, currentUserId, onLike, onSave, onPress }: TrainingCardProps) {
  const isLiked = training.likes.includes(currentUserId);
  const isSaved = training.saves.includes(currentUserId);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image
          source={{ uri: training.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{training.userName}</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{training.teamCategory}</Text>
            </View>
            {training.gender && (
              <View style={[styles.badge, styles.badgeSecondary]}>
                <Text style={styles.badgeText}>{training.gender}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <Text style={styles.title}>{training.title}</Text>
      <Text style={styles.goal}>Ziel: {training.goal}</Text>

      {training.images && training.images.length > 0 && (
        <Image
          source={{ uri: training.images[0] }}
          style={styles.trainingImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="clock"
            android_material_icon_name="schedule"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.detailText}>{training.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="person.2"
            android_material_icon_name="group"
            size={16}
            color={colors.primary}
          />
          <Text style={styles.detailText}>{training.playerCount}</Text>
        </View>
      </View>

      <View style={styles.actions}>
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
          <Text style={[styles.actionText, isLiked && { color: colors.secondary, fontWeight: '700' }]}>
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
          <Text style={styles.actionText}>{training.comments.length}</Text>
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
          <Text style={[styles.actionText, isSaved && { color: colors.primary, fontWeight: '700' }]}>
            Speichern
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
    marginBottom: 6,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  badgeSecondary: {
    backgroundColor: colors.accent,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  goal: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.card,
    borderRadius: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
});
