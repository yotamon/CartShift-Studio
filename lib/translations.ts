
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
        subtitle: "Fill out the form and we'll get back to you within 24 hours",
        successTitle: "Thank you!",
        successText: "We'll be in touch within 24 hours.",
        fields: {
            name: "Name",
            namePlaceholder: "Your name",
            nameRequired: "Name is required",
            email: "Email",
            emailPlaceholder: "your@email.com",
            emailRequired: "Email is required",
            emailInvalid: "Invalid email address",
            interest: "What do you need help with?",
            interestRequired: "Please select an option",
            selectOption: "Select an option",
            options: {
                shopify: "Shopify Store",
                wordpress: "WordPress Website",
                consultation: "General Consultation"
            }
        },
        submit: "Let's Talk",
        submitting: "Submitting...",
        error: "Something went wrong. Please try again or contact us directly."
    },
    hero: {
      tag: "Building Digital Experiences That Last",
      titleLine1: "We Build Websites",
      titleLine2: "That Actually Sell",
      description: "Forget the tech headaches. We design and build stunning online stores that capture attention and turn visitors into loyal customers. Simple, powerful, and built just for you.",
      primaryCta: "Let's Talk Ideas",
      secondaryCta: "See Our Work",
      scrollIndicator: "Scroll to explore",
      stats: {
        clients: {
          value: "50+",
          label: "Happy Clients"
        },
        dedication: {
            value: "100%",
            label: "Dedication"
        }
      }
    },
    blog: {
      hero: {
          title: "Our Blog",
          subtitle: "Insights, tips, and guides to help you grow your online store",
          badge: "Latest Insights"
      },
      categories: "Categories:",
      noPosts: "No blog posts yet. Check back soon!",
      readMore: "Read more",
      relatedPosts: {
          title: "Related ",
          span: "Posts"
      }
    },
    blogPost: {
        cta: {
             title: "Need help with your ",
             titleSpan: "e-commerce store?",
             description: "We're here to help you build and optimize your online store. Get in touch for a free consultation.",
             button: "Contact Us"
        }
    },
    blogTeaser: {
        title: "Latest Insights",
        subtitle: "Tips, trends, and growth strategies",
        readMore: "Read more",
        viewAll: "View all posts",
        posts: [
          {
            title: "How to Make Your Store Fly",
            excerpt: "Slow stores lose sales. Here are the practical steps we take to make sure your customers never have to wait.",
            href: "/blog/speed-up-shopify-store",
            date: "2024-12-01"
          },
          {
            title: "Shopify or WordPress? The Honest Answer.",
            excerpt: "Two giants. One big decision. We break down the pros and cons to help you decide which platform fits your goals.",
            href: "/blog/shopify-vs-woocommerce",
            date: "2024-11-15"
          }
        ]
    },
    about: {
        hero: {
            title: "About CartShift Studio",
            subtitle: "Technical expertise. Human connection.",
            badge: "Our Story"
        },
        story: {
            title: "Our Story",
            content: [
                "It started with a simple idea. Two friends. One obsessed with code, the other obsessed with customer experience. We joined forces to build an agency that feels different.",
                "We wanted to create a place that blends technical excellence with a human touch. Our mission is simple. To empower you to thrive online with a beautiful, high-performing website, while making the process enjoyable and collaborative.",
                "We don't believe in one size fits all. We listen first. Then we build. Your business is unique, and your website should reflect that. No cookie-cutter templates. Just custom solutions that work."
            ]
        },
        team: {
            title: "Who We Are",
            subtitle: "Meet the team behind CartShift Studio",
            expertiseLabel: "Expertise:",
            members: [
              {
                name: "Technical Lead",
                role: "Co-Founder & Developer",
                bio: "A seasoned developer with expertise in Shopify and WordPress, passionate about clean code and continuously learning the latest e-commerce technologies. Believes in building solutions that are both powerful and maintainable.",
                expertise: "Shopify, WordPress, Custom Development, Performance Optimization",
              },
              {
                name: "Customer-Facing Lead",
                role: "Co-Founder & Strategist",
                bio: "A customer-focused strategist passionate about understanding clients' stories and helping them grow. Brings experience in digital marketing and project management, ensuring every project aligns with business goals.",
                expertise: "Client Relations, Strategy, Project Management, Digital Marketing",
              },
            ]
        },
        values: {
            title: "Our Values",
            subtitle: "What drives everything we do",
            items: [
              {
                title: "Clients Are Family",
                description: "We listen actively and communicate openly. You'll always know what's happening. No jargon, no surprises. Your success is our priority.",
              },
              {
                title: "Beautiful & Functional",
                description: "Every project is crafted with care. We aim for solutions that are robust, reliable, and visually stunning.",
              },
              {
                title: "Partners For Life",
                description: "We don't consider a project done at launch. We're here to support and adjust as your business evolves.",
              },
              {
                title: "Honesty First",
                description: "If something isn't needed, we'll tell you. If something is beyond scope, we'll discuss it. Trust is everything.",
              },
            ]
        },
        expect: {
            title: "What to Expect When ",
            titleSpan: "Working With Us",
            content: [
              "Expect questions! We dive deep into your goals because we want to build the right solution. We're friendly, flexible, and engaged.",
              "We keep you in the loop. Through regular check-ins and demos, you'll always know what's happening. No black boxes here.",
              "We're in it for the long haul. Launch is just the beginning. We'll continue to support you, optimize your site, and help you grow as your business evolves."
            ]
        },
        cta: {
            title: "Let's build something ",
            titleSpan: "amazing",
            description: "If you have an idea, we want to hear it. Reach out and let's start the conversation.",
            button: "Get in Touch"
        }
    },
    shopify: {
        hero: {
            title: "Shopify Experts",
            subtitle: "Sell More. Stress Less.",
            description: "Launch or grow your store with a partner who handles the hard stuff.",
            badge: "Shopify Growth Partners"
        },
        services: {
            title: "Our Shopify Services",
            subtitle: "Comprehensive solutions for every stage of your e-commerce journey",
            items: [
                { title: "Strategy & Advice", description: "We help you pick the right plan and apps. No guessing games. Just expert advice." },
                { title: "Store Design", description: "Your brand, looking its best. We create a look that fits you perfectly, not just a generic template." },
                { title: "Custom Features", description: "Need something special? We build custom tools and features just for your store." },
                { title: "Speed & SEO", description: "Fast stores sell more. We make sure your site loads instantly and Google loves it." },
                { title: "Ongoing Support", description: "We don't just launch and leave. We're here for updates, fixes, and new ideas." },
                { title: "Store Tune-Up", description: "Already have a store? We'll find ways to make it work better and sell more." }
            ]
        },
        why: {
            title: "Why Build With ",
            titleSpan: "Us?",
            items: [
                "We Build for Sales: A pretty website is nice, but a profitable one is better. We design stores specifically to turn your visitors into happy customers.",
                "Zero Stress: We handle the code, the apps, the settings, and the confusing parts. You just get the keys to a finished, polished store.",
                "Growth Ready: We set you up for success from day one. Whether you're listing your first product or your thousandth, your store will be ready to handle it."
            ]
        },
        cta: {
            title: "Ready to start ",
            titleSpan: "selling more?",
            description: "Let's talk about your business and how we can help it grow.",
            button: "Let's Talk Shop"
        }
    },
    wordpress: {
        hero: {
            title: "WordPress Made Easy",
            subtitle: "Robust Websites. Zero Headache.",
            description: "We design and develop fast, secure websites that you can actually manage yourself.",
            badge: "Web Development Experts"
        },
        services: {
            title: "Our WordPress Services",
            subtitle: "End-to-end website development from design to deployment",
            items: [
                { title: "Custom Websites", description: "We build from scratch or redesign. Exactly what you need, looking exactly how you want it." },
                { title: "Theme Tweaks", description: "Have a theme you like? We'll customize it to match your brand perfectly." },
                { title: "Custom Features", description: "Need something unique? Forms, memberships, or languages. We build it securely." },
                { title: "WooCommerce", description: "Sell on WordPress. We set up easy-to-manage stores that convert visitors into buyers." },
                { title: "Speed & Security", description: "We make your site fast and keep it safe depending on your needs." },
                { title: "Peace of Mind", description: "We handle the backups, updates, and fixes so you don't have to." }
            ]
        },
        why: {
            title: "Websites That Work ",
            titleSpan: "For You",
            items: [
              { strong: "Design + Performance:", text: "We mix creative design with solid code. You get a site that looks great and runs fast." },
              { strong: "Total Freedom:", text: "We build sites you can manage yourself. Update text, change images, and add new pages without calling a developer." },
              { strong: "Built to be Found:", text: "We build with Google in mind. Proper structure and clean code mean your site is ready to rank from day one." },
              { strong: "Flexible & Scalable:", text: "Whether you need a simple portfolio or a complex corporate site, we build solutions that can grow with you." }
            ]
        },
        cta: {
            title: "Need a website that ",
            titleSpan: "just works?",
            description: "Beautiful, functional, and easy to manage. Let's make it happen.",
            button: "Let's Build It"
        }
    },
    ctaBanner: {
      titlePart1: "Ready to take your business to the",
      titlePart2: "next level?",
      description: "You have the vision. We have the tools to make it real. Let's build something you'll be proud to show off.",
      button: "Start the Conversation"
    },
    testimonials: {
      title: "Success Stories",
      subtitle: "Don't just take our word for it",
      items: [
        {
          quote: "CartShift Studio transformed our online store. We saw a 50% increase in conversions within 3 months! Their attention to detail was exceptional.",
          author: "Sarah Johnson",
          company: "Artisan Creations",
          rating: 5,
        },
        {
          quote: "Working with CartShift was a game-changer. They migrated our entire store seamlessly and improved our speed by 60%. Our customers noticed the difference immediately.",
          author: "Michael Chen",
          company: "TechGear Pro",
          rating: 5,
        },
        {
          quote: "The team at CartShift doesn't just build websites. They build partnerships. They've been our go-to for ongoing optimization, and our sales have grown consistently.",
          author: "Emily Rodriguez",
          company: "Boutique Fashion Co",
          rating: 5,
        },
      ]
    },
    whyChoose: {
      title: "Why Work With Us?",
      subtitle: "We're not just coders. We're your partners.",
      items: [
        {
          title: "Made Just For You",
          description: "Your business isn't generic, so your site shouldn't be either. We design everything to match your specific goals.",
          icon: "target",
        },
        {
          title: "We're In It Together",
          description: "We care about your success as much as you do. Consider us an extension of your own team.",
          icon: "handshake",
        },
        {
          title: "Tech Made Simple",
          description: "We speak the complicated tech language so you don't have to. You get a powerful site that's easy to use.",
          icon: "bolt",
        },
        {
          title: "Growth Focused",
          description: "Launching is just step one. We stay by your side to help you grow, adapt, and improve over time.",
          icon: "chart-up",
        },
      ]
    },
    servicesOverview: {
      title: "Our Core Solutions",
      subtitle: "End-to-end e-commerce expertise across two powerful platforms",
      shopify: {
        title: "E-Commerce Growth",
        description: "Everything you need to sell online. We handle the design, setup, and details so you can focus on what matters — your products.",
        features: ["Store Setup & Design", "Custom Features", "Speed Optimization", "Growth Support"],
      },
      wordpress: {
        title: "Custom Web Design",
        description: "A website as unique as your brand. We create flexible, easy-to-manage sites that help you stand out and get found.",
        features: ["Custom Design", "Easy to Edit", "Online Store Ready", "SEO Optimized"],
      }
    },
    contact: {
      hero: {
          title: "Get in Touch",
          subtitle: "Have an idea? Let's make it real.",
          description: "Tell us what you need. We'll handle the rest.",
          badge: "Let's Talk"
      },
      title: "Contact Information",
      emailLabel: "Email",
      quickResponseTitle: "We're Quick",
      quickResponseText: "We usually get back to you within 24 hours.",
      scheduleTitle: "Prefer to Schedule a Call?",
      scheduleText1: "We're happy to set up a 30-minute consultation call to discuss your project.",
      scheduleText2: "Just mention it in your message, and we'll coordinate a time that works for you.",
      form: {
        title: "Send us a message",
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        companyLabel: "Company/Website (optional)",
        companyPlaceholder: "Your company or website",
        projectTypeLabel: "How can we help?",
        selectOption: "Select an option",
        options: {
          shopify: "Shopify Store",
          wordpress: "WordPress Website",
          consultation: "General Consultation",
          other: "Other",
        },
        messageLabel: "Tell us about your project",
        messagePlaceholder: "Tell us about your project...",
        submitButton: "Send Message",
        submitting: "Submitting...",
        privacy: "We'll never share your information. It's only used to contact you about your inquiry.",
        successTitle: "Thank you!",
        successText: "We've received your message and will get back to you within 24 hours.",
        sendAnother: "Send Another Message",
      }
    },
    footer: {
      description: "Bold eCommerce solutions built for your unique vision. We design, develop, and optimize Shopify and WordPress websites that stand out and sell more.",
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
          terms: "Terms of Service"
      }
    },
    common: {
      learnMore: "Learn More",
      contactUs: "Contact Us",
      getStarted: "Get Started",
      viewWork: "View Our Work",
    }
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
        title: "קבלו שיחת ייעוץ חינם",
        subtitle: "מלאו את הטופס ונחזור אליכם תוך 24 שעות",
        successTitle: "תודה!",
        successText: "נהיה בקשר תוך 24 שעות.",
        fields: {
            name: "שם מלא",
            namePlaceholder: "השם שלך",
            nameRequired: "שם הוא שדה חובה",
            email: "אימייל",
            emailPlaceholder: "your@email.com",
            emailRequired: "אימייל הוא שדה חובה",
            emailInvalid: "כתובת אימייל לא תקינה",
            interest: "במה נוכל לעזור?",
            interestRequired: "אנא בחר אפשרות",
            selectOption: "בחר אפשרות",
            options: {
                shopify: "חנות שופיפיי",
                wordpress: "אתר וורדפרס",
                consultation: "ייעוץ כללי"
            }
        },
        submit: "בואו נדבר",
        submitting: "שולח...",
        error: "משהו השתבש. אנא נסו שוב או צרו איתנו קשר ישירות."
    },
    hero: {
      tag: "בונים חוויות דיגיטליות שנשארות",
      titleLine1: "אנחנו בונים אתרים",
      titleLine2: "שבאמת מוכרים",
      description: "תשכחו מכאבי הראש הטכנולוגיים. אנחנו מעצבים ובונים חנויות אונליין מרהיבות שלוכדות תשומת לב והופכות מבקרים ללקוחות נאמנים. פשוט, עוצמתי, ונבנה במיוחד בשבילכם.",
      primaryCta: "בואו נדבר על רעיונות",
      secondaryCta: "ראו עבודות שלנו",
      scrollIndicator: "גללו כדי לגלות",
      stats: {
        clients: {
          value: "50+",
          label: "לקוחות מרוצים"
        },
        dedication: {
            value: "100%",
            label: "מסירות"
        }
      }
    },
    blog: {
      hero: {
          title: "הבלוג שלנו",
          subtitle: "תובנות, טיפים ומדריכים שיעזרו לכם להצמיח את החנות שלכם",
          badge: "תובנות אחרונות"
      },
      categories: "קטגוריות:",
      noPosts: "אין עדיין מאמרים. חזרו בקרוב!",
      readMore: "קרא עוד",
      relatedPosts: {
          title: "מאמרים ",
          span: "נוספים"
      }
    },
    blogPost: {
        cta: {
             title: "צריכים עזרה עם ",
             titleSpan: "חנות האיקומרס שלכם?",
             description: "אנחנו כאן כדי לעזור לכם לבנות ולבצע אופטימיזציה לחנות האונליין שלכם. צרו קשר לייעוץ חינם.",
             button: "צרו קשר"
        }
    },
    blogTeaser: {
        title: "תובנות אחרונות",
        subtitle: "טיפים, מגמות ואסטרטגיות צמיחה",
        readMore: "קרא עוד",
        viewAll: "לכל המאמרים",
        posts: [
          {
            title: "איך לגרום לחנות שלכם לטוס",
            excerpt: "חנויות איטיות מפסידות מכירות. הנה הצעדים המעשיים שאנחנו נוקטים כדי להבטיח שהלקוחות שלכם לעולם לא יחכו.",
            href: "/blog/speed-up-shopify-store",
            date: "2024-12-01"
          },
          {
            title: "שופיפיי או וורדפרס? התשובה האמיתית.",
            excerpt: "שני ענקים. החלטה אחת גדולה. אנחנו מפרקים את היתרונות והחסרונות כדי לעזור לכם להחליט איזו פלטפורמה מתאימה למטרות שלכם.",
            href: "/blog/shopify-vs-woocommerce",
            date: "2024-11-15"
          }
        ]
    },
    about: {
        hero: {
            title: "אודות CartShift Studio",
            subtitle: "מומחיות טכנולוגית. חיבור אנושי.",
            badge: "הסיפור שלנו"
        },
        story: {
            title: "הסיפור שלנו",
            content: [
                "זה התחיל מרעיון פשוט. שני חברים. אחד אובססיבי לקוד, השני אובססיבי לחוויית לקוח. איחדנו כוחות כדי לבנות סוכנות שמרגישה אחרת.",
                "רצינו ליצור מקום המשלב מצוינות טכנית עם מגע אנושי. המשימה שלנו פשוטה: להעצים אתכם להצליח אונליין עם אתר יפהפה וביצועי, תוך הפיכת התהליך למהנה ומשותף.",
                "אנחנו לא מאמינים בפתרון אחד לכולם. אנחנו מקשיבים קודם. ואז בונים. העסק שלכם ייחודי, והאתר שלכם צריך לשקף זאת. ללא תבניות גנריות. פשוט פתרונות מותאמים אישית שעובדים."
            ]
        },
        team: {
            title: "מי אנחנו",
            subtitle: "הכירו את הצוות מאחורי CartShift Studio",
            expertiseLabel: "תחומי התמחות:",
            members: [
              {
                name: "מוביל טכני",
                role: "מייסד שותף ומפתח",
                bio: "מפתח מנוסה עם מומחיות בשופיפיי ובוורדפרס, נלהב מקוד נקי ומלימוד מתמיד של טכנולוגיות האיקומרס החדשות ביותר. מאמין בבניית פתרונות שהם גם עוצמתיים וגם קלים לתחזוקה.",
                expertise: "שופיפיי, וורדפרס, פיתוח Custom, אופטימיזציית ביצועים",
              },
              {
                name: "מוביל חווית לקוח",
                role: "מייסד שותף ואסטרטג",
                bio: "אסטרטג ממוקד לקוח הנלהב מהבנת סיפורי הלקוחות ועזרה להם לצמוח. מביא ניסיון בשיווק דיגיטלי וניהול פרויקטים, ומבטיח שכל פרויקט תואם את היעדים העסקיים.",
                expertise: "קשרי לקוחות, אסטרטגיה, ניהול פרויקטים, שיווק דיגיטלי",
              },
            ]
        },
        values: {
            title: "הערכים שלנו",
            subtitle: "מה שמניע את כל מה שאנחנו עושים",
            items: [
              {
                title: "לקוחות הם משפחה",
                description: "אנחנו מקשיבים ומקיימים תקשורת פתוחה. תמיד תדעו מה קורה. בלי ז'רגון מיותר, בלי הפתעות. ההצלחה שלכם היא בראש סדר העדיפויות שלנו.",
              },
              {
                title: "יפה ופונקציונלי",
                description: "כל פרויקט מעוצב בקפידה. אנחנו שואפים לפתרונות שהם חזקים, אמינים ומרהיבים ויזואלית.",
              },
              {
                title: "שותפים לדרך",
                description: "אנחנו לא רואים בפרויקט כסגור בהשקה. אנחנו כאן כדי לתמוך ולהתאים ככל שהעסק שלכם מתפתח.",
              },
              {
                title: "כנות לפני הכל",
                description: "אם משהו לא נחוץ, נגיד לכם. אם משהו הוא מעבר להיקף, נדון בזה. אמון הוא הכל.",
              },
            ]
        },
        expect: {
            title: "למה לצפות כש-",
            titleSpan: "עובדים איתנו",
            content: [
              "צפו לשאלות! אנחנו צוללים לעומק המטרות שלכם כי אנחנו רוצים לבנות את הפתרון הנכון. אנחנו חברותיים, גמישים ומעורבים.",
              "אנחנו משאירים אתכם בעניינים. באמצעות עדכונים שוטפים והדגמות, תמיד תדעו מה אנחנו בונים ולמה. אין כאן קופסאות שחורות.",
              "אנחנו כאן לטווח הארוך. ההשקה היא רק ההתחלה. נמשיך לתמוך בכם, לבצע אופטימיזציה לאתר ולעזור לכם לצמוח ככל שהעסק יגדל."
            ]
        },
        cta: {
            title: "בואו נבנה משהו ",
            titleSpan: "מדהים",
            description: "אם יש לכם רעיון, אנחנו רוצים לשמוע אותו. צרו קשר ובואו נתחיל את השיחה.",
            button: "דברו איתנו"
        }
    },
    shopify: {
        hero: {
            title: "מומחי שופיפיי",
            subtitle: "למכור יותר. עם פחות לחץ.",
            description: "להשיק או להצמיח את החנות שלכם עם שותף שלוקח על עצמו את העבודה הקשה.",
            badge: "שותפים לצמיחה בשופיפיי"
        },
        services: {
            title: "שירותי השופיפיי שלנו",
            subtitle: "פתרונות מקצה לקצה לכל שלב במסע האיקומרס שלכם",
            items: [
                { title: "אסטרטגיה וייעוץ", description: "אנחנו עוזרים לכם לבחור את התוכנית והאפליקציות הנכונות. בלי ניחושים. רק ייעוץ מומחה." },
                { title: "עיצוב חנות", description: "המותג שלכם, נראה במיטבו. אנחנו יוצרים מראה שמתאים לכם בול, לא רק תבנית גנרית." },
                { title: "פיצ'רים מותאמים אישית", description: "צריכים משהו מיוחד? אנחנו בונים כלים ופיצ'רים מותאמים אישית לחנות שלכם." },
                { title: "מהירות ו-SEO", description: "חנויות מהירות מוכרות יותר. אנחנו דואגים שהאתר ייטען מיידית וגוגל יאהב אותו." },
                { title: "תמיכה שוטפת", description: "אנחנו לא רק משיקים ועוזבים. אנחנו כאן לעדכונים, תיקונים ורעיונות חדשים." },
                { title: "שדרוג חנות", description: "כבר יש לכם חנות? נמצא דרכים לגרום לה לעבוד טוב יותר ולמכור יותר." }
            ]
        },
        why: {
            title: "למה לבנות ",
            titleSpan: "איתנו?",
            items: [
                "בונים למכירות: אתר יפה זה נחמד, אבל אתר רווחי זה מעולה. אנחנו מעצבים חנויות במיוחד כדי להפוך מבקרים ללקוחות מרוצים.",
                "אפס לחץ: אנחנו דואגים לקוד, לאפליקציות, להגדרות ולחלקים המבלבלים. אתם מקבלים מפתח לחנות גמורה ומלוטשת.",
                "מוכנים לצמיחה: אנחנו מכינים אתכם להצלחה מהיום הראשון. בין אם אתם מעלים מוצר ראשון או את האלף, החנות שלכם תהיה מוכנה לזה."
            ]
        },
        cta: {
            title: "מוכנים להתחיל ",
            titleSpan: "למכור יותר?",
            description: "בואו נדבר על העסק שלכם ואיך אנחנו יכולים לעזור לו לצמוח.",
            button: "בואו נדבר ביזנס"
        }
    },
    wordpress: {
        hero: {
            title: "וורדפרס בקלות",
            subtitle: "אתרים חזקים. אפס כאבי ראש.",
            description: "אנחנו מעצבים ומפתחים אתרים מהירים ומאובטחים שאתם באמת יכולים לנהל בעצמכם.",
            badge: "מומחי פיתוח ווב"
        },
        services: {
            title: "שירותי הוורדפרס שלנו",
            subtitle: "פיתוח אתרים מקצה לקצה משלב העיצוב ועד העלייה לאוויר",
            items: [
                { title: "אתרים מותאמים אישית", description: "אנחנו בונים מאפס או מעצבים מחדש. בדיוק מה שאתם צריכים, נראה בדיוק כמו שאתם רוצים." },
                { title: "התאמות תבנית", description: "יש לכם תבנית שאתם אוהבים? נתאים אותה בול למותג שלכם." },
                { title: "פיצ'רים מותאמים אישית", description: "צריכים משהו ייחודי? טפסים, אזורי מנויים, או שפות. אנחנו בונים את זה מאובטח." },
                { title: "WooCommerce", description: "למכור בוורדפרס. אנחנו מקימים חנויות קלות לניהול שהופכות מבקרים לקונים." },
                { title: "מהירות ואבטחה", description: "אנחנו הופכים את האתר שלכם למהיר ושומרים עליו בטוח, בהתאם לצרכים שלכם." },
                { title: "שקט נפשי", description: "אנחנו מטפלים בגיבויים, בעדכונים ובתיקונים כדי שאתם לא תצטרכו." }
            ]
        },
        why: {
            title: "אתרים שעובדים ",
            titleSpan: "בשבילכם",
            items: [
              { strong: "עיצוב + ביצועים:", text: "אנחנו משלבים עיצוב יצירתי עם קוד חזק. אתם מקבלים אתר שנראה נהדר וטס מהר." },
              { strong: "חופש מוחלט:", text: "אנחנו בונים אתרים שתוכלו לנהל בעצמכם. עדכנו טקסט, החליפו תמונות והוסיפו דפים חדשים בלי להתקשר למפתח." },
              { strong: "בנוי להימצא:", text: "אנחנו בונים עם גוגל בראש שלנו. מבנה נכון וקוד נקי אומרים שהאתר שלכם מוכן לדירוג מהיום הראשון." },
              { strong: "גמיש וסקיילבילי:", text: "בין אם אתם צריכים פורטפוליו פשוט או אתר תאגידי מורכב, אנחנו בונים פתרונות שיכולים לגדול איתכם." }
            ]
        },
        cta: {
            title: "צריכים אתר ש-",
            titleSpan: "פשוט עובד?",
            description: "יפה, פונקציונלי וקל לניהול. בואו נגרום לזה לקרות.",
            button: "בואו נבנה את זה"
        }
    },
    ctaBanner: {
      titlePart1: "מוכנים לקחת את העסק שלכם ל-",
      titlePart2: "רמה הבאה?",
      description: "לכם יש את החזון. לנו יש את הכלים להפוך אותו למציאות. בואו נבנה משהו שתהיו גאים להראות.",
      button: "התחילו את השיחה"
    },
    testimonials: {
      title: "סיפורי הצלחה",
      subtitle: "אל תסמכו רק על המילה שלנו",
      items: [
        {
          quote: "CartShift Studio שינו את החנות המקוונת שלנו מקצה לקצה. ראינו עלייה של 50% בהמרות תוך 3 חודשים! תשומת הלב שלהם לפרטים הייתה יוצאת דופן.",
          author: "שרה כהן",
          company: "Artisan Creations",
          rating: 5,
        },
        {
          quote: "העבודה עם CartShift הייתה משנת משחק. הם העבירו את כל החנות שלנו בצורה חלקה ושיפרו את המהירות ב-60%. הלקוחות שלנו שמו לב להבדל מיד.",
          author: "מיכאל לוי",
          company: "TechGear Pro",
          rating: 5,
        },
        {
          quote: "הצוות ב-CartShift לא רק בונה אתרים. הם בונים שותפויות. הם הפכו לכתובת הקבועה שלנו לאופטימיזציה שוטפת, והמכירות שלנו צמחו בעקביות.",
          author: "אמילי רודריגז",
          company: "Boutique Fashion Co",
          rating: 5,
        },
      ]
    },
    whyChoose: {
      title: "למה לעבוד איתנו?",
      subtitle: "אנחנו לא רק מתכנתים. אנחנו השותפים שלכם.",
      items: [
        {
          title: "מותאם במיוחד עבורכם",
          description: "העסק שלכם לא גנרי, ולכן גם האתר שלכם לא צריך להיות כזה. אנחנו מעצבים הכל כדי להתאים למטרות הספציפיות שלכם.",
          icon: "target",
        },
        {
          title: "אנחנו בזה ביחד",
          description: "אכפת לנו מההצלחה שלכם בדיוק כמוכם. התייחסו אלינו כהרחבה של הצוות שלכם.",
          icon: "handshake",
        },
        {
          title: "טכנולוגיה בפשטות",
          description: "אנחנו מדברים את השפה הטכנית המסובכת כדי שאתם לא תצטרכו. אתם מקבלים אתר עוצמתי שקל להשתמש בו.",
          icon: "bolt",
        },
        {
          title: "ממוקדי צמיחה",
          description: "ההשקה היא רק הצעד הראשון. אנחנו נשארים לצדכם כדי לעזור לכם לצמוח, להסתגל ולהשתפר לאורך זמן.",
          icon: "chart-up",
        },
      ]
    },
    servicesOverview: {
      title: "הפתרונות שלנו",
      subtitle: "מומחיות איקומרס מקצה לקצה בשתי פלטפורמות חזקות",
      shopify: {
        title: "צמיחה באונליין",
        description: "כל מה שצריך כדי למכור אונליין. אנחנו דואגים לעיצוב, להקמה ולכל הפרטים הקטנים, כדי שאתם תוכלו להתמקד במה שחשוב באמת — המוצרים שלכם.",
        features: ["עיצוב והקמת חנויות", "פיתוחים מותאמים אישית", "אופטימיזציית מהירות", "ליווי לצמיחה עסקית"],
      },
      wordpress: {
        title: "עיצוב אתרים בהתאמה אישית",
        description: "אתר ייחודי בדיוק כמו המותג שלכם. אנחנו יוצרים אתרים גמישים וקלים לניהול שעוזרים לכם לבלוט מעל כולם.",
        features: ["עיצוב ייחודי (Custom)", "ממשק ניהול נוח", "תשתית למסחר אונליין", "אופטימיזציה לקידום (SEO)"],
      }
    },
    contact: {
      hero: {
          title: "צרו איתנו קשר",
          subtitle: "יש לכם רעיון? בואו נהפוך אותו למציאות.",
          description: "ספרו לנו מה אתם צריכים. אנחנו נדאג לשאר.",
          badge: "בואו נדבר"
      },
      title: "פרטי התקשרות",
      emailLabel: "אימייל",
      quickResponseTitle: "אנחנו זריזים",
      quickResponseText: "בדרך כלל אנחנו חוזרים תוך 24 שעות.",
      scheduleTitle: "מעדיפים לתאם שיחה?",
      scheduleText1: "נשמח לתאם שיחת ייעוץ של 30 דקות לדיון על הפרויקט שלכם.",
      scheduleText2: "פשוט ציינו זאת בהודעה, ונתאם זמן שנוח לכם.",
      form: {
        title: "שלחו לנו הודעה",
        nameLabel: "שם מלא",
        namePlaceholder: "השם שלך",
        emailLabel: "אימייל",
        emailPlaceholder: "your@email.com",
        companyLabel: "חברה/אתר (אופציונלי)",
        companyPlaceholder: "שם החברה או כתובת האתר",
        projectTypeLabel: "איך נוכל לעזור?",
        selectOption: "בחר אפשרות",
        options: {
          shopify: "חנות שופיפיי",
          wordpress: "אתר וורדפרס",
          consultation: "ייעוץ כללי",
          other: "אחר",
        },
        messageLabel: "ספרו לנו על הפרויקט",
        messagePlaceholder: "שתפו אותנו בפרטים על הפרויקט...",
        submitButton: "שלח הודעה",
        submitting: "שולח...",
        privacy: "אנחנו לעולם לא נשתף את המידע שלכם. הוא משמש רק כדי ליצור איתכם קשר לגבי הפנייה.",
        successTitle: "תודה!",
        successText: "קיבלנו את ההודעה שלכם ונחזור אליכם תוך 24 שעות.",
        sendAnother: "שלח הודעה נוספת",
      }
    },
    footer: {
      description: "פתרונות איקומרס נועזים שנבנו עבור החזון הייחודי שלך. אנחנו מעצבים, מפתחים ומבצעים אופטימיזציה לאתרי שופיפיי ווורדפרס שבולטים ומוכרים יותר.",
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
          terms: "תנאי שימוש"
      }
    },
    common: {
      learnMore: "לפרטים נוספים",
      contactUs: "דברו איתנו",
      getStarted: "בואו נתחיל",
      viewWork: "לתיק העבודות",
    }
  }
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
