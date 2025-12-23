
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import TrainingCard from '@/components/TrainingCard';
import { mockTrainings, currentUser } from '@/data/mockData';
import { Training } from '@/types';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function TrainingScreen() {
  const [trainings, setTrainings] = useState<Training[]>(mockTrainings);

  const handleLike = (trainingId: string) => {
    setTrainings(prevTrainings =>
      prevTrainings.map(training => {
        if (training.id === trainingId) {
          const isLiked = training.likes.includes(currentUser.id);
          return {
            ...training,
            likes: isLiked
              ? training.likes.filter(id => id !== currentUser.id)
              : [...training.likes, currentUser.id],
          };
        }
        return training;
      })
    );
  };

  const handleSave = (trainingId: string) => {
    setTrainings(prevTrainings =>
      prevTrainings.map(training => {
        if (training.id === trainingId) {
          const isSaved = training.saves.includes(currentUser.id);
          return {
            ...training,
            saves: isSaved
              ? training.saves.filter(id => id !== currentUser.id)
              : [...training.saves, currentUser.id],
          };
        }
        return training;
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training Hub</Text>
        <Text style={styles.headerSubtitle}>Lerne von anderen Trainern</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/create-training')}
        >
          <IconSymbol
            ios_icon_name="plus.circle.fill"
            android_material_icon_name="add_circle"
            size={24}
            color={colors.white}
          />
          <Text style={styles.createButtonText}>Training erstellen</Text>
        </TouchableOpacity>

        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Alle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Technik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Taktik</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Passspiel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Pressing</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {trainings.map((training) => (
          <TrainingCard
            key={training.id}
            training={training}
            currentUserId={currentUser.id}
            onLike={handleLike}
            onSave={handleSave}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white,
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
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipOutline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  filterChipTextOutline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
});
