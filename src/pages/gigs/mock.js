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
    }
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
    }
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
    }
  }
];

export default gigs;
