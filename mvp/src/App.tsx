import { useMemo, useState } from 'react';

type Role = 'lab' | 'professional';
type Gig = { id: number; title: string; org: string; category: string; location: string; type: string; rate: number; duration: string; skills: string[]; description: string; applicants: number; posted: string };
type Application = { id: number; gigId: number; status: 'Applied' | 'Shortlisted' | 'Offered' | 'Hired' | 'Declined'; date: string };
type Milestone = { id: number; title: string; amount: number; status: 'Upcoming' | 'In progress' | 'Submitted' | 'Approved'; due: string };
type Engagement = { id: number; gigId: number; worker: string; org: string; status: string; total: number; milestones: Milestone[] };

const initialGigs: Gig[] = [
  { id: 1, title: 'HPLC method validation support', org: 'Northstar Therapeutics', category: 'Analytical Chemistry', location: 'Cambridge, MA', type: 'On-site', rate: 58, duration: '2 weeks', skills: ['HPLC', 'Method validation', 'GMP'], description: 'Support analytical method validation for a small-molecule development program. Includes instrument readiness, repeatability runs, and a concise validation report.', applicants: 4, posted: '2h ago' },
  { id: 2, title: 'Build a Python pipeline for assay data', org: 'Helix Carbon', category: 'Bioinformatics & Data', location: 'Remote · US', type: 'Remote', rate: 85, duration: '3–4 weeks', skills: ['Python', 'Pandas', 'Data visualization'], description: 'Clean and normalize assay exports, create reproducible QC checks, and deliver a documented analysis pipeline with a short handoff.', applicants: 7, posted: '5h ago' },
  { id: 3, title: 'Prototype enclosure design for benchtop device', org: 'Axiom Bioengineering', category: 'Mechanical Engineering', location: 'Boston, MA', type: 'Hybrid', rate: 72, duration: '10 days', skills: ['CAD', 'SolidWorks', 'Prototyping'], description: 'Develop a manufacturable enclosure concept for a compact benchtop instrument. Deliver CAD files, drawings, and a bill of materials.', applicants: 2, posted: '1d ago' },
  { id: 4, title: 'Cell culture process optimization', org: 'Meridian Cell Systems', category: 'Life Sciences', location: 'Waltham, MA', type: 'On-site', rate: 52, duration: '1 week', skills: ['Mammalian cell culture', ' aseptic technique', 'Documentation'], description: 'Evaluate a small matrix of culture conditions and summarize growth, viability, and process observations for the R&D team.', applicants: 5, posted: '1d ago' },
  { id: 5, title: 'Electrochemical test fixture development', org: 'Helix Carbon', category: 'Engineering', location: 'Somerville, MA', type: 'Hybrid', rate: 95, duration: '2–3 weeks', skills: ['Electrochemistry', 'Electrical engineering', 'DAQ'], description: 'Design and assemble a repeatable test fixture for electrochemical experiments, including instrumentation notes and calibration procedure.', applicants: 3, posted: '2d ago' },
  { id: 6, title: 'Technical writing: SOP cleanup', org: 'Beacon Biologics', category: 'Lab Operations', location: 'Remote · US', type: 'Remote', rate: 48, duration: '1 week', skills: ['SOPs', 'Quality systems', 'Technical writing'], description: 'Review and standardize a set of laboratory SOPs. Improve clarity, version control, and operator-facing checklists.', applicants: 9, posted: '3d ago' }
];

const seedApps: Application[] = [
  { id: 1, gigId: 2, status: 'Shortlisted', date: 'Nov 8' },
  { id: 2, gigId: 5, status: 'Applied', date: 'Nov 7' }
];

const seedEngagement: Engagement = {
  id: 1001, gigId: 2, worker: 'Alex Morgan', org: 'Helix Carbon', status: 'Active', total: 2400,
  milestones: [
    { id: 1, title: 'Data audit & pipeline outline', amount: 600, status: 'Approved', due: 'Nov 12' },
    { id: 2, title: 'Pipeline implementation', amount: 1200, status: 'In progress', due: 'Nov 19' },
    { id: 3, title: 'Validation & handoff', amount: 600, status: 'Upcoming', due: 'Nov 24' }
  ]
};

const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const statusClass = (s: string) => s.toLowerCase().replace(/\s+/g, '-');

export default function App() {
  const [role, setRole] = useState<Role>('professional');
  const [tab, setTab] = useState('Discover');
  const [gigs, setGigs] = useState(initialGigs);
  const [apps, setApps] = useState(seedApps);
  const [engagement, setEngagement] = useState<Engagement>(seedEngagement);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All disciplines');
  const [selected, setSelected] = useState<Gig | null>(null);
  const [showPost, setShowPost] = useState(false);
  const [notice, setNotice] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Life Sciences');
  const [newRate, setNewRate] = useState('65');
  const [newLocation, setNewLocation] = useState('Boston, MA');
  const [newDescription, setNewDescription] = useState('');
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  const filtered = useMemo(() => gigs.filter(g => {
    const q = search.toLowerCase();
    const matches = !q || [g.title, g.org, g.category, g.location, ...g.skills].join(' ').toLowerCase().includes(q);
    return matches && (category === 'All disciplines' || g.category === category);
  }), [gigs, search, category]);

  const flash = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 3200); };
  const apply = (gig: Gig) => {
    if (apps.some(a => a.gigId === gig.id)) { flash('You have already applied to this opportunity.'); return; }
    setApps(prev => [{ id: Date.now(), gigId: gig.id, status: 'Applied', date: 'Today' }, ...prev]);
    setGigs(prev => prev.map(g => g.id === gig.id ? { ...g, applicants: g.applicants + 1 } : g));
    setSelected(null); flash('Application submitted. The organization can now review your profile.');
  };
  const postGig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;
    const g: Gig = { id: Date.now(), title: newTitle, org: 'Your organization', category: newCategory, location: newLocation, type: 'Hybrid', rate: Number(newRate) || 65, duration: 'To be agreed', skills: ['Skills to be confirmed'], description: newDescription, applicants: 0, posted: 'Just now' };
    setGigs(prev => [g, ...prev]); setShowPost(false); setTab('Discover'); setRole('professional');
    setNewTitle(''); setNewDescription(''); flash('Your gig is live in the marketplace.');
  };
  const hire = (gig: Gig) => {
    setApps(prev => prev.map(a => a.gigId === gig.id ? { ...a, status: 'Offered' } : a));
    setEngagement({ id: Date.now(), gigId: gig.id, worker: 'Taylor Chen', org: gig.org, status: 'Offer pending', total: gig.rate * 40, milestones: [
      { id: Date.now() + 1, title: 'Scope & initial deliverable', amount: Math.round(gig.rate * 40 * .25), status: 'Upcoming', due: 'Nov 16' },
      { id: Date.now() + 2, title: 'Core work & review', amount: Math.round(gig.rate * 40 * .5), status: 'Upcoming', due: 'Nov 23' },
      { id: Date.now() + 3, title: 'Final delivery & handoff', amount: Math.round(gig.rate * 40 * .25), status: 'Upcoming', due: 'Nov 30' }
    ] });
    setTab('Engagement'); flash('Offer sent. The professional must accept before work begins.');
  };
  const acceptOffer = () => {
    if (engagement.status !== 'Offer pending') return;
    setEngagement(prev => ({ ...prev, status: 'Active' }));
    setApps(prev => prev.map(a => a.gigId === engagement.gigId ? { ...a, status: 'Hired' } : a));
    flash('Offer accepted. The engagement is now active and work can begin.');
  };
  const declineOffer = () => {
    if (engagement.status !== 'Offer pending') return;
    setEngagement(prev => ({ ...prev, status: 'Offer declined' }));
    setApps(prev => prev.map(a => a.gigId === engagement.gigId ? { ...a, status: 'Declined' } : a));
    flash('Offer declined. The organization can consider another applicant.');
  };
  const updateMilestone = (id: number, status: Milestone['status']) => {
    setEngagement(prev => ({ ...prev, status: 'Active', milestones: prev.milestones.map(m => m.id === id ? { ...m, status } : m) }));
    flash(status === 'Approved' ? 'Milestone approved. Demo payment marked ready for release.' : 'Milestone updated.');
  };
  const myGig = gigs.find(g => g.id === engagement.gigId) || gigs[1];
  const categories = ['All disciplines', 'Life Sciences', 'Analytical Chemistry', 'Bioinformatics & Data', 'Mechanical Engineering', 'Engineering', 'Lab Operations'];

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">b<span>.</span></div><div><strong>BioShift</strong><small>SCIENCE, IN MOTION</small></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <div className="role-switch">
        <button className={role === 'professional' ? 'active' : ''} onClick={() => { setRole('professional'); setTab('Discover'); }}><span className="avatar avatar-teal">TM</span><span><b>Professional</b><small>Talent workspace</small></span></button>
        <button className={role === 'lab' ? 'active' : ''} onClick={() => { setRole('lab'); setTab('Overview'); }}><span className="avatar avatar-amber">NS</span><span><b>Organization</b><small>Hiring workspace</small></span></button>
      </div>
      <div className="workspace-label nav-label">WORK</div>
      <nav>
        {(role === 'professional' ? [['Discover','⌕'],['My applications','▤'],['Engagement','◈'],['Profile','◎']] : [['Overview','▦'],['My gigs','▤'],['Applicants','♧'],['Engagement','◈']]).map(([name, icon]) =>
          <button key={name} className={tab === name ? 'nav-item selected' : 'nav-item'} onClick={() => setTab(name)}><span className="nav-icon">{icon}</span>{name}{name === 'My applications' && <em>{apps.length}</em>}</button>
        )}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon">✳</div><b>Need a hand?</b><p>Our team can help you get your first project moving.</p><button onClick={() => flash('Support contact: hello@bioshift.xyz')}>Contact support <span>↗</span></button></div>
        <div className="user-row"><div className="avatar avatar-dark">{role === 'professional' ? 'TM' : 'NS'}</div><div><b>{role === 'professional' ? 'Taylor Morgan' : 'Northstar Team'}</b><small>{role === 'professional' ? 'STEM Professional' : 'Organization admin'}</small></div><span className="more">•••</span></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <b>{tab}</b></div><div className="top-actions"><span className="demo-pill"><i/> DEMO ENVIRONMENT</span><button className="icon-button" aria-label="Notifications" onClick={() => flash('You are all caught up.')}>♧<i/></button><div className="top-avatar">{role === 'professional' ? 'TM' : 'NS'}</div></div></header>
      <div className="page-content">
        {tab === 'Discover' && role === 'professional' && <>
          <div className="page-heading"><div><div className="eyebrow">THE STEM WORKPLACE</div><h1>Find work that moves<br/><span>science forward.</span></h1><p>Specialized projects. Real teams. Meaningful work.</p></div><div className="heading-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="molecule">✳</div><span className="art-label">IDEAS → IMPACT</span></div></div>
          <div className="stats-strip"><div><strong>{gigs.length.toString().padStart(2,'0')}</strong><span>Open opportunities</span></div><div><strong>06</strong><span>STEM disciplines</span></div><div><strong>24–72h</strong><span>Typical response</span></div><div className="stats-note">New work, <b>every week.</b></div></div>
          <div className="section-head"><div><h2>Explore opportunities</h2><p>Find your next project across science and engineering.</p></div><button className="text-link" onClick={() => setCategory('All disciplines')}>View all opportunities ↗</button></div>
          <div className="filters"><div className="search-box"><span>⌕</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles, skills, organizations..." /></div><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select><button className="filter-button" onClick={() => { setSearch(''); setCategory('All disciplines'); }}>↺ <span>Reset</span></button></div>
          <div className="gig-grid">{filtered.map(g => <article className="gig-card" key={g.id}><div className="gig-card-top"><span className="category-tag">{g.category}</span><span className="posted">{g.posted}</span></div><h3>{g.title}</h3><div className="org-line"><span className="org-avatar">{g.org.slice(0,1)}</span><b>{g.org}</b><span className="verified">✓</span></div><p className="gig-description">{g.description}</p><div className="skill-list">{g.skills.slice(0,3).map(s => <span key={s}>{s}</span>)}</div><div className="gig-meta"><span>⌖ {g.location}</span><span>◷ {g.duration}</span></div><div className="gig-card-footer"><div><strong>{money(g.rate)}</strong><small>/ hour · {g.applicants} applicants</small></div><button className="outline-button" onClick={() => setSelected(g)}>View opportunity <span>↗</span></button></div></article>)}</div>
          {filtered.length === 0 && <div className="empty-state"><b>No opportunities found</b><p>Try a different search or reset your filters.</p></div>}
        </>}

        {tab === 'My applications' && role === 'professional' && <><div className="eyebrow">YOUR ACTIVITY</div><h1 className="compact-title">My applications</h1><p className="subhead">Keep track of every opportunity you've pursued.</p><div className="table-card"><div className="table-head"><b>Opportunity</b><b>Organization</b><b>Applied</b><b>Status</b></div>{apps.map(a => { const g = gigs.find(x => x.id === a.gigId); return <div className="table-row" key={a.id}><div><b>{g?.title || 'Research opportunity'}</b><small>{g?.category}</small></div><span>{g?.org}</span><span>{a.date}</span><span className={'status '+statusClass(a.status)}>{a.status}</span></div>; })}</div></>}

        {tab === 'Overview' && role === 'lab' && <><div className="eyebrow">ORGANIZATION WORKSPACE</div><h1 className="compact-title">Good morning, Northstar.</h1><p className="subhead">Here's what's happening across your projects.</p><div className="metric-grid"><div className="metric-card"><span>Open opportunities</span><strong>{gigs.filter(g=>g.org==='Your organization').length + 2}</strong><small>Actively recruiting</small></div><div className="metric-card"><span>Total applicants</span><strong>18</strong><small>Across active gigs</small></div><div className="metric-card"><span>Active engagements</span><strong>03</strong><small>Work in progress</small></div><div className="metric-card"><span>Awaiting review</span><strong>02</strong><small>Deliverables submitted</small></div></div><div className="section-head"><div><h2>Recent opportunities</h2><p>Manage your hiring pipeline.</p></div><button className="primary-button" onClick={() => setShowPost(true)}>＋ Post a gig</button></div><div className="table-card"><div className="table-head"><b>Opportunity</b><b>Discipline</b><b>Applicants</b><b>Posted</b></div>{gigs.slice(0,4).map(g=><div className="table-row" key={g.id}><div><b>{g.title}</b><small>{g.org}</small></div><span>{g.category}</span><span>{g.applicants} candidates</span><span>{g.posted}</span></div>)}</div></>}

        {tab === 'My gigs' && role === 'lab' && <><div className="eyebrow">HIRING PIPELINE</div><div className="heading-inline"><div><h1 className="compact-title">Your opportunities</h1><p className="subhead">Review your active and completed listings.</p></div><button className="primary-button" onClick={() => setShowPost(true)}>＋ Post a gig</button></div><div className="table-card">{gigs.map(g=><div className="table-row gig-list-row" key={g.id}><div><b>{g.title}</b><small>{g.category} · {g.location}</small></div><span>{g.applicants} applicants</span><span>{money(g.rate)}/hr</span><span className="status applied">Open</span></div>)}</div></>}

        {tab === 'Applicants' && role === 'lab' && <><div className="eyebrow">TALENT DISCOVERY</div><h1 className="compact-title">Meet your applicants.</h1><p className="subhead">Review candidates and move the right people forward.</p><div className="candidate-grid">{[{name:'Taylor Chen',role:'Research Associate · 5 years',skills:'Cell culture · Assay development · GMP',score:'Strong match'},{name:'Jordan Rivera',role:'Bioinformatics Engineer · 7 years',skills:'Python · R · Data pipelines',score:'Strong match'},{name:'Alex Morgan',role:'Analytical Chemist · 4 years',skills:'HPLC · LC-MS · Method validation',score:'Good match'}].map((c,i)=><div className="candidate-card" key={c.name}><div className="candidate-top"><div className="candidate-avatar">{c.name.split(' ').map(x=>x[0]).join('')}</div><span className="match-tag">✳ {c.score}</span></div><h3>{c.name}</h3><p>{c.role}</p><div className="candidate-skills">{c.skills}</div><button className="outline-button full" onClick={()=>flash(i===0?'Candidate profile opened in demo mode.':'Candidate profile opened in demo mode.')}>Review profile ↗</button><button className="primary-button full" onClick={()=>hire(gigs[i])}>Send offer</button></div>)}</div></>}

        {tab === 'Engagement' && <><div className="eyebrow">PROJECT WORKSPACE · #{engagement.id}</div><div className="heading-inline"><div><h1 className="compact-title">{myGig.title}</h1><p className="subhead">{engagement.org} <span>·</span> {engagement.worker} <span>·</span> <span className="status in-progress">{engagement.status}</span></p></div><div className="total-box"><small>PROJECT VALUE</small><b>{money(engagement.total)}</b>{role === 'professional' && engagement.status === 'Offer pending' && <div className="offer-actions"><button className="outline-button" onClick={declineOffer}>Decline</button><button className="primary-button" onClick={acceptOffer}>Accept offer →</button></div>}</div></div><div className="engagement-layout"><section className="milestone-panel"><div className="panel-heading"><div><h2>Milestones & deliverables</h2><p>Track progress, review work, and approve payments.</p></div><span className="progress-label">{engagement.milestones.filter(m=>m.status==='Approved').length}/{engagement.milestones.length} approved</span></div><div className="progress-track"><span style={{width: (engagement.milestones.filter(m=>m.status==='Approved').length/engagement.milestones.length*100)+'%'}}/></div>{engagement.milestones.map((m,i)=><div className="milestone-row" key={m.id}><div className={'milestone-number '+statusClass(m.status)}>{m.status==='Approved'?'✓':String(i+1).padStart(2,'0')}</div><div className="milestone-info"><b>{m.title}</b><small>Due {m.due} · {money(m.amount)}</small></div><span className={'status '+statusClass(m.status)}>{m.status}</span><div className="milestone-actions">{engagement.status === 'Active' && m.status==='Upcoming' && <button className="mini-button" onClick={()=>updateMilestone(m.id,'In progress')}>Start</button>}{engagement.status === 'Active' && m.status==='In progress' && <button className="mini-button" onClick={()=>updateMilestone(m.id,'Submitted')}>Submit work</button>}{role === 'lab' && m.status==='Submitted' && <button className="mini-button approve" onClick={()=>updateMilestone(m.id,'Approved')}>Approve & release</button>}{m.status==='Approved' && <span className="paid-label">✓ Payment ready</span>}</div></div>)}</section><aside className="payment-panel"><div className="payment-icon">＄</div><h3>Payment summary</h3><p>Milestone-based compensation with approval checkpoints.</p><div className="payment-line"><span>Project total</span><b>{money(engagement.total)}</b></div><div className="payment-line"><span>Approved</span><b>{money(engagement.milestones.filter(m=>m.status==='Approved').reduce((s,m)=>s+m.amount,0))}</b></div><div className="payment-line"><span>Awaiting approval</span><b>{money(engagement.milestones.filter(m=>m.status==='Submitted').reduce((s,m)=>s+m.amount,0))}</b></div><div className="payment-disclaimer">Demo ledger only. No real funds are collected or transferred.</div><button className="outline-button full" onClick={()=>flash('A downloadable project statement will be available when live billing is connected.')}>View transaction history ↗</button></aside></div></>}

        {tab === 'Profile' && role === 'professional' && <><div className="eyebrow">YOUR PROFESSIONAL IDENTITY</div><h1 className="compact-title">Your profile.</h1><p className="subhead">Show organizations what you know and what you can do.</p><div className="profile-card"><div className="profile-banner"/><div className="profile-body"><div className="profile-avatar">TM</div><h2>Taylor Morgan</h2><p>Research Associate · Boston, MA</p><div className="skill-list">{['Cell culture','Python','Assay development','GMP','Data analysis'].map(s=><span key={s}>{s}</span>)}</div><div className="profile-completion"><span>Profile completeness</span><b>80%</b><div className="progress-track"><span style={{width:'80%'}}/></div></div><button className="outline-button" onClick={()=>flash('Profile editor is part of the next build increment.')}>Edit profile</button></div></div></>}
      </div>
    </main>

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}>×</button><span className="category-tag">{selected.category}</span><h2>{selected.title}</h2><div className="org-line"><span className="org-avatar">{selected.org.slice(0,1)}</span><b>{selected.org}</b><span className="verified">✓</span></div><div className="modal-facts"><span>⌖ {selected.location}</span><span>◷ {selected.duration}</span><b>{money(selected.rate)}/hour</b></div><h4>About this opportunity</h4><p>{selected.description}</p><h4>Skills & experience</h4><div className="skill-list">{selected.skills.map(s=><span key={s}>{s}</span>)}</div><div className="modal-footer"><small>{selected.applicants} professionals have applied</small><button className="primary-button" onClick={()=>apply(selected)}>{apps.some(a=>a.gigId===selected.id)?'Already applied':'Apply to opportunity →'}</button></div></div></div>}

    {showPost && <div className="modal-backdrop" onClick={()=>setShowPost(false)}><form className="modal post-modal" onSubmit={postGig} onClick={e=>e.stopPropagation()}><button type="button" className="modal-close" onClick={()=>setShowPost(false)}>×</button><div className="eyebrow">CREATE OPPORTUNITY</div><h2>Post a STEM gig.</h2><p>Give great professionals the context they need to do great work.</p><label>Gig title<input required value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="e.g. Develop an assay validation protocol"/></label><label>Discipline<select value={newCategory} onChange={e=>setNewCategory(e.target.value)}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><div className="form-split"><label>Hourly budget ($)<input type="number" min="1" value={newRate} onChange={e=>setNewRate(e.target.value)}/></label><label>Location<input value={newLocation} onChange={e=>setNewLocation(e.target.value)}/></label></div><label>Scope & deliverables<textarea required rows={4} value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="Describe the work, expected output, and any important requirements..."/></label><div className="modal-footer"><small>Published immediately in demo mode.</small><button className="primary-button" type="submit">Publish gig →</button></div></form></div>}

    {notice && <div className="toast"><span>✓</span>{notice}</div>}
  </div>;
}