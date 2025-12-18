import { env } from "@/lib/env";
import { validateNewsletterSubscription, type NewsletterSubscriptionData } from "@/lib/validation";
import { sanitizeString } from "@/lib/sanitize";
import { logError } from "@/lib/error-handler";

export async function subscribeNewsletter(data: unknown): Promise<{ success: true } | { success: false; error: string; status: number }> {
  const validation = validateNewsletterSubscription(data);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid email address",
      status: 400,
    };
  }

  const sanitizedData: NewsletterSubscriptionData = {
    email: sanitizeString(validation.data.email),
  };

  try {
    const baseUrl = env.FIREBASE_FUNCTION_URL.replace("/contactForm", "");
    const functionUrl = `${baseUrl}/newsletterSubscription`;
    const response = await fetch(functionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Firebase function returned ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    logError("Failed to subscribe to newsletter", error, { data: sanitizedData });
    return {
      success: false,
      error: "Failed to subscribe. Please try again later.",
      status: 500,
    };
  }
}

