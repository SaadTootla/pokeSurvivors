import { MoveHandlers } from '../moveHandlers.js';

export const SQUIRTLE = {
  name: 'Squirtle',
  moves: [
    {
      name: 'Bubble',
      description: 'Fires a quick bubble that pushes enemies back.',
      apply: (scene) => MoveHandlers['Bubble'](scene)
    },
    ]
}