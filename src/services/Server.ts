import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser'
import { getSpriteName } from '../helpers'
import ICardSetsState, { IPlayer, GameState, ICard } from '../types/ICardSetsState'
import { Message } from '../types/messages'
import { PhaserEvents } from '../types/phaserEvents'

export default class Server
{
	private client: Client
	private events: Phaser.Events.EventEmitter

	private room?: Room<ICardSetsState>
	private _playerIndex = -1

	get playerIndex()
	{
		return this._playerIndex
	}

	get gameState()
	{
		if (!this.room)
		{
			return GameState.WaitingForPlayers
		}

		return this.room?.state.gameState
	}

	constructor()
	{
		this.client = new Client('ws://localhost:2567')
		this.events = new Phaser.Events.EventEmitter()
	}

	async join()
	{
		this.room = await this.client.joinOrCreate<ICardSetsState>('card-sets-game')

		// listen for player index in server
		this.room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
			console.log('room is connected')
			console.log(`player index: ${message.playerIndex}`)
			this._playerIndex = message.playerIndex
			this.events.emit(PhaserEvents.SET_CHAR, message.playerIndex)
		})

		this.room.onMessage(Message.BoardcastTurnStart, (message: { playerIndex: number }) => {
			if(this._playerIndex === message.playerIndex)
			{
				console.log('this is your turn')
			}
			else
			{
				console.log('this is opponents turn')
			}
		})

		// listen from server: Time to proceed to next step


		// check whether if there are 2 clients connect

		this.room.onStateChange.once(state => {
			this.events.emit('once-state-changed', state)
		})

		// listen for all the player stats
		this.room.state.players.onAdd = (player: IPlayer, key: string) => {
			console.log("player key", key)
			const {events} = this
			player.onChange = function (changes) {
				changes.forEach(change => {
					const {field, value, previousValue} = change

					switch (field) {
						case 'hand': {
							const sprName = getSpriteName(value[0].pattern, value[0].points)
							console.log('spriteName', sprName)
							events.emit(PhaserEvents.HAND_CHANGED, sprName)
							break
						}
						case 'sets': {
							console.log("player sets")
							break
						}
						case 'points': {
							console.log("player points")
							break
						}
					}
				})
			}
		}
		
	}

	leave()
	{
		this.room?.leave()
		this.events.removeAllListeners()
	}

	makeSelection(idx: number)
	{
		if (!this.room)
		{
			return
		}

		if (this.room.state.gameState !== GameState.Playing)
		{
			return
		}

		if (this.playerIndex !== this.room.state.activePlayer)
		{
			console.warn('not this player\'s turn')
			return
		}

		this.room.send(Message.PlayerSelect, { index: idx })
	}

	onPlayerIndexChanged(cb: (idx: number) => void, context?: any)
	{
		this.events.on(PhaserEvents.SET_CHAR, cb, context)
	}

	onHandChanged(cb: (spriteName: string) => void, context?: any)
	{
		this.events.on(PhaserEvents.HAND_CHANGED, cb, context)
	}

	onceStateChanged(cb: (state: ICardSetsState) => void, context?: any)
	{
		this.events.once('once-state-changed', cb, context)
	}

	onPlayerTurnChanged(cb: (playerIndex: number) => void, context?: any)
	{
		this.events.on('player-turn-changed', cb, context)
	}

	onPlayerWon(cb: (playerIndex: number) => void, context?: any)
	{
		this.events.on('player-win', cb, context)
	}

	onGameStateChanged(cb: (state: GameState) => void, context?: any)
	{
		this.events.on('game-state-changed', cb, context)
	}
}
