export type Language = 'en' | 'he';

export type TranslationStructure = typeof translations.en;

export const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      blog: 'Blog',
      contact: 'Contact',
      work: 'Work',
      pricing: 'Pricing',
      maintenance: 'Maintenance',
    },
    heroForm: {
      title: 'Get a Free Consultation',
      subtitle: "Share a few details about your project and we'll get back to you within 24 hours.",
      successTitle: 'Thanks!',
      successText: "We'll be in touch within 24 hours.",
      fields: {
        name: 'Name',
        namePlaceholder: 'Your name',
        nameRequired: 'Name is required',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email address',
        interest: 'What are you looking to build?',
        interestRequired: 'Please select an option',
        selectOption: 'Select an option',
        options: {
          shopify: 'Shopify Store (new or growth)',
          wordpress: 'WordPress Website (content sites, news, custom)',
          consultation: 'Not sure yet, need advice',
        },
      },
      submit: 'Request a Free Consult',
      submitting: 'Sending...',
      error: 'Something went wrong. Please try again or contact us directly.',
    },
    hero: {
      tag: 'Shopify & WordPress experts, built to convert',
      titleLine1: 'Websites & Stores',
      titleLine2: 'Built to Convert',
      description:
        'No tech drama. We design and build fast, beautiful websites that guide visitors to buy, book, or reach out. And we keep improving after launch.',
      primaryCta: 'Get a Free Consultation',
      secondaryCta: 'See Our Work',
      scrollIndicator: 'Scroll to explore',
      intro: {
        title: 'Your E-commerce Development Partner',
        paragraphs: [
          "CartShift Studio is a specialized e-commerce development agency that transforms online businesses through expert Shopify and WordPress solutions. With years of experience building high-converting stores and content-driven websites, we've helped 50+ businesses launch, optimize, and scale their online presence.",
          "Whether you're launching your first Shopify store, migrating from another platform, or need a custom WordPress website for your content business, we combine technical expertise with a deep understanding of what drives conversions and growth. Our approach is simple: we listen to your goals, build solutions that actually work, and stick around to help you improve.",
          'We specialize in Shopify development for e-commerce stores that need custom features, performance optimization, and ongoing support. For content-focused businesses, news platforms, and custom websites, we leverage WordPress to create fast, secure, and easy-to-manage sites that rank well in search engines. Every project is tailored to your unique needs, with clean code, thoughtful design, and a focus on results that matter to your business.',
        ],
      },
      stats: {
        clients: {
          value: '50+',
          label: 'Projects Delivered',
        },
        dedication: {
          value: '100%',
          label: 'Hands-on',
        },
      },
      platforms: {
        label: 'We Build On',
      },
    },
    blog: {
      hero: {
        title: 'Our Blog',
        subtitle: 'Practical insights to help you grow your online business',
        badge: 'Fresh Posts',
      },
      categories: 'Categories:',
      noPosts: 'No posts yet. Check back soon!',
      readMore: 'Read more',
      relatedPosts: {
        title: 'Related',
        span: 'Posts',
      },
    },
    blogPost: {
      cta: {
        title: 'Need help with your ',
        titleSpan: 'online store?',
        description:
          "From strategy to build to optimization, we've got you covered. Reach out for a free consultation.",
        button: 'Get in touch',
      },
      relatedServices: {
        title: 'Related Services',
        description: 'Explore our development services for Shopify and WordPress.',
        shopifyTitle: 'Learn More About Shopify Development Services',
        shopifyDescription:
          'Need help with your Shopify store? Our expert team can assist with development, optimization, and migration.',
        shopifyLink: 'Shopify Development Services',
        wordpressTitle: 'Learn More About WordPress Development Services',
        wordpressDescription:
          'Looking for WordPress development? We offer custom solutions for content sites, news platforms, and custom websites.',
        wordpressLink: 'WordPress Development Services',
        shopifyServices: 'Shopify Services',
        wordpressServices: 'WordPress Services',
      },
    },
    blogTeaser: {
      title: 'Latest Insights',
      subtitle: 'Tips, trends, and growth playbooks',
      readMore: 'Read more',
      viewAll: 'View all posts',
      posts: [
        {
          title: 'E-commerce Conversion Rate Optimization: 20 Proven Strategies That Work',
          excerpt:
            'Discover 20 proven strategies to increase your e-commerce conversion rate. Learn how to turn more visitors into customers and boost your revenue.',
          href: '/blog/ecommerce-conversion-rate-optimization',
          date: '2024-12-20',
        },
        {
          title:
            'Complete Guide to E-commerce Migration: How to Move Your Store Without Losing Sales',
          excerpt:
            'Learn how to migrate your e-commerce store safely and efficiently. Step-by-step guide to moving between platforms without losing data, SEO rankings, or sales.',
          href: '/blog/complete-guide-ecommerce-migration',
          date: '2024-12-10',
        },
        {
          title: 'Speed Up Your Shopify Store (Without Breaking Your Theme)',
          excerpt:
            'Slow sites bleed revenue. Here are the practical fixes we use to cut load times and lift conversions.',
          href: '/blog/speed-up-shopify-store',
          date: '2024-12-01',
        },
        {
          title: 'Shopify vs. WordPress: The Real Tradeoffs',
          excerpt:
            "Two great platforms, different jobs. We'll help you choose based on goals, budget, and how you plan to grow.",
          href: '/blog/shopify-vs-woocommerce',
          date: '2024-11-15',
        },
      ],
    },
    about: {
      hero: {
        title: 'About CartShift Studio',
        subtitle: 'Technical expertise. Human connection.',
        badge: 'Our Story',
      },
      story: {
        title: 'Our Story',
        content: [
          'It started with a simple idea: build sites that feel premium and perform like machines. One of us is obsessed with clean code. The other is obsessed with customer experience. Together, we bridge both worlds.',
          'We blend technical depth with a collaborative process. That means fewer surprises, faster decisions, and a launch you actually enjoy.',
          'No one-size-fits-all templates here. We listen first, then build what your business truly needs, and we keep iterating as you grow.',
        ],
      },
      team: {
        title: 'Who We Are',
        subtitle: 'Meet the team behind CartShift Studio',
        expertiseLabel: 'Expertise:',
        members: [
          {
            name: 'Yotam Faraggi',
            role: 'Co-Founder & Developer',
            bio: "I started as a frontend developer and gradually fell in love with the full stack. These days, I build Shopify stores and WordPress sites that are fast, reliable, and actually fun to maintain. I'm a bit obsessed with clean code and performance – probably because I've seen too many slow sites lose customers. When I'm not coding, I'm usually exploring new e-commerce tools or figuring out how to solve tricky technical problems that most people avoid.",
            expertise:
              'Shopify, WordPress, Custom Development, Performance Optimization, Full-Stack Development, API Integration',
          },
          {
            name: 'Danielle Shamir',
            role: 'Co-Founder & Strategist',
            bio: "I'm the person who makes sure tech talk turns into actual plans. With a background in digital marketing and project management, I love bridging the gap between what's technically possible and what makes business sense. I ask a lot of questions upfront because I've learned that understanding your goals deeply is the only way to build something that truly works for you. I'm all about clear communication, realistic expectations, and building relationships that last beyond just one project.",
            expertise:
              'Client Relations, Strategy, Project Management, Digital Marketing, E-commerce Consulting, Growth Optimization',
          },
        ],
      },
      values: {
        title: 'Our Values',
        subtitle: 'What drives everything we do',
        items: [
          {
            title: 'Clear Communication',
            description:
              "You'll always know what's happening and why. Simple language, honest recommendations, and zero surprises.",
          },
          {
            title: 'Design That Converts',
            description:
              'We sweat the details that move numbers: hierarchy, clarity, speed, and a buying journey that feels effortless.',
          },
          {
            title: 'Partners After Launch',
            description:
              "Launch isn't the finish line. We stay close for improvements, experiments, fixes, and new features.",
          },
          {
            title: 'Honesty First',
            description:
              "If you don't need something, we'll tell you. If something is out of scope, we'll plan it properly.",
          },
        ],
      },
      expect: {
        title: 'What to Expect When',
        titleSpan: 'Working With Us',
        content: [
          'Expect thoughtful questions. We dig into your goals, customers, and constraints so we can build the right thing, not just the thing you asked for.',
          "Expect visibility. You'll get check-ins, demos, and clear next steps. No black boxes.",
          "Expect momentum after launch. We'll help you optimize, iterate, and scale as your business evolves.",
        ],
      },
      cta: {
        title: "Let's build something",
        titleSpan: 'great',
        description:
          "Have an idea (or a mess of notes)? We'll help turn it into a site that sells.",
        button: 'Get in Touch',
      },
    },
    shopify: {
      hero: {
        title: 'Shopify Experts',
        subtitle: 'Sell more. Stress less.',
        description:
          'Launch, rebuild, or optimize your Shopify store with a partner who cares about conversion and performance.',
        badge: 'Shopify Growth Partners',
      },
      services: {
        title: 'Our Shopify Services',
        subtitle: 'From first build to ongoing growth',
        items: [
          {
            title: 'Strategy & Roadmap',
            description:
              'Clear priorities, the right plan, and the right apps based on your goals, not hype.',
          },
          {
            title: 'Store Design',
            description:
              'A premium look that fits your brand and makes it easy for customers to buy.',
          },
          {
            title: 'Custom Features',
            description:
              'Bundles, subscriptions, upsells, custom sections, automations. Built clean and maintainable.',
          },
          {
            title: 'Speed & SEO',
            description:
              'Faster load times, better Core Web Vitals, clean structure, and SEO fundamentals that compound.',
          },
          {
            title: 'Ongoing Support',
            description:
              'Fixes, improvements, experiments, and new features without the agency chaos.',
          },
          {
            title: 'Store Tune-Up',
            description:
              "Already live? We'll audit your store and ship the highest-impact improvements first.",
          },
        ],
      },
      why: {
        title: 'Why Build With',
        titleSpan: 'Us?',
        items: [
          'Conversion-first: We design for clarity and action, so more visitors turn into customers.',
          'Less friction: We handle the code, apps, settings, and edge cases. You get a polished store and a clean handoff.',
          "Built to scale: Whether you're launching your first product or managing a large catalog, we keep your setup fast, stable, and growth-ready.",
        ],
      },
      learnMore: {
        title: 'Learn More About Shopify',
        description:
          'Explore our comprehensive guides on Shopify development, optimization, and best practices.',
        links: [
          {
            title: 'Shopify SEO Guide',
            href: '/blog/shopify-seo-complete-guide',
          },
          {
            title: 'Speed Optimization',
            href: '/blog/speed-up-shopify-store',
          },
          {
            title: 'Platform Comparison',
            href: '/blog/shopify-vs-woocommerce',
          },
        ],
      },
      process: {
        title: 'Our Shopify Development Process',
        subtitle: 'A clear path from idea to launch',
        steps: [
          {
            title: 'Discovery & Strategy',
            description:
              'We start by understanding your business goals, target audience, and current challenges. Through detailed consultations, we identify the right Shopify apps, theme approach, and custom features needed to achieve your objectives. This phase includes competitive analysis, technical requirements gathering, and creating a roadmap that prioritizes high-impact improvements.',
          },
          {
            title: 'Design & Development',
            description:
              "Our team builds your store with a focus on conversion optimization and performance. We create custom themes or customize existing ones to match your brand, implement all necessary features, integrate payment gateways and shipping solutions, and ensure mobile responsiveness. Throughout development, you'll see regular demos and have opportunities to provide feedback.",
          },
          {
            title: 'Testing & Optimization',
            description:
              'Before launch, we conduct thorough testing across devices and browsers, optimize page load speeds, ensure SEO best practices are implemented, and test all checkout flows. We also set up analytics tracking, configure email notifications, and prepare your store for production. This phase ensures everything works flawlessly when you go live.',
          },
          {
            title: 'Launch & Support',
            description:
              'We handle the technical aspects of going live, including domain setup, SSL configuration, and final migrations. After launch, we provide training on managing your store, offer ongoing support packages for updates and improvements, and help you iterate based on real customer data and performance metrics.',
          },
        ],
      },
      cta: {
        title: 'Ready to',
        titleSpan: 'grow sales?',
        description: "Tell us where you are today and we'll map the fastest path forward.",
        button: 'Talk Shopify',
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our Shopify development services',
        items: [
          {
            question: 'What Shopify development services do you offer?',
            answer:
              'We offer comprehensive Shopify development services including store setup and configuration, custom theme development, app integration, performance optimization, migration from other platforms, ongoing maintenance and support, and SEO optimization for Shopify stores.',
          },
          {
            question: 'How long does it take to set up a Shopify store?',
            answer:
              "The timeline depends on the complexity of your requirements. A basic store setup typically takes 1-2 weeks, while a fully customized store with advanced features can take 4-8 weeks. We'll provide a detailed timeline during our initial consultation based on your specific needs.",
          },
          {
            question: 'Can you migrate my existing store to Shopify?',
            answer:
              'Yes, we specialize in e-commerce migrations. We can migrate your store from Magento, BigCommerce, or other platforms to Shopify. Our migration process includes data transfer, product migration, customer data migration, order history (if applicable), and theme customization to match your brand.',
          },
          {
            question: 'Do you provide ongoing support after the store is launched?',
            answer:
              'Absolutely. We offer ongoing support and maintenance packages to ensure your store continues to perform optimally. This includes regular updates, security monitoring, performance optimization, bug fixes, and feature additions as your business grows.',
          },
          {
            question: 'How much does Shopify development cost?',
            answer:
              "Pricing varies based on project scope and requirements. We provide custom quotes tailored to your specific needs rather than fixed packages. During our free consultation, we'll discuss your goals and provide a transparent pricing proposal that delivers maximum ROI for your investment.",
          },
          {
            question: 'Can you customize Shopify themes?',
            answer:
              'Yes, we specialize in custom Shopify theme development. We can modify existing themes or build completely custom themes from scratch to match your brand identity and business requirements. Our themes are optimized for performance, conversion, and mobile responsiveness.',
          },
          {
            question: 'Do you help with Shopify SEO?',
            answer:
              'Yes, SEO optimization is a crucial part of our Shopify development services. We optimize on-page elements, implement structured data, improve site speed, ensure mobile-friendliness, and provide content optimization strategies to help your store rank better in search engines.',
          },
          {
            question: 'What payment gateways can you integrate?',
            answer:
              "We can integrate all major payment gateways supported by Shopify, including Shopify Payments, PayPal, Stripe, Authorize.net, and many others. We'll help you choose the best payment solution for your business and handle the complete integration.",
          },
          {
            question: 'Can you build custom Shopify apps?',
            answer:
              'Yes, we develop custom Shopify apps to add unique functionality to your store. Whether you need custom checkout features, inventory management tools, or integrations with third-party services, we can build tailored solutions that meet your specific business needs.',
          },
          {
            question: 'How do I get started with your Shopify development services?',
            answer:
              "Getting started is easy! Simply contact us through our contact form or schedule a free consultation. We'll discuss your project requirements, answer any questions, and provide a detailed proposal. There's no obligation, and we're here to help you succeed.",
          },
        ],
      },
    },
    wordpress: {
      hero: {
        title: 'WordPress Made Easy',
        subtitle: 'Fast, secure websites you can manage',
        description:
          'We design and develop WordPress sites that load quickly, rank well, and stay easy to update.',
        badge: 'Web Development Experts',
      },
      services: {
        title: 'Our WordPress Services',
        subtitle: 'End-to-end development from design to deployment',
        items: [
          {
            title: 'Custom Websites',
            description:
              'From scratch or redesign. Built around your brand, your content, and your goals.',
          },
          {
            title: 'Theme Customization',
            description:
              "Love a theme? We'll tailor it properly so it looks unique and stays maintainable.",
          },
          {
            title: 'Custom Features',
            description:
              'Forms, memberships, multilingual setups, integrations. Built securely and cleanly.',
          },
          {
            title: 'Content Management',
            description:
              'Custom content management systems, news platforms, and editorial workflows tailored to your needs.',
          },
          {
            title: 'Speed & Security',
            description: 'Performance improvements plus sensible security matched to your needs.',
          },
          {
            title: 'Peace of Mind',
            description: 'We handle updates, backups, and fixes so your site stays healthy.',
          },
        ],
      },
      why: {
        title: 'Websites That Work',
        titleSpan: 'For You',
        items: [
          {
            strong: 'Design + Performance:',
            text: 'Beautiful visuals backed by solid engineering. Fast, accessible, and reliable.',
          },
          {
            strong: 'Total Freedom:',
            text: 'Update content, swap images, add pages without calling a developer.',
          },
          {
            strong: 'Built to Be Found:',
            text: 'Clean structure and best-practice foundations so your site is ready to rank.',
          },
          {
            strong: 'Flexible & Scalable:',
            text: 'From simple portfolios to complex sites, built to grow with you.',
          },
        ],
      },
      process: {
        title: 'Our WordPress Development Process',
        subtitle: 'From concept to launch, step by step',
        steps: [
          {
            title: 'Planning & Architecture',
            description:
              'We begin by understanding your content strategy, target audience, and business objectives. We design the information architecture, plan the content structure, and determine the best WordPress setup for your needs. This includes selecting appropriate themes, plugins, and custom development requirements. We create a detailed project plan with timelines and milestones.',
          },
          {
            title: 'Design & Development',
            description:
              'Our team creates custom WordPress themes tailored to your brand, or customizes existing themes to match your vision. We develop custom post types, taxonomies, and content management workflows that make it easy for your team to publish and manage content. We implement all necessary features, ensure responsive design, and optimize for performance and SEO from the ground up.',
          },
          {
            title: 'Content Migration & Setup',
            description:
              'If you have existing content, we handle the migration process carefully, preserving formatting, images, and metadata. We set up your content management system, configure user roles and permissions, and create editorial workflows. We also integrate any third-party services you need, such as email marketing platforms, analytics tools, or membership systems.',
          },
          {
            title: 'Launch & Training',
            description:
              'We handle the technical deployment, configure hosting settings, set up backups and security measures, and ensure everything is optimized for production. After launch, we provide comprehensive training on managing your WordPress site, offer documentation, and provide ongoing support packages for updates, security monitoring, and future enhancements.',
          },
        ],
      },
      cta: {
        title: 'Need a website that',
        titleSpan: 'just works?',
        description: "Beautiful, functional, and easy to manage. Let's make it happen.",
        button: "Let's Build It",
      },
      learnMore: {
        title:
          'Complete Guide to E-commerce Migration: How to Move Your Store Without Losing Sales',
        excerpt:
          'Learn how to migrate your e-commerce store safely and efficiently. Step-by-step guide to moving between platforms without losing data, SEO rankings, or sales.',
        category: 'E-commerce Strategy',
        date: '2024-12-10',
        href: '/blog/complete-guide-ecommerce-migration',
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything you need to know about our WordPress development services',
        items: [
          {
            question: 'What WordPress development services do you offer?',
            answer:
              'We offer comprehensive WordPress development services for content sites, news platforms, and custom websites. This includes custom theme development, plugin customization, performance optimization, content management setup, migration services, security hardening, and ongoing maintenance and support.',
          },
          {
            question: 'Do you build e-commerce sites with WordPress?',
            answer:
              'No, we specialize in Shopify for e-commerce stores. WordPress is ideal for content-driven sites like news platforms, blogs, corporate websites, and custom content management systems. For online stores, we recommend Shopify which offers better e-commerce features and reliability.',
          },
          {
            question: 'How long does it take to develop a WordPress site?',
            answer:
              "The timeline varies based on project complexity. A basic content site typically takes 2-3 weeks, while a fully customized site with advanced features can take 6-10 weeks. We'll provide a detailed timeline during our consultation.",
          },
          {
            question: 'Can you migrate my existing WordPress site?',
            answer:
              'Yes, we handle WordPress migrations from various hosting providers and can help optimize your site during the migration process. We ensure all content, media, and settings are safely transferred to your new hosting environment.',
          },
          {
            question: 'Do you provide WordPress hosting and maintenance?',
            answer:
              "While we don't provide hosting directly, we can recommend reliable hosting providers and handle all WordPress maintenance tasks including updates, security monitoring, backups, performance optimization, and technical support.",
          },
          {
            question: 'How much does WordPress development cost?',
            answer:
              "Pricing depends on your project requirements. We provide custom quotes based on your specific needs rather than fixed packages. During our free consultation, we'll discuss your goals and provide transparent pricing that delivers maximum value.",
          },
          {
            question: 'Can you customize WordPress themes?',
            answer:
              'Absolutely. We can modify existing WordPress themes or build completely custom themes tailored to your brand. Our themes are optimized for performance, SEO, mobile responsiveness, and user experience.',
          },
          {
            question: 'Do you help with WordPress security?',
            answer:
              'Yes, security is a top priority. We implement security best practices including SSL certificates, security plugins, regular updates, malware scanning, and secure hosting recommendations to protect your site from threats.',
          },
          {
            question: 'What types of sites are best for WordPress?',
            answer:
              'WordPress is ideal for content-driven sites including news platforms, blogs, corporate websites, portfolios, membership sites, and custom content management systems. For e-commerce stores, we recommend Shopify for better performance and e-commerce features.',
          },
          {
            question: 'How do I get started with your WordPress development services?',
            answer:
              "Getting started is simple! Contact us through our contact form or schedule a free consultation. We'll discuss your project, answer questions, and provide a detailed proposal. There's no obligation, and we're committed to your success.",
          },
        ],
      },
    },
    ctaBanner: {
      titlePart1: 'Ready to take your business to the',
      titlePart2: 'next level?',
      description:
        "Bring the vision and we'll build the engine. Clear process, clean code, measurable results.",
      button: 'Start the Conversation',
    },
    testimonials: {
      title: 'Success Stories',
      subtitle: "Don't just take our word for it",
      items: [
        {
          quote:
            'CartShift Studio rebuilt our store experience end-to-end. Conversions improved quickly, and the site finally feels premium.',
          author: 'Sarah Johnson',
          company: 'Artisan Creations',
          rating: 5,
        },
        {
          quote:
            'They handled our migration flawlessly and made the store noticeably faster. Customers felt the difference immediately.',
          author: 'Michael Chen',
          company: 'TechGear Pro',
          rating: 5,
        },
        {
          quote:
            "They don't just ship a site. They stick around, iterate, and help us grow month after month.",
          author: 'Emily Rodriguez',
          company: 'Boutique Fashion Co',
          rating: 5,
        },
      ],
    },
    whyChoose: {
      title: 'Why Work With Us?',
      subtitle: 'Not just builders. Real partners.',
      items: [
        {
          title: 'Made for Your Business',
          description:
            'No cookie-cutter templates. We design around your goals, customers, and products.',
          icon: 'target',
        },
        {
          title: 'Senior-Led Delivery',
          description:
            'You work directly with experienced specialists. Fewer handoffs, faster progress.',
          icon: 'handshake',
        },
        {
          title: 'Tech Made Simple',
          description: 'We handle the complexity and explain choices in plain language.',
          icon: 'bolt',
        },
        {
          title: 'Growth Focused',
          description: 'We build with the next step in mind: speed, SEO, analytics, and iteration.',
          icon: 'chart-up',
        },
        {
          title: 'Transparent Process',
          description:
            'Clear timelines, honest updates, and no hidden surprises. You always know where your project stands.',
          icon: 'eye',
        },
      ],
    },
    servicesOverview: {
      title: 'Our Core Solutions',
      subtitle: 'E-commerce expertise across Shopify and WordPress',
      shopify: {
        title: 'E-Commerce Growth',
        description:
          'Everything you need to sell online. We handle design, setup, and performance so you can focus on your products.',
        features: [
          'Store Setup & Design',
          'Custom Features',
          'Speed Optimization',
          'Growth Support',
        ],
      },
      wordpress: {
        title: 'Custom Web Design',
        description:
          'A website as unique as your brand. Flexible, easy to manage, and built to stand out.',
        features: ['Custom Design', 'Easy to Edit', 'Online Store Ready', 'SEO Optimized'],
      },
    },
    contact: {
      hero: {
        title: 'Get in Touch',
        subtitle: "Have a project in mind? Let's make it real.",
        description: "Tell us what you're building and we'll reply within 24 hours.",
        badge: "Let's Talk",
      },
      title: 'Contact Information',
      emailLabel: 'Email',
      quickResponseTitle: 'Quick reply',
      quickResponseText: 'We usually get back to you within 24 hours.',
      scheduleTitle: 'Want to hop on a call?',
      scheduleText1:
        'We can do a free 30-minute discovery call to discuss goals, scope, and next steps.',
      scheduleText2: "Mention it in your message, and we'll coordinate a time that works for you.",
      form: {
        title: 'Send us a message',
        nameLabel: 'Name',
        namePlaceholder: 'Your name',
        emailLabel: 'Email',
        emailPlaceholder: 'your@email.com',
        companyLabel: 'Company/Website (optional)',
        companyPlaceholder: 'Your company or website',
        projectTypeLabel: 'What do you need help with?',
        selectOption: 'Select an option',
        options: {
          shopify: 'Shopify Store',
          wordpress: 'WordPress Website',
          consultation: 'General Consultation',
          other: 'Other',
        },
        messageLabel: 'Tell us about your project',
        messagePlaceholder: 'Share a few details about your project...',
        submitButton: 'Send Message',
        submitting: 'Sending...',
        privacy: "We'll only use your information to respond to your inquiry.",
        successTitle: 'Thank you!',
        successText: "Got it! We'll reply within 24 hours.",
        sendAnother: 'Send Another Message',
      },
    },
    footer: {
      description:
        'Bold e-commerce builds for artists, makers, and brands. Shopify and WordPress websites that look great, load fast, and sell more.',
      solutions: 'Solutions',
      company: 'Company',
      rights: 'All rights reserved.',
      links: {
        shopify: 'Shopify Solutions',
        wordpress: 'WordPress Solutions',
        about: 'About Us',
        blog: 'Blog',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
    },
    common: {
      learnMore: 'Learn More',
      contactUs: 'Contact Us',
      getStarted: 'Get Started',
      viewWork: 'View Our Work',
    },
    process: {
      title: 'How We Work',
      subtitle: 'A streamlined process designed for success',
      steps: {
        discovery: {
          title: 'Discovery',
          description:
            'We learn about your business, goals, and vision to create a tailored strategy.',
        },
        design: {
          title: 'Design',
          description: 'Our designers craft stunning visuals that capture your brand identity.',
        },
        develop: {
          title: 'Develop',
          description: 'We build your store with clean code and optimized performance.',
        },
        launch: {
          title: 'Launch',
          description: 'Your store goes live with full support and ongoing optimization.',
        },
      },
    },
    stats: {
      title: 'Our Impact',
      subtitle: 'Numbers that speak for themselves',
      projects: {
        label: 'Projects Delivered',
      },
      satisfaction: {
        label: 'Client Satisfaction',
      },
      years: {
        label: 'Years Experience',
      },
      support: {
        label: 'Support Available',
      },
    },
    work: {
      hero: {
        title: 'Our Work',
        subtitle: 'Real projects. Real results.',
        description:
          "See how we've helped businesses launch, grow, and optimize their online presence.",
        badge: 'Portfolio',
      },
      filters: {
        all: 'All Projects',
        shopify: 'Shopify',
        wordpress: 'WordPress',
      },
      cta: {
        title: 'Ready to join our',
        titleSpan: 'success stories?',
        description: "Let's talk about your project and see how we can help.",
        button: 'Start Your Project',
      },
      viewProject: 'View Project',
      comingSoon: "Case studies coming soon. We're documenting our recent projects.",
    },
    pricing: {
      hero: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'No hidden fees. No surprises.',
        description: "Choose a package that fits your needs, or let's build something custom.",
        badge: 'Pricing',
      },
      packages: {
        quickLaunch: {
          name: 'Quick Launch',
          description: 'Get your Shopify store live fast with a proven foundation.',
          price: 'From $2,500',
          timeline: '1-2 weeks',
          features: [
            'Shopify store setup and configuration',
            'Theme selection and basic customization',
            'Essential app integrations',
            'Payment and shipping setup',
            'Basic SEO setup',
            'Training session',
          ],
          cta: 'Get Started',
        },
        growthUpgrade: {
          name: 'Growth Upgrade',
          description: 'Optimize your existing store for better performance and conversions.',
          price: 'From $3,500',
          timeline: '2-4 weeks',
          popular: true,
          features: [
            'Full site audit (speed, SEO, UX)',
            'Performance optimization',
            'Conversion improvements',
            'App cleanup and optimization',
            'Mobile experience tuning',
            '30 days post-launch support',
          ],
          cta: 'Upgrade Now',
        },
        customBuild: {
          name: 'Custom Build',
          description: 'A fully custom solution built around your unique needs.',
          price: 'From $8,000',
          timeline: '4-8 weeks',
          features: [
            'Custom discovery and strategy',
            'Custom theme development',
            'Advanced features and integrations',
            'Performance optimization',
            'SEO foundation',
            '60 days post-launch support',
          ],
          cta: "Let's Talk",
        },
        storeAudit: {
          name: 'Store Audit',
          description: 'A comprehensive review of your store with actionable recommendations.',
          price: '$500',
          timeline: '3-5 days',
          features: [
            '60-minute video walkthrough',
            'Speed analysis with specific fixes',
            'SEO review and recommendations',
            'Conversion opportunities',
            'Prioritized action plan',
            'Follow-up Q&A call',
          ],
          cta: 'Book an Audit',
        },
      },
      included: {
        title: "What's Always Included",
        items: [
          'Direct communication with senior developers',
          'Regular progress updates and demos',
          'Clean, documented code',
          'Post-launch support period',
          'Performance optimization',
          'Mobile-first approach',
        ],
      },
      notIncluded: {
        title: "What's Separate",
        items: [
          'Ongoing monthly support (see Maintenance Plans)',
          'Third-party app subscription costs',
          'Stock photography and copywriting',
          'Domain and hosting fees',
        ],
      },
      faq: {
        title: 'Pricing Questions',
        items: [
          {
            question: 'Do you offer payment plans?',
            answer:
              'Yes, for projects over $5,000, we typically split payments into milestones: 40% to start, 30% at design approval, and 30% at launch.',
          },
          {
            question: "What if my project doesn't fit these packages?",
            answer:
              "These are starting points. We'll scope your project properly and provide a custom quote based on your specific needs.",
          },
          {
            question: 'Are there any hidden fees?',
            answer:
              'No. We quote transparently. If something comes up during the project that changes scope, we discuss it before any additional work.',
          },
          {
            question: "What's not included in these prices?",
            answer:
              "Third-party costs like app subscriptions, themes (if purchasing one), domain registration, and ongoing hosting are separate. We'll outline everything clearly in your quote.",
          },
        ],
      },
      cta: {
        title: 'Not sure which package',
        titleSpan: 'is right for you?',
        description:
          "Book a free 30-minute call. We'll learn about your project and recommend the best path forward.",
        button: 'Book a Free Call',
      },
    },
    maintenance: {
      hero: {
        title: 'Maintenance & Support',
        subtitle: 'Keep your store running smooth',
        description:
          'Monthly plans that handle updates, monitoring, and improvements so you can focus on your business.',
        badge: 'Support Plans',
      },
      plans: {
        essential: {
          name: 'Essential Care',
          price: '$299/month',
          description: 'Basic maintenance to keep your store healthy.',
          features: [
            'Monthly health check (speed, security, uptime)',
            'Software and theme updates',
            'Monthly backup verification',
            'Basic performance monitoring',
            'Email support (48hr response)',
            '1 hour of support/fixes per month',
          ],
          cta: 'Get Essential',
        },
        growth: {
          name: 'Growth Care',
          price: '$599/month',
          popular: true,
          description: 'Proactive support for growing stores.',
          features: [
            'Everything in Essential, plus:',
            'Up to 5 hours of development/support',
            'Priority email support (24hr response)',
            'Bi-weekly check-in calls',
            'Conversion monitoring',
            'Quarterly performance review',
          ],
          cta: 'Get Growth',
        },
        premium: {
          name: 'Premium Care',
          price: '$1,199/month',
          description: 'Full-service support for high-volume stores.',
          features: [
            'Everything in Growth, plus:',
            'Up to 12 hours of development/support',
            'Same-day emergency support',
            'Weekly check-in calls',
            'A/B testing and optimization',
            'Dedicated account manager',
          ],
          cta: 'Get Premium',
        },
      },
      coverage: {
        title: "What's Covered",
        technical: {
          title: 'Technical Maintenance',
          items: [
            'Regular software/plugin updates',
            'Security monitoring and patches',
            'Backup management',
            'Uptime monitoring',
          ],
        },
        support: {
          title: 'Support & Fixes',
          items: [
            'Bug fixes and troubleshooting',
            'Content updates and changes',
            'Minor feature adjustments',
            'Third-party app support',
          ],
        },
        performance: {
          title: 'Performance',
          items: [
            'Speed monitoring',
            'Performance optimization',
            'Core Web Vitals tracking',
            'Monthly reporting',
          ],
        },
      },
      terms: {
        title: 'Terms',
        items: [
          'Month-to-month, cancel anytime with 30 days notice',
          "Hours don't roll over",
          'Additional hours billed at $150/hour',
        ],
      },
      faq: {
        title: 'Support Questions',
        items: [
          {
            question: 'What if I need more hours than my plan includes?',
            answer:
              "Additional hours are billed at $150/hour. We'll always let you know before any extra work is done.",
          },
          {
            question: 'Can I change plans?',
            answer:
              'Yes, you can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle.',
          },
          {
            question: "What's considered an emergency?",
            answer:
              'Site down, checkout broken, or security incidents. Premium plan members get same-day response for emergencies.',
          },
          {
            question: "Do you support stores you didn't build?",
            answer:
              "Yes, we take on maintenance for existing stores. We'll do an initial review to understand your setup first.",
          },
        ],
      },
      cta: {
        title: 'Need custom',
        titleSpan: 'support terms?',
        description: 'For larger stores or specific requirements, we can create a custom plan.',
        button: 'Discuss Custom Plan',
      },
    },
    stickyCta: {
      text: 'Book a Call',
      textHe: 'קבעו שיחה',
    },
  },
  he: {
    nav: {
      home: 'ראשי',
      about: 'אודות',
      services: 'שירותים',
      blog: 'בלוג',
      contact: 'צור קשר',
      work: 'עבודות',
      pricing: 'מחירים',
      maintenance: 'תחזוקה',
    },
    heroForm: {
      title: 'שיחת ייעוץ ללא עלות',
      subtitle: 'מלאו כמה פרטים על הפרויקט ונחזור אליכם תוך 24 שעות.',
      successTitle: 'תודה!',
      successText: 'נחזור אליכם תוך 24 שעות.',
      fields: {
        name: 'שם מלא',
        namePlaceholder: 'השם שלך',
        nameRequired: 'שם הוא שדה חובה',
        email: 'אימייל',
        emailPlaceholder: 'your@email.com',
        emailRequired: 'אימייל הוא שדה חובה',
        emailInvalid: 'כתובת אימייל לא תקינה',
        interest: 'מה אתם רוצים לבנות?',
        interestRequired: 'בחרו אפשרות',
        selectOption: 'בחרו אפשרות',
        options: {
          shopify: 'חנות שופיפיי (הקמה או שדרוג)',
          wordpress: 'אתר וורדפרס (תוכן, חדשות, מותאם אישית)',
          consultation: 'עדיין לא בטוחים, צריך ייעוץ',
        },
      },
      submit: 'קבלו ייעוץ חינם',
      submitting: 'שולח...',
      error: 'משהו השתבש. נסו שוב או צרו איתנו קשר ישירות.',
    },
    hero: {
      tag: 'מומחי שופיפיי ווורדפרס שמביאים תוצאות',
      titleLine1: 'אתרים וחנויות',
      titleLine2: 'שמייצרים מכירות',
      description:
        'בלי כאבי ראש טכניים. אנחנו מעצבים ובונים אתרים מהירים ויפים שמניעים מבקרים לפעולה: לקנות, להשאיר פרטים או ליצור קשר. וממשיכים לשפר גם אחרי ההשקה.',
      primaryCta: 'קבלו ייעוץ חינם',
      secondaryCta: 'לתיק העבודות',
      scrollIndicator: 'גללו למטה',
      intro: {
        title: 'השותף שלכם לפיתוח מסחר אלקטרוני',
        paragraphs: [
          'CartShift Studio היא סוכנות פיתוח מסחר אלקטרוני מתמחה שמשנה עסקים אונליין באמצעות פתרונות שופיפיי ווורדפרס מקצועיים. עם שנים של ניסיון בבניית חנויות ממירות ואתרי תוכן, עזרנו למאות עסקים להשיק, לייעל ולשדרג את הנוכחות הדיגיטלית שלהם.',
          'בין אם אתם משיקים את חנות השופיפיי הראשונה, עוברים מפלטפורמה אחרת, או צריכים אתר וורדפרס מותאם אישית, אנחנו משלבים מומחיות טכנית עם הבנה עמוקה של מה מניע המרות וצמיחה. הגישה שלנו פשוטה: אנחנו מקשיבים למטרות שלכם, בונים פתרונות שעובדים, ונשארים כדי לעזור לכם להשתפר.',
          'אנחנו מתמחים בפיתוח שופיפיי לחנויות שצריכות פיצ׳רים מותאמים, אופטימיזציית ביצועים ותמיכה שוטפת. לעסקים ממוקדי תוכן, פלטפורמות חדשות ואתרים מותאמים אישית, אנחנו מנצלים את וורדפרס ליצירת אתרים מהירים, מאובטחים וקלים לניהול שמדורגים טוב בגוגל. כל פרויקט מותאם לצרכים שלכם, עם קוד נקי, עיצוב מחושב ומיקוד בתוצאות שחשובות לעסק.',
        ],
      },
      stats: {
        clients: {
          value: '50+',
          label: 'פרויקטים שהושקו',
        },
        dedication: {
          value: '100%',
          label: 'ליווי צמוד',
        },
      },
      platforms: {
        label: 'הפלטפורמות שלנו',
      },
    },
    blog: {
      hero: {
        title: 'הבלוג שלנו',
        subtitle: 'תובנות מעשיות שיעזרו לכם לצמוח באונליין',
        badge: 'מאמרים חדשים',
      },
      categories: 'קטגוריות:',
      noPosts: 'אין עדיין מאמרים. חזרו בקרוב!',
      readMore: 'קראו עוד',
      relatedPosts: {
        title: 'מאמרים',
        span: 'קשורים',
      },
    },
    blogPost: {
      cta: {
        title: 'צריכים עזרה עם ',
        titleSpan: 'החנות שלכם?',
        description: 'מאסטרטגיה דרך פיתוח ועד אופטימיזציה, אנחנו כאן. דברו איתנו לייעוץ חינם.',
        button: 'דברו איתנו',
      },
      relatedServices: {
        title: 'שירותים קשורים',
        description: 'גלו את שירותי הפיתוח שלנו לשופיפיי ולוורדפרס.',
        shopifyTitle: 'שירותי פיתוח שופיפיי',
        shopifyDescription:
          'צריכים עזרה עם חנות השופיפיי? הצוות המומחה שלנו יכול לסייע בפיתוח, אופטימיזציה והעברה.',
        shopifyLink: 'שירותי פיתוח שופיפיי',
        wordpressTitle: 'שירותי פיתוח וורדפרס',
        wordpressDescription:
          'מחפשים פיתוח וורדפרס? אנחנו מציעים פתרונות מותאמים לאתרי תוכן, פלטפורמות חדשות ואתרים ייחודיים.',
        wordpressLink: 'שירותי פיתוח וורדפרס',
        shopifyServices: 'שירותי שופיפיי',
        wordpressServices: 'שירותי וורדפרס',
      },
    },
    blogTeaser: {
      title: 'תובנות אחרונות',
      subtitle: 'טיפים, מגמות ומדריכי צמיחה',
      readMore: 'קראו עוד',
      viewAll: 'לכל המאמרים',
      posts: [
        {
          title: 'אופטימיזציה לשיעור המרה באיקומרס: 20 אסטרטגיות שעובדות',
          excerpt:
            'גלו 20 אסטרטגיות מוכחות להגדלת שיעור ההמרה בחנות האיקומרס שלכם. למדו איך להפוך יותר מבקרים ללקוחות ולהגדיל את ההכנסות.',
          href: '/blog/ecommerce-conversion-rate-optimization',
          date: '2024-12-20',
        },
        {
          title: 'המדריך השלם למיגרציית איקומרס: איך להעביר את החנות מבלי לאבד מכירות',
          excerpt:
            'למדו איך להעביר את חנות האיקומרס שלכם בצורה בטוחה ויעילה. מדריך צעד-אחר-צעד למעבר בין פלטפורמות מבלי לאבד נתונים, דירוגי SEO או מכירות.',
          href: '/blog/complete-guide-ecommerce-migration',
          date: '2024-12-10',
        },
        {
          title: 'איך להאיץ את חנות השופיפיי (בלי לשבור את התבנית)',
          excerpt:
            'חנות איטית פוגעת במכירות. הנה השיפורים המעשיים שאנחנו עושים כדי לקצר זמני טעינה ולהעלות המרות.',
          href: '/blog/speed-up-shopify-store',
          date: '2024-12-01',
        },
        {
          title: 'שופיפיי או וורדפרס: מה באמת מתאים לכם?',
          excerpt:
            'שתי פלטפורמות מעולות לשימושים שונים. נעזור לכם לבחור לפי מטרות, תקציב ותוכניות הצמיחה.',
          href: '/blog/shopify-vs-woocommerce',
          date: '2024-11-15',
        },
      ],
    },
    about: {
      hero: {
        title: 'אודות CartShift Studio',
        subtitle: 'מומחיות טכנולוגית. חיבור אנושי.',
        badge: 'הסיפור שלנו',
      },
      story: {
        title: 'הסיפור שלנו',
        content: [
          'זה התחיל מרעיון פשוט: לבנות אתרים שנראים פרימיום ומתפקדים כמו מכונה משומנת. אחד מאיתנו אובססיבי לקוד נקי. השני אובססיבי לחוויית לקוח. ביחד אנחנו מחברים את שני העולמות.',
          'אנחנו משלבים עומק טכני עם תהליך עבודה שיתופי. התוצאה: פחות הפתעות, החלטות מהירות יותר, והשקה שכיף לעבור.',
          'אין אצלנו תבניות ״אחד מתאים לכולם״. קודם מקשיבים, אחר כך בונים את מה שהעסק באמת צריך, וממשיכים לשפר ככל שאתם גדלים.',
        ],
      },
      team: {
        title: 'מי אנחנו',
        subtitle: 'הכירו את הצוות מאחורי CartShift Studio',
        expertiseLabel: 'תחומי התמחות:',
        members: [
          {
            name: "יותם פרג'י",
            role: 'שותף מייסד ומפתח',
            bio: 'התחלתי כמפתח פרונטאנד והתאהבתי בפול-סטאק. היום אני בונה חנויות שופיפיי ואתרי וורדפרס מהירים, אמינים וממש כיף לתחזק. קצת אובססיבי לגבי קוד נקי וביצועים – כנראה כי ראיתי יותר מדי אתרים איטיים שמאבדים לקוחות. כשאני לא מקודד, בדרך כלל אני חוקר כלים חדשים או מנסה לפתור בעיות טכניות מסובכות שרוב האנשים נמנעים מהן.',
            expertise:
              'שופיפיי, וורדפרס, פיתוח מותאם, אופטימיזציית ביצועים, פיתוח Full-Stack, אינטגרציית API',
          },
          {
            name: 'דניאל שמיר',
            role: 'שותפה מייסדת ואסטרטגית',
            bio: 'אני האדם שדואג שדיבורים טכניים יהפכו לתוכניות אמיתיות. עם רקע בשיווק דיגיטלי וניהול פרויקטים, אני אוהבת לגשר בין מה שאפשר טכנית למה שהגיוני עסקית. אני שואלת הרבה שאלות בהתחלה כי למדתי שהבנה עמוקה של המטרות שלכם היא הדרך היחידה לבנות משהו שבאמת עובד. אני כל הזמן על תקשורת ברורה, ציפיות ריאליסטיות, ובניית קשרים שנמשכים מעבר לפרויקט אחד.',
            expertise:
              'קשרי לקוחות, אסטרטגיה, ניהול פרויקטים, שיווק דיגיטלי, ייעוץ מסחר אלקטרוני, אופטימיזציית צמיחה',
          },
        ],
      },
      values: {
        title: 'הערכים שלנו',
        subtitle: 'מה שמניע אותנו בכל מה שאנחנו עושים',
        items: [
          {
            title: 'תקשורת ברורה',
            description: 'תמיד תדעו מה קורה ולמה. שפה פשוטה, המלצות כנות, ואפס הפתעות.',
          },
          {
            title: 'עיצוב שממיר',
            description:
              'אנחנו יורדים לפרטים שמזיזים מספרים: היררכיה, בהירות, מהירות, ומסע קנייה חלק.',
          },
          {
            title: 'שותפים גם אחרי ההשקה',
            description:
              'השקה זה לא קו הסיום. נשארים קרובים לשיפורים, ניסויים, תיקונים ופיצ׳רים חדשים.',
          },
          {
            title: 'כנות לפני הכול',
            description: 'אם משהו לא נחוץ, נגיד. אם משהו מעבר להיקף, נתכנן נכון ובשקיפות.',
          },
        ],
      },
      expect: {
        title: 'למה לצפות כש',
        titleSpan: 'עובדים איתנו',
        content: [
          'צפו לשאלות חכמות. אנחנו צוללים למטרות, לקהל ולמגבלות כדי לבנות את הדבר הנכון, לא רק את מה שביקשתם.',
          'צפו לשקיפות מלאה. תקבלו עדכונים, דמואים ושלבים ברורים. בלי קופסאות שחורות.',
          'צפו למומנטום אחרי ההשקה. נעזור לכם לבצע אופטימיזציה, לשפר ולצמוח ככל שהעסק מתפתח.',
        ],
      },
      cta: {
        title: 'בואו נבנה משהו',
        titleSpan: 'יוצא מן הכלל',
        description: 'יש לכם רעיון (או ערימה של הערות)? נעזור להפוך את זה לאתר שמוכר.',
        button: 'דברו איתנו',
      },
    },
    shopify: {
      hero: {
        title: 'מומחי שופיפיי',
        subtitle: 'למכור יותר. בפחות מאמץ.',
        description:
          'להשיק, לשדרג או לבצע אופטימיזציה לחנות שופיפיי עם שותף שממוקד בהמרות וביצועים.',
        badge: 'שותפים לצמיחה בשופיפיי',
      },
      services: {
        title: 'שירותי השופיפיי שלנו',
        subtitle: 'מהקמה ראשונית ועד צמיחה שוטפת',
        items: [
          {
            title: 'אסטרטגיה ותוכנית עבודה',
            description:
              'סדר עדיפויות ברור, תוכנית נכונה ואפליקציות מתאימות לפי המטרות שלכם, לא לפי הייפ.',
          },
          {
            title: 'עיצוב חנות',
            description: 'מראה פרימיום שמתאים למותג ומקל על הלקוחות לקנות.',
          },
          {
            title: 'פיצ׳רים מותאמים',
            description:
              'באנדלים, מנויים, אפסיילים, סקשנים מותאמים, אוטומציות. קוד נקי שמחזיק לאורך זמן.',
          },
          {
            title: 'מהירות ו-SEO',
            description:
              'טעינה מהירה יותר, Core Web Vitals טובים יותר, מבנה נקי ותשתית SEO שמצטברת.',
          },
          {
            title: 'תמיכה שוטפת',
            description: 'תיקונים, שיפורים, ניסויים ופיצ׳רים חדשים בלי הכאוס של סוכנויות גדולות.',
          },
          {
            title: 'שדרוג חנות',
            description: 'כבר באוויר? נבצע אודיט ונעדיף את השיפורים עם ההשפעה הגבוהה ביותר.',
          },
        ],
      },
      why: {
        title: 'למה לבנות',
        titleSpan: 'איתנו?',
        items: [
          'ממוקד המרות: אנחנו מעצבים לבהירות ולפעולה, כך שיותר מבקרים הופכים ללקוחות.',
          'פחות חיכוכים: אנחנו מטפלים בקוד, באפליקציות ובהגדרות. אתם מקבלים חנות מלוטשת והעברה מסודרת.',
          'בנוי לגדילה: מהשקת המוצר הראשון ועד לקטלוג גדול, אנחנו שומרים על מהירות, יציבות ומוכנות לצמיחה.',
        ],
      },
      learnMore: {
        title: 'למדו עוד על שופיפיי',
        description:
          'גלו את המדריכים המקיפים שלנו על פיתוח שופיפיי, אופטימיזציה ושיטות עבודה מומלצות.',
        links: [
          {
            title: 'מדריך SEO לשופיפיי',
            href: '/blog/shopify-seo-complete-guide',
          },
          {
            title: 'אופטימיזציית מהירות',
            href: '/blog/speed-up-shopify-store',
          },
          {
            title: 'השוואת פלטפורמות',
            href: '/blog/shopify-vs-woocommerce',
          },
        ],
      },
      process: {
        title: 'תהליך פיתוח השופיפיי שלנו',
        subtitle: 'דרך ברורה מרעיון להשקה',
        steps: [
          {
            title: 'גילוי ואסטרטגיה',
            description:
              'מתחילים בהבנת יעדי העסק, קהל היעד והאתגרים הנוכחיים. דרך ייעוצים מפורטים מזהים את אפליקציות השופיפיי הנכונות, גישת התבנית והפיצ׳רים המותאמים להשגת המטרות. שלב זה כולל ניתוח תחרותי, איסוף דרישות טכניות, ויצירת תוכנית עבודה שמעדיפה שיפורים בעלי השפעה גבוהה.',
          },
          {
            title: 'עיצוב ופיתוח',
            description:
              'הצוות בונה את החנות עם מיקוד באופטימיזציית המרות וביצועים. יוצרים תבניות מותאמות או מתאימים קיימות למותג, מיישמים את כל הפיצ׳רים הנדרשים, משלבים שערי תשלום ופתרונות משלוחים, ומוודאים התאמה למובייל. לאורך הפיתוח תראו דמואים קבועים ותוכלו לספק משוב.',
          },
          {
            title: 'בדיקה ואופטימיזציה',
            description:
              'לפני ההשקה מבצעים בדיקות יסודיות במכשירים ודפדפנים שונים, מייעלים מהירויות טעינה, מוודאים יישום שיטות SEO, ובודקים את כל זרימות התשלום. גם מגדירים מעקב אנליטיקה, התראות אימייל, ומכינים את החנות לייצור. שלב זה מבטיח שהכול עובד חלק כשעולים לאוויר.',
          },
          {
            title: 'השקה ותמיכה',
            description:
              'מטפלים בהיבטים הטכניים של העלייה לאוויר: הגדרת דומיין, תצורת SSL, והעברות סופיות. אחרי ההשקה מספקים הדרכה על ניהול החנות, מציעים חבילות תמיכה שוטפות לעדכונים ושיפורים, ועוזרים לשפר בהתבסס על נתוני לקוחות אמיתיים ומדדי ביצועים.',
          },
        ],
      },
      cta: {
        title: 'מוכנים',
        titleSpan: 'לצמוח?',
        description: 'ספרו לנו איפה אתם היום ונמפה את הדרך הכי מהירה קדימה.',
        button: 'בואו נדבר שופיפיי',
      },
      faq: {
        title: 'שאלות נפוצות',
        subtitle: 'כל מה שצריך לדעת על שירותי פיתוח השופיפיי שלנו',
        items: [
          {
            question: 'אילו שירותי פיתוח שופיפיי אתם מציעים?',
            answer:
              'אנחנו מציעים שירותי פיתוח שופיפיי מקיפים: הקמה והגדרת חנות, פיתוח תבניות מותאמות, אינטגרציה של אפליקציות, אופטימיזציית ביצועים, העברה מפלטפורמות אחרות, תחזוקה ותמיכה שוטפת, ואופטימיזציית SEO לחנויות שופיפיי.',
          },
          {
            question: 'כמה זמן לוקח להקים חנות שופיפיי?',
            answer:
              'הזמן תלוי במורכבות הדרישות. הקמה בסיסית לוקחת בדרך כלל 1-2 שבועות, בעוד חנות מותאמת עם פיצ׳רים מתקדמים יכולה לקחת 4-8 שבועות. נספק לוח זמנים מפורט בייעוץ הראשוני בהתאם לצרכים הספציפיים.',
          },
          {
            question: 'אפשר להעביר את החנות הקיימת שלי לשופיפיי?',
            answer:
              'כן, אנחנו מתמחים בהעברות מסחר אלקטרוני. אנחנו יכולים להעביר מ-Magento, BigCommerce או פלטפורמות אחרות לשופיפיי. תהליך ההעברה כולל העברת נתונים, מוצרים, נתוני לקוחות, היסטוריית הזמנות (אם רלוונטי), והתאמת תבנית למותג.',
          },
          {
            question: 'אתם מספקים תמיכה שוטפת אחרי שהחנות עולה לאוויר?',
            answer:
              'בהחלט. אנחנו מציעים חבילות תמיכה ותחזוקה כדי להבטיח שהחנות ממשיכה לבצע בצורה אופטימלית. זה כולל עדכונים שוטפים, ניטור אבטחה, אופטימיזציית ביצועים, תיקוני באגים והוספת פיצ׳רים ככל שהעסק גדל.',
          },
          {
            question: 'כמה עולה פיתוח שופיפיי?',
            answer:
              'המחיר משתנה בהתאם להיקף הפרויקט והדרישות. אנחנו מספקים הצעות מחיר מותאמות לצרכים הספציפיים ולא חבילות קבועות. בייעוץ החינמי נדון במטרות ונספק הצעת מחיר שקופה שמביאה ROI מקסימלי להשקעה.',
          },
          {
            question: 'אפשר להתאים תבניות שופיפיי?',
            answer:
              'כן, אנחנו מתמחים בפיתוח תבניות שופיפיי מותאמות. אפשר לשנות תבניות קיימות או לבנות מאפס כדי להתאים לזהות המותג והדרישות העסקיות. התבניות שלנו מותאמות לביצועים, המרות ורספונסיביות למובייל.',
          },
          {
            question: 'אתם עוזרים עם SEO לשופיפיי?',
            answer:
              'כן, אופטימיזציית SEO היא חלק קריטי מהשירותים שלנו. אנחנו מבצעים אופטימיזציה של אלמנטים בדף, מיישמים נתונים מובנים, משפרים מהירות אתר, מוודאים התאמה למובייל, ומספקים אסטרטגיות אופטימיזציית תוכן לדירוג טוב יותר בגוגל.',
          },
          {
            question: 'אילו שערי תשלום אפשר לשלב?',
            answer:
              'אנחנו יכולים לשלב את כל שערי התשלום העיקריים הנתמכים בשופיפיי: Shopify Payments, PayPal, Stripe, Authorize.net ועוד. נעזור לבחור את פתרון התשלום הטוב ביותר ונטפל באינטגרציה המלאה.',
          },
          {
            question: 'אפשר לבנות אפליקציות שופיפיי מותאמות?',
            answer:
              'כן, אנחנו מפתחים אפליקציות שופיפיי מותאמות להוספת פונקציונליות ייחודית. בין אם צריך פיצ׳רי checkout מותאמים, כלי ניהול מלאי, או אינטגרציות עם שירותי צד שלישי, אנחנו בונים פתרונות שעונים על הצרכים העסקיים הספציפיים.',
          },
          {
            question: 'איך מתחילים עם שירותי פיתוח השופיפיי?',
            answer:
              'להתחיל זה קל! פשוט צרו קשר דרך הטופס או קבעו ייעוץ חינמי. נדון בדרישות הפרויקט, נענה על כל שאלה, ונספק הצעה מפורטת. אין התחייבות ואנחנו כאן לעזור לכם להצליח.',
          },
        ],
      },
    },
    wordpress: {
      hero: {
        title: 'וורדפרס בקלות',
        subtitle: 'אתרים מהירים, מאובטחים וקלים לניהול',
        description:
          'אנחנו מעצבים ומפתחים אתרי וורדפרס שנטענים מהר, מדורגים טוב בגוגל, ונשארים קלים לעדכון.',
        badge: 'מומחי פיתוח אתרים',
      },
      services: {
        title: 'שירותי הוורדפרס שלנו',
        subtitle: 'פיתוח מקצה לקצה, מעיצוב ועד עלייה לאוויר',
        items: [
          {
            title: 'אתרים מותאמים אישית',
            description: 'מאפס או רידיזיין. בנוי סביב המותג, התוכן והמטרות שלכם.',
          },
          {
            title: 'התאמות תבנית',
            description:
              'אוהבים תבנית מסוימת? נתאים אותה נכון כדי שתיראה ייחודית ותישאר קלה לתחזוקה.',
          },
          {
            title: 'פיצ׳רים מותאמים',
            description: 'טפסים, אזורי מנויים, רב-לשוניות, אינטגרציות. בנוי בצורה מאובטחת ונקייה.',
          },
          {
            title: 'ניהול תוכן',
            description:
              'מערכות ניהול תוכן מותאמות, פלטפורמות חדשות, ותהליכי עריכה המותאמים לצרכים שלכם.',
          },
          {
            title: 'מהירות ואבטחה',
            description: 'שיפורי ביצועים ואבטחה הגיונית לפי הצרכים שלכם.',
          },
          {
            title: 'שקט נפשי',
            description: 'אנחנו מטפלים בעדכונים, גיבויים ותיקונים כדי שהאתר יישאר בריא.',
          },
        ],
      },
      why: {
        title: 'אתרים שעובדים',
        titleSpan: 'בשבילכם',
        items: [
          {
            strong: 'עיצוב + ביצועים:',
            text: 'ויזואל יפה עם הנדסה חזקה. מהיר, נגיש ואמין.',
          },
          {
            strong: 'חופש מוחלט:',
            text: 'עדכנו תוכן, החליפו תמונות, הוסיפו דפים בלי להרים טלפון למפתח.',
          },
          {
            strong: 'בנוי להימצא:',
            text: 'מבנה נקי ותשתית נכונה כדי שהאתר יהיה מוכן לדירוג בגוגל.',
          },
          {
            strong: 'גמיש וסקיילבילי:',
            text: 'מפורטפוליו פשוט ועד אתרים מורכבים, בנוי לגדול איתכם.',
          },
        ],
      },
      process: {
        title: 'תהליך פיתוח הוורדפרס שלנו',
        subtitle: 'מרעיון להשקה, צעד אחר צעד',
        steps: [
          {
            title: 'תכנון וארכיטקטורה',
            description:
              'מתחילים בהבנת אסטרטגיית התוכן, קהל היעד ויעדי העסק. מעצבים את ארכיטקטורת המידע, מתכננים את מבנה התוכן, וקובעים את הגדרת הוורדפרס הטובה ביותר. זה כולל בחירת תבניות, תוספים ודרישות פיתוח מותאמות. יוצרים תוכנית פרויקט מפורטת עם לוחות זמנים ואבני דרך.',
          },
          {
            title: 'עיצוב ופיתוח',
            description:
              'הצוות יוצר תבניות וורדפרס מותאמות למותג, או מתאים קיימות לחזון שלכם. מפתחים סוגי פוסטים מותאמים, טקסונומיות, וזרימות ניהול תוכן שמקלות על הצוות לפרסם ולנהל תוכן. מיישמים את כל הפיצ׳רים הנדרשים, מוודאים עיצוב רספונסיבי, ומייעלים לביצועים ו-SEO מהיסוד.',
          },
          {
            title: 'העברת תוכן והגדרה',
            description:
              'אם יש תוכן קיים, מטפלים בהעברה בזהירות ושומרים על עיצוב, תמונות ומטא-דאטה. מגדירים את מערכת ניהול התוכן, תפקידי משתמשים והרשאות, ויוצרים זרימות עריכה. גם משלבים שירותי צד שלישי שצריך: פלטפורמות שיווק אימייל, כלי אנליטיקה, או מערכות מנויים.',
          },
          {
            title: 'השקה והדרכה',
            description:
              'מטפלים בפריסה הטכנית, מגדירים הגדרות אירוח, גיבויים ואמצעי אבטחה, ומוודאים שהכול מיועל לייצור. אחרי ההשקה מספקים הדרכה מקיפה על ניהול אתר הוורדפרס, תיעוד, וחבילות תמיכה שוטפות לעדכונים, ניטור אבטחה ושיפורים עתידיים.',
          },
        ],
      },
      cta: {
        title: 'צריכים אתר ש',
        titleSpan: 'פשוט עובד?',
        description: 'יפה, פונקציונלי וקל לניהול. בואו נגרום לזה לקרות.',
        button: 'בואו נבנה את זה',
      },
      learnMore: {
        title: 'המדריך השלם להעברת חנות אונליין: איך לעבור בלי לאבד מכירות',
        excerpt:
          'למדו איך להעביר את החנות בצורה בטוחה ויעילה. מדריך צעד-אחר-צעד למעבר בין פלטפורמות בלי לאבד נתונים, דירוגי SEO או מכירות.',
        category: 'אסטרטגיית איקומרס',
        date: '2024-12-10',
        href: '/blog/complete-guide-ecommerce-migration',
      },
      faq: {
        title: 'שאלות נפוצות',
        subtitle: 'כל מה שצריך לדעת על שירותי פיתוח הוורדפרס שלנו',
        items: [
          {
            question: 'אילו שירותי פיתוח וורדפרס אתם מציעים?',
            answer:
              'אנחנו מציעים שירותי פיתוח וורדפרס מקיפים לאתרי תוכן, פלטפורמות חדשות ואתרים מותאמים אישית: פיתוח תבניות מותאמות, התאמת תוספים, אופטימיזציית ביצועים, הקמת מערכות ניהול תוכן, שירותי העברה, אבטחת אתרים, ותחזוקה ותמיכה שוטפת.',
          },
          {
            question: 'אתם בונים אתרי מסחר אלקטרוני עם וורדפרס?',
            answer:
              'לא, אנחנו מתמחים בשופיפיי לחנויות מסחר אלקטרוני. וורדפרס אידיאלית לאתרי תוכן: פלטפורמות חדשות, בלוגים, אתרי תאגידים ומערכות ניהול תוכן מותאמות. לחנויות אונליין ממליצים על שופיפיי שמציעה פיצ׳רים טובים יותר למסחר אלקטרוני ואמינות.',
          },
          {
            question: 'כמה זמן לוקח לפתח אתר וורדפרס?',
            answer:
              'הזמן משתנה לפי מורכבות הפרויקט. אתר תוכן בסיסי לוקח בדרך כלל 2-3 שבועות, בעוד אתר מותאם עם פיצ׳רים מתקדמים יכול לקחת 6-10 שבועות. נספק לוח זמנים מפורט בייעוץ.',
          },
          {
            question: 'אפשר להעביר את האתר הקיים לוורדפרס?',
            answer:
              'כן, אנחנו מטפלים בהעברות וורדפרס מספקי אחסון שונים ויכולים לעזור באופטימיזציה של האתר במהלך ההעברה. מבטיחים שכל התוכן, המדיה וההגדרות מועברים בבטחה לסביבה החדשה.',
          },
          {
            question: 'אתם מספקים אחסון ותחזוקה לוורדפרס?',
            answer:
              'אנחנו לא מספקים אחסון ישירות, אבל יכולים להמליץ על ספקים אמינים ולטפל בכל משימות התחזוקה: עדכונים, ניטור אבטחה, גיבויים, אופטימיזציית ביצועים ותמיכה טכנית.',
          },
          {
            question: 'כמה עולה פיתוח וורדפרס?',
            answer:
              'המחיר תלוי בדרישות הפרויקט. אנחנו מספקים הצעות מחיר מותאמות לצרכים הספציפיים ולא חבילות קבועות. בייעוץ החינמי נדון במטרות ונספק מחיר שקוף שמביא ערך מקסימלי.',
          },
          {
            question: 'אפשר להתאים תבניות וורדפרס?',
            answer:
              'בהחלט. אפשר לשנות תבניות קיימות או לבנות מותאמות לחלוטין למותג. התבניות שלנו מותאמות לביצועים, SEO, רספונסיביות למובייל וחוויית משתמש.',
          },
          {
            question: 'אתם עוזרים עם אבטחת וורדפרס?',
            answer:
              'כן, אבטחה היא עדיפות עליונה. מיישמים שיטות עבודה מומלצות: תעודות SSL, תוספי אבטחה, עדכונים שוטפים, סריקת תוכנות זדוניות והמלצות אחסון מאובטח להגנה מפני איומים.',
          },
          {
            question: 'אילו סוגי אתרים הכי מתאימים לוורדפרס?',
            answer:
              'וורדפרס אידיאלית לאתרי תוכן: פלטפורמות חדשות, בלוגים, אתרי תאגידים, פורטפוליו, אתרי מנויים ומערכות ניהול תוכן מותאמות. לחנויות מסחר אלקטרוני ממליצים על שופיפיי לביצועים ופיצ׳רים טובים יותר.',
          },
          {
            question: 'איך מתחילים עם שירותי פיתוח הוורדפרס?',
            answer:
              'להתחיל זה פשוט! צרו קשר דרך הטופס או קבעו ייעוץ חינמי. נדון בפרויקט, נענה על שאלות, ונספק הצעה מפורטת. אין התחייבות ואנחנו מחויבים להצלחה שלכם.',
          },
        ],
      },
    },
    ctaBanner: {
      titlePart1: 'מוכנים לקחת את העסק',
      titlePart2: 'לרמה הבאה?',
      description: 'אתם מביאים את החזון ואנחנו בונים את המנוע. תהליך ברור, קוד נקי, תוצאות מדידות.',
      button: 'התחילו שיחה',
    },
    testimonials: {
      title: 'סיפורי הצלחה',
      subtitle: 'לקוחות מספרים',
      items: [
        {
          quote:
            'CartShift Studio שדרגו לנו את חוויית החנות מקצה לקצה. ההמרות השתפרו מהר והאתר סוף סוף מרגיש פרימיום.',
          author: 'שרה כהן',
          company: 'Artisan Creations',
          rating: 5,
        },
        {
          quote:
            'הם העבירו לנו את החנות בצורה חלקה והפכו אותה למהירה משמעותית. הלקוחות הרגישו את ההבדל מיד.',
          author: 'מיכאל לוי',
          company: 'TechGear Pro',
          rating: 5,
        },
        {
          quote: 'הם לא רק משיקים אתר. הם נשארים, משפרים ועוזרים לנו לצמוח חודש אחרי חודש.',
          author: 'אמילי רודריגז',
          company: 'Boutique Fashion Co',
          rating: 5,
        },
      ],
    },
    whyChoose: {
      title: 'למה לעבוד איתנו?',
      subtitle: 'לא רק בונים. שותפים אמיתיים.',
      items: [
        {
          title: 'מותאם לעסק שלכם',
          description: 'בלי תבניות גנריות. מעצבים סביב המטרות, הלקוחות והמוצרים שלכם.',
          icon: 'target',
        },
        {
          title: 'ליווי של בכירים',
          description: 'עובדים ישירות עם מומחים מנוסים. פחות העברות, יותר התקדמות.',
          icon: 'handshake',
        },
        {
          title: 'טכנולוגיה בפשטות',
          description: 'אנחנו מתמודדים עם המורכבות ומסבירים החלטות בשפה ברורה.',
          icon: 'bolt',
        },
        {
          title: 'ממוקדי צמיחה',
          description: 'בונים עם הצעד הבא בראש: מהירות, SEO, אנליטיקס ושיפור מתמיד.',
          icon: 'chart-up',
        },
        {
          title: 'תהליך שקוף',
          description: 'לוח זמנים ברור, עדכונים כנים ובלי הפתעות. תמיד תדעו בדיוק איפה הפרויקט.',
          icon: 'eye',
        },
      ],
    },
    servicesOverview: {
      title: 'הפתרונות שלנו',
      subtitle: 'מומחיות מסחר אלקטרוני בשופיפיי ובוורדפרס',
      shopify: {
        title: 'צמיחה באונליין',
        description:
          'כל מה שצריך כדי למכור אונליין. אנחנו דואגים לעיצוב, להקמה ולביצועים כדי שתוכלו להתמקד במוצרים.',
        features: ['עיצוב והקמת חנויות', 'פיתוחים מותאמים', 'אופטימיזציית מהירות', 'ליווי לצמיחה'],
      },
      wordpress: {
        title: 'עיצוב אתרים מותאם',
        description: 'אתר ייחודי כמו המותג שלכם. גמיש, קל לניהול ובנוי לבלוט.',
        features: ['עיצוב ייחודי', 'קל לעריכה', 'מוכן לחנות', 'מוכן ל-SEO'],
      },
    },
    contact: {
      hero: {
        title: 'צרו איתנו קשר',
        subtitle: 'יש לכם פרויקט בראש? בואו נגרום לזה לקרות.',
        description: 'ספרו לנו מה אתם בונים ונחזור אליכם תוך 24 שעות.',
        badge: 'בואו נדבר',
      },
      title: 'פרטי התקשרות',
      emailLabel: 'אימייל',
      quickResponseTitle: 'תגובה מהירה',
      quickResponseText: 'בדרך כלל חוזרים תוך 24 שעות.',
      scheduleTitle: 'מעדיפים שיחה?',
      scheduleText1: 'נשמח לשיחת היכרות חינמית של 30 דקות לדבר על מטרות, היקף והצעדים הבאים.',
      scheduleText2: 'ציינו זאת בהודעה ונתאם זמן שנוח לכם.',
      form: {
        title: 'שלחו לנו הודעה',
        nameLabel: 'שם מלא',
        namePlaceholder: 'השם שלך',
        emailLabel: 'אימייל',
        emailPlaceholder: 'your@email.com',
        companyLabel: 'חברה/אתר (אופציונלי)',
        companyPlaceholder: 'שם החברה או כתובת האתר',
        projectTypeLabel: 'במה נוכל לעזור?',
        selectOption: 'בחרו אפשרות',
        options: {
          shopify: 'חנות שופיפיי',
          wordpress: 'אתר וורדפרס',
          consultation: 'ייעוץ כללי',
          other: 'אחר',
        },
        messageLabel: 'ספרו לנו על הפרויקט',
        messagePlaceholder: 'שתפו כמה פרטים על הפרויקט...',
        submitButton: 'שלחו הודעה',
        submitting: 'שולח...',
        privacy: 'נשתמש במידע רק כדי לחזור אליכם.',
        successTitle: 'תודה!',
        successText: 'קיבלנו! נחזור אליכם תוך 24 שעות.',
        sendAnother: 'שלחו הודעה נוספת',
      },
    },
    footer: {
      description:
        'אתרי מסחר אלקטרוני נועזים לאמנים, יוצרים ומותגים. שופיפיי ווורדפרס שנראים מעולה, נטענים מהר ומוכרים יותר.',
      solutions: 'פתרונות',
      company: 'חברה',
      rights: 'כל הזכויות שמורות.',
      links: {
        shopify: 'פתרונות שופיפיי',
        wordpress: 'פתרונות וורדפרס',
        about: 'מי אנחנו',
        blog: 'בלוג',
        contact: 'צור קשר',
        privacy: 'מדיניות פרטיות',
        terms: 'תנאי שימוש',
      },
    },
    common: {
      learnMore: 'לפרטים נוספים',
      contactUs: 'דברו איתנו',
      getStarted: 'בואו נתחיל',
      viewWork: 'לתיק העבודות',
    },
    process: {
      title: 'איך אנחנו עובדים',
      subtitle: 'תהליך מוכח שמוביל להצלחה',
      steps: {
        discovery: {
          title: 'גילוי',
          description: 'לומדים על העסק, המטרות והחזון שלכם ליצירת אסטרטגיה מותאמת.',
        },
        design: {
          title: 'עיצוב',
          description: 'המעצבים יוצרים ויזואל מרהיב שמבטא את זהות המותג.',
        },
        develop: {
          title: 'פיתוח',
          description: 'בונים את החנות עם קוד נקי וביצועים אופטימליים.',
        },
        launch: {
          title: 'השקה',
          description: 'החנות עולה לאוויר עם תמיכה מלאה ואופטימיזציה שוטפת.',
        },
      },
    },
    stats: {
      title: 'ההשפעה שלנו',
      subtitle: 'מספרים שמדברים בעד עצמם',
      projects: {
        label: 'פרויקטים שהושקו',
      },
      satisfaction: {
        label: 'שביעות רצון לקוחות',
      },
      years: {
        label: 'שנות ניסיון',
      },
      support: {
        label: 'תמיכה זמינה',
      },
    },
    work: {
      hero: {
        title: 'העבודות שלנו',
        subtitle: 'פרויקטים אמיתיים. תוצאות אמיתיות.',
        description: 'ראו איך עזרנו לעסקים להשיק, לצמוח ולמטב את הנוכחות הדיגיטלית שלהם.',
        badge: 'תיק עבודות',
      },
      filters: {
        all: 'כל הפרויקטים',
        shopify: 'שופיפיי',
        wordpress: 'וורדפרס',
      },
      cta: {
        title: 'מוכנים להצטרף',
        titleSpan: 'לסיפורי ההצלחה?',
        description: 'בואו נדבר על הפרויקט שלכם ונראה איך נוכל לעזור.',
        button: 'התחילו את הפרויקט',
      },
      viewProject: 'צפייה בפרויקט',
      comingSoon: 'קייס סטאדיז בקרוב. אנחנו מתעדים את הפרויקטים האחרונים שלנו.',
    },
    pricing: {
      hero: {
        title: 'מחירים פשוטים ושקופים',
        subtitle: 'בלי עלויות נסתרות. בלי הפתעות.',
        description: 'בחרו חבילה שמתאימה לצרכים שלכם, או בואו נבנה משהו מותאם אישית.',
        badge: 'מחירים',
      },
      packages: {
        quickLaunch: {
          name: 'השקה מהירה',
          description: 'העלו את חנות השופיפיי לאוויר מהר עם תשתית מוכחת.',
          price: 'החל מ-$2,500',
          timeline: '1-2 שבועות',
          features: [
            'הקמה והגדרת חנות שופיפיי',
            'בחירת תבנית והתאמה בסיסית',
            'אינטגרציות אפליקציות חיוניות',
            'הגדרת תשלומים ומשלוחים',
            'הגדרת SEO בסיסית',
            'פגישת הדרכה',
          ],
          cta: 'בואו נתחיל',
        },
        growthUpgrade: {
          name: 'שדרוג צמיחה',
          description: 'מטבו את החנות הקיימת לביצועים והמרות טובים יותר.',
          price: 'החל מ-$3,500',
          timeline: '2-4 שבועות',
          popular: true,
          features: [
            'אודיט מלא לאתר (מהירות, SEO, UX)',
            'אופטימיזציית ביצועים',
            'שיפורי המרה',
            'ניקוי ומיטוב אפליקציות',
            'כיוונון חוויית מובייל',
            '30 יום תמיכה לאחר השקה',
          ],
          cta: 'שדרגו עכשיו',
        },
        customBuild: {
          name: 'בנייה מותאמת',
          description: 'פתרון מותאם לחלוטין סביב הצרכים הייחודיים שלכם.',
          price: 'החל מ-$8,000',
          timeline: '4-8 שבועות',
          features: [
            'גילוי ואסטרטגיה מותאמים',
            'פיתוח תבנית מותאמת',
            "פיצ'רים ואינטגרציות מתקדמים",
            'אופטימיזציית ביצועים',
            'תשתית SEO',
            '60 יום תמיכה לאחר השקה',
          ],
          cta: 'בואו נדבר',
        },
        storeAudit: {
          name: 'אודיט חנות',
          description: 'סקירה מקיפה של החנות עם המלצות מעשיות.',
          price: '$500',
          timeline: '3-5 ימים',
          features: [
            'סרטון של 60 דקות עם סקירה',
            'ניתוח מהירות עם תיקונים ספציפיים',
            'סקירת SEO והמלצות',
            'הזדמנויות להמרה',
            'תוכנית פעולה מתועדפת',
            'שיחת מעקב לשאלות',
          ],
          cta: 'הזמינו אודיט',
        },
      },
      included: {
        title: 'מה תמיד כלול',
        items: [
          'תקשורת ישירה עם מפתחים בכירים',
          'עדכוני התקדמות ודמואים קבועים',
          'קוד נקי ומתועד',
          'תקופת תמיכה לאחר השקה',
          'אופטימיזציית ביצועים',
          'גישת Mobile-first',
        ],
      },
      notIncluded: {
        title: 'מה נפרד',
        items: [
          'תמיכה חודשית שוטפת (ראו תוכניות תחזוקה)',
          'עלויות מנוי לאפליקציות צד שלישי',
          'צילומים וכתיבת תוכן',
          'דומיין ואחסון',
        ],
      },
      faq: {
        title: 'שאלות על מחירים',
        items: [
          {
            question: 'אתם מציעים תוכניות תשלום?',
            answer:
              'כן, לפרויקטים מעל $5,000, אנחנו בדרך כלל מחלקים תשלומים לאבני דרך: 40% להתחלה, 30% באישור עיצוב, ו-30% בהשקה.',
          },
          {
            question: 'מה אם הפרויקט שלי לא מתאים לחבילות האלה?',
            answer:
              'אלה נקודות התחלה. נגדיר את הפרויקט כראוי ונספק הצעת מחיר מותאמת לצרכים הספציפיים שלכם.',
          },
          {
            question: 'יש עלויות נסתרות?',
            answer:
              'לא. אנחנו מציעים מחירים בשקיפות. אם משהו עולה במהלך הפרויקט שמשנה את ההיקף, נדון בזה לפני כל עבודה נוספת.',
          },
          {
            question: 'מה לא כלול במחירים האלה?',
            answer:
              'עלויות צד שלישי כמו מנויים לאפליקציות, תבניות (אם רוכשים), רישום דומיין ואחסון שוטף הם נפרדים. נפרט הכול בבירור בהצעה.',
          },
        ],
      },
      cta: {
        title: 'לא בטוחים איזו חבילה',
        titleSpan: 'מתאימה לכם?',
        description:
          'קבעו שיחת ייעוץ חינמית של 30 דקות. נלמד על הפרויקט ונמליץ על הדרך הטובה ביותר קדימה.',
        button: 'קבעו שיחה חינם',
      },
    },
    maintenance: {
      hero: {
        title: 'תחזוקה ותמיכה',
        subtitle: 'שמירה על החנות בריצה חלקה',
        description: 'תוכניות חודשיות שמטפלות בעדכונים, ניטור ושיפורים כדי שתוכלו להתמקד בעסק.',
        badge: 'תוכניות תמיכה',
      },
      plans: {
        essential: {
          name: 'טיפול בסיסי',
          price: '$299/חודש',
          description: 'תחזוקה בסיסית לשמירה על בריאות החנות.',
          features: [
            'בדיקת בריאות חודשית (מהירות, אבטחה, זמינות)',
            'עדכוני תוכנה ותבנית',
            'אימות גיבוי חודשי',
            'ניטור ביצועים בסיסי',
            'תמיכה באימייל (תגובה תוך 48 שעות)',
            'שעה אחת של תמיכה/תיקונים בחודש',
          ],
          cta: 'קבלו בסיסי',
        },
        growth: {
          name: 'טיפול צמיחה',
          price: '$599/חודש',
          popular: true,
          description: 'תמיכה פרואקטיבית לחנויות בצמיחה.',
          features: [
            'הכול בבסיסי, ועוד:',
            'עד 5 שעות פיתוח/תמיכה',
            'תמיכה באימייל בעדיפות (תגובה תוך 24 שעות)',
            'שיחות בדיקה דו-שבועיות',
            'ניטור המרות',
            'סקירת ביצועים רבעונית',
          ],
          cta: 'קבלו צמיחה',
        },
        premium: {
          name: 'טיפול פרימיום',
          price: '$1,199/חודש',
          description: 'תמיכה מלאה לחנויות בנפח גבוה.',
          features: [
            'הכול בצמיחה, ועוד:',
            'עד 12 שעות פיתוח/תמיכה',
            'תמיכת חירום באותו יום',
            'שיחות בדיקה שבועיות',
            'בדיקות A/B ואופטימיזציה',
            'מנהל לקוח ייעודי',
          ],
          cta: 'קבלו פרימיום',
        },
      },
      coverage: {
        title: 'מה מכוסה',
        technical: {
          title: 'תחזוקה טכנית',
          items: [
            'עדכוני תוכנה/תוספים קבועים',
            'ניטור אבטחה ותיקונים',
            'ניהול גיבויים',
            'ניטור זמינות',
          ],
        },
        support: {
          title: 'תמיכה ותיקונים',
          items: [
            'תיקוני באגים ופתרון בעיות',
            'עדכוני תוכן ושינויים',
            "התאמות פיצ'רים קטנות",
            'תמיכה באפליקציות צד שלישי',
          ],
        },
        performance: {
          title: 'ביצועים',
          items: ['ניטור מהירות', 'אופטימיזציית ביצועים', 'מעקב Core Web Vitals', 'דוחות חודשיים'],
        },
      },
      terms: {
        title: 'תנאים',
        items: [
          'חודש-בחודש, ביטול בכל עת עם 30 יום הודעה מראש',
          'שעות לא מצטברות',
          'שעות נוספות בחיוב של $150 לשעה',
        ],
      },
      faq: {
        title: 'שאלות על תמיכה',
        items: [
          {
            question: 'מה אם אני צריך יותר שעות מהתוכנית?',
            answer: 'שעות נוספות מחויבות ב-$150 לשעה. תמיד נודיע לכם לפני כל עבודה נוספת.',
          },
          {
            question: 'אפשר לשנות תוכנית?',
            answer:
              'כן, אפשר לשדרג או להוריד בכל עת. השינויים נכנסים לתוקף בתחילת מחזור החיוב הבא.',
          },
          {
            question: 'מה נחשב למצב חירום?',
            answer:
              'אתר למטה, תשלום שבור, או אירועי אבטחה. חברי תוכנית פרימיום מקבלים תגובה באותו יום לחירומים.',
          },
          {
            question: 'אתם תומכים בחנויות שלא בניתם?',
            answer:
              'כן, אנחנו מקבלים תחזוקה לחנויות קיימות. נעשה סקירה ראשונית להבנת ההתקנה שלכם קודם.',
          },
        ],
      },
      cta: {
        title: 'צריכים תנאי',
        titleSpan: 'תמיכה מותאמים?',
        description: 'לחנויות גדולות או דרישות ספציפיות, נוכל ליצור תוכנית מותאמת.',
        button: 'דברו על תוכנית מותאמת',
      },
    },
    stickyCta: {
      text: 'Book a Call',
      textHe: 'קבעו שיחה',
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
