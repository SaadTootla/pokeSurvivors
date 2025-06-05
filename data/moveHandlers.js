export const MoveHandlers = {
    'Ember': (scene) => {
      scene.registerRecurringMove('Ember', () => {
        const target = scene.getClosestEnemy();
        if (!target) return;
        const bullet = scene.bullets.create(scene.player.x, scene.player.y, 'ember');
        bullet.setScale(0.2);
        bullet.damage = 1;
        bullet.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        scene.physics.moveToObject(bullet, target, 300);
      }, 1000);
    },
  
    'Will-O-Wisp': (scene) => {
      // Clear old orbitals if needed
      scene.orbitals?.clear(true, true);
      scene.orbitals = scene.physics.add.group();
  
      scene.orbitalData = {
        count: 3,
        damage: 1,
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
    }
  };
  