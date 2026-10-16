export interface Award {
  title: string
  issuer: string // who gave the award
  date: string
  description?: string
  certificateUrl?: string // e.g. '/certificates/award.pdf' or '/certificates/award.png'
  linkUrl?: string // optional external page, e.g. an announcement; opens in a new tab
}


export const awards: Award[] = [
  {
    title: 'Proficiency in Mobile Application Development',
    issuer: 'CCS Faculty, Laguna University',
    date: 'July 2026',

description:
  'Recognized among all third-year students for proficiency and excellence in mobile application development.',

    certificateUrl: '/awards/mobile.jpg',
    linkUrl: '',
  },
  {
    title: 'Proficiency in Python Programming',
    issuer: 'CCS Faculty, Laguna University',
    date: 'July 2025',
    description:
      'Awarded as the sole recipient from the entire sophomore year for outstanding Python programming proficiency, problem-solving skills, mastery of core Python concepts, and practical programming application.',
    certificateUrl: '/awards/python.jpg',
    linkUrl: '',
  },
  {
    title: 'Proficiency in Web Development',
    issuer: 'CCS Faculty, Laguna University',
    date: 'July 2025',
    description:
      'Selected as the sole recipient from the entire sophomore year for exceptional web development proficiency, advanced technical skills, creativity, and dedication to innovative full-stack web applications.',
    certificateUrl: '/awards/web.jpg',
    linkUrl: '',
  },
  {
    title: 'STIC Industry Professional Credentials Track',
    issuer:
      'Science, Technology, and Innovation Cooperation (STIC) Program',
    date: 'July 2024',
    description:
      'Awarded a scholarship providing access to Coursera courses from leading companies, including IBM, Meta, and Google, covering in-demand skills in software development, data analytics, cybersecurity, UX design, project management, and data engineering.',
    certificateUrl: '/awards/stic.jpg',
    linkUrl: '',
  },
]
