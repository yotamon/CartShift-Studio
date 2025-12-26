import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/lib/seo";
import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = genMeta({
  title: "Terms of Service",
  description: "CartShift Studio terms of service. Read our terms and conditions for using our website and services.",
  url: "/terms",
});

export default function TermsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" }
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
          <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-8">Terms of Service</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Last updated: December 2024
            </p>

            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the CartShift Studio website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Services</h2>
            <p>
              CartShift Studio provides web development and e-commerce services, including but not limited to:
            </p>
            <ul>
              <li>Shopify store development and customization</li>
              <li>WordPress website development</li>
              <li>Website maintenance and support</li>
              <li>E-commerce consulting</li>
            </ul>

            <h2>3. Project Agreements</h2>
            <p>
              All project work is subject to a separate project agreement that outlines:
            </p>
            <ul>
              <li>Scope of work</li>
              <li>Timeline and milestones</li>
              <li>Pricing and payment terms</li>
              <li>Deliverables</li>
            </ul>

            <h2>4. Payment Terms</h2>
            <p>
              Payment terms are specified in individual project agreements. Generally:
            </p>
            <ul>
              <li>Deposits are required before work begins</li>
              <li>Milestone payments may be required for larger projects</li>
              <li>Final payment is due upon project completion</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>
              Upon full payment, clients receive ownership of custom code and designs created specifically for their project. CartShift Studio retains the right to:
            </p>
            <ul>
              <li>Use work in our portfolio (with client permission)</li>
              <li>Reuse general techniques and non-proprietary code</li>
            </ul>

            <h2>6. Client Responsibilities</h2>
            <p>Clients are responsible for:</p>
            <ul>
              <li>Providing necessary content, assets, and information</li>
              <li>Timely feedback and approvals</li>
              <li>Ensuring they have rights to provided content</li>
              <li>Maintaining their own backups</li>
            </ul>

            <h2>7. Limitation of Liability</h2>
            <p>
              CartShift Studio is not liable for indirect, incidental, or consequential damages. Our total liability is limited to the amount paid for the specific service in question.
            </p>

            <h2>8. Warranties</h2>
            <p>
              We warrant that our services will be performed professionally and in accordance with industry standards. We do not guarantee specific business results such as sales or traffic increases.
            </p>

            <h2>9. Termination</h2>
            <p>
              Either party may terminate a project agreement with written notice. In case of termination:
            </p>
            <ul>
              <li>Client pays for work completed to date</li>
              <li>Client receives deliverables for paid work</li>
              <li>Deposits may be non-refundable depending on work completed</li>
            </ul>

            <h2>10. Confidentiality</h2>
            <p>
              Both parties agree to keep confidential information private and not share it with third parties without permission.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These terms are governed by the laws of Israel. Any disputes will be resolved in the courts of Israel.
            </p>

            <h2>12. Changes to Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>

            <h2>13. Contact</h2>
            <p>
              For questions about these terms, contact us at:
            </p>
            <p>
              <strong>Email:</strong> hello@cartshiftstudio.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


