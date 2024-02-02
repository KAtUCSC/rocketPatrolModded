//spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame)
        scene.add.existing(this)    //add to existing scene
        scene.physics.add.existing(this)
        this.points = pointValue    // store point value
        this.moveSpeed = game.settings.spaceshipSpeed          //movement speed in pixels/frame
        this.direction = this.pickDirection()
        if(this.direction == -1) {
            this.flipX = true
            this.x -= (game.config.width + this.width) * 2
        }
        this.wrap = false
        //console.log(this.direction)
    }

    update() {
        //start screen wrap
        if(0 < this.x && this.x < this.width) {
            this.wrap = true
        }
        //move left
        this.x -= (this.moveSpeed * game.settings.speedModifier) * this.direction

        //wrap around form left to right
        if(this.x <= 0 - this.width && this.wrap) {
            this.x += game.config.width + this.width;
        }

        //wrap around form right to left
        if(this.x >= game.config.width && this.wrap) {
            //console.log('wrapping right')
            this.x -= game.config.width + this.width
        }
    }

    reset () {
        this.x = game.config.width
    }

    pickDirection() {
        //console.log(Math.random())
        let direction = Math.random()
        if(direction < 0.5) {
            direction = -1
            return direction
        }
        direction = 1
        return direction
    }
}