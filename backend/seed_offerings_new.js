const Database = require('better-sqlite3');
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'biomvp.sqlite');
const db = new Database(dbPath);

// Sample offerings data
const offerings = [
  {
    title: "High-Performance Centrifuge Service",
    description: "Access to state-of-the-art ultracentrifuge for protein purification, cell separation, and molecular analysis. Our facility offers both preparative and analytical centrifugation services with expert technical support.",
    provider_id: 1,
    category: "Equipment",
    type: "Service",
    price: 150,
    pricing_type: "per_hour",
    location: "Boston, MA",
    image_url: "https://picsum.photos/400/300?random=1",
    contact_email: "centrifuge@biolab.com",
    contact_phone: "(555) 123-4567",
    availability: "Available",
    requirements: "Sample preparation guidelines must be followed",
    duration: "Flexible scheduling available"
  },
  {
    title: "Advanced Microscopy Workshop",
    description: "Comprehensive 3-day workshop covering electron microscopy, confocal imaging, and super-resolution techniques. Includes hands-on training with latest equipment and image analysis software.",
    provider_id: 2,
    category: "Training",
    type: "Course",
    price: 1200,
    pricing_type: "fixed",
    location: "San Francisco, CA",
    image_url: "https://picsum.photos/400/300?random=2",
    contact_email: "microscopy@techcenter.edu",
    contact_phone: "(555) 234-5678",
    availability: "Available",
    requirements: "Basic biology background required",
    duration: "3 days"
  },
  {
    title: "PCR Machine Rental",
    description: "Rent our high-end thermal cycler for your PCR needs. Equipment includes real-time PCR capability, gradient functionality, and capacity for 96-well plates. Perfect for short-term projects.",
    provider_id: 1,
    category: "Equipment",
    type: "Rental",
    price: 80,
    pricing_type: "per_day",
    location: "Cambridge, MA",
    image_url: "https://picsum.photos/400/300?random=3",
    contact_email: "equipment@biolab.com",
    contact_phone: "(555) 345-6789",
    availability: "Available",
    requirements: "Valid insurance and deposit required",
    duration: "Daily, weekly, or monthly rates available"
  },
  {
    title: "Protein Crystallization Service",
    description: "Professional protein crystallization services using robotic screening systems. We offer initial screening, optimization, and crystal harvesting for X-ray diffraction studies.",
    provider_id: 3,
    category: "Service",
    type: "Service",
    price: 500,
    pricing_type: "per_project",
    location: "New York, NY",
    image_url: "https://picsum.photos/400/300?random=4",
    contact_email: "crystals@structurebio.com",
    contact_phone: "(555) 456-7890",
    availability: "Available",
    requirements: "Purified protein samples required",
    duration: "2-4 weeks typical turnaround"
  },
  {
    title: "Bioinformatics Consulting",
    description: "Expert bioinformatics analysis for genomics, proteomics, and transcriptomics data. Services include pipeline development, statistical analysis, and custom visualization.",
    provider_id: 4,
    category: "Consulting",
    type: "Service",
    price: 120,
    pricing_type: "per_hour",
    location: "Remote/San Diego, CA",
    image_url: "https://picsum.photos/400/300?random=5",
    contact_email: "consulting@bioinfo.com",
    contact_phone: "(555) 567-8901",
    availability: "Available",
    requirements: "Data sharing agreement required",
    duration: "Project-based timing"
  },
  {
    title: "Cell Culture Facility Access",
    description: "Sterile cell culture facility with incubators, biosafety cabinets, and specialized equipment. Includes training and technical support for mammalian and microbial cell culture.",
    provider_id: 2,
    category: "Facility",
    type: "Access",
    price: 200,
    pricing_type: "per_day",
    location: "Seattle, WA",
    image_url: "https://picsum.photos/400/300?random=6",
    contact_email: "cellculture@biotech.org",
    contact_phone: "(555) 678-9012",
    availability: "Available",
    requirements: "Safety training certification required",
    duration: "Flexible scheduling"
  },
  {
    title: "Mass Spectrometry Analysis",
    description: "High-resolution mass spectrometry services for protein identification, metabolomics, and small molecule analysis. Includes sample preparation and data interpretation.",
    provider_id: 5,
    category: "Service",
    type: "Service",
    price: 300,
    pricing_type: "per_sample",
    location: "Chicago, IL",
    image_url: "https://picsum.photos/400/300?random=7",
    contact_email: "massspec@analyticallab.com",
    contact_phone: "(555) 789-0123",
    availability: "Available",
    requirements: "Proper sample preparation required",
    duration: "1-2 weeks turnaround"
  },
  {
    title: "DNA Sequencing Workshop",
    description: "Hands-on workshop covering next-generation sequencing technologies, library preparation, and data analysis. Suitable for researchers new to NGS technologies.",
    provider_id: 3,
    category: "Training",
    type: "Course",
    price: 800,
    pricing_type: "fixed",
    location: "Austin, TX",
    image_url: "https://picsum.photos/400/300?random=8",
    contact_email: "sequencing@genomics.edu",
    contact_phone: "(555) 890-1234",
    availability: "Available",
    requirements: "Basic molecular biology knowledge",
    duration: "2 days"
  },
  {
    title: "Fluorescence Microscope Rental",
    description: "High-end fluorescence microscope with multiple filter sets and digital camera system. Perfect for immunofluorescence, live cell imaging, and FISH applications.",
    provider_id: 1,
    category: "Equipment",
    type: "Rental",
    price: 120,
    pricing_type: "per_day",
    location: "Philadelphia, PA",
    image_url: "https://picsum.photos/400/300?random=9",
    contact_email: "microscopy@imagelab.com",
    contact_phone: "(555) 901-2345",
    availability: "Available",
    requirements: "Equipment training required",
    duration: "Daily or weekly rental"
  },
  {
    title: "Regulatory Compliance Consulting",
    description: "Expert guidance on FDA, EPA, and international regulatory requirements for biotechnology products. Includes documentation review and submission preparation.",
    provider_id: 6,
    category: "Consulting",
    type: "Service",
    price: 200,
    pricing_type: "per_hour",
    location: "Washington, DC",
    image_url: "https://picsum.photos/400/300?random=10",
    contact_email: "regulatory@biocompliance.com",
    contact_phone: "(555) 012-3456",
    availability: "Available",
    requirements: "NDA required for confidential projects",
    duration: "Project-dependent"
  },
  {
    title: "Cleanroom Facility Access",
    description: "ISO Class 5 cleanroom facility for sterile manufacturing and research. Includes gowning areas, laminar flow hoods, and quality control testing capabilities.",
    provider_id: 2,
    category: "Facility",
    type: "Access",
    price: 500,
    pricing_type: "per_day",
    location: "Research Triangle, NC",
    image_url: "https://picsum.photos/400/300?random=11",
    contact_email: "cleanroom@steriletech.com",
    contact_phone: "(555) 123-4567",
    availability: "Available",
    requirements: "Cleanroom certification required",
    duration: "Minimum 4-hour blocks"
  },
  {
    title: "Biostatistics Training Course",
    description: "Comprehensive course covering statistical methods for biological research, clinical trials, and epidemiological studies. Includes hands-on training with R and SAS.",
    provider_id: 4,
    category: "Training",
    type: "Course",
    price: 1000,
    pricing_type: "fixed",
    location: "Atlanta, GA",
    image_url: "https://picsum.photos/400/300?random=12",
    contact_email: "biostat@statistics.edu",
    contact_phone: "(555) 234-5678",
    availability: "Available",
    requirements: "Basic statistics background helpful",
    duration: "5 days"
  },
  {
    title: "Automated Liquid Handler Service",
    description: "High-throughput liquid handling services for assay development, screening, and sample preparation. Includes method development and validation.",
    provider_id: 5,
    category: "Equipment",
    type: "Service",
    price: 100,
    pricing_type: "per_plate",
    location: "San Jose, CA",
    image_url: "https://picsum.photos/400/300?random=13",
    contact_email: "automation@highthroughput.com",
    contact_phone: "(555) 345-6789",
    availability: "Available",
    requirements: "Assay protocol must be provided",
    duration: "1-3 days per project"
  },
  {
    title: "Intellectual Property Consulting",
    description: "Patent search, application preparation, and IP strategy consulting for biotechnology innovations. Specialized in biotech, pharmaceuticals, and medical devices.",
    provider_id: 6,
    category: "Consulting",
    type: "Service",
    price: 350,
    pricing_type: "per_hour",
    location: "Los Angeles, CA",
    image_url: "https://picsum.photos/400/300?random=14",
    contact_email: "ip@biotechlaw.com",
    contact_phone: "(555) 456-7890",
    availability: "Available",
    requirements: "Confidentiality agreement required",
    duration: "Varies by project complexity"
  },
  {
    title: "Chromatography System Rental",
    description: "HPLC and FPLC systems available for protein purification and analytical chemistry applications. Includes columns, detectors, and technical support.",
    provider_id: 1,
    category: "Equipment",
    type: "Rental",
    price: 150,
    pricing_type: "per_day",
    location: "Denver, CO",
    image_url: "https://picsum.photos/400/300?random=15",
    contact_email: "chromatography@separationtech.com",
    contact_phone: "(555) 567-8901",
    availability: "Available",
    requirements: "Method development may be needed",
    duration: "Weekly or monthly preferred"
  },
  {
    title: "Animal Research Facility Access",
    description: "AAALAC-accredited animal facility with mouse and rat housing, surgery suites, and behavioral testing equipment. Full veterinary support included.",
    provider_id: 3,
    category: "Facility",
    type: "Access",
    price: 300,
    pricing_type: "per_day",
    location: "Baltimore, MD",
    image_url: "https://picsum.photos/400/300?random=16",
    contact_email: "animalfacility@research.edu",
    contact_phone: "(555) 678-9012",
    availability: "Available",
    requirements: "IACUC approval required",
    duration: "Project-based scheduling"
  },
  {
    title: "Flow Cytometry Analysis Service",
    description: "Multi-parameter flow cytometry analysis and cell sorting services. Includes custom panel design, data analysis, and interpretation support.",
    provider_id: 4,
    category: "Service",
    type: "Service",
    price: 80,
    pricing_type: "per_sample",
    location: "Miami, FL",
    image_url: "https://picsum.photos/400/300?random=17",
    contact_email: "flowcytometry@cellanalysis.com",
    contact_phone: "(555) 789-0123",
    availability: "Available",
    requirements: "Fresh samples preferred",
    duration: "Same day or next day results"
  },
  {
    title: "Bioprocessing Pilot Plant",
    description: "Pilot-scale bioreactor facility for fermentation optimization, scale-up studies, and process development. Includes downstream processing equipment.",
    provider_id: 2,
    category: "Facility",
    type: "Access",
    price: 1000,
    pricing_type: "per_day",
    location: "Milwaukee, WI",
    image_url: "https://picsum.photos/400/300?random=18",
    contact_email: "bioprocessing@fermentation.com",
    contact_phone: "(555) 890-1234",
    availability: "Available",
    requirements: "Process development plan required",
    duration: "Multi-day campaigns typical"
  },
  {
    title: "Genome Editing Workshop",
    description: "Intensive workshop on CRISPR/Cas9 and other genome editing technologies. Includes design principles, delivery methods, and safety considerations.",
    provider_id: 5,
    category: "Training",
    type: "Course",
    price: 900,
    pricing_type: "fixed",
    location: "Portland, OR",
    image_url: "https://picsum.photos/400/300?random=19",
    contact_email: "genomeediting@crispr.edu",
    contact_phone: "(555) 901-2345",
    availability: "Available",
    requirements: "Molecular biology experience required",
    duration: "3 days"
  },
  {
    title: "Spectrophotometer Rental",
    description: "UV-Vis spectrophotometer with cuvette and microplate readers. Suitable for protein quantification, enzyme assays, and general analytical work.",
    provider_id: 1,
    category: "Equipment",
    type: "Rental",
    price: 50,
    pricing_type: "per_day",
    location: "Nashville, TN",
    image_url: "https://picsum.photos/400/300?random=20",
    contact_email: "spectro@analytical.com",
    contact_phone: "(555) 012-3456",
    availability: "Available",
    requirements: "Basic training provided",
    duration: "Daily or weekly rates"
  },
  {
    title: "Clinical Trial Design Consulting",
    description: "Expert consultation on clinical trial design, biostatistics, and regulatory strategy for biotech and pharmaceutical companies developing new therapies.",
    provider_id: 6,
    category: "Consulting",
    type: "Service",
    price: 250,
    pricing_type: "per_hour",
    location: "Phoenix, AZ",
    image_url: "https://picsum.photos/400/300?random=21",
    contact_email: "clinicaltrials@biostatconsult.com",
    contact_phone: "(555) 123-4567",
    availability: "Available",
    requirements: "Project scope discussion required",
    duration: "Multi-month engagements typical"
  },
  {
    title: "Biobanking Services",
    description: "Professional biobanking services including sample collection, processing, storage, and tracking. Compliant with international biobanking standards.",
    provider_id: 3,
    category: "Service",
    type: "Service",
    price: 25,
    pricing_type: "per_sample",
    location: "Houston, TX",
    image_url: "https://picsum.photos/400/300?random=22",
    contact_email: "biobank@cryostorage.com",
    contact_phone: "(555) 234-5678",
    availability: "Available",
    requirements: "Sample collection protocols provided",
    duration: "Long-term storage available"
  },
  {
    title: "Electron Microscopy Service",
    description: "High-resolution transmission and scanning electron microscopy services for structural biology, materials science, and nanotechnology applications.",
    provider_id: 4,
    category: "Service",
    type: "Service",
    price: 200,
    pricing_type: "per_hour",
    location: "Minneapolis, MN",
    image_url: "https://picsum.photos/400/300?random=23",
    contact_email: "em@nanostructure.com",
    contact_phone: "(555) 345-6789",
    availability: "Available",
    requirements: "Sample preparation consultation needed",
    duration: "Booking required in advance"
  },
  {
    title: "Biomarker Discovery Platform",
    description: "Comprehensive biomarker discovery services using proteomics, metabolomics, and genomics approaches. Includes biomarker validation and assay development.",
    provider_id: 5,
    category: "Service",
    type: "Service",
    price: 2500,
    pricing_type: "per_project",
    location: "Salt Lake City, UT",
    image_url: "https://picsum.photos/400/300?random=24",
    contact_email: "biomarkers@discovery.com",
    contact_phone: "(555) 456-7890",
    availability: "Available",
    requirements: "Study design consultation required",
    duration: "3-6 months typical"
  },
  {
    title: "Quality Management System Setup",
    description: "Implementation of ISO 13485 and FDA-compliant quality management systems for medical device and diagnostic companies. Includes documentation and training.",
    provider_id: 6,
    category: "Consulting",
    type: "Service",
    price: 180,
    pricing_type: "per_hour",
    location: "Las Vegas, NV",
    image_url: "https://picsum.photos/400/300?random=25",
    contact_email: "quality@compliance.com",
    contact_phone: "(555) 567-8901",
    availability: "Available",
    requirements: "Company assessment needed first",
    duration: "3-12 months implementation"
  }
];

// Insert offerings function
function insertOfferings() {
  console.log('Starting to insert offerings...');
  
  // Prepare insert statement
  const insertOffering = db.prepare(`
    INSERT INTO offerings (
      title, description, provider_id, category, type, price, pricing_type,
      location, image_url, contact_email, contact_phone, availability,
      requirements, duration, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Insert all offerings in a transaction
  const insertMany = db.transaction((offerings) => {
    for (const offering of offerings) {
      const now = new Date().toISOString();
      insertOffering.run(
        offering.title,
        offering.description,
        offering.provider_id,
        offering.category,
        offering.type,
        offering.price,
        offering.pricing_type,
        offering.location,
        offering.image_url,
        offering.contact_email,
        offering.contact_phone,
        offering.availability,
        offering.requirements,
        offering.duration,
        now,
        now
      );
    }
  });

  try {
    insertMany(offerings);
    console.log(`Successfully inserted ${offerings.length} offerings!`);
    
    // Verify the data was inserted
    const count = db.prepare('SELECT COUNT(*) as count FROM offerings').get();
    console.log(`Total offerings in database: ${count.count}`);
    
  } catch (error) {
    console.error('Error seeding offerings:', error);
  } finally {
    db.close();
  }
}

// Check if offerings table exists and create if needed
try {
  const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='offerings'").get();
  
  if (!row) {
    console.log('Creating offerings table...');
    db.exec(`
      CREATE TABLE offerings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        provider_id INTEGER,
        category TEXT,
        type TEXT,
        price DECIMAL(10,2),
        pricing_type TEXT,
        location TEXT,
        image_url TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        availability TEXT,
        requirements TEXT,
        duration TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES users(id)
      )
    `);
    console.log('Offerings table created successfully!');
  } else {
    console.log('Offerings table already exists.');
  }
  
  insertOfferings();
  
} catch (error) {
  console.error('Error with database operations:', error);
  db.close();
}
