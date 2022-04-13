import Phaser from 'phaser'
import { SceneKeys } from '.'
import type Server from '../services/Server'
import { IGameOverSceneData, IGameSceneData } from '../types/scenes'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Dialog from 'phaser3-rex-plugins/templates/ui/dialog/Dialog';
import { ICheckActivePlayer } from '../services/Server';

export default class BoardScene extends Phaser.Scene
{
    rexUI!: RexUIPlugin

    private server?: Server
    private onGameOver?: (data: IGameOverSceneData) => void
    private character?: Phaser.GameObjects.Sprite

    private selectionMode = false

    private disableServerConn = false

    private pointText?: Phaser.GameObjects.Text
    private deckText?: Phaser.GameObjects.Text

    // msg box for displaying what players should do
    private msgBox?: Dialog

    sets = [] as Phaser.GameObjects.Container[]
    commonCards = [] as Phaser.GameObjects.Sprite[]
    remainHand?: Phaser.GameObjects.Sprite
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor()
    {
        super(SceneKeys.Game)
    }

    async create(data: IGameSceneData)
    {
        const { server, onGameOver } = data

		this.server = server
		this.onGameOver = onGameOver

		if (!this.server)
		{
			throw new Error('server instance missing')
		}

        if(!this.disableServerConn)
        {
            await this.server.join()

            this.server.onceStateChanged(this.createLayout, this)
        }
        else
        {
            this.createLayout();
        }

        // this.cursors = this.input.keyboard.createCursorKeys()
        
        this.input.on('drag', (p: Phaser.Input.Pointer, spr: Phaser.GameObjects.Sprite) => {
            spr.x = p.x
            spr.y = p.y
        })

        // should be going to selectionMode
        this.onSpacePressed(() => {
            console.log('space is just pressed')
            this.toggleSelectionMode();
            console.log(`selection: ${this.isSelectionMode()}`)
        }, this)

        this.server.onHandChanged(this.setRemainHand, this)

        this.server.onPlayerIndexChanged(this.setCharacterSprite, this)

        this.server.onBoardcastTurnStart(this.handleTurnStartMsgBox, this)

        this.server.onCloseTurnStartDialog(() => {
            console.log('close turn start dialog')

            this.hideMsgBox()
            return

        }, this)

    }

    /*     update()
    {
    } */

    private handleTurnStartMsgBox(data: ICheckActivePlayer)
    {
        const { isYourTurn } = data
        const { width, height } = this.scale

        if(!this.msgBox)
        {
            return
        }

        if( isYourTurn === true )
        {
            this.msgBox = this.createDialog(width/2, height*1.2/4, 'This is your turn.')
            
            this.msgBox.setInteractive()
            this.msgBox.on('pointerup', () => {
                this.hideMsgBox()
                this.server?.confirmTurnStart()
            })
            // this.msgBox.getElement('content')
        }
        else
        {
            this.msgBox = this.createDialog(width/2, height*1.2/4, 'This is your rivals turn.')
            this.msgBox.disableInteractive()
        }

        

        return
    }

    private setRemainHand(spriteName: string)
    {
        this.remainHand?.setFrame(spriteName).setOrigin(1, 1).setAlpha(1)
    }

    private removeRemainHand()
    {
        this.remainHand?.setFrame('back').setAlpha(0.5).setOrigin(1,1)
    }

    private onSpacePressed(cb: () => void, context: any)
    {
        this.input.keyboard.on('keyup-SPACE', cb, context);
    }

    private toggleSelectionMode()
    {
        this.selectionMode = !this.selectionMode
    }

    private isSelectionMode()
    {
        return this.selectionMode
    }

    createLayout()
    {
        const graphics = this.add.graphics()
        const {width, height} = this.scale
        // create the deck
        // this.createCardBack(208, -142).setOrigin(0, 0)
        this.createDeck(208, -142).setOrigin(0, 0)

        // text for remaining cards
        this.add.text(110, 10, 'Remaining', {
            fontSize: '28px'
        }).setOrigin(0.5, 0)
        this.deckText = this.add.text(110, 43, '30', {
            fontSize: '40px'
        }).setOrigin(0.5, 0)

        this.msgBox = this.createDialog(width/2, height*1.2/4, '').setAlpha(0)

        // commom place
        this.createCommonPlace(graphics, width, height)

        // remaining hand
        this.createHand(graphics, width, height)

        // set Area
        this.createSetsArea(graphics)
        
        // add a gotchi
        this.createCharacter()

        // add player scores
        const ptCircle = this.add.circle(100, 370, 50, 0xAA8800).setStrokeStyle(6, 0xffcc00)
        this.pointText = this.add.text(ptCircle.x, ptCircle.y, `10`, {
            fontSize: '60px'
        }).setOrigin(0.5, 0.5)
        
    }

    createDialog(posx: number, posy: number, dialog: string)
    {
        return this.rexUI.add.dialog({
            x: posx, 
            y: posy,
            width: dialog.length * 13,
            background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),
            content: this.createRexLabel(this, dialog)
        })
        .layout()
        .popUp(500)
        .setDepth(2)
        .setInteractive()
    }

    private showMsgBox()
    {
        if(!this.msgBox)
        {
            return
        }
        else
        {
            this.msgBox.popUp(500)
        }
    }

    private hideMsgBox()
    {
        if(!this.msgBox)
        {
            return
        }
        else
        {
            this.msgBox.scaleDown(500)
        }
    }

    createRexLabel(s: Phaser.Scene, text: string)
    {
        return this.rexUI.add.label({
            text: s.add.text(0, 0, text, {
                fontSize: '24px'
            }),
            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10
            }
        })
    }

    createCharacter()
    {
        this.character = this.add.sprite(100, 515, "gotchidev")
    }

    setCharacterSprite(idx: number)
    {
        this.character?.setTexture(idx === 0 ? "gotchidev" : "hacker")
    }

    createCardBack(x: number, y: number)
    {
        const back = this.add.sprite(x, y, 'cards', 'back')

        return back
    }

    createCardBackArea(x: number, y: number)
    {
        const back = this.createCardBack(x, y)
        back.setAlpha(0.4)

        return back
    }

    createDeck(x: number, y: number)
    {
        const deck = this.createCardBack(x, y)

        return deck
    }

    createCard(x: number, y: number, key: string)
    {
        const card = this.add.sprite(x, y, 'cards', key).setInteractive()
        // this.cards.push(card)
        // this.input.setDraggable(card)
        
        return card
    }

    createCommonPlace(graphics: Phaser.GameObjects.Graphics, width: number, height: number)
    {
        this.add.text(width*0.5, height*0.08, 'Common Place', {
            fontSize: '30px'
        }).setOrigin(0.5, 0)

        for(let i = 0; i < 7; i++)
        {
            const gap = 5
            const CPWidth = this.scale.width - (gap * 2)
            graphics.lineStyle(5, 0x00F7FF)
            graphics.strokeRect(5 + (i * CPWidth / 7), 90, 150, 210)
            const cardback = this.createCardBackArea(10 + (i * CPWidth / 7), 100).setOrigin(0, 0)
            this.commonCards.push(cardback)
        }
    }

    createHand(graphics: Phaser.GameObjects.Graphics, width: number, height: number)
    {
        graphics.lineStyle(8, 0xFFA500)
        graphics.strokeRect(width + 8 - 200, height*0.95 - 250, 200, 250)

        this.remainHand = this.createCardBackArea(width - 30, height*0.95 - 50).setOrigin(1, 1)
    }

    createSetsArea(graphics: Phaser.GameObjects.Graphics)
    {
        for(let i = 0; i < 3; i++)
        {
            graphics.lineStyle(5, 0xfff700)
            graphics.strokeRect(300 + (i * 230) - 220/2, 450 - 270/2, 220, 270)

            const set = this.add.container(200 + (i * 230) + 140/2, 335 + 190/2, [
                this.createCardBackArea(0, 0).setAngle(-3).setAlpha(0),
                this.createCardBackArea(30, 20).setAngle(0).setAlpha(0),
                this.createCardBackArea(60, 40).setAngle(3).setAlpha(0)
            ])

            this.sets.push(set)
        }
    }
}