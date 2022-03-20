import { SceneKeys } from ".";

export default class TestScene extends Phaser.Scene {
    constructor()
    {
        super(SceneKeys.Test)
    }

    create()
    {
        const height = 400;

        const image = this.add.sprite(100, 300, 'cards').setScale(300 / height).setInteractive();
    
        this.input.setDraggable(image);
    
        this.input.on('drag', function (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite) {
    
            gameObject.setScale(gameObject.y / height);
    
            gameObject.x = pointer.x;
            gameObject.y = pointer.y;
    
        });
    
        this.input.on('drop', function (_pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Sprite, dropZone: Phaser.GameObjects.Zone) {
            console.log('drop')
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
    
        });

        console.table(this.input.eventNames())
    
        //  A drop zone
        const hitArea = new Phaser.Geom.Rectangle(0, 0, 300, 500)
        const zone = this.add.zone(500, 300, 300, 500).setDropZone(hitArea, () => {});
    
        //  Just a visual display of the drop zone
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(zone.x + zone.input.hitArea.x, zone.y + zone.input.hitArea.y, zone.input.hitArea.width, zone.input.hitArea.height);
        console.log(`zone input hitarea x: ${zone.input.hitArea.x}`)
        console.log(`zone input hitarea y: ${zone.input.hitArea.y}`)
    }
}