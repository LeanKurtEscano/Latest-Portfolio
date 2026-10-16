export interface SkillGroup { category: string; items: string[] }

export const skills: SkillGroup[] = [
  { category: 'Programming', items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'] },
  { category: 'Frontend and Mobile', items: ['React', 'React Native', 'Tailwind CSS', 'NativeWind'] },
  { category: 'Backend', items: ['FastAPI', 'Django', 'REST APIs'] },
  { category: 'Databases', items: ['PostgreSQL', 'MySQL', 'Firebase'] },
  { category: 'AI / Machine Learning', items: ['LangChain', 'Hugging Face', 'Pinecone'] },
  { category: 'Tools and Infrastructure', items: ['Git', 'Docker', 'GitHub Actions', 'CI/CD'] },
]
