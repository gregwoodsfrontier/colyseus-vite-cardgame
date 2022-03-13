import Phaser from 'phaser'
import { SceneKeys } from '.'

export default class Bootstrap extends Phaser.Scene
{
	private server!: Server

	constructor()
	{
		super(SceneKeys.BootStrap)
	}

	init()
	{
		// TODO: make a service server for client
	}

    preload()
    {
        // TODO load assets in bootstrap
    }

	create()
	{
		this.createNewGame()
	}

	private handleGameOver = () => {
		this.server.leave()
		this.scene.stop(SceneKeys.Game)

		this.scene.launch(SceneKeys.GameOver)
	}

	private handleRestart = () => {
		this.scene.stop(SceneKeys.GameOver)
		this.createNewGame()
	}

	private createNewGame()
	{
		this.scene.launch(SceneKeys.Game)
	}
}