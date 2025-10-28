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

export interface LevelData {
  blocks: string[];
  moodleSuccessCode: string;
  objects: {
    car: LevelObject;
    destination: LevelObject;
    waypoints: LevelObject[];
    obstacles: LevelObject[];
  };
}

export interface LevelObject {
  emoji: string;
  pos: LevelPosition;
}

export interface LevelPosition {
  x: number;
  y: number;
}
