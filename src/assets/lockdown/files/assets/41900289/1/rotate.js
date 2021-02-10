var Rotate = pc.createScript('rotate');

// initialize code called once per entity
Rotate.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    //this.entity.collision.on('collisionstart', this.onCollisionStart, this); with rigid body
};

// update code called every frame
Rotate.prototype.update = function(dt) {
     this.entity.rotateLocal(0, 5 * dt, 0);
};

Rotate.prototype.onCollisionStart = function(entity) {
    console.log('onCollisionStart: ', entity.name);
};

Rotate.prototype.onTriggerEnter = function(entity) {
    console.log('onTriggerEnter: ', entity.name);
    if (entity.name === 'FallingBox') {
        setTimeout(() => {
            console.log('destroy: ', this.entity);
            this.entity.destroy();
        }, 1000); 
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Rotate.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/