import { Command } from '@colyseus/command'
import { Client } from 'colyseus'
import { CardSets } from "../rooms/CardSets"

type Payload = {
	client: Client
	index: number
}

export default class DistributeHandCommand extends Command<CardSets>
{
	execute()
	{
        // TODO: hand each player a card from the deck
        this.room.clients.forEach(c => {
            const cardToDraw = this.room.state.deck.shift()
            const currPlayer = this.room.state.players.get(c.sessionId)
            
            currPlayer.hand.push(cardToDraw)
        })

		return
	}
}