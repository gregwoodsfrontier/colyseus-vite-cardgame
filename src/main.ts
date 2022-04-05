import './style.css'
import 'phaser';
import { scenesArr } from './scenes';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const GameConfig: Phaser.Types.Core.GameConfig = {
  width: 1080,
  height: 600,
  type: Phaser.AUTO,
  parent: 'app',
  scene: scenesArr,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  plugins: {
    scene: [{
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
    },
    // ...
    ]
  },
  backgroundColor: '#666600',
  render: { pixelArt: false, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: 'app',
    expandParent: false,
  },
};


export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  (window as any)._game = new Game(GameConfig);
});
