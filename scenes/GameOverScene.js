export class GameOverScene extends Phaser.Scene {
    constructor() {
      super('GameOverScene');
    }
  
    create() {
      this.add.text(400, 200, 'You Died', {
        fontSize: '48px',
        fill: '#ff4444'
      }).setOrigin(0.5);
  
      this.add.text(400, 300, 'Press Enter or Click to return to Main Menu', {
        fontSize: '20px',
        fill: '#ffffff'
      }).setOrigin(0.5);
  
      this.input.keyboard.once('keydown-ENTER', () => {
        this.scene.start('SelectScene');
      });
  
      this.input.once('pointerdown', () => {
        this.scene.start('SelectScene');
      });
    }
  }
  