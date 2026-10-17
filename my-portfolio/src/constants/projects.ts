export interface Project {
  id: string
  title: string
  description: string
  category: string
  technologies: string[]
  /** Main cover. For hybrid projects this is the WEB cover. */
  image: string
  /** Optional phone cover. If set, the project is "hybrid" and the card shows web + phone together. */
  mobileImage?: string
  /** Legacy screenshots. Treated as mobile if category is 'Mobile App', otherwise web. */
  images?: string[]
  /** Explicit screenshot groups, use these for hybrid projects. */
  webImages?: string[]
  mobileImages?: string[]
  video?: string
  liveUrl?: string
  githubUrl?: string
  playStoreUrl?: string
  appStoreUrl?: string
  apkUrl?: string
  websiteUrl?: string
  caseStudyUrl?: string
  featured?: boolean
  status?: string
}

export const isMobileProject = (p: Pick<Project, 'category'>) => p.category === 'Mobile App'
export const isHybridProject = (p: Pick<Project, 'mobileImage'>) => Boolean(p.mobileImage)

export const getScreens = (p: Project) => {
  const legacy = p.images ?? []
  const legacyIsMobile = p.category === 'Mobile App'
  return {
    web: [...(p.webImages ?? []), ...(legacyIsMobile ? [] : legacy)],
    mobile: [...(p.mobileImages ?? []), ...(legacyIsMobile ? legacy : [])],
  }
}
export const projects: Project[] = [
  {
    id: 'mary-app',
    title: 'Mary App',
  description: 'A mobile application component of the Complaints and Feedback Management System (CFMS) for Santa Maria, Laguna, enabling residents to submit complaints to their respective barangays across all 25 barangays, track complaint statuses, and access an integrated FAQ chatbot.',
    category: 'Mobile App',
    technologies: ['React Native', 'NativeWind', 'Tanstack Query'],
    image: '/assets/images/mary/home.jpg',
    images: [
      '/assets/images/mary/home.jpg',
      '/assets/images/mary/chatbot.jpg',
      '/assets/images/mary/emergency.jpg',
      '/assets/images/mary/notif.jpg',
      '/assets/images/mary/instructions.jpg',
      '/assets/images/mary/choose.jpg',
      '/assets/images/mary/map.jpg',
      '/assets/images/mary/terms.jpg',
                              
    ],
    video: '/assets/images/mary/tutorial.mp4',
    status: 'In development',
    featured: true,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.maryapp.user',
  },
 {
  id: 'cfms',
  title: 'Complaints and Feedback Management System (CFMS)',
  description:
    'A full-stack complaint management platform serving 25 barangays in Santa Maria, Laguna. The system enables barangay personnel to manage and resolve complaints, with AI-powered emergency classification and routing, intelligent duplicate complaint detection, and an integrated FAQ chatbot powered by OpenAI and Pinecone.',
  category: 'Full Stack / AI',
  technologies: [
    'React',
    'Vite',
    'TypeScript',
    'FastAPI',
    'PostgreSQL',
    'OpenAI',
    'Pinecone',
    'Redis',
    'Celery',
    'Docker',
  ],
  websiteUrl: 'https://www.cfms-stamaria.com/officials-login',
  image: '/images/projects/cfms/cover.png',
  images: [
    '/images/projects/cfms/dashboard.png',
    '/images/projects/cfms/complaints.png',
    '/images/projects/cfms/chatbot.png',
  ],

  featured: true,
},

{
  id: 'cloud-disaster-recovery',
  title: 'Cloud Infrastructure & Disaster Recovery',
  description:
    'Implemented a disaster recovery setup for a financial application, deploying a backup website connected to a separate Supabase project to support service recovery. Migrated application data and replicated the PostgreSQL schema, preserving table structures, relationships, and constraints. Deployed the infrastructure on a VPS using Docker and configured Prometheus and Grafana dashboards to monitor backend metrics, resource utilization, and application health.',
  category: 'DevOps / Cloud Infrastructure',
  technologies: [
    'Docker',
    'Supabase',
    'PostgreSQL',
    'Prometheus',
    'Grafana',
    'Linux',
    'VPS Deployment',
  ],
  image: '/assets/images/devops/grafana.png',
  images: [
    '/assets/images/devops/grafana.png',
   
  ],
  featured: true,
},


{
  id: 'dti-etaas',
  title: 'DTI Laguna ETAAS – Digital Trade & Services Platform',
  description:
    'A full-stack multi-vendor marketplace connecting 30+ Laguna-based MSMEs with customers. Features include product discovery, cart and checkout, order tracking, vendor dashboards, and a multi-tenant Agentic RAG chatbot that answers customer queries using store-specific product and business data. Improved retrieval relevance by 35% using Cross-Encoder reranking and reduced irrelevant chatbot responses from 18% to 6%.',
  category: 'Mobile App',
  technologies: [
    'React Native',
    'FastAPI',
    'Python',
    'Pinecone',
    'Gemini Embeddings',
    'Hugging Face',
    'Firebase',
    'Cloudinary',
  ],
  video: '/assets/images/etaas/rag.mp4',
  image: '/assets/images/etaas/dashboard.jpg',
  images: [
    '/assets/images/etaas/login.jpg',
    '/assets/images/etaas/products.jpg',
    '/assets/images/etaas/variants.jpg',
     '/assets/images/etaas/cart.jpg',
     '/assets/images/etaas/notification.jpg',
      '/assets/images/etaas/shopmess.jpg',
      '/assets/images/etaas/services.jpg',
      '/assets/images/etaas/dashboard.jpg',
      '/assets/images/etaas/manageprod.jpg',
       '/assets/images/etaas/storeprof.jpg',
        '/assets/images/etaas/orders.jpg',

  ],
  featured: true,
},


{
  id: 'docubot',
  title: 'Docubot – Local Document Q&A Assistant',
  description:
    'A PC-focused, full-stack document Q&A application that allows users to upload PDF files and ask questions about their contents using natural language. Implements a Retrieval-Augmented Generation (RAG) pipeline that extracts and chunks document text, generates embeddings, retrieves relevant passages from a vector database, and produces context-aware answers. Integrates Ollama for locally running language models, enabling on-device AI inference without relying on a cloud-hosted LLM API.',
  category: 'Full Stack / Local AI',
  technologies: [
    'Next.js',
    'Tailwind CSS',
    'FastAPI',
    'Python',
    'LangChain',
    'Pinecone',
    'Ollama',
    'Hugging Face',
  ],
  image: '/assets/images/mary/docubot.jpg',
  images: [
    '/assets/images/mary/docubot.jpg',
    
  ],
  video: '/assets/images/mary/docubot.mp4',
  githubUrl: 'https://github.com/LeanKurtEscano/Document-Q-A-Assistant',
  featured: false,
},


{
  id: 'commission-accounting',
  title: 'Commission Accounting System',
  description:
    'A full-stack commission management and accounting platform developed for a real estate company, serving 30+ agents with real-time commission tracking, hierarchical commission calculations, and financial performance analytics. Implemented custom commission rules to reduce manual computation errors by 95% and optimized PostgreSQL queries from 5.1 seconds to 0.9 seconds, while reducing monthly report generation from 3 hours to 15 minutes.',
  category: 'Full Stack / Backend',
  technologies: [
    'Python',
    'Django',
    'Django REST Framework',
    'PostgreSQL',
  ],
  image: '/assets/images/accounting/cover.jpg',
  images: [
    '/assets/images/accounting/cover.jpg',
    '/assets/images/accounting/dashboard.jpg',
    '/assets/images/accounting/create.jpg',
     '/assets/images/accounting/manage.jpg',
      '/assets/images/accounting/create.jpg',
       '/assets/images/accounting/report.jpg',
         '/assets/images/accounting/tracking.jpg',
        '/assets/images/accounting/income.jpg',
          '/assets/images/accounting/total.jpg',
  ],
  featured: false,
},

{
  id: 'qualitysense',
  title: 'QualitySense – Data Quality Analysis Platform',
  description:
    'A full-stack web application for automated data quality analysis, processing datasets of 50K+ rows to detect missing values, outliers, and categorical anomalies using Python and pandas. Developed a Django backend with optimized queries and caching to improve API response times by 30%, and integrated Gemini to generate AI-powered summaries that help users understand dataset issues. Implemented secure authentication using JWT and Google OAuth 2.0.',
  category: 'Full Stack / AI',
  technologies: [
    'React',
    'Python',
    'Django',
    'Pandas',
    'Gemini API',
    'JWT',
    'Google OAuth 2.0',
  ],
  video: '/assets/images/quality/demo_new.mp4',
  image: '/assets/images/quality/home.jpg',
  images: [
    '/assets/images/quality/login.jpg',
    '/assets/images/quality/signup.jpg',
    '/assets/images/quality/otp.jpg',
    '/assets/images/quality/home.jpg',
    '/assets/images/quality/dataset.jpg',
    '/assets/images/quality/result.jpg',
    '/assets/images/quality/history.jpg',
     '/assets/images/quality/report.jpg',
      '/assets/images/quality/repo.jpg',
         '/assets/images/quality/profile.jpg',
  ],
  websiteUrl: 'https://qualitysense.netlify.app/',
  featured: false,
},

{
  id: 'tu-loan',
  title: 'Tu-Loan – Loan Management System',
  description:
    'A full-stack loan management system developed as a second-year BSIT System Development final project to streamline loan applications, approvals, and payments for users and administrators. Features automated interest and penalty calculations, real-time notifications using WebSockets, secure authentication, and an administrative dashboard for managing users, loan records, and disbursements.',
  category: 'Full Stack / Backend',
  technologies: [
    'React.js',
    'Tailwind CSS',
    'Django',
    'PostgreSQL',
    'WebSockets',
  ],
  githubUrl: 'https://github.com/LeanKurtEscano/Loan-Management-System',
  image: '/assets/images/tuloan/home.jpg',
  images: [
    '/assets/images/tuloan/after.jpg',
    '/assets/images/tuloan/application.jpg',
    '/assets/images/tuloan/applicationapp.jpg',
    '/assets/images/tuloan/approved.jpg',
    '/assets/images/tuloan/breakdown.jpg',
    '/assets/images/tuloan/congrats.jpg',
    '/assets/images/tuloan/disbursement.jpg',
    '/assets/images/tuloan/eligible.jpg',
    '/assets/images/tuloan/home.jpg',
    '/assets/images/tuloan/late.jpg',
    '/assets/images/tuloan/loan.jpg',
    '/assets/images/tuloan/login.jpg',
    '/assets/images/tuloan/notification.jpg',
    '/assets/images/tuloan/notifpage.jpg',
    '/assets/images/tuloan/passed.jpg',
    '/assets/images/tuloan/payment.jpg',
    '/assets/images/tuloan/process.jpg',
    '/assets/images/tuloan/profile.jpg',
    '/assets/images/tuloan/receipt.jpg',
    '/assets/images/tuloan/register.jpg',
    '/assets/images/tuloan/selfie.jpg',
    '/assets/images/tuloan/step1.jpg',
    '/assets/images/tuloan/step2.jpg',
    '/assets/images/tuloan/step3.jpg',
    '/assets/images/tuloan/step4.jpg',
    '/assets/images/tuloan/transactions.jpg',
    '/assets/images/tuloan/user.jpg',
    '/assets/images/tuloan/userprof.jpg',
    '/assets/images/tuloan/verification.jpg',
  ],
  featured: false,
},




]