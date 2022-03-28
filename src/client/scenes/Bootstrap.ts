import Phaser from 'phaser'
import { SceneKeys } from '.'
import Server from '../services/Server'

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
		this.server = new Server()
	}

    preload()
    {
        // TODO load assets in bootstrap
		this.load.atlas('all-cards', 'all_cards.png', 'all_cards.json')
		this.load.atlas('cards', 'cards.png', 'cards.json')
		this.load.image('black-hole', 'black-hole.png')
		this.load.svg('gotchidev', 'GotchiDev.svg')
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
		this.scene.launch(SceneKeys.Game, {
			server: this.server,
			onGameOver: this.handleGameOver
		})
	}
}