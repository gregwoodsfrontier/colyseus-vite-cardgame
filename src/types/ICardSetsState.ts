import { Schema, ArraySchema, MapSchema } from '@colyseus/schema'

export enum PlayerNum
{
	PlayerA,
	PlayerB
}

export enum GameState
{
	WaitingForPlayers,
	Playing,
	Finished
}

export const MAX_HAND_PER_PLAYER = 4

export const MAX_TOT_NUM_CARDS_SETS = 9

export interface ICard extends Schema
{
	pattern: number

	points: number

	owner: string

	isDiscarded: boolean
}

export interface IPlayer extends Schema
{
	hand: ArraySchema

	sets: ArraySchema

	points: number
}

export interface ICardSetsState extends Schema
{
	gameState: GameState

	players: MapSchema

	deck: ArraySchema
	
	pot: ArraySchema

	activePlayer: number

	winningPlayer: number
}

export default ICardSetsState
