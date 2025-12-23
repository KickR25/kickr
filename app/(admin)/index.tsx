
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
        <IconSymbol
          ios_icon_name="lock.shield.fill"
          android_material_icon_name="admin_panel_settings"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.errorText}>Kein Zugriff</Text>
        <Text style={styles.errorSubtext}>Du hast keine Admin-Berechtigung</Text>
        
        <TouchableOpacity 
          style={styles.initButton} 
          onPress={() => router.push('/(admin)/initialize-owner')}
        >
          <IconSymbol
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace_premium"
            size={20}
            color="#fff"
          />
          <Text style={styles.initButtonText}>Owner werden</Text>
        </TouchableOpacity>

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
    {
      title: 'Owner Setup',
      description: 'Admin 4 initialisieren',
      icon: 'crown.fill',
      androidIcon: 'workspace_premium',
      route: '/(admin)/initialize-owner',
      available: true,
      highlight: true,
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
          <Text style={styles.headerSubtitle}>Level: {adminLevel || 'Kein Admin'}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {menuItems.filter(item => item.available).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuCard, item.highlight && styles.highlightCard]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconContainer, item.highlight && styles.highlightIconContainer]}>
                <IconSymbol
                  ios_icon_name={item.icon}
                  android_material_icon_name={item.androidIcon}
                  size={32}
                  color={item.highlight ? '#FFD700' : colors.primary}
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
    padding: 20,
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
  highlightCard: {
    borderWidth: 2,
    borderColor: '#FFD700',
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
  highlightIconContainer: {
    backgroundColor: '#FFD70020',
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
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  initButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  initButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
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
