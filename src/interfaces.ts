export type LevelPosition = {x: number; y: number};

export interface LevelObject {
  emoji: string;
  pos: LevelPosition;
}

export interface LevelData {
  blocks: string[];
  fixedBlocks: string[];
  moodleSuccessCode: string;
  enforceWaypointOrder: boolean;
  hints?: string[];
  solution?: string;
  objects: {
    car: LevelObject;
    destination: LevelObject;
    waypoints: LevelObject[];
    obstacles: LevelObject[];
  };
}
