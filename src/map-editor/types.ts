import { LevelData, LevelObject, LevelPosition } from '../interfaces';

// Re-export the interfaces from interfaces.ts
export { LevelData, LevelObject, LevelPosition };

export interface MapEditorConfig {
  gridSize: number;
  canvasSize: number;
  cellSize: number;
}

export interface MapEditorState {
  selectedObjectType: ObjectType | null;
  isPlacing: boolean;
  currentLevel: LevelData;
}

export type ObjectType = 'car' | 'destination' | 'waypoint' | 'obstacle';

export interface ObjectTemplate {
  type: ObjectType;
  emoji: string;
  label: string;
  color: string;
}
