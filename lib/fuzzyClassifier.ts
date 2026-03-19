const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  "Water": [
    "water", "waters", "watered", "watering",
    "leak", "leaks", "leakage", "leaking",
    "pipeline", "pipelines", "pipe", "pipes",
    "drain", "drains", "drainage", "draining",
    "supply", "supplies", "supplied", "supplying",
    "tap", "taps", "tap water",
    "sewage", "sewer", "sewers", "sewerage",
    "overflow", "overflowing",
    "waterlogging", "waterlogged",
    "no water", "low pressure", "water problem"
  ],

  "Electricity": [
    "electricity", "electric", "electrical",
    "power", "power cut", "power cuts", "power outage",
    "outage", "blackout", "no power",
    "voltage", "high voltage", "low voltage",
    "transformer", "transformers", "transformer burst",
    "current", "short circuit", "spark", "sparking",
    "light", "lights", "streetlight", "streetlights",
    "fuse", "fused", "meter", "electric meter"
  ],

  "Road": [
    "road", "roads", "roadway",
    "pothole", "potholes",
    "traffic", "traffic jam", "congestion",
    "bridge", "bridges", "flyover",
    "highway", "highways",
    "street", "streets",
    "signal", "signals", "traffic signal",
    "road damage", "broken road", "bad road",
    "construction road", "road work"
  ],

  "Health": [
    "hospital", "hospitals",
    "doctor", "doctors",
    "medical", "medical issue",
    "clinic", "clinics",
    "ambulance", "ambulances",
    "medicine", "medicines",
    "health", "healthcare",
    "ill", "illness", "sick", "sickness",
    "injury", "injured",
    "emergency", "health emergency"
  ],

  "Education": [
    "school", "schools",
    "college", "colleges",
    "exam", "exams", "examination", "examinations",
    "teacher", "teachers",
    "student", "students",
    "university", "universities",
    "study", "studies", "studying",
    "education", "educational",
    "class", "classes", "classroom",
    "fees", "admission"
  ],

  "Police": [
    "police", "policing",
    "crime", "crimes",
    "theft", "thefts", "stolen", "steal", "stealing",
    "robbery", "robberies",
    "fir", "complaint", "file complaint",
    "harassment", "harass", "harassing",
    "fraud", "scam", "cheating",
    "attack", "assault",
    "missing", "kidnap", "kidnapping"
  ],

  "Revenue": [
    "land", "lands",
    "property", "properties",
    "tax", "taxes", "taxation",
    "registration", "register", "registered",
    "certificate", "certificates",
    "document", "documents",
    "ownership", "ownership issue",
    "encroachment"
  ],

  "Sanitation": [
    "garbage", "garbages",
    "waste", "wastes", "waste disposal",
    "clean", "cleaning", "cleaned",
    "sewer", "sewers", "sewerage",
    "dustbin", "dustbins", "bin", "bins",
    "dirty", "dirt", "unclean",
    "litter", "littering",
    "overflowing garbage",
    "sanitation", "hygiene"
  ],

  "Housing": [
    "house", "houses",
    "flat", "flats",
    "apartment", "apartments",
    "building", "buildings",
    "construction", "construct", "constructing",
    "builder", "housing",
    "residence", "residential",
    "illegal construction",
    "repair", "repairs"
  ],

  "Agriculture": [
    "farmer", "farmers",
    "crop", "crops",
    "farming", "farm",
    "agriculture", "agricultural",
    "irrigation", "irrigate", "irrigating",
    "harvest", "harvesting",
    "fertilizer", "fertilizers",
    "pesticide", "pesticides",
    "drought", "soil"
  ],

  "Transport": [
    "bus", "buses",
    "vehicle", "vehicles",
    "license", "licence", "driving license",
    "rto", "transport office",
    "permit", "permits",
    "auto", "rickshaw", "taxi", "cab",
    "transport", "transportation",
    "traffic violation"
  ],

  "Environment": [
    "pollution", "polluted",
    "environment", "environmental",
    "tree", "trees",
    "forest", "forests",
    "smoke", "smoking",
    "noise", "noise pollution",
    "air", "air pollution",
    "water pollution",
    "climate", "climate change",
    "garbage burning"
  ],

  "Municipal": [
    "municipal", "municipality",
    "corporation", "city corporation",
    "public service", "civic issue",
    "government service",
    "local body", "ward office",
    "complaint", "civic problem"
  ]
};

// export function predictDepartment(subject: string, description: string): string {
//   const text = (subject + " " + description).toLowerCase();

//   const scores: Record<string, number> = {};

//   for (const [department, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
//     scores[department] = keywords.reduce((sum, word) => {
//       // Use regex bounds to match whole words prevent partial substring matches
//       const regex = new RegExp(`\\b${word}\\b`);
//       return sum + (regex.test(text) ? 1 : 0);
//     }, 0);
//   }

//   let predicted = "Municipal";
//   let maxScore = 0;

//   for (const [department, score] of Object.entries(scores)) {
//     if (score > maxScore) {
//       maxScore = score;
//       predicted = department;
//     }
//   }

//   if (maxScore === 0) {
//     return "Municipal";
//   }

//   return predicted;
// }

export function predictDepartment(subject: string, description: string): string {
  const text = (subject + " " + description).toLowerCase();

  const scores: Record<string, number> = {};

  // Simple fuzzy match (handles small typos)
  const isFuzzyMatch = (word: string, text: string): boolean => {
    if (text.includes(word)) return true;

    // Allow 1 character difference (basic)
    for (let i = 0; i < word.length; i++) {
      const variation = word.slice(0, i) + word.slice(i + 1);
      if (text.includes(variation)) return true;
    }
    return false;
  };

  for (const [department, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
    scores[department] = 0;

    for (const word of keywords) {
      // Higher weight for multi-word phrases
      const isPhrase = word.includes(" ");
      const weight = isPhrase ? 3 : 1;

      // Match full word globally
      const regex = new RegExp(`\\b${word}\\b`, "g");
      const matches = text.match(regex);

      if (matches) {
        scores[department] += matches.length * weight;
        continue;
      }

      // Fallback fuzzy match
      if (isFuzzyMatch(word, text)) {
        scores[department] += weight * 0.5;
      }
    }
  }

  // 🔥 Boost if multiple keywords from same dept appear
  for (const dept in scores) {
    if (scores[dept] > 2) {
      scores[dept] *= 1.5;
    }
  }

  let predicted = "Municipal";
  let maxScore = 0;

  for (const [department, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      predicted = department;
    }
  }

  // If weak confidence → fallback
  if (maxScore < 1) {
    return "Municipal";
  }

  return predicted;
}