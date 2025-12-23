
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import SponsorPackageCard from '@/components/SponsorPackageCard';
import { mockSponsorPackages } from '@/data/mockData';
import { IconSymbol } from '@/components/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

export default function SponsorsScreen() {
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bitte melden Sie sich an</Text>
      </View>
    );
  }

  const handleRequest = (packageId: string) => {
    console.log('Request package:', packageId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/a782a098-0dea-4c85-9045-a026ad2ee036.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerSubtitle}>Finde deinen Sponsor</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {user.role === 'club' || user.role === 'trainer' ? (
          <TouchableOpacity style={styles.createButton}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add_circle"
              size={24}
              color={colors.white}
            />
            <Text style={styles.createButtonText}>Sponsorenpaket erstellen</Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.filterRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Alle</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Bronze</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Silber</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipOutline]}>
              <Text style={styles.filterChipTextOutline}>Gold</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {mockSponsorPackages.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="star"
              android_material_icon_name="star"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyStateTitle}>Noch keine Sponsorenpakete</Text>
            <Text style={styles.emptyStateText}>
              Erstelle dein erstes Sponsorenpaket oder warte auf Angebote
            </Text>
          </View>
        ) : (
          mockSponsorPackages.map((pkg) => (
            <SponsorPackageCard
              key={pkg.id}
              package={pkg}
              onRequest={handleRequest}
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
    paddingTop: Platform.OS === 'android' ? 48 : 60,
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
