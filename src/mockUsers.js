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
    ],
    skillMatch: 92, // percent
    experienceYears: 8,
    publications: 12,
    productFit: null,
    skillGaps: [],
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
    ],
    skillMatch: 88,
    experienceYears: 5,
    publications: 3,
    productFit: null,
    skillGaps: [],
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
    ],
    skillMatch: null,
    experienceYears: 10,
    publications: 18,
    productFit: 85, // percent
    skillGaps: ['HPLC', 'GLP'],
  },
  {
    id: 'user-005',
    firstName: 'Dr. Lisa',
    lastName: 'Nguyen',
    email: 'lisa.nguyen@foodsafe.com',
    role: 'lab',
    headline: 'Lab Director | Food Safety',
    summary: 'Director at FoodSafe Labs, specializing in rapid food safety testing and PCR.',
    skills: ['PCR', 'Microbial Assays', 'Food Safety'],
    certifications: [
      {
        name: 'Food Safety',
        issuingBody: 'FDA',
        expiration: '2028-03-10',
        status: 'Active'
      }
    ],
    experience: [
      {
        company: 'FoodSafe Labs',
        role: 'Lab Director',
        description: 'Oversaw quality control for food product launches.'
      }
    ],
    skillMatch: 95,
    experienceYears: 12,
    publications: 22,
    productFit: null,
    skillGaps: [],
  },
  {
    id: 'user-006',
    firstName: 'Miguel',
    lastName: 'Santos',
    email: 'miguel.santos@genomics.com',
    role: 'worker',
    headline: 'Bioinformatician | Genomics',
    summary: 'NGS and data analysis specialist, proficient in R and Python.',
    skills: ['NGS', 'R', 'Python'],
    certifications: [
      {
        name: 'Bioinformatics',
        issuingBody: 'ISCB',
        expiration: '2027-09-01',
        status: 'Active'
      }
    ],
    experience: [
      {
        company: 'GeneInsight',
        role: 'Bioinformatician',
        description: 'Analyzed rare disease sequencing data.'
      }
    ],
    skillMatch: 80,
    experienceYears: 4,
    publications: 5,
    productFit: null,
    skillGaps: [],
  },
  {
    id: 'user-007',
    firstName: 'Dr. Ahmed',
    lastName: 'Khan',
    email: 'ahmed.khan@genomics.com',
    role: 'provider',
    headline: 'Provider | Genomics',
    summary: 'Genomics project manager and NGS expert.',
    skills: ['NGS', 'Project Management'],
    certifications: [],
    experience: [
      {
        company: 'GeneInsight',
        role: 'Project Manager',
        description: 'Managed genomics research projects.'
      }
    ],
    skillMatch: null,
    experienceYears: 7,
    publications: 9,
    productFit: 90,
    skillGaps: ['Python', 'Bioinformatics'],
  }
];

export default users;
