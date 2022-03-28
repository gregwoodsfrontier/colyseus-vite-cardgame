import BootStrap from "./Bootstrap";
import GameOver from "./Gameover";
import HelloWorld from "./HelloWorld";
import GameScene from "./Game";
import TestScene from "./TestScene";

export enum SceneKeys {
    BootStrap = 'bootstrap',
    Game = 'game',
    GameOver = 'game-over',
    Hello = 'hello-world',
    Test = 'test',
    CardSelection = 'card-selection'
}

export enum ColorNumKeys {
    Red = 0xff0000
}

// export const scenesArr = [HelloWorld]
export const scenesArr = [BootStrap, GameScene, TestScene]