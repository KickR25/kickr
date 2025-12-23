
import React from 'react';
import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="sanctions" />
      <Stack.Screen name="user-lookup" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="admin-management" />
      <Stack.Screen name="audit-log" />
    </Stack>
  );
}
