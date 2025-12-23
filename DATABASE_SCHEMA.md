
# KickR Admin System Database Schema

## Tables

### profiles
Extends Supabase auth.users with additional profile information and admin level.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'trainer',
  avatar TEXT,
  cover_image TEXT,
  bio TEXT,
  location TEXT,
  admin_level admin_level,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_profiles_admin_level` on `admin_level` (WHERE admin_level IS NOT NULL)

**RLS Policies:**
- Public read access
- Users can update own profile
- Users can insert own profile

---

### sanctions
Stores all user sanctions including bans and restrictions.

```sql
CREATE TABLE sanctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type sanction_type NOT NULL,
  reason TEXT NOT NULL,
  created_by_admin UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_permanent BOOLEAN DEFAULT FALSE,
  ends_at TIMESTAMPTZ,
  status sanction_status DEFAULT 'ACTIVE',
  revoked_at TIMESTAMPTZ,
  revoked_by_admin UUID REFERENCES profiles(id)
);
```

**Indexes:**
- `idx_sanctions_user_id` on `user_id`
- `idx_sanctions_status` on `status`
- `idx_sanctions_type` on `type`

**RLS Policies:**
- Admins can view all sanctions
- Admin 2-4 can create sanctions
- Admin 2-4 can update sanctions

---

### admin_chat_messages
Internal chat system for admin communication.

```sql
CREATE TABLE admin_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_admin_chat_created_at` on `created_at DESC`

**RLS Policies:**
- Admins can view messages
- Admins can send messages (own ID only)

---

### audit_log
Tracks all critical admin actions for accountability.

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_admin_id UUID NOT NULL REFERENCES profiles(id),
  target_user_id UUID REFERENCES profiles(id),
  action_type action_type NOT NULL,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_audit_log_timestamp` on `timestamp DESC`
- `idx_audit_log_actor` on `actor_admin_id`
- `idx_audit_log_target` on `target_user_id`

**RLS Policies:**
- Admins can view log
- System can insert entries

---

## Enums

### admin_level
```sql
CREATE TYPE admin_level AS ENUM (
  'ADMIN_1',
  'ADMIN_2',
  'ADMIN_3',
  'ADMIN_4'
);
```

### sanction_type
```sql
CREATE TYPE sanction_type AS ENUM (
  'MESSAGE_BAN',
  'COMMENT_BAN',
  'FULL_BAN'
);
```

### sanction_status
```sql
CREATE TYPE sanction_status AS ENUM (
  'ACTIVE',
  'REVOKED',
  'EXPIRED'
);
```

### action_type
```sql
CREATE TYPE action_type AS ENUM (
  'sanction_created',
  'sanction_revoked',
  'admin_promoted',
  'admin_demoted',
  'admin_removed'
);
```

---

## Functions

### get_active_sanctions(p_user_id UUID)
Returns all active sanctions for a specific user with admin details.

```sql
CREATE OR REPLACE FUNCTION get_active_sanctions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  type sanction_type,
  reason TEXT,
  is_permanent BOOLEAN,
  ends_at TIMESTAMPTZ,
  created_by_admin_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.type,
    s.reason,
    s.is_permanent,
    s.ends_at,
    p.name as created_by_admin_name
  FROM sanctions s
  JOIN profiles p ON s.created_by_admin = p.id
  WHERE s.user_id = p_user_id
    AND s.status = 'ACTIVE'
    AND (s.is_permanent = true OR s.ends_at > NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage:**
```sql
SELECT * FROM get_active_sanctions('user-uuid-here');
```

---

### expire_sanctions()
Automatically expires sanctions that have passed their end date.

```sql
CREATE OR REPLACE FUNCTION expire_sanctions()
RETURNS void AS $$
BEGIN
  UPDATE sanctions
  SET status = 'EXPIRED'
  WHERE status = 'ACTIVE'
    AND is_permanent = false
    AND ends_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Usage:**
Should be called periodically via cron job or scheduled task:
```sql
SELECT expire_sanctions();
```

---

## Triggers

### update_profiles_updated_at
Automatically updates the `updated_at` timestamp on profile changes.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Relationships

```
auth.users (Supabase)
    ↓
profiles (1:1)
    ↓
    ├── sanctions (1:N) - as user_id
    ├── sanctions (1:N) - as created_by_admin
    ├── admin_chat_messages (1:N)
    ├── audit_log (1:N) - as actor_admin_id
    └── audit_log (1:N) - as target_user_id
```

---

## Sample Queries

### Get all active admins
```sql
SELECT id, name, email, admin_level
FROM profiles
WHERE admin_level IS NOT NULL
ORDER BY admin_level DESC;
```

### Get all active bans
```sql
SELECT 
  s.*,
  u.name as user_name,
  a.name as admin_name
FROM sanctions s
JOIN profiles u ON s.user_id = u.id
JOIN profiles a ON s.created_by_admin = a.id
WHERE s.status = 'ACTIVE'
ORDER BY s.created_at DESC;
```

### Get recent admin actions
```sql
SELECT 
  al.*,
  actor.name as actor_name,
  target.name as target_name
FROM audit_log al
JOIN profiles actor ON al.actor_admin_id = actor.id
LEFT JOIN profiles target ON al.target_user_id = target.id
ORDER BY al.timestamp DESC
LIMIT 50;
```

### Check if user is banned
```sql
SELECT EXISTS (
  SELECT 1 FROM sanctions
  WHERE user_id = 'user-uuid-here'
    AND type = 'FULL_BAN'
    AND status = 'ACTIVE'
    AND (is_permanent = true OR ends_at > NOW())
) as is_banned;
```

---

## Maintenance

### Recommended Cron Jobs

1. **Expire old sanctions** (every hour)
```sql
SELECT expire_sanctions();
```

2. **Clean up old audit logs** (monthly)
```sql
DELETE FROM audit_log
WHERE timestamp < NOW() - INTERVAL '1 year';
```

3. **Archive old sanctions** (monthly)
```sql
-- Move expired sanctions older than 6 months to archive table
-- (Archive table not yet implemented)
```

---

## Backup Strategy

1. **Daily backups** of all admin tables
2. **Retain audit logs** for at least 1 year
3. **Archive sanctions** after 6 months
4. **Export admin chat** monthly for records

---

## Performance Considerations

1. All foreign keys have indexes
2. Frequently queried columns are indexed
3. RLS policies use indexed columns
4. JSONB details field allows flexible data storage
5. Timestamps use TIMESTAMPTZ for timezone support

---

## Security Notes

1. All tables have RLS enabled
2. Admin actions require authentication
3. Audit log tracks all changes
4. Sanctions cannot be deleted, only revoked
5. Admin level changes are logged
6. Profile updates trigger timestamp update
