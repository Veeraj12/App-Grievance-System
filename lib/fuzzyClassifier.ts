export function predictDepartment(text: string) {

  const departments: { [key: string]: string[] } = {
    IT: ["wifi","internet","network","computer","server","printer"],
    ELECTRICAL: ["electricity","power","voltage","switch","light","bulb"],
    WATER: ["water","pipe","leak","tap","tank"]
  };

  const words = text.toLowerCase().split(/\W+/);

  let scores:any = {};

  for (const dept in departments) {
    scores[dept] = 0;

    departments[dept].forEach(keyword => {
      if (words.includes(keyword)) {
        scores[dept]++;
      }
    });
  }

  let bestDept = null;
  let maxScore = 0;

  for (const dept in scores) {
    if (scores[dept] > maxScore) {
      maxScore = scores[dept];
      bestDept = dept;
    }
  }

  return bestDept;
}