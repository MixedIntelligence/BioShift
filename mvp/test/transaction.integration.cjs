const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { Client } = require('pg');

const port = Number(process.env.TEST_API_PORT || 4317);
const base = `http://127.0.0.1:${port}/api`;
const env = { ...process.env, PORT: String(port), NODE_ENV: 'test', JWT_SECRET: 'integration-test-secret-at-least-32-characters' };
let server;
let client;

async function api(route, { token, method = 'GET', body } = {}) {
  const response = await fetch(base + route, {
    method,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}) },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  const data = await response.json();
  return { status: response.status, data };
}

async function waitForApi() {
  for (let i = 0; i < 50; i++) {
    try {
      const response = await fetch(base + '/health');
      if (response.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  throw new Error('API did not become healthy in time.');
}

async function register(role, email, fullName, organizationName) {
  const result = await api('/auth/register', {
    method: 'POST',
    body: { role, email, password: 'integration-password-123', fullName, ...(organizationName ? { organizationName } : {}) }
  });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  return result.data;
}

async function main() {
  client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  const schema = await readFile(path.join(__dirname, '..', 'server', 'schema.sql'), 'utf8');
  await client.query(schema);

  server = spawn(process.execPath, ['server/index.cjs'], { cwd: path.join(__dirname, '..'), env, stdio: 'inherit' });
  await waitForApi();

  const org = await register('organization', 'lab@example.test', 'Lab Owner', 'Example Research Lab');
  const worker = await register('professional', 'scientist@example.test', 'Sam Scientist');

  const gigBody = {
    title: 'Electrochemical assay validation',
    description: 'Validate assay repeatability and document a reproducible electrochemical test protocol.',
    discipline: 'Electrochemistry',
    location: 'Boston, MA',
    workMode: 'Hybrid',
    hourlyRateCents: 7500,
    estimatedHours: 24,
    skills: ['Electrochemistry', 'Data analysis']
  };
  const posted = await api('/gigs', { token: org.token, method: 'POST', body: gigBody });
  assert.equal(posted.status, 201, JSON.stringify(posted.data));
  const search = await api('/gigs?q=electrochemistry');
  assert.equal(search.status, 200);
  assert.equal(search.data.gigs.length, 1, 'skills/discipline search should find the gig');

  const application = await api(`/gigs/${posted.data.gig.id}/applications`, {
    token: worker.token, method: 'POST', body: { coverNote: 'I have relevant assay validation experience.' }
  });
  assert.equal(application.status, 201, JSON.stringify(application.data));
  const applicants = await api('/organizations/applications', { token: org.token });
  assert.equal(applicants.status, 200);
  const offer = await api(`/applications/${application.data.application.id}/offer`, { token: org.token, method: 'POST', body: {} });
  assert.equal(offer.status, 201, JSON.stringify(offer.data));

  const pending = await api('/engagements', { token: worker.token });
  assert.equal(pending.data.engagements[0].status, 'offered');
  const pendingMilestones = await api(`/engagements/${offer.data.engagement.id}/milestones`, { token: worker.token });
  assert.equal(pendingMilestones.status, 200);
  const firstMilestone = pendingMilestones.data.milestones[0];
  const blockedStart = await api(`/milestones/${firstMilestone.id}/start`, { token: worker.token, method: 'POST', body: {} });
  assert.equal(blockedStart.status, 409, 'work must not start before offer acceptance');

  const accepted = await api(`/engagements/${offer.data.engagement.id}/accept`, { token: worker.token, method: 'POST', body: {} });
  assert.equal(accepted.status, 200, JSON.stringify(accepted.data));

  const milestones = await api(`/engagements/${offer.data.engagement.id}/milestones`, { token: worker.token });
  assert.equal(milestones.data.milestones.length, 3);
  for (const milestone of milestones.data.milestones) {
    const prematureSubmit = await api(`/milestones/${milestone.id}/submit`, { token: worker.token, method: 'POST', body: {} });
    assert.equal(prematureSubmit.status, 409, 'milestone must be started before submission');
    const started = await api(`/milestones/${milestone.id}/start`, { token: worker.token, method: 'POST', body: {} });
    assert.equal(started.status, 200, JSON.stringify(started.data));
    const submitted = await api(`/milestones/${milestone.id}/submit`, { token: worker.token, method: 'POST', body: {} });
    assert.equal(submitted.status, 200, JSON.stringify(submitted.data));
    const approved = await api(`/milestones/${milestone.id}/approve`, { token: org.token, method: 'POST', body: {} });
    assert.equal(approved.status, 200, JSON.stringify(approved.data));
  }

  const payments = await api('/payments', { token: worker.token });
  assert.equal(payments.status, 200);
  assert.equal(payments.data.payments.length, 3);
  assert.ok(payments.data.payments.every(payment => payment.status === 'paid_demo'));
  const completed = await api('/engagements', { token: worker.token });
  assert.equal(completed.data.engagements[0].status, 'completed');
  const orgGigs = await api('/organizations/gigs', { token: org.token });
  assert.equal(orgGigs.data.gigs[0].status, 'completed');

  const secondGig = await api('/gigs', { token: org.token, method: 'POST', body: { ...gigBody, title: 'Microscopy image analysis' } });
  assert.equal(secondGig.status, 201);
  const secondApplication = await api(`/gigs/${secondGig.data.gig.id}/applications`, { token: worker.token, method: 'POST', body: {} });
  assert.equal(secondApplication.status, 201);
  const secondOffer = await api(`/applications/${secondApplication.data.application.id}/offer`, { token: org.token, method: 'POST', body: {} });
  assert.equal(secondOffer.status, 201);
  const declined = await api(`/engagements/${secondOffer.data.engagement.id}/decline`, { token: worker.token, method: 'POST', body: {} });
  assert.equal(declined.status, 200);
  const afterDecline = await api('/organizations/gigs', { token: org.token });
  assert.equal(afterDecline.data.gigs.find(gig => gig.id === secondGig.data.gig.id).status, 'open');

  console.log('BioShift integration test passed: registration, search, application, offer, acceptance, milestone delivery, demo ledger, completion, and decline.');
}

main()
  .catch(error => { console.error(error); process.exitCode = 1; })
  .finally(async () => {
    if (server) server.kill('SIGTERM');
    if (client) await client.end().catch(() => {});
  });
