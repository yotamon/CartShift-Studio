import { ContactTemplate } from "@/components/templates/ContactTemplate";
import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/lib/seo";

export const metadata: Metadata = genMeta({
  title: "Contact Us | CartShift Studio",
  description: "Ready to start your project? Let's talk. We're friendly, fast, and ready to help you build something amazing.",
  url: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactTemplate />
    </>
  );
}

