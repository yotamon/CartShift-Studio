import { setRequestLocale } from 'next-intl/server';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Privacy Policy",
  description: "CartShift Studio privacy policy. Learn how we collect, use, and protect your personal information.",
  url: "/privacy",
});

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as 'en' | 'he');
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" }
  ]);

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Last updated: December 2024
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              When you use our website or services, we may collect:
            </p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, and company name when you fill out our contact forms.</li>
              <li><strong>Project Information:</strong> Details about your project needs that you share with us.</li>
              <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent.</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device type.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you information about our services</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party services that help us operate our business (e.g., email services, analytics).</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights.</li>
            </ul>

            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to:
            </p>
            <ul>
              <li>Remember your preferences (like language selection)</li>
              <li>Understand how you use our website</li>
              <li>Improve our services</li>
            </ul>
            <p>
              You can control cookies through your browser settings.
            </p>

            <h2>5. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h2>7. Third-Party Services</h2>
            <p>
              Our website may use third-party services including:
            </p>
            <ul>
              <li>Google Analytics for website analytics</li>
              <li>Firebase for hosting</li>
            </ul>
            <p>
              These services have their own privacy policies.
            </p>

            <h2>8. Contact Us</h2>
            <p>
              If you have questions about this privacy policy or your personal information, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> hello@cartshiftstudio.com
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


