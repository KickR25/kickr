
# KickR Admin Quick Reference

## Admin Levels & Permissions

| Level | Permissions |
|-------|------------|
| ADMIN_1 | - View admin dashboard<br>- Access admin chat<br>- View sanctions (read-only)<br>- View audit log<br>- View reports |
| ADMIN_2 | - All ADMIN_1 permissions<br>- Create sanctions (all types)<br>- Revoke sanctions<br>- Search users |
| ADMIN_3 | - All ADMIN_2 permissions<br>- Promote users to admin<br>- Set admin levels<br>- Remove admin privileges |
| ADMIN_4 | - All ADMIN_3 permissions<br>- Full system access<br>- Owner/Deputy level |

## Sanction Types

### MESSAGE_BAN
- **Effect**: User cannot send private messages
- **Color**: Orange (#FF9500)
- **Label**: Nachrichtensperre

### COMMENT_BAN
- **Effect**: User cannot comment on posts or trainings
- **Color**: Orange (#FF9500)
- **Label**: Kommentarsperre

### FULL_BAN
- **Effect**: User cannot access the app at all
- **Color**: Red (#FF3B30)
- **Label**: Vollsperre
- **Note**: Shows ban screen on login

## Common Tasks

### Create a Ban
1. Admin Area → User Lookup
2. Search user
3. Select user
4. Choose ban type
5. Enter reason
6. Set duration
7. Create

### Revoke a Ban
1. Admin Area → Sanctions
2. Filter: Active
3. Find sanction
4. Tap "Aufheben"
5. Confirm

### Promote to Admin
1. Admin Area → Admin Management
2. Tap "+" button
3. Search user
4. Select user
5. Choose level
6. Confirm

### Send Admin Message
1. Admin Area → Admin Chat
2. Type message
3. Optional: Add image
4. Send

## Ban Duration Display

### Temporary Ban
Format: `X Tage : HH : MM : SS`
Example: `7 Tage : 14 : 30 : 45`

### Permanent Ban
Always shows: `730 Tage : 00 : 00 : 00`

## German Text Templates

### Ban Notification
```
Du wurdest von [AdminName] für [RemainingTime] gesperrt.
Grund: [Reason].
```

### Comment Ban Alert
```
Du bist bis [Zeit] gesperrt.
Grund: [Reason].
```

### Permanent Ban
```
Du bist dauerhaft gesperrt.
```

## Action Types (Audit Log)

- `sanction_created` - Sanktion erstellt (Red)
- `sanction_revoked` - Sanktion aufgehoben (Green)
- `admin_promoted` - Admin befördert (Blue)
- `admin_demoted` - Admin degradiert (Orange)
- `admin_removed` - Admin entfernt (Orange)

## Best Practices

1. **Always provide clear reasons** for sanctions
2. **Use temporary bans** when appropriate
3. **Document decisions** in admin chat
4. **Review audit log** regularly
5. **Escalate to higher admins** when unsure
6. **Be consistent** with sanction durations
7. **Communicate** with other admins

## Keyboard Shortcuts (Future)

Currently not implemented, but planned:
- `Cmd/Ctrl + K` - Quick user search
- `Cmd/Ctrl + B` - Create ban
- `Cmd/Ctrl + L` - View audit log

## Support

For admin system issues or questions:
- Contact: support@kickr.app
- Internal: Use Admin Chat
- Emergency: Contact ADMIN_4 users
