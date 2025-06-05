import { POKEMON_DATA } from '../data/moves/pokemonMoves.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }
  
    init(data) {
      this.selectedPokemon = data.selectedPokemon;
    }
  
    preload() {
    const poses = ['idle', 'step1', 'step2'];
    const starters = ['charmander', 'pikachu', 'bulbasaur', 'squirtle'];

    for (const pokemon of starters) {
        for (const pose of poses) {
            this.load.image(`${pokemon}_${pose}`, `assets/sprites/${pokemon}_${pose}.png`);
        }
    }

    //   this.load.image('bullet', 'assets/bullet.png');
    //   this.load.image('charmander', 'assets/sprites/charmander.png');
    //   this.load.image('pikachu', 'assets/sprites/pikachu.png');
    //   this.load.image('bulbasaur', 'assets/sprites/bulbasaur.png');
    //   this.load.image('squirtle', 'assets/sprites/squirtle.png');
  
    //   this.load.image('rattata', 'assets/sprites/rattata.png');
    //   this.load.image('weedle', 'assets/sprites/weedle.png');

      const enemyTypes = ['ekans', 'weedle', 'rattata'];
      this.enemyTypes = ['ekans', 'weedle', 'rattata'];


      enemyTypes.forEach(type => {
        this.load.image(`${type}_idle`, `assets/sprites/${type}_idle.png`);
        this.load.image(`${type}_step1`, `assets/sprites/${type}_step1.png`);
        this.load.image(`${type}_step2`, `assets/sprites/${type}_step2.png`);
      });
      

      //charmander move sprites
      this.load.image('ember', 'assets/projectiles/ember.png');
      this.load.image('smokescreen1', 'assets/projectiles/smokescreen1.png');
      this.load.image('smokescreen', 'assets/projectiles/smokescreen.png');
      this.load.image('fireSpin', 'assets/projectiles/fireSpin.png');
      this.load.image('willOWisp', 'assets/projectiles/willo.png');

      //squirtle moves
      this.load.image('bubble', 'assets/projectiles/bubble.png');
      this.load.image('shell', 'assets/projectiles/shell.png');


      //maps
      this.load.image('background', 'assets/backgrounds/westernCave.png');

      this.load.image('xpOrb', 'assets/ui/xpOrb.png'); // use any small icon or placeholder

      //music
      this.load.audio('song1', 'assets/audio/planetWisp.m4a');
      this.load.audio('song2', 'assets/audio/pmd1.m4a');
    }

    levelUp() {
        this.playerLevel++;
        this.playerXP = 0;
        this.xpToNextLevel += 5; // increase difficulty
        this.levelText.setText(`Level: ${this.playerLevel}`);
        
        this.showUpgradeMenu();
      }
    
      showUpgradeMenu() {
        this.upgradeMenuVisible = true;
        this.physics.pause();
        this.input.enabled = true;

         if (this.enemySpawnTimer) {
    this.enemySpawnTimer.paused = true;
  }
  for (const name in this.moveTimers) {
  if (this.moveTimers[name]) {
    this.moveTimers[name].paused = true;
  }
}
      
        const moves = POKEMON_DATA[this.selectedPokemon].moves; // ✅ Dynamic move list
        const options = Phaser.Utils.Array.Shuffle(moves).slice(0, 3); // ✅ Random 3
      
         const cam = this.cameras.main;
  const centerX = cam.scrollX + cam.width / 2;
  const centerY = cam.scrollY + cam.height / 2;
  const boxSpacing = 140;
      
        options.forEach((option, index) => {
    const y = centerY + (index - 1) * boxSpacing;

    const box = this.add.rectangle(centerX, y, 500, 100, 0x222222).setStrokeStyle(2, 0xffffff);
    const name = this.add.text(centerX, y - 20, option.name, { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    const desc = this.add.text(centerX, y + 10, option.description, { fontSize: '14px', fill: '#aaa' }).setOrigin(0.5);

          box.setInteractive();
          box.on('pointerdown', () => {
            option.apply(this); // Apply selected move
            this.clearUpgradeMenu();
          });
      
          this.upgradeMenuGroup.addMultiple([box, name, desc]);
        });
      }
      

    applyUpgrade(move) {
        console.log(`You picked: ${move.name}`);
        // TODO: Add logic based on move.name (e.g. add flamethrower)
      }
      
      clearUpgradeMenu() {
        this.upgradeMenuGroup.clear(true, true); // destroys everything in the group
        this.physics.resume();
        this.upgradeMenuVisible = false;
        if (this.enemySpawnTimer) {
  this.enemySpawnTimer.paused = false;
}

for (const name in this.moveTimers) {
  if (this.moveTimers[name]) {
    this.moveTimers[name].paused = false;
  }
}
      }


      
    create() {
      this.background = this.add.tileSprite(0, 0, 2000, 2000, 'background').setOrigin(0);
      this.background.setDepth(-6);
      this.background.setScrollFactor(1); // or try 0.5 for parallax effect

        this.playerFrames = ['idle', 'step1', 'step2'].map(
            pose => `${this.selectedPokemon.toLowerCase()}_${pose}`
        );

        this.player = this.physics.add.sprite(400, 300, this.playerFrames[0]);
        this.currentFrameIndex = 0;
        this.frameTime = 0;
        this.frameInterval = 200;
        
        const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS;
if (isMobile) {
    this.joystick = this.rexVirtualJoystick.add(this, {
        x: 100,
        y: 500,
        radius: 60,
        base: this.add.circle(0, 0, 60, 0x888888),
        thumb: this.add.circle(0, 0, 30, 0xcccccc),
        dir: '8dir',
        fixed: true
      });
      
      this.joyStickCursors = this.joystick.createCursorKeys();
}
          

    //   this.player = this.physics.add.sprite(400, 300, this.selectedPokemon.toLowerCase());
      this.player.setScale(0.2);
      this.player.setCollideWorldBounds(true);
      this.playerHP = 100000;

      this.enemies = this.physics.add.group();
      this.bullets = this.physics.add.group();

      this.playerXP = 0;
      this.playerLevel = 1;
      this.xpToNextLevel = 10;
  
      this.setupAutoAttack(this.selectedPokemon);

      this.activeMoves = [];
      this.moveTimers = {};

      this.upgradeMenuGroup = this.add.group();
      this.upgradeMenuVisible = false;
      this.upgradeMenuGroup = this.add.group();

      

      this.orbitals = this.physics.add.group();
      
      
  
      this.orbitalData = {
      count: 3,
      damage: 1,
      size: 0.3,
      speed: 0.02,
      angleOffset: 0,
      radius: 50,
      spriteKey: 'willOWisp' // default sprite
      };
      if (this.orbitals && this.orbitals.clear) {
        try {
          this.orbitals.clear(true, true);
        } catch (e) {
          console.warn('Failed to clear orbitals:', e);
        }
      }
  
      this.cursors = this.input.keyboard.createCursorKeys();

      this.levelText = this.add.text(10, 10, 'Level: 1', {
        fontSize: '16px',
        fill: '#ffffff'
      });      
  
      this.enemySpawnTimer = this.time.addEvent({
        delay: 2000,
        loop: true,
        
        callback: () => {
          if (this.upgradeMenuVisible || !this.player.active) return;
          const spawnPos = this.getRandomSpawnPosition();
          const type = Phaser.Utils.Array.GetRandom(this.enemyTypes);
          const enemy = this.enemies.create(spawnPos.x, spawnPos.y, `${type}_idle`);
          enemy.setScale(0.2);
          enemy.enemyType = type;
        enemy.animationFrame = 0;
        enemy.animationTimer = 0;
          enemy.hp = 3;
          enemy.enemyType = type;
          enemy.speed = 100;
        }
      });

  
      this.physics.add.overlap(this.bullets, this.enemies, (bullet, enemy) => {
        if (!bullet.active || !enemy.active) return;
        bullet.destroy();
        enemy.hp -= 1;
        // Apply pushback if it's a Bubble bullet
  if (bullet.isBubble) {
    const pushBackSpeed = 300;
    const angle = Phaser.Math.Angle.Between(bullet.x, bullet.y, enemy.x, enemy.y);
    enemy.setVelocity(
      Math.cos(angle) * pushBackSpeed,
      Math.sin(angle) * pushBackSpeed
    );
     enemy.setData('pushedBack', true);

    // Optional: stop movement after a short delay
    this.time.delayedCall(200, () => {
      if (enemy.active) {
        enemy.setVelocity(0, 0);
        enemy.setData('pushedBack', false);
      }
    });
  }
  
        if (enemy.hp <= 0) {
            enemy.destroy();
          
            // Spawn XP orb
            const xp = this.physics.add.sprite(enemy.x, enemy.y, 'xpOrb');
            xp.setScale(0.2);
            xp.xpValue = 5;
            this.physics.add.overlap(this.player, xp, (player, orb) => {
              this.playerXP += orb.xpValue;
              orb.destroy();
          
              // Level up check
              if (this.playerXP >= this.xpToNextLevel) {
                this.levelUp();
              }
            });
          }
      });
  
      this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
        if (!player.active || !enemy.active) return;
        this.playerHP--;
        if (this.playerHP <= 0) {
            player.destroy();
            this.scene.start('GameOverScene');
        }
      });
      this.physics.world.setBounds(0, 0, 2000, 2000); // or whatever size you want
this.cameras.main.setBounds(0, 0, 2000, 2000);
this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
this.levelText.setScrollFactor(0);

let music1, music2;
let currentSong = 1;

function playMusic(scene) {
  const pickFirst = Phaser.Math.Between(0, 1);
  currentSong = pickFirst ? 1 : 2;

  playNext(scene);
}

function playNext(scene) {
  if (currentSong === 1) {
    music1 = scene.sound.add('song1', {volume: 0.4});
    music1.play();
    music1.once('complete', () => {
      currentSong = 2;
      playNext(scene);
    });
  } else {
    music2 = scene.sound.add('song2', {volume: 0.4});
    music2.play();
    music2.once('complete', () => {
      currentSong = 1;
      playNext(scene);
    });
  }
}

playMusic(this);
    }


  
    update() {
      const speed = 200;
  
      if (this.player && this.player.active) {
        this.player.setVelocity(0);
        if (this.cursors.left.isDown) this.player.setVelocityX(-speed);
        else if (this.cursors.right.isDown) this.player.setVelocityX(speed);
        if (this.cursors.up.isDown) this.player.setVelocityY(-speed);
        else if (this.cursors.down.isDown) this.player.setVelocityY(speed);
      }

      let moveLeft = this.cursors.left.isDown || (this.joyStickCursors && this.joyStickCursors.left.isDown);
let moveRight = this.cursors.right.isDown || (this.joyStickCursors && this.joyStickCursors.right.isDown);

if (moveLeft) {
  this.player.setVelocityX(-speed);
  this.player.setFlipX(false); // face left
} else if (moveRight) {
  this.player.setVelocityX(speed);
  this.player.setFlipX(true); // face right
}

      
const isMoving = this.player.body.velocity.x !== 0 || this.player.body.velocity.y !== 0;

if (isMoving) {
  this.frameTime += this.game.loop.delta;

  if (this.frameTime > this.frameInterval) {
    this.frameTime = 0;
    this.currentFrameIndex = (this.currentFrameIndex + 1) % this.playerFrames.length;
    this.player.setTexture(this.playerFrames[this.currentFrameIndex]);
  }
} else {
  this.player.setTexture(this.playerFrames[0]); // idle
  this.currentFrameIndex = 0;
  this.frameTime = 0;
}

this.enemies.children.each(enemy => {
    if (!enemy.active || !enemy.enemyType) return;
  
    enemy.animationTimer += this.game.loop.delta;
  
    if (enemy.animationTimer > 250) {
      enemy.animationFrame = (enemy.animationFrame + 1) % 3;
      const frameKey = `${enemy.enemyType}_${['idle', 'step1', 'step2'][enemy.animationFrame]}`;
      enemy.setTexture(frameKey);
      enemy.animationTimer = 0;
    }
  
    // this.physics.moveToObject(enemy, this.player, 100);

    if (enemy.x < this.player.x) {
        enemy.setFlipX(true); // face right
      } else {
        enemy.setFlipX(false); // face left
      }
      
  });
  

      this.enemies.children.each(enemy => {
        if (enemy.active && this.player.active) {
          if (!enemy.getData('pushedBack')) {
  this.physics.moveToObject(enemy, this.player, enemy.speed);
}
        }
      });
  
      this.bullets.children.each(bullet => {
        if (bullet && bullet.active && !this.physics.world.bounds.contains(bullet.x, bullet.y)) {
          bullet.destroy();
        }
      }, this);

      if (this.orbitals && this.orbitals.getLength() > 0) {
        
        this.orbitalData.angleOffset += this.orbitalData.speed;
        this.orbitals.children.each((orb, index) => {
            
          const angle = this.orbitalData.angleOffset + (Math.PI * 2 * index / this.orbitalData.count);
          orb.x = this.player.x + Math.cos(angle) * this.orbitalData.radius;
          orb.y = this.player.y + Math.sin(angle) * this.orbitalData.radius;
        //   orb.rotation += 0.1;
        });
        
      }      
      const cursors = this.sys.game.device.os.desktop ? this.cursors : this.joyStickCursors;

if (cursors.left.isDown) this.player.setVelocityX(-speed);
else if (cursors.right.isDown) this.player.setVelocityX(speed);
else this.player.setVelocityX(0);

if (cursors.up.isDown) this.player.setVelocityY(-speed);
else if (cursors.down.isDown) this.player.setVelocityY(speed);
else this.player.setVelocityY(0);

      
    }

    registerRecurringMove(name, action, cooldown) {
        if (this.moveTimers[name]) this.time.removeEvent(this.moveTimers[name]);
      
        this.activeMoves.push(name);
        this.moveTimers[name] = this.time.addEvent({
          delay: cooldown,
          loop: true,
          callback: action
        });
      }
      

    addEffect(effectName, config) {
        console.log(`Stub: addEffect called with ${effectName}`, config);
      }
      
      addAura(auraName, config) {
        console.log(`Stub: addAura called with ${auraName}`, config);
      }
      
      enableMelee(name, config) {
        this.time.addEvent({
          delay: config.cooldown,
          loop: true,
          callback: () => {
            if (!this.player.active) return;
      
            const hitZone = new Phaser.Geom.Circle(this.player.x, this.player.y, config.reach);
            this.enemies.children.iterate(enemy => {
              if (enemy.active && Phaser.Geom.Intersects.CircleToRectangle(hitZone, enemy.getBounds())) {
                enemy.hp -= config.damage;
              }
            });
          }
        });
      }
      
      
      upgradeMelee(name, newConfig) {
        console.log(`Stub: upgradeMelee ${name}`, newConfig);
      }
      
      addAttack(name, config) {
        console.log(`Stub: addAttack ${name}`, config);
      }
      
      castUltimate(name, config) {
        console.log(`Stub: castUltimate ${name}`, config);
      }
      
      addDashAttack(name, config) {
        console.log(`Stub: addDashAttack ${name}`, config);
      }
      
      castBuff(name, config) {
        console.log(`Stub: castBuff ${name}`, config);
      }
      
      modifyStats(name, config) {
        console.log(`Stub: modifyStats ${name}`, config);
      }
      
      addPassive(name, config) {
        console.log(`Stub: addPassive ${name}`, config);
      }
      
      addRearSwipe(name, config) {
        console.log(`Stub: addRearSwipe ${name}`, config);
      }
      
    getRandomEdgePosition() {
      const margin = 50;
      const side = Phaser.Math.Between(0, 3);
      switch (side) {
        case 0: return { x: Phaser.Math.Between(0, 800), y: -margin };
        case 1: return { x: Phaser.Math.Between(0, 800), y: 600 + margin };
        case 2: return { x: -margin, y: Phaser.Math.Between(0, 600) };
        case 3: return { x: 800 + margin, y: Phaser.Math.Between(0, 600) };
      }
    }

    getRandomSpawnPosition() {
  let angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
  let distance = Phaser.Math.Between(300, 600); // 500+ px from player
  let x = this.player.x + Math.cos(angle) * distance;
  let y = this.player.y + Math.sin(angle) * distance;
  return { x, y };
}
  
    getClosestEnemy() {
      let closest = null;
      let shortest = Infinity;
  
      this.enemies.children.each(enemy => {
        if (!enemy.active) return;
        const dist = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          enemy.x, enemy.y
        );
        if (dist < shortest) {
          shortest = dist;
          closest = enemy;
        }
      });
  
      return closest;
    }
  
    setupAutoAttack(pokemon) {
        const delay = 1000;
        switch (pokemon.toLowerCase()) {
          case 'charmander':
            this.time.addEvent({
              delay,
              loop: true,
              callback: () => {
                if (!this.player.active) return;
                const target = this.getClosestEnemy();
                if (!target) return;
      
                const bullet = this.bullets.create(this.player.x, this.player.y, 'ember');
                bullet.setScale(0.2); // 👈 adjust size here
                this.physics.moveToObject(bullet, target, 300);
              }
            });
            break;
            case 'squirtle':
  this.time.addEvent({
    delay,
    loop: true,
    callback: () => {
      if (!this.player.active) return;
      const target = this.getClosestEnemy();
      if (!target) return;

      const bullet = this.bullets.create(this.player.x, this.player.y, 'bubble');
      bullet.setScale(0.2);
      bullet.isBubble = true;
      this.physics.moveToObject(bullet, target, 200); // Slower speed

      bullet.setData('pushBack', true);
    }
  });
  break;

        }
      }

      
  }

  