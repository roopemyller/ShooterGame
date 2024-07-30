let gameOptions = {
    playerSpeed: 200
};

let game
let nextFire = 0
let firerate = 350
let isMagazine = true

let keyA;
let keyS;
let keyD;
let keyW;

const totalRandomTargets = 10

let backgroundMusic

let target = 0;
let ROTATION_SPEED = 1.5 * Math.PI

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: '#336633',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 800,
            height: 1000,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
        },
        scene: [MenuScene, SelectMap, InstructionScene, PlayGame, LeaderBoardScene]
    }
    game = new Phaser.Game(gameConfig)
    window.focus()
}

class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' })
    }

    preload() {
        this.load.image('glass-panel', './assets/glassPanel.png')
        this.load.image('cursor-hand', './assets/cursor_hand.png')
        this.load.spritesheet("player", "./assets/manBlue_machine.png", {frameWidth: 48, frameHeight: 32})
        this.load.audio('background', './assets/Ludum Dare 38 - 09.ogg')
        this.load.audio('select', './assets/menu select.wav')
    }

    create() {

        // Audio
        if(!backgroundMusic){
            backgroundMusic = this.sound.add('background', {loop: true, volume: 0.5})
            backgroundMusic.play()
        }else if (!backgroundMusic.isPlaying){
            backgroundMusic.play()
        }
        // Set the cursor to hand in the menu
        this.input.setDefaultCursor('url(./assets/cursor_hand.png), pointer')

        // Title
        this.titleText = this.add.text(game.config.width / 2, 75, 'Shooting Game', {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Author
        this.add.text(400, 175, 'Roope Myller', { 
            fontSize: '32px Arial', 
            fill: '#ffffff', 
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Create a select map button
        let selectMapButton = this.add.image(400, 300, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(400, 300, 'Start Game', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        selectMapButton.on('pointerdown', () => {
            this.scene.start('SelectMapScene')
            var audio = this.sound.add('select')
            audio.play()
        })

        // Create an instructions button
        let instructionsButton = this.add.image(400, 400, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(400, 400, 'Instructions', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        instructionsButton.on('pointerdown', () => {
            this.scene.start('InstructionScene')
            var audio = this.sound.add('select')
            audio.play()
        })

         // Create an leaderboard button
         let leaderboardButton = this.add.image(400, 500, 'glass-panel').setInteractive().setDisplaySize(250, 60)
         this.add.text(400, 500, 'Leaderboard', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)
 
         leaderboardButton.on('pointerdown', () => {
             this.scene.start('LeaderBoardScene')
             var audio = this.sound.add('select')
             audio.play()
         })

        this.spinningPlayer = this.add.sprite(400, 700, 'player').setScale(3, 3)
        this.spinningPlayer.setOrigin(0.5, 0.5);
    }

    update(time, delta){
        this.spinningPlayer.angle -= 4
    }
} 

class SelectMap extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectMapScene' })
    }

    preload() {
        this.load.image('glass-panel', './assets/glassPanel.png')
        this.load.image('cursor-hand', './assets/cursor_hand.png')
    }

    create() {
        // Set the cursor to hand in the menu
        this.input.setDefaultCursor('url(./assets/cursor_hand.png), pointer')

        // Title
        this.titleText = this.add.text(game.config.width / 2, 75, 'Select Map', {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)



        let map1Button = this.add.image(400, 200, 'glass-panel').setInteractive().setDisplaySize(120, 120)
        this.add.text(400, 200, 'Map 1', { fontSize: '28px', fill: '#000' }).setOrigin(0.5, 0.5)

        let map2Button = this.add.image(400, 330, 'glass-panel').setInteractive().setDisplaySize(120, 120)
        this.add.text(400, 330, 'Map 2', { fontSize: '28px', fill: '#000' }).setOrigin(0.5, 0.5)

        let randomMapButton = this.add.image(400, 460, 'glass-panel').setInteractive().setDisplaySize(120, 120)
        this.add.text(400, 460, 'Random\nMap', { fontSize: '28px', fill: '#000', align: "center" }).setOrigin(0.5, 0.5)


        map1Button.on('pointerdown', () => {
            this.scene.start('PlayGame', {map: '1', targets: 16})
            var shot = this.sound.add('select')
            shot.play()
        })

        map2Button.on('pointerdown', () => {
            this.scene.start('PlayGame', {map: '2', targets: 22})
            var shot = this.sound.add('select')
            shot.play()
        })

        randomMapButton.on('pointerdown', () => {
            this.scene.start('PlayGame', {map: 'Random', targets: 20})
            var shot = this.sound.add('select')
            shot.play()
        })

        // Create a back button
        let backButton = this.add.image(400, 700, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(400, 700, 'Back', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene')
            var shot = this.sound.add('select')
            shot.play()
        })
    }
}

class LeaderBoardScene extends Phaser.Scene {
    constructor(){
        super({key: 'LeaderBoardScene'})
    }
    preload() {
        this.load.image('glass-panel', './assets/glassPanel.png')
        this.load.image('cursor-hand', './assets/cursor_hand.png')
    }

    create(){
        // Title
        this.titleText = this.add.text(game.config.width / 2, 45, 'Leaderboard', {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        let scores = JSON.parse(localStorage.getItem('topScores')) || []

        scores.sort((a, b) => a.time - b.time)

        let y = 100
        scores.forEach((score, index) => {
            this.add.text(100, y, `${index + 1}. ${score.name} in Map ${score.map}  ${score.time}s`, {fontSize: '28px', fill: '#fff'})
            y += 40
        })
        
        // Create a back button
        let backButton = this.add.image(200, 700, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(200, 700, 'Back', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene')
            var shot = this.sound.add('select')
            shot.play()
        })

        // Create clear leaderboard button
        let b = this.add.image(600, 700, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(600, 700, 'clear', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        b.on('pointerdown', () => {
            this.clearLeaderBoard()
            this.scene.restart()
            var shot = this.sound.add('select')
            shot.play()
        })
    }
    clearLeaderBoard() {
        localStorage.removeItem('topScores')
    }
}


class InstructionScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionScene' })
    }

    preload() {
        this.load.image('glass-panel', './assets/glassPanel.png')
        this.load.image('cursor-hand', './assets/cursor_hand.png')
    }

    create() {
        // Set the cursor to hand in the options menu
        this.input.setDefaultCursor('url(./assets/cursor_hand.png), pointer')

        // Title
        this.titleText = this.add.text(game.config.width / 2, 75, 'Instructions', {
            font: '48px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Instructions
        this.instructionsText = this.add.text(game.config.width / 2, game.config.height / 2 - 200, 'Shoot targets to win, mind your bullet count!\nIf you run out of bullets, get that extra magazine!\nMove with WASD keys, shoot with MOUSE1', {
            font: '24px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Create a back button
        let backButton = this.add.image(400, 700, 'glass-panel').setInteractive().setDisplaySize(250, 60)
        this.add.text(400, 700, 'Back', { fontSize: '32px', fill: '#000' }).setOrigin(0.5, 0.5)

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene')
            var shot = this.sound.add('select')
            shot.play()
        })
    }
}

class PlayGame extends Phaser.Scene {
    init(data) {
        this.map = data.map
        this.totalTargets = data.targets
    }
    
    constructor() {
        super({ key: 'PlayGame' })
    }

    preload(){
        this.load.spritesheet("player", "./assets/manBlue_machine.png", {frameWidth: 48, frameHeight: 32})
        this.load.image("target", "./assets/barrelBlack_top.png")
        this.load.image("bullet", "./assets/laserBlue.png")
        this.load.image("magazine", "./assets/mag.png")
        this.load.image("glass-panel", "./assets/glassPanel.png")
        this.load.image("cursor-hand", "./assets/cursor_hand.png")
        this.load.image("cursor-crosshair", "./assets/crossair_black.png")
        this.load.image("car", "./assets/car.png")
        this.load.audio('shot', './assets/shot.wav')
        this.load.audio('magazine', './assets/magazine.wav')
        this.load.audio('target', './assets/Wood Block2.ogg')
        this.load.audio('lose', './assets/guns turn off.wav')
        this.load.audio('win', './assets/score.wav')

    }

    create(){
        
        // Player
        this.player = this.physics.add.sprite(game.config.width / 2, 900, "player")
        this.player.setCollideWorldBounds(true)

        // Walls
        this.wallGroup = this.physics.add.staticGroup()
        this.createWalls()

        // Bullets
        this.bulletGroup = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 100
        })

        // Magazine
        this.magazine = this.physics.add.sprite(Phaser.Math.Between(100, game.config.width / 2 -100), Phaser.Math.Between(825, 925), "magazine").setScale(0.5)
        this.physics.add.collider(this.player, this.magazine, this.getMagazine, null, this)
        isMagazine = true

        // Targets
        this.createTargets(this.totalTargets)

        // Create a back button
        let backButton = this.add.image(80, 50, 'glass-panel').setInteractive().setDisplaySize(110, 60)
        this.add.text(80, 50, 'Back', { fontSize: '24px', fill: '#000' }).setOrigin(0.5, 0.5)
        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene')
            var shot = this.sound.add('select')
            shot.play()
        })

        // Cursor
        this.input.setDefaultCursor('url(./assets/crossair_black.png), pointer')

        // Title
        this.titleText = this.add.text(game.config.width / 2, 45, `MAP: ${this.map}`, {
            font: '38px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Countdown
        this.startTime = this.time.now
        this.countdownText = this.add.text(game.config.width / 2, game.config.height / 2, '3', {
            font: '142px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Win/Lost text
        this.winText = this.add.text(game.config.width / 2, game.config.height / 2- 70, 'You Won!', {
            font: '48px Arial',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5, 0.5);
        this.winText.setVisible(false);

        // Targets remaining text
        this.targetsRemaining = this.totalTargets 
        this.targetText = this.add.text(game.config.width - 200, 850, `Targets: ${this.targetsRemaining}/${this.totalTargets}`)

        // Bullets remaining text
        this.totalBullets = 18
        this.bulletsRemaining = this.totalBullets
        this.bulletText = this.add.text(game.config.width - 200, 875, `Bullets: ${this.bulletsRemaining}/${this.totalBullets}`)

        // Keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        // Mouse pointer
        this.input.on('pointermove', (pointer) => {
            target = Phaser.Math.Angle.BetweenPoints(this.player, pointer)
        })

        // Shooting with mouse1
        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                this.firebullets()
            }
        })

        // Wall Colliders
        this.physics.add.collider(this.bulletGroup, this.wallGroup, function(bullet){
            bullet.setActive(false)
            bullet.setVisible(false)
            bullet.body.velocity.set(0)
        }, null, this)

        this.startCountdown()

        // this.startGame()
        this.gameStarted = false;
    }

    startCountdown() {
        let countdown = 3
        this.countdownText.setText(countdown)

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                countdown--
                if (countdown > 0) {
                    this.countdownText.setText(countdown)
                } else if (countdown === 0) {
                    this.countdownText.setText('GO')
                } else {
                    this.countdownText.setText('')
                    this.startGame()
                }
            },
            repeat: 3
        })
    }

    startGame() {
        // Timer
        this.startTime = this.time.now
        this.timerText = this.add.text(game.config.width / 2, 85, 'Time: 0.000', {
            font: '28px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5, 0.5)

        // Start game logic
        this.gameStarted = true;
    }


    createTargets(){
        this.targets = this.physics.add.group({
            immovable: true,
            allowGravity: false
        })

        if(this.map == 'Random'){
            for (let i = 0; i < this.totalTargets; i++){
                this.targets.create(Phaser.Math.Between(100, 700), Phaser.Math.Between(150, 750), "target")
            }
        }
        else if(this.map == '1'){
            // 16 Targets with special layout

            // Some more cars and wall
            this.carGroup = this.physics.add.group({
                immovable: true,
                allowGravity: false
            })
            this.carGroup.create(game.config.width / 2, 700, "car").setScale(3)
            this.carGroup.create(200, 300, "car").setScale(3)

            this.physics.add.collider(this.player, this.carGroup)
            this.physics.add.collider(this.carGroup, this.bulletGroup, function(car,bullet){
                bullet.setActive(false)
                bullet.setVisible(false)
                bullet.body.velocity.set(0)
            }, null, this)

            this.createWallSegment(700, 450, 500, 100)

            // Targets (16)
            //Leftside first quad
            this.targets.create(100, 735, "target")
            this.targets.create(100, 710, "target")
            this.targets.create(100, 685, "target")
            this.targets.create(100, 660, "target")

            // Middle double
            this.targets.create(game.config.width / 2 + 15, 625, "target")
            this.targets.create(game.config.width / 2 - 15, 625, "target")

            //Middle single
            this.targets.create(game.config.width / 2 + 25, 450, "target")

            // Rightside 4x singles down to up
            this.targets.create(700, 700, "target")
            this.targets.create(700, 375, "target")
            this.targets.create(700, 525, "target")
            this.targets.create(700, 155, "target")

            // Fron of car single
            this.targets.create(335, 300, "target")

            // Leftside second squd
            this.targets.create(100, 230, "target")
            this.targets.create(100, 205, "target")
            this.targets.create(100, 180, "target")
            this.targets.create(100, 155, "target")
        }
        else if(this.map == '2'){
            // 22 Targets with special layout

            // Some walls and a car
            this.createWallSegment(700, 550, 500, 50)
            this.createWallSegment(game.config.width / 2, 775, 520, 50)
            this.createWallSegment(game.config.width / 2 + 25, 575, 50, 350)
            this.createWallSegment(700, 320, 600, 50)
            this.createWallSegment(200, 625, 300, 50)


            this.carGroup = this.physics.add.group({
                immovable: true,
                allowGravity: false
            })
            this.carGroup.create(600, 210, "car").setScale(3)

            this.physics.add.collider(this.player, this.carGroup)
            this.physics.add.collider(this.carGroup, this.bulletGroup, function(car,bullet){
                bullet.setActive(false)
                bullet.setVisible(false)
                bullet.body.velocity.set(0)
            }, null, this)


            // Targets (22)
            // Hall first quad
            this.targets.create(100, 670, "target")
            this.targets.create(125, 670, "target")
            this.targets.create(150, 670, "target")
            this.targets.create(175, 670, "target")

            // Doorway double
            this.targets.create(game.config.width / 2 - 40, 625, "target")
            this.targets.create(game.config.width / 2 - 10, 625, "target")
            
            // Doorway single
            this.targets.create(game.config.width / 2 + 25, 370, "target")
            
            // Leftside penta
            this.targets.create(100, 550, "target")
            this.targets.create(100, 450, "target")
            this.targets.create(100, 350, "target")
            this.targets.create(100, 250, "target")
            this.targets.create(100, 150, "target")
            
            // Second small room triple
            this.targets.create(700, 500, "target")
            this.targets.create(670, 500, "target")
            this.targets.create(640, 500, "target")

            // Second small room double
            this.targets.create(700, 375, "target")
            this.targets.create(700, 405, "target")

            // First small room triple
            this.targets.create(700, 600, "target")
            this.targets.create(670, 600, "target")
            this.targets.create(640, 600, "target")

            // First small room single
            this.targets.create(475, 725, "target")

            // Near car single
            this.targets.create(435, 250, "target")

        }

        this.targets.setVisible(true)
        this.physics.add.collider(this.player, this.targets)
        this.physics.add.collider(this.bulletGroup, this.targets, this.hitTarget, null, this)
    }

    createWalls(){
        let wallThickness = 100
        let wallHeight = 800
        let wallWidth = 800

        // Create the vertical sides
        this.createWallSegment(25, 400, wallThickness, wallHeight) // Left vertical
        this.createWallSegment(775, 400, wallThickness, wallHeight) // Right vertical

        // Create the horizontal top
        this.createWallSegment(450, 25, wallWidth, 200) // Top horizontal

        this.physics.add.collider(this.player, this.wallGroup);
    }

    createWallSegment(x, y, width, height) {
        let segment = this.add.rectangle(x, y, width, height, 0x8B4513)
        segment.setOrigin(0.5, 0.5)

        this.physics.add.existing(segment, true)
        
        if (!this.wallGroup) {
            this.wallGroup = this.physics.add.staticGroup({
                immovable: true
            })
        }
        this.wallGroup.add(segment)
    }
    
    update(time, delta){
        if (this.gameStarted){
            // Timer
            if (this.targetsRemaining > 0) {
                this.timerText.setText(`Time: ${((time - this.startTime) / 1000).toFixed(2)}`);
            }
            // Turning
            this.player.rotation = Phaser.Math.Angle.RotateTo(
                this.player.rotation,
                target + Math.PI / 2,
                ROTATION_SPEED * 0.001 * delta
            )
            
            // horizontal movement
            if(keyA.isDown){
                this.player.body.velocity.x = -gameOptions.playerSpeed
            }
            else if(keyD.isDown){
                this.player.body.velocity.x = gameOptions.playerSpeed
            }
            else{
                this.player.body.velocity.x = 0
            }
    
            // vertical movement
            if(keyW.isDown){
                this.player.body.velocity.y = -gameOptions.playerSpeed
            }
            else if(keyS.isDown){
                this.player.body.velocity.y = gameOptions.playerSpeed
            }
            else{
                this.player.body.velocity.y = 0
            }  
        }
    }

    hitTarget(bullet, target){
        // Audio
        var shot = this.sound.add('target', {volume: 1.5})
        shot.play()
        bullet.setActive(false)
        bullet.setVisible(false)
        bullet.body.velocity.set(0)

        target.setActive(false)
        target.setVisible(false)
        target.body.velocity.set(0)

        this.targetsRemaining--
        this.targetText.setText( `Targets: ${this.targetsRemaining}/${this.totalTargets}`)

        target.destroy()

        if(this.targetsRemaining <= 0){
            this.endTime = this.time.now
            let completionTime = ((this.endTime - this.startTime) / 1000).toFixed(2)
            this.timerText.setText(`Time: ${completionTime} seconds`)
            this.winText.setVisible(true)
            var winSound = this.sound.add('win', {volume: 0.7})
            winSound.play()


            this.time.delayedCall(500, () => {
                let playerName = prompt("Enter your name for leaderboard: ")
                this.saveScore(playerName, parseFloat(completionTime))
            }, [], this)

        }

    }

    saveScore(name, time){
        let scores = JSON.parse(localStorage.getItem('topScores')) || []
        scores.push({name: name, map: this.map, time: time})
        localStorage.setItem('topScores', JSON.stringify(scores))
    }

    firebullets(){
        if (this.gameStarted){
            // Check if firerate allows the next bullet to be shot
            if (this.time.now > nextFire && this.bulletGroup.countActive(true) < this.bulletGroup.maxSize && this.bulletsRemaining > 0 && this.targetsRemaining > 0){
    
                // Audio
                var shot = this.sound.add('shot', {volume: 0.5})
                shot.play()
    
                nextFire = this.time.now + firerate;
    
                let bullet = this.bulletGroup.get(this.player.x, this.player.y)
    
                if(bullet){ 
                    bullet.setActive(true)
                    bullet.setVisible(true)
    
                    let bulletSpeed = 800
    
                    bullet.body.reset(this.player.x, this.player.y)
    
                    let angleInRadians = Phaser.Math.DegToRad(this.player.angle)
                    bullet.rotation = angleInRadians
    
                    bullet.body.velocity.x = Math.cos(angleInRadians - Math.PI / 2) * bulletSpeed
                    bullet.body.velocity.y = Math.sin(angleInRadians - Math.PI / 2) * bulletSpeed  
    
                    bullet.setCollideWorldBounds(true)
                    bullet.body.onWorldBounds = true
                    bullet.body.world.on('worldbounds', function(body) {
                        if (body.gameObject === bullet) {
                            bullet.setActive(false)
                            bullet.setVisible(false)
                        }
                    })
                }
                this.bulletsRemaining--
                this.bulletText.setText( `Bullets: ${this.bulletsRemaining}/${this.totalBullets}`)
            }
            if(this.bulletsRemaining <= 0 && !isMagazine && this.targetsRemaining > 0 && this.bulletGroup.countActive(true) <= 0){
                
                var audio = this.sound.add('lose', {volume: 1.5})
                audio.play()
                
                this.winText.setText("You Lost!")
                this.endTime = this.time.now
                this.timerText.setText(`Time: ${((this.endTime - this.startTime) / 1000).toFixed(2)} seconds`)
                this.winText.setVisible(true)
                this.gameStarted = false
            }
        }
    }
    
    getMagazine(player, magazine){
        // Audio
        let magazineSound = this.sound.add('magazine', {volume: 0.5})
        magazineSound.play()


        magazine.setActive(false)
        magazine.setVisible(false)

        isMagazine = false

        this.bulletsRemaining = 18
        this.bulletText.setText(`Bullets: ${this.bulletsRemaining}/${this.totalBullets}`)
    }
}