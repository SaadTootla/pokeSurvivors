import { MoveHandlers } from '../moveHandlers.js';

export const BULBASAUR = {
  name: 'Bulbasaur',
  moves: [
    {
      name: 'Razor Leaf',
      description: 'Three spinning leaf orbitals that damage enemies on contact.',
      isBasic: true,
      apply: (scene) => MoveHandlers['Razor Leaf'](scene)
    },
    {
      name: 'Leech Seed',
      description: 'Shoots a seed that creates a healing AoE while damaging enemies.',
      apply: (scene) => MoveHandlers['Leech Seed'](scene)
    },
    {
      name: 'Seed Summon',
      description: 'Plants sprout into small grass Pokémon.',
      apply: (scene) => MoveHandlers['Seed Summon'](scene)
    },
    // {
    //   name: 'Vine Whip',
    //   description: 'Whips out in front for big damage. Short range melee burst.',
    //   apply: (scene) => MoveHandlers['Vine Whip'](scene)
    // },
    {
      name: 'Thick Roots',
      description: 'Reduces incoming damage and gives a small regen over time.',
      apply: (scene) => MoveHandlers['Thick Roots'](scene)
    }
  ]
}