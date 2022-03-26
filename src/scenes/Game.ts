import Phaser from 'phaser'
import { ColorNumKeys, SceneKeys } from '.'
import type Server from '../services/Server'
import { IGameOverSceneData, IGameSceneData } from '../types/scenes'

export default class GameScene extends Phaser.Scene
{
    private server?: Server
    private onGameOver?: (data: IGameOverSceneData) => void

    private disableServerConn = true

    private pointText?: Phaser.GameObjects.Text

    common = [] as Phaser.GameObjects.Sprite[]
    playerScoreText?: Phaser.GameObjects.Text
    remainHand?: Phaser.GameObjects.Sprite
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    preX = 0
    preY = 0

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

        this.cursors = this.input.keyboard.createCursorKeys()
        
        this.input.on('drag', (p: Phaser.Input.Pointer, spr: Phaser.GameObjects.Sprite) => {
            spr.x = p.x
            spr.y = p.y
        })

    }

    update()
    {
        /* if(this.cursors?.space && Phaser.Input.Keyboard.JustDown(this.cursors?.space))
        {            
            this.createCard(
                this.preX,
                this.preY,
                "spades8"
            )

            this.preX -= 25
            this.preY += 25
        } */
    }

    createLayout()
    {
        const graphics = this.add.graphics()
        // create the deck
        this.createCardBack(208, -142).setOrigin(0, 0)

        this.add.text(110, 10, 'Remaining', {
            fontSize: '28px'
        }).setOrigin(0.5, 0)
        this.playerScoreText = this.add.text(110, 43, '20', {
            fontSize: '40px'
        }).setOrigin(0.5, 0)

        this.createCard(10, 100, "spades3").setOrigin(0, 0)

        // commom place
        for(let i = 0; i < 7; i++)
        {
            const gap = 5
            const CPWidth = this.scale.width - (gap * 2)
            this.add.rectangle(5 + (i * CPWidth / 7), 90, 150, 210, 0xffffff, 0)
            .setStrokeStyle(5, 0x00F7FF)
            .setOrigin(0, 0)
            // const card = this.createCard(15 + (i * (140 + 10)), 100, "spades3").setOrigin(0, 0)
            // this.common.push(card)
        }

        // remaining hand
        const handArea = this.add.rectangle(this.scale.width + 8, this.scale.height*0.95, 200, 250, 0xFFA500, 0)
        handArea.setOrigin(1, 1)
        handArea.setStrokeStyle(8, 0xFFA500)

        this.remainHand = this.createCard(
            this.scale.width - 30, 
            this.scale.height*0.95 - 50, 
            "diamonds3"
        ).setOrigin(1, 1)

        // set Area
        const sets = []

        for(let i = 0; i < 3; i++)
        {
            const setArea = this.add.rectangle(310 + (i * (140 + 70)), 450, 180, 270, 0xffffff, 0)
            setArea.setStrokeStyle(5, 0xfff700)
            const set = this.add.container(240 + (i * (140 + 70)), 326, [
                this.createCard(0, 0, "spades7").setOrigin(0, 0),
                this.createCard(0, 30, "spades8").setOrigin(0, 0),
                this.createCard(0, 60, "spades9").setOrigin(0, 0)
            ])

            sets.push(set)
        }

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
        const back = this.add.sprite(x, y, 'cards', 'back').setInteractive().setOrigin(0.5)

        return back
    }

    createCard(x: number, y: number, key: string)
    {
        const card = this.add.sprite(x, y, 'cards', key).setInteractive()
        // this.cards.push(card)
        // this.input.setDraggable(card)
        
        return card
    }

    getRelativeWidth(_input: number)
    {
        const {width} = this.scale
        return _input / width
    }

    getRelativeHeight(_input: number)
    {
        const {height} = this.scale
        return _input / height
    }

    createCommonArea(x: number, y: number, width: number, height: number, graphics: Phaser.GameObjects.Graphics)
    {
        const zone = this.add.zone(x, y, width, height)
        zone.setDropZone(
            new Phaser.Geom.Rectangle(0, 0, width, height),
            () => {}
        )

        graphics.lineStyle(5, ColorNumKeys.Red)
        graphics.strokeRect(
            zone.x + zone.input.hitArea.x,
            zone.y + zone.input.hitArea.y,
            zone.input.hitArea.width,
            zone.input.hitArea.height
        )

        return zone
    }
}