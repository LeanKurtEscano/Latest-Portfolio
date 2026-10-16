export interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  image: string
  images?: string[]
  video?: string
  liveUrl?: string
  githubUrl?: string
  playStoreUrl?: string
  appStoreUrl?: string
  apkUrl?: string
  caseStudyUrl?: string
  featured?: boolean
  status?: string
}

// Sample entries. Replace titles, text, and asset paths with your own.
// Leave a link field out (or empty) and its button will not appear.
export const projects: Project[] = [
  {
    id: 'mary-app',
    title: 'Mary App',
    description: 'A mobile application. Replace this with a short description of the problem it solves and what you built.',
    category: 'Mobile App',
    technologies: ['React Native', 'NativeWind', 'Firebase'],
    image: '/images/projects/mary-app/cover.png',
    images: [
      '/images/projects/mary-app/screenshot-1.png',
      '/images/projects/mary-app/screenshot-2.png',
    ],
    video: '/videos/mary-app-demo.mp4',
    status: 'In development',
    featured: true,
  },
  {
    id: 'lucra',
    title: 'Lucra',
    description: 'A backend-driven web product. Replace this with a short description of the project and your role.',
    category: 'Web / Backend',
    technologies: ['FastAPI', 'PostgreSQL', 'Docker'],
    image: '/images/projects/lucra/cover.png',
    images: ['/images/projects/lucra/screenshot-1.png'],
    featured: true,
  },
]
