
export interface Certification {
  title: string
  issuer: string
  date: string
  type: 'certification' | 'training'
  credentialUrl?: string
  credentialId?: string
  certificateUrl?: string
  description?: string
}

export const certifications: Certification[] = [
  {
    title: 'Meta Front-End Developer Professional Certificate',
    issuer: 'Meta',
    date: 'March 2024',
    type: 'certification',
    certificateUrl: '/certifications/frontend.png',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/5US33BHGWVD3',
    credentialId: '5US33BHGWVD3',
  },
  {
    title: 'Meta Database Engineer Professional Certificate',
    issuer: 'Meta',
    date: 'August 2024',
    type: 'certification',
    certificateUrl: '/certifications/database.png',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/EUUAXJO6O62V',
    credentialId: 'EUUAXJO6O62V',
  },
  {
    title: 'Meta Back-End Developer Professional Certificate',
    issuer: 'Meta',
    date: 'October 2024',
    type: 'certification',
    certificateUrl: '/certifications/backend.png',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/specialization/NNPKNCS2QI0J',
    credentialId: 'NNPKNCS2QI0J',
  },
  {
    title: 'Meta Full Stack Software Engineer Professional Certificate',
    issuer: 'Meta',
    date: 'November 2024',
    type: 'certification',
    certificateUrl: '/certifications/fullstack.png',
    credentialUrl: 'http://credly.com/badges/32e0408d-6c47-4d48-bd99-d994e8101a13',
    credentialId: '32e0408d-6c47-4d48-bd99-d994e8101a13',
  },
]
