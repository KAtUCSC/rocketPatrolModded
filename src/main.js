/*
Kira Way
Jet Fuel: Rocket Patrol Versus
Time taken: about 8 hours?
Mods: second ship type 5, time remaining 3, hit miss clock manipulation 5, alternating 2 player mode 5, direction randomized 1, speed increase 1
*/
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    physics:{
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

//set ui sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3
let keyFIRE, keyRESET, keyLEFT, keyRIGHT