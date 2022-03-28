import { Command } from '@colyseus/command'
import { CardSetsState } from '../rooms/schema/CardSetsState'

export default class NextTurnCommand extends Command<CardSetsState>
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