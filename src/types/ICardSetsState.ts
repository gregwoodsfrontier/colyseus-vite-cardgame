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

export interface ICardSet extends Schema
{
    setA: ArraySchema

    setB: ArraySchema

    setC: ArraySchema
}

export interface IPlayer extends Schema 
{
    hand: ArraySchema

    sets: MapSchema

    points: number

    id: number
}

export interface ICardSetsState extends Schema
{
	gameState: GameState

	players: MapSchema

	deck: ArraySchema
	
	common: ArraySchema

	activePlayer: number

	winningPlayer: number
}

export default ICardSetsState
