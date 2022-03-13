import Phaser from 'phaser'
import { SceneKeys } from '.'
import { IGameOverSceneData } from '../types/scenes'

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.GameOver)
    }

    create()
    {   
        //TODO what to display on the gameover screen
        console.log('game over')
    }
}