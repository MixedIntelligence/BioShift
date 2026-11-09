require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const db = require('./db.cjs');

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'development-only-change-me';
const sign = user => jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
async function auth(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
    if (!token) return res.status(401).json({ error: 'Authentication required.' });
    const payload = jwt.verify(token, JWT_SECRET);
    const { rows } = await db.query('SELECT id,email,role,full_name,organization_name,headline,skills FROM users WHERE id=$1', [payload.sub]);
    if (!rows[0]) return res.status(401).json({ error: 'Account not found.' });
    req.user = rows[0]; next();
  } catch { return res.status(401).json({ error: 'Invalid or expired session.' }); }
}
const requireRole = role => (req,res,next) => req.user.role === role ? next() : res.status(403).json({error:'This action is not available for your account.'});
const registerSchema = z.object({ email:z.string().email(), password:z.string().min(10), role:z.enum(['organization','professional']), fullName:z.string().min(2), organizationName:z.string().optional() });
const gigSchema = z.object({ title:z.string().min(5).max(120), description:z.string().min(30).max(5000), discipline:z.string().min(2), location:z.string().default('Remote'), workMode:z.enum(['Remote','On-site','Hybrid']).default('Remote'), hourlyRateCents:z.number().int().positive(), estimatedHours:z.number().int().positive(), skills:z.array(z.string()).default([]) });

app.get('/api/health', (_req,res)=>res.json({status:'ok',service:'BioShift MVP API'}));

app.post('/api/auth/register', async (req,res) => {
  const parsed=registerSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({error:parsed.error.flatten()});
  const v=parsed.data;
  try {
    const hash=await bcrypt.hash(v.password,12);
    const {rows}=await db.query('INSERT INTO users(email,password_hash,role,full_name,organization_name) VALUES($1,$2,$3,$4,$5) RETURNING id,email,role,full_name,organization_name,headline,skills',[v.email.toLowerCase(),hash,v.role,v.fullName,v.organizationName||null]);
    res.status(201).json({token:sign(rows[0]),user:rows[0]});
  } catch(e) { if(e.code==='23505') return res.status(409).json({error:'An account with this email already exists.'}); res.status(500).json({error:'Could not create account.'}); }
});
app.post('/api/auth/login', async (req,res)=>{
  const {email,password}=req.body||{};
  const {rows}=await db.query('SELECT * FROM users WHERE email=$1',[String(email||'').toLowerCase()]);
  if(!rows[0] || !await bcrypt.compare(String(password||''),rows[0].password_hash)) return res.status(401).json({error:'Email or password is incorrect.'});
  const {password_hash,...user}=rows[0]; res.json({token:sign(user),user});
});
app.get('/api/auth/me',auth,(req,res)=>res.json({user:req.user}));

app.get('/api/gigs', async (req,res)=>{
  const q=String(req.query.q||'').trim();
  const values=[]; let where="g.status='open'";
  if(q){values.push('%'+q+'%');where+=' AND (g.title ILIKE $1 OR g.description ILIKE $1 OR g.discipline ILIKE $1 OR $1=ANY(g.skills))';}
  const {rows}=await db.query(`SELECT g.*,u.organization_name,u.full_name AS organization_contact FROM gigs g JOIN users u ON u.id=g.organization_id WHERE ${where} ORDER BY g.created_at DESC LIMIT 100`,values);
  res.json({gigs:rows});
});
app.post('/api/gigs',auth,requireRole('organization'),async(req,res)=>{
  const parsed=gigSchema.safeParse(req.body); if(!parsed.success)return res.status(400).json({error:parsed.error.flatten()});
  const v=parsed.data;
  const {rows}=await db.query('INSERT INTO gigs(organization_id,title,description,discipline,location,work_mode,hourly_rate_cents,estimated_hours,skills) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[req.user.id,v.title,v.description,v.discipline,v.location,v.workMode,v.hourlyRateCents,v.estimatedHours,v.skills]);
  res.status(201).json({gig:rows[0]});
});
app.post('/api/gigs/:id/applications',auth,requireRole('professional'),async(req,res)=>{
  try { const {rows}=await db.query('INSERT INTO applications(gig_id,professional_id,cover_note,proposed_rate_cents) SELECT id,$2,$3,$4 FROM gigs WHERE id=$1 AND status=\'open\' RETURNING *',[req.params.id,req.user.id,String(req.body.coverNote||''),req.body.proposedRateCents||null]); if(!rows[0])return res.status(404).json({error:'Open opportunity not found.'});res.status(201).json({application:rows[0]}); }
  catch(e){if(e.code==='23505')return res.status(409).json({error:'You have already applied.'});throw e;}
});
app.get('/api/organizations/applications',auth,requireRole('organization'),async(req,res)=>{
 const {rows}=await db.query('SELECT a.*,g.title AS gig_title,u.full_name,u.headline,u.skills FROM applications a JOIN gigs g ON g.id=a.gig_id JOIN users u ON u.id=a.professional_id WHERE g.organization_id=$1 ORDER BY a.created_at DESC',[req.user.id]);res.json({applications:rows});
});
app.post('/api/applications/:id/offer',auth,requireRole('organization'),async(req,res)=>{
 const client=await db.connect();
 try{
  await client.query('BEGIN');
  const {rows}=await client.query("SELECT a.*,g.organization_id,g.hourly_rate_cents,g.estimated_hours FROM applications a JOIN gigs g ON g.id=a.gig_id WHERE a.id=$1 FOR UPDATE",[req.params.id]);
  const a=rows[0];if(!a||a.organization_id!==req.user.id)throw Object.assign(new Error('Application not found.'),{status:404});
  if(!['submitted','shortlisted'].includes(a.status))throw Object.assign(new Error('Application cannot be offered in its current state.'),{status:409});
  const total=Number(req.body.agreedTotalCents||a.hourly_rate_cents*a.estimated_hours);
  if(!Number.isInteger(total)||total<=0)throw Object.assign(new Error('Invalid agreed amount.'),{status:400});
  const engagement=await client.query("INSERT INTO engagements(gig_id,application_id,organization_id,professional_id,agreed_total_cents) VALUES($1,$2,$3,$4,$5) RETURNING *",[a.gig_id,a.id,req.user.id,a.professional_id,total]);
  await client.query("UPDATE applications SET status='offered' WHERE id=$1",[a.id]);
  await client.query("UPDATE gigs SET status='in_progress' WHERE id=$1",[a.gig_id]);
  const parts=[Math.round(total*.25),Math.round(total*.5),total-Math.round(total*.25)-Math.round(total*.5)];
  for(let i=0;i<3;i++) await client.query('INSERT INTO milestones(engagement_id,title,amount_cents) VALUES($1,$2,$3)',[engagement.rows[0].id,['Scope & initial deliverable','Core work & review','Final delivery & handoff'][i],parts[i]]);
  await client.query('COMMIT');res.status(201).json({engagement:engagement.rows[0]});
 }catch(e){await client.query('ROLLBACK');res.status(e.status||500).json({error:e.message||'Could not create offer.'});}finally{client.release();}
});
app.get('/api/engagements',auth,async(req,res)=>{
 const field=req.user.role==='organization'?'organization_id':'professional_id';
 const {rows}=await db.query(`SELECT e.*,g.title,g.discipline,u.full_name AS counterparty FROM engagements e JOIN gigs g ON g.id=e.gig_id JOIN users u ON u.id=${field==='organization_id'?'e.professional_id':'e.organization_id'} WHERE e.${field}=$1 ORDER BY e.created_at DESC`,[req.user.id]);
 res.json({engagements:rows});
});
app.get('/api/engagements/:id/milestones',auth,async(req,res)=>{
 const {rows}=await db.query('SELECT m.*,e.organization_id,e.professional_id FROM milestones m JOIN engagements e ON e.id=m.engagement_id WHERE e.id=$1 AND (e.organization_id=$2 OR e.professional_id=$2) ORDER BY m.created_at',[req.params.id,req.user.id]);
 if(!rows.length)return res.status(404).json({error:'Engagement not found.'});res.json({milestones:rows});
});
app.post('/api/milestones/:id/start',auth,requireRole('professional'),async(req,res)=>{
 const {rows}=await db.query("UPDATE milestones m SET status='in_progress' FROM engagements e WHERE m.id=$1 AND m.engagement_id=e.id AND e.professional_id=$2 AND m.status='upcoming' RETURNING m.*",[req.params.id,req.user.id]);
 if(!rows[0])return res.status(409).json({error:'Milestone cannot be started.'});res.json({milestone:rows[0]});
});
app.post('/api/milestones/:id/submit',auth,requireRole('professional'),async(req,res)=>{
 const {rows}=await db.query("UPDATE milestones m SET status='submitted',submitted_at=now() FROM engagements e WHERE m.id=$1 AND m.engagement_id=e.id AND e.professional_id=$2 AND m.status IN ('in_progress','upcoming') RETURNING m.*",[req.params.id,req.user.id]);
 if(!rows[0])return res.status(409).json({error:'Milestone cannot be submitted.'});res.json({milestone:rows[0]});
});
app.post('/api/milestones/:id/approve',auth,requireRole('organization'),async(req,res)=>{
 const client=await db.connect();
 try{
  await client.query('BEGIN');
  const {rows}=await client.query("SELECT m.*,e.organization_id,e.id AS engagement_id FROM milestones m JOIN engagements e ON e.id=m.engagement_id WHERE m.id=$1 FOR UPDATE",[req.params.id]);
  const m=rows[0];if(!m||m.organization_id!==req.user.id)throw Object.assign(new Error('Milestone not found.'),{status:404});
  if(m.status!=='submitted')throw Object.assign(new Error('Only submitted work can be approved.'),{status:409});
  await client.query("UPDATE milestones SET status='approved',approved_at=now() WHERE id=$1",[m.id]);
  const provider=process.env.PAYMENTS_MODE==='demo'?'demo':'stripe_connect';
  const paymentStatus=provider==='demo'?'paid_demo':'pending';
  const payment=await client.query('INSERT INTO payments(milestone_id,engagement_id,amount_cents,provider,status) VALUES($1,$2,$3,$4,$5) RETURNING *',[m.id,m.engagement_id,m.amount_cents,provider,paymentStatus]);
  await client.query('COMMIT');res.json({milestone:{...m,status:'approved'},payment:payment.rows[0],notice:provider==='demo'?'Demo ledger entry only; no money moved.':'Payment queued for Stripe Connect integration.'});
 }catch(e){await client.query('ROLLBACK');res.status(e.status||500).json({error:e.message||'Could not approve milestone.'});}finally{client.release();}
});
app.get('/api/payments',auth,async(req,res)=>{
 const field=req.user.role==='organization'?'e.organization_id':'e.professional_id';
 const {rows}=await db.query(`SELECT p.*,m.title AS milestone_title,g.title AS gig_title FROM payments p JOIN milestones m ON m.id=p.milestone_id JOIN engagements e ON e.id=p.engagement_id JOIN gigs g ON g.id=e.gig_id WHERE e.${field}=$1 ORDER BY p.created_at DESC`,[req.user.id]);
 res.json({payments:rows});
});

app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:'Unexpected server error.'});});
const port=process.env.PORT||4000;
if(require.main===module) app.listen(port,()=>console.log(`BioShift MVP API listening on :${port}`));
module.exports=app;
