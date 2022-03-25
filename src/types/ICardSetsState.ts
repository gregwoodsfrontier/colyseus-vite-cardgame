import { Schema, ArraySchema } from '@colyseus/schema'

export enum GameState
{
	WaitingForPlayers,
	Playing,
	Finished
}

export interface ICardSetsState extends Schema
{
	gameState: GameState
	
	board: ArraySchema

	activePlayer: number

	winningPlayer: number
}

export default ICardSetsState
