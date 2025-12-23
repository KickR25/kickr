
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { User, SanctionType } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function UserLookupScreen() {
  const { isAdmin, canCreateBans, searchUsers, createSanction, getActiveSanctions } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  
  // Sanction form state
  const [sanctionType, setSanctionType] = useState<SanctionType>('MESSAGE_BAN');
  const [reason, setReason] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  const [endsAt, setEndsAt] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    const results = await searchUsers(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setShowSanctionModal(true);
  };

  const handleCreateSanction = async () => {
    if (!selectedUser || !reason.trim()) {
      Alert.alert('Fehler', 'Bitte fülle alle Felder aus');
      return;
    }

    const result = await createSanction(
      selectedUser.id,
      sanctionType,
      reason,
      isPermanent,
      isPermanent ? undefined : endsAt
    );

    if (result.success) {
      Alert.alert('Erfolg', 'Sanktion wurde erstellt');
      setShowSanctionModal(false);
      setSelectedUser(null);
      setReason('');
      setIsPermanent(false);
      setSanctionType('MESSAGE_BAN');
    } else {
      Alert.alert('Fehler', result.error || 'Fehler beim Erstellen der Sanktion');
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
        <Text style={styles.headerTitle}>Benutzer suchen</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Name oder E-Mail suchen..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Suchen</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {searching ? (
          <Text style={styles.loadingText}>Suche...</Text>
        ) : searchResults.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? 'Keine Benutzer gefunden' : 'Gib einen Suchbegriff ein'}
          </Text>
        ) : (
          searchResults.map((user, index) => (
            <TouchableOpacity
              key={index}
              style={styles.userCard}
              onPress={() => handleSelectUser(user)}
            >
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>Rolle: {user.role}</Text>
                {user.adminLevel && (
                  <Text style={styles.adminBadge}>Admin: {user.adminLevel}</Text>
                )}
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Sanction Modal */}
      <Modal
        visible={showSanctionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSanctionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sanktion erstellen</Text>
              <TouchableOpacity onPress={() => setShowSanctionModal(false)}>
                <IconSymbol
                  ios_icon_name="xmark"
                  android_material_icon_name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {selectedUser && (
                <View style={styles.selectedUserInfo}>
                  <Text style={styles.selectedUserName}>{selectedUser.name}</Text>
                  <Text style={styles.selectedUserEmail}>{selectedUser.email}</Text>
                </View>
              )}

              <Text style={styles.label}>Sanktionstyp</Text>
              <View style={styles.typeButtons}>
                {(['MESSAGE_BAN', 'COMMENT_BAN', 'FULL_BAN'] as SanctionType[]).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      sanctionType === type && styles.typeButtonActive,
                    ]}
                    onPress={() => setSanctionType(type)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        sanctionType === type && styles.typeButtonTextActive,
                      ]}
                    >
                      {type === 'MESSAGE_BAN'
                        ? 'Nachrichtensperre'
                        : type === 'COMMENT_BAN'
                        ? 'Kommentarsperre'
                        : 'Vollsperre'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Grund</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Grund für die Sanktion..."
                placeholderTextColor={colors.textSecondary}
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
              />

              <View style={styles.permanentContainer}>
                <Text style={styles.label}>Permanent</Text>
                <Switch
                  value={isPermanent}
                  onValueChange={setIsPermanent}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {!isPermanent && (
                <View>
                  <Text style={styles.label}>Endet am</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateButtonText}>
                      {endsAt.toLocaleString('de-DE')}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={endsAt}
                      mode="datetime"
                      display="default"
                      onChange={(event, date) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (date) setEndsAt(date);
                      }}
                      minimumDate={new Date()}
                    />
                  )}
                </View>
              )}

              <TouchableOpacity
                style={[styles.createButton, !canCreateBans && styles.createButtonDisabled]}
                onPress={handleCreateSanction}
                disabled={!canCreateBans}
              >
                <Text style={styles.createButtonText}>Sanktion erstellen</Text>
              </TouchableOpacity>
            </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: colors.card,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  adminBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
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
  modalScroll: {
    padding: 20,
  },
  selectedUserInfo: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedUserName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedUserEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  typeButtons: {
    gap: 8,
  },
  typeButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  typeButtonText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  permanentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  dateButton: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 15,
    color: colors.text,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
