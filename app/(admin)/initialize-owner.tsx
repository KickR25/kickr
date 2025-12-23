
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function InitializeOwnerScreen() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const promoteToOwner = async () => {
    if (!user) {
      Alert.alert('Fehler', 'Du musst angemeldet sein');
      return;
    }

    setLoading(true);
    try {
      // Update the profile to Admin 4
      const { error } = await supabase
        .from('profiles')
        .update({
          role: 'ADMIN',
          admin_level: 'ADMIN_4',
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error promoting to owner:', error);
        Alert.alert('Fehler', error.message || 'Fehler beim Hochstufen');
      } else {
        Alert.alert(
          'Erfolg!',
          'Du wurdest erfolgreich zum Admin 4 (Owner) hochgestuft. Bitte melde dich erneut an, damit die Änderungen wirksam werden.',
          [
            {
              text: 'Abmelden',
              onPress: async () => {
                await logout();
                router.replace('/(auth)/login');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Error promoting to owner:', error);
      Alert.alert('Fehler', error.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const checkIfOwnerEmail = () => {
    return user?.email === 'tomsc.rp@gmail.com';
  };

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
        <Text style={styles.headerTitle}>Owner Initialisierung</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="crown.fill"
            android_material_icon_name="workspace_premium"
            size={64}
            color={colors.primary}
          />
          <Text style={styles.title}>KickR Owner Setup</Text>
          <Text style={styles.description}>
            Diese Seite ermöglicht es dem KickR-Besitzer, sich selbst als Admin 4 (Owner) zu
            registrieren.
          </Text>

          {user ? (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoLabel}>Angemeldet als:</Text>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>

              {checkIfOwnerEmail() ? (
                <>
                  <View style={styles.statusBadge}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={20}
                      color="#34C759"
                    />
                    <Text style={styles.statusText}>Berechtigte Owner-E-Mail</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.promoteButton, loading && styles.promoteButtonDisabled]}
                    onPress={promoteToOwner}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <IconSymbol
                          ios_icon_name="arrow.up.circle.fill"
                          android_material_icon_name="upgrade"
                          size={24}
                          color="#fff"
                        />
                        <Text style={styles.promoteButtonText}>Zu Admin 4 hochstufen</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <View style={[styles.statusBadge, styles.errorBadge]}>
                  <IconSymbol
                    ios_icon_name="xmark.circle.fill"
                    android_material_icon_name="cancel"
                    size={20}
                    color="#FF3B30"
                  />
                  <Text style={[styles.statusText, styles.errorText]}>
                    Nicht berechtigt - Nur tomsc.rp@gmail.com
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.notLoggedIn}>
              <Text style={styles.notLoggedInText}>
                Du musst angemeldet sein, um fortzufahren
              </Text>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.loginButtonText}>Zur Anmeldung</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Was ist Admin 4?</Text>
          <Text style={styles.infoText}>
            - Voller Zugriff auf alle Admin-Funktionen{'\n'}
            - Kann andere Admins verwalten{'\n'}
            - Kann Vollsperren verhängen{'\n'}
            - Zugriff auf Admin-Chat{'\n'}
            - Audit-Log-Zugriff{'\n'}
            - Höchste Berechtigungsstufe (Owner)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
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
  content: {
    flex: 1,
    padding: 20,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  userInfo: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#34C75920',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBadge: {
    backgroundColor: '#FF3B3020',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  promoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  promoteButtonDisabled: {
    opacity: 0.6,
  },
  promoteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  notLoggedIn: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  notLoggedInText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
