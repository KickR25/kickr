
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';

export default function CreateProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

  const pickImage = async (type: 'avatar' | 'cover') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'avatar') {
        setAvatar(result.assets[0].uri);
      } else {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  const handleComplete = async () => {
    await updateProfile({
      bio,
      location,
      avatar,
      coverImage,
    });
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profil erstellen</Text>
          <Text style={styles.subtitle}>Vervollständige dein Profil</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.imageSection}>
            <Text style={styles.label}>Titelbild</Text>
            <TouchableOpacity
              style={styles.coverImageContainer}
              onPress={() => pickImage('cover')}
            >
              {coverImage ? (
                <Image source={{ uri: coverImage }} style={styles.coverImage} />
              ) : (
                <View style={styles.coverImagePlaceholder}>
                  <IconSymbol
                    ios_icon_name="photo"
                    android_material_icon_name="add_photo_alternate"
                    size={40}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.placeholderText}>Titelbild hinzufügen</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={[styles.label, { marginTop: 20 }]}>Profilbild</Text>
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={() => pickImage('avatar')}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <IconSymbol
                    ios_icon_name="person.circle"
                    android_material_icon_name="account_circle"
                    size={60}
                    color={colors.textSecondary}
                  />
                </View>
              )}
              <View style={styles.cameraIcon}>
                <IconSymbol
                  ios_icon_name="camera.fill"
                  android_material_icon_name="camera_alt"
                  size={20}
                  color={colors.white}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Erzähle etwas über dich..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Standort</Text>
            <TextInput
              style={styles.input}
              placeholder="Stadt, Land"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>Profil erstellen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Überspringen</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    paddingHorizontal: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  coverImageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.background,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  completeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  completeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
