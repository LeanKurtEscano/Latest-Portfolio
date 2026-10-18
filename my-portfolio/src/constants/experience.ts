export interface TimelineEntry {
  type: 'experience' | 'education'
  title: string
  organization: string
  period: string
  description?: string
  technologies?: string[]
}

// Placeholder entries: replace with your real history. Delete the array contents to hide the section.

export const timeline: TimelineEntry[] = [
  {
    type: 'experience',
    title: 'Junior DevOps Engineer',
    organization: 'Alpha Hustlers Trading Firm - Cloud Infrastructure & Disaster Recovery (Freelance)',
    period: 'September 2026 – Present',
    description:
      'Deployed a backup website connected to a separate Supabase project for service recovery. Migrated financial application data and replicated PostgreSQL schemas while preserving tables, relationships, and constraints. Monitored cloud infrastructure and application health to support system availability.',
    technologies: ['Supabase', 'PostgreSQL', 'Git', 'Cloud Infrastructure'],
  },
  {
    type: 'experience',
    title: 'Full Stack Developer',
    organization:
      'DTI Laguna ETAAS – Digital Trade & Services Platform (Laguna University × DTI Laguna Partnership)',
    period: 'October 2025 – December 2025',
    description:
      'Engineered a full-stack marketplace connecting 30+ Laguna-based MSMEs with customers. Developed a multi-tenant AI chatbot backend using FastAPI, Pinecone, and Gemini embeddings, achieving 92% query-routing accuracy. Improved retrieval relevance by 35% through Cross-Encoder reranking and integrated Firebase Authentication and Cloudinary.',
    technologies: [
      'Python',
      'FastAPI',
      'React',
      'Pinecone',
      'Gemini',
      'Hugging Face',
      'Firebase',
      'Cloudinary',
    ],
  },
  {
    type: 'experience',
    title: 'Full Stack Developer',
    organization: 'Commission Accounting System (Freelance)',
    period: 'January 2024 – March 2024',
    description:
      'Built a commission computation system used by 30+ real estate agents for real-time commission tracking. Implemented hierarchical commission calculations, reducing manual computation errors by 95%. Optimized PostgreSQL queries from 5.1 seconds to 0.9 seconds and reduced monthly report generation from 3 hours to 15 minutes.',
    technologies: [
      'Python',
      'Django',
      'Django REST Framework',
      'PostgreSQL',
    ],
  },
]
