
# KickR Supabase Integration Guide

## 🎯 Übersicht

Deine KickR-App ist jetzt vollständig mit Supabase integriert! Die Datenbank ist eingerichtet und bereit für die Verwendung.

## 📊 Datenbankstruktur

### Haupttabellen

#### 1. **profiles** - Benutzerprofile
- Erweitert Supabase Auth mit zusätzlichen Profilinformationen
- Felder: name, email, role, avatar, cover_image, bio, location, admin_level
- Rollen: trainer, verein, sponsor

#### 2. **posts** - Social Feed Beiträge
- Beiträge mit Text und Bildern
- Verknüpft mit Likes, Kommentaren und Shares

#### 3. **trainings** - Training Hub
- Trainingsübungen mit detaillierten Informationen
- Felder: title, goal, team_category, gender, duration, player_count, materials, description
- Unterstützt Bilder und Videos

#### 4. **sponsorship_packages** - Sponsorenpakete
- Pakete von Vereinen/Trainern für Sponsoren
- Felder: package_name, price, duration, region, benefits

#### 5. **sponsorship_deals** - Sponsoring-Deals
- Verwaltet den Deal-Prozess zwischen Sponsoren und Vereinen
- Status: requested, negotiating, accepted, active, completed
- Automatische Provisionsberechnung

#### 6. **friendships** - Freundschaften
- Freundschaftsanfragen und -beziehungen
- Status: pending, accepted, rejected

#### 7. **messages** - Private Nachrichten
- Direktnachrichten zwischen Benutzern

#### 8. **notifications** - Benachrichtigungen
- Automatische Benachrichtigungen für alle Aktivitäten

### Admin-Tabellen

#### 9. **sanctions** - Sanktionen
- Bans und Einschränkungen
- Typen: MESSAGE_BAN, COMMENT_BAN, FULL_BAN

#### 10. **admin_chat_messages** - Admin-Chat
- Interner Chat für Admins

#### 11. **audit_log** - Audit-Log
- Protokolliert alle Admin-Aktionen

## 🔧 Verwendung in der App

### Supabase Client importieren

```typescript
import { supabase } from '@/app/integrations/supabase/client';
```

### Beispiele für häufige Operationen

#### Posts abrufen

```typescript
// Mit Helper-Funktion (empfohlen)
const { data: posts, error } = await supabase
  .rpc('get_feed_posts', { p_limit: 20, p_offset: 0 });

// Oder direkt
const { data: posts, error } = await supabase
  .from('posts')
  .select(`
    *,
    profiles:user_id (name, avatar),
    post_likes (count),
    post_comments (count)
  `)
  .order('created_at', { ascending: false })
  .limit(20);
```

#### Post erstellen

```typescript
const { data, error } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    content: 'Mein erster Post!',
    images: ['https://example.com/image.jpg']
  })
  .select()
  .single();
```

#### Post liken

```typescript
// Like hinzufügen
const { error } = await supabase
  .from('post_likes')
  .insert({
    post_id: postId,
    user_id: user.id
  });

// Like entfernen
const { error } = await supabase
  .from('post_likes')
  .delete()
  .match({ post_id: postId, user_id: user.id });
```

#### Kommentar hinzufügen

```typescript
const { data, error } = await supabase
  .from('post_comments')
  .insert({
    post_id: postId,
    user_id: user.id,
    content: 'Toller Beitrag!'
  })
  .select()
  .single();
```

#### Trainings abrufen

```typescript
const { data: trainings, error } = await supabase
  .rpc('get_trainings', { p_limit: 20, p_offset: 0 });
```

#### Training erstellen

```typescript
const { data, error } = await supabase
  .from('trainings')
  .insert({
    user_id: user.id,
    title: 'Passspiel-Training',
    goal: 'Technik',
    team_category: 'D-Jugend',
    gender: 'Jungs',
    duration: 90,
    player_count: '16-20',
    materials: 'Bälle, Hütchen, Tore',
    description: 'Schritt-für-Schritt Anleitung...',
    images: ['https://example.com/training.jpg']
  })
  .select()
  .single();
```

#### Freundschaftsanfrage senden

```typescript
const { data, error } = await supabase
  .from('friendships')
  .insert({
    user_id: currentUser.id,
    friend_id: targetUser.id,
    status: 'pending'
  })
  .select()
  .single();
```

#### Freundschaftsanfrage annehmen

```typescript
const { error } = await supabase
  .from('friendships')
  .update({ status: 'accepted' })
  .eq('id', friendshipId);
```

#### Nachricht senden

```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    sender_id: currentUser.id,
    receiver_id: recipientId,
    content: 'Hallo!'
  })
  .select()
  .single();
```

#### Benachrichtigungen abrufen

```typescript
const { data: notifications, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', user.id)
  .eq('is_read', false)
  .order('created_at', { ascending: false });
```

#### Sponsorenpaket erstellen

```typescript
const { data, error } = await supabase
  .from('sponsorship_packages')
  .insert({
    user_id: user.id,
    package_name: 'Gold',
    price: 5000,
    duration: 12,
    region: 'Bayern',
    benefits: 'Logo auf Trikot, Social Media Posts, etc.',
    images: ['https://example.com/package.jpg'],
    is_available: true
  })
  .select()
  .single();
```

#### Sponsoring-Deal anfragen

```typescript
const { data, error } = await supabase
  .from('sponsorship_deals')
  .insert({
    package_id: packageId,
    sponsor_id: currentUser.id,
    club_id: clubId,
    status: 'requested',
    commission_rate: 10.00
  })
  .select()
  .single();
```

## 🔐 Row Level Security (RLS)

Alle Tabellen haben RLS aktiviert. Die Policies stellen sicher, dass:

- Benutzer nur ihre eigenen Daten bearbeiten können
- Öffentliche Inhalte (Posts, Trainings) für alle sichtbar sind
- Private Nachrichten nur für Sender und Empfänger sichtbar sind
- Admin-Funktionen nur für Admins zugänglich sind

## 🔔 Automatische Benachrichtigungen

Die Datenbank erstellt automatisch Benachrichtigungen für:

- Post-Likes
- Post-Kommentare
- Post-Shares
- Training-Likes
- Training-Kommentare
- Freundschaftsanfragen
- Neue Nachrichten
- Sponsoring-Deal-Updates

## 📱 Realtime-Subscriptions

Du kannst Realtime-Updates für Tabellen abonnieren:

```typescript
// Posts abonnieren
const postsSubscription = supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Neuer Post:', payload.new);
      // UI aktualisieren
    }
  )
  .subscribe();

// Benachrichtigungen abonnieren
const notificationsSubscription = supabase
  .channel('notifications')
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${user.id}`
    },
    (payload) => {
      console.log('Neue Benachrichtigung:', payload.new);
      // Benachrichtigung anzeigen
    }
  )
  .subscribe();

// Subscription beenden
postsSubscription.unsubscribe();
```

## 🖼️ Datei-Upload (Storage)

Für Bilder und Videos solltest du Supabase Storage verwenden:

```typescript
// Bild hochladen
const file = /* Datei vom Image Picker */;
const fileExt = file.uri.split('.').pop();
const fileName = `${user.id}-${Date.now()}.${fileExt}`;
const filePath = `avatars/${fileName}`;

const { data, error } = await supabase.storage
  .from('public')
  .upload(filePath, file);

if (data) {
  const { data: { publicUrl } } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);
  
  // publicUrl in Datenbank speichern
}
```

## 🔍 Hilfreiche Funktionen

Die Datenbank enthält mehrere Helper-Funktionen:

- `get_feed_posts(limit, offset)` - Posts mit allen Counts
- `get_trainings(limit, offset)` - Trainings mit allen Counts
- `get_post_comments(post_id)` - Kommentare mit User-Info
- `get_training_comments(training_id)` - Training-Kommentare
- `get_friends(user_id)` - Freundesliste
- `get_friend_requests(user_id)` - Freundschaftsanfragen
- `get_sponsorship_packages(limit, offset)` - Sponsorenpakete
- `get_user_deals(user_id)` - Sponsoring-Deals
- `get_unread_messages_count(user_id)` - Anzahl ungelesener Nachrichten
- `get_unread_notifications_count(user_id)` - Anzahl ungelesener Benachrichtigungen
- `get_active_sanctions(user_id)` - Aktive Sanktionen
- `expire_sanctions()` - Sanktionen ablaufen lassen

## 🚀 Nächste Schritte

1. **AuthContext aktualisieren**: Ersetze AsyncStorage-Logik durch Supabase-Queries
2. **Realtime implementieren**: Füge Realtime-Subscriptions für Live-Updates hinzu
3. **Storage einrichten**: Konfiguriere Supabase Storage für Bild-/Video-Uploads
4. **Offline-Support**: Implementiere Caching mit React Query oder SWR
5. **Performance**: Nutze die Helper-Funktionen für optimierte Queries

## 📚 Weitere Ressourcen

- [Supabase Dokumentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)
- [Storage](https://supabase.com/docs/guides/storage)

## ⚠️ Wichtige Hinweise

1. **Niemals** den Supabase Service Role Key im Client-Code verwenden
2. Alle sensiblen Operationen sollten über RLS-Policies gesichert sein
3. Verwende die Helper-Funktionen für komplexe Queries
4. Teste RLS-Policies gründlich vor dem Produktiv-Einsatz
5. Implementiere Error-Handling für alle Supabase-Calls

## 🎉 Fertig!

Deine KickR-App ist jetzt mit einer vollständigen Supabase-Datenbank ausgestattet!
Alle Tabellen, RLS-Policies, Trigger und Helper-Funktionen sind eingerichtet und einsatzbereit.
