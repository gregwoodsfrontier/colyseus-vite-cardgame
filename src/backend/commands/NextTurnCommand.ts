import { Command } from '@colyseus/command'
import ICardSetsState from '../types/ICardSetsState'
import { CardSets } from '../rooms/CardSets'

export default class NextTurnCommand extends Command<CardSets>
{
	execute()
	{
		const activePlayer = this.room.state.activePlayer

		if (activePlayer === 0)
		{
			this.room.state.activePlayer = 1
		}
		else
		{
			this.room.state.activePlayer = 0
		}
	}
}