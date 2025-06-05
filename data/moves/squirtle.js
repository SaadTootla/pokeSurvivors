import { MoveHandlers } from '../moveHandlers.js';

export const SQUIRTLE = {
  name: 'Squirtle',
  moves: [
    {
      name: 'Bubble',
      description: 'Fires a quick bubble that pushes enemies back.',
      isBasic: true,
      apply: (scene) => MoveHandlers['Bubble'](scene)
    },
    {
      name: 'Bubblebeam',
      description: 'Shoots 3 fast bubbles in a spread. Slight knockback and pierces 1 enemy.',
      apply: (scene) => MoveHandlers['Bubblebeam'](scene)
    },
    {
      name: 'Surf',
      description: 'Dashes forward with a damaging wave that knocks back enemies.',
      apply: (scene) => MoveHandlers['Surf'](scene)
    },
    {
      name: 'Withdraw',
      description: 'Creates orbiting shells that damage enemies on contact.',
      apply: (scene) => MoveHandlers['Withdraw'](scene)
    },
    {
      name: 'Water Pulse',
      description: 'Shoots a wave in a cone that stuns enemies.',
      apply: (scene) => MoveHandlers['Water Pulse'](scene)
    },
    {
      name: 'Rain Dance',
      description: 'Slows enemies nearby and boosts Squirtle’s movement or attack speed.',
      apply: (scene) => MoveHandlers['Rain Dance'](scene)
    }
  ]
};
