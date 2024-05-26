var $builtinmodule = function(name) {
    var mod = {};

    var meshes = [];

    mod.addObject = new Sk.builtin.func(async (bObj) => { 
        addObject(bObj);
    });   
    mod.resetBabylon = new Sk.builtin.func(async () => { 
        resetBabylon();
    });

    mod.beginAnimation = new Sk.builtin.func(async (bObjName, startFrame, endFrame, loop) => { 
        beginAnimation(bObjName, startFrame, endFrame, loop);
    });    
    mod.startBabylon = new Sk.builtin.func(async () => { 
        startBabylon();
    });
    
    mod.endBabylon = new Sk.builtin.func(async () => { 
    });
    return mod;
}      