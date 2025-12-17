export type Language = 'en' | 'he';

export type TranslationStructure = typeof translations.en;

export const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      blog: "Blog",
      contact: "Contact",
    },
    heroForm: {
      title: "Get a Free Consultation",
      subtitle: "Tell us a little about your project — we’ll reply within 24 hours.",
      successTitle: "Thanks!",
      successText: "We’ll be in touch within 24 hours.",
      fields: {
        name: "Name",
        namePlaceholder: "Your name",
        nameRequired: "Name is required",
        email: "Email",
        emailPlaceholder: "your@email.com",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        interest: "What are you looking to build?",
        interestRequired: "Please select an option",
        selectOption: "Select an option",
        options: {
          shopify: "Shopify Store (new or growth)",
          wordpress: "WordPress Website (marketing or WooCommerce)",
          consultation: "Not sure yet — need advice",
        },
      },
      submit: "Request a Free Consult",
      submitting: "Sending...",
      error: "Something went wrong. Please try again, or contact us directly.",
    },
    hero: {
      tag: "Shopify & WordPress builds, designed to convert",
      titleLine1: "Websites & Stores",
      titleLine2: "Built to Convert",
      description:
        "No tech drama. We design and build fast, beautiful websites that guide visitors to buy, book, or reach out — and we keep improving after launch.",
      primaryCta: "Get a Free Consultation",
      secondaryCta: "See Our Work",
      scrollIndicator: "Scroll to explore",
      stats: {
        clients: {
          value: "50+",
          label: "Projects Delivered",
        },
        dedication: {
          value: "100%",
          label: "Hands-on",
        },
      },
    },
    blog: {
      hero: {
        title: "Our Blog",
        subtitle: "Practical insights to help you grow your online business",
        badge: "Fresh Posts",
      },
      categories: "Categories:",
      noPosts: "No posts yet — check back soon!",
      readMore: "Read more",
      relatedPosts: {
        title: "Related",
        span: "Posts",
      },
    },
    blogPost: {
      cta: {
        title: "Need help with your ",
        titleSpan: "online store?",
        description:
          "From strategy to build to optimization — we’ve got you. Reach out for a free consultation.",
        button: "Get in touch",
      },
    },
    blogTeaser: {
      title: "Latest Insights",
      subtitle: "Tips, trends, and growth playbooks",
      readMore: "Read more",
      viewAll: "View all posts",
      posts: [
        {
          title: "Speed Up Your Shopify Store (Without Breaking Your Theme)",
          excerpt:
            "Slow sites bleed revenue. Here are the practical fixes we use to cut load times and lift conversions.",
          href: "/blog/speed-up-shopify-store",
          date: "2024-12-01",
        },
        {
          title: "Shopify vs. WordPress: The Real Tradeoffs",
          excerpt:
            "Two great platforms, different jobs. We’ll help you choose based on goals, budget, and how you plan to grow.",
          href: "/blog/shopify-vs-woocommerce",
          date: "2024-11-15",
        },
      ],
    },
    about: {
      hero: {
        title: "About CartShift Studio",
        subtitle: "Technical expertise. Human connection.",
        badge: "Our Story",
      },
      story: {
        title: "Our Story",
        content: [
          "It started with a simple idea: build sites that feel premium and perform like machines. One of us is obsessed with clean code. The other is obsessed with customer experience. Together, we bridge both.",
          "We blend technical depth with a collaborative process. That means fewer surprises, faster decisions, and a launch you actually enjoy.",
          "No one-size-fits-all templates. We listen first, then build what your business truly needs — and we keep iterating as you grow.",
        ],
      },
      team: {
        title: "Who We Are",
        subtitle: "Meet the team behind CartShift Studio",
        expertiseLabel: "Expertise:",
        members: [
          {
            name: "Technical Lead",
            role: "Co-Founder & Developer",
            bio: "A senior developer specializing in Shopify and WordPress. Focused on clean architecture, performance, and building features that stay maintainable as your business grows.",
            expertise:
              "Shopify, WordPress, Custom Development, Performance Optimization",
          },
          {
            name: "Customer-Facing Lead",
            role: "Co-Founder & Strategist",
            bio: "A growth-minded strategist who turns messy ideas into clear plans. Keeps projects moving, aligns everything to business goals, and makes sure the process feels smooth and human.",
            expertise:
              "Client Relations, Strategy, Project Management, Digital Marketing",
          },
        ],
      },
      values: {
        title: "Our Values",
        subtitle: "What drives everything we do",
        items: [
          {
            title: "Clear Communication",
            description:
              "You’ll always know what’s happening and why. Simple language, honest recommendations, and zero surprises.",
          },
          {
            title: "Design That Converts",
            description:
              "We sweat the details that move numbers: hierarchy, clarity, speed, and a buying journey that feels effortless.",
          },
          {
            title: "Partners After Launch",
            description:
              "Launch isn’t the finish line. We stay close for improvements, experiments, fixes, and new features.",
          },
          {
            title: "Honesty First",
            description:
              "If you don’t need something, we’ll tell you. If something is out of scope, we’ll plan it properly.",
          },
        ],
      },
      expect: {
        title: "What to Expect When",
        titleSpan: "Working With Us",
        content: [
          "Expect thoughtful questions. We dig into your goals, customers, and constraints so we can build the right thing — not just the thing you asked for.",
          "Expect visibility. You’ll get check-ins, demos, and clear next steps. No black boxes.",
          "Expect momentum after launch. We’ll help you optimize, iterate, and scale as your business evolves.",
        ],
      },
      cta: {
        title: "Let’s build something",
        titleSpan: "great",
        description:
          "Have an idea (or a mess of notes)? We’ll help turn it into a site that sells.",
        button: "Get in Touch",
      },
    },
    shopify: {
      hero: {
        title: "Shopify Experts",
        subtitle: "Sell more. Stress less.",
        description:
          "Launch, rebuild, or optimize your Shopify store with a partner who cares about conversion and performance.",
        badge: "Shopify Growth Partners",
      },
      services: {
        title: "Our Shopify Services",
        subtitle: "From first build to ongoing growth",
        items: [
          {
            title: "Strategy & Roadmap",
            description:
              "Clear priorities, the right plan, and the right apps — based on your goals (not hype).",
          },
          {
            title: "Store Design",
            description:
              "A premium look that fits your brand and makes it easy for customers to buy.",
          },
          {
            title: "Custom Features",
            description:
              "Bundles, subscriptions, upsells, custom sections, automations — built clean and maintainable.",
          },
          {
            title: "Speed & SEO",
            description:
              "Faster load times, better Core Web Vitals, clean structure, and SEO fundamentals that compound.",
          },
          {
            title: "Ongoing Support",
            description:
              "Fixes, improvements, experiments, and new features — without the agency chaos.",
          },
          {
            title: "Store Tune-Up",
            description:
              "Already live? We’ll audit your store and ship the highest-impact improvements first.",
          },
        ],
      },
      why: {
        title: "Why Build With",
        titleSpan: "Us?",
        items: [
          "Conversion-first: We design for clarity and action, so more visitors turn into customers.",
          "Less friction: We handle the code, apps, settings, and edge cases. You get a polished store and a clean handoff.",
          "Built to scale: Whether you’re launching your first product or managing a large catalog, we keep your setup fast, stable, and growth-ready.",
        ],
      },
      cta: {
        title: "Ready to",
        titleSpan: "grow sales?",
        description:
          "Tell us where you are today — we’ll map the fastest path forward.",
        button: "Talk Shopify",
      },
    },
    wordpress: {
      hero: {
        title: "WordPress Made Easy",
        subtitle: "Fast, secure websites you can manage",
        description:
          "We design and develop WordPress sites that load quickly, rank well, and stay easy to update.",
        badge: "Web Development Experts",
      },
      services: {
        title: "Our WordPress Services",
        subtitle: "End-to-end development from design to deployment",
        items: [
          {
            title: "Custom Websites",
            description:
              "From scratch or redesign — built around your brand, your content, and your goals.",
          },
          {
            title: "Theme Customization",
            description:
              "Love a theme? We’ll tailor it properly so it looks unique and stays maintainable.",
          },
          {
            title: "Custom Features",
            description:
              "Forms, memberships, multilingual setups, integrations — built securely and cleanly.",
          },
          {
            title: "WooCommerce",
            description:
              "Sell on WordPress with a store that’s easy to manage and built to convert.",
          },
          {
            title: "Speed & Security",
            description:
              "Performance improvements plus sensible security — matched to your needs.",
          },
          {
            title: "Peace of Mind",
            description:
              "We handle updates, backups, and fixes so your site stays healthy.",
          },
        ],
      },
      why: {
        title: "Websites That Work",
        titleSpan: "For You",
        items: [
          {
            strong: "Design + Performance:",
            text: "Beautiful visuals backed by solid engineering — fast, accessible, and reliable.",
          },
          {
            strong: "Total Freedom:",
            text: "Update content, swap images, add pages — without calling a developer.",
          },
          {
            strong: "Built to Be Found:",
            text: "Clean structure and best-practice foundations so your site is ready to rank.",
          },
          {
            strong: "Flexible & Scalable:",
            text: "From simple portfolios to complex sites — built to grow with you.",
          },
        ],
      },
      cta: {
        title: "Need a website that",
        titleSpan: "just works?",
        description:
          "Beautiful, functional, and easy to manage. Let’s make it happen.",
        button: "Let’s Build It",
      },
    },
    ctaBanner: {
      titlePart1: "Ready to take your business to the",
      titlePart2: "next level?",
      description:
        "Bring the vision — we’ll build the engine. Clear process, clean code, measurable results.",
      button: "Start the Conversation",
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "Don’t just take our word for it",
      items: [
        {
          quote:
            "CartShift Studio rebuilt our store experience end-to-end. Conversions improved quickly, and the site finally feels premium.",
          author: "Sarah Johnson",
          company: "Artisan Creations",
          rating: 5,
        },
        {
          quote:
            "They handled our migration flawlessly and made the store noticeably faster. Customers felt the difference immediately.",
          author: "Michael Chen",
          company: "TechGear Pro",
          rating: 5,
        },
        {
          quote:
            "They don’t just ship a site — they stick around, iterate, and help us grow month after month.",
          author: "Emily Rodriguez",
          company: "Boutique Fashion Co",
          rating: 5,
        },
      ],
    },
    whyChoose: {
      title: "Why Work With Us?",
      subtitle: "Not just builders — real partners.",
      items: [
        {
          title: "Made for Your Business",
          description:
            "No cookie-cutter templates. We design around your goals, customers, and products.",
          icon: "target",
        },
        {
          title: "Senior-Led Delivery",
          description:
            "You work directly with experienced specialists — fewer handoffs, faster progress.",
          icon: "handshake",
        },
        {
          title: "Tech Made Simple",
          description:
            "We handle the complexity and explain choices in plain language.",
          icon: "bolt",
        },
        {
          title: "Growth Focused",
          description:
            "We build with the next step in mind: speed, SEO, analytics, and iteration.",
          icon: "chart-up",
        },
      ],
    },
    servicesOverview: {
      title: "Our Core Solutions",
      subtitle: "E-commerce expertise across Shopify and WordPress",
      shopify: {
        title: "E-Commerce Growth",
        description:
          "Everything you need to sell online. We handle design, setup, and performance so you can focus on your products.",
        features: ["Store Setup & Design", "Custom Features", "Speed Optimization", "Growth Support"],
      },
      wordpress: {
        title: "Custom Web Design",
        description:
          "A website as unique as your brand. Flexible, easy to manage, and built to stand out.",
        features: ["Custom Design", "Easy to Edit", "Online Store Ready", "SEO Optimized"],
      },
    },
    contact: {
      hero: {
        title: "Get in Touch",
        subtitle: "Have a project in mind? Let’s make it real.",
        description: "Tell us what you’re building — we’ll reply within 24 hours.",
        badge: "Let’s Talk",
      },
      title: "Contact Information",
      emailLabel: "Email",
      quickResponseTitle: "Quick reply",
      quickResponseText: "We usually get back to you within 24 hours.",
      scheduleTitle: "Want to hop on a call?",
      scheduleText1:
        "We can do a free 30-minute discovery call to discuss goals, scope, and next steps.",
      scheduleText2:
        "Mention it in your message, and we’ll coordinate a time that works for you.",
      form: {
        title: "Send us a message",
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        companyLabel: "Company/Website (optional)",
        companyPlaceholder: "Your company or website",
        projectTypeLabel: "What do you need help with?",
        selectOption: "Select an option",
        options: {
          shopify: "Shopify Store",
          wordpress: "WordPress Website",
          consultation: "General Consultation",
          other: "Other",
        },
        messageLabel: "Tell us about your project",
        messagePlaceholder: "Share a few details about your project...",
        submitButton: "Send Message",
        submitting: "Sending...",
        privacy: "We’ll only use your information to respond to your inquiry.",
        successTitle: "Thank you!",
        successText: "Got it — we’ll reply within 24 hours.",
        sendAnother: "Send Another Message",
      },
    },
    footer: {
      description:
        "Bold e-commerce builds for artists, makers, and brands. Shopify and WordPress websites that look great, load fast, and sell more.",
      solutions: "Solutions",
      company: "Company",
      rights: "All rights reserved.",
      links: {
        shopify: "Shopify Solutions",
        wordpress: "WordPress Solutions",
        about: "About Us",
        blog: "Blog",
        contact: "Contact",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },
    },
    common: {
      learnMore: "Learn More",
      contactUs: "Contact Us",
      getStarted: "Get Started",
      viewWork: "View Our Work",
    },
    process: {
      title: "How We Work",
      subtitle: "A streamlined process designed for success",
      steps: {
        discovery: {
          title: "Discovery",
          description: "We learn about your business, goals, and vision to create a tailored strategy.",
        },
        design: {
          title: "Design",
          description: "Our designers craft stunning visuals that capture your brand identity.",
        },
        develop: {
          title: "Develop",
          description: "We build your store with clean code and optimized performance.",
        },
        launch: {
          title: "Launch",
          description: "Your store goes live with full support and ongoing optimization.",
        },
      },
    },
    stats: {
      projects: {
        label: "Projects Delivered",
      },
      satisfaction: {
        label: "Client Satisfaction",
      },
      years: {
        label: "Years Experience",
      },
      support: {
        label: "Support Available",
      },
    },
  },
  he: {
    nav: {
      home: "ראשי",
      about: "אודות",
      services: "שירותים",
      blog: "בלוג",
      contact: "צור קשר",
    },
    heroForm: {
      title: "שיחת ייעוץ ללא עלות",
      subtitle: "מלאו כמה פרטים ונחזור אליכם תוך 24 שעות.",
      successTitle: "תודה!",
      successText: "נחזור אליכם תוך 24 שעות.",
      fields: {
        name: "שם מלא",
        namePlaceholder: "השם שלך",
        nameRequired: "שם הוא שדה חובה",
        email: "אימייל",
        emailPlaceholder: "your@email.com",
        emailRequired: "אימייל הוא שדה חובה",
        emailInvalid: "כתובת אימייל לא תקינה",
        interest: "מה אתם רוצים לבנות?",
        interestRequired: "אנא בחרו אפשרות",
        selectOption: "בחרו אפשרות",
        options: {
          shopify: "חנות שופיפיי (הקמה או צמיחה)",
          wordpress: "אתר וורדפרס (תדמית או WooCommerce)",
          consultation: "עדיין לא בטוחים — צריך ייעוץ",
        },
      },
      submit: "קבלו ייעוץ חינם",
      submitting: "שולח...",
      error: "משהו השתבש. נסו שוב או צרו איתנו קשר ישירות.",
    },
    hero: {
      tag: "בונים חנויות ואתרים שממירים",
      titleLine1: "אנחנו בונים אתרים",
      titleLine2: "שמייצרים מכירות",
      description:
        "בלי דרמות טכניות. אנחנו מעצבים ובונים אתרים מהירים ויפים שמובילים מבקרים לקנות, להשאיר פרטים או ליצור קשר — וממשיכים לשפר גם אחרי ההשקה.",
      primaryCta: "קבלו ייעוץ חינם",
      secondaryCta: "לתיק העבודות",
      scrollIndicator: "גללו כדי לגלות",
      stats: {
        clients: {
          value: "50+",
          label: "פרויקטים שהושקו",
        },
        dedication: {
          value: "100%",
          label: "ליווי צמוד",
        },
      },
    },
    blog: {
      hero: {
        title: "הבלוג שלנו",
        subtitle: "תובנות פרקטיות שיעזרו לכם לצמוח באונליין",
        badge: "המאמרים החדשים",
      },
      categories: "קטגוריות:",
      noPosts: "אין עדיין מאמרים — חזרו בקרוב!",
      readMore: "קרא עוד",
      relatedPosts: {
        title: "מאמרים",
        span: "נוספים",
      },
    },
    blogPost: {
      cta: {
        title: "צריכים עזרה עם ",
        titleSpan: "החנות שלכם?",
        description:
          "מאסטרטגיה ועד פיתוח ואופטימיזציה — אנחנו כאן. דברו איתנו לייעוץ ללא עלות.",
        button: "דברו איתנו",
      },
    },
    blogTeaser: {
      title: "תובנות אחרונות",
      subtitle: "טיפים, מגמות ותוכניות צמיחה",
      readMore: "קרא עוד",
      viewAll: "לכל המאמרים",
      posts: [
        {
          title: "איך להאיץ חנות שופיפיי (בלי לשבור את התבנית)",
          excerpt:
            "חנות איטית שווה פחות מכירות. הנה השיפורים המעשיים שאנחנו עושים כדי לקצר זמני טעינה ולהעלות המרות.",
          href: "/blog/speed-up-shopify-store",
          date: "2024-12-01",
        },
        {
          title: "שופיפיי או וורדפרס: מה באמת מתאים לכם?",
          excerpt:
            "שתי פלטפורמות מצוינות — שימושים שונים. נעזור לכם לבחור לפי מטרות, תקציב ואיך אתם מתכננים לצמוח.",
          href: "/blog/shopify-vs-woocommerce",
          date: "2024-11-15",
        },
      ],
    },
    about: {
      hero: {
        title: "אודות CartShift Studio",
        subtitle: "מומחיות טכנולוגית. חיבור אנושי.",
        badge: "הסיפור שלנו",
      },
      story: {
        title: "הסיפור שלנו",
        content: [
          "זה התחיל מרעיון פשוט: לבנות אתרים שנראים פרימיום ומתפקדים כמו מכונה. אחד מאיתנו אובססיבי לקוד נקי. השני אובססיבי לחוויית לקוח. ביחד אנחנו מחברים את שני העולמות.",
          "אנחנו משלבים עומק טכני עם תהליך עבודה שיתופי. זה אומר פחות הפתעות, החלטות מהירות יותר, והשקה שבאמת כיף לעבור.",
          "אין אצלנו תבניות “אחד לכולם”. קודם מקשיבים, אחר כך בונים את מה שהעסק שלכם באמת צריך — וממשיכים לאטום ולשפר ככל שאתם גדלים.",
        ],
      },
      team: {
        title: "מי אנחנו",
        subtitle: "הכירו את הצוות מאחורי CartShift Studio",
        expertiseLabel: "תחומי התמחות:",
        members: [
          {
            name: "מוביל טכני",
            role: "מייסד שותף ומפתח",
            bio: "מפתח בכיר המתמחה בשופיפיי ובוורדפרס. מתמקד בארכיטקטורה נקייה, ביצועים, ופיצ׳רים שנשארים קלים לתחזוקה גם כשהעסק גדל.",
            expertise: "שופיפיי, וורדפרס, פיתוח Custom, אופטימיזציית ביצועים",
          },
          {
            name: "מוביל חווית לקוח",
            role: "מייסד שותף ואסטרטג",
            bio: "אסטרטג ממוקד צמיחה שמתרגם רעיונות מבולגנים לתוכנית ברורה. דואג שהפרויקט יתקדם, שהכול יתיישר ליעדים העסקיים, ושהתהליך ירגיש נעים ושקוף.",
            expertise: "קשרי לקוחות, אסטרטגיה, ניהול פרויקטים, שיווק דיגיטלי",
          },
        ],
      },
      values: {
        title: "הערכים שלנו",
        subtitle: "מה שמניע את כל מה שאנחנו עושים",
        items: [
          {
            title: "תקשורת ברורה",
            description:
              "תמיד תדעו מה קורה ולמה. עברית פשוטה, המלצות כנות, ואפס הפתעות.",
          },
          {
            title: "עיצוב שממיר",
            description:
              "אנחנו יורדים לפרטים שמזיזים מספרים: היררכיה, בהירות, מהירות, ומסע קנייה שמרגיש קל.",
          },
          {
            title: "שותפים גם אחרי ההשקה",
            description:
              "השקה היא לא סוף הדרך. נשארים קרובים לשיפורים, ניסויים, תיקונים ופיצ׳רים חדשים.",
          },
          {
            title: "כנות לפני הכול",
            description:
              "אם משהו לא נחוץ — נגיד. אם משהו מעבר להיקף — נתכנן נכון ובשקיפות.",
          },
        ],
      },
      expect: {
        title: "למה לצפות כש",
        titleSpan: "עובדים איתנו",
        content: [
          "צפו לשאלות טובות. אנחנו צוללים למטרות, לקהל ולמגבלות כדי לבנות את הדבר הנכון — לא רק את מה שביקשתם.",
          "צפו לשקיפות. תקבלו צ׳ק-אינים, דמואים ושלבים ברורים. אין קופסאות שחורות.",
          "צפו למומנטום אחרי ההשקה. נמשיך לאופטימיזציה, שיפורים וסקייל ככל שהעסק מתפתח.",
        ],
      },
      cta: {
        title: "בואו נבנה משהו",
        titleSpan: "מעולה",
        description:
          "יש לכם רעיון (או בלגן של הערות)? נעזור להפוך את זה לאתר שמוכר.",
        button: "דברו איתנו",
      },
    },
    shopify: {
      hero: {
        title: "מומחי שופיפיי",
        subtitle: "למכור יותר. פחות לחץ.",
        description:
          "להשיק, לשדרג או לבצע אופטימיזציה לחנות שופיפיי עם שותף שממוקד המרות וביצועים.",
        badge: "שותפים לצמיחה בשופיפיי",
      },
      services: {
        title: "שירותי השופיפיי שלנו",
        subtitle: "מהקמה ראשונית ועד צמיחה שוטפת",
        items: [
          {
            title: "אסטרטגיה ותוכנית עבודה",
            description:
              "סדר עדיפויות ברור, תוכנית נכונה ואפליקציות מתאימות — לפי מטרות, לא לפי הייפ.",
          },
          {
            title: "עיצוב חנות",
            description:
              "מראה פרימיום שמתאים למותג שלכם ומקל על הלקוחות לקנות.",
          },
          {
            title: "פיצ׳רים מותאמים אישית",
            description:
              "באנדלים, מנויים, אפסיילים, סקשנים בהתאמה, אוטומציות — בקוד נקי ותחזיק לאורך זמן.",
          },
          {
            title: "מהירות ו-SEO",
            description:
              "טעינה מהירה יותר, Core Web Vitals טובים יותר, מבנה נקי ותשתית SEO שמצטברת.",
          },
          {
            title: "תמיכה שוטפת",
            description:
              "תיקונים, שיפורים, ניסויים ופיצ׳רים חדשים — בלי כאוס של סוכנויות.",
          },
          {
            title: "שדרוג חנות",
            description:
              "כבר באוויר? נבצע אודיט וניישם קודם את השיפורים בעלי ההשפעה הגבוהה ביותר.",
          },
        ],
      },
      why: {
        title: "למה לבנות",
        titleSpan: "איתנו?",
        items: [
          "ממוקדי המרה: מעצבים עם בהירות ופעולה, כדי שיותר מבקרים יהפכו ללקוחות.",
          "פחות חיכוך: אנחנו מטפלים בקוד, באפליקציות ובהגדרות. אתם מקבלים חנות מלוטשת והעברה מסודרת.",
          "בנוי לגדילה: מהשקה של מוצר ראשון ועד קטלוג גדול — שומרים על מהירות, יציבות ומוכנות לצמיחה.",
        ],
      },
      cta: {
        title: "מוכנים",
        titleSpan: "לצמוח?",
        description: "ספרו לנו איפה אתם היום — ונמפה את הדרך הכי מהירה קדימה.",
        button: "בואו נדבר שופיפיי",
      },
    },
    wordpress: {
      hero: {
        title: "וורדפרס בקלות",
        subtitle: "אתרים מהירים, מאובטחים וקלים לניהול",
        description:
          "אנחנו מעצבים ומפתחים אתרי וורדפרס שטסים, מדורגים טוב, ונשארים קלים לעדכון.",
        badge: "מומחי פיתוח ווב",
      },
      services: {
        title: "שירותי הוורדפרס שלנו",
        subtitle: "פיתוח מקצה לקצה — מעיצוב ועד עלייה לאוויר",
        items: [
          {
            title: "אתרים מותאמים אישית",
            description:
              "מאפס או רידיזיין — סביב המותג, התוכן והמטרות שלכם.",
          },
          {
            title: "התאמות תבנית",
            description:
              "אוהבים תבנית? נתאים אותה נכון כדי שתיראה ייחודית ותישאר קלה לתחזוקה.",
          },
          {
            title: "פיצ׳רים מותאמים אישית",
            description:
              "טפסים, אזורי מנויים, רב-לשוניות, אינטגרציות — בצורה מאובטחת ונקייה.",
          },
          {
            title: "WooCommerce",
            description:
              "חנות על וורדפרס שקל לנהל — ובנויה להמרות.",
          },
          {
            title: "מהירות ואבטחה",
            description:
              "שיפורי ביצועים ואבטחה הגיונית — לפי הצרכים שלכם.",
          },
          {
            title: "שקט נפשי",
            description:
              "אנחנו מטפלים בעדכונים, גיבויים ותיקונים כדי שהאתר יישאר בריא.",
          },
        ],
      },
      why: {
        title: "אתרים שעובדים",
        titleSpan: "בשבילכם",
        items: [
          {
            strong: "עיצוב + ביצועים:",
            text: "ויזואל יפה עם הנדסה חזקה — מהיר, נגיש ואמין.",
          },
          {
            strong: "חופש מוחלט:",
            text: "עדכנו תוכן, החליפו תמונות והוסיפו דפים — בלי להרים טלפון למפתח.",
          },
          {
            strong: "בנוי להימצא:",
            text: "מבנה נקי ותשתית נכונה כדי שהאתר יהיה מוכן לדירוג בגוגל.",
          },
          {
            strong: "גמיש וסקיילבילי:",
            text: "מפורטפוליו פשוט ועד אתרים מורכבים — בנוי לגדול איתכם.",
          },
        ],
      },
      cta: {
        title: "צריכים אתר ש-",
        titleSpan: "פשוט עובד?",
        description: "יפה, פונקציונלי וקל לניהול. בואו נגרום לזה לקרות.",
        button: "בואו נבנה את זה",
      },
    },
    ctaBanner: {
      titlePart1: "מוכנים לקחת את העסק שלכם",
      titlePart2: "לרמה הבאה?",
      description:
        "אתם מביאים את החזון — אנחנו נבנה את המנוע. תהליך ברור, קוד נקי, תוצאות מדידות.",
      button: "התחילו שיחה",
    },
    testimonials: {
      title: "סיפורי הצלחה",
      subtitle: "אל תסמכו רק על המילה שלנו",
      items: [
        {
          quote:
            "CartShift Studio שדרגו לנו את חוויית החנות מקצה לקצה. ההמרות השתפרו מהר, והאתר סוף סוף מרגיש פרימיום.",
          author: "שרה כהן",
          company: "Artisan Creations",
          rating: 5,
        },
        {
          quote:
            "הם העבירו לנו את החנות בצורה חלקה והפכו אותה למהירה משמעותית. הלקוחות הרגישו את ההבדל מיד.",
          author: "מיכאל לוי",
          company: "TechGear Pro",
          rating: 5,
        },
        {
          quote:
            "הם לא רק משיקים אתר — הם נשארים, משפרים, ועוזרים לנו לצמוח חודש אחרי חודש.",
          author: "אמילי רודריגז",
          company: "Boutique Fashion Co",
          rating: 5,
        },
      ],
    },
    whyChoose: {
      title: "למה לעבוד איתנו?",
      subtitle: "לא רק בונים — שותפים אמיתיים.",
      items: [
        {
          title: "מותאם לעסק שלכם",
          description:
            "בלי תבניות גנריות. אנחנו מעצבים סביב המטרות, הלקוחות והמוצרים שלכם.",
          icon: "target",
        },
        {
          title: "ליווי של בכירים",
          description:
            "אתם עובדים ישירות עם מומחים מנוסים — פחות העברות, יותר התקדמות.",
          icon: "handshake",
        },
        {
          title: "טכנולוגיה בפשטות",
          description:
            "אנחנו מתמודדים עם המורכבות ומסבירים החלטות בעברית ברורה.",
          icon: "bolt",
        },
        {
          title: "ממוקדי צמיחה",
          description:
            "בונים עם הצעד הבא בראש: מהירות, SEO, אנליטיקס ושיפור מתמיד.",
          icon: "chart-up",
        },
      ],
    },
    servicesOverview: {
      title: "הפתרונות שלנו",
      subtitle: "מומחיות איקומרס בשופיפיי ובוורדפרס",
      shopify: {
        title: "צמיחה באונליין",
        description:
          "כל מה שצריך כדי למכור אונליין. אנחנו דואגים לעיצוב, להקמה ולביצועים כדי שאתם תוכלו להתמקד במוצרים.",
        features: ["עיצוב והקמת חנויות", "פיתוחים מותאמים אישית", "אופטימיזציית מהירות", "ליווי לצמיחה עסקית"],
      },
      wordpress: {
        title: "עיצוב אתרים בהתאמה אישית",
        description:
          "אתר ייחודי כמו המותג שלכם. גמיש, קל לניהול, ובנוי לבלוט.",
        features: ["עיצוב ייחודי (Custom)", "קל לעריכה", "מוכן לחנות אונליין", "מוכן ל-SEO"],
      },
    },
    contact: {
      hero: {
        title: "צרו איתנו קשר",
        subtitle: "יש לכם פרויקט בראש? בואו נגרום לזה לקרות.",
        description: "ספרו לנו מה אתם בונים — נחזור אליכם תוך 24 שעות.",
        badge: "בואו נדבר",
      },
      title: "פרטי התקשרות",
      emailLabel: "אימייל",
      quickResponseTitle: "תגובה מהירה",
      quickResponseText: "בדרך כלל אנחנו חוזרים תוך 24 שעות.",
      scheduleTitle: "מעדיפים שיחה?",
      scheduleText1:
        "נשמח לשיחת היכרות חינמית של 30 דקות כדי לדבר על מטרות, היקף והצעדים הבאים.",
      scheduleText2:
        "פשוט ציינו זאת בהודעה, ונתאם זמן שנוח לכם.",
      form: {
        title: "שלחו לנו הודעה",
        nameLabel: "שם מלא",
        namePlaceholder: "השם שלך",
        emailLabel: "אימייל",
        emailPlaceholder: "your@email.com",
        companyLabel: "חברה/אתר (אופציונלי)",
        companyPlaceholder: "שם החברה או כתובת האתר",
        projectTypeLabel: "במה נוכל לעזור?",
        selectOption: "בחרו אפשרות",
        options: {
          shopify: "חנות שופיפיי",
          wordpress: "אתר וורדפרס",
          consultation: "ייעוץ כללי",
          other: "אחר",
        },
        messageLabel: "ספרו לנו על הפרויקט",
        messagePlaceholder: "שתפו כמה פרטים על הפרויקט שלכם...",
        submitButton: "שלח הודעה",
        submitting: "שולח...",
        privacy: "נשתמש במידע רק כדי לחזור אליכם לגבי הפנייה.",
        successTitle: "תודה!",
        successText: "קיבלנו — נחזור אליכם תוך 24 שעות.",
        sendAnother: "שלח הודעה נוספת",
      },
    },
    footer: {
      description:
        "אתרי איקומרס נועזים לאמנים, יוצרים ומותגים. שופיפיי ווורדפרס שנראים מעולה, נטענים מהר ומוכרים יותר.",
      solutions: "פתרונות",
      company: "חברה",
      rights: "כל הזכויות שמורות.",
      links: {
        shopify: "פתרונות שופיפיי",
        wordpress: "פתרונות וורדפרס",
        about: "מי אנחנו",
        blog: "בלוג",
        contact: "צור קשר",
        privacy: "מדיניות פרטיות",
        terms: "תנאי שימוש",
      },
    },
    common: {
      learnMore: "לפרטים נוספים",
      contactUs: "דברו איתנו",
      getStarted: "בואו נתחיל",
      viewWork: "לתיק העבודות",
    },
    process: {
      title: "איך אנחנו עובדים",
      subtitle: "תהליך ייעודי שמוביל להצלחה",
      steps: {
        discovery: {
          title: "גילוי",
          description: "אנחנו לומדים על העסק, המטרות והחזון שלכם כדי ליצור אסטרטגיה מותאמת.",
        },
        design: {
          title: "עיצוב",
          description: "המעצבים שלנו יוצרים ויזואל מרהיב שמבטא את זהות המותג שלכם.",
        },
        develop: {
          title: "פיתוח",
          description: "אנחנו בונים את החנות עם קוד נקי וביצועים אופטימליים.",
        },
        launch: {
          title: "השקה",
          description: "החנות עולה לאוויר עם תמיכה מלאה ואופטימיזציה שוטפת.",
        },
      },
    },
    stats: {
      projects: {
        label: "פרויקטים שהושקו",
      },
      satisfaction: {
        label: "שביעות רצון לקוחות",
      },
      years: {
        label: "שנות ניסיון",
      },
      support: {
        label: "תמיכה זמינה",
      },
    },
  },
};

export function getNestedTranslation(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let result: unknown = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }

  return result ?? path;
}
