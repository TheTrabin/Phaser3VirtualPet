// create a new scene
let bootScene = new Phaser.Scene('Boot');


bootScene.preload = function() {
this.load.image('logo', 'assets/images/logo3.png');
};

bootScene.create = function() {
    this.scene.start('Loading');
};