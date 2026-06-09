import {LevelData} from './interfaces';

export const MAX_LEVEL_HINTS = 3;
export const DEFAULT_LEVEL_SOLUTION = '```python\n\n```';

export const normalizeLevelHelp = (levelData: LevelData): LevelData => {
  levelData.hints = Array.isArray(levelData.hints)
    ? levelData.hints.filter((hint): hint is string => typeof hint === 'string').slice(0, MAX_LEVEL_HINTS)
    : [];

  if (typeof levelData.solution !== 'string' || levelData.solution.trim() === '') {
    levelData.solution = DEFAULT_LEVEL_SOLUTION;
  }

  return levelData;
};
