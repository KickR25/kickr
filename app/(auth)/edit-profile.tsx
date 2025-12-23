
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [coverImage, setCoverImage] = useState<string | undefined>(user?.coverImage);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Fehler', 'Name darf nicht leer sein');
      return;
    }

    setIsLoading(true);
    await updateProfile({
      name,
      bio,
      location,
      avatar,
      coverImage,
    });
    setIsLoading(false);
    
    Alert.alert('Erfolg', 'Profil wurde aktualisiert', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil bearbeiten</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Speichern...' : 'Speichern'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageSection}>
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
            <View style={styles.editOverlay}>
              <IconSymbol
                ios_icon_name="camera.fill"
                android_material_icon_name="camera_alt"
                size={24}
                color={colors.white}
              />
            </View>
          </TouchableOpacity>

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

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Dein Name"
              value={name}
              onChangeText={setName}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageSection: {
    marginBottom: 24,
  },
  coverImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.card,
    position: 'relative',
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
  editOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: -60,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.background,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.background,
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
  form: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
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
});
