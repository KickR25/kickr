
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { Sanction, SanctionType } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SanctionsScreen() {
  const { isAdmin, canCreateBans, getAllSanctions, revokeSanction, searchUsers } = useAdmin();
  const [sanctions, setSanctions] = useState<Sanction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'REVOKED' | 'EXPIRED'>('ACTIVE');

  useEffect(() => {
    if (isAdmin) {
      loadSanctions();
    }
  }, [isAdmin]);

  const loadSanctions = async () => {
    const data = await getAllSanctions();
    setSanctions(data);
    setLoading(false);
  };

  const handleRevoke = async (sanctionId: string) => {
    Alert.alert(
      'Sanktion aufheben',
      'Möchtest du diese Sanktion wirklich aufheben?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Aufheben',
          style: 'destructive',
          onPress: async () => {
            const result = await revokeSanction(sanctionId);
            if (result.success) {
              Alert.alert('Erfolg', 'Sanktion wurde aufgehoben');
              loadSanctions();
            } else {
              Alert.alert('Fehler', result.error || 'Fehler beim Aufheben');
            }
          },
        },
      ]
    );
  };

  const filteredSanctions = sanctions.filter(s => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const getSanctionTypeLabel = (type: SanctionType): string => {
    switch (type) {
      case 'MESSAGE_BAN':
        return 'Nachrichtensperre';
      case 'COMMENT_BAN':
        return 'Kommentarsperre';
      case 'FULL_BAN':
        return 'Vollsperre';
    }
  };

  const getSanctionTypeColor = (type: SanctionType): string => {
    switch (type) {
      case 'MESSAGE_BAN':
        return '#FF9500';
      case 'COMMENT_BAN':
        return '#FF9500';
      case 'FULL_BAN':
        return '#FF3B30';
    }
  };

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Kein Zugriff</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sanktionen</Text>
        {canCreateBans && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/(admin)/user-lookup')}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {(['ALL', 'ACTIVE', 'REVOKED', 'EXPIRED'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'ALL' ? 'Alle' : f === 'ACTIVE' ? 'Aktiv' : f === 'REVOKED' ? 'Aufgehoben' : 'Abgelaufen'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Lade Sanktionen...</Text>
        ) : filteredSanctions.length === 0 ? (
          <Text style={styles.emptyText}>Keine Sanktionen gefunden</Text>
        ) : (
          filteredSanctions.map((sanction, index) => (
            <View key={index} style={styles.sanctionCard}>
              <View style={styles.sanctionHeader}>
                <View
                  style={[
                    styles.typeBadge,
                    { backgroundColor: `${getSanctionTypeColor(sanction.type)}20` },
                  ]}
                >
                  <Text style={[styles.typeText, { color: getSanctionTypeColor(sanction.type) }]}>
                    {getSanctionTypeLabel(sanction.type)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    sanction.status === 'ACTIVE' && styles.statusBadgeActive,
                    sanction.status === 'REVOKED' && styles.statusBadgeRevoked,
                    sanction.status === 'EXPIRED' && styles.statusBadgeExpired,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {sanction.status === 'ACTIVE'
                      ? 'Aktiv'
                      : sanction.status === 'REVOKED'
                      ? 'Aufgehoben'
                      : 'Abgelaufen'}
                  </Text>
                </View>
              </View>

              <View style={styles.sanctionInfo}>
                <Text style={styles.infoLabel}>Grund:</Text>
                <Text style={styles.infoText}>{sanction.reason}</Text>
              </View>

              <View style={styles.sanctionInfo}>
                <Text style={styles.infoLabel}>Erstellt von:</Text>
                <Text style={styles.infoText}>{sanction.createdByAdminName || 'Unbekannt'}</Text>
              </View>

              <View style={styles.sanctionInfo}>
                <Text style={styles.infoLabel}>Erstellt am:</Text>
                <Text style={styles.infoText}>{sanction.createdAt.toLocaleString('de-DE')}</Text>
              </View>

              {sanction.isPermanent ? (
                <View style={styles.sanctionInfo}>
                  <Text style={styles.infoLabel}>Dauer:</Text>
                  <Text style={[styles.infoText, styles.permanentText]}>Permanent</Text>
                </View>
              ) : sanction.endsAt ? (
                <View style={styles.sanctionInfo}>
                  <Text style={styles.infoLabel}>Endet am:</Text>
                  <Text style={styles.infoText}>{sanction.endsAt.toLocaleString('de-DE')}</Text>
                </View>
              ) : null}

              {sanction.status === 'ACTIVE' && canCreateBans && (
                <TouchableOpacity
                  style={styles.revokeButton}
                  onPress={() => handleRevoke(sanction.id)}
                >
                  <Text style={styles.revokeButtonText}>Aufheben</Text>
                </TouchableOpacity>
              )}
            </View>
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
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginLeft: 8,
  },
  addButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: colors.card,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  sanctionCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sanctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusBadgeActive: {
    backgroundColor: '#34C75920',
  },
  statusBadgeRevoked: {
    backgroundColor: '#8E8E9320',
  },
  statusBadgeExpired: {
    backgroundColor: '#FF950020',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  sanctionInfo: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
  },
  permanentText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  revokeButton: {
    marginTop: 12,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  revokeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
  },
});
