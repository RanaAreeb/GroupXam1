# Admin Dashboard Documentation

## Overview
The admin dashboard is accessible only to users with the following email addresses:
- `ranaareeb1029@gmail.com`
- `cliftonmanneh6@gmail.com`

## Features

### 1. User Statistics
- **Total Users**: Complete count of registered users
- **Daily Signups**: New users registered today
- **Weekly Signups**: New users registered in the last 7 days
- **Monthly Signups**: New users registered in the last 30 days
- **Yearly Signups**: New users registered in the current year

### 2. Active User Metrics
- **Daily Active Users (DAU)**: Users active in the last 24 hours
- **Weekly Active Users (WAU)**: Users active in the last 7 days
- **Monthly Active Users (MAU)**: Users active in the last 30 days
- **Yearly Active Users (YoY)**: Users active in the last 365 days

### 3. Activity Log
- Real-time activity tracking
- User actions and timestamps
- Export functionality for activity data

### 4. Geographic Distribution
- User distribution by country
- Top countries with user counts
- Export functionality for geographic data

### 5. Data Export
- CSV export for all data types
- Users data export
- Activity log export
- Country distribution export

## Access

### For Admin Users
1. Sign in with one of the admin email addresses
2. The "Admin Dashboard" button will appear in the header
3. Click the button to access the dashboard

### For Non-Admin Users
- The admin dashboard link will not be visible
- Attempting to access `/admin/dashboard` directly will redirect to home page

## API Endpoints

### GET `/api/admin/stats`
Returns comprehensive admin statistics including:
- User counts (total, daily, weekly, monthly, yearly)
- Active user metrics
- Country distribution
- Recent activity log

### GET `/api/admin/export?type={type}`
Exports data in CSV format:
- `type=users`: User data export
- `type=activity`: Activity log export
- `type=countries`: Country distribution export

## Database Schema

### Users Collection
```javascript
{
  name: string,
  email: string,
  role: "student" | "university",
  country: string,
  createdAt: Date,
  lastLoginAt: Date
}
```

### Activities Collection
```javascript
{
  type: string,
  message: string,
  userId: string,
  userName: string,
  userEmail: string,
  timestamp: Date,
  createdAt: Date
}
```

## Setup Instructions

### 1. Database Setup
Ensure MongoDB is running and the database contains the required collections:
- `users`
- `activities`

### 2. Add Test Data
Run the test data script to populate sample data:
```bash
node scripts/add-admin-test-data.js
```

### 3. Environment Variables
Ensure the following environment variables are set:
- `MONGODB_URI`: MongoDB connection string

## Security Features

### Access Control
- Only specified admin emails can access the dashboard
- Automatic redirect for unauthorized users
- Server-side validation of admin status

### Data Protection
- No sensitive user data exposed in exports
- Activity logs respect user privacy
- Secure API endpoints with proper error handling

## UI Components

### Dashboard Layout
- **Overview Tab**: Key metrics and trends
- **Users Tab**: Detailed user statistics
- **Activity Tab**: Real-time activity log
- **Geography Tab**: User distribution by country

### Interactive Features
- Real-time data refresh
- Export functionality
- Responsive design
- Professional UI with shadcn/ui components

## Monitoring and Analytics

### Key Metrics Tracked
1. **User Growth**: Signup trends over time
2. **Engagement**: Active user patterns
3. **Geographic Reach**: User distribution by country
4. **Platform Usage**: Activity patterns and user behavior

### Data Visualization
- Clean, professional charts and metrics
- Color-coded statistics for easy interpretation
- Responsive design for all device sizes

## Troubleshooting

### Common Issues
1. **Database Connection**: Ensure MongoDB is running
2. **Admin Access**: Verify email addresses are correct
3. **Data Loading**: Check API endpoints are accessible
4. **Export Issues**: Verify file permissions for downloads

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Confirm database connectivity
4. Validate admin email addresses

## Future Enhancements

### Planned Features
- Real-time notifications
- Advanced filtering options
- Custom date range selection
- More detailed analytics
- User management interface
- System health monitoring

### Performance Optimizations
- Caching for frequently accessed data
- Pagination for large datasets
- Optimized database queries
- CDN integration for static assets 