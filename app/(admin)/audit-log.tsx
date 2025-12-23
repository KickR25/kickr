
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { AuditLogEntry } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AuditLogScreen() {
  const { isAdmin, getAuditLog } = useAdmin();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadLogs();
    }
  }, [isAdmin]);

  const loadLogs = async () => {
    const data = await getAuditLog();
    setLogs(data);
    setLoading(false);
  };

  const getActionLabel = (actionType: string): string => {
    switch (actionType) {
      case 'sanction_created':
        return 'Sanktion erstellt';
      case 'sanction_revoked':
        return 'Sanktion aufgehoben';
      case 'admin_promoted':
        return 'Admin befördert';
      case 'admin_demoted':
        return 'Admin degradiert';
      case 'admin_removed':
        return 'Admin entfernt';
      default:
        return actionType;
    }
  };

  const getActionColor = (actionType: string): string => {
    switch (actionType) {
      case 'sanction_created':
        return '#FF3B30';
      case 'sanction_revoked':
        return '#34C759';
      case 'admin_promoted':
        return '#007AFF';
      case 'admin_demoted':
      case 'admin_removed':
        return '#FF9500';
      default:
        return colors.text;
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
        <Text style={styles.headerTitle}>Audit Log</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Lade Protokoll...</Text>
        ) : logs.length === 0 ? (
          <Text style={styles.emptyText}>Keine Einträge vorhanden</Text>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.actionBadge,
                    { backgroundColor: `${getActionColor(log.actionType)}20` },
                  ]}
                >
                  <Text style={[styles.actionText, { color: getActionColor(log.actionType) }]}>
                    {getActionLabel(log.actionType)}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {log.timestamp.toLocaleString('de-DE')}
                </Text>
              </View>

              <View style={styles.logInfo}>
                <Text style={styles.infoLabel}>Durchgeführt von:</Text>
                <Text style={styles.infoText}>{log.actorAdminName || 'Unbekannt'}</Text>
              </View>

              {log.targetUserName && (
                <View style={styles.logInfo}>
                  <Text style={styles.infoLabel}>Ziel:</Text>
                  <Text style={styles.infoText}>{log.targetUserName}</Text>
                </View>
              )}

              {log.details && Object.keys(log.details).length > 0 && (
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailsLabel}>Details:</Text>
                  <Text style={styles.detailsText}>{JSON.stringify(log.details, null, 2)}</Text>
                </View>
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
    padding: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  logCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logInfo: {
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
  detailsContainer: {
    marginTop: 8,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  detailsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  detailsText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
