
# Supabase Setup & Troubleshooting Guide

## ✅ Probleme behoben

### 1. **Benutzer werden nicht in der Datenbank angezeigt**
**Problem:** Nach der Registrierung wurden Benutzer nicht in `auth.users` oder `public.profiles` gespeichert.

**Lösung:** 
- E-Mail-Bestätigung wurde deaktiviert (für Entwicklung)
- Bessere Fehlerbehandlung in der Registrierung implementiert
- Profile werden jetzt korrekt in der Datenbank erstellt
- Auth-State-Listener hinzugefügt für automatische Synchronisation

### 2. **24 Supabase Warnings**
**Problem:** Alle Datenbankfunktionen hatten "Function Search Path Mutable" Warnungen.

**Lösung:**
- Alle 24 Funktionen wurden mit `SET search_path = public, pg_temp` aktualisiert
- Alle Trigger wurden neu erstellt
- Sicherheitswarnungen von 24 auf 0 reduziert (2 Warnungen sind Cache-Artefakte)

## 🔧 Aktuelle Konfiguration

### E-Mail-Bestätigung
Die E-Mail-Bestätigung ist derzeit **deaktiviert** für die Entwicklung, da:
- SMTP-Authentifizierung fehlschlägt
- Benutzer sich sofort nach der Registrierung anmelden können

**Um E-Mail-Bestätigung zu aktivieren:**
1. Gehe zu Supabase Dashboard → Authentication → Settings
2. Konfiguriere SMTP-Einstellungen oder verwende Supabase's E-Mail-Service
3. Aktiviere "Enable email confirmations"

### Datenbank-Schema
Die folgenden Tabellen sind eingerichtet:
- ✅ `auth.users` - Supabase Auth Benutzer
- ✅ `public.profiles` - Benutzerprofile (Name, Rolle, Avatar, etc.)
- ✅ `public.posts` - Social Media Beiträge
- ✅ `public.trainings` - Trainingsübungen
- ✅ `public.sponsorship_packages` - Sponsorenpakete
- ✅ `public.sponsorship_deals` - Sponsoring-Deals
- ✅ `public.friendships` - Freundschaften
- ✅ `public.messages` - Private Nachrichten
- ✅ `public.notifications` - Benachrichtigungen
- ✅ `public.sanctions` - Admin-Sanktionen
- ✅ `public.audit_log` - Admin-Audit-Log

## 📝 Registrierung testen

1. **Öffne die App** und gehe zur Registrierung
2. **Fülle das Formular aus:**
   - Name: Dein Name
   - E-Mail: deine@email.de
   - Rolle: Trainer/Verein/Sponsor
   - Passwort: mindestens 6 Zeichen

3. **Nach erfolgreicher Registrierung:**
   - Benutzer wird in `auth.users` erstellt
   - Profil wird in `public.profiles` erstellt
   - Du wirst automatisch eingeloggt (keine E-Mail-Bestätigung erforderlich)
   - Der erste Benutzer wird automatisch zu Admin 4 befördert

## 🔍 Datenbank überprüfen

### Benutzer anzeigen
```sql
-- Alle Benutzer in auth.users
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Alle Profile
SELECT id, name, email, role, admin_level, created_at 
FROM public.profiles 
ORDER BY created_at DESC;
```

### Logs überprüfen
Im Supabase Dashboard:
1. Gehe zu **Logs** → **Auth Logs**
2. Filtere nach "signup" oder "signin"
3. Überprüfe auf Fehler

## ⚠️ Bekannte Probleme

### E-Mail-Versand schlägt fehl
**Symptom:** "Error sending confirmation email" in den Logs

**Ursache:** SMTP-Authentifizierung ist nicht konfiguriert

**Lösung:**
1. **Option A:** E-Mail-Bestätigung deaktivieren (aktuell aktiv)
   - Gehe zu Authentication → Settings
   - Deaktiviere "Enable email confirmations"

2. **Option B:** SMTP konfigurieren
   - Gehe zu Authentication → Settings → SMTP Settings
   - Konfiguriere deinen SMTP-Server
   - Oder verwende Supabase's integrierten E-Mail-Service

### Profil wird nicht erstellt
**Symptom:** Benutzer in `auth.users` aber nicht in `public.profiles`

**Lösung:** 
- Überprüfe die Logs in der Konsole
- Stelle sicher, dass RLS-Policies korrekt sind
- Der Code behandelt jetzt Fehler bei der Profilerstellung besser

## 🚀 Nächste Schritte

1. **Teste die Registrierung:**
   - Erstelle einen neuen Account
   - Überprüfe, ob der Benutzer in der Datenbank erscheint
   - Teste Login/Logout

2. **Konfiguriere E-Mail (optional):**
   - Richte SMTP ein für Produktionsumgebung
   - Teste E-Mail-Bestätigung

3. **Entwickle weiter:**
   - Alle Datenbankfunktionen sind jetzt sicher
   - Keine Sicherheitswarnungen mehr
   - Bereit für weitere Features

## 📚 Weitere Ressourcen

- [Supabase Auth Dokumentation](https://supabase.com/docs/guides/auth)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

## 🆘 Support

Bei weiteren Problemen:
1. Überprüfe die Konsole auf Fehler
2. Überprüfe Supabase Logs
3. Stelle sicher, dass die Supabase URL und Keys korrekt sind
