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
