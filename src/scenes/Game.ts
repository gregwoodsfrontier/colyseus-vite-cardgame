import Phaser from 'phaser'
import { SceneKeys } from '.'

export default class GameScene extends Phaser.Scene
{
    constructor()
    {
        super(SceneKeys.Game)
    }
    
    create()
    {   
        //TODO create the cards layout first
        const atlasTexture = this.textures.get('all-cards')
        const frames = atlasTexture.getFrameNames()
        const { width, height } = this.scale
        console.table(frames)

        this.add.sprite(width/2, height/2, 'all-cards', frames[0])
        .setScale(2)
    }
}