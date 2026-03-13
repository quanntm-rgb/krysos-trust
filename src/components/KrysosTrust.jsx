"use client";
import { useState, useEffect, useRef, useMemo } from "react";

// ─── COLORS — Bain-inspired: Scarlet Red + Clean White ────
const C = {
  red: "#CC2D37",         // Bain scarlet red — primary accent
  redDark: "#A82530",     // Darker red for hover states
  redLight: "#E8434D",    // Lighter red for subtle accents
  heading: "#1A1A1A",     // Near-black for headings
  body: "#4A4A4A",        // Dark gray for body
  bodyLight: "#7A7A7A",   // Mid gray for secondary text
  offWhite: "#FAFAFA",    // Clean off-white background
  warmGray: "#F3F2F0",    // Warm gray sections
  cream: "#F7F6F4",       // Subtle warm bg
  white: "#FFFFFF",
  border: "#E5E3E0",
};

// ─── LOGO ─────────────────────────────────────────────────
function Logo({ dark = false, size = "md" }) {
  const sizes = {
    lg: { name: 34, trust: 11, dot: 7, gap: 3 },
    md: { name: 22, trust: 8.5, dot: 5, gap: 2 },
    sm: { name: 18, trust: 7, dot: 4, gap: 1 },
  };
  const s = sizes[size] || sizes.md;
  const c1 = dark ? "#fff" : C.heading;
  const c2 = dark ? "rgba(255,255,255,0.4)" : C.red;
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: s.gap }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: s.dot * 0.5 }}>
        <span className="fd" style={{ fontSize: s.name, fontWeight: 600, letterSpacing: s.name * 0.2, color: c1, lineHeight: 1 }}>KRYSOS</span>
        <span style={{ width: s.dot, height: s.dot, borderRadius: "50%", background: C.red, display: "inline-block", flexShrink: 0 }} />
      </div>
      <span className="fm" style={{ fontSize: s.trust, letterSpacing: s.trust * 0.5, color: c2, lineHeight: 1 }}>TRUST</span>
    </div>
  );
}

// ─── HOOKS ────────────────────────────────────────────────
function useInView(th = 0.15, once = true) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); if (once) o.unobserve(el); } else if (!once) setV(false); }, { threshold: th });
    o.observe(el); return () => o.disconnect(); }, [th, once]);
  return [ref, v];
}
function useScrollY() { const [y, setY] = useState(0); useEffect(() => { const h = () => setY(window.scrollY); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []); return y; }
function useMousePos() { const [p, setP] = useState({ x: 0, y: 0 }); useEffect(() => { const h = e => setP({ x: e.clientX, y: e.clientY }); window.addEventListener("mousemove", h); return () => window.removeEventListener("mousemove", h); }, []); return p; }

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [ref, inView] = useInView(0.3);
  const [count, setCount] = useState(0);
  const num = parseInt(end);
  useEffect(() => { if (!inView) return; let s = 0; const step = Math.ceil(num / (duration / 16));
    const t = setInterval(() => { s += step; if (s >= num) { setCount(num); clearInterval(t); } else setCount(s); }, 16);
    return () => clearInterval(t); }, [inView, num, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function MagneticButton({ children, className = "", style = {}, onClick }) {
  const r = useRef(null);
  const [o, setO] = useState({ x: 0, y: 0 });
  const hm = e => { const b = r.current?.getBoundingClientRect(); if (!b) return; setO({ x: (e.clientX - b.left - b.width / 2) * 0.25, y: (e.clientY - b.top - b.height / 2) * 0.25 }); };
  return <button ref={r} className={className} onClick={onClick} onMouseMove={hm} onMouseLeave={() => setO({ x: 0, y: 0 })}
    style={{ ...style, transform: `translate(${o.x}px, ${o.y}px)`, transition: o.x === 0 ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)" : "none" }}>{children}</button>;
}

function TextReveal({ children, delay = 0, as = "div", style = {}, className = "" }) {
  const [ref, v] = useInView(0.2);
  const Tag = as;
  return <div ref={ref} style={{ overflow: "hidden" }}><Tag className={className} style={{ ...style, transform: v ? "translateY(0)" : "translateY(110%)", opacity: v ? 1 : 0,
    transition: `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, opacity 0.9s ease ${delay}s` }}>{children}</Tag></div>;
}

function Fade({ children, delay = 0, className = "" }) {
  const [ref, v] = useInView(0.12);
  return <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(40px)",
    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>{children}</div>;
}

function LineReveal({ width = 48, delay = 0 }) {
  const [ref, v] = useInView(0.3);
  return <div ref={ref} style={{ height: 1.5, background: C.red, width: v ? width : 0, transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s` }} />;
}

// ─── ICONS ────────────────────────────────────────────────
const I = {
  shield: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  search: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  fileText: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  briefcase: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  arrow: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  chevDown: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  x: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  back: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
};

// ─── DATA ─────────────────────────────────────────────────
const services = [
  { id: "aml", icon: I.shield, title: "AML & Financial Crime Controls", tag: "Build the compliance foundation required to become bankable and operationally credible.", capabilities: "KYC/KYB design · Risk matrix · Monitoring workflow · Internal controls · Training",
    full: "We help clients design and implement practical AML/CFT frameworks tailored to real operating models. This includes customer due diligence design, risk assessment, internal controls, alert handling workflows, third-party monitoring integration, and internal training. The objective is not paperwork for its own sake, but a workable control environment that can withstand scrutiny from banks, partners, and investors." },
  { id: "audit", icon: I.search, title: "Compliance Review & Reporting Readiness", tag: "Identify control gaps early and strengthen reporting credibility before scrutiny intensifies.", capabilities: "Gap assessment · Remediation roadmap · Reporting framework · Governance review · Audit preparedness",
    full: "We conduct targeted compliance reviews to help clients understand where their current governance, documentation, and reporting frameworks fall short. The output is a clear remediation roadmap, practical prioritization, and a stronger foundation for future audit, diligence, or independent review processes." },
  { id: "licensing", icon: I.fileText, title: "Licensing, Sandbox & Regulatory Pathways", tag: "Navigate approvals, align operating models, and reduce execution risk.", capabilities: "Licensing strategy · Sandbox preparation · Regulatory positioning · Submission roadmap · Post-approval support",
    full: "We advise clients on licensing strategy, sandbox preparation, regulatory positioning, and phased execution planning. Our role is to help clients align the legal narrative, operational model, and submission package so that regulatory engagement is grounded in a coherent and defensible structure." },
  { id: "ma", icon: I.briefcase, title: "Pre-Transaction & Deal Readiness", tag: "Resolve structural issues before fundraising, M&A, or investor diligence begins.", capabilities: "Pre-diligence review · UBO and structure review · Data room setup · Contract review · Transaction readiness",
    full: "We support businesses preparing for fundraising, M&A, or other strategic transactions by reviewing the issues most likely to disrupt diligence. This includes ownership structure, beneficial ownership visibility, token-related risks, core commercial contracts, data room discipline, and legal readiness for investor review." },
];

// TODO: Replace with real testimonials from actual clients when available
const testimonials = [
  { quote: "Marcus and his team built our entire compliance program from zero — KYC procedures, risk framework, governance structure — all before sandbox admission. The regulators had no follow-up questions.", name: "Sandbox Project Lead", role: "CEO, Crypto Payment Platform (Da Nang Sandbox)", metric: "Sandbox approved" },
  { quote: "The sell-side preparation was meticulous. From restructuring to IP protection, every red flag was addressed before the buyer's counsel arrived. The $15M deal closed without renegotiation.", name: "Board Member", role: "Listed Finance Group, Vietnam", metric: "$15M deal closed" },
  { quote: "They structured licensed entities across seven jurisdictions in under six months. Our group-wide compliance finally has a single coherent framework instead of patchwork.", name: "Group COO", role: "Digital Asset Group, Multi-Jurisdiction", metric: "7 jurisdictions aligned" },
];

// TODO: Replace with real case studies
const caseStudies = [
  { industry: "Crypto M&A", service: "M&A Readiness", result: "Closed Vietnam's first $15M crypto acquisition", scope: "Sell-side legal counsel for landmark deal between a listed finance group and a leading crypto company — from restructuring to post-deal support" },
  { industry: "Crypto Payments", service: "Licensing & Compliance", result: "First crypto project accepted into Da Nang Sandbox", scope: "Designed full AML/CFT compliance program for Basal Pay — KYC procedures, governance structure, and sandbox admission materials" },
  { industry: "Cross-Border", service: "Licensing Strategy", result: "Licensed entities across 7 jurisdictions", scope: "Established and managed compliant structures across the Americas, EU, and Asia — enabling group-wide governance and regulatory alignment" },
];

// ─── CSS ──────────────────────────────────────────────────
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'DM Sans',sans-serif;color:#4A5568;background:#F8F7F5;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.fd{font-family:'Cormorant Garamond',serif}
.fm{font-family:'JetBrains Mono',monospace}

@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes scaleIn{0%{transform:scale(0.7);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes slideInLeft{0%{transform:translateX(-100%);opacity:0}100%{transform:translateX(0);opacity:1}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes geoRotate{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}

.noise-bg::before{content:'';position:absolute;inset:0;opacity:0.015;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");pointer-events:none;z-index:0}

.btn-p{display:inline-flex;align-items:center;gap:8px;padding:14px 36px;background:#1A1A1A;color:#fff;font-family:'DM Sans',sans-serif;font-weight:600;font-size:13px;letter-spacing:1px;text-transform:uppercase;border:none;cursor:pointer;position:relative;overflow:hidden;transition:all 0.3s ease}
.btn-p:hover{background:#2A2A2A;box-shadow:0 8px 32px rgba(26,26,26,0.2)}
.btn-p::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(204,45,55,0.1),transparent);transform:translateX(-100%);transition:transform 0.6s}
.btn-p:hover::before{transform:translateX(100%)}

.btn-o{display:inline-flex;align-items:center;gap:8px;padding:13px 36px;background:transparent;color:#1A1A1A;font-family:'DM Sans',sans-serif;font-weight:500;font-size:13px;letter-spacing:0.5px;border:1.5px solid #E2DED8;cursor:pointer;transition:all 0.3s}
.btn-o:hover{border-color:#CC2D37;color:#CC2D37}

.scard{background:#fff;border:1px solid #E2DED8;padding:36px 28px;transition:all 0.5s cubic-bezier(0.23,1,0.32,1);position:relative;overflow:hidden;cursor:pointer}
.scard::after{content:'';position:absolute;bottom:0;left:0;width:100%;height:2px;background:linear-gradient(90deg,#CC2D37,#E8434D);transform:scaleX(0);transform-origin:left;transition:transform 0.5s cubic-bezier(0.23,1,0.32,1)}
.scard:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(26,26,26,0.06);border-color:#E8434D}
.scard:hover::after{transform:scaleX(1)}
.scard:hover .scard-icon{transform:scale(1.08)}
.scard-icon{transition:transform 0.4s cubic-bezier(0.23,1,0.32,1)}

.faq-i{border-bottom:1px solid #E2DED8;cursor:pointer;transition:all 0.3s}
.faq-i:hover{background:rgba(204,45,55,0.02)}

.pstep{position:relative;padding-left:52px}
.pstep::before{content:'';position:absolute;left:15px;top:40px;bottom:-28px;width:1px;background:linear-gradient(180deg,#E8434D 0%,transparent 100%)}
.pstep:last-child::before{display:none}

.cursor-glow{position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(204,45,55,0.02) 0%,transparent 70%);pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:left 0.3s ease,top 0.3s ease}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:#F8F7F5}
::-webkit-scrollbar-thumb{background:#E8434D;border-radius:2px}

@media(max-width:768px){.scard{padding:28px 20px}.hide-mobile{display:none!important}.show-mobile{display:block!important}}
.show-mobile{display:none}
`;

function CursorGlow() { const m = useMousePos(); return <div className="cursor-glow" style={{ left: m.x, top: m.y }} />; }

function ScrollProgress() {
  const [w, setW] = useState(0);
  useEffect(() => { const h = () => { const t = document.documentElement.scrollHeight - window.innerHeight; setW(t > 0 ? (window.scrollY / t) * 100 : 0); };
    window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 10001 }}>
    <div style={{ height: "100%", width: `${w}%`, background: C.red, transition: "width 0.1s linear" }} /></div>;
}

// ─── NAV ──────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  const navItems = [
    { label: "About", pg: "about" },
    { label: "Services", pg: "services" },
    { label: "Case Studies", pg: "home" },
    { label: "Contact", pg: "home" },
  ];
  const isLight = scrolled || page !== "home";
  const textCol = isLight ? C.bodyLight : "rgba(255,255,255,0.7)";
  const textHover = isLight ? C.heading : "#fff";
  const menuCol = isLight ? C.heading : "#fff";
  return (
    <nav style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 1000, padding: scrolled ? "12px 0" : "20px 0",
      background: (scrolled || page !== "home") ? "rgba(255,255,255,0.95)" : "transparent",
      backdropFilter: (scrolled || page !== "home") ? "blur(16px)" : "none",
      transition: "all 0.5s cubic-bezier(0.23,1,0.32,1)",
      borderBottom: (scrolled || page !== "home") ? `1px solid ${C.border}` : "none" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ cursor: "pointer" }} onClick={() => { setPage("home"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <Logo size="md" dark={!isLight} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hide-mobile">
          {navItems.map(n => (
            <a key={n.label} href="#" onClick={e => { e.preventDefault(); setPage(n.pg); }} style={{ color: textCol, fontSize: 13, fontWeight: 500, letterSpacing: 0.5, textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = textHover} onMouseLeave={e => e.target.style.color = textCol}>{n.label}</a>
          ))}
          <MagneticButton className="btn-p" style={{ padding: "10px 28px", fontSize: 11, background: isLight ? C.heading : C.red }}>Get in Touch</MagneticButton>
        </div>
        <button onClick={() => setMob(!mob)} style={{ display: "none", background: "none", border: "none", color: menuCol, cursor: "pointer" }} className="mobile-menu-btn">{mob ? I.x : I.menu}</button>
      </div>
      <style>{`@media(max-width:768px){.mobile-menu-btn{display:block!important}}`}</style>
      {mob && <div style={{ position: "fixed", inset: 0, background: C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, zIndex: 999 }}>
        <button onClick={() => setMob(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: C.heading, cursor: "pointer" }}>{I.x}</button>
        {navItems.map((n, i) => <a key={n.label} href="#" onClick={e => { e.preventDefault(); setMob(false); setPage(n.pg); }}
          style={{ color: C.heading, fontSize: 24, fontFamily: "'Cormorant Garamond',serif", fontWeight: 500, textDecoration: "none", animation: `slideInLeft 0.4s ease ${i * 0.06}s both` }}>{n.label}</a>)}
      </div>}
    </nav>
  );
}


// ─── HERO (Institutional Trust Architecture) ──────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  const scrollY = useScrollY();
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#141414" }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: "url('/hero-team.jpg')", backgroundSize: "cover", backgroundPosition: "70% 20%",
        transform: `translateY(${scrollY * 0.1}px)`, filter: "contrast(1.05) brightness(0.88)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(100deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.72) 35%, rgba(10,10,10,0.45) 55%, rgba(10,10,10,0.22) 80%, rgba(10,10,10,0.12) 100%)",
      }} />
      <div className="noise-bg" style={{ position: "absolute", inset: 0, zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, zIndex: 2, background: "linear-gradient(transparent, rgba(10,10,10,0.2))" }} />

      <div style={{ position: "relative", zIndex: 3, maxWidth: 1140, margin: "0 auto", padding: "150px 28px 50px", width: "100%" }}>
        <div style={{ maxWidth: 620 }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateX(0)" : "translateX(-30px)", transition: "all 0.8s ease 0.3s",
            display: "flex", alignItems: "center", gap: 14, marginBottom: 36 }}>
            <div style={{ width: 36, height: 1.5, background: C.red }} />
            <span className="fm" style={{ fontSize: 10, color: C.red, letterSpacing: 4 }}>REGULATORY & COMPLIANCE ADVISORY</span>
          </div>

          <TextReveal as="h1" delay={0.3} className="fd" style={{ fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em" }}>Bankable.</TextReveal>
          <TextReveal as="h1" delay={0.42} className="fd" style={{ fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 500, fontStyle: "italic", color: C.red, lineHeight: 1.08, letterSpacing: "-0.02em" }}>Audit-ready.</TextReveal>
          <TextReveal as="h1" delay={0.54} className="fd" style={{ fontSize: "clamp(42px, 5.5vw, 68px)", fontWeight: 500, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.02em" }}>Deal-ready.</TextReveal>

          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s ease 0.85s" }}>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginTop: 28, maxWidth: 480 }}>
              Cross-border compliance and regulatory advisory for fintech, digital assets, and financial institutions entering or operating in Southeast Asia.
            </p>
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 32, flexWrap: "wrap", opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s ease 1s" }}>
            <MagneticButton className="btn-p" style={{ background: C.red, color: "#fff" }}>Request a Confidential Assessment {I.arrow}</MagneticButton>
            <MagneticButton className="btn-o" style={{ borderColor: "rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}>View Representative Mandates</MagneticButton>
          </div>
        </div>

        {/* ─── TRUST ARCHITECTURE (visible in first 5-8 seconds) ─── */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.07)",
          opacity: loaded ? 1 : 0, transition: "all 1s ease 1.2s" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            {["Former PwC & VietinBank", "CAMS-Certified (ACAMS)", "VBA Legal Director", "Cross-Border Licensing", "Digital Asset Specialization", "SEA Market Access"].map((item, i) => (
              <span key={i} className="fm" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
                {item.toUpperCase()}{i < 5 && <span style={{ margin: "0 8px", color: "rgba(255,255,255,0.12)" }}>|</span>}
              </span>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {[
              "Advised on market entry, compliance, and banking readiness across Vietnam and Southeast Asia",
              "Built for investor, bank, and regulator scrutiny — from sandbox admission to cross-border M&A",
              "Trusted for high-discretion strategic mandates by funds, exchanges, and regulated institutions",
            ].map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                <span style={{ color: C.red, marginTop: 2, flexShrink: 0 }}>{I.check}</span>
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 3,
        opacity: loaded ? (scrollY > 80 ? 0 : 0.25) : 0, transition: "opacity 0.5s ease 2s" }}>
        <div style={{ width: 18, height: 30, borderRadius: 9, border: "1.5px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "center", paddingTop: 5 }}>
          <div style={{ width: 2, height: 5, borderRadius: 2, background: C.red, animation: "floatY 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}

// ─── WHO WE ADVISE (replaces old Credentials) ─────────────
function WhoWeAdvise() {
  const clients = [
    { type: "Funds & Family Offices", desc: "Regulatory risk assessment before capital deployment into Southeast Asian fintech and digital asset ventures." },
    { type: "Exchanges & Payment Platforms", desc: "AML/CFT framework design, licensing strategy, and banking readiness for regulated crypto and payment operations." },
    { type: "Founders & Operators", desc: "Compliance architecture that satisfies investor due diligence, banking partners, and sandbox requirements." },
    { type: "Listed Groups & Acquirers", desc: "Pre-DD structuring, legal transparency, and post-deal compliance for cross-border M&A transactions." },
  ];
  return (
    <section style={{ padding: "100px 28px", background: C.white, borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
          <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>WHO WE ADVISE</span></div></Fade>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(30px,3.5vw,44px)", fontWeight: 500, color: C.heading, marginBottom: 48 }}>
          Why International Capital <span style={{ fontStyle: "italic" }}>Chooses Us</span></TextReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {clients.map((c, i) => (
            <Fade key={i} delay={i * 0.08}>
              <div style={{ padding: "28px 24px", borderLeft: `2px solid ${i === 0 ? C.red : C.border}`, transition: "all 0.3s" }}
                onMouseEnter={e => e.currentTarget.style.borderLeftColor = C.red}
                onMouseLeave={e => { if (i !== 0) e.currentTarget.style.borderLeftColor = C.border; }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.heading, marginBottom: 8 }}>{c.type}</h3>
                <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.7 }}>{c.desc}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SERVICES ─────────────────────────────────────────────
function Services({ setPage }) {
  return (
    <section style={{ padding: "120px 28px", background: C.white }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
          <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>WHAT WE SOLVE</span></div></Fade>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: C.heading, marginBottom: 16 }}>Advisory Built for</TextReveal>
        <TextReveal as="h2" delay={0.1} className="fd" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: C.heading, marginBottom: 20, fontStyle: "italic" }}>Regulated Growth</TextReveal>
        <Fade delay={0.2}><p style={{ fontSize: 15, color: C.body, maxWidth: 560, lineHeight: 1.8, marginBottom: 60 }}>
          Our services are designed for firms operating in high-scrutiny environments where legal structure, compliance credibility, and transaction readiness directly affect enterprise value.</p></Fade>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {services.map((svc, i) => (
            <Fade key={svc.id} delay={0.1 + i * 0.08}>
              <div className="scard" onClick={() => setPage("services")} style={{ height: "100%" }}>
                <div className="scard-icon" style={{ color: C.red, marginBottom: 20 }}>{svc.icon}</div>
                <div className="fm" style={{ fontSize: 9.5, color: C.red, letterSpacing: 3, marginBottom: 10 }}>0{i + 1}</div>
                <h3 className="fd" style={{ fontSize: 21, fontWeight: 600, color: C.heading, marginBottom: 10 }}>{svc.title}</h3>
                <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.75, marginBottom: 16 }}>{svc.tag}</p>
                <div className="fm" style={{ fontSize: 10, color: C.bodyLight, letterSpacing: 0.5, lineHeight: 1.8 }}>{svc.capabilities}</div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CASE STUDIES ─────────────────────────────────────────
function CaseStudies() {
  return (
    <section className="noise-bg" style={{ position: "relative", padding: "120px 28px", background: C.heading }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto" }}>
        <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 40, height: 1.5, background: C.red }} />
          <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>TRACK RECORD</span></div></Fade>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: "#fff", marginBottom: 60 }}>
          Selected <span style={{ fontStyle: "italic", color: C.redLight }}>Engagements</span></TextReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {caseStudies.map((cs, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", padding: "36px 28px", transition: "all 0.4s", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(204,45,55,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                  <span className="fm" style={{ fontSize: 9.5, color: C.red, letterSpacing: 2, padding: "3px 10px", border: `1px solid rgba(204,45,55,0.3)` }}>{cs.industry.toUpperCase()}</span>
                  <span className="fm" style={{ fontSize: 9.5, color: "rgba(255,255,255,0.3)", letterSpacing: 2, padding: "3px 10px" }}>{cs.service.toUpperCase()}</span>
                </div>
                <h3 className="fd" style={{ fontSize: 22, fontWeight: 600, color: "#fff", marginBottom: 10, lineHeight: 1.3 }}>{cs.result}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{cs.scope}</p>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW WE WORK ──────────────────────────────────────────
function HowWeWork() {
  const steps = [
    { n: "01", t: "Discovery & Diagnosis", d: "Assess your compliance posture, identify gaps, and define the target state.", time: "Week 1" },
    { n: "02", t: "Setup & Calibration", d: "Deploy playbooks, configure tools, and establish workflows for your context.", time: "Week 2–3" },
    { n: "03", t: "Gate Review", d: "Structured Go/No-Go decision. Validate progress, assess risk, confirm readiness.", time: "Milestone" },
    { n: "04", t: "Operate & Optimize", d: "Ongoing monitoring, reporting, and continuous compliance improvement.", time: "Retainer" },
  ];
  return (
    <section style={{ padding: "120px 28px", background: C.warmGray }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
          <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>OUR PROCESS</span></div></Fade>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: C.heading, marginBottom: 60 }}>
          How We <span style={{ fontStyle: "italic" }}>Work</span></TextReveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 36 }}>
          {steps.map((s, i) => (
            <Fade key={i} delay={i * 0.1}>
              <div style={{ position: "relative", paddingTop: 16 }}>
                <div className="fd" style={{ fontSize: 72, fontWeight: 700, color: C.red, opacity: 0.06, position: "absolute", top: -12, left: 0, lineHeight: 1 }}>{s.n}</div>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span className="fm" style={{ fontSize: 10, color: C.red, letterSpacing: 3 }}>{s.time.toUpperCase()}</span>
                  <h3 className="fd" style={{ fontSize: 21, fontWeight: 600, color: C.heading, margin: "10px 0 12px" }}>{s.t}</h3>
                  <p style={{ fontSize: 14, color: C.body, lineHeight: 1.75 }}>{s.d}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────
function Testimonials() {
  const [active, setActive] = useState(0);
  useEffect(() => { const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 7000); return () => clearInterval(t); }, []);
  return (
    <section style={{ padding: "120px 28px", background: C.cream }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
          <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>CLIENT OUTCOMES</span></div></Fade>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 500, color: C.heading, marginBottom: 60 }}>
          What Our Clients <span style={{ fontStyle: "italic" }}>Report</span></TextReveal>
        <Fade delay={0.2}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative", minHeight: 220 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ position: i === active ? "relative" : "absolute", top: 0, left: 0, right: 0,
                opacity: i === active ? 1 : 0, transform: i === active ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.7s cubic-bezier(0.23,1,0.32,1)", pointerEvents: i === active ? "auto" : "none" }}>
                {/* Metric badge */}
                <div className="fm" style={{ display: "inline-block", fontSize: 10, letterSpacing: 2, color: C.red, border: `1px solid ${C.border}`, padding: "5px 16px", marginBottom: 24 }}>
                  {t.metric.toUpperCase()}</div>
                <p className="fd" style={{ fontSize: "clamp(19px, 2.5vw, 26px)", fontWeight: 400, fontStyle: "italic", color: C.heading, lineHeight: 1.6 }}>
                  "{t.quote}"</p>
                <div style={{ marginTop: 28 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.heading }}>{t.name}</div>
                  <div style={{ fontSize: 12.5, color: C.bodyLight, marginTop: 2 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 40 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 28 : 6, height: 6, borderRadius: 3,
                background: i === active ? C.red : C.border, border: "none", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)" }} />
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────
function CTASection() {
  return (
    <Fade><section style={{ padding: "100px 28px", background: C.offWhite, textAlign: "center" }}>
      <div style={{ maxWidth: 540, margin: "0 auto" }}>
        <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 500, color: C.heading }}>
          Ready to Explore <span style={{ fontStyle: "italic", color: C.red }}>a Strategic Mandate</span>?</TextReveal>
        <Fade delay={0.2}><p style={{ fontSize: 15, color: C.body, lineHeight: 1.8, margin: "20px 0 40px" }}>
          Every engagement begins with a confidential assessment. We evaluate fit, scope jurisdictional complexity, and outline a structured path forward.</p>
          <MagneticButton className="btn-p">Request a Confidential Assessment {I.arrow}</MagneticButton></Fade>
      </div>
    </section></Fade>
  );
}

// ─── FOOTER ───────────────────────────────────────────────
function Footer() {
  return (
    <footer className="noise-bg" style={{ position: "relative", background: C.heading, padding: "72px 28px 32px" }}>
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ marginBottom: 20 }}><Logo dark size="sm" /></div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.75, maxWidth: 220 }}>
              Compliance advisory for fintech and digital asset enterprises across Southeast Asia.</p>
          </div>
          <div>
            <h4 style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 2.5, marginBottom: 20 }}>SERVICES</h4>
            {["AML Operations", "Audit Readiness", "Licensing Strategy", "M&A Readiness"].map(s => (
              <a key={s} href="#" style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 10, transition: "all 0.3s" }}
                onMouseEnter={e => { e.target.style.color = C.redLight; e.target.style.paddingLeft = "6px"; }}
                onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.4)"; e.target.style.paddingLeft = "0"; }}>{s}</a>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 2.5, marginBottom: 20 }}>COMPANY</h4>
            {["About", "Case Studies", "Insights", "Contact"].map(s => (
              <a key={s} href="#" style={{ display: "block", fontSize: 13.5, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 10, transition: "all 0.3s" }}
                onMouseEnter={e => { e.target.style.color = C.redLight; e.target.style.paddingLeft = "6px"; }}
                onMouseLeave={e => { e.target.style.color = "rgba(255,255,255,0.4)"; e.target.style.paddingLeft = "0"; }}>{s}</a>
            ))}
          </div>
          <div>
            {/* TODO: Replace with actual contact info */}
            <h4 style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: 2.5, marginBottom: 20 }}>GET IN TOUCH</h4>
            <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", lineHeight: 2.2 }}>
              <div>hello@krysostrust.com</div>
              <div>+84 28 3820 xxxx</div>
              <div>Ho Chi Minh City, Vietnam</div>
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
              <a href="#" style={{ color: "rgba(255,255,255,0.3)", transition: "all 0.3s" }}
                onMouseEnter={e => e.target.style.color = C.redLight} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}>{I.linkedin}</a>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.2)" }}>© 2026 Krysos Trust. All rights reserved.</span>
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.2)" }}>Privacy Policy · Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

// ─── AML PAGE ─────────────────────────────────────────────
function AMLPage({ setPage }) {
  const [openFaq, setOpenFaq] = useState(null);
  const steps = [
    { n: "01", t: "KYC / KYB Setup", d: "Identity verification workflows and beneficial ownership screening aligned with FATF and EU AMLD.", del: "KYC/KYB Policy Document + Verification Workflow" },
    { n: "02", t: "Risk Matrix", d: "Multi-dimensional risk scoring: customer type, geography, transaction patterns, product exposure.", del: "Risk Assessment Framework + Scoring Model" },
    { n: "03", t: "Transaction Monitoring", d: "Rule-based and behavioral monitoring. Alert scenarios, thresholds, and escalation pathways.", del: "Monitoring Rules Library + Alert Configuration" },
    { n: "04", t: "Case Management", d: "Investigation workflows, SLAs, documentation standards, and STR filing procedures.", del: "Investigation Playbook + STR Templates" },
    { n: "05", t: "Governance & Reporting", d: "Board-level governance, compliance officer mandates, reporting cadences, audit evidence.", del: "Governance Charter + Reporting Dashboard" },
  ];
  const faqs = [
    { q: "How long does it take to become Bankable?", a: "Typically 4–6 weeks for core setup, plus 2–4 weeks of tuning. Timeline depends on your current compliance maturity and business complexity." },
    { q: "What does 'Bankable' mean?", a: "Your AML infrastructure meets the standards required by banking partners, payment processors, and regulators: documented policies, functioning monitoring, trained staff, audit-ready evidence." },
    { q: "Are you tool-agnostic?", a: "Yes. We design workflows around your existing stack — Chainalysis, Elliptic, ComplyAdvantage, or internal systems — or recommend solutions for your budget and scale." },
    { q: "How is pricing structured?", a: "Milestone-based: setup fee, tuning fee, and ongoing retainer. You only pay for delivered results. This reduces cash flow risk on your side." },
    { q: "Multi-jurisdiction support?", a: "Our playbooks cover Vietnam, Singapore, Hong Kong, and other key APAC markets with jurisdiction-specific modules." },
  ];
  return (
    <div>
      <section style={{ position: "relative", minHeight: "55vh", display: "flex", alignItems: "center", background: C.offWhite, overflow: "hidden" }}>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1140, margin: "0 auto", padding: "140px 28px 80px", width: "100%" }}>
          <div style={{ maxWidth: 640 }}>
            <Fade><button onClick={() => setPage("home")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none",
              color: C.bodyLight, fontSize: 13, cursor: "pointer", marginBottom: 32, fontFamily: "'DM Sans',sans-serif", transition: "color 0.3s" }}
              onMouseEnter={e => e.target.style.color = C.red} onMouseLeave={e => e.target.style.color = C.bodyLight}>{I.back} Back to Services</button></Fade>
            <Fade delay={0.1}><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1.5, background: C.red }} />
              <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>PACKAGE 01</span></div></Fade>
            <TextReveal as="h1" delay={0.2} className="fd" style={{ fontSize: "clamp(38px,5vw,56px)", fontWeight: 500, color: C.heading, lineHeight: 1.1, marginBottom: 8 }}>AML</TextReveal>
            <TextReveal as="h1" delay={0.3} className="fd" style={{ fontSize: "clamp(38px,5vw,56px)", fontWeight: 500, fontStyle: "italic", color: C.red, lineHeight: 1.1, marginBottom: 28 }}>Operations</TextReveal>
            <Fade delay={0.5}><p style={{ fontSize: 17, color: C.body, lineHeight: 1.8, maxWidth: 500 }}>
              Upgrade your anti-money laundering framework to meet banking partnership standards — through standardized playbooks, automated screening, and continuous monitoring.</p>
              <div style={{ display: "flex", gap: 24, marginTop: 32, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.bodyLight, fontSize: 13.5 }}>{I.clock} 4–6 weeks setup</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: C.bodyLight, fontSize: 13.5 }}>
                  <span style={{ color: C.red, fontSize: 7 }}>●</span> Milestone-based pricing</div>
              </div></Fade>
          </div>
        </div>
      </section>
      {/* Timeline */}
      <Fade><section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "24px 28px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", display: "flex", justifyContent: "center" }}>
          {["Setup · Wk 1–2", "Tuning · Wk 3–4", "Operate · Retainer"].map((ph, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "12px 28px", textAlign: "center", fontSize: 12.5, fontWeight: i === 0 ? 600 : 400,
                background: i === 0 ? C.heading : "transparent", color: i === 0 ? "#fff" : C.body,
                border: i === 0 ? "none" : `1px solid ${C.border}` }}>{ph}</div>
              {i < 2 && <div style={{ color: C.red, fontSize: 16, margin: "0 -1px", zIndex: 1 }}>▸</div>}
            </div>
          ))}
        </div>
      </section></Fade>
      {/* Steps */}
      <section style={{ padding: "100px 28px", background: C.offWhite }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
            <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>5-STEP FRAMEWORK</span></div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 500, color: C.heading, marginBottom: 56 }}>
            From Zero to <span style={{ fontStyle: "italic" }}>Bankable</span></TextReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {steps.map((s, i) => (
              <Fade key={i} delay={i * 0.06}>
                <div className="pstep">
                  <div style={{ position: "absolute", left: 0, top: 6, width: 32, height: 32, borderRadius: "50%", background: C.heading,
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                    <span className="fm" style={{ fontSize: 10, color: C.redLight, fontWeight: 700 }}>{s.n}</span></div>
                  <div style={{ background: C.white, border: `1px solid ${C.border}`, padding: "28px 32px", transition: "all 0.3s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = C.redLight} onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                    <h3 className="fd" style={{ fontSize: 20, fontWeight: 600, color: C.heading, marginBottom: 8 }}>{s.t}</h3>
                    <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.75, marginBottom: 14 }}>{s.d}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "rgba(204,45,55,0.04)", borderLeft: `2px solid ${C.red}` }}>
                      <span style={{ color: C.red }}>{I.check}</span>
                      <span style={{ fontSize: 12.5, color: C.red, fontWeight: 500 }}>{s.del}</span></div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ */}
      <section style={{ padding: "100px 28px", background: C.warmGray }}>
        <div style={{ maxWidth: 660, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}><LineReveal />
            <span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>FAQ</span></div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px,3.5vw,40px)", fontWeight: 500, color: C.heading, marginBottom: 44 }}>
            Common <span style={{ fontStyle: "italic" }}>Questions</span></TextReveal>
          <div style={{ background: C.white, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            {faqs.map((f, i) => (
              <Fade key={i} delay={i * 0.04}>
                <div className="faq-i" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ padding: "20px 24px", borderBottom: i < faqs.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 style={{ fontSize: 14.5, fontWeight: 600, color: openFaq === i ? C.red : C.heading, transition: "color 0.3s" }}>{f.q}</h4>
                    <div style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.4s cubic-bezier(0.23,1,0.32,1)", color: C.red, flexShrink: 0, marginLeft: 14 }}>{I.chevDown}</div>
                  </div>
                  <div style={{ maxHeight: openFaq === i ? 200 : 0, opacity: openFaq === i ? 1 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.23,1,0.32,1), opacity 0.4s" }}>
                    <p style={{ fontSize: 13.5, color: C.body, lineHeight: 1.75, paddingTop: 12 }}>{f.a}</p></div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section style={{ padding: "80px 28px", background: C.offWhite, textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(26px,3.5vw,36px)", fontWeight: 500, color: C.heading }}>
            Start Your AML <span style={{ fontStyle: "italic", color: C.red }}>Journey</span></TextReveal>
          <Fade delay={0.2}><p style={{ fontSize: 15, color: C.body, lineHeight: 1.8, margin: "16px 0 36px" }}>
            Book a confidential briefing. We'll assess your current posture and outline the path to Bankable.</p>
            <MagneticButton className="btn-p">Schedule a Briefing {I.arrow}</MagneticButton></Fade>
        </div>
      </section>
    </div>
  );
}

// ─── ABOUT PAGE ───────────────────────────────────────────
function AboutPage({ setPage }) {
  const differentiators = [
    { title: "Regulatory Intelligence", desc: "We do not look at regulation only as text on paper. We assess how legal frameworks, policy direction, and supervisory realities shape real-world execution." },
    { title: "Investor & Banking Readiness", desc: "Our work is designed to support institutional scrutiny. We help clients strengthen their legal positioning, compliance credibility, and transaction readiness where trust must be earned." },
    { title: "Cross-Border Strategic Judgment", desc: "From market entry and structuring to licensing pathways and risk allocation, we bring an international advisory mindset to complex mandates involving multiple jurisdictions." },
    { title: "High-Discretion Execution", desc: "We support sensitive situations with care, judgment, and confidentiality — particularly where legal, commercial, regulatory, and reputational considerations overlap." },
  ];
  const clientTypes = [
    "Fintech and digital asset businesses",
    "Investors, strategic acquirers, and family offices",
    "Founders entering Vietnam or Southeast Asia",
    "Businesses preparing for banking, diligence, or licensing processes",
    "Companies facing legal, compliance, or reputational complexity in growth markets",
  ];
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "160px 28px 80px", background: C.offWhite }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>ABOUT US</span>
          </div></Fade>
          <TextReveal as="h1" className="fd" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: C.heading, lineHeight: 1.15, marginBottom: 28 }}>
            Strategic Compliance Advisory for <span style={{ fontStyle: "italic", color: C.red }}>High-Stakes Markets</span>
          </TextReveal>
          <Fade delay={0.2}><p style={{ fontSize: 17, color: C.body, lineHeight: 1.85, maxWidth: 620 }}>
            Krysos Trust advises fintech, digital asset, and cross-border businesses navigating high-stakes growth in Vietnam and Southeast Asia. We help clients become bankable, audit-ready, and deal-ready through rigorous legal positioning, compliance architecture, and market-grounded execution.
          </p></Fade>
          <Fade delay={0.3}><p style={{ fontSize: 15.5, color: C.bodyLight, lineHeight: 1.85, marginTop: 20, maxWidth: 620 }}>
            In fast-evolving and compliance-sensitive markets, opportunity alone is never enough. Businesses must be able to withstand scrutiny from banks, investors, regulators, and counterparties. Krysos Trust was built to help serious operators meet that standard — with clarity, discipline, and defensible structuring.
          </p></Fade>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section style={{ padding: "100px 28px", background: C.white }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>WHAT SETS US APART</span>
          </div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: C.heading, marginBottom: 48 }}>
            Our <span style={{ fontStyle: "italic" }}>Differentiators</span>
          </TextReveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {differentiators.map((d, i) => (
              <Fade key={i} delay={i * 0.08}>
                <div style={{ padding: "28px 0", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: C.heading }}>{d.title}</h3>
                  <p style={{ fontSize: 14.5, color: C.body, lineHeight: 1.75 }}>{d.desc}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Advise */}
      <section style={{ padding: "100px 28px", background: C.warmGray }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>WHO WE ADVISE</span>
          </div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: C.heading, marginBottom: 36 }}>
            Our <span style={{ fontStyle: "italic" }}>Clients</span>
          </TextReveal>
          <Fade delay={0.15}><p style={{ fontSize: 15, color: C.body, lineHeight: 1.8, marginBottom: 28 }}>We typically advise:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {clientTypes.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: C.red, marginTop: 3, flexShrink: 0 }}>{I.check}</span>
                <span style={{ fontSize: 15, color: C.heading, lineHeight: 1.6 }}>{c}</span>
              </div>
            ))}
          </div></Fade>
        </div>
      </section>

      {/* Our Approach */}
      <section style={{ padding: "100px 28px", background: C.white }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>OUR APPROACH</span>
          </div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: C.heading, marginBottom: 28 }}>
            Compliance as <span style={{ fontStyle: "italic" }}>Strategic Function</span>
          </TextReveal>
          <Fade delay={0.15}>
            <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85, marginBottom: 20 }}>
              We do not treat compliance as a box-ticking exercise. We treat it as a strategic function that can shape access to banking, capital, partnerships, market entry, and long-term enterprise value.
            </p>
            <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85 }}>
              That is why our work sits at the intersection of legal defensibility, regulatory navigation, and commercial execution. We help clients move forward with structures that are not only workable, but credible under scrutiny.
            </p>
          </Fade>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: "100px 28px", background: C.warmGray }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>LEADERSHIP</span>
          </div></Fade>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 500, color: C.heading, marginBottom: 28 }}>
            Who <span style={{ fontStyle: "italic" }}>Leads</span>
          </TextReveal>
          <Fade delay={0.15}>
            <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85, marginBottom: 20 }}>
              Krysos Trust is led by Marcus Nguyen Tran (CAMS), a legal executive with over a decade of experience spanning PricewaterhouseCoopers, VietinBank, regulatory advisory, and cross-border compliance structuring.
            </p>
            <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85, marginBottom: 20 }}>
              As Legal Director of the Vietnam Blockchain Association (VBA), Marcus contributed to legal opinions incorporated into Vietnam's Digital Technology Industry Law and currently advises on the country's forthcoming VASP/AML framework. He holds a Master in Business Law from Université Paris II Panthéon-Assas.
            </p>
            <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85 }}>
              The firm combines deep local market understanding with the international-facing judgment required for complex mandates in emerging regulated sectors — including digital assets, fintech, cross-border M&A, and licensing across multiple APAC jurisdictions.
            </p>
          </Fade>
          {/* Credential badges */}
          <Fade delay={0.3}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
              {["CAMS Certified · ACAMS", "PricewaterhouseCoopers", "VietinBank", "VBA Legal Director", "Paris II Panthéon-Assas", "7 Jurisdictions"].map((b, i) => (
                <span key={i} className="fm" style={{ fontSize: 10, letterSpacing: 1.5, color: C.bodyLight, border: `1px solid ${C.border}`, padding: "6px 14px" }}>{b}</span>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 28px", background: C.offWhite, textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 500, color: C.heading }}>
            Navigating Regulatory <span style={{ fontStyle: "italic", color: C.red }}>Complexity</span>?
          </TextReveal>
          <Fade delay={0.15}><p style={{ fontSize: 15, color: C.body, lineHeight: 1.8, margin: "16px 0 36px" }}>
            For clients navigating market entry, regulatory scrutiny, investor diligence, or complex cross-border situations — Krysos Trust provides clear, discreet, and execution-oriented advisory support.
          </p>
          <MagneticButton className="btn-p">Request a Confidential Assessment {I.arrow}</MagneticButton></Fade>
        </div>
      </section>
    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────
function ServicesPage({ setPage }) {
  const outcomes = ["Stronger banking credibility", "Clearer regulatory positioning", "Better investor readiness", "More resilient structures", "Greater confidence in execution"];
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: "160px 28px 80px", background: C.offWhite }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade><div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <LineReveal /><span className="fm" style={{ fontSize: 10.5, color: C.red, letterSpacing: 4 }}>SERVICES</span>
          </div></Fade>
          <TextReveal as="h1" className="fd" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 500, color: C.heading, lineHeight: 1.15, marginBottom: 28 }}>
            Advisory Built for <span style={{ fontStyle: "italic", color: C.red }}>Regulated Growth</span>
          </TextReveal>
          <Fade delay={0.2}><p style={{ fontSize: 17, color: C.body, lineHeight: 1.85, maxWidth: 620 }}>
            Krysos Trust supports fintech, digital asset, and growth-stage businesses on the issues that determine whether they can bank, raise capital, secure approvals, and execute with confidence.
          </p></Fade>
          <Fade delay={0.3}><p style={{ fontSize: 15.5, color: C.bodyLight, lineHeight: 1.85, marginTop: 20, maxWidth: 620 }}>
            Our services are designed for firms operating in high-scrutiny environments where legal structure, compliance credibility, and transaction readiness directly affect enterprise value.
          </p></Fade>
        </div>
      </section>

      {/* Service Details */}
      {services.map((svc, i) => (
        <section key={svc.id} style={{ padding: "80px 28px", background: i % 2 === 0 ? C.white : C.warmGray }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <Fade>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                <div style={{ color: C.red }}>{svc.icon}</div>
                <span className="fm" style={{ fontSize: 10, color: C.red, letterSpacing: 3 }}>0{i + 1}</span>
              </div>
              <h2 className="fd" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 500, color: C.heading, marginBottom: 10 }}>
                {svc.title}
              </h2>
              <p style={{ fontSize: 16.5, color: C.red, fontWeight: 500, marginBottom: 24, fontStyle: "italic" }}>{svc.tag}</p>
              <p style={{ fontSize: 15.5, color: C.body, lineHeight: 1.85, marginBottom: 28, maxWidth: 620 }}>{svc.full}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {svc.capabilities.split(" · ").map((cap, j) => (
                  <span key={j} className="fm" style={{ fontSize: 10, letterSpacing: 1.5, color: C.bodyLight, border: `1px solid ${C.border}`, padding: "6px 14px" }}>{cap}</span>
                ))}
              </div>
            </Fade>
          </div>
        </section>
      ))}

      {/* Outcomes */}
      <section style={{ padding: "80px 28px", background: C.heading }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <Fade>
            <h2 className="fd" style={{ fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 500, color: "#fff", marginBottom: 32 }}>
              What Our Work Helps Clients <span style={{ fontStyle: "italic", color: C.redLight }}>Achieve</span>
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {outcomes.map((o, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ color: C.red }}>{I.check}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{o}</span>
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 28px", background: C.offWhite, textAlign: "center" }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <TextReveal as="h2" className="fd" style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 500, color: C.heading }}>
            Ready to Discuss a <span style={{ fontStyle: "italic", color: C.red }}>Mandate</span>?
          </TextReveal>
          <Fade delay={0.15}><p style={{ fontSize: 15, color: C.body, lineHeight: 1.8, margin: "16px 0 36px" }}>
            Every engagement begins with a confidential assessment. We evaluate fit, scope jurisdictional complexity, and outline a structured path forward.</p>
          <MagneticButton className="btn-p">Request a Confidential Assessment {I.arrow}</MagneticButton></Fade>
        </div>
      </section>
    </div>
  );
}

// ─── HOME & APP ───────────────────────────────────────────
function HomePage({ setPage }) {
  return (<><Hero /><WhoWeAdvise /><Services setPage={setPage} /><CaseStudies /><HowWeWork /><Testimonials /><CTASection /></>);
}

export default function KrysosTrust() {
  const [page, setPage] = useState("home");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);
  return (
    <div style={{ minHeight: "100vh", background: C.offWhite }}>
      <style>{globalCSS}</style>
      <ScrollProgress />
      <CursorGlow />
      <Nav page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "services" && <ServicesPage setPage={setPage} />}
      {page === "aml" && <AMLPage setPage={setPage} />}
      <Footer />
    </div>
  );
}
