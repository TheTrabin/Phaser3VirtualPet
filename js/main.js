// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
  // game stats
  this.stats = {
    health: 100,
    fun: 100,

  }; // end stats


}; // end initialization

// load asset files for our game
gameScene.preload = function() {
  
  // load assets
  this.load.image('backyard', 'assets/images/backyard.png');
  this.load.image('apple', 'assets/images/apple.png');
  this.load.image('candy', 'assets/images/candy.png');
  this.load.image('rotate', 'assets/images/rotate.png');
  this.load.image('toy', 'assets/images/rubber_duck.png');

  this.load.spritesheet("pet", 'assets/images/pet.png', {
    frameWidth: 97,
    frameHeight: 83,
    margin: 1, 
    spacing: 1,
}); //end spritesheet

}; //end preload

// executed once, after assets were loaded
gameScene.create = function() {

  //game Background
  this.bg = this.add.sprite( 0, 0, 'backyard').setOrigin(0,0).setInteractive();

  // event listener for the background
  this.bg.on('pointerdown', this.placeItem, this);

  this.pet = this.add.sprite(100,200, 'pet', 0).setInteractive();
  this.pet.depth = 1;

  //draggable pet
  this.input.setDraggable(this.pet);

  // animation
  this.anims.create({
    key: 'funnyfaces',
    frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
    frameRate: 7,
    yoyo: true,
    repeat: 0 // to play forever -1
  });

  //explicit. Follow the pointer (mouse/pointer) when dragging.
  this.input.on('drag', function(pointer, gameObject, dragX, dragY) {
    //make sprite located at coordinate of the dragging
    gameObject.x = dragX;
    gameObject.y = dragY;

  }); // end input method

//create ui
this.createUi();


}; //end create

//create ui
gameScene.createUi = function() {
  //buttons
  this.appleBtn = this.add.sprite(72,570, 'apple').setInteractive();
  this.appleBtn.customStats = {health: 20, fun:0};
  this.appleBtn.on('pointerdown', this.pickItem);

  this.candyBtn = this.add.sprite(144,570, 'candy').setInteractive();
  this.candyBtn.customStats = {health: -10, fun:10};
  this.candyBtn.on('pointerdown', this.pickItem);

  this.toyBtn = this.add.sprite(216,570, 'toy').setInteractive();
  this.toyBtn.customStats = {health: 0, fun:15 };
  this.toyBtn.on('pointerdown', this.pickItem);

  this.rotateBtn = this.add.sprite(288,570, 'rotate').setInteractive();
  this.rotateBtn.customStats = {fun: 20 };
  this.rotateBtn.on('pointerdown', this.rotatePet);

// array all buttons
this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];


//ui is not blocked
this.uiBlocked = false;

//refresh UI
this.uiReady();

}; //End Create UI


//rotate pet
gameScene.rotatePet = function() {

//ui can't be blocked to rotate
if(this.scene.uiBlocked) return;

//make sure the ui is ready
  this.scene.uiReady();

  // block ui
  this.scene.uiBlocked = true;


  //dim the rotate button
  this.alpha = 0.5;

  let scene = this.scene;
 
  //rotate tween
  let rotateTween = this.scene.tweens.add({
    targets: this.scene.pet,
    duration: 600,
    angle: 720,
    pause: false,
    callbackScope: this,
    onComplete: function(tween, sprites){
      //increase fun
      this.scene.stats.fun += this.customStats.fun;

      // set ui to ready
      this.scene.uiReady();
    }
  });
  

  console.log('we are rotating the pet!');
};

// pick item
gameScene.pickItem = function() {
 
  //ui can't be blocked to select an item.
  if(this.scene.uiBlocked) return;

  //make sure the ui is ready
  this.scene.uiReady();

  //select item
  this.scene.selectedItem = this;

  // change transparancy
  this.alpha = 0.5;

  console.log('We are picking ' + this.texture.key);
}; // end pick item

//set ui to "ready"
gameScene.uiReady = function() {
  //nothing is being selected
  this.selectedItem = null;

  //set all buttons to alpha 1
  for(let i = 0; i < this.buttons.length; i++) {
    this.buttons[i].alpha = 1;
  };

// scene is unblocked
this.uiBlocked = false;
}; //end ui ready

//place new item on the game
gameScene.placeItem = function(pointer, localX, localY) {
  //check that an item was selected
  if(!this.selectedItem) return;

  //ui must be unblocked
  if(this.uiBlocked) return;

  //create a new item in the positing the player clicked.
  let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

  

  //block the ui
  this.uiBlocked = true;

  //pet movement (tween)
  let petTween = this.tweens.add({
    targets: this.pet,
    duration: 500,
    x: newItem.x,
    y: newItem.y,
    paused: false,
    callbackScope: this,
    onComplete: function(
      tween, sprites
    ) {
      
      //destroy the item
      newItem.destroy();


      //play spritesheet animation
      this.pet.play('funnyfaces');

      // event listener for when spritesheet animation ends
      this.pet.on('animationcomplete', function() {

        // set pet back to neutral face
        this.pet.setFrame(0);

//clear the UI
this.uiReady();
      }, this);


  // pet stats
  for (stat in this.selectedItem.customStats) {
    if(this.selectedItem.customStats.hasOwnProperty(stat)) {
        this.stats[stat] =+ this.selectedItem.customStats[stat];
    };
  };

      
    }
  });


  

  

}; //end placeItem


// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 360,
  height: 640,
  scene: gameScene,
  title: 'Virtual Pet',
  pixelArt: false,
  backgroundColor: 'ffffff'
}; // end config

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
