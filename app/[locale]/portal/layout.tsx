import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import "@/components/portal/portal.css";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Portal pages don't need the main site header/footer
  // They have their own PortalShell navigation
  return (
    <>
      <GoogleAnalytics />
      {children}
    </>
  );
}
