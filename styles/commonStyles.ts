
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// KickR Brand Colors - Matching the logo
export const colors = {
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
  
  // Dark mode colors
  darkBackground: '#0F172A',
  darkCard: '#1E293B',
  darkText: '#F1F5F9',
  darkTextSecondary: '#94A3B8',
  darkBorder: '#334155',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 217, 95, 0.25)',
    elevation: 3,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(255, 107, 53, 0.25)',
    elevation: 3,
  },
  accent: {
    backgroundColor: colors.accent,
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
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineSecondaryText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  disabled: {
    backgroundColor: colors.mediumGray,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledText: {
    color: colors.darkGray,
    fontSize: 16,
    fontWeight: '700',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  textSmall: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  cardWhite: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  cardElevated: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
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
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: colors.primary,
    boxShadow: '0px 0px 0px 3px rgba(0, 217, 95, 0.1)',
  },
  textArea: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  badge: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeSecondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  badgeAccent: {
    backgroundColor: colors.accent,
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
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgeOutlineText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  dividerThick: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  shadow: {
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  shadowMedium: {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  shadowLarge: {
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
    elevation: 5,
  },
  // Gradient backgrounds (for use with LinearGradient)
  gradientPrimary: {
    colors: [colors.primary, colors.primaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  gradientSecondary: {
    colors: [colors.secondary, colors.secondaryDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  gradientAccent: {
    colors: [colors.accent, colors.accentDark],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
});
