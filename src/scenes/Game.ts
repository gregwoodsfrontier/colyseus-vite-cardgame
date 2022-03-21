import Phaser from 'phaser'
import { ColorNumKeys, SceneKeys } from '.'

export default class GameScene extends Phaser.Scene
{
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
    
    create()
    {   
        const {width, height} = this.scale
        // const graphics = this.add.graphics()

        /* const zone = this.createCommonArea(
            width / 2 - 500/2,
            height / 2 - 100/2,
            500,
            100,
            graphics
        ) */

        this.createLayout();

        this.cursors = this.input.keyboard.createCursorKeys()

        // create Common Area
        

        this.input.on('drag', (p: Phaser.Input.Pointer, spr: Phaser.GameObjects.Sprite) => {
            spr.x = p.x
            spr.y = p.y
        })

        this.preX = width * 0.7
        this.preY = height * 0.2

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
        // create the deck
        this.createCardBack(208, -142).setOrigin(0, 0)

        this.add.text(110, 10, 'Remaining', {
            fontSize: '28px'
        }).setOrigin(0.5, 0)
        this.playerScoreText = this.add.text(110, 43, '20', {
            fontSize: '40px'
        }).setOrigin(0.5, 0)

        this.createCard(15, 100, "spades3").setOrigin(0, 0)
        for(let i = 0; i < 6; i++)
        {
            const card = this.createCard(15 + (i * (140 + 10)), 100, "spades3").setOrigin(0, 0)
            this.common.push(card)
        }

        // remaining hand
        this.add.rectangle(750, 350, 180, 210, 0xFFA500). setOrigin(0, 0)
        this.remainHand = this.createCard(760, 360, "diamonds3").setOrigin(0, 0)
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