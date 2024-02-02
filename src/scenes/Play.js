class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        //green ui background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0,0);
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xffffff).setOrigin(0,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xffffff).setOrigin(0,0);

        //reset speed modifier
        game.settings.speedModifier = 1

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)

        //adding 3 spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 7 + borderPadding * 1, 'spaceship', 0, 10).setOrigin(0,0)
        //adding speeders
        this.speeder01 = new Speeder(this, game.config.width + borderUISize * 7, borderUISize * 3 + borderPadding * 1, 'speeder', 0, 40).setOrigin(0,0)
        this.speeder02 = new Speeder(this, game.config.width, borderUISize * 8 + borderPadding * 2, 'speeder', 0, 15).setOrigin(0,0)
        
        // define keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, game.settings.p1Score, scoreConfig)
        scoreConfig.align = 'right'
        this.scoreRight = this.add.text(borderUISize * 15 + borderPadding * 2, borderUISize + borderPadding * 2, game.settings.p2Score, scoreConfig)

        //game over flag
        this.gameOver = false

        //timer
        scoreConfig.fixedWidth = 0
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.gameOver = true
            this.handleRoundEndText()
        },
        null,
        this
        )

        //speed up after 30s
        this.speedup = this.time.delayedCall(30000, () => {
            game.settings.speedModifier = 1.5
            console.log('speed up')
        },
        null,
        this
        )

        //timer display
        scoreConfig.align = 'center'
        scoreConfig.fixedWidth = 100
        this.timeLeft = this.add.text(borderUISize * 8 + borderPadding * 1, borderUISize + borderPadding * 2, this.clock.elapsed, scoreConfig)
        scoreConfig.fixedWidth = 0
        //console.log(this.clock.elapsed)
        //console.log(this.timeLeft)

        //physics colliders
        this.physics.add.collider(this.p1Rocket, this.ship03, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.ship02, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.ship01, this.handleCollision, null, this)
        //physics colliders speeders
        this.physics.add.collider(this.p1Rocket, this.speeder01, this.handleCollision, null, this)
        this.physics.add.collider(this.p1Rocket, this.speeder02, this.handleCollision, null, this)

        //testing
        //game.settings.p1Score = 10
        //console.log(game.settings.p1Score)
        //console.log(`p${game.settings.turn}Score`)
        //console.log(game.settings[`p${game.settings.turn}Score`])
    }

    update() {
        //handle round end
        if(this.gameOver) {
            this.handleRoundEnd()
        }

        //scroll background
        this.starfield.tilePositionX -= 4;
        
        this.timeLeft.text = Math.ceil((game.settings.gameTimer - this.clock.elapsed) / 1000)

        if(!this.gameOver) {
            //rocket update
            this.p1Rocket.update();
            
            //ship updates
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.speeder01.update();
            this.speeder02.update();
        }
    }

    handleCollision(rocket, ship) {
        rocket.reset()
        this.shipExplode(ship)
    }

    shipExplode(ship) {
        //hide ship for a bit
        ship.alpha = 0
        //test if is ship or speeder?
        let isSpeeder = 1
        if(ship.constructor.name == 'Speeder') {
            isSpeeder = 0.5
        }
        //create boom
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0).setScale(1, isSpeeder);
        boom.anims.play('explode')
        boom.on('animationcomplete', () => {
            ship.reset()
            ship.alpha = 1
            boom.destroy()
        })
        //add time
        this.clock.elapsed -= ship.points * 100
        //score
        game.settings[`p${game.settings.turn}Score`] += ship.points
        this.scoreLeft.text = game.settings.p1Score
        this.scoreRight.text = game.settings.p2Score

        this.sound.play('sfx-explosion')
    }

    handleRoundEndText() {
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
        }
        
        //stick in clock, changes the text that appears at the end of each round
        if(game.settings.turn == 1) {
            //if first turn end, say p2, press left to start
            this.add.text(game.config.width/2, game.config.height/2, 'P2 TURN', scoreConfig).setOrigin(0.5)
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press ← to start your turn', scoreConfig).setOrigin(0.5)
        } else {
            //if second turn end, say who won/tie, r to restart left to menu
            if(game.settings.p1Score == game.settings.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2, 'TIE', scoreConfig).setOrigin(0.5)
            } else if(game.settings.p1Score > game.settings.p2Score) {
                this.add.text(game.config.width/2, game.config.height/2, 'P1 WINS', scoreConfig).setOrigin(0.5)
            } else {
                this.add.text(game.config.width/2, game.config.height/2, 'P2 WINS', scoreConfig).setOrigin(0.5)
            }
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
        }
    }

    handleRoundEnd() {
        //if this.gameover, call this function, replaces the if this.gameover && input thingies
        let menuInputs = {
            reset: Phaser.Input.Keyboard.JustDown(keyRESET),
            left: Phaser.Input.Keyboard.JustDown(keyLEFT)
        }

        if(game.settings.turn == 1 && menuInputs['left']) {
            //if round 1 over, press left to start next round
            game.settings.turn += 1
            this.scene.restart()
        } else {
            //if round 2 over, press r to restart (zero the scores and turn counter and restart scene) and left to got to menu
            if(menuInputs['reset']) {
                game.settings.p1Score = 0
                game.settings.p2Score = 0
                game.settings.turn = 1
                this.scene.restart()
            }
            if(menuInputs['left']) {
                this.scene.start('menuScene')
            }
        }
    }
}