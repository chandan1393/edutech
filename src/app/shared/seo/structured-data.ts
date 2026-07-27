export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",

  name: "EduPilotHelp",

  url: "https://www.edupilothelp.com",

  logo: "https://www.edupilothelp.com/assets/images/logo.png",

  image: "https://www.edupilothelp.com/assets/images/og-image.jpg",

  description:
    "Professional Online Class Help, Assignment Help and Exam Assistance.",

  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: "English"
    }
  ]
};

export const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",

  name: "EduPilotHelp",

  url: "https://www.edupilothelp.com",

  potentialAction: {
    "@type": "SearchAction",

    target:
      "https://www.edupilothelp.com/search?q={search_term_string}",

    "query-input":
      "required name=search_term_string"
  }
};

export const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",

  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is it safe to pay someone to do my online class?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. EduPilotHelp protects your information using secure encryption and strict confidentiality."
      }
    },
    {
      "@type": "Question",
      "name": "How much does online class help cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Pricing starts from $42 per week depending on the subject, workload and course duration."
      }
    },
    {
      "@type": "Question",
      "name": "Which LMS platforms do you support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "We support Canvas, Blackboard, Moodle, Brightspace, Coursera, edX, Pearson MyLab, McGraw-Hill Connect and many other online learning platforms."
      }
    },
    {
      "@type": "Question",
      "name": "Can you guarantee grades?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Our experienced subject experts aim for A and B grades while maintaining high-quality, original work and on-time submissions."
      }
    }
  ]
};
