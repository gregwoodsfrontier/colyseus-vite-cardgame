import { Schema, ArraySchema, MapSchema, type } from '@colyseus/schema'
import ICardSetsState, { GameState } from '../../types/ICardSetsState'

export class CardSet extends Schema
{
    @type(["number"])
    setA = new ArraySchema<number>()

    @type(["number"])
    setB = new ArraySchema<number>()

    @type(["number"])
    setC = new ArraySchema<number>()
}

export class Player extends Schema 
{
    @type(["number"])
    hand = new ArraySchema<number>()

    @type({map: CardSet})
    sets = new MapSchema<CardSet>()

    @type("number")
    points = 0

    @type("number")
    id = 0
}

export class CardSetsState extends Schema implements ICardSetsState
{
	@type('number')
	gameState = GameState.WaitingForPlayers

    @type({ map: Player }) 
    players: MapSchema<Player>;

    @type(["number"])
    deck: ArraySchema<number>

	@type(['number'])
	common: ArraySchema<number>

	@type('number')
	activePlayer = 0

	@type('number')
	winningPlayer = -1

	constructor()
	{
		super()

        this.deck = new ArraySchema();
        this.createDeck()
        this.shuffleDeck()

		this.common = new ArraySchema()

        this.players = new MapSchema<Player>()
        // this.players.set("playerA", new Player())
	}

    createDeck()
    {
        for(let i = 0; i < 32; i++)
        {
            this.deck.push(i)
        }
    }

    shuffleDeck()
    {
        this.deck.sort(() => Math.random() - 0.5)
    }
}