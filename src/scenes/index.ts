import BootStrap from "./Bootstrap";
import GameOver from "./Gameover";
import HelloWorld from "./HelloWorld";
import GameScene from "./Game";

export enum SceneKeys {
    BootStrap = 'bootstrap',
    Game = 'game',
    GameOver = 'game-over',
    Hello = 'hello-world'
}

// export const scenesArr = [HelloWorld]
export const scenesArr = [BootStrap, GameScene]