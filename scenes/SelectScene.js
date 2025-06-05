export class SelectScene extends Phaser.Scene {
    constructor() {
      super({ key: 'SelectScene' });
    }
  
    preload() {
    //   this.load.image('charmander', 'https://i.imgur.com/T5s0D1r.png');
    //   this.load.image('pikachu', 'https://i.imgur.com/TBD.png');     // replace with real link
    //   this.load.image('bulbasaur', 'https://i.imgur.com/TBD.png');   // replace with real link
    //   this.load.image('squirtle', 'https://i.imgur.com/TBD.png');    // replace with real link
    }
  
    create() {
      const pokemonList = ['Charmander', 'Pikachu', 'Bulbasaur', 'Squirtle'];
  
      pokemonList.forEach((name, i) => {
        const y = 150 + i * 100;
        this.add.text(100, y, name, { fontSize: '32px', fill: '#fff' })
          .setInteractive()
          .on('pointerdown', () => {
            this.scene.start('game', { selectedPokemon: name });
          });
      });
    }
  }
  