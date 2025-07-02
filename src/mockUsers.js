// Mock data for demo lab professionals (users)

const users = [
  {
    id: 'user-001',
    firstName: 'Elena',
    lastName: 'Vance',
    email: 'elena.vance@example.com',
    role: 'lab',
    headline: 'Lab Manager | Protein Purification Specialist',
    summary: '8 years of experience in protein purification and analysis. Passionate about oncology research and flexible project work.',
    skills: ['Chromatography', 'Mass Spectrometry', 'Protein Purification'],
    certifications: [
      {
        name: 'GLP',
        issuingBody: 'ASQ',
        expiration: '2027-05-01',
        status: 'Active'
      }
    ],
    experience: [
      {
        company: 'BioCore Labs',
        role: 'Senior Scientist',
        description: 'Led protein purification projects for oncology drug discovery.'
      }
    ]
  },
  {
    id: 'user-002',
    firstName: 'Samir',
    lastName: 'Patel',
    email: 'samir.patel@example.com',
    role: 'worker',
    headline: 'Lab Worker | Cell Culture & Bioprocessing',
    summary: 'Specialist in mammalian cell culture and vaccine production. Experienced with bioreactors and aseptic technique.',
    skills: ['Cell Culture', 'Aseptic Technique', 'Bioreactors'],
    certifications: [
      {
        name: 'Biosafety Level 2',
        issuingBody: 'CDC',
        expiration: '2026-11-15',
        status: 'Active'
      }
    ],
    experience: [
      {
        company: 'VaxGen Labs',
        role: 'Process Engineer',
        description: 'Scaled up cell cultures for vaccine development.'
      }
    ]
  },
  {
    id: 'user-003',
    firstName: 'Admin',
    lastName: '',
    email: 'admin@flatlogic.com',
    role: 'admin',
    headline: 'Platform Administrator',
    summary: 'Demo admin account for managing users and platform data.',
    skills: [],
    certifications: [],
    experience: []
  },
  {
    id: 'user-004',
    firstName: 'Dr. Priya',
    lastName: 'Singh',
    email: 'priya.singh@pharmanext.com',
    role: 'provider',
    headline: 'Provider | Analytical Chemistry',
    summary: 'Expert in analytical chemistry and pharma project management.',
    skills: ['Analytical Chemistry', 'Project Management'],
    certifications: [],
    experience: [
      {
        company: 'PharmaNext',
        role: 'Project Lead',
        description: 'Managed analytical chemistry projects for pharma clients.'
      }
    ]
  }
];

export default users;
