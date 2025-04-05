// dbSetup.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('users.db');

// ==============================
// Create Tables
// ==============================

// Lawyers Table
db.run(`
  CREATE TABLE IF NOT EXISTS lawyers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    lawyer_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Victims Table
db.run(`
  CREATE TABLE IF NOT EXISTS victims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    victim_id TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Cases Table
db.run(`
  CREATE TABLE IF NOT EXISTS cases (
    case_id TEXT PRIMARY KEY,
    crime TEXT NOT NULL,
    status TEXT NOT NULL,
    victim TEXT NOT NULL,
    detail1 TEXT,
    detail2 TEXT,
    detail3 TEXT,
    detail4 TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// ==============================
// Insert Default Case Records
// ==============================

const insertCase = db.prepare(`
  INSERT OR IGNORE INTO cases (case_id, crime, status, victim, detail1, detail2, detail3, detail4)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const cases = {
  "C001": {
    crime: "Theft",
    status: "Pending",
    victim: "John Doe (johndoe@gmail.com)",
    details: [
      "Burglary at a jewelry shop; items worth ₹10,00,000 stolen.",
      "CCTV footage shows two masked individuals.",
      "Possible insider involvement under investigation.",
      "Police tracking stolen items in the black market."
    ]
  },
  "C002": {
    crime: "Fraud",
    status: "Ongoing",
    victim: "Jane Smith (janesmith@gmail.com)",
    details: [
      "Scammer posed as a government officer and offered fake loans.",
      "Multiple victims reported fraudulent transactions.",
      "Bank statements show suspicious withdrawals.",
      "Main suspect identified; investigation in progress."
    ]
  },
  "C003": {
    crime: "Murder",
    status: "Pending",
    victim: "David Clark (davidclark@gmail.com)",
    details: [
      "Victim found in an abandoned warehouse with multiple stab wounds.",
      "DNA reports indicate multiple suspects.",
      "Weapon with fingerprints recovered at the crime scene.",
      "Possible gang involvement; under investigation."
    ]
  },
  "C004": {
    crime: "Cybercrime",
    status: "Under Investigation",
    victim: "TechCorp Ltd. (techcorp@gmail.com)",
    details: [
      "Company database breached, exposing 5,000+ customer records.",
      "Hackers demanded ransom in cryptocurrency.",
      "Forensic experts analyzing attack vectors.",
      "Suspected phishing emails as entry point."
    ]
  },
  "C005": {
    crime: "Assault",
    status: "In Court",
    victim: "Michael Brown (michaelbrown@gmail.com)",
    details: [
      "Victim attacked during a street fight.",
      "CCTV footage captured the incident.",
      "Suspect has a prior criminal record.",
      "Medical reports confirm serious injuries."
    ]
  },
  "C006": {
    crime: "Drug Trafficking",
    status: "Arrest Made",
    victim: "N/A (na@gmail.com)",
    details: [
      "Police seized 20kg of illegal substances at city border.",
      "Suspect linked to international smuggling network.",
      "Undercover officers recorded multiple transactions.",
      "Trial scheduled for next month."
    ]
  },
  "C007": {
    crime: "Kidnapping",
    status: "Under Investigation",
    victim: "Sarah Williams (sarahwilliams@gmail.com)",
    details: [
      "Victim abducted from outside school premises.",
      "Ransom demand of ₹50,00,000 received.",
      "Police tracking suspect's phone location.",
      "Family under protection; search ongoing."
    ]
  },
  "C008": {
    crime: "Bribery",
    status: "Charges Filed",
    victim: "Government Office (govoffice@gmail.com)",
    details: [
      "Senior official caught accepting bribes for contract approvals.",
      "Hidden camera footage submitted as evidence.",
      "Multiple whistleblowers have come forward.",
      "Internal investigation initiated."
    ]
  },
  "C009": {
    crime: "Domestic Violence",
    status: "Awaiting Verdict",
    victim: "Emily Roberts (emilyroberts@gmail.com)",
    details: [
      "Repeated abuse over 3 years; reported to police.",
      "Medical reports confirm multiple injuries.",
      "Neighbors witnessed violent altercations.",
      "Court decision expected next week."
    ]
  },
  "C010": {
    crime: "Illegal Arms Deal",
    status: "Ongoing",
    victim: "N/A (naarms@gmail.com)",
    details: [
      "Large shipment of illegal firearms intercepted.",
      "Suspects include local and international dealers.",
      "Police investigating supply chain.",
      "Intelligence agencies assisting in the case."
    ]
  }
};

for (const [caseId, caseData] of Object.entries(cases)) {
  insertCase.run(
    caseId,
    caseData.crime,
    caseData.status,
    caseData.victim,
    caseData.details[0],
    caseData.details[1],
    caseData.details[2],
    caseData.details[3]
  );
}

insertCase.finalize();

// Optional: Display inserted case entries
db.all("SELECT * FROM cases", (err, rows) => {
  if (err) {
    console.error("❌ Error fetching cases:", err.message);
  } else {
    console.log("📄 Inserted Cases:");
    console.table(rows);
  }
});

// Export DB for other files
module.exports = db;

console.log("✅ Tables created and data inserted successfully.");
