
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SponsorPackage } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface SponsorPackageCardProps {
  package: SponsorPackage;
  onPress?: () => void;
  onRequest?: (packageId: string) => void;
}

export default function SponsorPackageCard({ package: pkg, onPress, onRequest }: SponsorPackageCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Image
          source={{ uri: pkg.userAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{pkg.userName}</Text>
          <View style={styles.locationRow}>
            <IconSymbol
              ios_icon_name="location"
              android_material_icon_name="location_on"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.location}>{pkg.region}</Text>
          </View>
        </View>
        {pkg.available && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Verfügbar</Text>
          </View>
        )}
      </View>

      {pkg.images && pkg.images.length > 0 && (
        <Image
          source={{ uri: pkg.images[0] }}
          style={styles.packageImage}
          resizeMode="cover"
        />
      )}

      <Text style={styles.packageName}>{pkg.packageName}</Text>

      <View style={styles.priceRow}>
        <View style={styles.priceItem}>
          <IconSymbol
            ios_icon_name="eurosign.circle"
            android_material_icon_name="euro"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.price}>{pkg.price}</Text>
        </View>
        <View style={styles.priceItem}>
          <IconSymbol
            ios_icon_name="calendar"
            android_material_icon_name="calendar_today"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.duration}>{pkg.duration}</Text>
        </View>
      </View>

      <Text style={styles.benefitsTitle}>Leistungen:</Text>
      <Text style={styles.benefits}>{pkg.benefits}</Text>

      {onRequest && (
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => onRequest(pkg.id)}
        >
          <Text style={styles.requestButtonText}>Anfrage senden</Text>
        </TouchableOpacity>
      )}
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  availableBadge: {
    backgroundColor: colors.success,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  availableText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  packageImage: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  benefits: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
