import { env } from "@/lib/env";
import { validateContactForm, type ContactFormData } from "@/lib/validation";
import { sanitizeString } from "@/lib/sanitize";
import { logError } from "@/lib/error-handler";

export async function submitContactForm(data: unknown): Promise<{ success: true } | { success: false; error: string; status: number }> {
  const validation = validateContactForm(data);

  if (!validation.success) {
    return {
      success: false,
      error: "Invalid form data",
      status: 400,
    };
  }

  const sanitizedData: ContactFormData = {
    name: sanitizeString(validation.data.name),
    email: sanitizeString(validation.data.email),
    interest: validation.data.interest ? sanitizeString(validation.data.interest) : undefined,
    message: validation.data.message ? sanitizeString(validation.data.message) : undefined,
    company: validation.data.company ? sanitizeString(validation.data.company) : undefined,
    projectType: validation.data.projectType ? sanitizeString(validation.data.projectType) : undefined,
  };

  try {
    const response = await fetch(env.FIREBASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sanitizedData),
    });

    if (!response.ok) {
      throw new Error(`Firebase function returned ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    logError("Failed to submit contact form", error, { data: sanitizedData });
    return {
      success: false,
      error: "Failed to submit form. Please try again later.",
      status: 500,
    };
  }
}

