import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, X, ChevronRight, CheckCircle2, Circle,
  RefreshCw, Edit3, Save, Plus, Trash2, Bell, Menu, Zap
} from "lucide-react";
import { SECTIONS, POLICY_LOG, SHIFT_CHECKLISTS, QUICK_FINDER_SCENARIOS } from "./data/sop.js";
import "./App.css";

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

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setActive, open, setOpen }) {
  const groups = [...new Set(SECTIONS.map((s) => s.group))];
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
              {SECTIONS.filter((s) => s.group === g).map((s) => (
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

// ─── What's New ───────────────────────────────────────────────────────────────
function WhatsNew({ onNav }) {
  const [gone, setGone] = useState(false);
  const fresh = POLICY_LOG.filter((p) => p.isNew);
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
function Checklist() {
  const [shift, setShift] = useState("1st");
  const [checked, setChecked] = useState({});
  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const reset = () => setChecked({});
  const items = SHIFT_CHECKLISTS[shift];
  const done = items.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / items.length) * 100);

  return (
    <div className="checklist">
      <div className="cl-head">
        <div className="cl-tabs">
          {["1st", "2nd", "3rd"].map((s) => (
            <button key={s} className={`cl-tab${shift === s ? " active" : ""}`} onClick={() => { setShift(s); reset(); }}>{s} Shift</button>
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
          <div key={i} className={`pl-entry${e.isNew ? " new" : ""}`}>
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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sections, setSections] = useState(SECTIONS);
  const [log, setLog] = useState(POLICY_LOG);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const saveSection = useCallback((id, updates) => {
    setSections((p) => p.map((s) => s.id === id ? { ...s, ...updates } : s));
    showToast();
  }, []);

  const addEntry = useCallback((entry) => { setLog((p) => [entry, ...p]); showToast(); }, []);
  const deleteEntry = useCallback((i) => { if (window.confirm("Delete this entry?")) setLog((p) => p.filter((_, idx) => idx !== i)); }, []);

  const nav = (id) => { setActive(id); setSidebarOpen(false); };
  const cur = sections.find((s) => s.id === active);

  return (
    <div className="app">
      <Sidebar active={active} setActive={nav} open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="main">
        <WhatsNew onNav={nav} />

        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={18} /></button>
          <button className="search-btn" onClick={() => setSearchOpen(true)}>
            <Search size={14} /><span>Search procedures, codes...</span><kbd>⌘K</kbd>
          </button>
          <div className="tb-right">
            {editMode && <span className="edit-ind"><Edit3 size={12} /> Editing</span>}
            <button className={`edit-toggle${editMode ? " on" : ""}`} onClick={() => setEditMode((p) => !p)}>
              <Edit3 size={13} />{editMode ? "Done" : "Edit"}
            </button>
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
              <Checklist />
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
    </div>
  );
}
