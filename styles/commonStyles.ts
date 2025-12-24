
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// KickR Brand Colors - Light Mode
export const lightColors = {
  // Primary brand colors from KickR logo
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  
  // Main brand colors - vibrant football green and energetic accents
  primary: '#00D95F', // Bright football green (main brand color)
  primaryDark: '#00B84F', // Darker shade for pressed states
  primaryLight: '#4AE88A', // Lighter shade for highlights
  
  secondary: '#FF6B35', // Energetic orange accent
  secondaryDark: '#E85A2A',
  secondaryLight: '#FF8A5C',
  
  accent: '#6C5CE7', // Purple accent for special features
  accentDark: '#5B4CD3',
  accentLight: '#8B7EED',
  
  // UI colors
  card: '#F9FAFB',
  cardWhite: '#FFFFFF',
  highlight: '#00D95F',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Status colors
  error: '#EF4444',
  success: '#00D95F',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#1A1A1A',
  lightGray: '#F9FAFB',
  mediumGray: '#9CA3AF',
  darkGray: '#4B5563',
};

// KickR Brand Colors - Dark Mode
export const darkColors = {
  // Primary brand colors adapted for dark mode
  background: '#0F172A', // Deep navy background
  text: '#F1F5F9', // Light text
  textSecondary: '#94A3B8', // Muted text
  
  // Main brand colors - same vibrant colors work well in dark mode
  primary: '#00D95F', // Bright football green
  primaryDark: '#00B84F',
  primaryLight: '#4AE88A',
  
  secondary: '#FF6B35', // Energetic orange
  secondaryDark: '#E85A2A',
  secondaryLight: '#FF8A5C',
  
  accent: '#6C5CE7', // Purple accent
  accentDark: '#5B4CD3',
  accentLight: '#8B7EED',
  
  // UI colors for dark mode
  card: '#1E293B', // Slightly lighter than background
  cardWhite: '#334155', // Elevated card color
  highlight: '#00D95F',
  border: '#334155',
  borderLight: '#475569',
  
  // Status colors
  error: '#EF4444',
  success: '#00D95F',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Neutral colors
  white: '#F1F5F9',
  black: '#0F172A',
  lightGray: '#1E293B',
  mediumGray: '#64748B',
  darkGray: '#94A3B8',
};

// Default export for backward compatibility
export const colors = lightColors;

// Function to get colors based on theme
export const getColors = (isDark: boolean) => isDark ? darkColors : lightColors;

export const getButtonStyles = (isDark: boolean) => {
  const themeColors = getColors(isDark);
  
  return StyleSheet.create({
    primary: {
      backgroundColor: themeColors.primary,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 4px 12px rgba(0, 217, 95, 0.25)',
      elevation: 3,
    },
    secondary: {
      backgroundColor: themeColors.secondary,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 4px 12px rgba(255, 107, 53, 0.25)',
      elevation: 3,
    },
    accent: {
      backgroundColor: themeColors.accent,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0px 4px 12px rgba(108, 92, 231, 0.25)',
      elevation: 3,
    },
    outline: {
      backgroundColor: 'transparent',
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: themeColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    outlineSecondary: {
      backgroundColor: 'transparent',
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: themeColors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: themeColors.white,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    outlineText: {
      color: themeColors.primary,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    outlineSecondaryText: {
      color: themeColors.secondary,
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    disabled: {
      backgroundColor: themeColors.mediumGray,
      paddingVertical: 14,
      paddingHorizontal: 28,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledText: {
      color: themeColors.darkGray,
      fontSize: 16,
      fontWeight: '700',
    },
  });
};

export const buttonStyles = getButtonStyles(false);

export const getCommonStyles = (isDark: boolean) => {
  const themeColors = getColors(isDark);
  
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 22,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 8,
      letterSpacing: -0.3,
    },
    heading: {
      fontSize: 18,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 6,
    },
    text: {
      fontSize: 16,
      color: themeColors.text,
      lineHeight: 24,
    },
    textSecondary: {
      fontSize: 14,
      color: themeColors.textSecondary,
      lineHeight: 20,
    },
    textSmall: {
      fontSize: 12,
      color: themeColors.textSecondary,
      lineHeight: 18,
    },
    card: {
      backgroundColor: themeColors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      boxShadow: isDark ? '0px 2px 8px rgba(0, 0, 0, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
      elevation: 2,
    },
    cardWhite: {
      backgroundColor: themeColors.cardWhite,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      boxShadow: isDark ? '0px 2px 12px rgba(0, 0, 0, 0.4)' : '0px 2px 12px rgba(0, 0, 0, 0.08)',
      elevation: 3,
    },
    cardElevated: {
      backgroundColor: themeColors.cardWhite,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      boxShadow: isDark ? '0px 4px 16px rgba(0, 0, 0, 0.5)' : '0px 4px 16px rgba(0, 0, 0, 0.1)',
      elevation: 4,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      backgroundColor: isDark ? themeColors.card : themeColors.white,
      borderWidth: 2,
      borderColor: themeColors.border,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontSize: 16,
      color: themeColors.text,
      marginBottom: 12,
    },
    inputFocused: {
      borderColor: themeColors.primary,
      boxShadow: `0px 0px 0px 3px rgba(0, 217, 95, ${isDark ? '0.2' : '0.1'})`,
    },
    textArea: {
      backgroundColor: isDark ? themeColors.card : themeColors.white,
      borderWidth: 2,
      borderColor: themeColors.border,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontSize: 16,
      color: themeColors.text,
      marginBottom: 12,
      minHeight: 120,
      textAlignVertical: 'top',
    },
    badge: {
      backgroundColor: themeColors.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    badgeSecondary: {
      backgroundColor: themeColors.secondary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    badgeAccent: {
      backgroundColor: themeColors.accent,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
    },
    badgeOutline: {
      backgroundColor: 'transparent',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: themeColors.primary,
    },
    badgeText: {
      color: themeColors.white,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    badgeOutlineText: {
      color: themeColors.primary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: themeColors.border,
      marginVertical: 16,
    },
    dividerThick: {
      height: 2,
      backgroundColor: themeColors.border,
      marginVertical: 16,
    },
    shadow: {
      boxShadow: isDark ? '0px 2px 8px rgba(0, 0, 0, 0.4)' : '0px 2px 8px rgba(0, 0, 0, 0.08)',
      elevation: 2,
    },
    shadowMedium: {
      boxShadow: isDark ? '0px 4px 12px rgba(0, 0, 0, 0.5)' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
      elevation: 3,
    },
    shadowLarge: {
      boxShadow: isDark ? '0px 8px 24px rgba(0, 0, 0, 0.6)' : '0px 8px 24px rgba(0, 0, 0, 0.12)',
      elevation: 5,
    },
    // Gradient backgrounds (for use with LinearGradient)
    gradientPrimary: {
      colors: [themeColors.primary, themeColors.primaryDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    gradientSecondary: {
      colors: [themeColors.secondary, themeColors.secondaryDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    gradientAccent: {
      colors: [themeColors.accent, themeColors.accentDark],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  });
};

export const commonStyles = getCommonStyles(false);
