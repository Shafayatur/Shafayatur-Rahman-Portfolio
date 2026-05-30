import { createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsxs, jsx } from "react/jsx-runtime";
import { createClient } from "@supabase/supabase-js";
const Route$m = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Shafayatur Rahman" },
      {
        name: "description",
        content: "AI & Data Engineer specializing in data analysis, AI automation, machine learning, and full-stack web application development."
      }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootDocument
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$7 = () => import("./resume-ooP-YZ6B.js");
const Route$l = createFileRoute("/resume")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./projects-CG19KGn3.js");
const Route$k = createFileRoute("/projects")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./contact-C19ZqgEi.js");
const Route$j = createFileRoute("/contact")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin-CChAcs_3.js");
const Route$i = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./index-BT6w8BWQ.js");
const Route$h = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin.index-COhYa7HZ.js");
const Route$g = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./_slug-DQht8Rw0.js");
const Route$f = createFileRoute("/blog/$slug")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.dashboard-DiewJJ2c.js");
const Route$e = createFileRoute("/admin/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SECRET = process.env.ADMIN_SECRET ?? "portfolio-secret-change-in-production";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const TOKEN_TTL = 24 * 60 * 60 * 1e3;
async function getKey() {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}
async function sign(data) {
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
async function createToken() {
  const exp = Date.now() + TOKEN_TTL;
  const payload = `admin:${exp}`;
  const sig = await sign(payload);
  return `${btoa(payload)}.${sig}`;
}
async function verifyToken(token) {
  try {
    const dotIdx = token.indexOf(".");
    if (dotIdx === -1) return false;
    const payloadB64 = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);
    const payload = atob(payloadB64);
    const expectedSig = await sign(payload);
    if (sig !== expectedSig) return false;
    const exp = parseInt(payload.split(":")[1] ?? "0", 10);
    return Date.now() < exp;
  } catch {
    return false;
  }
}
function checkPassword(password) {
  return password === PASSWORD;
}
async function requireAdmin(request) {
  const auth = request.headers.get("Authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return false;
  return verifyToken(auth.slice(7));
}
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);
const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
}) : null;
const memoryStore = {};
if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase URL or Key not set. Falling back to an in-memory key-value database for local development."
  );
}
async function getJSON(key) {
  if (!supabase) {
    return memoryStore[key] ?? null;
  }
  try {
    const { data, error } = await supabase.from("portfolio_store").select("value").eq("key", key).maybeSingle();
    if (error) {
      console.error(`Error getting key ${key} from Supabase:`, error);
      return null;
    }
    return data?.value ?? null;
  } catch (err) {
    console.error(`Unhandled error getting key ${key} from Supabase:`, err);
    return null;
  }
}
async function setJSON(key, value) {
  if (!supabase) {
    memoryStore[key] = value;
    return;
  }
  try {
    const { error } = await supabase.from("portfolio_store").upsert({ key, value });
    if (error) {
      console.error(`Error setting key ${key} in Supabase:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Unhandled error setting key ${key} in Supabase:`, err);
    throw err;
  }
}
async function deleteKey(key) {
  if (!supabase) {
    delete memoryStore[key];
    return;
  }
  try {
    const { error } = await supabase.from("portfolio_store").delete().eq("key", key);
    if (error) {
      console.error(`Error deleting key ${key} in Supabase:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Unhandled error deleting key ${key} in Supabase:`, err);
    throw err;
  }
}
function store() {
  return {
    get: async (key, options) => {
      if (options?.type === "blob") {
        const record = await getJSON(`${key}_file`);
        if (!record) return null;
        const buffer = Buffer.from(record.base64, "base64");
        return new Blob([buffer], { type: "application/pdf" });
      }
      return getJSON(key);
    },
    setJSON: async (key, value) => {
      await setJSON(key, value);
    },
    set: async (key, data) => {
      const base64 = Buffer.from(data).toString("base64");
      await setJSON(`${key}_file`, { base64 });
    },
    delete: async (key) => {
      await deleteKey(key);
      await deleteKey(`${key}_file`);
    }
  };
}
async function getProjects() {
  const data = await store().get("projects", { type: "json" });
  return data ?? [];
}
async function setProjects(projects) {
  await store().setJSON("projects", projects);
}
async function createProject(project) {
  const projects = await getProjects();
  const newProject = {
    ...project,
    id: crypto.randomUUID(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  await setProjects([...projects, newProject]);
  return newProject;
}
async function updateProject(id, updates) {
  const projects = await getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  projects[idx] = { ...projects[idx], ...updates, id };
  await setProjects(projects);
  return projects[idx];
}
async function deleteProject(id) {
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await setProjects(filtered);
  return true;
}
async function getSkills() {
  const data = await store().get("skills", { type: "json" });
  return data ?? [];
}
async function setSkills(skills) {
  await store().setJSON("skills", skills);
}
async function updateSkillCategory(id, updates) {
  const skills = await getSkills();
  const idx = skills.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  skills[idx] = { ...skills[idx], ...updates, id };
  await setSkills(skills);
  return skills[idx];
}
async function createSkillCategory(cat) {
  const skills = await getSkills();
  const newCat = { ...cat, id: crypto.randomUUID() };
  await setSkills([...skills, newCat]);
  return newCat;
}
async function deleteSkillCategory(id) {
  const skills = await getSkills();
  const filtered = skills.filter((s) => s.id !== id);
  if (filtered.length === skills.length) return false;
  await setSkills(filtered);
  return true;
}
async function getAbout() {
  const data = await store().get("about", { type: "json" });
  return data ?? null;
}
async function setAbout(about) {
  await store().setJSON("about", about);
}
async function getExperience() {
  const data = await store().get("experience", { type: "json" });
  return data ?? [];
}
async function setExperience(items) {
  await store().setJSON("experience", items);
}
async function createExperience(item) {
  const items = await getExperience();
  const newItem = { ...item, id: crypto.randomUUID() };
  await setExperience([...items, newItem]);
  return newItem;
}
async function updateExperience(id, updates) {
  const items = await getExperience();
  const idx = items.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, id };
  await setExperience(items);
  return items[idx];
}
async function deleteExperience(id) {
  const items = await getExperience();
  const filtered = items.filter((e) => e.id !== id);
  if (filtered.length === items.length) return false;
  await setExperience(filtered);
  return true;
}
async function getCertificates() {
  const data = await store().get("certificates", { type: "json" });
  return data ?? [];
}
async function setCertificates(certs) {
  await store().setJSON("certificates", certs);
}
async function createCertificate(cert) {
  const certs = await getCertificates();
  const newCert = { ...cert, id: crypto.randomUUID() };
  await setCertificates([...certs, newCert]);
  return newCert;
}
async function updateCertificate(id, updates) {
  const certs = await getCertificates();
  const idx = certs.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  certs[idx] = { ...certs[idx], ...updates, id };
  await setCertificates(certs);
  return certs[idx];
}
async function deleteCertificate(id) {
  const certs = await getCertificates();
  const filtered = certs.filter((c) => c.id !== id);
  if (filtered.length === certs.length) return false;
  await setCertificates(filtered);
  return true;
}
async function getMessages() {
  const data = await store().get("messages", { type: "json" });
  return data ?? [];
}
async function createMessage(msg) {
  const messages = await getMessages();
  const newMsg = {
    ...msg,
    id: crypto.randomUUID(),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    read: false
  };
  await store().setJSON("messages", [...messages, newMsg]);
  return newMsg;
}
async function markMessageRead(id) {
  const messages = await getMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx !== -1) {
    messages[idx].read = true;
    await store().setJSON("messages", messages);
  }
}
async function deleteMessage(id) {
  const messages = await getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  await store().setJSON("messages", filtered);
  return true;
}
async function getSettings() {
  const data = await store().get("settings", { type: "json" });
  return data ?? { hasResume: false, seeded: false, siteTitle: "Portfolio" };
}
async function setSettings(settings) {
  const current = await getSettings();
  await store().setJSON("settings", { ...current, ...settings });
}
async function getResume() {
  return store().get("resume", { type: "blob" });
}
async function setResume(data) {
  await store().set("resume", data);
  await setSettings({ hasResume: true });
}
async function deleteResume() {
  await store().delete("resume");
  await setSettings({ hasResume: false });
}
const Route$d = createFileRoute("/api/portfolio/skills")({
  server: {
    handlers: {
      GET: async () => {
        const skills = await getSkills();
        return Response.json(skills);
      },
      POST: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        if (body.replace && Array.isArray(body.categories)) {
          await setSkills(body.categories);
          return Response.json(body.categories);
        }
        const cat = await createSkillCategory(body);
        return Response.json(cat, { status: 201 });
      },
      PUT: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const updated = await updateSkillCategory(body.id, body);
        if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(updated);
      },
      DELETE: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await request.json();
        const ok = await deleteSkillCategory(id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      }
    }
  }
});
const Route$c = createFileRoute("/api/portfolio/projects")({
  server: {
    handlers: {
      GET: async () => {
        const projects = await getProjects();
        return Response.json(projects);
      },
      POST: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const project = await createProject(body);
        return Response.json(project, { status: 201 });
      }
    }
  }
});
const Route$b = createFileRoute("/api/portfolio/messages")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const messages = await getMessages();
        return Response.json(messages);
      },
      PUT: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id } = await request.json();
        await markMessageRead(id);
        return Response.json({ success: true });
      }
    }
  }
});
const Route$a = createFileRoute("/api/portfolio/experience")({
  server: {
    handlers: {
      GET: async () => {
        const items = await getExperience();
        return Response.json(items);
      },
      POST: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const item = await createExperience(body);
        return Response.json(item, { status: 201 });
      }
    }
  }
});
const SEED_ABOUT = {
  name: "Shafayatur Rahman",
  role: "AI Engineer & Full-Stack Developer",
  bio: `I'm a passionate AI engineer focused on building intelligent systems that solve real-world problems. With a deep background in machine learning, computer vision, and full-stack development, I bridge the gap between cutting-edge research and production-ready software. I've shipped everything from real-time sign language recognition systems to large-scale NLP pipelines serving millions of requests daily. When I'm not training models, I'm building the interfaces that make them accessible.`,
  location: "San Francisco, CA",
  email: "alex@example.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  highlights: [
    "5+ years in AI/ML engineering",
    "Published research in computer vision",
    "Open source contributor (2k+ GitHub stars)",
    "Speaker at MLConf & PyCon"
  ]
};
const SEED_PROJECTS = [
  {
    id: "proj-1",
    title: "Sign Language Recognition System",
    description: "Real-time American Sign Language (ASL) recognition using deep learning and computer vision. Achieves 96.4% accuracy on the ASL-26 dataset with support for dynamic two-handed gestures and live video inference at 30fps.",
    techStack: ["Python", "TensorFlow", "OpenCV", "MediaPipe", "FastAPI", "React"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
    github: "https://github.com",
    liveUrl: "",
    featured: true,
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "proj-2",
    title: "NLP Document Intelligence Platform",
    description: "Enterprise document classification and extraction platform processing 500k+ documents daily. Leverages fine-tuned BERT models for multi-label classification, named entity recognition, and semantic search across legal and financial documents.",
    techStack: ["Python", "Transformers", "FastAPI", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    github: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
    createdAt: "2024-03-01T00:00:00Z"
  },
  {
    id: "proj-3",
    title: "Real-Time Object Detection Dashboard",
    description: "Production-grade object detection system built on YOLOv8 with a React dashboard for live monitoring, alert configuration, and analytics. Deployed on edge devices with <15ms inference latency.",
    techStack: ["Python", "YOLOv8", "PyTorch", "WebSocket", "React", "TypeScript", "TailwindCSS"],
    image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?w=600&h=400&fit=crop",
    github: "https://github.com",
    liveUrl: "",
    featured: true,
    createdAt: "2023-11-20T00:00:00Z"
  },
  {
    id: "proj-4",
    title: "Conversational AI Customer Support",
    description: "Multi-turn conversational AI for enterprise customer support, reducing ticket volume by 42%. Built with retrieval-augmented generation (RAG) over custom knowledge bases, with human handoff and sentiment analysis.",
    techStack: ["LangChain", "OpenAI", "Pinecone", "Python", "Node.js", "Next.js"],
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400&fit=crop",
    github: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
    createdAt: "2023-08-10T00:00:00Z"
  },
  {
    id: "proj-5",
    title: "ML Pipeline Orchestrator",
    description: "Open-source ML pipeline orchestration tool with a visual DAG editor, experiment tracking, model registry, and one-click deployment to major cloud providers. 2.1k GitHub stars.",
    techStack: ["Python", "Apache Airflow", "MLflow", "React", "FastAPI", "PostgreSQL", "AWS"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    github: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
    createdAt: "2023-05-05T00:00:00Z"
  },
  {
    id: "proj-6",
    title: "Medical Imaging Analysis Tool",
    description: "Deep learning tool for automated analysis of chest X-rays, detecting 14 common pathologies with radiologist-level accuracy. Integrated into a HIPAA-compliant web platform used by 3 hospital networks.",
    techStack: ["Python", "PyTorch", "DICOM", "FastAPI", "React", "AWS S3", "Docker"],
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    github: "",
    liveUrl: "",
    featured: false,
    createdAt: "2022-12-01T00:00:00Z"
  }
];
const SEED_SKILLS = [
  {
    id: "skill-1",
    name: "AI / Machine Learning",
    icon: "🧠",
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Hugging Face", "LangChain", "Computer Vision", "NLP", "MLflow", "ONNX", "CUDA"]
  },
  {
    id: "skill-2",
    name: "Backend",
    icon: "⚙️",
    skills: ["Python", "FastAPI", "Node.js", "Express", "PostgreSQL", "Redis", "MongoDB", "GraphQL", "gRPC", "REST"]
  },
  {
    id: "skill-3",
    name: "Frontend",
    icon: "🎨",
    skills: ["React", "TypeScript", "Next.js", "TanStack", "Tailwind CSS", "Framer Motion", "WebGL", "Three.js"]
  },
  {
    id: "skill-4",
    name: "Infrastructure & Tools",
    icon: "🛠️",
    skills: ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "GitHub Actions", "Apache Airflow", "Prometheus", "Grafana"]
  }
];
const SEED_EXPERIENCE = [
  {
    id: "exp-1",
    type: "work",
    title: "Senior AI/ML Engineer",
    company: "Vertex AI Labs",
    period: "2022 – Present",
    description: "Lead ML engineer building production computer vision and NLP systems. Architected a real-time document intelligence platform processing 500k documents/day. Mentored 4 junior engineers and drove adoption of MLOps best practices.",
    tags: ["Python", "TensorFlow", "Kubernetes", "MLflow", "AWS"]
  },
  {
    id: "exp-2",
    type: "work",
    title: "Machine Learning Engineer",
    company: "DataStream Inc.",
    period: "2020 – 2022",
    description: "Built and maintained ML models for anomaly detection and predictive maintenance across IoT sensor networks. Reduced false positive rate by 38% through feature engineering and ensemble methods.",
    tags: ["Python", "PyTorch", "Spark", "Kafka", "GCP"]
  },
  {
    id: "exp-3",
    type: "work",
    title: "Software Engineer",
    company: "PixelLabs",
    period: "2018 – 2020",
    description: "Full-stack developer building React-based SaaS products with Node.js backends. Led the migration from a monolithic Rails app to a microservices architecture, improving deploy frequency by 4x.",
    tags: ["React", "Node.js", "PostgreSQL", "Docker"]
  },
  {
    id: "exp-4",
    type: "education",
    title: "M.S. Computer Science (AI Specialization)",
    company: "Stanford University",
    period: "2016 – 2018",
    description: 'Graduate research in deep learning and computer vision. Thesis: "Efficient Architectures for Real-Time Gesture Recognition". Published 2 papers at NeurIPS and CVPR workshops.',
    tags: ["Deep Learning", "Computer Vision", "Research"]
  },
  {
    id: "exp-5",
    type: "education",
    title: "B.S. Software Engineering",
    company: "UC Berkeley",
    period: "2012 – 2016",
    description: "Graduated with honors. Specialized in algorithms and systems programming. Active member of the Machine Learning student club and won the 2015 Cal Hacks hackathon.",
    tags: ["Algorithms", "Systems", "Data Structures"]
  }
];
const SEED_CERTIFICATES = [
  {
    id: "cert-1",
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date: "2023",
    image: "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=400&h=280&fit=crop",
    url: "https://credential.net"
  },
  {
    id: "cert-2",
    title: "AWS Machine Learning Specialty",
    issuer: "Amazon Web Services",
    date: "2022",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=280&fit=crop",
    url: "https://aws.amazon.com/certification"
  },
  {
    id: "cert-3",
    title: "Deep Learning Specialization",
    issuer: "deeplearning.ai / Coursera",
    date: "2021",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=280&fit=crop",
    url: "https://coursera.org"
  },
  {
    id: "cert-4",
    title: "Professional Cloud Architect",
    issuer: "Google Cloud",
    date: "2023",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=280&fit=crop",
    url: "https://cloud.google.com/certification"
  },
  {
    id: "cert-5",
    title: "Certified Kubernetes Administrator",
    issuer: "CNCF / Linux Foundation",
    date: "2022",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e7f6101?w=400&h=280&fit=crop",
    url: "https://training.linuxfoundation.org"
  }
];
const SEED_SETTINGS = {
  hasResume: false,
  seeded: true,
  siteTitle: "Shafayatur Rahman — AI Engineer"
};
const Route$9 = createFileRoute("/api/portfolio/data")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const [projects, skills, about, experience, certificates, settings] = await Promise.all([
            getProjects(),
            getSkills(),
            getAbout(),
            getExperience(),
            getCertificates(),
            getSettings()
          ]);
          return Response.json({ projects, skills, about, experience, certificates, settings });
        } catch (err) {
          console.error(err);
          return Response.json({ error: "Failed to fetch data" }, { status: 500 });
        }
      },
      POST: async ({ request }) => {
        const isAdmin = await requireAdmin(request);
        const settings = await getSettings();
        const url = new URL(request.url);
        const force = url.searchParams.get("force") === "true";
        if (!isAdmin && settings.seeded) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (settings.seeded && !force) {
          return Response.json({ message: "Already seeded", seeded: true });
        }
        await Promise.all([
          setProjects(SEED_PROJECTS),
          setSkills(SEED_SKILLS),
          setAbout(SEED_ABOUT),
          setExperience(SEED_EXPERIENCE),
          setCertificates(SEED_CERTIFICATES),
          setSettings({ ...SEED_SETTINGS, seeded: true })
        ]);
        return Response.json({ message: "Seeded successfully" }, { status: 201 });
      }
    }
  }
});
const Route$8 = createFileRoute("/api/portfolio/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { name, email, subject, message } = body;
          if (!name || !email || !message) {
            return Response.json({ error: "Missing required fields" }, { status: 400 });
          }
          const msg = await createMessage({ name, email, subject: subject ?? "Contact Form", message });
          return Response.json({ success: true, id: msg.id }, { status: 201 });
        } catch {
          return Response.json({ error: "Failed to save message" }, { status: 500 });
        }
      }
    }
  }
});
const Route$7 = createFileRoute("/api/portfolio/certificates")({
  server: {
    handlers: {
      GET: async () => {
        const certs = await getCertificates();
        return Response.json(certs);
      },
      POST: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const cert = await createCertificate(body);
        return Response.json(cert, { status: 201 });
      }
    }
  }
});
const Route$6 = createFileRoute("/api/portfolio/about")({
  server: {
    handlers: {
      GET: async () => {
        const about = await getAbout();
        return Response.json(about);
      },
      PUT: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        await setAbout(body);
        return Response.json(body);
      }
    }
  }
});
const Route$5 = createFileRoute("/api/admin/resume")({
  server: {
    handlers: {
      GET: async () => {
        const blob = await getResume();
        if (!blob) return Response.json({ error: "No resume uploaded" }, { status: 404 });
        return new Response(blob, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'inline; filename="resume.pdf"'
          }
        });
      },
      POST: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const formData = await request.formData();
        const file = formData.get("resume");
        if (!file) return Response.json({ error: "No file provided" }, { status: 400 });
        const buffer = await file.arrayBuffer();
        await setResume(buffer);
        return Response.json({ success: true });
      },
      DELETE: async ({ request }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        await deleteResume();
        return new Response(null, { status: 204 });
      }
    }
  }
});
const Route$4 = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { password } = await request.json();
          if (!checkPassword(password)) {
            return Response.json({ error: "Invalid password" }, { status: 401 });
          }
          const token = await createToken();
          return Response.json({ token });
        } catch {
          return Response.json({ error: "Login failed" }, { status: 500 });
        }
      }
    }
  }
});
const Route$3 = createFileRoute("/api/portfolio/projects/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const updated = await updateProject(params.id, body);
        if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(updated);
      },
      DELETE: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const ok = await deleteProject(params.id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      }
    }
  }
});
const Route$2 = createFileRoute("/api/portfolio/messages/$id")({
  server: {
    handlers: {
      DELETE: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const ok = await deleteMessage(params.id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      }
    }
  }
});
const Route$1 = createFileRoute("/api/portfolio/experience/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const updated = await updateExperience(params.id, body);
        if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(updated);
      },
      DELETE: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const ok = await deleteExperience(params.id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      }
    }
  }
});
const Route = createFileRoute("/api/portfolio/certificates/$id")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const updated = await updateCertificate(params.id, body);
        if (!updated) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(updated);
      },
      DELETE: async ({ request, params }) => {
        if (!await requireAdmin(request)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const ok = await deleteCertificate(params.id);
        if (!ok) return Response.json({ error: "Not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      }
    }
  }
});
const ResumeRoute = Route$l.update({
  id: "/resume",
  path: "/resume",
  getParentRoute: () => Route$m
});
const ProjectsRoute = Route$k.update({
  id: "/projects",
  path: "/projects",
  getParentRoute: () => Route$m
});
const ContactRoute = Route$j.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$m
});
const AdminRoute = Route$i.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$m
});
const IndexRoute = Route$h.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$m
});
const AdminIndexRoute = Route$g.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const BlogSlugRoute = Route$f.update({
  id: "/blog/$slug",
  path: "/blog/$slug",
  getParentRoute: () => Route$m
});
const AdminDashboardRoute = Route$e.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AdminRoute
});
const ApiPortfolioSkillsRoute = Route$d.update({
  id: "/api/portfolio/skills",
  path: "/api/portfolio/skills",
  getParentRoute: () => Route$m
});
const ApiPortfolioProjectsRoute = Route$c.update({
  id: "/api/portfolio/projects",
  path: "/api/portfolio/projects",
  getParentRoute: () => Route$m
});
const ApiPortfolioMessagesRoute = Route$b.update({
  id: "/api/portfolio/messages",
  path: "/api/portfolio/messages",
  getParentRoute: () => Route$m
});
const ApiPortfolioExperienceRoute = Route$a.update({
  id: "/api/portfolio/experience",
  path: "/api/portfolio/experience",
  getParentRoute: () => Route$m
});
const ApiPortfolioDataRoute = Route$9.update({
  id: "/api/portfolio/data",
  path: "/api/portfolio/data",
  getParentRoute: () => Route$m
});
const ApiPortfolioContactRoute = Route$8.update({
  id: "/api/portfolio/contact",
  path: "/api/portfolio/contact",
  getParentRoute: () => Route$m
});
const ApiPortfolioCertificatesRoute = Route$7.update({
  id: "/api/portfolio/certificates",
  path: "/api/portfolio/certificates",
  getParentRoute: () => Route$m
});
const ApiPortfolioAboutRoute = Route$6.update({
  id: "/api/portfolio/about",
  path: "/api/portfolio/about",
  getParentRoute: () => Route$m
});
const ApiAdminResumeRoute = Route$5.update({
  id: "/api/admin/resume",
  path: "/api/admin/resume",
  getParentRoute: () => Route$m
});
const ApiAdminLoginRoute = Route$4.update({
  id: "/api/admin/login",
  path: "/api/admin/login",
  getParentRoute: () => Route$m
});
const ApiPortfolioProjectsIdRoute = Route$3.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => ApiPortfolioProjectsRoute
});
const ApiPortfolioMessagesIdRoute = Route$2.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => ApiPortfolioMessagesRoute
});
const ApiPortfolioExperienceIdRoute = Route$1.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => ApiPortfolioExperienceRoute
});
const ApiPortfolioCertificatesIdRoute = Route.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => ApiPortfolioCertificatesRoute
});
const AdminRouteChildren = {
  AdminDashboardRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const ApiPortfolioCertificatesRouteChildren = {
  ApiPortfolioCertificatesIdRoute
};
const ApiPortfolioCertificatesRouteWithChildren = ApiPortfolioCertificatesRoute._addFileChildren(
  ApiPortfolioCertificatesRouteChildren
);
const ApiPortfolioExperienceRouteChildren = {
  ApiPortfolioExperienceIdRoute
};
const ApiPortfolioExperienceRouteWithChildren = ApiPortfolioExperienceRoute._addFileChildren(
  ApiPortfolioExperienceRouteChildren
);
const ApiPortfolioMessagesRouteChildren = {
  ApiPortfolioMessagesIdRoute
};
const ApiPortfolioMessagesRouteWithChildren = ApiPortfolioMessagesRoute._addFileChildren(ApiPortfolioMessagesRouteChildren);
const ApiPortfolioProjectsRouteChildren = {
  ApiPortfolioProjectsIdRoute
};
const ApiPortfolioProjectsRouteWithChildren = ApiPortfolioProjectsRoute._addFileChildren(ApiPortfolioProjectsRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  ContactRoute,
  ProjectsRoute,
  ResumeRoute,
  BlogSlugRoute,
  ApiAdminLoginRoute,
  ApiAdminResumeRoute,
  ApiPortfolioAboutRoute,
  ApiPortfolioCertificatesRoute: ApiPortfolioCertificatesRouteWithChildren,
  ApiPortfolioContactRoute,
  ApiPortfolioDataRoute,
  ApiPortfolioExperienceRoute: ApiPortfolioExperienceRouteWithChildren,
  ApiPortfolioMessagesRoute: ApiPortfolioMessagesRouteWithChildren,
  ApiPortfolioProjectsRoute: ApiPortfolioProjectsRouteWithChildren,
  ApiPortfolioSkillsRoute
};
const routeTree = Route$m._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$f as R,
  router as r
};
