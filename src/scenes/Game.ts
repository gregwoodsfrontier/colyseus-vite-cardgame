import Phaser from 'phaser'
import { SceneKeys } from '.'

enum CardPattern {
    Hearts,
    Diamonds,
    Spades,
    Club
}

 type Card = {
    pattern: number,
    point: number
}

const createDeck = () => {
    const deck = [] as Card[]
    const patterns = [
        CardPattern.Hearts,
        CardPattern.Diamonds,
        CardPattern.Spades,
        CardPattern.Club
    ]
    const points = [1, 2, 3, 4, 5, 6, 7, 8]

    for(let pat of patterns)
    {
        for(let pt of points)
        {
            deck.push({
                pattern: pat,
                point: pt
            })
        }
    }
    return deck
}

export default class GameScene extends Phaser.Scene
{
    deck?: Card[]
    constructor()
    {
        super(SceneKeys.Game)
    }
    
    create()
    {   
        //TODO create the cards layout first
        this.deck = createDeck()

        const { width, height } = this.scale

        //create card back
        this.createCardBack(width * 0.10, height*0.5).setInteractive()

        // create set layout
        const playerSets = []
        for(let i = 0; i < 3; i++)
        {
            const startX = 0.35
            const offsetX = 0.15
            const single = this.createCardSet(width * (startX + i * offsetX), height*0.675, [2, 3, 4])
            .setSize(80, 80)
            .setInteractive()
            playerSets.push(single)
        }

        const enemySets = []
        for(let i = 0; i < 3; i++)
        {
            const startX = 0.35
            const offsetX = 0.15
            const single = this.createCardSet(width * (startX + i * offsetX), height*(0.5 - 0.175), [2, 3, 4])
            .setSize(80, 80)
            .setInteractive()
            enemySets.push(single)
        }
        
        // create hand layout
        const playerCards = [
            this.createCard(width * 0.35, height * 0.85, 10).setInteractive(),
            this.createCard(width * 0.5, height * 0.85, 10).setInteractive(),
            this.createCard(width * 0.65, height * 0.85, 10).setInteractive()
        ]

        const zone = this.createCommonArea(width * 0.5, height * 0.5)
        
        // set the events here
        playerCards.forEach(card => this.setDraggableFunc(card, zone))
    }

    setContainerHover(_con: Phaser.GameObjects.Container)
    {
        _con.on('pointerover', () => {
            _con.each((go: Phaser.GameObjects.Sprite) => {
                go.setTint(0x00ff00)
            })
        })

        _con.on('pointerout', () => {
            _con.each((go: Phaser.GameObjects.Sprite) => {
                go.clearTint()
            })
        })
    }

    setGameObjHoverEvents(_go: Phaser.GameObjects.Sprite)
    {
        _go.on('pointerover', function () {
            _go.setTint(0x00ff00)
        })

        _go.on('pointerout', function () {
            _go.clearTint()
        })
    }

    setDraggableFunc(_spr: Phaser.GameObjects.Sprite, zone: Phaser.GameObjects.Zone)
    {

        this.input.setDraggable(_spr)

        this.input.on('dragstart', (_pointer: any, gameObject: { setTint: (arg0: number) => void }) => {
            gameObject.setTint(0xff0000)
        })

        this.input.on('drag', function (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dragX: number, dragY: number) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (_p: Phaser.Input.Pointer, go: Phaser.GameObjects.Sprite) => {
            go.clearTint();

            const inter = Phaser.Geom.Rectangle.Intersection(
                go.getBounds(),
                zone.getBounds()
            )

            const hasDrop = Phaser.Geom.Rectangle.Area(inter) > 0

            if(hasDrop)
            {
                console.log('card is in bounds')
            }
            else
            {
                console.log('card is out bounds')
            }
        })
        
    }

    debugPaint(_rect: Phaser.Geom.Rectangle)
    {
        const graphics = this.add.graphics()
        graphics.lineStyle(5, 0xffff00)
        graphics.strokeRectShape(_rect)
    }

    getCardFrameNames()
    {
        const atlasTexture = this.textures.get('all-cards')
        return atlasTexture.getFrameNames()
    }

    createCommonArea(_x: number, _y: number)
    {
        const dimensions = [400, 100]
        const zone = this.add.zone(
            _x, 
            _y, 
            dimensions[0], 
            dimensions[1]
        )
        zone.setDropZone(
            new Phaser.Geom.Rectangle(-zone.width/2, -zone.height/2, dimensions[0], dimensions[1]),
            () => {            
            }
        );
        
        const graphics = this.add.graphics()
        graphics.lineStyle(5, 0xff0000)
        graphics.strokeRect(
            zone.x + zone.input.hitArea.x, 
            zone.y + zone.input.hitArea.y, 
            zone.input.hitArea.width, 
            zone.input.hitArea.height
        );
                
        return zone
    }

    createCard(_x: number, _y: number, _card: number)
    {
        const frames = this.getCardFrameNames()
        return this.add.sprite(_x, _y, 'all-cards', frames[_card]).setScale(1)
    }

    createCardBack(_x: number, _y: number)
    {
        const frames = this.getCardFrameNames()
        return this.add.sprite(_x, _y, 'all-cards', frames[0]).setScale(1)
    }

    createCardSet(_x: number, _y: number, _frameIdx: number[])
    {   
        const cardset = []
        const frames = this.getCardFrameNames()
        // const frameIndex = [2,3,4]

        for(let i = 0; i < 3; i++)
        {
            const offset = [15, 10]
            const curr = _frameIdx[i]
            const cardsprite = this.add.sprite(0 + offset[0] * i, 0 + offset[1] * i, 'all-cards', frames[curr])
            cardset.push(cardsprite)
        }

        return this.add.container(_x, _y, cardset)
    }
}