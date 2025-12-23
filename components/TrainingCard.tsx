
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
              <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
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
            color={colors.textSecondary}
          />
          <Text style={styles.detailText}>{training.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="person.2"
            android_material_icon_name="group"
            size={16}
            color={colors.textSecondary}
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
            color={isLiked ? colors.error : colors.textSecondary}
          />
          <Text style={styles.actionText}>{training.likes.length}</Text>
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
          <Text style={styles.actionText}>Speichern</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
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
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: colors.primary,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  goal: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  trainingImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
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
  },
  actionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
