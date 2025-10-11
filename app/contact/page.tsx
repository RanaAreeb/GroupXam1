"use client";
import { useState, useEffect, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send, Package, CreditCard, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

function ContactForm() {
  const searchParams = useSearchParams();
  const packageParam = searchParams?.get('package');
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "general",
    packageType: packageParam || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Update form when package parameter changes
  useEffect(() => {
    if (packageParam) {
      let inquiryType = "general";
      let subject = "";
      let message = "";
      
      if (packageParam.includes('subscription')) {
        inquiryType = "subscription";
        const duration = packageParam.includes('3month') ? '3 months' : 
                        packageParam.includes('6month') ? '6 months' : 
                        packageParam.includes('12month') ? '12 months' : 'subscription';
        subject = `Premium Subscription (${duration}) Inquiry`;
        message = `Hi! I'm interested in the Premium Subscription ${duration} plan. Could you please provide more information about pricing, features, and payment options?`;
      } else if (packageParam.includes('ielts')) {
        inquiryType = "package";
        subject = `IELTS ${packageParam.charAt(0).toUpperCase() + packageParam.slice(1)} Package Inquiry`;
        message = `Hi! I'm interested in learning more about the IELTS ${packageParam} package. Could you please provide more information about pricing, features, and payment options?`;
      } else {
        inquiryType = "proctorit";
        subject = `ProctorIT ${packageParam.charAt(0).toUpperCase() + packageParam.slice(1)} Package Inquiry`;
        message = `Hi! I'm interested in learning more about the ProctorIT ${packageParam} package. Could you please provide more information about pricing, features, and payment options?`;
      }
      
      setForm(prev => ({
        ...prev,
        inquiryType,
        packageType: packageParam,
        subject,
        message
      }));
    }
  }, [packageParam]);

  // Placeholder for sending email with Google App Password
  const sendEmail = async () => {
    // TODO: Integrate with backend/email API using Google App Password
    return new Promise((resolve) => setTimeout(resolve, 1200));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "", inquiryType: "general", packageType: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated SVG Blobs */}
      <svg
        className="absolute -top-32 -left-32 w-[40vw] h-[40vw] opacity-30 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#6ee7b7"
          d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] opacity-20 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#a5b4fc"
          d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-10 text-center relative overflow-hidden animate-fade-in-up z-10">
        <div className="absolute top-4 left-4">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/70 hover:bg-emerald-100 shadow"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
            </Button>
          </Link>
        </div>
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="groupXam logo"
            width={120}
            height={120}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
          {packageParam ? 'Package Inquiry' : 'Contact Us'}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {packageParam 
            ? `Interested in ${packageParam.includes('subscription') ? 'Premium Subscription' : packageParam.includes('ielts') ? 'IELTS' : 'ProctorIT'} ${packageParam} package? Get in touch for detailed pricing and payment information.`
            : 'Have a question, suggestion, or need help? Fill out the form below and our team will get back to you soon.'
          }
        </p>

        {/* Package Information Display */}
        {packageParam && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">
                {packageParam.includes('subscription') ? 'Premium Subscription' : packageParam.includes('ielts') ? 'IELTS' : 'ProctorIT'} {packageParam.includes('subscription') ? 
                  (packageParam.includes('3month') ? '3 Months' : packageParam.includes('6month') ? '6 Months' : packageParam.includes('12month') ? '12 Months' : 'Subscription') 
                  : packageParam.charAt(0).toUpperCase() + packageParam.slice(1)} Package
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">
                  {packageParam === 'students' && '$2 one-time charge'}
                  {packageParam === 'k12' && '$10/month or $100/year'}
                  {packageParam === 'universities' && '$20/month or $240/year'}
                  {packageParam === 'ielts-monthly' && '$1.99/month'}
                  {packageParam === 'ielts-6months' && '$14.99 (6 months)'}
                  {packageParam === 'ielts-yearly' && '$29.99/year'}
                  {packageParam === 'subscription-3month' && '$6 (3 months) - $2/month'}
                  {packageParam === 'subscription-6month' && '$12 (6 months) - $2/month'}
                  {packageParam === 'subscription-12month' && '$36 (12 months) - $3/month - Save 5%!'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">
                  {packageParam.includes('subscription') ? 'All 8 premium features included' : packageParam.includes('ielts') ? 'Comprehensive IELTS preparation' : 'Secure proctoring technology'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span className="text-gray-700">24/7 support included</span>
              </div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inquiry Type</label>
            <Select 
              value={form.inquiryType} 
              onValueChange={(value) => setForm({ ...form, inquiryType: value })}
            >
              <SelectTrigger className="bg-white/90">
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="subscription">Premium Subscription Inquiry</SelectItem>
                <SelectItem value="package">IELTS Package Inquiry</SelectItem>
                <SelectItem value="proctorit">ProctorIT Package Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
                <SelectItem value="billing">Billing Question</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subscription Package Type Selection */}
          {form.inquiryType === 'subscription' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Premium Subscription Package</label>
              <Select 
                value={form.packageType} 
                onValueChange={(value) => setForm({ ...form, packageType: value })}
              >
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Select subscription package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription-3month">3 Months Plan ($6 - $2/month)</SelectItem>
                  <SelectItem value="subscription-6month">6 Months Plan ($12 - $2/month)</SelectItem>
                  <SelectItem value="subscription-12month">12 Months Plan ($36 - $3/month - Save 5%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Package Type Selection (only show if package inquiry) */}
          {form.inquiryType === 'package' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">IELTS Package Type</label>
              <Select 
                value={form.packageType} 
                onValueChange={(value) => setForm({ ...form, packageType: value })}
              >
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Select IELTS package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ielts-monthly">Monthly Plan ($1.99/month)</SelectItem>
                  <SelectItem value="ielts-6months">6 Month Plan ($14.99)</SelectItem>
                  <SelectItem value="ielts-yearly">Yearly Plan ($29.99/year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ProctorIT Package Type Selection */}
          {form.inquiryType === 'proctorit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ProctorIT Package Type</label>
              <Select 
                value={form.packageType} 
                onValueChange={(value) => setForm({ ...form, packageType: value })}
              >
                <SelectTrigger className="bg-white/90">
                  <SelectValue placeholder="Select ProctorIT package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students ($2 one-time)</SelectItem>
                  <SelectItem value="k12">K-12 Schools ($10/month)</SelectItem>
                  <SelectItem value="universities">Universities ($20/month)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-white/90"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-white/90"
          />
          <Input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="bg-white/90"
          />
          <Textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="bg-white/90"
            rows={4}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
            disabled={submitting}
          >
            <Send className="w-5 h-5" />
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
        {success && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold animate-fade-in">
            <Mail className="inline-block w-5 h-5 mr-2 align-middle" />
            Your message has been sent! We'll get back to you soon.
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold animate-fade-in">
            {error}
          </div>
        )}

        {/* Payment Information for Package Inquiries */}
        {(form.inquiryType === 'subscription' || form.inquiryType === 'package' || form.inquiryType === 'proctorit') && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Accepted Payment Methods:</h4>
                <ul className="space-y-1">
                  <li>• Credit/Debit Cards (Visa, MasterCard, Amex)</li>
                  <li>• Bank Transfers</li>
                  <li>• PayPal</li>
                  <li>• Mobile Money (selected regions)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Security & Support:</h4>
                <ul className="space-y-1">
                  <li>• Secure SSL encrypted payments</li>
                  <li>• 24/7 billing support</li>
                  <li>• Flexible payment terms</li>
                  <li>• Monthly or annual billing</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Our team will provide detailed payment instructions and setup assistance once you submit your inquiry.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact form...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
