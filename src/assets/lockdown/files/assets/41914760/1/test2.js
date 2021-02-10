var Test2 = pc.createScript('test2');

// initialize code called once per entity
Test2.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

// update code called every frame
Test2.prototype.update = function(dt) {
    
};

Test2.prototype.onTriggerEnter = function(entity) {
    console.log('onTriggerEnter: ', entity.name);
    if (entity.name === 'FallingBox') {
        this.entity.children[1].particlesystem.play();
        setTimeout(() => {
            console.log('destroy: ', this.entity);
            this.entity.destroy();
        }, 1000); 
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Test2.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/