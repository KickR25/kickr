
# E-Mail-Bestätigung Einrichtungsanleitung

## Problem

Die Registrierung schlägt fehl mit dem Fehler: **"Error sending confirmation email"**

Dies liegt daran, dass Supabase's Standard-SMTP-Service nicht korrekt konfiguriert ist.

## Lösung 1: E-Mail-Bestätigung deaktivieren (Schnellste Lösung für Entwicklung)

### Schritte:

1. **Öffne dein Supabase Dashboard:**
   - Gehe zu: https://supabase.com/dashboard/project/pudnioxihqsrhgezezsj

2. **Navigiere zu Authentication Settings:**
   - Klicke auf "Authentication" in der linken Seitenleiste
   - Klicke auf "Settings" (oder "Einstellungen")

3. **Deaktiviere E-Mail-Bestätigung:**
   - Suche nach "Enable email confirmations" oder "E-Mail-Bestätigung aktivieren"
   - **Deaktiviere** diese Option (Toggle auf OFF)
   - Klicke auf "Save" (Speichern)

4. **Teste die Registrierung:**
   - Versuche jetzt, einen neuen Account zu erstellen
   - Du solltest sofort eingeloggt werden ohne E-Mail-Bestätigung

### Vorteile:
- ✅ Sofort einsatzbereit
- ✅ Keine zusätzliche Konfiguration nötig
- ✅ Perfekt für Entwicklung und Tests

### Nachteile:
- ⚠️ Keine E-Mail-Verifizierung (jeder kann sich mit jeder E-Mail registrieren)
- ⚠️ Nicht empfohlen für Produktion

---

## Lösung 2: Eigenen SMTP-Server konfigurieren (Empfohlen für Produktion)

### Option A: Gmail SMTP verwenden

1. **Gmail App-Passwort erstellen:**
   - Gehe zu: https://myaccount.google.com/apppasswords
   - Erstelle ein neues App-Passwort für "Mail"
   - Kopiere das generierte Passwort (16 Zeichen)

2. **Supabase SMTP konfigurieren:**
   - Gehe zu: https://supabase.com/dashboard/project/pudnioxihqsrhgezezsj/settings/auth
   - Scrolle zu "SMTP Settings"
   - Fülle folgende Felder aus:
     ```
     SMTP Host: smtp.gmail.com
     SMTP Port: 587
     SMTP User: deine-email@gmail.com
     SMTP Password: [Dein App-Passwort]
     SMTP Sender Name: KickR
     SMTP Sender Email: deine-email@gmail.com
     ```
   - Klicke auf "Save"

3. **Teste die E-Mail-Zustellung:**
   - Erstelle einen neuen Test-Account
   - Überprüfe deinen Posteingang auf die Bestätigungs-E-Mail

### Option B: SendGrid verwenden (Professioneller)

1. **SendGrid Account erstellen:**
   - Gehe zu: https://sendgrid.com/
   - Erstelle einen kostenlosen Account (100 E-Mails/Tag gratis)

2. **API Key erstellen:**
   - Gehe zu Settings → API Keys
   - Erstelle einen neuen API Key mit "Mail Send" Berechtigung
   - Kopiere den API Key

3. **Supabase SMTP konfigurieren:**
   - Gehe zu: https://supabase.com/dashboard/project/pudnioxihqsrhgezezsj/settings/auth
   - Scrolle zu "SMTP Settings"
   - Fülle folgende Felder aus:
     ```
     SMTP Host: smtp.sendgrid.net
     SMTP Port: 587
     SMTP User: apikey
     SMTP Password: [Dein SendGrid API Key]
     SMTP Sender Name: KickR
     SMTP Sender Email: noreply@deine-domain.de
     ```
   - Klicke auf "Save"

### Option C: Andere SMTP-Anbieter

Weitere empfohlene Anbieter:
- **Mailgun** (https://www.mailgun.com/)
- **Amazon SES** (https://aws.amazon.com/ses/)
- **Postmark** (https://postmarkapp.com/)

---

## Lösung 3: E-Mail-Templates anpassen (Optional)

Nach der SMTP-Konfiguration kannst du die E-Mail-Templates anpassen:

1. **Gehe zu Authentication → Email Templates:**
   - https://supabase.com/dashboard/project/pudnioxihqsrhgezezsj/auth/templates

2. **Passe die "Confirm signup" E-Mail an:**
   - Ändere den Betreff und Inhalt nach deinen Wünschen
   - Verwende `{{ .ConfirmationURL }}` für den Bestätigungslink
   - Verwende `{{ .Token }}` für einen OTP-Code

---

## Aktueller Status

### Was funktioniert:
- ✅ Benutzer-Registrierung (Account wird erstellt)
- ✅ Profil-Erstellung in der Datenbank
- ✅ Login-Funktionalität
- ✅ Fehlerbehandlung und hilfreiche Fehlermeldungen

### Was nicht funktioniert:
- ❌ E-Mail-Versand (SMTP nicht konfiguriert)
- ❌ E-Mail-Bestätigung (blockiert Login)

### Empfohlene Vorgehensweise:

**Für sofortigen Test:**
1. Deaktiviere E-Mail-Bestätigung (Lösung 1)
2. Teste die App-Funktionalität

**Für Produktion:**
1. Konfiguriere SMTP mit Gmail oder SendGrid (Lösung 2)
2. Aktiviere E-Mail-Bestätigung wieder
3. Teste den kompletten Registrierungs-Flow

---

## Häufige Probleme

### Problem: "Invalid login credentials"
**Ursache:** E-Mail wurde nicht bestätigt oder falsches Passwort

**Lösung:**
- Überprüfe, ob E-Mail-Bestätigung deaktiviert ist
- Überprüfe Passwort (mindestens 6 Zeichen)
- Überprüfe E-Mail-Adresse auf Tippfehler

### Problem: "User already registered"
**Ursache:** E-Mail-Adresse ist bereits registriert

**Lösung:**
- Verwende eine andere E-Mail-Adresse ODER
- Lösche den bestehenden User im Supabase Dashboard:
  - Gehe zu Authentication → Users
  - Suche die E-Mail-Adresse
  - Klicke auf "Delete User"

### Problem: E-Mails landen im Spam
**Ursache:** SMTP-Reputation oder fehlende SPF/DKIM-Records

**Lösung:**
- Verwende einen professionellen SMTP-Anbieter (SendGrid, Mailgun)
- Konfiguriere SPF und DKIM Records für deine Domain
- Verwende eine verifizierte Sender-Domain

---

## Support

Bei weiteren Fragen oder Problemen:
- **E-Mail:** tomsc.rp@gmail.com
- **Supabase Docs:** https://supabase.com/docs/guides/auth/auth-smtp
- **Supabase Support:** https://supabase.com/dashboard/support

---

## Nächste Schritte

1. ✅ Wähle eine Lösung (1 oder 2)
2. ✅ Folge den Schritten oben
3. ✅ Teste die Registrierung
4. ✅ Überprüfe, ob Accounts in der Datenbank erscheinen
5. ✅ Teste den Login

**Viel Erfolg! ⚽🚀**
