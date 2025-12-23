
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { User, AdminLevel } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AdminManagementScreen() {
  const { isAdmin, canManageAdmins, searchUsers, promoteToAdmin, demoteAdmin } = useAdmin();
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showLevelModal, setShowLevelModal] = useState(false);

  useEffect(() => {
    if (canManageAdmins) {
      loadAdmins();
    }
  }, [canManageAdmins]);

  const loadAdmins = async () => {
    // In a real implementation, you'd have a specific query for admins
    const allUsers = await searchUsers('');
    const adminUsers = allUsers.filter(u => u.adminLevel);
    setAdmins(adminUsers);
    setLoading(false);
  };

  const handlePromote = (user: User) => {
    setSelectedUser(user);
    setShowLevelModal(true);
  };

  const handleSetLevel = async (level: AdminLevel) => {
    if (!selectedUser) return;

    const result = await promoteToAdmin(selectedUser.id, level);
    if (result.success) {
      Alert.alert('Erfolg', 'Admin-Level wurde gesetzt');
      setShowLevelModal(false);
      loadAdmins();
    } else {
      Alert.alert('Fehler', result.error || 'Fehler beim Setzen des Levels');
    }
  };

  const handleDemote = async (user: User) => {
    Alert.alert(
      'Admin entfernen',
      `Möchtest du ${user.name} wirklich als Admin entfernen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: async () => {
            const result = await demoteAdmin(user.id);
            if (result.success) {
              Alert.alert('Erfolg', 'Admin wurde entfernt');
              loadAdmins();
            } else {
              Alert.alert('Fehler', result.error || 'Fehler beim Entfernen');
            }
          },
        },
      ]
    );
  };

  if (!canManageAdmins) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Kein Zugriff</Text>
        <Text style={styles.errorSubtext}>Nur Admin 3-4 können Admins verwalten</Text>
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
        <Text style={styles.headerTitle}>Admin-Verwaltung</Text>
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
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Lade Admins...</Text>
        ) : admins.length === 0 ? (
          <Text style={styles.emptyText}>Keine Admins gefunden</Text>
        ) : (
          admins.map((admin, index) => (
            <View key={index} style={styles.adminCard}>
              <View style={styles.adminInfo}>
                <Text style={styles.adminName}>{admin.name}</Text>
                <Text style={styles.adminEmail}>{admin.email}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{admin.adminLevel}</Text>
                </View>
              </View>
              <View style={styles.adminActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handlePromote(admin)}
                >
                  <IconSymbol
                    ios_icon_name="pencil"
                    android_material_icon_name="edit"
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDemote(admin)}
                >
                  <IconSymbol
                    ios_icon_name="trash"
                    android_material_icon_name="delete"
                    size={20}
                    color="#FF3B30"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Level Selection Modal */}
      <Modal
        visible={showLevelModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLevelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Admin-Level wählen</Text>
              <TouchableOpacity onPress={() => setShowLevelModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.levelOptions}>
              {(['ADMIN_1', 'ADMIN_2', 'ADMIN_3', 'ADMIN_4'] as AdminLevel[]).map(level => (
                <TouchableOpacity
                  key={level}
                  style={styles.levelOption}
                  onPress={() => handleSetLevel(level)}
                >
                  <Text style={styles.levelOptionTitle}>{level}</Text>
                  <Text style={styles.levelOptionDescription}>
                    {level === 'ADMIN_1'
                      ? 'Community-Interaktion'
                      : level === 'ADMIN_2'
                      ? 'Vollsperren'
                      : level === 'ADMIN_3'
                      ? 'Vollsperren + Admin-Verwaltung'
                      : 'Voller Zugriff (Owner)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  adminCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
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
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  levelOptions: {
    padding: 20,
    gap: 12,
  },
  levelOption: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  levelOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  levelOptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
