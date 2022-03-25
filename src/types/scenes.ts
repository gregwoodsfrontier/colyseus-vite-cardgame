import type Server from '../services/Server'

export interface IGameOverSceneData
{
	winner: boolean
	onRestart?: () => void
}

export interface IGameSceneData
{
	server: Server
	onGameOver: (data: IGameOverSceneData) => void
}
