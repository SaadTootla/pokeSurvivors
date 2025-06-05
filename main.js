import rexVirtualJoystickPlugin from 'https://cdn.jsdelivr.net/npm/phaser3-rex-plugins/plugins/virtualjoystick-plugin.min.js';

import { GameScene } from './scenes/GameScene.js';
import { SelectScene } from './scenes/SelectScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';


const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222',
  scene: [SelectScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,       // 👈 Makes it fit the screen
    autoCenter: Phaser.Scale.CENTER_BOTH // 👈 Centers on screen
  },
  physics: {
    default: 'arcade',
    arcade: { debug: true }
  },
  plugins: {
    scene: [{
      key: 'rexVirtualJoystick',
      plugin: rexVirtualJoystickPlugin,
      mapping: 'rexVirtualJoystick'
    }]
  }
};

new Phaser.Game(config);
