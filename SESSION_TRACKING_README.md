# Session Tracking Implementation

## Overview
This implementation adds comprehensive session tracking to the GroupXam platform, allowing administrators to monitor user engagement and activity patterns.

## New Features

### 1. Login Activity Tracking
- **File**: `app/api/auth/login/route.js`
- **Changes**: 
  - Tracks login timestamps in user documents (`lastLoginAt`)
  - Creates login activity records in the activities collection
  - Updates user's `updatedAt` field on each login

### 2. Session Tracking API
- **File**: `app/api/activity/session/route.js`
- **Features**:
  - POST: Records session data (duration, page views, actions)
  - GET: Retrieves user's session statistics
  - Tracks total sessions, session time, page views, and average session duration

### 3. Session Tracker Component
- **File**: `components/SessionTracker.tsx`
- **Features**:
  - Automatically tracks user activity (clicks, scrolls, keypresses)
  - Monitors page views and session duration
  - Sends session data every 5 minutes and on page unload
  - Tracks user engagement metrics

### 4. Updated Admin Dashboard
- **File**: `app/admin/dashboard/page.tsx`
- **New Features**:
  - Session Statistics section in Overview tab
  - New "Sessions" tab with detailed analytics
  - User engagement metrics
  - Session activity log

### 5. Enhanced Admin Stats API
- **File**: `app/api/admin/stats/route.js`
- **Changes**:
  - Now tracks actual sign-ins using `lastLoginAt` field
  - Includes session statistics aggregation
  - Provides detailed session data for admin dashboard

## Session Data Structure

### User Document Updates
```javascript
{
  lastLoginAt: Date,           // Last login timestamp
  sessionStats: {
    totalSessions: Number,     // Total number of sessions
    totalSessionTime: Number,  // Total time in milliseconds
    totalPageViews: Number,    // Total page views
    averageSessionTime: Number, // Average session duration
    lastSessionAt: Date        // Last session timestamp
  }
}
```

### Activity Records
```javascript
{
  type: 'login' | 'session',
  message: String,
  userId: ObjectId,
  userName: String,
  userEmail: String,
  sessionDuration: Number,     // For session activities
  pageViews: Number,          // For session activities
  actions: Array,             // For session activities
  timestamp: Date,
  createdAt: Date
}
```

## Admin Dashboard Features

### Overview Tab
- Session Statistics card showing:
  - Total Sessions
  - Total Minutes
  - Average Session Duration
  - Total Page Views

### Sessions Tab
- **Session Overview**: Detailed session metrics
- **User Engagement**: Engagement rates and user activity
- **Recent Session Activities**: Table of recent session data

## Implementation Notes

1. **Privacy**: Session tracking respects user privacy and only tracks basic engagement metrics
2. **Performance**: Session data is sent periodically to avoid overwhelming the server
3. **Reliability**: Session data is sent on page unload and visibility changes
4. **Scalability**: Uses efficient MongoDB aggregation for statistics

## Usage

The session tracker is automatically included in the main layout and starts tracking when users are logged in. No additional setup is required.

## Monitoring

Administrators can view session data in the admin dashboard at `/admin/dashboard` under the "Sessions" tab.

