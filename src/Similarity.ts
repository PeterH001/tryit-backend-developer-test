import levenshtein from "fast-levenshtein";

export function similarity(a: string, b: string): number {
    const [longer, shorter] = a.length >= b.length ? [a, b] : [b, a];
    let longerLength = longer.length;
    if (longerLength == 0) return 1.0;
    return (longerLength - levenshtein.get(longer, shorter)) / longerLength;
  }