
# KickR Owner Setup Guide

## Automatische Promotion zu Admin 4

Dein Account (tomsc.rp@gmail.com) wird **automatisch** zu Admin 4 hochgestuft, sobald du dich registrierst!

### Schritt-für-Schritt Anleitung:

### Option 1: Automatische Promotion (Empfohlen)

1. **Registriere dich in der App**
   - Öffne die KickR App
   - Gehe zu "Registrieren"
   - Verwende die E-Mail: `tomsc.rp@gmail.com`
   - Wähle deinen Namen: `Tobias Schumacher`
   - Erstelle ein sicheres Passwort
   - Wähle eine Rolle (z.B. "Trainer" oder "Verein")

2. **Bestätige deine E-Mail**
   - Prüfe dein E-Mail-Postfach
   - Klicke auf den Bestätigungslink von Supabase
   - Warte auf die Bestätigung

3. **Melde dich an**
   - Gehe zurück zur App
   - Melde dich mit deinen Zugangsdaten an
   - **Du bist jetzt automatisch Admin 4!**

### Option 2: Manuelle Promotion (Falls automatisch nicht funktioniert)

1. **Registriere und melde dich an** (wie oben)

2. **Gehe zum Owner Setup**
   - Navigiere zu: Einstellungen → Admin-Bereich
   - Oder direkt: `/(admin)/initialize-owner`
   - Klicke auf "Owner Setup" oder "Owner werden"

3. **Promotion durchführen**
   - Die App prüft automatisch deine E-Mail
   - Wenn du `tomsc.rp@gmail.com` bist, siehst du einen grünen Haken
   - Klicke auf "Zu Admin 4 hochstufen"
   - Melde dich erneut an

4. **Fertig!**
   - Du hast jetzt vollen Admin-Zugriff
   - Admin Level: ADMIN_4 (Owner)

## Was kannst du als Admin 4?

### Vollständige Berechtigungen:

- ✅ **Admin-Verwaltung**: Andere Admins ernennen und verwalten
- ✅ **Sanktionen**: Vollsperren, Kommentar-Sperren, Nachrichten-Sperren verhängen
- ✅ **Admin-Chat**: Zugriff auf den internen Admin-Chat
- ✅ **Benutzer-Lookup**: Alle Benutzer durchsuchen und verwalten
- ✅ **Meldungen**: Gemeldete Inhalte moderieren
- ✅ **Audit-Log**: Alle Admin-Aktionen einsehen
- ✅ **Höchste Berechtigungsstufe**: Voller Zugriff auf alle Funktionen

## Admin-Level Übersicht

| Level | Berechtigungen |
|-------|----------------|
| **ADMIN_4** | Owner - Voller Zugriff (DU) |
| **ADMIN_3** | Vollsperren + Admin-Verwaltung |
| **ADMIN_2** | Vollsperren |
| **ADMIN_1** | Community-Interaktion |

## Technische Details

### Datenbank-Trigger

Ein automatischer Trigger wurde erstellt, der dein Konto beim Registrieren erkennt:

```sql
-- Automatische Promotion für tomsc.rp@gmail.com
CREATE TRIGGER trigger_auto_promote_owner
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_promote_owner();
```

### Manuelle SQL-Promotion (Falls nötig)

Falls du direkten Zugriff auf die Supabase-Datenbank hast:

```sql
-- Manuell zu Admin 4 hochstufen
UPDATE profiles 
SET 
  role = 'ADMIN',
  admin_level = 'ADMIN_4'
WHERE email = 'tomsc.rp@gmail.com';
```

## Zugriff auf Admin-Bereich

### In der App:

1. **Hauptmenü** → "Einstellungen"
2. Scrolle nach unten
3. Klicke auf "Admin-Bereich" (nur sichtbar für Admins)

### Oder direkt:

- URL: `/(admin)/index`
- Owner Setup: `/(admin)/initialize-owner`

## Fehlerbehebung

### Problem: "Kein Zugriff" beim Admin-Bereich

**Lösung:**
1. Stelle sicher, dass du mit `tomsc.rp@gmail.com` angemeldet bist
2. Gehe zu `/(admin)/initialize-owner`
3. Klicke auf "Zu Admin 4 hochstufen"
4. Melde dich erneut an

### Problem: E-Mail nicht bestätigt

**Lösung:**
1. Prüfe dein Spam-Ordner
2. Fordere eine neue Bestätigungs-E-Mail an
3. Warte 5-10 Minuten

### Problem: Trigger funktioniert nicht

**Lösung:**
1. Verwende die manuelle Promotion über `/(admin)/initialize-owner`
2. Oder führe das SQL-Statement direkt in Supabase aus

## Nächste Schritte

Nach der Promotion zu Admin 4:

1. **Erkunde den Admin-Bereich**
   - Admin-Chat testen
   - Benutzer durchsuchen
   - Audit-Log prüfen

2. **Weitere Admins ernennen**
   - Gehe zu "Admin-Verwaltung"
   - Suche nach Benutzern
   - Weise Admin-Level zu (1-4)

3. **Sanktionen einrichten**
   - Definiere Richtlinien
   - Teste Sperr-Funktionen
   - Prüfe Ban-Screen

## Support

Bei Problemen:
- Prüfe die Konsole auf Fehler
- Überprüfe die Supabase-Logs
- Stelle sicher, dass alle Migrationen angewendet wurden

---

**Viel Erfolg mit KickR! ⚽**
