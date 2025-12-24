
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import { useAdmin } from '@/hooks/useAdmin';

export default function ProfileScreen() {
  const { user, logout, posts, trainings } = useAuth();
  const { isAdmin, adminLevel } = useAdmin();
  const { isDark, themeMode, setThemeMode } = useTheme();
  const colors = getColors(isDark);

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>Bitte melden Sie sich an</Text>
      </View>
    );
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'trainer':
        return 'Trainer';
      case 'club':
        return 'Verein';
      case 'sponsor':
        return 'Sponsor';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  const userPosts = posts.filter(p => p.userId === user.id);
  const userTrainings = trainings.filter(t => t.userId === user.id);

  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Abmelden',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleThemeChange = () => {
    Alert.alert(
      'Design wählen',
      'Wähle dein bevorzugtes App-Design',
      [
        {
          text: 'Hell',
          onPress: () => setThemeMode('light'),
        },
        {
          text: 'Dunkel',
          onPress: () => setThemeMode('dark'),
        },
        {
          text: 'System',
          onPress: () => setThemeMode('system'),
        },
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
      ]
    );
  };

  const getThemeModeLabel = () => {
    switch (themeMode) {
      case 'light':
        return 'Hell';
      case 'dark':
        return 'Dunkel';
      case 'system':
        return 'System';
      default:
        return 'System';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Image
          source={require('@/assets/images/a782a098-0dea-4c85-9045-a026ad2ee036.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {user.coverImage && (
          <Image
            source={{ uri: user.coverImage }}
            style={styles.coverImage}
          />
        )}

        <View style={[styles.profileCard, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
          {user.avatar ? (
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <IconSymbol
                ios_icon_name="person.circle.fill"
                android_material_icon_name="account_circle"
                size={100}
                color={colors.textSecondary}
              />
            </View>
          )}
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.roleText, { color: colors.white }]}>{getRoleLabel(user.role)}</Text>
          </View>
          {user.bio && (
            <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text>
          )}
          {user.location && (
            <View style={styles.locationRow}>
              <IconSymbol
                ios_icon_name="location"
                android_material_icon_name="location_on"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.location, { color: colors.textSecondary }]}>{user.location}</Text>
            </View>
          )}

          <View style={[styles.stats, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{user.friends.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Freunde</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{userPosts.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Beiträge</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{userTrainings.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trainings</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(auth)/edit-profile')}
          >
            <IconSymbol
              ios_icon_name="pencil"
              android_material_icon_name="edit"
              size={20}
              color={colors.white}
            />
            <Text style={[styles.editButtonText, { color: colors.white }]}>Profil bearbeiten</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Einstellungen</Text>
          
          {isAdmin && (
            <TouchableOpacity
              style={[styles.menuItem, styles.adminItem, { backgroundColor: `${colors.primary}10`, borderColor: colors.primary }]}
              onPress={() => router.push('/(admin)')}
            >
              <IconSymbol
                ios_icon_name="shield.fill"
                android_material_icon_name="shield"
                size={24}
                color={colors.primary}
              />
              <View style={styles.adminTextContainer}>
                <Text style={[styles.menuItemText, styles.adminText, { color: colors.primary }]}>Admin-Bereich</Text>
                {adminLevel && (
                  <Text style={[styles.adminLevelText, { color: colors.primary }]}>{adminLevel}</Text>
                )}
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.menuItem, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}
            onPress={handleThemeChange}
          >
            <IconSymbol
              ios_icon_name={isDark ? "moon.fill" : "sun.max.fill"}
              android_material_icon_name={isDark ? "dark_mode" : "light_mode"}
              size={24}
              color={colors.text}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Design</Text>
            <Text style={[styles.themeValue, { color: colors.textSecondary }]}>{getThemeModeLabel()}</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
            <IconSymbol
              ios_icon_name="bell"
              android_material_icon_name="notifications"
              size={24}
              color={colors.text}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Benachrichtigungen</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
            <IconSymbol
              ios_icon_name="lock"
              android_material_icon_name="lock"
              size={24}
              color={colors.text}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Datenschutz</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}>
            <IconSymbol
              ios_icon_name="questionmark.circle"
              android_material_icon_name="help"
              size={24}
              color={colors.text}
            />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Hilfe & Support</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem, { backgroundColor: colors.cardWhite, borderColor: colors.border }]}
            onPress={handleLogout}
          >
            <IconSymbol
              ios_icon_name="arrow.right.square"
              android_material_icon_name="logout"
              size={24}
              color={colors.error}
            />
            <Text style={[styles.menuItemText, styles.logoutText, { color: colors.error }]}>Abmelden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  profileCard: {
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  roleBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bio: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  menuItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
  },
  themeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  adminItem: {
    borderWidth: 2,
  },
  adminTextContainer: {
    flex: 1,
  },
  adminText: {
    fontWeight: '600',
  },
  adminLevelText: {
    fontSize: 12,
    marginTop: 2,
  },
});
