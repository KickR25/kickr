
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Feed</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="training" name="training">
        <Icon sf="figure.run" />
        <Label>Training</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="sponsors" name="sponsors">
        <Icon sf="handshake.fill" />
        <Label>Sponsoren</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
