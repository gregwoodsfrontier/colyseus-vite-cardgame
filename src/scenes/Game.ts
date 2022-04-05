import Phaser from 'phaser'
import { ColorNumKeys, SceneKeys } from '.'
import type Server from '../services/Server'
import { IGameOverSceneData, IGameSceneData } from '../types/scenes'

export default class GameScene extends Phaser.Scene
{
    private server?: Server
    private onGameOver?: (data: IGameOverSceneData) => void

    private selectionMode = false

    private disableServerConn = false

    private pointText?: Phaser.GameObjects.Text
    private deckText?: Phaser.GameObjects.Text

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

        this.server.onHandChanged(() => {
            console.log('change to card selection')
        })

    }

    /*     update()
    {
    } */

    private setRemainHand(spriteName: string)
    {
        this.remainHand?.setTexture(spriteName)
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

        // commom place
        this.createCommonPlace(graphics, width, height)

        // remaining hand
        this.createHand(graphics, width, height)

        // set Area
        this.createSetsArea(graphics)
        

        // add a gotchi
        this.add.sprite(100, 515, "gotchidev")

        // add player scores
        const ptCircle = this.add.circle(100, 370, 50, 0xAA8800).setStrokeStyle(6, 0xffcc00)
        this.pointText = this.add.text(ptCircle.x, ptCircle.y, `10`, {
            fontSize: '60px'
        }).setOrigin(0.5, 0.5)
        
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