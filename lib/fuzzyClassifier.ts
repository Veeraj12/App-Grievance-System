const DEPARTMENT_KEYWORDS: Record<string, string[]> = {
  "Water": ["water", "leakage", "pipeline", "drainage", "supply", "tap", "sewage"],
  "Electricity": ["electricity", "power", "voltage", "transformer", "current", "light", "outage"],
  "Road": ["road", "pothole", "traffic", "bridge", "highway", "street", "signal"],
  "Health": ["hospital", "doctor", "medical", "clinic", "ambulance", "medicine"],
  "Education": ["school", "college", "exam", "teacher", "student", "university", "studies","education"],
  "Police": ["police", "crime", "theft", "robbery", "fir", "harassment","stolen"],
  "Revenue": ["land", "property", "tax", "registration", "certificate"],
  "Sanitation": ["garbage", "waste", "cleaning", "sewer", "dustbin", "dirty"],
  "Housing": ["house", "flat", "apartment", "construction", "building"],
  "Agriculture": ["farmer", "crop", "farming", "agriculture", "irrigation"],
  "Transport": ["bus", "vehicle", "license", "rto", "permit"],
  "Environment": ["pollution", "environment", "tree", "forest", "smoke", "noise"],
  "Municipal": ["municipal", "corporation", "public service"]
};

export function predictDepartment(subject: string, description: string): string {
  const text = (subject + " " + description).toLowerCase();

  const scores: Record<string, number> = {};

  for (const [department, keywords] of Object.entries(DEPARTMENT_KEYWORDS)) {
    scores[department] = keywords.reduce((sum, word) => {
      // Use regex bounds to match whole words prevent partial substring matches
      const regex = new RegExp(`\\b${word}\\b`);
      return sum + (regex.test(text) ? 1 : 0);
    }, 0);
  }

  let predicted = "Municipal";
  let maxScore = 0;

  for (const [department, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      predicted = department;
    }
  }

  if (maxScore === 0) {
    return "Municipal";
  }

  return predicted;
}