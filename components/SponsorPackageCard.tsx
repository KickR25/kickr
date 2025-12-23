
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
              color={colors.primary}
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
          <View style={styles.priceIconContainer}>
            <IconSymbol
              ios_icon_name="eurosign.circle.fill"
              android_material_icon_name="euro"
              size={22}
              color={colors.primary}
            />
          </View>
          <Text style={styles.price}>{pkg.price}</Text>
        </View>
        <View style={styles.priceItem}>
          <View style={styles.priceIconContainer}>
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar_today"
              size={22}
              color={colors.secondary}
            />
          </View>
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
          <IconSymbol
            ios_icon_name="paperplane.fill"
            android_material_icon_name="send"
            size={18}
            color={colors.white}
          />
          <Text style={styles.requestButtonText}>Anfrage senden</Text>
        </TouchableOpacity>
      )}
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
    fontWeight: '500',
  },
  availableBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  availableText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  packageImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.2,
  },
  duration: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  benefits: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    boxShadow: '0px 4px 12px rgba(0, 217, 95, 0.25)',
    elevation: 3,
  },
  requestButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
