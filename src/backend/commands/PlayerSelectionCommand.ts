import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
// import CheckWinnerCommand from './CheckWinnerCommand'
import ICardSetsState, { GameState, PlayerNum } from '../types/ICardSetsState'
import { CardSets } from "../rooms/CardSets"

type Payload = {
	client: Client
	index: number
}

export default class PlayerSelectionCommand extends Command<CardSets, Payload>
{
	execute(data: Payload)
	{
		const { client, index } = data

		if (this.room.state.gameState !== GameState.Playing)
		{
			return
		}

		const clientIndex = this.room.clients.findIndex(c => c.id === client.id)
		
		if (clientIndex !== this.room.state.activePlayer)
		{
			return
		}
		
		// const cellValue = clientIndex === 0 ? PlayerNum.PlayerA : PlayerNum.PlayerB

		// this.room.state.board[index] = cellValue

		return 
	}
}