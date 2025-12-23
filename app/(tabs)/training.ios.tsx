
import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import TrainingCard from '@/components/TrainingCard';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function TrainingScreen() {
  const { user, trainings, likeTraining, saveTraining } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bitte melden Sie sich an</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/d332ec97-81cd-453c-a68f-f9db9a18798f.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerSubtitle}>Lerne von anderen Trainern</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {
            Alert.alert('Info', 'Training erstellen Funktion wird bald verfügbar sein');
          }}
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

        {trainings.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="figure.soccer"
              android_material_icon_name="sports_soccer"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateTitle}>Noch keine Trainings</Text>
            <Text style={styles.emptyStateText}>
              Erstelle dein erstes Training oder warte auf Beiträge von anderen Trainern
            </Text>
          </View>
        ) : (
          trainings.map((training) => (
            <TrainingCard
              key={training.id}
              training={training}
              currentUserId={user.id}
              onLike={likeTraining}
              onSave={saveTraining}
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
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 8,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
  },
});
