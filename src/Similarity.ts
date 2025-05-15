import levenshtein from "fast-levenshtein";

export function similarity(a: string, b: string): number {
  if (a === null || b === null) return 0.0;
  else if (a === b) return 1.0;
  else {
    const [longer, shorter] = a.length >= b.length ? [a, b] : [b, a];
    if (longer.length == 0) return 1.0;
    return (longer.length - levenshtein.get(longer, shorter)) / longer.length;
  }
}
