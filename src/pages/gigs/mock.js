// Mock data for demo gigs/projects

const gigs = [
  {
    id: 'gig-001',
    title: 'Protein Purification for Oncology Study',
    description: 'Assist with protein purification and analysis for a cancer research project. Requires experience with chromatography and mass spectrometry.',
    requiredSkills: ['Chromatography', 'Mass Spectrometry'],
    requiredCertifications: ['GLP'],
    duration: '4 weeks',
    location: 'Boston, MA',
    payRate: '$60/hr',
    lab: {
      name: 'Innovate Bio',
      industry: 'Biotech',
      size: '20',
      summary: 'A mid-sized biotech firm specializing in oncology research.'
    },
    status: 'Open',
    applicants: ['user-002'],
    awardedTo: null
  },
  {
    id: 'gig-002',
    title: 'Cell Culture Scale-Up',
    description: 'Support the scale-up of mammalian cell cultures for vaccine development. Must have experience with aseptic technique and bioreactors.',
    requiredSkills: ['Cell Culture', 'Aseptic Technique', 'Bioreactors'],
    requiredCertifications: ['Biosafety Level 2'],
    duration: '2 months',
    location: 'Remote',
    payRate: '$55/hr',
    lab: {
      name: 'VaxGen Labs',
      industry: 'Pharma',
      size: '50',
      summary: 'A pharmaceutical company focused on vaccine innovation.'
    },
    status: 'Awarded',
    applicants: ['user-002', 'user-006'],
    awardedTo: 'user-002'
  },
  {
    id: 'gig-003',
    title: 'Analytical Method Validation',
    description: 'Validate HPLC and GC methods for a new drug candidate. Prior experience with method validation required.',
    requiredSkills: ['HPLC', 'GC', 'Method Validation'],
    requiredCertifications: ['GLP'],
    duration: '6 weeks',
    location: 'San Diego, CA',
    payRate: '$70/hr',
    lab: {
      name: 'PharmaNext',
      industry: 'Pharma',
      size: '35',
      summary: 'A growing pharma company with a focus on analytical chemistry.'
    },
    status: 'Applied',
    applicants: ['user-006'],
    awardedTo: null
  },
  {
    id: 'gig-004',
    title: 'Microbiology QC Testing',
    description: 'Perform quality control microbiology testing for a new food product. Experience with PCR and microbial assays required.',
    requiredSkills: ['PCR', 'Microbial Assays'],
    requiredCertifications: ['Food Safety'],
    duration: '3 weeks',
    location: 'Chicago, IL',
    payRate: '$50/hr',
    lab: {
      name: 'FoodSafe Labs',
      industry: 'Food Science',
      size: '15',
      summary: 'A food safety lab specializing in rapid testing.'
    },
    status: 'Completed',
    applicants: ['user-002'],
    awardedTo: 'user-002'
  },
  {
    id: 'gig-005',
    title: 'Genomics Data Analysis',
    description: 'Analyze next-generation sequencing data for a rare disease study. Must be proficient in R and Python.',
    requiredSkills: ['NGS', 'R', 'Python'],
    requiredCertifications: ['Bioinformatics'],
    duration: '8 weeks',
    location: 'Remote',
    payRate: '$80/hr',
    lab: {
      name: 'GeneInsight',
      industry: 'Genomics',
      size: '10',
      summary: 'A genomics startup focused on rare disease research.'
    },
    status: 'Open',
    applicants: [],
    awardedTo: null
  }
];

export default gigs;
