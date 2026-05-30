import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Lock, EyeOff, Eye } from "lucide-react";
function AdminLogin() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.body.classList.add("admin-mode");
    const token = localStorage.getItem("admin_token");
    if (token) window.location.href = "/admin/dashboard";
    return () => document.body.classList.remove("admin-mode");
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password
        })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("admin_token", data.token);
        window.location.href = "/admin/dashboard";
      } else {
        setError(data.error ?? "Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0a",
    padding: 24
  }, children: [
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      top: "30%",
      left: "20%",
      width: 400,
      height: 400,
      background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
      borderRadius: "50%",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsx("div", { style: {
      position: "absolute",
      bottom: "20%",
      right: "20%",
      width: 300,
      height: 300,
      background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
      borderRadius: "50%",
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ jsxs("div", { style: {
      width: "100%",
      maxWidth: 400,
      position: "relative",
      zIndex: 1
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        textAlign: "center",
        marginBottom: 40
      }, children: [
        /* @__PURE__ */ jsx("div", { style: {
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px"
        }, children: /* @__PURE__ */ jsx(Lock, { size: 24, color: "#fff" }) }),
        /* @__PURE__ */ jsx("h1", { style: {
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          color: "#f0f0f0",
          marginBottom: 8
        }, children: "Admin Access" }),
        /* @__PURE__ */ jsx("p", { style: {
          color: "rgba(232,232,232,0.4)",
          fontSize: "0.9rem"
        }, children: "Enter your password to continue" })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "glass-card", style: {
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 20
      }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { style: {
            fontSize: "0.8rem",
            color: "rgba(232,232,232,0.5)",
            display: "block",
            marginBottom: 8
          }, children: "Password" }),
          /* @__PURE__ */ jsxs("div", { style: {
            position: "relative"
          }, children: [
            /* @__PURE__ */ jsx("input", { type: show ? "text" : "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter admin password", required: true, style: {
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: error ? "1px solid rgba(248,113,113,0.5)" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "14px 48px 14px 18px",
              color: "#e8e8e8",
              fontSize: "0.9rem",
              outline: "none",
              fontFamily: "inherit"
            }, onFocus: (e) => {
              e.target.style.borderColor = "rgba(99,102,241,0.5)";
              e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
            }, onBlur: (e) => {
              e.target.style.borderColor = error ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.1)";
              e.target.style.boxShadow = "none";
            } }),
            /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setShow((v) => !v), style: {
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "rgba(232,232,232,0.4)",
              cursor: "pointer",
              padding: 4,
              display: "flex"
            }, children: show ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 }) })
          ] }),
          error && /* @__PURE__ */ jsx("p", { style: {
            color: "#f87171",
            fontSize: "0.8rem",
            marginTop: 6
          }, children: error })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "submit", disabled: loading, className: "glow-button glow-button-primary", style: {
          marginTop: 4,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8
        }, children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { style: {
            width: 16,
            height: 16,
            border: "2px solid rgba(255,255,255,0.3)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          } }),
          "Verifying..."
        ] }) : "Access Dashboard" }),
        /* @__PURE__ */ jsx("a", { href: "/", style: {
          textAlign: "center",
          color: "rgba(232,232,232,0.3)",
          fontSize: "0.8rem",
          textDecoration: "none"
        }, children: "← Back to portfolio" })
      ] })
    ] })
  ] });
}
export {
  AdminLogin as component
};
