declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export const trackEvent = (eventName: string, params?: EventParams) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
};

export const trackFormSubmit = (formName: string, formLocation: string) => {
  trackEvent("form_submit", {
    form_name: formName,
    form_location: formLocation
  });
};

export const trackHeroFormSubmit = () => {
  trackEvent("hero_form_submit", {
    form_location: "hero"
  });
};

export const trackContactFormSubmit = () => {
  trackEvent("contact_form_submit", {
    form_location: "contact"
  });
};

export const trackBookCallClick = (buttonLocation: string) => {
  trackEvent("book_call_click", {
    button_location: buttonLocation
  });
};

export const trackWhatsAppClick = () => {
  trackEvent("whatsapp_click");
};

export const trackPhoneClick = () => {
  trackEvent("phone_click");
};

export const trackEmailClick = () => {
  trackEvent("email_click");
};

export const trackPortfolioView = (projectName: string) => {
  trackEvent("portfolio_view", {
    project_name: projectName
  });
};

export const trackCaseStudyScroll = (projectName: string, scrollDepth: number) => {
  trackEvent("case_study_scroll", {
    project_name: projectName,
    scroll_depth: scrollDepth
  });
};

export const trackPricingView = () => {
  trackEvent("pricing_view");
};

export const trackPackageClick = (packageName: string) => {
  trackEvent("package_click", {
    package_name: packageName
  });
};

export const trackBlogRead = (postTitle: string, postCategory?: string) => {
  trackEvent("blog_read", {
    post_title: postTitle,
    post_category: postCategory
  });
};

export const trackCTAClick = (ctaText: string, ctaLocation: string) => {
  trackEvent("cta_click", {
    cta_text: ctaText,
    cta_location: ctaLocation
  });
};

export const trackLanguageSwitch = (newLanguage: string) => {
  trackEvent("language_switch", {
    new_language: newLanguage
  });
};

export const trackNewsletterSignup = (location: string) => {
  trackEvent("newsletter_signup", {
    signup_location: location
  });
};

export const trackExitIntentShown = () => {
  trackEvent("exit_intent_shown");
};

export const trackExitIntentClosed = (action: "cta_clicked" | "dismissed") => {
  trackEvent("exit_intent_closed", {
    action
  });
};

export const useScrollTracking = (thresholds: number[] = [25, 50, 75, 100]) => {
  if (typeof window === "undefined") return;

  let trackedThresholds: number[] = [];

  const handleScroll = () => {
    const scrollPercent = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );

    thresholds.forEach(threshold => {
      if (scrollPercent >= threshold && !trackedThresholds.includes(threshold)) {
        trackedThresholds.push(threshold);
        trackEvent("scroll_depth", {
          percent: threshold,
          page_path: window.location.pathname
        });
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", handleScroll);
    trackedThresholds = [];
  };
};


