import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { LayoutDashboard, Briefcase, Code2, User, Clock, Award, MessageSquare, FileText, Eye, Database, LogOut, Edit3, Trash2, Save, X } from "lucide-react";
function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [about, setAbout] = useState(null);
  const [experience, setExperience] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    document.body.classList.add("admin-mode");
    const t = localStorage.getItem("admin_token");
    if (!t) {
      window.location.href = "/admin";
      return;
    }
    setToken(t);
    return () => document.body.classList.remove("admin-mode");
  }, []);
  const authHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }), [token]);
  const showToast = (text, type = "success") => {
    setToast({
      text,
      type
    });
    setTimeout(() => setToast(null), 3e3);
  };
  const loadAll = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [dataRes, msgRes] = await Promise.all([fetch("/api/portfolio/data"), fetch("/api/portfolio/messages", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })]);
      if (dataRes.ok) {
        const d = await dataRes.json();
        setProjects(d.projects ?? []);
        setSkills(d.skills ?? []);
        setAbout(d.about ?? null);
        setExperience(d.experience ?? []);
        setCertificates(d.certificates ?? []);
        setHasResume(d.settings?.hasResume ?? false);
      }
      if (msgRes.ok) {
        setMessages(await msgRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, [token]);
  useEffect(() => {
    if (token) loadAll();
  }, [token, loadAll]);
  const logout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin";
  };
  const reseed = async () => {
    if (!confirm("This will reset all demo data. Continue?")) return;
    await fetch("/api/portfolio/data?force=true", {
      method: "POST",
      headers: authHeaders()
    });
    await loadAll();
    showToast("Demo data reset successfully");
  };
  const NAV_ITEMS = [{
    id: "overview",
    icon: /* @__PURE__ */ jsx(LayoutDashboard, { size: 16 }),
    label: "Overview"
  }, {
    id: "projects",
    icon: /* @__PURE__ */ jsx(Briefcase, { size: 16 }),
    label: "Projects",
    badge: projects.length
  }, {
    id: "skills",
    icon: /* @__PURE__ */ jsx(Code2, { size: 16 }),
    label: "Skills"
  }, {
    id: "about",
    icon: /* @__PURE__ */ jsx(User, { size: 16 }),
    label: "About"
  }, {
    id: "experience",
    icon: /* @__PURE__ */ jsx(Clock, { size: 16 }),
    label: "Experience",
    badge: experience.length
  }, {
    id: "certificates",
    icon: /* @__PURE__ */ jsx(Award, { size: 16 }),
    label: "Certificates",
    badge: certificates.length
  }, {
    id: "messages",
    icon: /* @__PURE__ */ jsx(MessageSquare, { size: 16 }),
    label: "Messages",
    badge: messages.filter((m) => !m.read).length || void 0
  }, {
    id: "resume",
    icon: /* @__PURE__ */ jsx(FileText, { size: 16 }),
    label: "Resume"
  }];
  const sidebarStyle = {
    width: 240,
    background: "#0f0f0f",
    borderRight: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    flexShrink: 0,
    height: "100vh",
    position: "sticky",
    top: 0,
    overflowY: "auto"
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    minHeight: "100vh",
    background: "#0a0a0a",
    fontFamily: "Inter, sans-serif"
  }, children: [
    /* @__PURE__ */ jsxs("aside", { style: sidebarStyle, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        marginBottom: 24
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg,#6366f1,#a855f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx("span", { style: {
          color: "#fff",
          fontWeight: 700,
          fontSize: "0.85rem"
        }, children: "SR" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: {
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#f0f0f0"
          }, children: "Admin" }),
          /* @__PURE__ */ jsx("p", { style: {
            fontSize: "0.7rem",
            color: "rgba(232,232,232,0.4)"
          }, children: "Portfolio CMS" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { style: {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1
      }, children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsxs("button", { className: `admin-nav-item ${section === item.id ? "active" : ""}`, onClick: () => setSection(item.id), children: [
        item.icon,
        /* @__PURE__ */ jsx("span", { style: {
          flex: 1
        }, children: item.label }),
        item.badge != null && item.badge > 0 && /* @__PURE__ */ jsx("span", { style: {
          background: item.id === "messages" ? "linear-gradient(135deg,#6366f1,#a855f7)" : "rgba(99,102,241,0.2)",
          color: item.id === "messages" ? "#fff" : "#a5b4fc",
          borderRadius: 100,
          padding: "1px 7px",
          fontSize: "0.7rem",
          fontWeight: 600
        }, children: item.badge })
      ] }, item.id)) }),
      /* @__PURE__ */ jsxs("div", { style: {
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: 16,
        marginTop: 16,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }, children: [
        /* @__PURE__ */ jsxs("a", { href: "/", target: "_blank", className: "admin-nav-item", children: [
          /* @__PURE__ */ jsx(Eye, { size: 16 }),
          " View Site"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "admin-nav-item", onClick: reseed, children: [
          /* @__PURE__ */ jsx(Database, { size: 16 }),
          " Reset Demo Data"
        ] }),
        /* @__PURE__ */ jsxs("button", { className: "admin-nav-item", onClick: logout, style: {
          color: "rgba(248,113,113,0.7)"
        }, children: [
          /* @__PURE__ */ jsx(LogOut, { size: 16 }),
          " Logout"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { style: {
      flex: 1,
      overflowY: "auto",
      padding: 32
    }, children: loading ? /* @__PURE__ */ jsx("div", { style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: 200
    }, children: /* @__PURE__ */ jsx("div", { style: {
      width: 32,
      height: 32,
      border: "3px solid rgba(99,102,241,0.3)",
      borderTopColor: "#6366f1",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite"
    } }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      section === "overview" && /* @__PURE__ */ jsx(OverviewSection, { projects, messages, experience, certificates }),
      section === "projects" && /* @__PURE__ */ jsx(ProjectsAdmin, { projects, setProjects, token, showToast }),
      section === "skills" && /* @__PURE__ */ jsx(SkillsAdmin, { skills, setSkills, token, showToast }),
      section === "about" && /* @__PURE__ */ jsx(AboutAdmin, { about, setAbout, token, showToast }),
      section === "experience" && /* @__PURE__ */ jsx(ExperienceAdmin, { experience, setExperience, token, showToast }),
      section === "certificates" && /* @__PURE__ */ jsx(CertificatesAdmin, { certificates, setCertificates, token, showToast }),
      section === "messages" && /* @__PURE__ */ jsx(MessagesAdmin, { messages, setMessages, token, showToast }),
      section === "resume" && /* @__PURE__ */ jsx(ResumeAdmin, { hasResume, setHasResume, token, showToast })
    ] }) }),
    toast && /* @__PURE__ */ jsx("div", { style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      background: toast.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(248,113,113,0.15)",
      border: `1px solid ${toast.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(248,113,113,0.3)"}`,
      color: toast.type === "success" ? "#86efac" : "#fca5a5",
      padding: "12px 20px",
      borderRadius: 10,
      fontSize: "0.875rem",
      fontWeight: 500,
      zIndex: 9999,
      animation: "fadeUp 0.3s ease"
    }, children: toast.text })
  ] });
}
function OverviewSection({
  projects,
  messages,
  experience,
  certificates
}) {
  const stats = [{
    label: "Projects",
    value: projects.length,
    icon: /* @__PURE__ */ jsx(Briefcase, { size: 20 }),
    color: "#6366f1"
  }, {
    label: "Unread Messages",
    value: messages.filter((m) => !m.read).length,
    icon: /* @__PURE__ */ jsx(MessageSquare, { size: 20 }),
    color: "#a855f7"
  }, {
    label: "Experience Entries",
    value: experience.length,
    icon: /* @__PURE__ */ jsx(Clock, { size: 20 }),
    color: "#ec4899"
  }, {
    label: "Certificates",
    value: certificates.length,
    icon: /* @__PURE__ */ jsx(Award, { size: 20 }),
    color: "#f59e0b"
  }];
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Overview", subtitle: "Your portfolio at a glance" }),
    /* @__PURE__ */ jsx("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: 16,
      marginBottom: 32
    }, children: stats.map((s) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
      padding: 24
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          color: s.color
        }, children: s.icon }),
        /* @__PURE__ */ jsx("span", { style: {
          fontSize: "2rem",
          fontWeight: 700,
          color: "#f0f0f0",
          fontFamily: "'Space Grotesk', sans-serif"
        }, children: s.value })
      ] }),
      /* @__PURE__ */ jsx("p", { style: {
        color: "rgba(232,232,232,0.5)",
        fontSize: "0.85rem"
      }, children: s.label })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
      padding: 24
    }, children: [
      /* @__PURE__ */ jsx("h3", { style: {
        fontWeight: 600,
        color: "#f0f0f0",
        marginBottom: 16,
        fontSize: "0.95rem"
      }, children: "Recent Messages" }),
      messages.length === 0 ? /* @__PURE__ */ jsx("p", { style: {
        color: "rgba(232,232,232,0.4)",
        fontSize: "0.875rem"
      }, children: "No messages yet." }) : /* @__PURE__ */ jsx("div", { style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }, children: messages.slice(-5).reverse().map((m) => /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: "1px solid rgba(255,255,255,0.05)"
      }, children: [
        !m.read && /* @__PURE__ */ jsx("div", { style: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#6366f1",
          flexShrink: 0
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1,
          minWidth: 0
        }, children: [
          /* @__PURE__ */ jsxs("p", { style: {
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "#f0f0f0",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }, children: [
            m.name,
            " — ",
            m.subject
          ] }),
          /* @__PURE__ */ jsx("p", { style: {
            fontSize: "0.75rem",
            color: "rgba(232,232,232,0.4)"
          }, children: new Date(m.createdAt).toLocaleDateString() })
        ] })
      ] }, m.id)) })
    ] })
  ] });
}
function ProjectsAdmin({
  projects,
  setProjects,
  token,
  showToast
}) {
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const blankProject = {
    title: "",
    description: "",
    techStack: [],
    image: "",
    github: "",
    liveUrl: "",
    featured: false
  };
  const save = async () => {
    if (!editing) return;
    const techStack = typeof editing.techStack === "string" ? editing.techStack.split(",").map((s) => s.trim()).filter(Boolean) : editing.techStack ?? [];
    const payload = {
      ...editing,
      techStack
    };
    if (isNew) {
      const res = await fetch("/api/portfolio/projects", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const p = await res.json();
        setProjects([...projects, p]);
        showToast("Project created");
      } else showToast("Failed to create", "error");
    } else {
      const res = await fetch(`/api/portfolio/projects/${editing.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const p = await res.json();
        setProjects(projects.map((x) => x.id === p.id ? p : x));
        showToast("Project updated");
      } else showToast("Failed to update", "error");
    }
    setEditing(null);
  };
  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/portfolio/projects/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) {
      setProjects(projects.filter((p) => p.id !== id));
      showToast("Project deleted");
    } else showToast("Failed to delete", "error");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Projects", subtitle: `${projects.length} projects`, action: {
      label: "+ Add Project",
      onClick: () => {
        setEditing(blankProject);
        setIsNew(true);
      }
    } }),
    editing && /* @__PURE__ */ jsxs(FormModal, { title: isNew ? "New Project" : "Edit Project", onClose: () => setEditing(null), onSave: save, children: [
      /* @__PURE__ */ jsx(FormRow, { label: "Title", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.title ?? "", onChange: (v) => setEditing({
        ...editing,
        title: v
      }), placeholder: "Project title" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Description", children: /* @__PURE__ */ jsx(AdminTextarea, { value: editing.description ?? "", onChange: (v) => setEditing({
        ...editing,
        description: v
      }), rows: 4, placeholder: "Project description" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Tech Stack (comma-separated)", children: /* @__PURE__ */ jsx(AdminInput, { value: Array.isArray(editing.techStack) ? editing.techStack.join(", ") : editing.techStack ?? "", onChange: (v) => setEditing({
        ...editing,
        techStack: v
      }), placeholder: "React, TypeScript, Python" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Image URL", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.image ?? "", onChange: (v) => setEditing({
        ...editing,
        image: v
      }), placeholder: "https://..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "GitHub URL", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.github ?? "", onChange: (v) => setEditing({
        ...editing,
        github: v
      }), placeholder: "https://github.com/..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Live URL", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.liveUrl ?? "", onChange: (v) => setEditing({
        ...editing,
        liveUrl: v
      }), placeholder: "https://..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Featured", children: /* @__PURE__ */ jsxs("label", { style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        color: "#e8e8e8",
        fontSize: "0.875rem"
      }, children: [
        /* @__PURE__ */ jsx("input", { type: "checkbox", checked: editing.featured ?? false, onChange: (e) => setEditing({
          ...editing,
          featured: e.target.checked
        }), style: {
          width: 16,
          height: 16,
          accentColor: "#6366f1"
        } }),
        "Show as featured project"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }, children: [
      projects.map((p) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16
      }, children: [
        p.image && /* @__PURE__ */ jsx("img", { src: p.image, alt: p.title, style: {
          width: 60,
          height: 44,
          objectFit: "cover",
          borderRadius: 6,
          flexShrink: 0
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1,
          minWidth: 0
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4
          }, children: [
            /* @__PURE__ */ jsx("p", { style: {
              fontWeight: 600,
              color: "#f0f0f0",
              fontSize: "0.9rem"
            }, children: p.title }),
            p.featured && /* @__PURE__ */ jsx("span", { style: {
              background: "rgba(99,102,241,0.2)",
              color: "#a5b4fc",
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: "0.65rem"
            }, children: "FEATURED" })
          ] }),
          /* @__PURE__ */ jsx("p", { style: {
            color: "rgba(232,232,232,0.4)",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }, children: p.techStack.join(" · ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: 8,
          flexShrink: 0
        }, children: [
          /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => {
            setEditing(p);
            setIsNew(false);
          }, icon: /* @__PURE__ */ jsx(Edit3, { size: 14 }) }),
          /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => remove(p.id), icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }), danger: true })
        ] })
      ] }, p.id)),
      projects.length === 0 && /* @__PURE__ */ jsx(EmptyState, { message: "No projects yet. Add your first project!" })
    ] })
  ] });
}
function SkillsAdmin({
  skills,
  setSkills,
  token,
  showToast
}) {
  const [editing, setEditing] = useState(null);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const save = async () => {
    if (!editing) return;
    const skillsList = typeof editing.skills === "string" ? editing.skills.split(",").map((s) => s.trim()).filter(Boolean) : editing.skills;
    const updated = skills.find((s) => s.id === editing.id) ? skills.map((s) => s.id === editing.id ? {
      ...editing,
      skills: skillsList
    } : s) : [...skills, {
      ...editing,
      id: crypto.randomUUID(),
      skills: skillsList
    }];
    const res = await fetch("/api/portfolio/skills", {
      method: "POST",
      headers,
      body: JSON.stringify({
        replace: true,
        categories: updated
      })
    });
    if (res.ok) {
      setSkills(updated);
      showToast("Skills saved");
    } else showToast("Failed to save", "error");
    setEditing(null);
  };
  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    const updated = skills.filter((s) => s.id !== id);
    await fetch("/api/portfolio/skills", {
      method: "POST",
      headers,
      body: JSON.stringify({
        replace: true,
        categories: updated
      })
    });
    setSkills(updated);
    showToast("Category deleted");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Skills", subtitle: "Manage skill categories", action: {
      label: "+ Add Category",
      onClick: () => setEditing({
        id: "",
        name: "",
        icon: "🛠️",
        skills: []
      })
    } }),
    editing && /* @__PURE__ */ jsxs(FormModal, { title: "Skill Category", onClose: () => setEditing(null), onSave: save, children: [
      /* @__PURE__ */ jsx(FormRow, { label: "Category Name", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.name, onChange: (v) => setEditing({
        ...editing,
        name: v
      }), placeholder: "AI / ML" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Icon (emoji)", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.icon, onChange: (v) => setEditing({
        ...editing,
        icon: v
      }), placeholder: "🧠" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Skills (comma-separated)", children: /* @__PURE__ */ jsx(AdminTextarea, { value: Array.isArray(editing.skills) ? editing.skills.join(", ") : editing.skills, onChange: (v) => setEditing({
        ...editing,
        skills: v
      }), placeholder: "TensorFlow, PyTorch, OpenCV", rows: 3 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16
    }, children: [
      skills.map((cat) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
        padding: 20
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12
        }, children: [
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            alignItems: "center",
            gap: 8
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: "1.2rem"
            }, children: cat.icon }),
            /* @__PURE__ */ jsx("p", { style: {
              fontWeight: 600,
              color: "#f0f0f0",
              fontSize: "0.9rem"
            }, children: cat.name })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            gap: 6
          }, children: [
            /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => setEditing(cat), icon: /* @__PURE__ */ jsx(Edit3, { size: 13 }) }),
            /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => remove(cat.id), icon: /* @__PURE__ */ jsx(Trash2, { size: 13 }), danger: true })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6
        }, children: cat.skills.map((s) => /* @__PURE__ */ jsx("span", { className: "skill-tag", style: {
          fontSize: "0.7rem"
        }, children: s }, s)) })
      ] }, cat.id)),
      skills.length === 0 && /* @__PURE__ */ jsx(EmptyState, { message: "No skill categories yet." })
    ] })
  ] });
}
function AboutAdmin({
  about,
  setAbout,
  token,
  showToast
}) {
  const [form, setForm] = useState(about ?? {
    name: "",
    role: "",
    bio: "",
    location: "",
    email: "",
    github: "",
    linkedin: "",
    twitter: "",
    profileImage: "",
    highlights: []
  });
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (about) setForm(about);
  }, [about]);
  const save = async () => {
    setSaving(true);
    const highlights = typeof form.highlights === "string" ? form.highlights.split("\n").filter(Boolean) : form.highlights;
    const res = await fetch("/api/portfolio/about", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        highlights
      })
    });
    setSaving(false);
    if (res.ok) {
      setAbout({
        ...form,
        highlights
      });
      showToast("About section saved");
    } else showToast("Failed to save", "error");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "About", subtitle: "Edit your profile" }),
    /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
      padding: 32,
      display: "flex",
      flexDirection: "column",
      gap: 20,
      maxWidth: 720
    }, children: [
      /* @__PURE__ */ jsx(FormRow, { label: "Full Name", children: /* @__PURE__ */ jsx(AdminInput, { value: form.name, onChange: (v) => setForm({
        ...form,
        name: v
      }), placeholder: "Your name" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Role / Title", children: /* @__PURE__ */ jsx(AdminInput, { value: form.role, onChange: (v) => setForm({
        ...form,
        role: v
      }), placeholder: "AI Engineer" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Bio", children: /* @__PURE__ */ jsx(AdminTextarea, { value: form.bio, onChange: (v) => setForm({
        ...form,
        bio: v
      }), rows: 5, placeholder: "Tell your story..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Location", children: /* @__PURE__ */ jsx(AdminInput, { value: form.location, onChange: (v) => setForm({
        ...form,
        location: v
      }), placeholder: "San Francisco, CA" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Email", children: /* @__PURE__ */ jsx(AdminInput, { value: form.email, onChange: (v) => setForm({
        ...form,
        email: v
      }), placeholder: "you@example.com" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "GitHub URL", children: /* @__PURE__ */ jsx(AdminInput, { value: form.github, onChange: (v) => setForm({
        ...form,
        github: v
      }), placeholder: "https://github.com/..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "LinkedIn URL", children: /* @__PURE__ */ jsx(AdminInput, { value: form.linkedin, onChange: (v) => setForm({
        ...form,
        linkedin: v
      }), placeholder: "https://linkedin.com/in/..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Twitter URL", children: /* @__PURE__ */ jsx(AdminInput, { value: form.twitter ?? "", onChange: (v) => setForm({
        ...form,
        twitter: v
      }), placeholder: "https://twitter.com/..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Profile Image URL", children: /* @__PURE__ */ jsx(AdminInput, { value: form.profileImage ?? "", onChange: (v) => setForm({
        ...form,
        profileImage: v
      }), placeholder: "https://..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Highlights (one per line)", children: /* @__PURE__ */ jsx(AdminTextarea, { value: Array.isArray(form.highlights) ? form.highlights.join("\n") : form.highlights, onChange: (v) => setForm({
        ...form,
        highlights: v
      }), rows: 4, placeholder: "5+ years in AI/ML\nPublished research..." }) }),
      /* @__PURE__ */ jsx("button", { onClick: save, disabled: saving, className: "glow-button glow-button-primary", style: {
        alignSelf: "flex-start",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8
      }, children: saving ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 14,
          height: 14,
          border: "2px solid rgba(255,255,255,0.3)",
          borderTopColor: "#fff",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        } }),
        " Saving…"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Save, { size: 14 }),
        " Save Changes"
      ] }) })
    ] })
  ] });
}
function ExperienceAdmin({
  experience,
  setExperience,
  token,
  showToast
}) {
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const blank = {
    type: "work",
    title: "",
    company: "",
    period: "",
    description: "",
    tags: []
  };
  const save = async () => {
    if (!editing) return;
    const tags = typeof editing.tags === "string" ? editing.tags.split(",").map((s) => s.trim()).filter(Boolean) : editing.tags ?? [];
    const payload = {
      ...editing,
      tags
    };
    if (isNew) {
      const res = await fetch("/api/portfolio/experience", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const e = await res.json();
        setExperience([...experience, e]);
        showToast("Entry added");
      } else showToast("Failed", "error");
    } else {
      const res = await fetch(`/api/portfolio/experience/${editing.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const e = await res.json();
        setExperience(experience.map((x) => x.id === e.id ? e : x));
        showToast("Entry updated");
      } else showToast("Failed", "error");
    }
    setEditing(null);
  };
  const remove = async (id) => {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/portfolio/experience/${id}`, {
      method: "DELETE",
      headers
    });
    if (res.ok) {
      setExperience(experience.filter((e) => e.id !== id));
      showToast("Deleted");
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Experience & Education", subtitle: "Manage your timeline", action: {
      label: "+ Add Entry",
      onClick: () => {
        setEditing(blank);
        setIsNew(true);
      }
    } }),
    editing && /* @__PURE__ */ jsxs(FormModal, { title: isNew ? "New Entry" : "Edit Entry", onClose: () => setEditing(null), onSave: save, children: [
      /* @__PURE__ */ jsx(FormRow, { label: "Type", children: /* @__PURE__ */ jsxs("select", { value: editing.type ?? "work", onChange: (e) => setEditing({
        ...editing,
        type: e.target.value
      }), style: {
        width: "100%",
        ...inputBaseStyle
      }, children: [
        /* @__PURE__ */ jsx("option", { value: "work", children: "Work" }),
        /* @__PURE__ */ jsx("option", { value: "education", children: "Education" })
      ] }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Title", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.title ?? "", onChange: (v) => setEditing({
        ...editing,
        title: v
      }), placeholder: "Software Engineer" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Company / School", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.company ?? "", onChange: (v) => setEditing({
        ...editing,
        company: v
      }), placeholder: "Company name" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Period", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.period ?? "", onChange: (v) => setEditing({
        ...editing,
        period: v
      }), placeholder: "2021 – Present" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Description", children: /* @__PURE__ */ jsx(AdminTextarea, { value: editing.description ?? "", onChange: (v) => setEditing({
        ...editing,
        description: v
      }), rows: 3, placeholder: "What you did..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Tags (comma-separated)", children: /* @__PURE__ */ jsx(AdminInput, { value: Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags ?? "", onChange: (v) => setEditing({
        ...editing,
        tags: v
      }), placeholder: "Python, React, AWS" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }, children: [
      experience.map((e) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: e.type === "work" ? "#6366f1" : "#a855f7",
          flexShrink: 0
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          flex: 1,
          minWidth: 0
        }, children: [
          /* @__PURE__ */ jsx("p", { style: {
            fontWeight: 600,
            color: "#f0f0f0",
            fontSize: "0.9rem"
          }, children: e.title }),
          /* @__PURE__ */ jsxs("p", { style: {
            color: "rgba(232,232,232,0.4)",
            fontSize: "0.8rem"
          }, children: [
            e.company,
            " · ",
            e.period
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          gap: 8
        }, children: [
          /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => {
            setEditing(e);
            setIsNew(false);
          }, icon: /* @__PURE__ */ jsx(Edit3, { size: 14 }) }),
          /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => remove(e.id), icon: /* @__PURE__ */ jsx(Trash2, { size: 14 }), danger: true })
        ] })
      ] }, e.id)),
      experience.length === 0 && /* @__PURE__ */ jsx(EmptyState, { message: "No experience entries yet." })
    ] })
  ] });
}
function CertificatesAdmin({
  certificates,
  setCertificates,
  token,
  showToast
}) {
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const blank = {
    title: "",
    issuer: "",
    date: "",
    image: "",
    url: ""
  };
  const save = async () => {
    if (!editing) return;
    if (isNew) {
      const res = await fetch("/api/portfolio/certificates", {
        method: "POST",
        headers,
        body: JSON.stringify(editing)
      });
      if (res.ok) {
        const c = await res.json();
        setCertificates([...certificates, c]);
        showToast("Certificate added");
      }
    } else {
      const res = await fetch(`/api/portfolio/certificates/${editing.id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(editing)
      });
      if (res.ok) {
        const c = await res.json();
        setCertificates(certificates.map((x) => x.id === c.id ? c : x));
        showToast("Updated");
      }
    }
    setEditing(null);
  };
  const remove = async (id) => {
    if (!confirm("Delete this certificate?")) return;
    await fetch(`/api/portfolio/certificates/${id}`, {
      method: "DELETE",
      headers
    });
    setCertificates(certificates.filter((c) => c.id !== id));
    showToast("Deleted");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Certificates", subtitle: "Manage your credentials", action: {
      label: "+ Add Certificate",
      onClick: () => {
        setEditing(blank);
        setIsNew(true);
      }
    } }),
    editing && /* @__PURE__ */ jsxs(FormModal, { title: isNew ? "New Certificate" : "Edit Certificate", onClose: () => setEditing(null), onSave: save, children: [
      /* @__PURE__ */ jsx(FormRow, { label: "Title", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.title ?? "", onChange: (v) => setEditing({
        ...editing,
        title: v
      }), placeholder: "TensorFlow Developer Certificate" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Issuer", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.issuer ?? "", onChange: (v) => setEditing({
        ...editing,
        issuer: v
      }), placeholder: "Google" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Date", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.date ?? "", onChange: (v) => setEditing({
        ...editing,
        date: v
      }), placeholder: "2023" }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Image URL", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.image ?? "", onChange: (v) => setEditing({
        ...editing,
        image: v
      }), placeholder: "https://..." }) }),
      /* @__PURE__ */ jsx(FormRow, { label: "Certificate URL", children: /* @__PURE__ */ jsx(AdminInput, { value: editing.url ?? "", onChange: (v) => setEditing({
        ...editing,
        url: v
      }), placeholder: "https://credential.net/..." }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
      gap: 16
    }, children: [
      certificates.map((c) => /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
        overflow: "hidden"
      }, children: [
        c.image && /* @__PURE__ */ jsx("img", { src: c.image, alt: c.title, style: {
          width: "100%",
          height: 120,
          objectFit: "cover"
        } }),
        /* @__PURE__ */ jsxs("div", { style: {
          padding: 16
        }, children: [
          /* @__PURE__ */ jsx("p", { style: {
            fontWeight: 600,
            color: "#f0f0f0",
            fontSize: "0.875rem",
            marginBottom: 4
          }, children: c.title }),
          /* @__PURE__ */ jsxs("p", { style: {
            color: "rgba(232,232,232,0.5)",
            fontSize: "0.8rem",
            marginBottom: 12
          }, children: [
            c.issuer,
            " · ",
            c.date
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            gap: 8
          }, children: [
            /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => {
              setEditing(c);
              setIsNew(false);
            }, icon: /* @__PURE__ */ jsx(Edit3, { size: 13 }) }),
            /* @__PURE__ */ jsx(AdminIconButton, { onClick: () => remove(c.id), icon: /* @__PURE__ */ jsx(Trash2, { size: 13 }), danger: true })
          ] })
        ] })
      ] }, c.id)),
      certificates.length === 0 && /* @__PURE__ */ jsx(EmptyState, { message: "No certificates yet." })
    ] })
  ] });
}
function MessagesAdmin({
  messages,
  setMessages,
  token,
  showToast
}) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
  const [selected, setSelected] = useState(null);
  const markRead = async (id) => {
    await fetch("/api/portfolio/messages", {
      method: "PUT",
      headers,
      body: JSON.stringify({
        id
      })
    });
    setMessages(messages.map((m) => m.id === id ? {
      ...m,
      read: true
    } : m));
  };
  const remove = async (id) => {
    await fetch(`/api/portfolio/messages/${id}`, {
      method: "DELETE",
      headers
    });
    setMessages(messages.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    showToast("Message deleted");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Messages", subtitle: `${messages.filter((m) => !m.read).length} unread` }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "grid",
      gridTemplateColumns: selected ? "1fr 1fr" : "1fr",
      gap: 16
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }, children: [
        messages.length === 0 && /* @__PURE__ */ jsx(EmptyState, { message: "No messages yet." }),
        [...messages].reverse().map((m) => /* @__PURE__ */ jsxs("div", { onClick: () => {
          setSelected(m);
          if (!m.read) markRead(m.id);
        }, className: "glass-card", style: {
          padding: "14px 18px",
          cursor: "pointer",
          borderColor: selected?.id === m.id ? "rgba(99,102,241,0.4)" : void 0,
          display: "flex",
          alignItems: "center",
          gap: 12
        }, children: [
          !m.read && /* @__PURE__ */ jsx("div", { style: {
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#6366f1",
            flexShrink: 0
          } }),
          /* @__PURE__ */ jsxs("div", { style: {
            flex: 1,
            minWidth: 0
          }, children: [
            /* @__PURE__ */ jsx("p", { style: {
              fontWeight: m.read ? 400 : 600,
              color: "#f0f0f0",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: m.name }),
            /* @__PURE__ */ jsx("p", { style: {
              color: "rgba(232,232,232,0.4)",
              fontSize: "0.75rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }, children: m.subject })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: {
            display: "flex",
            gap: 6,
            flexShrink: 0
          }, children: [
            /* @__PURE__ */ jsx("span", { style: {
              fontSize: "0.7rem",
              color: "rgba(232,232,232,0.3)"
            }, children: new Date(m.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsx(AdminIconButton, { onClick: (e) => {
              e.stopPropagation();
              remove(m.id);
            }, icon: /* @__PURE__ */ jsx(Trash2, { size: 12 }), danger: true })
          ] })
        ] }, m.id))
      ] }),
      selected && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: {
        padding: 24
      }, children: [
        /* @__PURE__ */ jsxs("div", { style: {
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20
        }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { style: {
              fontWeight: 600,
              color: "#f0f0f0",
              marginBottom: 4
            }, children: selected.subject }),
            /* @__PURE__ */ jsxs("p", { style: {
              color: "rgba(232,232,232,0.5)",
              fontSize: "0.8rem"
            }, children: [
              "From: ",
              selected.name,
              " <",
              selected.email,
              ">"
            ] })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setSelected(null), style: {
            background: "none",
            border: "none",
            color: "rgba(232,232,232,0.4)",
            cursor: "pointer"
          }, children: /* @__PURE__ */ jsx(X, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsx("p", { style: {
          color: "rgba(232,232,232,0.7)",
          lineHeight: 1.7,
          fontSize: "0.9rem"
        }, children: selected.message }),
        /* @__PURE__ */ jsx("div", { style: {
          marginTop: 20,
          display: "flex",
          gap: 8
        }, children: /* @__PURE__ */ jsx("a", { href: `mailto:${selected.email}`, className: "glow-button glow-button-primary", style: {
          textDecoration: "none",
          fontSize: "0.8rem",
          padding: "8px 16px"
        }, children: "Reply via Email" }) })
      ] })
    ] })
  ] });
}
function ResumeAdmin({
  hasResume,
  setHasResume,
  token,
  showToast
}) {
  const [uploading, setUploading] = useState(false);
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("resume", file);
    const res = await fetch("/api/admin/resume", {
      method: "POST",
      headers,
      body: fd
    });
    setUploading(false);
    if (res.ok) {
      setHasResume(true);
      showToast("Resume uploaded successfully");
    } else showToast("Upload failed", "error");
  };
  const remove = async () => {
    if (!confirm("Delete resume?")) return;
    await fetch("/api/admin/resume", {
      method: "DELETE",
      headers
    });
    setHasResume(false);
    showToast("Resume deleted");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(AdminHeader, { title: "Resume", subtitle: "Manage your downloadable resume" }),
    /* @__PURE__ */ jsx("div", { className: "glass-card", style: {
      padding: 32,
      maxWidth: 480
    }, children: hasResume ? /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      alignItems: "flex-start"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }, children: /* @__PURE__ */ jsx(FileText, { size: 20, color: "#6366f1" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { style: {
            fontWeight: 600,
            color: "#f0f0f0",
            fontSize: "0.95rem"
          }, children: "resume.pdf" }),
          /* @__PURE__ */ jsx("p", { style: {
            color: "rgba(232,232,232,0.4)",
            fontSize: "0.8rem"
          }, children: "Uploaded and active" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { style: {
        display: "flex",
        gap: 10
      }, children: [
        /* @__PURE__ */ jsx("a", { href: "/api/admin/resume", target: "_blank", rel: "noreferrer", className: "glow-button glow-button-outline", style: {
          textDecoration: "none",
          fontSize: "0.85rem",
          padding: "8px 16px"
        }, children: "Preview ↗" }),
        /* @__PURE__ */ jsxs("label", { className: "glow-button glow-button-outline", style: {
          cursor: "pointer",
          fontSize: "0.85rem",
          padding: "8px 16px"
        }, children: [
          "Replace",
          /* @__PURE__ */ jsx("input", { type: "file", accept: ".pdf", onChange: upload, style: {
            display: "none"
          } })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: remove, className: "glow-button", style: {
          background: "rgba(248,113,113,0.1)",
          border: "1px solid rgba(248,113,113,0.3)",
          color: "#fca5a5",
          padding: "8px 16px",
          fontSize: "0.85rem",
          cursor: "pointer"
        }, children: "Delete" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { style: {
      textAlign: "center",
      padding: 24
    }, children: [
      /* @__PURE__ */ jsx(FileText, { size: 48, color: "rgba(99,102,241,0.5)", style: {
        margin: "0 auto 16px",
        display: "block"
      } }),
      /* @__PURE__ */ jsx("p", { style: {
        color: "#f0f0f0",
        fontWeight: 600,
        marginBottom: 8
      }, children: "No resume uploaded" }),
      /* @__PURE__ */ jsx("p", { style: {
        color: "rgba(232,232,232,0.4)",
        fontSize: "0.875rem",
        marginBottom: 20
      }, children: "Upload a PDF to enable the Resume button in the navbar." }),
      /* @__PURE__ */ jsxs("label", { className: "glow-button glow-button-primary", style: {
        cursor: "pointer"
      }, children: [
        uploading ? "Uploading…" : "Upload Resume (PDF)",
        /* @__PURE__ */ jsx("input", { type: "file", accept: ".pdf", onChange: upload, style: {
          display: "none"
        }, disabled: uploading })
      ] })
    ] }) })
  ] });
}
function AdminHeader({
  title,
  subtitle,
  action
}) {
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24
  }, children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { style: {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: "1.4rem",
        fontWeight: 700,
        color: "#f0f0f0",
        marginBottom: 4
      }, children: title }),
      subtitle && /* @__PURE__ */ jsx("p", { style: {
        color: "rgba(232,232,232,0.4)",
        fontSize: "0.875rem"
      }, children: subtitle })
    ] }),
    action && /* @__PURE__ */ jsx("button", { onClick: action.onClick, className: "glow-button glow-button-primary", style: {
      cursor: "pointer",
      fontSize: "0.85rem",
      padding: "10px 20px"
    }, children: action.label })
  ] });
}
const inputBaseStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  padding: "10px 14px",
  color: "#e8e8e8",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "inherit",
  cursor: "auto"
};
function AdminInput({
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsx("input", { value, onChange: (e) => onChange(e.target.value), placeholder, style: {
    ...inputBaseStyle,
    width: "100%"
  } });
}
function AdminTextarea({
  value,
  onChange,
  rows = 3,
  placeholder
}) {
  return /* @__PURE__ */ jsx("textarea", { value, onChange: (e) => onChange(e.target.value), rows, placeholder, style: {
    ...inputBaseStyle,
    width: "100%",
    resize: "vertical"
  } });
}
function FormRow({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("label", { style: {
      display: "block",
      fontSize: "0.8rem",
      color: "rgba(232,232,232,0.5)",
      marginBottom: 6
    }, children: label }),
    children
  ] });
}
function FormModal({
  title,
  onClose,
  onSave,
  children
}) {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    zIndex: 2e3,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  }, onClick: onClose, children: /* @__PURE__ */ jsxs("div", { onClick: (e) => e.stopPropagation(), style: {
    width: "100%",
    maxWidth: 560,
    background: "#111",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    overflow: "hidden",
    maxHeight: "90vh",
    overflowY: "auto"
  }, children: [
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)"
    }, children: [
      /* @__PURE__ */ jsx("h3", { style: {
        fontWeight: 600,
        color: "#f0f0f0",
        fontSize: "1rem"
      }, children: title }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, style: {
        background: "none",
        border: "none",
        color: "rgba(232,232,232,0.4)",
        cursor: "pointer"
      }, children: /* @__PURE__ */ jsx(X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsx("div", { style: {
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16
    }, children }),
    /* @__PURE__ */ jsxs("div", { style: {
      display: "flex",
      gap: 10,
      justifyContent: "flex-end",
      padding: "16px 24px",
      borderTop: "1px solid rgba(255,255,255,0.06)"
    }, children: [
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "glow-button glow-button-outline", style: {
        cursor: "pointer",
        padding: "8px 20px",
        fontSize: "0.875rem"
      }, children: "Cancel" }),
      /* @__PURE__ */ jsxs("button", { onClick: onSave, className: "glow-button glow-button-primary", style: {
        cursor: "pointer",
        padding: "8px 20px",
        fontSize: "0.875rem",
        display: "flex",
        alignItems: "center",
        gap: 6
      }, children: [
        /* @__PURE__ */ jsx(Save, { size: 14 }),
        " Save"
      ] })
    ] })
  ] }) });
}
function AdminIconButton({
  onClick,
  icon,
  danger
}) {
  return /* @__PURE__ */ jsx("button", { onClick, style: {
    background: danger ? "rgba(248,113,113,0.1)" : "rgba(99,102,241,0.1)",
    border: `1px solid ${danger ? "rgba(248,113,113,0.2)" : "rgba(99,102,241,0.2)"}`,
    color: danger ? "#fca5a5" : "#a5b4fc",
    borderRadius: 6,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "background 0.2s"
  }, children: icon });
}
function EmptyState({
  message
}) {
  return /* @__PURE__ */ jsx("div", { className: "glass-card", style: {
    padding: 32,
    textAlign: "center",
    color: "rgba(232,232,232,0.4)",
    fontSize: "0.875rem"
  }, children: message });
}
export {
  AdminDashboard as component
};
