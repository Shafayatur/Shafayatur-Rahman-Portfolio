import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu, ChevronDown, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink, ChevronLeft, ChevronRight, Briefcase, GraduationCap, CheckCircle, Send } from "lucide-react";
function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return /* @__PURE__ */ jsx(AnimatePresence, { children: visible && /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "preloader",
      exit: { opacity: 0 },
      transition: { duration: 0.5 },
      children: [
        /* @__PURE__ */ jsx("div", { className: "preloader-logo", children: "SR" }),
        /* @__PURE__ */ jsx("div", { className: "preloader-bar", children: /* @__PURE__ */ jsx("div", { className: "preloader-bar-fill" }) }),
        /* @__PURE__ */ jsx("p", { style: { color: "rgba(232,232,232,0.4)", fontSize: "0.75rem", letterSpacing: "0.1em" }, children: "LOADING" })
      ]
    }
  ) });
}
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let animFrame;
    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    const loop = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top = `${ringY}px`;
      }
      animFrame = requestAnimationFrame(loop);
    };
    const onEnterLink = () => {
      ringRef.current?.classList.add("hovering");
      dotRef.current?.classList.add("hovering");
    };
    const onLeaveLink = () => {
      ringRef.current?.classList.remove("hovering");
      dotRef.current?.classList.remove("hovering");
    };
    document.addEventListener("mousemove", onMove);
    animFrame = requestAnimationFrame(loop);
    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [data-cursor-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animFrame);
      observer.disconnect();
    };
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ref: dotRef, className: "cursor-dot" }),
    /* @__PURE__ */ jsx("div", { ref: ringRef, className: "cursor-ring" })
  ] });
}
const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certificates", href: "#certificates" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" }
];
function Navbar({ hasResume }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const handleNavClick = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      motion.nav,
      {
        initial: { y: -80, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.6, delay: 0.2 },
        style: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1e3,
          padding: "0 24px",
          height: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
          background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none"
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }),
              style: {
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                border: "none",
                cursor: "none",
                padding: 0
              },
              children: "SR"
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, className: "hidden md:flex", children: [
            NAV_ITEMS.map((item) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => handleNavClick(item.href),
                style: {
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "rgba(232,232,232,0.7)",
                  border: "none",
                  background: "transparent",
                  cursor: "none",
                  transition: "color 0.2s"
                },
                onMouseEnter: (e) => {
                  e.target.style.color = "#a5b4fc";
                },
                onMouseLeave: (e) => {
                  e.target.style.color = "rgba(232,232,232,0.7)";
                },
                children: item.label
              },
              item.label
            )),
            hasResume && /* @__PURE__ */ jsx(
              "a",
              {
                href: "/api/admin/resume",
                target: "_blank",
                rel: "noreferrer",
                className: "glow-button glow-button-outline",
                style: { padding: "8px 20px", fontSize: "0.875rem", textDecoration: "none", marginLeft: 8 },
                children: "Resume ↗"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: "md:hidden",
              onClick: () => setMenuOpen((v) => !v),
              style: { background: "none", border: "none", color: "#e8e8e8", cursor: "none" },
              children: menuOpen ? /* @__PURE__ */ jsx(X, { size: 22 }) : /* @__PURE__ */ jsx(Menu, { size: 22 })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(AnimatePresence, { children: menuOpen && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        style: {
          position: "fixed",
          top: 70,
          left: 0,
          right: 0,
          zIndex: 999,
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "16px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 4
        },
        children: [
          NAV_ITEMS.map((item) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleNavClick(item.href),
              style: {
                padding: "12px 16px",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 500,
                color: "rgba(232,232,232,0.8)",
                border: "none",
                background: "transparent",
                cursor: "none",
                textAlign: "left"
              },
              children: item.label
            },
            item.label
          )),
          hasResume && /* @__PURE__ */ jsx(
            "a",
            {
              href: "/api/admin/resume",
              target: "_blank",
              rel: "noreferrer",
              style: {
                padding: "12px 16px",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#a5b4fc",
                textDecoration: "none"
              },
              children: "Resume ↗"
            }
          )
        ]
      }
    ) })
  ] });
}
const ROLES = [
  "Data Analyst",
  "AI & Automation Engineer",
  "Machine Learning Enthusiast",
  "AI-Powered Web Developer"
];
function useTypewriter(words, speed = 80, pause = 2e3) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[wordIdx % words.length];
    let timeout;
    if (!deleting) {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), speed / 2);
      } else {
        setDeleting(false);
        setWordIdx((i) => i + 1);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIdx, words, speed, pause]);
  return text;
}
function Particle({ x, y, delay }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "absolute",
        left: x,
        top: y,
        width: 2,
        height: 2,
        borderRadius: "50%",
        background: "rgba(99,102,241,0.6)",
        animation: `float ${4 + delay}s ease-in-out ${delay}s infinite`
      }
    }
  );
}
function Hero({ about }) {
  const role = useTypewriter(ROLES);
  const scrollToWork = () => {
    document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const particles = [
    { x: "10%", y: "20%", delay: 0 },
    { x: "80%", y: "15%", delay: 1 },
    { x: "20%", y: "70%", delay: 2 },
    { x: "70%", y: "65%", delay: 0.5 },
    { x: "50%", y: "30%", delay: 1.5 },
    { x: "35%", y: "80%", delay: 3 },
    { x: "90%", y: "50%", delay: 0.8 },
    { x: "5%", y: "50%", delay: 2.5 }
  ];
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "hero",
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: 0
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: "20%",
              left: "10%",
              width: 500,
              height: 500,
              background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              bottom: "20%",
              right: "10%",
              width: 400,
              height: 400,
              background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { position: "absolute", inset: 0, pointerEvents: "none" }, children: particles.map((p, i) => /* @__PURE__ */ jsx(Particle, { ...p }, i)) }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundImage: `linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "container", style: { position: "relative", zIndex: 1, textAlign: "center" }, children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, delay: 0.1 },
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                borderRadius: 100,
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                marginBottom: 32,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "#a5b4fc"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "float 2s ease-in-out infinite" } }),
                "Available for opportunities"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: 0.3 },
              style: {
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 24,
                color: "#f0f0f0"
              },
              children: about?.name ?? "Shafayatur Rahman"
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: 0.5 },
              style: {
                fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                fontWeight: 500,
                color: "rgba(232,232,232,0.7)",
                marginBottom: 40,
                minHeight: "2em",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              },
              children: [
                /* @__PURE__ */ jsx("span", { className: "gradient-text", style: { animation: "none", background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: role }),
                /* @__PURE__ */ jsx("span", { className: "typewriter-cursor" })
              ]
            }
          ),
          about?.bio && /* @__PURE__ */ jsxs(
            motion.p,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: 0.65 },
              style: {
                maxWidth: 560,
                margin: "0 auto 48px",
                color: "rgba(232,232,232,0.5)",
                lineHeight: 1.7,
                fontSize: "1rem"
              },
              children: [
                about.bio.slice(0, 160),
                "…"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.7, delay: 0.8 },
              style: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
              children: [
                /* @__PURE__ */ jsx("button", { className: "glow-button glow-button-primary", onClick: scrollToWork, children: "View Work" }),
                /* @__PURE__ */ jsx("button", { className: "glow-button glow-button-outline", onClick: scrollToContact, children: "Get in Touch" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 1.5 },
              style: {
                position: "absolute",
                bottom: -80,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                color: "rgba(232,232,232,0.3)",
                fontSize: "0.7rem",
                letterSpacing: "0.1em",
                cursor: "none"
              },
              onClick: scrollToWork,
              children: [
                /* @__PURE__ */ jsx("span", { children: "SCROLL" }),
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    animate: { y: [0, 6, 0] },
                    transition: { duration: 1.5, repeat: Infinity },
                    children: /* @__PURE__ */ jsx(ChevronDown, { size: 16 })
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  );
}
const fadeUp$1 = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};
function AboutSection({ about }) {
  if (!about) return null;
  return /* @__PURE__ */ jsx("section", { id: "about", style: { background: "rgba(255,255,255,0.01)" }, children: /* @__PURE__ */ jsx("div", { className: "container", children: /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 64,
        alignItems: "center"
      },
      children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "-100px" },
            transition: { duration: 0.7 },
            variants: fadeUp$1,
            style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 24 },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "relative",
                    width: 240,
                    height: 240
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          inset: -4,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #6366f1, #a855f7)",
                          zIndex: 0,
                          animation: "float 6s ease-in-out infinite"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: about.profileImage ?? "/headshot-on-white.jpg",
                        alt: about.name,
                        style: {
                          position: "relative",
                          zIndex: 1,
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "3px solid #0a0a0a"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320 }, children: about.highlights.map((h, i) => /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  whileInView: { opacity: 1, x: 0 },
                  viewport: { once: true },
                  transition: { delay: i * 0.1 + 0.3 },
                  className: "glass-card",
                  style: { padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 },
                  children: [
                    /* @__PURE__ */ jsx("span", { style: { color: "#6366f1", fontSize: "0.9rem" }, children: "✦" }),
                    /* @__PURE__ */ jsx("span", { style: { fontSize: "0.875rem", color: "rgba(232,232,232,0.8)" }, children: h })
                  ]
                },
                i
              )) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, margin: "-100px" },
            transition: { duration: 0.7, delay: 0.2 },
            variants: fadeUp$1,
            children: [
              /* @__PURE__ */ jsx("p", { className: "section-label", children: "About Me" }),
              /* @__PURE__ */ jsxs("h2", { className: "section-title", style: { marginBottom: 24 }, children: [
                "Building intelligent systems powered by",
                " ",
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      background: "linear-gradient(135deg, #6366f1, #a855f7)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    },
                    children: "AI, automation, and data-driven insights"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    color: "rgba(232,232,232,0.65)",
                    lineHeight: 1.8,
                    fontSize: "1rem",
                    marginBottom: 32
                  },
                  children: about.bio
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }, children: [
                about.location && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, color: "rgba(232,232,232,0.5)", fontSize: "0.9rem" }, children: [
                  /* @__PURE__ */ jsx(MapPin, { size: 16, color: "#6366f1" }),
                  about.location
                ] }),
                about.email && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, color: "rgba(232,232,232,0.5)", fontSize: "0.9rem" }, children: [
                  /* @__PURE__ */ jsx(Mail, { size: 16, color: "#6366f1" }),
                  /* @__PURE__ */ jsx("a", { href: `mailto:${about.email}`, style: { color: "inherit", textDecoration: "none" }, children: about.email })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12 }, children: [
                about.github && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: about.github,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "glass-card",
                    style: {
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(232,232,232,0.8)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500
                    },
                    children: [
                      /* @__PURE__ */ jsx(Github, { size: 16 }),
                      " GitHub"
                    ]
                  }
                ),
                about.linkedin && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: about.linkedin,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "glass-card",
                    style: {
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(232,232,232,0.8)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500
                    },
                    children: [
                      /* @__PURE__ */ jsx(Linkedin, { size: 16 }),
                      " LinkedIn"
                    ]
                  }
                ),
                about.twitter && /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: about.twitter,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "glass-card",
                    style: {
                      padding: "10px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "rgba(232,232,232,0.8)",
                      textDecoration: "none",
                      fontSize: "0.875rem",
                      fontWeight: 500
                    },
                    children: [
                      /* @__PURE__ */ jsx(Twitter, { size: 16 }),
                      " Twitter"
                    ]
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  ) }) });
}
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};
function ProjectCard({ project, onClick, index }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: "hidden",
      whileInView: "visible",
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.5, delay: index * 0.1 },
      variants: fadeUp,
      whileHover: { y: -6 },
      className: "glass-card",
      onClick,
      "data-cursor-hover": true,
      style: {
        cursor: "none",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", overflow: "hidden", height: 220 }, children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: project.image || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
              alt: project.title,
              style: { width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" },
              onMouseEnter: (e) => {
                e.target.style.transform = "scale(1.05)";
              },
              onMouseLeave: (e) => {
                e.target.style.transform = "scale(1)";
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 60%)"
              }
            }
          ),
          project.featured && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                top: 12,
                right: 12,
                padding: "3px 10px",
                borderRadius: 100,
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                fontSize: "0.7rem",
                fontWeight: 600,
                color: "#fff",
                letterSpacing: "0.05em"
              },
              children: "FEATURED"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { padding: 24, flex: 1, display: "flex", flexDirection: "column", gap: 12 }, children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              style: {
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#f0f0f0"
              },
              children: project.title
            }
          ),
          /* @__PURE__ */ jsxs("p", { style: { color: "rgba(232,232,232,0.55)", fontSize: "0.875rem", lineHeight: 1.6, flex: 1 }, children: [
            project.description.slice(0, 120),
            "…"
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: [
            project.techStack.slice(0, 4).map((t) => /* @__PURE__ */ jsx("span", { className: "skill-tag", style: { fontSize: "0.7rem" }, children: t }, t)),
            project.techStack.length > 4 && /* @__PURE__ */ jsxs("span", { className: "skill-tag", style: { fontSize: "0.7rem", opacity: 0.6 }, children: [
              "+",
              project.techStack.length - 4
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 12, marginTop: 4 }, children: [
            project.github && /* @__PURE__ */ jsxs(
              "a",
              {
                href: project.github,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                style: { color: "rgba(232,232,232,0.5)", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", textDecoration: "none" },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#a5b4fc";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "rgba(232,232,232,0.5)";
                },
                children: [
                  /* @__PURE__ */ jsx(Github, { size: 14 }),
                  " Code"
                ]
              }
            ),
            project.liveUrl && /* @__PURE__ */ jsxs(
              "a",
              {
                href: project.liveUrl,
                target: "_blank",
                rel: "noreferrer",
                onClick: (e) => e.stopPropagation(),
                style: { color: "rgba(232,232,232,0.5)", transition: "color 0.2s", display: "flex", alignItems: "center", gap: 4, fontSize: "0.8rem", textDecoration: "none" },
                onMouseEnter: (e) => {
                  e.currentTarget.style.color = "#a5b4fc";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.color = "rgba(232,232,232,0.5)";
                },
                children: [
                  /* @__PURE__ */ jsx(ExternalLink, { size: 14 }),
                  " Live"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                style: { marginLeft: "auto", color: "rgba(232,232,232,0.35)", fontSize: "0.8rem", cursor: "none" },
                children: "View details →"
              }
            )
          ] })
        ] })
      ]
    }
  );
}
function ProjectModal({ project, onClose }) {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 2e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24
      },
      children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.9, y: 20 },
          transition: { duration: 0.3 },
          onClick: (e) => e.stopPropagation(),
          style: {
            maxWidth: 680,
            width: "100%",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            overflow: "hidden",
            maxHeight: "90vh",
            overflowY: "auto"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: project.image || "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=400&fit=crop",
                  alt: project.title,
                  style: { width: "100%", height: 280, objectFit: "cover" }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: onClose,
                  style: {
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                    borderRadius: 8,
                    padding: 8,
                    color: "#fff",
                    cursor: "none",
                    display: "flex"
                  },
                  children: /* @__PURE__ */ jsx(X, { size: 18 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { padding: 32 }, children: [
              /* @__PURE__ */ jsx(
                "h2",
                {
                  style: {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "#f0f0f0",
                    marginBottom: 16
                  },
                  children: project.title
                }
              ),
              /* @__PURE__ */ jsx("p", { style: { color: "rgba(232,232,232,0.65)", lineHeight: 1.8, marginBottom: 24 }, children: project.description }),
              /* @__PURE__ */ jsxs("div", { style: { marginBottom: 24 }, children: [
                /* @__PURE__ */ jsx("p", { className: "section-label", style: { marginBottom: 10 }, children: "Tech Stack" }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 }, children: project.techStack.map((t) => /* @__PURE__ */ jsx("span", { className: "skill-tag", children: t }, t)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: 16 }, children: [
                project.github && /* @__PURE__ */ jsxs("a", { href: project.github, target: "_blank", rel: "noreferrer", className: "glow-button glow-button-outline", style: { textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsx(Github, { size: 16 }),
                  " GitHub"
                ] }),
                project.liveUrl && /* @__PURE__ */ jsxs("a", { href: project.liveUrl, target: "_blank", rel: "noreferrer", className: "glow-button glow-button-primary", style: { textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }, children: [
                  /* @__PURE__ */ jsx(ExternalLink, { size: 16 }),
                  " Live Demo"
                ] })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function ProjectsSection({ projects }) {
  const [selected, setSelected] = useState(null);
  return /* @__PURE__ */ jsxs("section", { id: "projects", children: [
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          style: { textAlign: "center", marginBottom: 64 },
          children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", children: "Portfolio" }),
            /* @__PURE__ */ jsxs("h2", { className: "section-title", children: [
              "Selected",
              " ",
              /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: "Work" })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { color: "rgba(232,232,232,0.5)", marginTop: 16, fontSize: "1rem", maxWidth: 480, margin: "16px auto 0" }, children: "A collection of projects spanning AI/ML systems, full-stack applications, and open-source tools." })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24
          },
          children: projects.map((p, i) => /* @__PURE__ */ jsx(ProjectCard, { project: p, index: i, onClick: () => setSelected(p) }, p.id))
        }
      )
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: selected && /* @__PURE__ */ jsx(ProjectModal, { project: selected, onClose: () => setSelected(null) }) })
  ] });
}
function SkillTickerRow({ category, reverse }) {
  const doubledSkills = [...category.skills, ...category.skills, ...category.skills, ...category.skills];
  return /* @__PURE__ */ jsxs("div", { style: { marginBottom: 40 }, children: [
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingLeft: 24 }, children: [
      /* @__PURE__ */ jsx("span", { style: { fontSize: "1.2rem" }, children: category.icon }),
      /* @__PURE__ */ jsx(
        "h3",
        {
          style: {
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            color: "#f0f0f0"
          },
          children: category.name
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "ticker-container", children: /* @__PURE__ */ jsx("div", { className: `ticker-content ${reverse ? "ticker-content-reverse" : ""}`, style: { "--duration": "40s" }, children: doubledSkills.map((skill, i) => /* @__PURE__ */ jsx("div", { className: "ticker-item", children: /* @__PURE__ */ jsx("div", { className: "skill-tag", style: { fontSize: "0.9rem", padding: "10px 20px", whiteSpace: "nowrap" }, children: skill }) }, `${skill}-${i}`)) }) })
  ] });
}
function SkillsSection({ skills }) {
  return /* @__PURE__ */ jsx("section", { id: "skills", style: { background: "rgba(255,255,255,0.01)", overflow: "hidden" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        style: { textAlign: "center", marginBottom: 64 },
        children: [
          /* @__PURE__ */ jsx("p", { className: "section-label", children: "Expertise" }),
          /* @__PURE__ */ jsxs("h2", { className: "section-title", children: [
            "Skills &",
            " ",
            /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: "Technologies" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column" }, children: skills.map((cat, idx) => /* @__PURE__ */ jsx(SkillTickerRow, { category: cat, reverse: idx % 2 !== 0 }, cat.id)) })
  ] }) });
}
function CertificatesSection({ certificates }) {
  const [center, setCenter] = useState(0);
  const autoRef = useRef(null);
  const len = certificates.length;
  const prev = () => setCenter((c) => (c - 1 + len) % len);
  const next = () => setCenter((c) => (c + 1) % len);
  useEffect(() => {
    if (len <= 1) return;
    autoRef.current = setInterval(next, 3500);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [len, center]);
  const pauseAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
  };
  if (len === 0) return null;
  const getPosition = (idx) => {
    if (idx === center) return "center";
    if (idx === (center - 1 + len) % len) return "left";
    if (idx === (center + 1) % len) return "right";
    return "hidden";
  };
  const positionStyles = {
    center: {
      transform: "translateX(0) scale(1)",
      opacity: 1,
      zIndex: 10,
      filter: "blur(0px)"
    },
    left: {
      transform: "translateX(-65%) scale(0.78)",
      opacity: 0.6,
      zIndex: 5,
      filter: "blur(2px)"
    },
    right: {
      transform: "translateX(65%) scale(0.78)",
      opacity: 0.6,
      zIndex: 5,
      filter: "blur(2px)"
    },
    hidden: {
      opacity: 0,
      zIndex: 0,
      transform: "translateX(0) scale(0.6)"
    }
  };
  return /* @__PURE__ */ jsx("section", { id: "certificates", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        style: { textAlign: "center", marginBottom: 64 },
        children: [
          /* @__PURE__ */ jsx("p", { className: "section-label", children: "Credentials" }),
          /* @__PURE__ */ jsxs("h2", { className: "section-title", children: [
            "Certificates &",
            " ",
            /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: "Achievements" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "relative",
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        },
        onMouseEnter: pauseAuto,
        children: certificates.map((cert, idx) => {
          const pos = getPosition(idx);
          return /* @__PURE__ */ jsx(
            motion.div,
            {
              style: {
                position: "absolute",
                width: 380,
                willChange: "transform",
                transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, filter 0.5s ease",
                ...positionStyles[pos]
              },
              "data-cursor-hover": true,
              children: /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "glass-card",
                  style: {
                    overflow: "hidden",
                    border: pos === "center" ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: pos === "center" ? "0 0 40px rgba(99,102,241,0.15)" : "none",
                    transition: "border-color 0.3s, box-shadow 0.3s"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: cert.image || "https://images.unsplash.com/photo-1526378800651-c32d170fe6f8?w=400&h=220&fit=crop",
                        alt: cert.title,
                        style: { width: "100%", height: 180, objectFit: "cover" }
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { style: { padding: "16px 20px" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }, children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("h3", { style: { fontWeight: 600, fontSize: "0.95rem", color: "#f0f0f0", marginBottom: 4 }, children: cert.title }),
                        /* @__PURE__ */ jsxs("p", { style: { fontSize: "0.8rem", color: "rgba(232,232,232,0.5)" }, children: [
                          cert.issuer,
                          " · ",
                          cert.date
                        ] })
                      ] }),
                      cert.url && pos === "center" && /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: cert.url,
                          target: "_blank",
                          rel: "noreferrer",
                          style: { color: "#6366f1", flexShrink: 0 },
                          children: /* @__PURE__ */ jsx(ExternalLink, { size: 16 })
                        }
                      )
                    ] }) })
                  ]
                }
              )
            },
            cert.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 32 }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            pauseAuto();
            prev();
          },
          className: "glass-card",
          style: { padding: 12, border: "none", color: "#e8e8e8", cursor: "none", borderRadius: 10 },
          children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18 })
        }
      ),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: 8 }, children: certificates.map((_, i) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            pauseAuto();
            setCenter(i);
          },
          style: {
            width: i === center ? 24 : 8,
            height: 8,
            borderRadius: 100,
            border: "none",
            background: i === center ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(255,255,255,0.2)",
            transition: "width 0.3s, background 0.3s",
            cursor: "none",
            padding: 0
          }
        },
        i
      )) }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            pauseAuto();
            next();
          },
          className: "glass-card",
          style: { padding: 12, border: "none", color: "#e8e8e8", cursor: "none", borderRadius: 10 },
          children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 })
        }
      )
    ] })
  ] }) });
}
function ExperienceSection({ experience }) {
  const work = experience.filter((e) => e.type === "work");
  const education = experience.filter((e) => e.type === "education");
  return /* @__PURE__ */ jsx("section", { id: "experience", style: { background: "rgba(255,255,255,0.01)" }, children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        style: { textAlign: "center", marginBottom: 64 },
        children: [
          /* @__PURE__ */ jsx("p", { className: "section-label", children: "Background" }),
          /* @__PURE__ */ jsxs("h2", { className: "section-title", children: [
            "Experience &",
            " ",
            /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: "Education" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 48
        },
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(Briefcase, { size: 16, color: "#6366f1" })
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  style: {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#f0f0f0"
                  },
                  children: "Work Experience"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(TimelineList, { items: work })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(168,85,247,0.15)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(GraduationCap, { size: 16, color: "#a855f7" })
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  style: {
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#f0f0f0"
                  },
                  children: "Education"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(TimelineList, { items: education })
          ] })
        ]
      }
    )
  ] }) });
}
function TimelineList({ items }) {
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          left: 16,
          top: 0,
          bottom: 0,
          width: 1,
          background: "linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)"
        }
      }
    ),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: 32 }, children: items.map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -20 },
        whileInView: { opacity: 1, x: 0 },
        viewport: { once: true, margin: "-50px" },
        transition: { duration: 0.5, delay: i * 0.1 },
        style: { paddingLeft: 48, position: "relative" },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                left: 9,
                top: 6,
                width: 15,
                height: 15,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                border: "2px solid #0a0a0a",
                zIndex: 1
              }
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { padding: "20px 24px" }, children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap", marginBottom: 8 }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(
                  "h4",
                  {
                    style: {
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#f0f0f0",
                      marginBottom: 2
                    },
                    children: item.title
                  }
                ),
                /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontSize: "0.85rem",
                      color: "#6366f1",
                      fontWeight: 500
                    },
                    children: item.company
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "0.75rem",
                    color: "rgba(232,232,232,0.4)",
                    flexShrink: 0,
                    marginTop: 2
                  },
                  children: item.period
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  color: "rgba(232,232,232,0.6)",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  marginBottom: item.tags.length ? 12 : 0
                },
                children: item.description
              }
            ),
            item.tags.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 }, children: item.tags.map((t) => /* @__PURE__ */ jsx("span", { className: "skill-tag", style: { fontSize: "0.7rem" }, children: t }, t)) })
          ] })
        ]
      },
      item.id
    )) })
  ] });
}
function ContactSection({ about }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/portfolio/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#e8e8e8",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit"
  };
  return /* @__PURE__ */ jsxs("section", { id: "contact", children: [
    /* @__PURE__ */ jsxs("div", { className: "container", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 },
          style: { textAlign: "center", marginBottom: 64 },
          children: [
            /* @__PURE__ */ jsx("p", { className: "section-label", children: "Get in Touch" }),
            /* @__PURE__ */ jsxs("h2", { className: "section-title", children: [
              "Let's",
              " ",
              /* @__PURE__ */ jsx("span", { style: { background: "linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }, children: "Work Together" })
            ] }),
            /* @__PURE__ */ jsx("p", { style: { color: "rgba(232,232,232,0.5)", marginTop: 16, maxWidth: 480, margin: "16px auto 0" }, children: "Have a project in mind or want to collaborate? I'm always open to interesting opportunities." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 48,
            alignItems: "start"
          },
          children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -30 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.6 },
                style: { display: "flex", flexDirection: "column", gap: 24 },
                children: [
                  about?.email && /* @__PURE__ */ jsxs("div", { className: "glass-card", style: { padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }, children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: "rgba(99,102,241,0.15)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        },
                        children: /* @__PURE__ */ jsx(Mail, { size: 18, color: "#6366f1" })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "rgba(232,232,232,0.4)", marginBottom: 2 }, children: "Email" }),
                      /* @__PURE__ */ jsx("a", { href: `mailto:${about.email}`, style: { color: "#e8e8e8", textDecoration: "none", fontWeight: 500 }, children: about.email })
                    ] })
                  ] }),
                  about?.github && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: about.github,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "glass-card",
                      style: { padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, textDecoration: "none" },
                      children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: "rgba(99,102,241,0.15)",
                              border: "1px solid rgba(99,102,241,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            },
                            children: /* @__PURE__ */ jsx(Github, { size: 18, color: "#6366f1" })
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "rgba(232,232,232,0.4)", marginBottom: 2 }, children: "GitHub" }),
                          /* @__PURE__ */ jsx("p", { style: { color: "#e8e8e8", fontWeight: 500 }, children: "View my code" })
                        ] })
                      ]
                    }
                  ),
                  about?.linkedin && /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: about.linkedin,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "glass-card",
                      style: { padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, textDecoration: "none" },
                      children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: 44,
                              height: 44,
                              borderRadius: 12,
                              background: "rgba(99,102,241,0.15)",
                              border: "1px solid rgba(99,102,241,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0
                            },
                            children: /* @__PURE__ */ jsx(Linkedin, { size: 18, color: "#6366f1" })
                          }
                        ),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("p", { style: { fontSize: "0.75rem", color: "rgba(232,232,232,0.4)", marginBottom: 2 }, children: "LinkedIn" }),
                          /* @__PURE__ */ jsx("p", { style: { color: "#e8e8e8", fontWeight: 500 }, children: "Connect with me" })
                        ] })
                      ]
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true },
                transition: { duration: 0.6 },
                children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: status === "success" ? /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.9 },
                    animate: { opacity: 1, scale: 1 },
                    className: "glass-card",
                    style: {
                      padding: 48,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                      border: "1px solid rgba(99,102,241,0.3)"
                    },
                    children: [
                      /* @__PURE__ */ jsx(CheckCircle, { size: 48, color: "#6366f1" }),
                      /* @__PURE__ */ jsx("h3", { style: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "#f0f0f0" }, children: "Message sent!" }),
                      /* @__PURE__ */ jsx("p", { style: { color: "rgba(232,232,232,0.5)", fontSize: "0.9rem" }, children: "Thanks for reaching out. I'll get back to you soon." }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => setStatus("idle"),
                          className: "glow-button glow-button-outline",
                          style: { marginTop: 8 },
                          children: "Send another"
                        }
                      )
                    ]
                  },
                  "success"
                ) : /* @__PURE__ */ jsxs(
                  motion.form,
                  {
                    onSubmit: handleSubmit,
                    className: "glass-card",
                    style: { padding: 32, display: "flex", flexDirection: "column", gap: 16 },
                    children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }, children: [
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", color: "rgba(232,232,232,0.5)", display: "block", marginBottom: 6 }, children: "Name *" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              name: "name",
                              value: form.name,
                              onChange: handleChange,
                              required: true,
                              placeholder: "Your name",
                              style: inputStyle,
                              onFocus: (e) => {
                                e.target.style.borderColor = "rgba(99,102,241,0.5)";
                                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                e.target.style.boxShadow = "none";
                              }
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxs("div", { children: [
                          /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", color: "rgba(232,232,232,0.5)", display: "block", marginBottom: 6 }, children: "Email *" }),
                          /* @__PURE__ */ jsx(
                            "input",
                            {
                              name: "email",
                              type: "email",
                              value: form.email,
                              onChange: handleChange,
                              required: true,
                              placeholder: "your@email.com",
                              style: inputStyle,
                              onFocus: (e) => {
                                e.target.style.borderColor = "rgba(99,102,241,0.5)";
                                e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                              },
                              onBlur: (e) => {
                                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                e.target.style.boxShadow = "none";
                              }
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", color: "rgba(232,232,232,0.5)", display: "block", marginBottom: 6 }, children: "Subject" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            name: "subject",
                            value: form.subject,
                            onChange: handleChange,
                            placeholder: "What's this about?",
                            style: inputStyle,
                            onFocus: (e) => {
                              e.target.style.borderColor = "rgba(99,102,241,0.5)";
                              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                            },
                            onBlur: (e) => {
                              e.target.style.borderColor = "rgba(255,255,255,0.1)";
                              e.target.style.boxShadow = "none";
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { style: { fontSize: "0.8rem", color: "rgba(232,232,232,0.5)", display: "block", marginBottom: 6 }, children: "Message *" }),
                        /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            name: "message",
                            value: form.message,
                            onChange: handleChange,
                            required: true,
                            rows: 5,
                            placeholder: "Tell me about your project...",
                            style: { ...inputStyle, resize: "vertical", minHeight: 120 },
                            onFocus: (e) => {
                              e.target.style.borderColor = "rgba(99,102,241,0.5)";
                              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                            },
                            onBlur: (e) => {
                              e.target.style.borderColor = "rgba(255,255,255,0.1)";
                              e.target.style.boxShadow = "none";
                            }
                          }
                        )
                      ] }),
                      status === "error" && /* @__PURE__ */ jsx("p", { style: { color: "#f87171", fontSize: "0.85rem" }, children: "Something went wrong. Please try again." }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          disabled: status === "loading",
                          className: "glow-button glow-button-primary",
                          style: { marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
                          children: status === "loading" ? /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx("div", { style: { width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" } }),
                            "Sending…"
                          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                            /* @__PURE__ */ jsx(Send, { size: 16 }),
                            "Send Message"
                          ] })
                        }
                      )
                    ]
                  },
                  "form"
                ) })
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "gradient-divider", style: { marginTop: 80 } }),
    /* @__PURE__ */ jsx("div", { className: "container", style: { paddingTop: 32, paddingBottom: 32, textAlign: "center" }, children: /* @__PURE__ */ jsxs("p", { style: { color: "rgba(232,232,232,0.3)", fontSize: "0.85rem" }, children: [
      "Built with TanStack Start · Deployed on Vercel",
      /* @__PURE__ */ jsx("span", { style: { margin: "0 12px", opacity: 0.3 }, children: "·" }),
      /* @__PURE__ */ jsx("a", { href: "/admin", style: { color: "rgba(232,232,232,0.3)", textDecoration: "none" }, children: "Admin" })
    ] }) })
  ] });
}
function PortfolioPage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [data, setData] = useState({
    projects: [],
    skills: [],
    about: null,
    experience: [],
    certificates: [],
    settings: {
      hasResume: false,
      seeded: false,
      siteTitle: "Portfolio"
    }
  });
  useEffect(() => {
    fetch("/api/portfolio/data").then((r) => r.json()).then(async (d) => {
      if (!d.settings?.seeded) {
        const seedRes = await fetch("/api/portfolio/data", {
          method: "POST"
        });
        if (seedRes.ok) {
          const seeded = await fetch("/api/portfolio/data").then((r) => r.json());
          setData(seeded);
        } else {
          setData(d);
        }
      } else {
        setData(d);
      }
    }).catch(() => {
    });
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(CustomCursor, {}),
    /* @__PURE__ */ jsx(Preloader, { onComplete: () => setPreloaderDone(true) }),
    preloaderDone && /* @__PURE__ */ jsxs("div", { style: {
      opacity: 1,
      transition: "opacity 0.5s"
    }, children: [
      /* @__PURE__ */ jsx(Navbar, { hasResume: data.settings?.hasResume ?? false }),
      /* @__PURE__ */ jsxs("main", { children: [
        /* @__PURE__ */ jsx(Hero, { about: data.about }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(AboutSection, { about: data.about }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(ProjectsSection, { projects: data.projects }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(SkillsSection, { skills: data.skills }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(CertificatesSection, { certificates: data.certificates }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(ExperienceSection, { experience: data.experience }),
        /* @__PURE__ */ jsx("div", { className: "gradient-divider" }),
        /* @__PURE__ */ jsx(ContactSection, { about: data.about })
      ] })
    ] })
  ] });
}
export {
  PortfolioPage as component
};
