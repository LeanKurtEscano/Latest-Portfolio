export interface SocialLink { label: string; url: string }

export const siteConfig = {
  name: '<Lean/>',
  title: 'Software Developer / AI Engineer',
  profileImage: '../../public/assets/images/profile.png',
  resumeUrl: '/files/escano_latest.pdf',

  hero: {
    label: 'Software Developer · AI Engineer',
    headline: 'Building Intelligent Software for Real-World Problems.',
    description:
      "I'm a software developer focused on building reliable applications, scalable backend systems, and AI-powered solutions that solve meaningful problems.",
  },

  about: {
    heading: 'Practical software, built carefully.',
    paragraphs: [
      'I build software across the stack, with a particular interest in backend systems and in applying machine learning where it makes a product genuinely better.',
      'I care about clear code, dependable systems, and solutions that people actually use.',
    ],
    interests: [
      'Software engineering',
      'Backend development',
      'Full-stack development',
      'Mobile applications',
      'AI Application and Development',
      'Practical software solutions',
    ],
  },

  contact: {
    headline: 'Have an interesting problem to solve?',
    text: "I'm open to conversations about software, backend systems, mobile apps, and AI projects.",
    email: 'hello@example.com', // placeholder: replace with your email
    // Only links with a non-empty url are shown.
    socials: [
      { label: 'GitHub', url: '' },
      { label: 'LinkedIn', url: '' },
    ] as SocialLink[],
  },
}

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
]

/** True when a config value is a usable, non-empty string. */
export const hasValue = (v?: string): v is string => typeof v === 'string' && v.trim().length > 0
