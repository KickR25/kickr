
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAdmin } from '@/hooks/useAdmin';
import { commonStyles, colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AdminDashboard() {
  const { isAdmin, adminLevel, loading, canManageAdmins, canCreateBans } = useAdmin();

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Lade...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Kein Zugriff</Text>
        <Text style={styles.errorSubtext}>Du hast keine Admin-Berechtigung</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Zurück</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const menuItems = [
    {
      title: 'Admin Chat',
      description: 'Interner Admin-Chat',
      icon: 'message.fill',
      androidIcon: 'chat',
      route: '/(admin)/chat',
      available: true,
    },
    {
      title: 'Sanktionen',
      description: 'Sperren verwalten',
      icon: 'exclamationmark.shield.fill',
      androidIcon: 'shield',
      route: '/(admin)/sanctions',
      available: canCreateBans,
    },
    {
      title: 'Benutzer suchen',
      description: 'Nutzer nachschlagen',
      icon: 'person.crop.circle.badge.magnifyingglass',
      androidIcon: 'person_search',
      route: '/(admin)/user-lookup',
      available: true,
    },
    {
      title: 'Meldungen',
      description: 'Gemeldete Inhalte',
      icon: 'flag.fill',
      androidIcon: 'flag',
      route: '/(admin)/reports',
      available: true,
    },
    {
      title: 'Admin-Verwaltung',
      description: 'Admins verwalten',
      icon: 'person.3.fill',
      androidIcon: 'group',
      route: '/(admin)/admin-management',
      available: canManageAdmins,
    },
    {
      title: 'Audit Log',
      description: 'Aktivitätsprotokoll',
      icon: 'doc.text.fill',
      androidIcon: 'description',
      route: '/(admin)/audit-log',
      available: true,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIconButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Admin-Bereich</Text>
          <Text style={styles.headerSubtitle}>Level: {adminLevel}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {menuItems.filter(item => item.available).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuCard}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.iconContainer}>
                <IconSymbol
                  ios_icon_name={item.icon}
                  android_material_icon_name={item.androidIcon}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  backIconButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    width: '48%',
    minHeight: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  errorText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
