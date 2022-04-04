import { Client, Room } from 'colyseus.js'
import Phaser from 'phaser'
import ICardSetsState, { GameState } from '../types/ICardSetsState'
import { Message } from '../types/messages'

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

		this.room.onMessage(Message.PlayerIndex, (message: { playerIndex: number }) => {
			console.log('room is connected')
			console.log(`player index: ${message.playerIndex}`)
			this._playerIndex = message.playerIndex
		})

		// check whether if there are 2 clients connect

		this.room.onStateChange.once(state => {
			this.events.emit('once-state-changed', state)
		})

		this.room.state.players.onAdd = (player, key) => {
			console.log(player)
			console.log("has been added at", key);

			// If you want to track changes on a child object inside a map, this is a common pattern:
			player.onChange = function (changes: any[]) {
				changes.forEach(change => {
					if(change.field === 'hand')
					{
						console.warn('this is hand')
					}
					else
					{
						console.log(change.field);
					}
			
					console.log(change.value);
					console.log(change.previousValue);
				})
			};
		
			// force "onChange" to be called immediatelly
			player.triggerAll();
		}

		this.room.state.onChange = (changes) => {
			changes.forEach(change => {
				console.log(change.field)
				console.log(change.value)
				console.log(change.previousValue)
				
			})
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

		this.room.send(Message.PlayerSelection, { index: idx })
	}

	onHandChanged(cb: () => void, context?: any)
	{
		this.events.once('hand-changed', cb, context)
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
