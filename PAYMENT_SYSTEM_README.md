# Payment Management System

This document describes the manual payment management system implemented for GroupXam.

## Overview

The system allows administrators to manually manage user payments and access to premium features. Users must pay directly to the company account and then get access granted manually through the admin dashboard.

## Features

### Admin Dashboard - Payments Tab

1. **View All Payments**: See all payment records with status, amount, package, and user details
2. **Add Manual Payment**: Add payment records for users who have paid directly
3. **Approve/Reject Payments**: Process pending payments
4. **Export Data**: Export payment data to CSV
5. **Payment Statistics**: View total revenue, payment counts, and pending payments

### Payment Packages

- **Basic**: ₦15,000 - 30 days - IELTS Practice, Basic Analytics, Email Support
- **Premium**: ₦35,000 - 90 days - All IELTS Features, Proctor Dashboard, Advanced Analytics, Priority Support
- **University**: ₦75,000 - 180 days - All Features, University Dashboard, Custom Analytics, Dedicated Support

### Access Control

The system uses `PaymentGate` component to restrict access to premium features:

- **IELTS Practice**: Requires Basic package or higher
- **Proctor Dashboard**: Requires Premium package or higher  
- **University Dashboard**: Requires University package

## How It Works

### For Users

1. User visits a premium feature (e.g., IELTS Practice)
2. If they don't have paid access, they see a payment gate with package options
3. User contacts support to make payment
4. Admin adds payment record and approves it
5. User gets immediate access to the feature

### For Admins

1. Go to Admin Dashboard → Payments tab
2. Click "Add Manual Payment" to add a new payment record
3. Fill in user details, amount, package, and duration
4. Payment is automatically approved and user gets access
5. Monitor all payments and their status

## API Endpoints

### Admin Payment Management
- `GET /api/admin/payments` - Fetch all payments
- `POST /api/admin/payments` - Add manual payment
- `PATCH /api/admin/payments` - Approve/reject payment

### User Access Check
- `GET /api/user/payment-access` - Check user's payment access

## Database Collections

### payments
```javascript
{
  _id: ObjectId,
  userEmail: string,
  userName: string,
  amount: number,
  package: 'basic' | 'premium' | 'university',
  duration: number, // days
  paymentMethod: 'bank_transfer' | 'cash' | 'mobile_money' | 'other',
  transactionId: string,
  paymentDate: Date,
  expiresAt: Date,
  notes: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### users (updated fields)
```javascript
{
  // ... existing fields
  hasPaidAccess: boolean,
  packageType: string,
  accessExpiresAt: Date,
  lastPaymentDate: Date
}
```

## Usage Examples

### Adding Payment Gate to a Page

```tsx
import PaymentGate from '@/components/PaymentGate';

export default function MyPage() {
  return (
    <PaymentGate feature="Feature Name" packageType="basic">
      {/* Your page content */}
    </PaymentGate>
  );
}
```

### Checking Payment Access in Code

```tsx
import { usePaymentAccess } from '@/hooks/use-payment-access';

export default function MyComponent() {
  const { hasAccess, packageType, expiresAt, isLoading } = usePaymentAccess();
  
  if (isLoading) return <div>Loading...</div>;
  if (!hasAccess) return <div>Access required</div>;
  
  return <div>Your content here</div>;
}
```

## Security Notes

- Only admin users can access the payment management interface
- Payment access is checked on every request
- Access automatically expires based on the package duration
- All payment operations are logged for audit purposes

## Future Enhancements

- Integration with Stripe for automatic payments
- Email notifications for payment status changes
- Automated access expiration handling
- Payment analytics and reporting
- Recurring subscription management
