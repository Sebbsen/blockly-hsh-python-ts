// in dieser Datei werden alle Blöcke definiert
export interface BlockDefinition {
    kind: 'block';
    type: string;
}

export const allBlocks: BlockDefinition[] = [
    { kind: 'block', type: 'move_up' },
    { kind: 'block', type: 'move_right' },
    { kind: 'block', type: 'move_left' },
    { kind: 'block', type: 'move_down' },
    { kind: 'block', type: 'repeat_loop' },
    { kind: 'block', type: 'if_else' },
    { kind: 'block', type: 'is_obstacle_in_way' },
];