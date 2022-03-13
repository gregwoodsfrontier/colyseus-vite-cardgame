import Phaser from 'phaser'
import { SceneKeys } from '.'
import { IGameOverSceneData } from '../types/scenes'

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.GameOver)
    }

    create(data: IGameOverSceneData)
    {   
        //TODO what to display on the gameover screen
        const text = data.winner
			? 'You Won!'
			: 'You Lost!'

		const { width, height } = this.scale

		const title = this.add.text(width * 0.5, height * 0.5, text, {
			fontSize: '48px'
		})
		.setOrigin(0.5)

		this.add.text(title.x, title.y + 100, 'Press space to play again')
			.setOrigin(0.5)

		this.input.keyboard.once('keyup-SPACE', () => {
			if (data.onRestart)
			{
				data.onRestart()
			}
		})
    }
}