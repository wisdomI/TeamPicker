// Fisher-Yates shuffle algorithm for fair random distribution
export function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateTeams(names: string[], teamSize: number): string[][] {
  if (names.length === 0 || teamSize <= 0) return [];
  
  const shuffled = fisherYatesShuffle(names);
  const teams: string[][] = [];
  
  for (let i = 0; i < shuffled.length; i += teamSize) {
    teams.push(shuffled.slice(i, i + teamSize));
  }
  
  return teams;
}

