
# KickR Admin System Documentation

## Overview
This document describes the comprehensive admin system implemented for KickR, including role-based access control (RBAC), sanctions management, admin chat, and full ban enforcement.

## Features Implemented

### 1. Admin Roles (RBAC)
Four admin levels with hierarchical permissions:

- **ADMIN_4**: Owner + Deputy (full access to all features)
- **ADMIN_3**: Full bans + manage admins
- **ADMIN_2**: Full bans only
- **ADMIN_1**: Community interaction only (read-only + admin chat)

### 2. Database Schema
Created the following tables in Supabase:

#### profiles
- Extends auth.users with additional fields
- Stores admin_level for RBAC
- Fields: id, name, email, role, avatar, cover_image, bio, location, admin_level

#### sanctions
- Stores all user sanctions/bans
- Types: MESSAGE_BAN, COMMENT_BAN, FULL_BAN
- Fields: id, user_id, type, reason, created_by_admin, created_at, is_permanent, ends_at, status, revoked_at, revoked_by_admin

#### admin_chat_messages
- Internal admin-only chat system
- Fields: id, admin_id, content, image_url, created_at

#### audit_log
- Tracks all critical admin actions
- Fields: id, actor_admin_id, target_user_id, action_type, details, timestamp

### 3. Admin Area Screens

#### Dashboard (`/(admin)/index.tsx`)
- Central hub for all admin functions
- Shows available features based on admin level
- Menu items: Admin Chat, Sanctions, User Lookup, Reports, Admin Management, Audit Log

#### Admin Chat (`/(admin)/chat.tsx`)
- Real-time internal chat for admins
- Supports text messages and images
- Auto-refreshes every 5 seconds
- Only accessible to admins (all levels)

#### Sanctions Management (`/(admin)/sanctions.tsx`)
- View all sanctions with filtering (All, Active, Revoked, Expired)
- Revoke active sanctions (Admin 2-4)
- Color-coded sanction types
- Shows sanction details, creator, and timestamps

#### User Lookup (`/(admin)/user-lookup.tsx`)
- Search users by name or email
- Create sanctions for users
- Modal interface for sanction creation
- Date picker for temporary bans
- Permanent ban option

#### Admin Management (`/(admin)/admin-management.tsx`)
- View all current admins
- Promote users to admin (Admin 3-4 only)
- Set admin levels (ADMIN_1 to ADMIN_4)
- Remove admin privileges
- All changes logged to audit log

#### Audit Log (`/(admin)/audit-log.tsx`)
- View all admin actions
- Color-coded action types
- Shows actor, target, and details
- Chronological order (newest first)

#### Reports (`/(admin)/reports.tsx`)
- Placeholder for future reported content feature
- Ready for integration

### 4. Ban Enforcement

#### Full Ban Screen (`components/BanScreen.tsx`)
- Displayed when user has active FULL_BAN
- Shows ban details: admin name, remaining time, reason
- Live countdown timer for temporary bans
- Permanent bans show 730 days
- Buttons: Logout, Contact/Appeal

#### Comment Ban Enforcement
- Integrated into PostCard component
- Blocks commenting when COMMENT_BAN is active
- Shows alert with ban details and reason

#### Message Ban Enforcement
- Ready for integration into messaging system
- Hook available: `useBanCheck().hasMessageBan`

### 5. Hooks

#### useAdmin (`hooks/useAdmin.ts`)
- Check admin status and level
- Permission checks: canManageAdmins, canCreateBans, canAccessAdminChat
- CRUD operations for sanctions
- Admin promotion/demotion
- Search users
- Get admin chat messages
- Send admin chat messages
- Get audit log

#### useBanCheck (`hooks/useBanCheck.ts`)
- Check for active bans on current user
- Get specific ban types (FULL_BAN, MESSAGE_BAN, COMMENT_BAN)
- Format remaining time for display
- Refresh bans on demand

### 6. Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

#### profiles
- Public read access
- Users can update own profile
- Users can insert own profile

#### sanctions
- Admins can view all sanctions
- Admin 2-4 can create sanctions
- Admin 2-4 can update sanctions

#### admin_chat_messages
- Admins can view messages
- Admins can send messages (own ID only)

#### audit_log
- Admins can view log
- System can insert entries

### 7. Integration with Existing App

#### AuthContext Updates
- Integrated Supabase authentication
- Loads admin_level from profiles table
- Fallback to local storage for offline support

#### Profile Screen Updates
- Added admin button for admins
- Shows admin level badge
- Direct link to admin dashboard

#### App Layout Updates
- Added ban check on app load
- Shows BanScreen if user has FULL_BAN
- Prevents access to app when banned

## Usage

### Accessing Admin Area
1. Log in as a user with admin privileges
2. Go to Profile screen
3. Tap "Admin-Bereich" button
4. Navigate through admin features

### Creating a Sanction
1. Go to Admin Area → User Lookup
2. Search for user by name or email
3. Select user from results
4. Choose sanction type (MESSAGE_BAN, COMMENT_BAN, FULL_BAN)
5. Enter reason
6. Set duration (temporary or permanent)
7. Create sanction

### Promoting a User to Admin
1. Go to Admin Area → Admin Management (Admin 3-4 only)
2. Tap "+" button
3. Search for user
4. Select user
5. Choose admin level (ADMIN_1 to ADMIN_4)
6. Confirm

### Viewing Audit Log
1. Go to Admin Area → Audit Log
2. View all admin actions chronologically
3. See actor, target, action type, and details

## Security Considerations

1. **RLS Policies**: All database operations are protected by RLS
2. **Permission Checks**: Frontend checks admin level before showing features
3. **Backend Validation**: Supabase RLS ensures backend security
4. **Audit Trail**: All critical actions are logged
5. **Ban Enforcement**: Bans are checked on app load and before actions

## Future Enhancements

1. **Reports System**: Implement user reporting functionality
2. **Ban Appeals**: Add appeal submission and review process
3. **Bulk Actions**: Allow bulk sanction operations
4. **Advanced Filters**: Add more filtering options for sanctions and audit log
5. **Notifications**: Push notifications for admin actions
6. **Dashboard Analytics**: Add statistics and charts to admin dashboard
7. **Export Functionality**: Export audit logs and sanctions to CSV

## Database Functions

### get_active_sanctions(p_user_id UUID)
Returns all active sanctions for a user with admin details.

### expire_sanctions()
Automatically expires sanctions that have passed their end date.
Should be called periodically (e.g., via cron job).

## Notes

- No demo users or demo admins are created
- Only real registered users can be promoted to admin
- All logic works across web, Android, and iOS
- Permanent bans always display 730 days countdown
- Multiple sanctions per user are allowed
- FULL_BAN overrides all other ban types
