const db = require('./db');
const bcrypt = require('bcryptjs');
const userModel = require('./user');
const gigModel = require('./gig');
const providerModel = require('./provider');
const applicationModel = require('./application');

async function seed() {
  console.log('Seeding database...');

  // Clear existing data in the correct order
  db.exec('DELETE FROM applications');
  db.exec('DELETE FROM user_skills');
  db.exec('DELETE FROM user_education');
  db.exec('DELETE FROM user_publications');
  db.exec('DELETE FROM gigs');
  db.exec('DELETE FROM provider_offerings');
  db.exec('DELETE FROM providers');
  db.exec('DELETE FROM users');

  // Reset autoincrement counters
  db.exec("DELETE FROM sqlite_sequence WHERE name IN ('users', 'gigs', 'applications', 'user_skills', 'user_education', 'user_publications', 'provider_offerings', 'providers');");

  // Create users
  const admin = await userModel.createUser('admin@example.com', await bcrypt.hash('password', 10), 'Admin');
  const lab1 = await userModel.createUser('lab1@example.com', await bcrypt.hash('password', 10), 'Lab');
  const lab2 = await userModel.createUser('lab2@example.com', await bcrypt.hash('password', 10), 'Lab');
  const worker1 = await userModel.createUser('worker1@example.com', await bcrypt.hash('password', 10), 'Worker');
  const worker2 = await userModel.createUser('worker2@example.com', await bcrypt.hash('password', 10), 'Worker');
  const provider1 = await userModel.createUser('provider1@example.com', await bcrypt.hash('password', 10), 'Provider');

  // Create Gigs
  const gig1 = await gigModel.createGig({ title: 'CRISPR Gene Editing Specialist', description: 'Seeking an expert in CRISPR-Cas9 for a 3-month project.', userId: lab1.id, location: 'Boston, MA' });
  const gig2 = await gigModel.createGig({ title: 'Mass Spectrometry Analyst', description: 'Experienced analyst needed for protein identification project.', userId: lab2.id, location: 'San Francisco, CA' });

  // Create Applications
  await gigModel.applyToGig(gig1.id, worker1.id);
  await gigModel.applyToGig(gig1.id, worker2.id);
  await gigModel.applyToGig(gig2.id, worker1.id);

  // Add worker profile data
  await userModel.addUserSkill(worker1.id, 'CRISPR-Cas9');
  await userModel.addUserSkill(worker1.id, 'Cell Culture');
  await userModel.addUserEducation(worker1.id, { institution: 'University of California, Berkeley', degree: 'PhD', field_of_study: 'Molecular Biology', start_year: 2018, end_year: 2022 });
  await userModel.addUserPublication(worker1.id, { title: 'A Novel Approach to Gene Editing', journal: 'Nature', year: 2022, url: 'https://www.nature.com' });

  await userModel.addUserSkill(worker2.id, 'Mass Spectrometry');
  await userModel.addUserSkill(worker2.id, 'Protein Purification');
  await userModel.addUserEducation(worker2.id, { institution: 'Massachusetts Institute of Technology', degree: 'MSc', field_of_study: 'Biochemistry', start_year: 2020, end_year: 2022 });

  // Add provider data
  const providerProfile = await providerModel.createProvider(provider1.id, 'BioTech Solutions', 'https://biotechsolutions.com');
  
  console.log('Database seeded successfully!');
}

seed().catch(err => {
  console.error('Failed to seed database:');
  console.error(err);
  process.exit(1);
});