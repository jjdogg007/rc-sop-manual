import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search, X, ChevronRight, CheckCircle2, Circle,
  RefreshCw, Edit3, Save, Plus, Trash2, Bell, Menu, Zap, LogIn, LogOut, Database
} from "lucide-react";
import { SECTIONS, POLICY_LOG, SHIFT_CHECKLISTS, QUICK_FINDER_SCENARIOS } from "./data/sop.js";
import { db, auth, isFirebaseConfigured } from "./firebase.js";
import {
  collection, getDocs, doc, updateDoc, addDoc, deleteDoc,
  query, orderBy, getDoc, setDoc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
} from "firebase/auth";
import { seedFirestore } from "./scripts/seed.js";
import "./App.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function highlight(text, q) {
  if (!q || !text) return text;
  const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = String(text).split(regex);
  return parts.map((p, i) =>
    regex.test(p) ? <mark key={i} className="hl">{p}</mark> : p
  );
}

function searchAll(query, sections) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results = [];
  sections.forEach((s) => {
    const hits = [];
    const check = (text, ctx) => { if (text && String(text).toLowerCase().includes(q)) hits.push({ text: String(text), ctx }); };
    check(s.label, "title");
    check(s.content, "content");
    s.steps?.forEach((st) => { check(st.title, "step"); check(st.detail, "detail"); });
    s.table?.rows.forEach((r) => r.forEach((c) => check(c, "table")));
    s.cheatItems?.forEach((ci) => { check(ci.title, "cheat"); ci.items.forEach((i) => check(i, "cheat")); });
    if (hits.length) results.push({ section: s, hits });
  });
  return results;
}

function getActiveFromPath(pathname) {
  if (pathname.startsWith("/section/")) return pathname.slice("/section/".length);
  if (pathname === "/policylog") return "policylog";
  return "home";
}

function friendlyAuthError(code) {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Incorrect email or password.";
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/too-many-requests": return "Too many attempts. Please try again later.";
    default: return "Sign-in failed. Please try again.";
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ sections, active, setActive, open, setOpen }) {
  const groups = [...new Set(sections.map((s) => s.group))];
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
      <aside className={`sidebar${open ? " open" : ""}`}>
        <div className="sb-brand">
          <div className="sb-tag">Northside Hospital</div>
          <div className="sb-name">Room Control</div>
          <div className="sb-sub">SOP Manual · 2025</div>
        </div>
        <nav>
          <div className="nav-group">
            <div className="nav-label">Home</div>
            <button className={`nav-item${active === "home" ? " active" : ""}`} onClick={() => { setActive("home"); setOpen(false); }}>
              <span>🏠</span><span>Dashboard</span>
            </button>
          </div>
          {groups.map((g) => (
            <div key={g} className="nav-group">
              <div className="nav-label">{g}</div>
              {sections.filter((s) => s.group === g).map((s) => (
                <button
                  key={s.id}
                  className={`nav-item${active === s.id ? " active" : ""}`}
                  onClick={() => { setActive(s.id); setOpen(false); }}
                >
                  <span>{s.icon}</span><span>{s.label}</span>
                </button>
              ))}
            </div>
          ))}
          <div className="nav-group">
            <div className="nav-label">Logs</div>
            <button className={`nav-item${active === "policylog" ? " active" : ""}`} onClick={() => { setActive("policylog"); setOpen(false); }}>
              <span>📋</span><span>Process Change Log</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

// ─── Login Modal ──────────────────────────────────────────────────────────────
function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  useEffect(() => emailRef.current?.focus(), []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err) {
      setError(friendlyAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="lm-head">
          <h2 className="lm-title">Admin Sign In</h2>
          <button className="lm-close" onClick={onClose}><X size={16} /></button>
        </div>
        <p className="lm-sub">Sign in to enable edit mode and persist changes.</p>
        <form className="lm-form" onSubmit={submit}>
          <input
            ref={emailRef}
            className="edit-in"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="edit-in"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="lm-error">{error}</div>}
          <button className="save-btn lm-submit" type="submit" disabled={loading}>
            <LogIn size={13} />{loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── What's New ───────────────────────────────────────────────────────────────
function WhatsNew({ log, onNav }) {
  const [gone, setGone] = useState(false);
  const fresh = log.filter((p) => p.isNew);
  if (gone || !fresh.length) return null;
  return (
    <div className="whatsnew">
      <Bell size={13} />
      <span className="wn-label">What's New:</span>
      {fresh.map((p, i) => (
        <span key={i}>
          <button className="wn-link" onClick={() => onNav("policylog")}>{p.title}</button>
          {i < fresh.length - 1 && <span className="wn-dot">·</span>}
        </span>
      ))}
      <button className="wn-x" onClick={() => setGone(true)}><X size={12} /></button>
    </div>
  );
}

// ─── Search Modal ─────────────────────────────────────────────────────────────
function SearchModal({ onClose, onNav, sections }) {
  const [q, setQ] = useState("");
  const results = searchAll(q, sections);
  const ref = useRef();
  useEffect(() => ref.current?.focus(), []);

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-bar">
          <Search size={15} color="var(--muted)" />
          <input ref={ref} className="modal-input" placeholder="Search procedures, codes, contacts..." value={q} onChange={(e) => setQ(e.target.value)} />
          {q && <button className="modal-clear" onClick={() => setQ("")}><X size={13} /></button>}
          <button className="modal-esc" onClick={onClose}>Esc</button>
        </div>
        {q.length > 1 ? (
          <div className="modal-results">
            {results.length === 0
              ? <div className="modal-empty">No results for "{q}"</div>
              : results.map((r) => (
                <button key={r.section.id} className="modal-result" onClick={() => { onNav(r.section.id); onClose(); }}>
                  <div className="mr-top">
                    <span>{r.section.icon}</span>
                    <span className="mr-label">{highlight(r.section.label, q)}</span>
                    <span className="mr-group">{r.section.group}</span>
                    <ChevronRight size={12} color="var(--muted)" />
                  </div>
                  {r.hits.filter((h) => h.ctx !== "title").slice(0, 2).map((h, i) => (
                    <div key={i} className="mr-hit">
                      {highlight(h.text.length > 110 ? h.text.slice(0, 110) + "…" : h.text, q)}
                    </div>
                  ))}
                </button>
              ))
            }
          </div>
        ) : (
          <div className="modal-hints">
            <div className="mh-label">Try searching for:</div>
            <div className="mh-chips">
              {["backdating", "SEL account", "STEMI", "duplicate MRN", "audit log", "lifelink", "acuity", "discharge time"].map((s) => (
                <button key={s} className="mh-chip" onClick={() => setQ(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Quick Finder ─────────────────────────────────────────────────────────────
function QuickFinder({ onNav }) {
  const [f, setF] = useState("");
  const filtered = QUICK_FINDER_SCENARIOS.filter((s) => s.label.toLowerCase().includes(f.toLowerCase()));
  return (
    <div className="qf">
      <div className="qf-head"><Zap size={15} /> What are you working on right now?</div>
      <input className="qf-input" placeholder="Type a situation..." value={f} onChange={(e) => setF(e.target.value)} />
      <div className="qf-grid">
        {filtered.map((s) => (
          <button key={s.sectionId} className="qf-chip" onClick={() => onNav(s.sectionId)}>{s.label}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Shift Checklist ──────────────────────────────────────────────────────────
function Checklist({ user }) {
  const [shift, setShift] = useState("1st");
  const [allShiftChecked, setAllShiftChecked] = useState({});

  const checked = allShiftChecked[shift] || {};

  // Load persisted state from Firestore when user logs in
  useEffect(() => {
    if (!user || !db) return;
    getDoc(doc(db, "checklists", user.uid)).then((snap) => {
      if (snap.exists()) setAllShiftChecked(snap.data());
    }).catch(() => {});
  }, [user]);

  const persistChecked = useCallback(async (shift, newChecked) => {
    if (!user || !db) return;
    try {
      await setDoc(doc(db, "checklists", user.uid), { [shift]: newChecked }, { merge: true });
    } catch {
      // non-critical — local state already updated
    }
  }, [user]);

  const toggle = (id) => {
    const newChecked = { ...checked, [id]: !checked[id] };
    setAllShiftChecked((p) => ({ ...p, [shift]: newChecked }));
    persistChecked(shift, newChecked);
  };

  const reset = () => {
    setAllShiftChecked((p) => ({ ...p, [shift]: {} }));
    persistChecked(shift, {});
  };

  const items = SHIFT_CHECKLISTS[shift];
  const done = items.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="checklist">
      <div className="cl-head">
        <div className="cl-tabs">
          {["1st", "2nd", "3rd"].map((s) => (
            <button key={s} className={`cl-tab${shift === s ? " active" : ""}`} onClick={() => setShift(s)}>{s} Shift</button>
          ))}
        </div>
        <span className="cl-count">{done}/{items.length}</span>
        <button className="cl-reset" onClick={reset} title="Reset"><RefreshCw size={13} /></button>
      </div>
      <div className="cl-bar"><div className="cl-fill" style={{ width: pct + "%" }} /></div>
      <ul className="cl-list">
        {items.map((item) => (
          <li key={item.id} className={`cl-item${checked[item.id] ? " done" : ""}`} onClick={() => toggle(item.id)}>
            {checked[item.id] ? <CheckCircle2 size={15} className="cl-icon done" /> : <Circle size={15} className="cl-icon" />}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
      {done === items.length && <div className="cl-complete">✅ All done — great shift!</div>}
    </div>
  );
}

// ─── Section View ─────────────────────────────────────────────────────────────
function SectionView({ section, editMode, onSave }) {
  const [ec, setEc] = useState(section.content || "");
  const [es, setEs] = useState(section.steps ? JSON.parse(JSON.stringify(section.steps)) : null);

  useEffect(() => {
    setEc(section.content || "");
    setEs(section.steps ? JSON.parse(JSON.stringify(section.steps)) : null);
  }, [section.id]);

  const addStep = () => setEs((p) => [...(p || []), { title: "New step", detail: "", tags: [] }]);
  const removeStep = (i) => setEs((p) => p.filter((_, idx) => idx !== i));
  const updateStep = (i, f, v) => setEs((p) => p.map((s, idx) => idx === i ? { ...s, [f]: v } : s));

  const renderContent = (text) =>
    (text || "").split("\n").map((line, i) => {
      if (!line) return null;
      if (line.startsWith("- ")) return <div key={i} className="sv-bullet">· {line.slice(2)}</div>;
      return <p key={i} className="sv-p" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />;
    });

  return (
    <div className="sv">
      <div className="sv-head">
        <span className="sv-emoji">{section.icon}</span>
        <div>
          <h1 className="sv-title">{section.label}</h1>
          <span className="sv-group">{section.group}</span>
          {section.lastEditedAt && (
            <span className="sv-edited">
              Last edited {new Date(section.lastEditedAt).toLocaleDateString()}
              {section.lastEditedBy ? ` by ${section.lastEditedBy}` : ""}
            </span>
          )}
        </div>
      </div>

      {section.content && (
        editMode ? (
          <div className="edit-block">
            <label className="edit-label">Section Notes</label>
            <textarea className="edit-ta" value={ec} onChange={(e) => setEc(e.target.value)} rows={6} />
          </div>
        ) : (
          <div className="sv-content">{renderContent(section.content)}</div>
        )
      )}

      {(es || section.steps) && (
        <div className="sv-steps">
          <div className="sv-sect-label">Steps</div>
          <ol className="steps-ol">
            {(editMode ? es : section.steps)?.map((step, i) => (
              <li key={i} className="step-li">
                <div className="step-n">{i + 1}</div>
                <div className="step-b">
                  {editMode ? (
                    <>
                      <input className="edit-in" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="Step title" />
                      <input className="edit-in sm" value={step.detail} onChange={(e) => updateStep(i, "detail", e.target.value)} placeholder="Detail (optional)" />
                      <button className="rm-btn" onClick={() => removeStep(i)}><Trash2 size={11} /> Remove</button>
                    </>
                  ) : (
                    <>
                      <div className="step-t">{step.title}</div>
                      {step.detail && <div className="step-d">{step.detail}</div>}
                      {step.tags?.length > 0 && (
                        <div className="step-tags">{step.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                      )}
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {editMode && <button className="add-btn" onClick={addStep}><Plus size={13} /> Add Step</button>}
        </div>
      )}

      {section.table && (
        <div className="sv-table-wrap">
          <table className="sv-table">
            <thead><tr>{section.table.headers.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{section.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><code>{c}</code></td>)}</tr>)}</tbody>
          </table>
        </div>
      )}

      {section.cheatItems && (
        <div className="cheat-grid">
          {section.cheatItems.map((c) => (
            <div key={c.title} className="cheat-card">
              <div className="cheat-t">{c.title}</div>
              <ul className="cheat-ul">{c.items.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {editMode && (
        <button className="save-btn" onClick={() => onSave(section.id, { content: ec, steps: es })}>
          <Save size={13} /> Save Changes
        </button>
      )}
    </div>
  );
}

// ─── Policy Log ───────────────────────────────────────────────────────────────
function PolicyLog({ log, editMode, onAdd, onDelete }) {
  const [form, setForm] = useState({ date: "", title: "", body: "" });
  const [adding, setAdding] = useState(false);
  const submit = () => {
    if (!form.title || !form.date) return;
    onAdd({ ...form, isNew: true });
    setForm({ date: "", title: "", body: "" });
    setAdding(false);
  };

  return (
    <div className="sv">
      <div className="sv-head">
        <span className="sv-emoji">📋</span>
        <div><h1 className="sv-title">Process Change Log</h1><span className="sv-group">Logs & Updates</span></div>
      </div>
      <p className="sv-p" style={{ marginBottom: 20 }}>All process changes, directives, and updates. Author: Jack Scales.</p>

      {editMode && (
        <div className="edit-block" style={{ marginBottom: 20 }}>
          {!adding
            ? <button className="add-btn" onClick={() => setAdding(true)}><Plus size={13} /> Add New Entry</button>
            : (
              <div className="new-entry">
                <input className="edit-in" placeholder="Date (e.g. August 1, 2025)" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
                <input className="edit-in" placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                <textarea className="edit-ta" placeholder="Description..." rows={3} value={form.body} onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="save-btn" onClick={submit}><Save size={13} /> Save</button>
                  <button className="cancel-btn" onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </div>
            )
          }
        </div>
      )}

      <div className="pl-list">
        {log.map((e, i) => (
          <div key={e._id || i} className={`pl-entry${e.isNew ? " new" : ""}`}>
            <div className="ple-meta">
              <span className="ple-date">{e.date}</span>
              {e.isNew && <span className="ple-badge">New</span>}
              {editMode && <button className="ple-del" onClick={() => onDelete(i)}><Trash2 size={11} /></button>}
            </div>
            <div className="ple-title">{e.title}</div>
            <div className="ple-body">{e.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loading Spinner ──────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" />
      <p className="spinner-label">Loading SOP data…</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActiveState] = useState(() => getActiveFromPath(location.pathname));
  const [searchOpen, setSearchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sections, setSections] = useState(SECTIONS);
  const [log, setLog] = useState(POLICY_LOG);
  const [toast, setToast] = useState(false);
  const [dataLoading, setDataLoading] = useState(isFirebaseConfigured);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured);
  const [loginOpen, setLoginOpen] = useState(false);

  // ── Auth state listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  // Logout clears edit mode
  const handleLogout = async () => {
    await signOut(auth);
    setEditMode(false);
  };

  // ── Sync active ↔ URL ──────────────────────────────────────────────────────
  useEffect(() => {
    setActiveState(getActiveFromPath(location.pathname));
  }, [location.pathname]);

  const nav = useCallback((id) => {
    setSidebarOpen(false);
    if (id === "home") navigate("/");
    else if (id === "policylog") navigate("/policylog");
    else navigate("/section/" + id);
  }, [navigate]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") { setSearchOpen(false); setLoginOpen(false); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Load data from Firestore ───────────────────────────────────────────────
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    async function loadData() {
      try {
        const [secSnap, logSnap] = await Promise.all([
          getDocs(query(collection(db, "sections"), orderBy("order"))),
          getDocs(query(collection(db, "policyLog"), orderBy("order"))),
        ]);
        if (!secSnap.empty) {
          setSections(secSnap.docs.map((d) => ({ ...d.data(), id: d.id })));
        }
        if (!logSnap.empty) {
          setLog(logSnap.docs.map((d) => ({ ...d.data(), _id: d.id })));
        }
      } catch (err) {
        console.warn("Firestore unavailable, using local data:", err.message);
      } finally {
        setDataLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Writes ─────────────────────────────────────────────────────────────────
  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const saveSection = useCallback(async (id, updates) => {
    const enriched = {
      ...updates,
      lastEditedAt: new Date().toISOString(),
      lastEditedBy: user?.email || "admin",
    };
    setSections((p) => p.map((s) => s.id === id ? { ...s, ...enriched } : s));
    if (db) {
      try {
        await updateDoc(doc(db, "sections", id), enriched);
      } catch (err) {
        console.error("saveSection failed:", err);
      }
    }
    showToast();
  }, [user]);

  const addEntry = useCallback(async (entry) => {
    if (db) {
      try {
        const ref = await addDoc(collection(db, "policyLog"), {
          ...entry,
          order: 0,
          createdAt: new Date().toISOString(),
        });
        setLog((p) => [{ ...entry, _id: ref.id }, ...p]);
      } catch (err) {
        console.error("addEntry failed:", err);
        setLog((p) => [entry, ...p]);
      }
    } else {
      setLog((p) => [entry, ...p]);
    }
    showToast();
  }, []);

  const deleteEntry = useCallback(async (i) => {
    if (!window.confirm("Delete this entry?")) return;
    const entry = log[i];
    setLog((p) => p.filter((_, idx) => idx !== i));
    if (db && entry._id) {
      try {
        await deleteDoc(doc(db, "policyLog", entry._id));
      } catch (err) {
        console.error("deleteEntry failed:", err);
      }
    }
  }, [log]);

  // ── Derived ────────────────────────────────────────────────────────────────
  const cur = sections.find((s) => s.id === active);

  if (!authReady || dataLoading) return <Spinner />;

  return (
    <div className="app">
      <Sidebar sections={sections} active={active} setActive={nav} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="main">
        <WhatsNew log={log} onNav={nav} />

        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
          <button className="search-btn" onClick={() => setSearchOpen(true)}>
            <Search size={14} /><span>Search procedures, codes...</span><kbd>⌘K</kbd>
          </button>
          <div className="tb-right">
            {editMode && <span className="edit-ind"><Edit3 size={12} /> Editing</span>}
            {user ? (
              <>
                <button
                  className={`edit-toggle${editMode ? " on" : ""}`}
                  onClick={() => setEditMode((p) => !p)}
                >
                  <Edit3 size={13} />{editMode ? "Done" : "Edit"}
                </button>
                <span className="tb-user" title={user.email}>{user.email}</span>
                <button className="tb-logout" onClick={handleLogout} title="Sign out">
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <button className="tb-login" onClick={() => setLoginOpen(true)}>
                <LogIn size={13} /> Sign In
              </button>
            )}
            {import.meta.env.DEV && isFirebaseConfigured && (
              <button className="tb-seed" onClick={seedFirestore} title="Seed Firestore with local data">
                <Database size={13} /> Seed DB
              </button>
            )}
          </div>
        </header>

        {toast && <div className="toast"><CheckCircle2 size={13} /> Saved</div>}

        <main className="content">
          {active === "home" && (
            <div className="home">
              <div className="home-title">
                <span>🏥</span>
                <div>
                  <h1>Room Control SOP</h1>
                  <p>Northside Hospital · 2025</p>
                </div>
              </div>
              <QuickFinder onNav={nav} />
              <Checklist user={user} />
            </div>
          )}
          {active === "policylog" && (
            <PolicyLog log={log} editMode={editMode} onAdd={addEntry} onDelete={deleteEntry} />
          )}
          {cur && <SectionView key={cur.id} section={cur} editMode={editMode} onSave={saveSection} />}
        </main>
      </div>

      {searchOpen && (
        <SearchModal onClose={() => setSearchOpen(false)} onNav={(id) => { nav(id); setSearchOpen(false); }} sections={sections} />
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
    </div>
  );
}
