var ScaleEntities = pc.createScript('scaleEntities');

// initialize code called once per entity
ScaleEntities.prototype.initialize = function() {
    var t = pc.app.root.findByName('BOX');
    var i = t.clone();
    i.setPosition(new pc.Vec3(2, 0.5, 0));
    pc.app.root.addChild(i);
    
    var t2 = pc.app.root.findByName('BOX');
    var i2 = t2.clone();
    i2.setPosition(new pc.Vec3(2, 0.5, 1.5));
    pc.app.root.addChild(i2);
};

// update code called every frame
ScaleEntities.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
// ScaleEntities.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/