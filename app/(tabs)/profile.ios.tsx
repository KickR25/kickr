
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { currentUser, mockUsers } from '@/data/mockData';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
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

  const friends = mockUsers.filter(user => currentUser.friends.includes(user.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/d332ec97-81cd-453c-a68f-f9db9a18798f.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image
            source={{ uri: currentUser.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{currentUser.name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleLabel(currentUser.role)}</Text>
          </View>
          {currentUser.bio && (
            <Text style={styles.bio}>{currentUser.bio}</Text>
          )}
          {currentUser.location && (
            <View style={styles.locationRow}>
              <IconSymbol
                ios_icon_name="location"
                android_material_icon_name="location_on"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.location}>{currentUser.location}</Text>
            </View>
          )}

          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser.friends.length}</Text>
              <Text style={styles.statLabel}>Freunde</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Beiträge</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Trainings</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <IconSymbol
              ios_icon_name="pencil"
              android_material_icon_name="edit"
              size={20}
              color={colors.white}
            />
            <Text style={styles.editButtonText}>Profil bearbeiten</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Freunde ({friends.length})</Text>
          {friends.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <Image
                source={{ uri: friend.avatar }}
                style={styles.friendAvatar}
              />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendRole}>{getRoleLabel(friend.role)}</Text>
              </View>
              <TouchableOpacity>
                <IconSymbol
                  ios_icon_name="chevron.right"
                  android_material_icon_name="chevron_right"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="bell"
              android_material_icon_name="notifications"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Benachrichtigungen</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="lock"
              android_material_icon_name="lock"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Datenschutz</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <IconSymbol
              ios_icon_name="questionmark.circle"
              android_material_icon_name="help"
              size={24}
              color={colors.text}
            />
            <Text style={styles.menuItemText}>Hilfe & Support</Text>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
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
    padding: 16,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
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
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  roleText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  bio: {
    fontSize: 15,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
  },
  stats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  editButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  friendCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  friendRole: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuItem: {
    backgroundColor: colors.white,
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
    color: colors.text,
  },
});
