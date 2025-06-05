export const MoveHandlers = {
    'Ember': (scene) => {
        const target = scene.getClosestEnemy();
        if (!target) return;
        const bullet = scene.bullets.create(scene.player.x, scene.player.y, 'ember');
        bullet.setScale(0.2);
        bullet.damage = 1;
        bullet.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        scene.physics.moveToObject(bullet, target, 300);
      },

    'Will-O-Wisp': (scene) => {
      // Clear old orbitals if needed
      scene.orbitals?.clear(true, true);
      scene.orbitals = scene.physics.add.group();
  
      scene.orbitalData = {
        count: 3,
        damage: 100,
        size: 0.3,
        speed: 0.02,
        angleOffset: 0,
        radius: 50,
        spriteKey: 'willOWisp'
      };
  
      for (let i = 0; i < scene.orbitalData.count; i++) {
        const orb = scene.physics.add.sprite(scene.player.x, scene.player.y, scene.orbitalData.spriteKey);
        orb.setScale(scene.orbitalData.size);
        orb.damage = scene.orbitalData.damage;
        orb.setOrigin(0.5, 0.5);
        scene.orbitals.add(orb);
        scene.physics.add.overlap(orb, scene.enemies, (orb, enemy) => {
          if (!enemy.active) return;
          enemy.hp -= orb.damage;
          orb.destroy();
        });
      }
  
      // Recast every 5 seconds
      scene.registerRecurringMove('Will-O-Wisp', () => {
        MoveHandlers['Will-O-Wisp'](scene);
      }, 5000);
    },
  
    'Scratch': (scene) => {
        scene.enableMelee('scratch', {
            damage: 2,
            reach: 100,
            cooldown: 1000
          });
    },

'Smokescreen': (scene) => {
  const target = scene.getClosestEnemy();
  if (!target) return;

  const projectile = scene.physics.add.sprite(scene.player.x, scene.player.y, 'smokescreen1'); // reuse ember sprite for now
  projectile.setScale(0.2);
  scene.physics.moveToObject(projectile, target, 400);

  scene.physics.add.overlap(projectile, scene.enemies, (proj, enemy) => {
    if (!enemy.active) return;
    enemy.hp -= 1;
    proj.destroy();

    // // Create expanding smokescreen
    // const smoke = scene.add.circle(enemy.x, enemy.y, 10, 0x666666, 0.4);
    // scene.physics.add.existing(smoke);
    // smoke.damage = 0.5;
    // const body = smoke.body;
    // body.setCircle(smoke.radius);
    // body.setImmovable(true);

     // Create smoke cloud at impact point
  const cloud = scene.physics.add.sprite(enemy.x, enemy.y, 'smokescreen');
  cloud.setScale(0.6);
  cloud.setDepth(-1); // optional: place it behind enemies
  cloud.setAlpha(0.5);

  // Add custom data
  cloud.duration = 3000; // ms
  cloud.timer = scene.time.now;

  // Add slow/damage area logic
  scene.physics.add.overlap(cloud, scene.enemies, (cloud, aoeEnemy) => {
    if (!aoeEnemy.active) return;
    aoeEnemy.setData('inSmoke', true);

    // scene.tweens.add({
    //   targets: smoke,
    //   radius: 80,
    //   duration: 500,
    //   onUpdate: () => {
    //     body.setCircle(smoke.radius);
    //   }
    // });

    // Apply damage-over-time + slow to any enemy inside the smoke
    if (!aoeEnemy.getData('smokeTick')) {
        aoeEnemy.hp -= 0.5;
        aoeEnemy.setData('smokeTick', true);
        scene.time.delayedCall(1000, () => {
          aoeEnemy.setData('smokeTick', false);
        });
      }
    });
    // const overlap = scene.physics.add.overlap(smoke, scene.enemies, (smoke, e) => {
    //   if (!e.getData('inSmoke')) {
    //     e.setData('inSmoke', true);
    //     const slowTimer = scene.time.delayedCall(3000, () => {
    //       e.setData('inSmoke', false);
    //     });

    //     const damageTick = scene.time.addEvent({
    //       delay: 500,
    //       repeat: 5,
    //       callback: () => {
    //         if (e.active) e.hp -= smoke.damage;
    //       }
    //     });

    //     // Apply slow
    //     if (!e.getData('slowed')) {
    //       e.setData('slowed', true);
    //       e.setData('originalSpeed', e.speed || 100);
    //       e.speed = (e.speed || 100) * 0.1;

    //       scene.time.delayedCall(3000, () => {
    //         e.speed = e.getData('originalSpeed');
    //         e.setData('slowed', false);
    //       });
    //     }
    //   }
    // });
    scene.physics.add.overlap(cloud, scene.enemies, (cloud, e) => {
        if (!e.active) return;
      
        // Apply slow if not already slowed
        if (!e.getData('slowed')) {
          e.setData('slowed', true);
          e.setData('originalSpeed', e.speed || 100);
          e.speed = (e.speed || 100) * 0.5; // Adjust slow factor here
      
          scene.time.delayedCall(3000, () => {
            if (!e.active) return;
            e.speed = e.getData('originalSpeed');
            e.setData('slowed', false);
          });
        }
      });

    // Remove smoke after 3s
    scene.time.delayedCall(cloud.duration, () => {
        cloud.destroy();
      });
  });

  scene.registerRecurringMove('Smokescreen', () => {
    MoveHandlers['Smokescreen'](scene);
  }, 3500);
},


'Fire Spin': (scene) => {
  // Remove old fire spin if it exists
  if (scene.activeFireSpin) {
    scene.activeFireSpin.destroy();
    scene.activeFireSpin = null;
  }

  const target = scene.getClosestEnemy();
  if (!target) return;

    const spin = scene.physics.add.sprite(target.x, target.y, 'fireSpin');
    // spin.setAlpha(0.5); // Optional: make it semi-transparent
    spin.setScale(0.25); // Optional: adjust size visually
    spin.setDepth(-1);
  spin.body.setAllowGravity(false);
  spin.body.setImmovable(true);

  scene.activeFireSpin = spin;

  const affectedEnemies = new Set();

  // Set movement speed to 0 and start burn timer
  const overlap = scene.physics.add.overlap(spin, scene.enemies, (aoe, enemy) => {
    if (!enemy.active || affectedEnemies.has(enemy)) return;

    affectedEnemies.add(enemy);
    enemy.originalSpeed = enemy.speed;
    enemy.speed = 0;

    // Start burn DoT
    enemy.fireSpinTimer = scene.time.addEvent({
        delay: 1000,
        repeat: 2,
        callback: () => {
          if (!enemy.active) return;
      
          enemy.hp -= 1;
      
          if (enemy.hp <= 0) {
            enemy.destroy();
      
            // XP Drop
            const xp = scene.physics.add.sprite(enemy.x, enemy.y, 'xpOrb');
            xp.setScale(0.2);
            xp.xpValue = 5;
            scene.physics.add.overlap(scene.player, xp, (player, orb) => {
              scene.playerXP += orb.xpValue;
              orb.destroy();
      
              if (scene.playerXP >= scene.xpToNextLevel) {
                scene.levelUp();
              }
            });
          }
        }
      });
  });

  

  // After 3s, cleanup
  scene.time.delayedCall(3000, () => {
    scene.physics.world.removeCollider(overlap);
    spin.destroy();
    scene.activeFireSpin = null;

    // Restore enemy speeds and cancel timers
    affectedEnemies.forEach(enemy => {
      if (enemy && enemy.active) {
        enemy.speed = enemy.originalSpeed || 100;
        if (enemy.fireSpinTimer) enemy.fireSpinTimer.remove(false);
      }
    });
  });

  scene.registerRecurringMove('Fire Spin', () => {
    MoveHandlers['Fire Spin'](scene);
  }, 3500);
},
  
    'Flamethrower': (scene) => {
      scene.addAttack('flamethrower', {
        cooldown: 3000,
        damage: 5,
        burn: true,
        range: 200
      });
    },

    //squirtle moves
  'Bubble': (scene) => {
    // Auto-attack already does this, so for upgrades just ensure it's recurring
      const target = scene.getClosestEnemy();
      if (!target) return;

      const bullet = scene.bullets.create(scene.player.x, scene.player.y, 'bubble');
      bullet.setScale(0.2);
      bullet.isBubble = true;
      scene.physics.moveToObject(bullet, target, 200);
    },

  'Bubblebeam': (scene) => {
    scene.registerRecurringMove('Bubblebeam', () => {
      if (!scene.player.active) return;

      const angleToEnemy = (enemy) =>
        Phaser.Math.Angle.Between(scene.player.x, scene.player.y, enemy.x, enemy.y);

      const target = scene.getClosestEnemy();
      if (!target) return;

      const baseAngle = angleToEnemy(target);
      [-0.2, 0, 0.2].forEach(offset => {
        const bullet = scene.bullets.create(scene.player.x, scene.player.y, 'bubble');
        bullet.setScale(0.2);
        bullet.isBubble = true;
        const angle = baseAngle + offset;
        scene.physics.velocityFromRotation(angle, 300, bullet.body.velocity);
      });
    }, 2000);
  },

  'Surf': (scene) => {
    scene.addDashAttack('Surf', {
      spriteKey: 'fireSpin', // use wave sprite if you have one
      width: 200,
      height: 60,
      damage: 4,
      speed: 600,
      knockback: true,
      cooldown: 5000
    });
  },

  'Withdraw': (scene) => {
    scene.orbitals?.clear(true, true);
    scene.orbitals = scene.physics.add.group();

    scene.orbitalData = {
      count: 2,
      damage: 2,
      size: 0.15,
      speed: 0.015,
      angleOffset: 0,
      radius: 40,
      spriteKey: 'shell' // use shell if you have one
    };

    for (let i = 0; i < scene.orbitalData.count; i++) {
      const orb = scene.physics.add.sprite(scene.player.x, scene.player.y, scene.orbitalData.spriteKey);
      orb.setScale(scene.orbitalData.size);
      orb.damage = scene.orbitalData.damage;
      scene.orbitals.add(orb);
      scene.physics.add.overlap(orb, scene.enemies, (orb, enemy) => {
        if (!enemy.active) return;
        enemy.hp -= orb.damage;
        orb.destroy();
      });
    }

    scene.registerRecurringMove('Withdraw', () => {
      MoveHandlers['Withdraw'](scene);
    }, 7000);
  },

  'Water Pulse': (scene) => {
    scene.addAttack('Water Pulse', {
      spriteKey: 'ember', // should be wave or pulse
      range: 200,
      cone: true,
      damage: 1,
      effect: (enemy) => {
        enemy.stunned = true;
        scene.time.delayedCall(1500, () => {
          if (enemy.active) enemy.stunned = false;
        });
      },
      cooldown: 5000
    });
  },

  'Rain Dance': (scene) => {
    scene.addAura('Rain Dance', {
      radius: 300,
      effect: (enemy) => {
        enemy.speed *= 0.7;
      },
      boostSelf: () => {
        scene.playerSpeed *= 1.1;
      }
    });
  },

  // bulbasaur moves
'Razor Leaf': (scene) => {
  // Prevent overlap if it's already active
  if (scene.activeMoves.includes('Razor Leaf_Active')) return;

  // Mark it as active
  scene.activeMoves.push('Razor Leaf_Active');

  scene.orbitals?.clear(true, true);
  scene.orbitals = scene.physics.add.group();

  scene.orbitalData = {
    count: 3,
    damage: 5,
    size: 0.3,
    speed: 0.02,
    angleOffset: 0,
    radius: 55,
    spriteKey: 'razorLeaf'
  };

  for (let i = 0; i < scene.orbitalData.count; i++) {
    const orb = scene.physics.add.sprite(scene.player.x, scene.player.y, scene.orbitalData.spriteKey);
    orb.setScale(scene.orbitalData.size);
    orb.damage = scene.orbitalData.damage;
    orb.setOrigin(0.5);
    orb.hitEnemies = new Set();
    scene.orbitals.add(orb);
  }

  // Remove orbitals after 5 seconds and allow re-use
  scene.time.delayedCall(5000, () => {
    scene.orbitals?.clear(true, true);
    scene.activeMoves = scene.activeMoves.filter(name => name !== 'Razor Leaf_Active');
  });

  // Recurring recast every 2 seconds
  scene.registerRecurringMove('Razor Leaf', () => {
    MoveHandlers['Razor Leaf'](scene);
  }, 2000);
},




  'Leech Seed': (scene) => {
    const target = scene.getClosestEnemy();
    if (!target) return;

    const seed = scene.physics.add.sprite(scene.player.x, scene.player.y, 'leechSeed1');
    seed.setScale(0.2);
    scene.physics.moveToObject(seed, target, 300);

    scene.physics.add.overlap(seed, scene.enemies, (s, enemy) => {
      if (!enemy.active) return;
      s.destroy();

      const leech = scene.add.sprite(enemy.x, enemy.y, 'leechSeedCloud');
      leech.setAlpha(0.5);
      leech.setScale(0.5);

      scene.physics.world.enable(leech);
      leech.body.setAllowGravity(false);
      leech.body.setImmovable(true);

      const leechTimer = scene.time.addEvent({
        delay: 500,
        repeat: 5,
        callback: () => {
          scene.enemies.children.each(e => {
            if (e.active && Phaser.Math.Distance.Between(e.x, e.y, leech.x, leech.y) < 80) {
              e.hp -= 1;
              scene.playerHP += 1;
            }
          });
        },
        callbackScope: scene
      });

      scene.time.delayedCall(3000, () => {
        leech.destroy();
        leechTimer.remove(false);
      });
    });

    scene.registerRecurringMove('Leech Seed', () => {
      MoveHandlers['Leech Seed'](scene);
    }, 5000);
  },

  'Sapling Swarm': (scene) => {
    const spawnHelper = () => {
      const target = scene.getClosestEnemy();
      if (!target) return;

      const sapling = scene.physics.add.sprite(target.x + Phaser.Math.Between(-40, 40), target.y + Phaser.Math.Between(-40, 40), 'sunkern');
      sapling.setScale(0.2);
      sapling.hp = 3;

      const attackTimer = scene.time.addEvent({
        delay: 1000,
        repeat: 2,
        callback: () => {
          scene.enemies.children.each(enemy => {
            if (!enemy.active || !sapling.active) return;
            if (Phaser.Math.Distance.Between(enemy.x, enemy.y, sapling.x, sapling.y) < 60) {
              enemy.hp -= 1;
            }
          });
        }
      });

      scene.time.delayedCall(3000, () => {
        sapling.destroy();
        attackTimer.remove(false);
      });
    };

    spawnHelper();
    scene.registerRecurringMove('Sapling Swarm', spawnHelper, 7000);
  }
}
