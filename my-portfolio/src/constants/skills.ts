export interface SkillGroup { category: string; items: string[] }

export const skills: SkillGroup[] = [
  { category: 'Frontend & Mobile', items: ['JavaScript', 'TypeScript', 'React', 'React Native', 'Tailwind CSS', 'NativeWind','Vite'] },
  { category: 'Backend', items: ['Python', 'Java', 'FastAPI', 'Django','SpringBoot', 'Node.js', 'SQL', 'PostgreSQL', 'MySQL','FireStore', 'OAuth', 'JWT','REST'] },
  { category: 'DevOps & Cloud', items: ['Docker', 'GitHub Actions', 'Prometheus', 'Grafana', 'Firebase'] },
{ category: 'AI & Data', items: ['LangChain', 'Hugging Face', 'Pinecone', 'Ollama', 'OpenAI', 'Gemini', 'RAG', 'Embeddings', 'Prompt Engineering', 'Pandas'] },
  { category: 'Developer Tools', items: ['Git','Github', 'VS Code','Webstorm', 'JetBrains IntelliJ','Slack','Discord','Jira'] },
]