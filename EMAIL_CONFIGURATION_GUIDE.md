
# Email Configuration Guide für KickR

## Problem: "Error sending confirmation email"

Nach der Registrierung erscheint die Fehlermeldung "Error sending confirmation email". Dies liegt daran, dass Supabase's Standard-SMTP-Server Authentifizierungsprobleme hat.

## Ursache

Der Fehler in den Logs zeigt:
```
"error":"535 5.7.8 Error: authentication failed"
"msg":"500: Error sending confirmation email"
```

Dies bedeutet, dass der SMTP-Server die Authentifizierung ablehnt und keine Bestätigungs-E-Mails senden kann.

## Lösungen

### Option 1: E-Mail-Bestätigung deaktivieren (Empfohlen für Entwicklung)

1. Gehe zu deinem Supabase Dashboard: https://supabase.com/dashboard/project/pudnioxihqsrhgezezsj
2. Navigiere zu **Authentication** → **Settings**
3. Scrolle zu **Email Auth**
4. Deaktiviere **"Enable email confirmations"**
5. Speichere die Änderungen

**Vorteile:**
- Benutzer können sich sofort nach der Registrierung anmelden
- Keine E-Mail-Konfiguration erforderlich
- Ideal für Entwicklung und Testing

**Nachteile:**
- Keine E-Mail-Verifizierung
- Benutzer können sich mit jeder E-Mail-Adresse registrieren

### Option 2: Eigenen SMTP-Server konfigurieren (Empfohlen für Produktion)

1. Gehe zu deinem Supabase Dashboard
2. Navigiere zu **Project Settings** → **Auth** → **SMTP Settings**
3. Aktiviere **"Enable Custom SMTP"**
4. Konfiguriere deinen SMTP-Server:

#### Empfohlene SMTP-Anbieter:

**SendGrid (Kostenlos bis 100 E-Mails/Tag):**
```
Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: [Dein SendGrid API Key]
Sender Email: noreply@deine-domain.de
Sender Name: KickR
```

**Mailgun (Kostenlos bis 5.000 E-Mails/Monat):**
```
Host: smtp.mailgun.org
Port: 587
Username: [Dein Mailgun SMTP Username]
Password: [Dein Mailgun SMTP Password]
Sender Email: noreply@deine-domain.de
Sender Name: KickR
```

**Gmail (Für Testing):**
```
Host: smtp.gmail.com
Port: 587
Username: deine-email@gmail.com
Password: [App-spezifisches Passwort]
Sender Email: deine-email@gmail.com
Sender Name: KickR
```

**Hinweis für Gmail:** Du musst ein App-spezifisches Passwort erstellen:
1. Gehe zu https://myaccount.google.com/security
2. Aktiviere 2-Faktor-Authentifizierung
3. Erstelle ein App-Passwort unter "App-Passwörter"

### Option 3: E-Mail-Bestätigung später hinzufügen

Die App ist bereits so konfiguriert, dass sie mit beiden Szenarien umgehen kann:

- **Mit E-Mail-Bestätigung:** Benutzer erhalten eine Nachricht, dass sie ihre E-Mail bestätigen müssen
- **Ohne E-Mail-Bestätigung:** Benutzer werden automatisch angemeldet

## Aktuelle App-Implementierung

Die App behandelt den E-Mail-Fehler jetzt intelligent:

1. **Bei SMTP-Fehler:** 
   - Registrierung wird trotzdem als erfolgreich markiert
   - Benutzer erhält eine hilfreiche Nachricht
   - Account wird erstellt (falls möglich)

2. **Benutzer-Feedback:**
   - Klare Anweisungen, was zu tun ist
   - Hinweis, den Support zu kontaktieren
   - Keine verwirrenden technischen Fehlermeldungen

3. **Fallback-Mechanismus:**
   - Benutzer können sich trotzdem anmelden
   - Profile werden korrekt erstellt
   - Keine Datenverluste

## Empfehlung

**Für sofortiges Testing:**
- Deaktiviere die E-Mail-Bestätigung (Option 1)

**Für Produktion:**
- Konfiguriere einen eigenen SMTP-Server (Option 2)
- Verwende SendGrid oder Mailgun für zuverlässige E-Mail-Zustellung
- Aktiviere E-Mail-Bestätigung für Sicherheit

## Support

Falls Probleme auftreten:
1. Überprüfe die Supabase Auth Logs
2. Teste die SMTP-Verbindung
3. Kontaktiere den Supabase Support bei anhaltenden Problemen

## Weitere Informationen

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [SMTP Configuration Guide](https://supabase.com/docs/guides/auth/auth-smtp)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
