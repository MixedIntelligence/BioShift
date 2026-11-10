import { FormEvent, useCallback, useEffect, useState } from 'react';
import './live.css';

type Role = 'organization' | 'professional';
type User = { id: string; email: string; role: Role; full_name: string; organization_name?: string; headline?: string; skills?: string[] };
type Gig = { id: string; title: string; description: string; discipline: string; location: string; work_mode: string; hourly_rate_cents: number; estimated_hours: number; status: string; skills: string[]; organization_name: string; created_at: string };
type Application = { id: string; gig_id: string; professional_id: string; status: string; cover_note: string; gig_title: string; full_name: string; headline?: string; skills?: string[] };
type Engagement = { id: string; gig_id: string; title: string; discipline: string; counterparty: string; status: string; agreed_total_cents: number };
type Milestone = { id: string; title: string; description: string; amount_cents: number; status: string; due_date?: string };
type Payment = { id: string; amount_cents: number; status: string; currency: string; milestone_title: string; gig_title: string; created_at: string; provider: string };

const API = import.meta.env.VITE_API_URL || '';
const money = (cents: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('bioshift_token') || '');
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [role, setRole] = useState<Role>('professional');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [tab, setTab] = useState('Discover');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activeEngagement, setActiveEngagement] = useState<Engagement | null>(null);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [gigForm, setGigForm] = useState({ title: '', description: '', discipline: 'Life Sciences', location: 'Boston, MA', workMode: 'Hybrid', hourlyRate: '65', hours: '40', skills: '' });
  const [coverNote, setCoverNote] = useState('');

  const request = useCallback(async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    const response = await fetch(`${API}/api${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const detail = typeof data.error === 'string' ? data.error : data.error?.formErrors?.join(', ') || Object.values(data.error?.fieldErrors || {}).flat().join(', ') || 'Please check the fields and try again.'; throw new Error(detail); }
    return data;
  }, [token]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [gigData, engagementData, paymentData] = await Promise.all([
      user.role === 'organization' ? request('/organizations/gigs') : request('/gigs'),
      request('/engagements'),
      request('/payments')
    ]);
    setGigs(gigData.gigs || []);
    setEngagements(engagementData.engagements || []);
    setPayments(paymentData.payments || []);
    if (user.role === 'organization') {
      const appData = await request('/organizations/applications');
      setApplications(appData.applications || []);
    } else {
      const appData = await request('/my/applications');
      setApplications(appData.applications || []);
    }
  }, [request, user]);

  useEffect(() => {
    if (!token) return;
    request('/auth/me').then(data => setUser(data.user)).catch(() => {
      sessionStorage.removeItem('bioshift_token'); setToken(''); setUser(null);
    });
  }, [token, request]);

  useEffect(() => { if (user) refresh().catch(e => setNotice(e.message)); }, [user, refresh]);

  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 4000); };
  const authenticate = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      const path = authMode === 'register' ? '/auth/register' : '/auth/login';
      const body = authMode === 'register'
        ? { email, password, role, fullName, ...(role === 'organization' ? { organizationName } : {}) }
        : { email, password };
      const data = await request(path, { method: 'POST', body: JSON.stringify(body) });
      sessionStorage.setItem('bioshift_token', data.token); setToken(data.token); setUser(data.user);
      setTab(data.user.role === 'organization' ? 'Overview' : 'Discover');
      flash('You are signed in to BioShift.');
    } catch (e) { flash(e instanceof Error ? e.message : 'Could not sign in.'); }
    finally { setBusy(false); }
  };
  const signOut = () => { sessionStorage.removeItem('bioshift_token'); setToken(''); setUser(null); setGigs([]); setApplications([]); setEngagements([]); setPayments([]); setTab('Discover'); };
  const run = async (fn: () => Promise<void>) => { setBusy(true); try { await fn(); } catch (e) { flash(e instanceof Error ? e.message : 'Something went wrong.'); } finally { setBusy(false); } };

  const postGig = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await request('/gigs', { method: 'POST', body: JSON.stringify({
        title: gigForm.title, description: gigForm.description, discipline: gigForm.discipline,
        location: gigForm.location, workMode: gigForm.workMode, hourlyRateCents: Math.round(Number(gigForm.hourlyRate) * 100),
        estimatedHours: Number(gigForm.hours), skills: gigForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      }) });
      setGigForm({ title: '', description: '', discipline: 'Life Sciences', location: 'Boston, MA', workMode: 'Hybrid', hourlyRate: '65', hours: '40', skills: '' });
      await refresh(); setTab('My gigs'); flash('Opportunity published.');
    });
  };
  const apply = (gig: Gig) => void run(async () => {
    await request(`/gigs/${gig.id}/applications`, { method: 'POST', body: JSON.stringify({ coverNote }) });
    setSelectedGig(null); setCoverNote(''); await refresh(); flash('Application submitted.');
  });
  const offer = (application: Application) => void run(async () => {
    await request(`/applications/${application.id}/offer`, { method: 'POST', body: JSON.stringify({}) });
    await refresh(); flash('Offer sent. Work begins only after the professional accepts.');
  });
  const decideOffer = (engagement: Engagement, decision: 'accept' | 'decline') => void run(async () => {
    await request(`/engagements/${engagement.id}/${decision}`, { method: 'POST', body: '{}' });
    await refresh(); flash(decision === 'accept' ? 'Offer accepted. Engagement activated.' : 'Offer declined.');
  });
  const openEngagement = (engagement: Engagement) => void run(async () => {
    const data = await request(`/engagements/${engagement.id}/milestones`);
    setActiveEngagement(engagement); setMilestones(data.milestones || []); setTab('Engagement detail');
  });
  const milestoneAction = (id: string, action: 'start' | 'submit' | 'approve') => void run(async () => {
    await request(`/milestones/${id}/${action}`, { method: 'POST', body: '{}' });
    if (activeEngagement) {
      const data = await request(`/engagements/${activeEngagement.id}/milestones`);
      setMilestones(data.milestones || []);
    }
    await refresh(); flash(action === 'approve' ? 'Work approved. A demo ledger entry was recorded; no funds moved.' : 'Milestone updated.');
  });

  if (!user) return <main className="auth-shell">
    <section className="auth-brand"><div className="brand-mark">b<span>.</span></div><p className="eyebrow">SCIENCE, IN MOTION</p><h1>Good work<br/>moves science forward.</h1><p>BioShift connects research organizations with the technical people who move projects from idea to result.</p><div className="auth-proof"><span>01 / DISCOVER</span><span>02 / COLLABORATE</span><span>03 / DELIVER</span></div></section>
    <form className="auth-card" onSubmit={authenticate}>
      <div className="eyebrow">{authMode === 'register' ? 'JOIN THE NETWORK' : 'WELCOME BACK'}</div><h2>{authMode === 'register' ? 'Create your account.' : 'Sign in.'}</h2><p className="muted">Use a separate account for each organization or professional.</p>
      <div className="auth-switch"><button type="button" className={authMode === 'register' ? 'chosen' : ''} onClick={() => setAuthMode('register')}>Create account</button><button type="button" className={authMode === 'login' ? 'chosen' : ''} onClick={() => setAuthMode('login')}>Sign in</button></div>
      {authMode === 'register' && <><label>I'm joining as<select value={role} onChange={e => setRole(e.target.value as Role)}><option value="professional">STEM professional</option><option value="organization">Organization / lab</option></select></label><label>Your name<input required minLength={2} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full name"/></label>{role === 'organization' && <label>Organization name<input required value={organizationName} onChange={e => setOrganizationName(e.target.value)} placeholder="Lab or organization"/></label>}</>}
      <label>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input required type="password" minLength={10} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 10 characters"/></label>
      <button className="primary wide" disabled={busy}>{busy ? 'Please wait…' : authMode === 'register' ? 'Create account →' : 'Sign in →'}</button>
      <p className="fine-print">Live API mode · Passwords are hashed by the server. This is an early MVP, not a production payment service.</p>
    </form>{notice && <div className="toast">{notice}</div>}
  </main>;

  const isOrg = user.role === 'organization';
  const nav = isOrg ? ['Overview', 'My gigs', 'Applicants', 'Engagements', 'Payments', 'Post a gig'] : ['Discover', 'My applications', 'Engagements', 'Payments'];
  const visibleGigs = gigs.filter(g => [g.title, g.description, g.discipline, g.organization_name, ...(g.skills || [])].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <div className="workspace">
    <aside className="rail"><div className="rail-brand"><span className="brand-mark">b<span>.</span></span><b>BioShift</b></div><div className="rail-caption">WORKSPACE</div><div className="account-chip"><div className="avatar">{user.full_name.slice(0,1).toUpperCase()}</div><div><b>{user.full_name}</b><small>{isOrg ? user.organization_name || 'Organization' : 'STEM Professional'}</small></div></div><div className="rail-caption">WORK</div><nav>{nav.map(n => <button key={n} className={tab === n ? 'active' : ''} onClick={() => setTab(n)}>{n}</button>)}</nav><div className="rail-bottom"><span className="live-dot"/> LIVE API CONNECTED<button className="signout" onClick={signOut}>Sign out ↗</button></div></aside>
    <main className="content"><header className="topline"><div>Workspace <span>/</span> <b>{tab}</b></div><div className="top-user">{user.email}</div></header>
      <section className="page">
        {tab === 'Discover' && !isOrg && <><div className="eyebrow">THE STEM WORKPLACE</div><h1>Find work that moves<br/><em>science forward.</em></h1><p className="lead">Specialized projects. Real teams. Meaningful work.</p><div className="toolbar"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects, skills, organizations…"/><button className="secondary" onClick={() => setQuery('')}>Reset</button></div><div className="card-grid">{visibleGigs.map(g => <article className="gig" key={g.id}><span className="tag">{g.discipline}</span><h3>{g.title}</h3><p className="muted">{g.organization_name} · {g.location} · {g.work_mode}</p><p>{g.description}</p><div className="gig-foot"><b>{money(g.hourly_rate_cents)} / hr</b><span>{g.estimated_hours} estimated hours</span></div><button className="primary" onClick={() => { setSelectedGig(g); setCoverNote(''); }}>View & apply →</button></article>)}</div>{visibleGigs.length === 0 && <div className="empty">No open opportunities match that search.</div>}</>}
        {tab === 'Overview' && isOrg && <><div className="eyebrow">ORGANIZATION WORKSPACE</div><h1>Build your research<br/><em>team.</em></h1><p className="lead">Post work, review specialists, and move projects forward.</p><div className="metric-row"><div><b>{gigs.length}</b><span>Open opportunities</span></div><div><b>{applications.length}</b><span>Applications</span></div><div><b>{engagements.length}</b><span>Engagements</span></div></div><button className="primary" onClick={() => setTab('Post a gig')}>Post a new opportunity →</button></>}
        {tab === 'My gigs' && isOrg && <><div className="eyebrow">YOUR OPPORTUNITIES</div><h1>My gigs.</h1><div className="card-grid">{gigs.map(g => <article className="gig" key={g.id}><span className="tag">{g.status}</span><h3>{g.title}</h3><p>{g.discipline} · {g.location}</p><b>{money(g.hourly_rate_cents)}/hr</b></article>)}</div></>}
        {tab === 'Post a gig' && isOrg && <><div className="eyebrow">CREATE OPPORTUNITY</div><h1>Post a STEM gig.</h1><form className="form-card" onSubmit={postGig}><label>Gig title<input required minLength={5} value={gigForm.title} onChange={e => setGigForm({...gigForm,title:e.target.value})}/></label><label>Discipline<input required value={gigForm.discipline} onChange={e => setGigForm({...gigForm,discipline:e.target.value})}/></label><label>Scope & deliverables<textarea required minLength={30} rows={5} value={gigForm.description} onChange={e => setGigForm({...gigForm,description:e.target.value})}/></label><div className="form-row"><label>Location<input value={gigForm.location} onChange={e => setGigForm({...gigForm,location:e.target.value})}/></label><label>Work mode<select value={gigForm.workMode} onChange={e => setGigForm({...gigForm,workMode:e.target.value})}><option>Remote</option><option>On-site</option><option>Hybrid</option></select></label></div><div className="form-row"><label>Hourly rate (USD)<input type="number" min="1" value={gigForm.hourlyRate} onChange={e => setGigForm({...gigForm,hourlyRate:e.target.value})}/></label><label>Estimated hours<input type="number" min="1" value={gigForm.hours} onChange={e => setGigForm({...gigForm,hours:e.target.value})}/></label></div><label>Skills (comma separated)<input value={gigForm.skills} onChange={e => setGigForm({...gigForm,skills:e.target.value})} placeholder="HPLC, GMP, Python"/></label><button className="primary" disabled={busy}>Publish opportunity →</button></form></>}
        {tab === 'Applicants' && isOrg && <><div className="eyebrow">TALENT PIPELINE</div><h1>Applicants.</h1>{applications.map(a => <article className="list-card" key={a.id}><div><h3>{a.full_name}</h3><p>{a.gig_title} · {a.headline || 'STEM professional'}</p><small>{a.cover_note}</small><span className="tag">{a.status}</span></div>{['submitted','shortlisted'].includes(a.status) && <button className="primary" onClick={() => offer(a)}>Send offer →</button>}</article>)}</>}
        {tab === 'My applications' && !isOrg && <><div className="eyebrow">YOUR ACTIVITY</div><h1>My applications.</h1>{applications.map(a => <article className="list-card" key={a.id}><div><h3>{a.gig_title}</h3><p>{a.status}</p></div></article>)}</>}
        {tab === 'Engagements' && <><div className="eyebrow">PROJECT DELIVERY</div><h1>Engagements.</h1>{engagements.map(e => <article className="list-card" key={e.id}><div><h3>{e.title}</h3><p>{e.discipline} · {e.counterparty} · {e.status}</p><b>{money(e.agreed_total_cents)}</b></div><button className="secondary" onClick={() => openEngagement(e)}>Open project →</button>{!isOrg && e.status === 'offered' && <div className="decision"><button className="primary" onClick={() => decideOffer(e,'accept')}>Accept</button><button className="secondary" onClick={() => decideOffer(e,'decline')}>Decline</button></div>}</article>)}</>}
        {tab === 'Payments' && <><div className="eyebrow">PAYMENT LEDGER</div><h1>Payment history.</h1><p className="lead">A record of approved project milestones. Demo entries do not represent money transferred.</p>{payments.length === 0 ? <div className="empty">No milestone approvals have been recorded yet.</div> : payments.map(p => <article className="list-card" key={p.id}><div><h3>{p.milestone_title}</h3><p>{p.gig_title} · {new Date(p.created_at).toLocaleDateString()}</p><small>{p.provider === 'demo' ? 'Demo ledger entry · no funds moved' : p.provider}</small></div><div className="payment-amount"><b>{money(p.amount_cents)}</b><span className="tag">{p.status === 'paid_demo' ? 'Demo recorded' : p.status}</span></div></article>)}</>}
        {tab === 'Engagement detail' && activeEngagement && <><button className="back" onClick={() => setTab('Engagements')}>← Back to engagements</button><div className="eyebrow">MILESTONE PLAN</div><h1>{activeEngagement.title}</h1><p className="lead">{activeEngagement.counterparty} · {money(activeEngagement.agreed_total_cents)}</p>{milestones.map(m => <article className="list-card" key={m.id}><div><h3>{m.title}</h3><p>{m.status} · {money(m.amount_cents)}</p></div>{!isOrg && m.status === 'upcoming' && <button className="secondary" onClick={() => milestoneAction(m.id,'start')}>Start work</button>}{!isOrg && m.status === 'in_progress' && <button className="primary" onClick={() => milestoneAction(m.id,'submit')}>Submit</button>}{isOrg && m.status === 'submitted' && <button className="primary" onClick={() => milestoneAction(m.id,'approve')}>Approve work</button>}</article>)}</>}
      </section>
    </main>
    {selectedGig && <div className="overlay" onClick={() => setSelectedGig(null)}><form className="dialog" onSubmit={e => { e.preventDefault(); apply(selectedGig); }} onClick={e => e.stopPropagation()}><button type="button" className="close" onClick={() => setSelectedGig(null)}>×</button><span className="tag">{selectedGig.discipline}</span><h2>{selectedGig.title}</h2><p>{selectedGig.organization_name} · {selectedGig.location}</p><p>{selectedGig.description}</p><label>Note to the organization<textarea rows={4} value={coverNote} onChange={e => setCoverNote(e.target.value)} placeholder="Introduce yourself and explain your relevant experience."/></label><button className="primary" disabled={busy}>Submit application →</button></form></div>}
    {notice && <div className="toast">{notice}</div>}
  </div>;
}
