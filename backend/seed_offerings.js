const Database = require('better-sqlite3');
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'biomvp.sqlite');
const db = new Database(dbPath);

// Sample offerings data
const offerings = [
  {
    title: "PCR Machine Services",
    description: "Professional PCR amplification services for research and diagnostic applications. State-of-the-art thermal cyclers with real-time monitoring capabilities.",
    category: "Equipment",
    type: "Service",
    price: 150.00,
    duration: "2-3 hours",
    location: "Boston, MA",
    image: "https://picsum.photos/400/300?random=1",
    tags: "PCR, DNA, amplification, molecular biology",
    requirements: "Provide DNA samples in appropriate buffer, specify primer sequences",
    deliverables: "Amplified DNA products, gel electrophoresis results, concentration measurements"
  },
  {
    title: "Bioinformatics Data Analysis Course",
    description: "Comprehensive 8-week course covering genomic data analysis, sequence alignment, and statistical methods in bioinformatics.",
    category: "Education",
    type: "Course",
    price: 899.00,
    duration: "8 weeks",
    location: "Online",
    image: "https://picsum.photos/400/300?random=2",
    tags: "bioinformatics, genomics, data analysis, statistics",
    requirements: "Basic programming knowledge, laptop with internet connection",
    deliverables: "Certificate of completion, project portfolio, access to course materials"
  },
  {
    title: "Microfluidics Device Fabrication",
    description: "Custom microfluidics chip design and fabrication for cell culture, drug screening, and diagnostic applications.",
    category: "Equipment",
    type: "Service",
    price: 2500.00,
    duration: "2-3 weeks",
    location: "San Diego, CA",
    image: "https://picsum.photos/400/300?random=3",
    tags: "microfluidics, PDMS, lab-on-chip, fabrication",
    requirements: "Detailed specifications, CAD files or design sketches",
    deliverables: "Functional microfluidics devices, testing protocols, documentation"
  },
  {
    title: "Flow Cytometry Analysis",
    description: "High-throughput flow cytometry services for cell sorting, phenotyping, and functional analysis with expert data interpretation.",
    category: "Equipment",
    type: "Service",
    price: 200.00,
    duration: "1-2 days",
    location: "Seattle, WA",
    image: "https://picsum.photos/400/300?random=4",
    tags: "flow cytometry, cell sorting, immunophenotyping, FACS",
    requirements: "Cell samples in appropriate media, antibody specifications",
    deliverables: "Flow cytometry data files, analysis reports, sorted cell populations"
  },
  {
    title: "CRISPR Gene Editing Workshop",
    description: "Hands-on workshop teaching CRISPR-Cas9 gene editing techniques, gRNA design, and delivery methods for various cell types.",
    category: "Education",
    type: "Workshop",
    price: 450.00,
    duration: "3 days",
    location: "Cambridge, MA",
    image: "https://picsum.photos/400/300?random=5",
    tags: "CRISPR, gene editing, molecular biology, workshop",
    requirements: "Basic cell culture experience, safety training certificate",
    deliverables: "Hands-on experience, protocol booklet, networking opportunities"
  },
  {
    title: "Confocal Microscopy Services",
    description: "Advanced confocal microscopy imaging services with 3D reconstruction and time-lapse capabilities for cell and tissue analysis.",
    category: "Equipment",
    type: "Service",
    price: 300.00,
    duration: "Half day",
    location: "New York, NY",
    image: "https://picsum.photos/400/300?random=6",
    tags: "confocal microscopy, imaging, fluorescence, 3D reconstruction",
    requirements: "Fixed or live samples, fluorescent labeling details",
    deliverables: "High-resolution images, 3D reconstructions, quantitative analysis"
  },
  {
    title: "Protein Purification Services",
    description: "Expert protein purification services using various chromatography techniques including HPLC, FPLC, and affinity purification.",
    category: "Service",
    type: "Service",
    price: 800.00,
    duration: "1-2 weeks",
    location: "San Francisco, CA",
    image: "https://picsum.photos/400/300?random=7",
    tags: "protein purification, chromatography, HPLC, biochemistry",
    requirements: "Protein expression system details, purification requirements",
    deliverables: "Purified protein samples, purity analysis, storage recommendations"
  },
  {
    title: "Next-Generation Sequencing",
    description: "Complete NGS services including library preparation, sequencing, and bioinformatics analysis for genomics and transcriptomics projects.",
    category: "Service",
    type: "Service",
    price: 1200.00,
    duration: "2-3 weeks",
    location: "Research Triangle, NC",
    image: "https://picsum.photos/400/300?random=8",
    tags: "NGS, sequencing, genomics, transcriptomics, bioinformatics",
    requirements: "High-quality DNA/RNA samples, project specifications",
    deliverables: "Sequencing data, quality reports, bioinformatics analysis"
  },
  {
    title: "Cell Culture Training Program",
    description: "Comprehensive cell culture training covering sterile technique, media preparation, passaging, and contamination prevention.",
    category: "Education",
    type: "Training",
    price: 350.00,
    duration: "2 days",
    location: "Chicago, IL",
    image: "https://picsum.photos/400/300?random=9",
    tags: "cell culture, sterile technique, training, laboratory skills",
    requirements: "Basic laboratory safety training",
    deliverables: "Certification, practical skills assessment, resource materials"
  },
  {
    title: "Mass Spectrometry Analysis",
    description: "High-resolution mass spectrometry services for protein identification, metabolomics, and small molecule analysis.",
    category: "Equipment",
    type: "Service",
    price: 400.00,
    duration: "3-5 days",
    location: "Philadelphia, PA",
    image: "https://picsum.photos/400/300?random=10",
    tags: "mass spectrometry, proteomics, metabolomics, analysis",
    requirements: "Sample preparation guidelines, analysis specifications",
    deliverables: "MS data files, compound identification, quantitative results"
  },
  {
    title: "Biostatistics Consulting",
    description: "Expert biostatistics consulting for experimental design, data analysis, and manuscript preparation for publication.",
    category: "Consulting",
    type: "Service",
    price: 125.00,
    duration: "Per hour",
    location: "Remote",
    image: "https://picsum.photos/400/300?random=11",
    tags: "biostatistics, data analysis, experimental design, consulting",
    requirements: "Project details, data format specifications",
    deliverables: "Statistical analysis reports, publication-ready figures, consultation"
  },
  {
    title: "Biosafety Training Certification",
    description: "Complete biosafety training program covering BSL-1 to BSL-3 protocols, waste management, and emergency procedures.",
    category: "Education",
    type: "Certification",
    price: 275.00,
    duration: "1 day",
    location: "Multiple locations",
    image: "https://picsum.photos/400/300?random=12",
    tags: "biosafety, training, certification, laboratory safety",
    requirements: "None - suitable for all experience levels",
    deliverables: "Biosafety certification, training materials, compliance documentation"
  },
  {
    title: "Electron Microscopy Services",
    description: "High-resolution electron microscopy services including sample preparation, imaging, and analysis for materials and biological samples.",
    category: "Equipment",
    type: "Service",
    price: 500.00,
    duration: "1 week",
    location: "Austin, TX",
    image: "https://picsum.photos/400/300?random=13",
    tags: "electron microscopy, SEM, TEM, imaging, materials science",
    requirements: "Sample preparation protocols, imaging specifications",
    deliverables: "High-resolution images, morphological analysis, measurement data"
  },
  {
    title: "Antibody Production Services",
    description: "Custom antibody production services including antigen design, immunization protocols, and antibody purification.",
    category: "Service",
    type: "Service",
    price: 3500.00,
    duration: "3-4 months",
    location: "Denver, CO",
    image: "https://picsum.photos/400/300?random=14",
    tags: "antibody production, immunization, purification, custom antibodies",
    requirements: "Antigen specifications, antibody requirements, timeline",
    deliverables: "Purified antibodies, characterization data, production protocols"
  },
  {
    title: "Synthetic Biology Workshop",
    description: "Intensive workshop on synthetic biology principles, genetic circuit design, and bioengineering applications.",
    category: "Education",
    type: "Workshop",
    price: 650.00,
    duration: "5 days",
    location: "San Jose, CA",
    image: "https://picsum.photos/400/300?random=15",
    tags: "synthetic biology, genetic circuits, bioengineering, workshop",
    requirements: "Molecular biology background, laptop for computational work",
    deliverables: "Hands-on projects, design tools access, networking opportunities"
  },
  {
    title: "Tissue Engineering Platform",
    description: "Access to tissue engineering facilities including bioreactors, scaffolds, and characterization equipment for research projects.",
    category: "Equipment",
    type: "Equipment Access",
    price: 200.00,
    duration: "Per day",
    location: "Pittsburgh, PA",
    image: "https://picsum.photos/400/300?random=16",
    tags: "tissue engineering, bioreactors, scaffolds, regenerative medicine",
    requirements: "Research proposal, safety training, project timeline",
    deliverables: "Equipment access, technical support, data collection assistance"
  },
  {
    title: "Drug Screening Services",
    description: "High-throughput drug screening services using automated liquid handling and various cell-based assays.",
    category: "Service",
    type: "Service",
    price: 1500.00,
    duration: "2-4 weeks",
    location: "San Diego, CA",
    image: "https://picsum.photos/400/300?random=17",
    tags: "drug screening, high-throughput, cell assays, pharmaceutical",
    requirements: "Compound libraries, assay specifications, target information",
    deliverables: "Screening results, dose-response curves, hit identification"
  },
  {
    title: "Molecular Cloning Services",
    description: "Expert molecular cloning services including vector design, construction, and validation for research applications.",
    category: "Service",
    type: "Service",
    price: 450.00,
    duration: "1-2 weeks",
    location: "Baltimore, MD",
    image: "https://picsum.photos/400/300?random=18",
    tags: "molecular cloning, vector construction, DNA manipulation, plasmids",
    requirements: "Gene sequences, vector preferences, cloning specifications",
    deliverables: "Cloned vectors, sequence verification, bacterial stocks"
  },
  {
    title: "Bioimaging Analysis Course",
    description: "Advanced course on bioimaging analysis techniques including image processing, quantification, and statistical analysis.",
    category: "Education",
    type: "Course",
    price: 750.00,
    duration: "4 weeks",
    location: "Online/Hybrid",
    image: "https://picsum.photos/400/300?random=19",
    tags: "bioimaging, image analysis, quantification, microscopy",
    requirements: "Basic microscopy knowledge, access to imaging software",
    deliverables: "Course completion certificate, analysis workflows, software training"
  },
  {
    title: "Metabolomics Analysis Platform",
    description: "Comprehensive metabolomics analysis services including sample preparation, LC-MS analysis, and data interpretation.",
    category: "Service",
    type: "Service",
    price: 900.00,
    duration: "2-3 weeks",
    location: "Minneapolis, MN",
    image: "https://picsum.photos/400/300?random=20",
    tags: "metabolomics, LC-MS, data analysis, biochemistry",
    requirements: "Biological samples, experimental design, analysis goals",
    deliverables: "Metabolite profiles, pathway analysis, statistical reports"
  },
  {
    title: "Laboratory Automation Consultation",
    description: "Expert consultation on laboratory automation solutions, workflow optimization, and equipment integration.",
    category: "Consulting",
    type: "Consulting",
    price: 200.00,
    duration: "Per hour",
    location: "Remote/On-site",
    image: "https://picsum.photos/400/300?random=21",
    tags: "laboratory automation, workflow optimization, equipment integration",
    requirements: "Current laboratory setup details, automation goals",
    deliverables: "Automation recommendations, implementation plan, ROI analysis"
  },
  {
    title: "Stem Cell Culture Services",
    description: "Specialized stem cell culture services including iPSC generation, differentiation protocols, and characterization.",
    category: "Service",
    type: "Service",
    price: 1100.00,
    duration: "3-6 weeks",
    location: "Los Angeles, CA",
    image: "https://picsum.photos/400/300?random=22",
    tags: "stem cells, iPSC, differentiation, cell culture, regenerative medicine",
    requirements: "Starting cell lines, differentiation goals, quality standards",
    deliverables: "Differentiated cells, characterization data, culture protocols"
  },
  {
    title: "Regulatory Affairs Workshop",
    description: "Workshop on regulatory requirements for biotechnology products, FDA submissions, and compliance strategies.",
    category: "Education",
    type: "Workshop",
    price: 850.00,
    duration: "2 days",
    location: "Washington, DC",
    image: "https://picsum.photos/400/300?random=23",
    tags: "regulatory affairs, FDA, compliance, biotechnology, workshop",
    requirements: "Industry background preferred but not required",
    deliverables: "Regulatory knowledge, compliance templates, expert networking"
  },
  {
    title: "Crystallography Services",
    description: "Protein crystallography services including crystallization screening, structure determination, and refinement.",
    category: "Service",
    type: "Service",
    price: 2200.00,
    duration: "6-8 weeks",
    location: "Berkeley, CA",
    image: "https://picsum.photos/400/300?random=24",
    tags: "crystallography, protein structure, X-ray diffraction, structural biology",
    requirements: "Purified protein samples, concentration requirements, project timeline",
    deliverables: "Crystal structures, refinement statistics, coordinate files"
  },
  {
    title: "Bioprocess Development Training",
    description: "Comprehensive training on bioprocess development including fermentation, scale-up, and downstream processing.",
    category: "Education",
    type: "Training",
    price: 950.00,
    duration: "1 week",
    location: "Houston, TX",
    image: "https://picsum.photos/400/300?random=25",
    tags: "bioprocess development, fermentation, scale-up, downstream processing",
    requirements: "Chemical engineering or biotechnology background",
    deliverables: "Process development skills, scale-up strategies, industry connections"
  }
];

// Function to insert offerings
function insertOfferings() {
  console.log('Starting to insert sample offerings...');
  
  // First, get the user_id of a Provider user (we'll need to create one or use existing)
  db.get("SELECT id FROM users WHERE role = 'Provider' LIMIT 1", (err, user) => {
    if (err) {
      console.error('Error finding provider user:', err);
      return;
    }
    
    const providerId = user ? user.id : 1; // Use existing provider or default to user 1
    
    // Insert each offering
    const insertStmt = db.prepare(`
      INSERT INTO offerings (
        title, description, category, type, price, duration, location, 
        image, tags, requirements, deliverables, user_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    let insertedCount = 0;
    offerings.forEach((offering, index) => {
      insertStmt.run([
        offering.title,
        offering.description,
        offering.category,
        offering.type,
        offering.price,
        offering.duration,
        offering.location,
        offering.image,
        offering.tags,
        offering.requirements,
        offering.deliverables,
        providerId
      ], function(err) {
        if (err) {
          console.error(`Error inserting offering ${index + 1}:`, err);
        } else {
          insertedCount++;
          console.log(`Inserted offering ${insertedCount}/25: ${offering.title}`);
        }
        
        if (insertedCount === offerings.length) {
          insertStmt.finalize();
          console.log(`Successfully inserted all ${insertedCount} sample offerings!`);
          db.close();
        }
      });
    });
  });
}

// Check if offerings table exists and create if needed
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='offerings'", (err, row) => {
  if (err) {
    console.error('Error checking for offerings table:', err);
    return;
  }
  
  if (!row) {
    console.log('Creating offerings table...');
    db.run(`
      CREATE TABLE offerings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        type TEXT,
        price DECIMAL(10,2),
        duration TEXT,
        location TEXT,
        image TEXT,
        tags TEXT,
        requirements TEXT,
        deliverables TEXT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `, (err) => {
      if (err) {
        console.error('Error creating offerings table:', err);
      } else {
        console.log('Offerings table created successfully!');
        insertOfferings();
      }
    });
  } else {
    console.log('Offerings table already exists.');
    insertOfferings();
  }
});
