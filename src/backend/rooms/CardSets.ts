import { Room, Client } from "colyseus";
import { CardSetsState } from "./schema/CardSetsState";
import { Dispatcher } from '@colyseus/command'
import { Message } from "../types/messages";
import { GameState } from "../types/ICardSetsState";
import PlayerSelectionCommand from "../commands/PlayerSelectionCommand";
import DistributeHandCommand from "../commands/DistributeHandCommand";
import InitPlayersCommand from "../commands/InitPlayersCommand";

export class CardSets extends Room<CardSetsState> {

  private dispatcher = new Dispatcher(this)

  onCreate (options: any) {

    this.maxClients = 2

    this.setState(new CardSetsState())

    // player makes selection to form a set
    
    // or player chooses which card to dump to common place
    this.onMessage(Message.PlayerSelection, (client, message: { index: number }) => {
      this.dispatcher.dispatch(new PlayerSelectionCommand(), {
        client,
        index: message.index
      })
    });

  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // TODO: setup where a game can be played only if there are 2 players
    // console.log(this.clients.length)
		const idx = this.clients.findIndex(c => c.sessionId === client.sessionId)
		// console.log(idx)
		client.send(Message.PlayerIndex, { playerIndex: idx })

		if (this.clients.length >= 2)
		{
			this.state.gameState = GameState.Playing

      // locks the rooom to prevent other players for entering
			this.lock()

      this.dispatcher.dispatch(new InitPlayersCommand())
		}
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
