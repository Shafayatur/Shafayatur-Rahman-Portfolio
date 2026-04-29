import type { About, Certificate, Experience, Project, Settings, SkillCategory } from './db'

export const SEED_ABOUT: About = {
  name: 'Shafayatur Rahman',
  role: 'AI Engineer & Full-Stack Developer',
  bio: `I'm a passionate AI engineer focused on building intelligent systems that solve real-world problems. With a deep background in machine learning, computer vision, and full-stack development, I bridge the gap between cutting-edge research and production-ready software. I've shipped everything from real-time sign language recognition systems to large-scale NLP pipelines serving millions of requests daily. When I'm not training models, I'm building the interfaces that make them accessible.`,
  location: 'San Francisco, CA',
  email: 'alex@example.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  highlights: [
    '5+ years in AI/ML engineering',
    'Published research in computer vision',
    'Open source contributor (2k+ GitHub stars)',
    'Speaker at MLConf & PyCon',
  ],
}

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Sign Language Recognition System',
    description:
      'Real-time American Sign Language (ASL) recognition using deep learning and computer vision. Achieves 96.4% accuracy on the ASL-26 dataset with support for dynamic two-handed gestures and live video inference at 30fps.',
    techStack: ['Python', 'TensorFlow', 'OpenCV', 'MediaPipe', 'FastAPI', 'React'],
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop',
    github: 'https://github.com',
    liveUrl: '',
    featured: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'NLP Document Intelligence Platform',
    description:
      'Enterprise document classification and extraction platform processing 500k+ documents daily. Leverages fine-tuned BERT models for multi-label classification, named entity recognition, and semantic search across legal and financial documents.',
    techStack: ['Python', 'Transformers', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    github: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
    createdAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'proj-3',
    title: 'Real-Time Object Detection Dashboard',
    description:
      'Production-grade object detection system built on YOLOv8 with a React dashboard for live monitoring, alert configuration, and analytics. Deployed on edge devices with <15ms inference latency.',
    techStack: ['Python', 'YOLOv8', 'PyTorch', 'WebSocket', 'React', 'TypeScript', 'TailwindCSS'],
    image: 'https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=600&h=400&fit=crop',
    github: 'https://github.com',
    liveUrl: '',
    featured: true,
    createdAt: '2023-11-20T00:00:00Z',
  },
  {
    id: 'proj-4',
    title: 'Conversational AI Customer Support',
    description:
      'Multi-turn conversational AI for enterprise customer support, reducing ticket volume by 42%. Built with retrieval-augmented generation (RAG) over custom knowledge bases, with human handoff and sentiment analysis.',
    techStack: ['LangChain', 'OpenAI', 'Pinecone', 'Python', 'Node.js', 'Next.js'],
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop',
    github: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
    createdAt: '2023-08-10T00:00:00Z',
  },
  {
    id: 'proj-5',
    title: 'ML Pipeline Orchestrator',
    description:
      'Open-source ML pipeline orchestration tool with a visual DAG editor, experiment tracking, model registry, and one-click deployment to major cloud providers. 2.1k GitHub stars.',
    techStack: ['Python', 'Apache Airflow', 'MLflow', 'React', 'FastAPI', 'PostgreSQL', 'AWS'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    github: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
    createdAt: '2023-05-05T00:00:00Z',
  },
  {
    id: 'proj-6',
    title: 'Medical Imaging Analysis Tool',
    description:
      'Deep learning tool for automated analysis of chest X-rays, detecting 14 common pathologies with radiologist-level accuracy. Integrated into a HIPAA-compliant web platform used by 3 hospital networks.',
    techStack: ['Python', 'PyTorch', 'DICOM', 'FastAPI', 'React', 'AWS S3', 'Docker'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop',
    github: '',
    liveUrl: '',
    featured: false,
    createdAt: '2022-12-01T00:00:00Z',
  },
]

export const SEED_SKILLS: SkillCategory[] = [
  {
    id: 'skill-1',
    name: 'AI / Machine Learning',
    icon: '🧠',
    skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Hugging Face', 'LangChain', 'Computer Vision', 'NLP', 'MLflow', 'ONNX', 'CUDA'],
  },
  {
    id: 'skill-2',
    name: 'Backend',
    icon: '⚙️',
    skills: ['Python', 'FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'Redis', 'MongoDB', 'GraphQL', 'gRPC', 'REST'],
  },
  {
    id: 'skill-3',
    name: 'Frontend',
    icon: '🎨',
    skills: ['React', 'TypeScript', 'Next.js', 'TanStack', 'Tailwind CSS', 'Framer Motion', 'WebGL', 'Three.js'],
  },
  {
    id: 'skill-4',
    name: 'Infrastructure & Tools',
    icon: '🛠️',
    skills: ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'GitHub Actions', 'Apache Airflow', 'Prometheus', 'Grafana'],
  },
]

export const SEED_EXPERIENCE: Experience[] = [
  {
    id: 'exp-1',
    type: 'work',
    title: 'Senior AI/ML Engineer',
    company: 'Vertex AI Labs',
    period: '2022 – Present',
    description:
      'Lead ML engineer building production computer vision and NLP systems. Architected a real-time document intelligence platform processing 500k documents/day. Mentored 4 junior engineers and drove adoption of MLOps best practices.',
    tags: ['Python', 'TensorFlow', 'Kubernetes', 'MLflow', 'AWS'],
  },
  {
    id: 'exp-2',
    type: 'work',
    title: 'Machine Learning Engineer',
    company: 'DataStream Inc.',
    period: '2020 – 2022',
    description:
      'Built and maintained ML models for anomaly detection and predictive maintenance across IoT sensor networks. Reduced false positive rate by 38% through feature engineering and ensemble methods.',
    tags: ['Python', 'PyTorch', 'Spark', 'Kafka', 'GCP'],
  },
  {
    id: 'exp-3',
    type: 'work',
    title: 'Software Engineer',
    company: 'PixelLabs',
    period: '2018 – 2020',
    description:
      'Full-stack developer building React-based SaaS products with Node.js backends. Led the migration from a monolithic Rails app to a microservices architecture, improving deploy frequency by 4x.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'exp-4',
    type: 'education',
    title: 'M.S. Computer Science (AI Specialization)',
    company: 'Stanford University',
    period: '2016 – 2018',
    description:
      'Graduate research in deep learning and computer vision. Thesis: "Efficient Architectures for Real-Time Gesture Recognition". Published 2 papers at NeurIPS and CVPR workshops.',
    tags: ['Deep Learning', 'Computer Vision', 'Research'],
  },
  {
    id: 'exp-5',
    type: 'education',
    title: 'B.S. Software Engineering',
    company: 'UC Berkeley',
    period: '2012 – 2016',
    description:
      'Graduated with honors. Specialized in algorithms and systems programming. Active member of the Machine Learning student club and won the 2015 Cal Hacks hackathon.',
    tags: ['Algorithms', 'Systems', 'Data Structures'],
  },
]

export const SEED_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=400&h=280&fit=crop',
    url: 'https://credential.net',
  },
  {
    id: 'cert-2',
    title: 'AWS Machine Learning Specialty',
    issuer: 'Amazon Web Services',
    date: '2022',
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=280&fit=crop',
    url: 'https://aws.amazon.com/certification',
  },
  {
    id: 'cert-3',
    title: 'Deep Learning Specialization',
    issuer: 'deeplearning.ai / Coursera',
    date: '2021',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=280&fit=crop',
    url: 'https://coursera.org',
  },
  {
    id: 'cert-4',
    title: 'Professional Cloud Architect',
    issuer: 'Google Cloud',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=280&fit=crop',
    url: 'https://cloud.google.com/certification',
  },
  {
    id: 'cert-5',
    title: 'Certified Kubernetes Administrator',
    issuer: 'CNCF / Linux Foundation',
    date: '2022',
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e7f6101?w=400&h=280&fit=crop',
    url: 'https://training.linuxfoundation.org',
  },
]

export const SEED_SETTINGS: Settings = {
  hasResume: false,
  seeded: true,
  siteTitle: 'Shafayatur Rahman — AI Engineer',
}
