import { MoveHandlers } from '../moveHandlers.js';

export const CHARMANDER = {
  name: 'Charmander',
  moves: [
    {
      name: 'Ember',
      description: 'Fires a quick fireball that burns enemies over time.',
      isBasic: true,
      apply: (scene) => MoveHandlers['Ember'](scene)
    },
    // {
    //   name: 'Growl',
    //   description: 'Reduces enemy attack power in a radius.',
    //   apply: (scene) => {
    //     scene.addEffect('growl', {
    //       radius: 150,
    //       damageReduction: 0.5,
    //     });
    //   }
    // },
    // {
    //   name: 'Scratch',
    //   description: 'Adds a basic melee swipe.',
    //   apply: (scene) => MoveHandlers['Scratch'](scene)
    // },
    {
      name: 'Smokescreen',
      description: 'Creates a cloud that slows enemy movement and accuracy.',
      apply: (scene) => MoveHandlers['Smokescreen'](scene)
    },
    // {
    //   name: 'Dragon Breath',
    //   description: 'Shoots a short cone of dragon energy with a chance to paralyze.',
    //   apply: (scene) => {
    //     scene.addAttack('dragonBreath', {
    //       cooldown: 2500,
    //       damage: 4,
    //       cone: true,
    //       status: 'paralyze',
    //     });
    //   }
    // },
    // {
    //   name: 'Slash',
    //   description: 'Upgrade Scratch to a more powerful version.',
    //   apply: (scene) => {
    //     scene.upgradeMelee('scratch', {
    //       damage: 4,
    //     });
    //   }
    // },
    // {
    //   name: 'Flamethrower',
    //   description: 'Fires a mid-range flame that burns.',
    //   apply: (scene) => MoveHandlers['Flamethrower'](scene)
    // },
    // {
    //   name: 'Scary Face',
    //   description: 'Reduces enemy speed in a radius.',
    //   apply: (scene) => {
    //     scene.addEffect('scaryFace', {
    //       slow: 0.3,
    //       radius: 200,
    //       duration: 5000,
    //     });
    //   }
    // },
    {
      name: 'Fire Spin',
      description: 'Spins fire around you for AoE burn.',
      apply: (scene) => MoveHandlers['Fire Spin'](scene)
    },
    // {
    //   name: 'Inferno',
    //   description: 'Big AoE that heavily burns enemies.',
    //   apply: (scene) => {
    //     scene.castUltimate('inferno', {
    //       radius: 300,
    //       burnDamage: 2,
    //       duration: 4000,
    //     });
    //   }
    // },
    // {
    //   name: 'Flare Blitz',
    //   description: 'Dash forward in flames, damaging enemies in your path.',
    //   apply: (scene) => {
    //     scene.addDashAttack('flareBlitz', {
    //       damage: 6,
    //       burn: true,
    //     });
    //   }
    // },
    // {
    //   name: 'Ancient Power',
    //   description: 'Summon rocks around you and boost all stats briefly.',
    //   apply: (scene) => {
    //     scene.castBuff('ancientPower', {
    //       statBoost: 1.25,
    //       duration: 4000,
    //     });
    //   }
    // },
    // {
    //   name: 'Belly Drum',
    //   description: 'Sacrifice HP to increase damage output drastically.',
    //   apply: (scene) => {
    //     scene.modifyStats('bellyDrum', {
    //       hpCost: 2,
    //       damageMultiplier: 2.0,
    //       duration: 10000,
    //     });
    //   }
    // },
    // {
    //   name: 'Bite',
    //   description: 'Quick close-range bite with a flinch chance.',
    //   apply: (scene) => {
    //     scene.enableMelee('bite', {
    //       damage: 2,
    //       flinchChance: 0.3,
    //     });
    //   }
    // },
    // {
    //   name: 'Counter',
    //   description: 'Reflects damage when hit.',
    //   apply: (scene) => {
    //     scene.addPassive('counter', {
    //       reflectPercentage: 0.5,
    //     });
    //   }
    // },
    // {
    //   name: 'Dragon Rush',
    //   description: 'Charge at enemies with dragon energy.',
    //   apply: (scene) => {
    //     scene.addDashAttack('dragonRush', {
    //       damage: 5,
    //       knockback: true,
    //     });
    //   }
    // },
    // {
    //   name: 'Dragon Tail',
    //   description: 'Sweep behind you to knock enemies back.',
    //   apply: (scene) => {
    //     scene.addRearSwipe('dragonTail', {
    //       damage: 3,
    //       knockback: true,
    //     });
    //   }
    // },
    // {
    //   name: 'Iron Tail',
    //   description: 'A powerful tail swipe with heavy knockback.',
    //   apply: (scene) => {
    //     scene.enableMelee('ironTail', {
    //       damage: 5,
    //       knockback: true,
    //     });
    //   }
    // },
    // {
    //   name: 'Metal Claw',
    //   description: 'Quick melee swipe that increases defense on hit.',
    //   apply: (scene) => {
    //     scene.enableMelee('metalClaw', {
    //       damage: 2.5,
    //       buff: { defense: 1.2, duration: 4000 }
    //     });
    //   }
    // },
    {
      name: 'Will-O-Wisp',
      description: 'Flames orbit around player and damage enemies.',
      apply: (scene) => MoveHandlers['Will-O-Wisp'](scene)
    }
  ]
};
