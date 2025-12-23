
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Sanction } from '@/types';
import { supabase } from '@/app/integrations/supabase/client';
import { router } from 'expo-router';
import { commonStyles, colors } from '@/styles/commonStyles';

interface BanScreenProps {
  ban: Sanction;
}

export default function BanScreen({ ban }: BanScreenProps) {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [ban]);

  const updateRemainingTime = () => {
    if (ban.isPermanent) {
      setRemainingTime('730 Tage : 00 : 00 : 00');
      return;
    }

    if (!ban.endsAt) {
      setRemainingTime('00 : 00 : 00 : 00');
      return;
    }

    const now = new Date();
    const end = new Date(ban.endsAt);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setRemainingTime('00 : 00 : 00 : 00');
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setRemainingTime(
      `${days} Tage : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`
    );
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.replace('/(auth)/welcome');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleContact = () => {
    Alert.alert(
      'Kontakt / Einspruch',
      'Bitte kontaktiere uns unter support@kickr.app für einen Einspruch gegen diese Sperre.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Account gesperrt</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Du wurdest von <Text style={styles.bold}>{ban.createdByAdminName || 'einem Admin'}</Text> für{' '}
            <Text style={styles.bold}>{remainingTime}</Text> gesperrt.
          </Text>
          
          <View style={styles.reasonContainer}>
            <Text style={styles.reasonLabel}>Grund:</Text>
            <Text style={styles.reasonText}>{ban.reason}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Abmelden</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
            <Text style={styles.contactButtonText}>Kontakt / Einspruch</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  reasonContainer: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  reasonText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  contactButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
