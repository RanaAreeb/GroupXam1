"use client";

import { usePaymentAccess } from '@/hooks/use-payment-access';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, CreditCard, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';

interface PaymentGateProps {
  children: React.ReactNode;
  feature: string;
  packageType?: string;
}

export default function PaymentGate({ children, feature, packageType }: PaymentGateProps) {
  const { hasAccess, packageType: userPackage, expiresAt, isLoading } = usePaymentAccess();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Premium Access Required
            </CardTitle>
            <p className="text-gray-600 mt-2">
              This feature requires a paid subscription to access
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Badge variant="outline" className="text-sm px-3 py-1">
                {feature}
              </Badge>
            </div>

            {/* Package Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-gray-200 hover:border-emerald-300 transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Basic</CardTitle>
                  <div className="text-2xl font-bold text-blue-600">₦15,000</div>
                  <div className="text-sm text-gray-500">30 days</div>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• IELTS Practice</li>
                    <li>• Basic Analytics</li>
                    <li>• Email Support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-300 hover:border-emerald-400 transition-colors relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Crown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Premium</CardTitle>
                  <div className="text-2xl font-bold text-emerald-600">₦35,000</div>
                  <div className="text-sm text-gray-500">90 days</div>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All IELTS Features</li>
                    <li>• Proctor Dashboard</li>
                    <li>• Advanced Analytics</li>
                    <li>• Priority Support</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
                <CardHeader className="text-center pb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">University</CardTitle>
                  <div className="text-2xl font-bold text-purple-600">₦75,000</div>
                  <div className="text-sm text-gray-500">180 days</div>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• All Features</li>
                    <li>• University Dashboard</li>
                    <li>• Custom Analytics</li>
                    <li>• Dedicated Support</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact us to make payment and get instant access to all premium features
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Email:</strong> support@groupxam.com</p>
                <p><strong>Phone:</strong> +234 123 456 7890</p>
                <p><strong>Payment Methods:</strong> Bank Transfer, Mobile Money, Cash</p>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has the required package type
  if (packageType && userPackage !== packageType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">
              Upgrade Required
            </CardTitle>
            <p className="text-gray-600">
              This feature requires a {packageType} package. You currently have a {userPackage} package.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <Badge variant="outline" className="mr-2">{userPackage}</Badge>
              <span className="text-gray-500">→</span>
              <Badge className="ml-2 bg-orange-600 text-white">{packageType}</Badge>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Your access expires: {expiresAt ? new Date(expiresAt).toLocaleDateString() : 'Unknown'}
            </div>
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link href="/contact">Upgrade Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
