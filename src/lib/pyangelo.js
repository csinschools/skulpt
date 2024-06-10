// src/lib/pyangelo.js
//  

// Define the file as a Skulpt Python module
var $builtinmodule = function(name)
{      
    var mod = {};
    
    var canvas = document.getElementById("pyangelo");
    var ctx = canvas.getContext('2d'); 
    
    var _keysUp = {};
    var _keysDown = {};

    var _mouseClicks = [];
    
    var _commands = [];
    var _activeCommands = null;

    var _images = {};
     
    var colours = {};
    // new colours
    Sk.builtins.INDIGO = 23;
    Sk.builtins.DARK_GREY = 24;
    Sk.builtins.DARK_GRAY = 24;
    Sk.builtins.DARK_RED = 25;
    Sk.builtins.DARK_BLUE = 26;
    Sk.builtins.DARK_GREEN = 27;
    Sk.builtins.LIGHT_RED = 28;
    Sk.builtins.LIGHT_BLUE = 29;
    Sk.builtins.LIGHT_GREEN = 30;
    Sk.builtins.LIGHT_GREY = 31;
    Sk.builtins.PINK = 32;

    colours[Sk.builtins.BLACK] = "rgba(0, 0, 0, 1)";
    colours[Sk.builtins.WHITE] = "rgba(255, 255, 255, 1)";
    colours[Sk.builtins.RED] = "rgba(255, 0, 0, 1)";
    colours[Sk.builtins.GREEN] = "rgba(0, 255, 0, 1)";
    colours[Sk.builtins.YELLOW] = "rgba(255, 255, 0, 1)";
    colours[Sk.builtins.VIOLET] = "rgba(255, 0, 255, 1)";
    colours[Sk.builtins.BLUE] = "rgba(0, 0, 255, 1)";
    colours[Sk.builtins.ORANGE] = "rgba(203, 75, 22, 1)";
    colours[Sk.builtins.CYAN] = "rgba(42, 161, 152, 1)";
    colours[Sk.builtins.GREY] = "rgba(127, 127, 127, 1)";
    colours[Sk.builtins.INDIGO] = "rgba(75, 0, 130, 1)";
    colours[Sk.builtins.DARK_GREY] = "rgba(64, 64, 64, 1)";
    colours[Sk.builtins.DARK_RED] = "rgba(64, 0, 0, 1)";
    colours[Sk.builtins.DARK_BLUE] = "rgba(0, 0, 64, 1)";
    colours[Sk.builtins.DARK_GREEN] = "rgba(0, 64, 0, 1)";
    colours[Sk.builtins.LIGHT_RED] = "rgba(192, 0, 0, 1)";
    colours[Sk.builtins.LIGHT_BLUE] = "rgba(0, 0, 192, 1)";
    colours[Sk.builtins.LIGHT_GREEN] = "rgba(0, 192, 0, 1)";
    colours[Sk.builtins.LIGHT_GREY] = "rgba(192, 192, 192, 1)";
    colours[Sk.builtins.PINK] = "rgba(255, 192, 203, 1)";

    mod.width = new Sk.builtin.int_(canvas.width);
    mod.height = new Sk.builtin.int_(canvas.height);
    
    canvas.addEventListener("keydown", _keyDownListener);
    canvas.addEventListener("keyup", _keyUpListener);

    canvas.addEventListener("click", _clickListener, false);
    canvas.addEventListener("mousedown", _mouseDownListener, false);
    canvas.addEventListener("touchstart", _touchStartListener, false);

    canvas.addEventListener("mouseup", _mouseUpListener, false);
    canvas.addEventListener("touchend", _touchEndListener, false);    

    var _mouseDown = [];
    
    ctx.font = "30px Consolas";
       
    startTime = new Date();
        
    Sk.builtins.animationFrameRequest = window.requestAnimationFrame(render);
    
    function _convY(y) {
        return canvas.height - y;
    }
    
    function render(timestamp) {
        
        if (_activeCommands != null)
        {
            while (_activeCommands.length > 0)
            {
                command = _activeCommands.shift();
                
                command[0].call(mod, command[1]);
            }            
        }
        req = window.requestAnimationFrame(render);
        
        // to enable the client to cancel the animation request
        Sk.builtins.animationFrameRequest = req;
        _activeCommands = null;        
    }
    
    mod.timeElapsed = function () {
        endTime = new Date();
        result = (endTime - startTime) / 1000;
        startTime = endTime;
        
        return new Sk.builtin.float_(result);
    }

    function _clearScreen(args) {        
        ctx.fillStyle = args.fillStyle;
        ctx.fillRect(0, 0, mod.width, mod.height);   
    }
    
    function _drawText(args) {
        ctx.fillStyle = args.fillStyle;
        ctx.font = args.font;
        ctx.fillText(args.text, args.x, _convY(args.y));
    }

    function _drawImage(args) {
        ctx.save();
        ctx.globalAlpha = args.opacity;
        ctx.drawImage(args.image, args.x, _convY(args.y) - args.height, args.width, args.height);
        ctx.restore();
    }    

    function _drawRect(args) {
        ctx.lineWidth = args.lineWidth;
        ctx.strokeStyle = args.strokeStyle;
        ctx.beginPath();
        ctx.rect(args.x, _convY(args.y), args.width, -args.height);
        ctx.stroke();        
    }

    function _drawLine(args) {
        ctx.lineWidth = args.lineWidth;
        ctx.strokeStyle = args.strokeStyle;
        ctx.beginPath();
        ctx.moveTo(args.x1, _convY(args.y1))
        ctx.lineTo(args.x2, _convY(args.y2))
        ctx.stroke();        
    }    
    
    function _fillRect(args) {
        ctx.fillStyle = args.fillStyle;
        ctx.fillRect(args.x, _convY(args.y), args.width, -args.height);
    }
    
    function _keyUpListener(e) {
        _keysUp[e.key] = true;    
        delete(_keysDown[e.key]); 
    }
    
    function _keyDownListener(e) {
        _keysDown[e.key] = true;        
        delete(_keysUp[e.key]);         
    }

    function _mouseDownListener(e) {
        var element = canvas;
        var offsetX = 0, offsetY = 0
    
        if (element.offsetParent) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }
    
        x = e.pageX - offsetX;
        y = _convY(e.pageY - offsetY); 
        
        _mouseDown = [x, y];
    }

    function _mouseUpListener(e) {
        _mouseDown = [];
    }    

    function _clickListener(e) {
        console.log("clickelistener:" + e);
        var element = canvas;
        var offsetX = 0, offsetY = 0
    
        if (element.offsetParent) {
          do {
            offsetX += element.offsetLeft;
            offsetY += element.offsetTop;
          } while ((element = element.offsetParent));
        }
    
        x = e.pageX - offsetX;
        y = _convY(e.pageY - offsetY);

        //console.log("clickelistener:" + [x, y]);

        _mouseClicks.push([new Date(), x, y]);
    }

    function _touchStartListener(e) {
        console.log("_touchListener:" + e);
        _mouseDown.push([-1, -1]);
    }    
    function _touchEndListener(e) {
        console.log("_touchListener:" + e);
        _mouseDown = [];
    }      

    function refresh() {
        // clean out the whole the commands queue
        _activeCommands = [..._commands];        
        _commands = [];

        // clear out any mouse click events older than 1 second
        // new events are pushed onto the end, so we just need to 
        // keep removing from the head until the time is below the
        // age threshold
        while (_mouseClicks.length > 0 && (new Date() - _mouseClicks[0][0]) > 100) {
            _mouseClicks.shift();
        }
    }

    mod.overlaps = new Sk.builtin.func((x1, y1, w1, h1, x2, y2, w2, h2) => {
        return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);
    });

    mod.getStringWidth = new Sk.builtin.func((text, font) => {        
        let context = document.createElement('canvas').getContext("2d");
        context.font = font;
        width = context.measureText(text).width;
        return new Sk.builtin.int_(Math.round(width));         
    });

    
    mod.isKeyPressed = new Sk.builtin.func((key) => {
        return new Sk.builtin.bool(key in _keysDown);
    });
    
    mod.isKeyReleased = new Sk.builtin.func((key) => {
        var released = key in _keysUp;        
        if (released)
        {
            delete(_keysUp[key]);     
        }                
        return new Sk.builtin.bool(released);
    });
    
    mod.refresh = new Sk.builtin.func(() => {   
        refresh();     
    });
    
    function getColour(color, defaultCol, b, a) {
        var rgba;
        
        if (typeof(defaultCol) === 'undefined')
        {
            defaultCol = mod.WHITE;
        }
        
        if (typeof(color) === 'undefined')
        {
            rgba = colours[defaultCol];
        }
        else if (color in colours)
        {
            rgba = colours[color];
        }
        else if (typeof (color) === "string") {
            rgba = color;
        }
        else {
            rgba = "rgba(" + color + "," + defaultCol + "," + b + "," + a + ")";
        }            
        return rgba;
    }

    mod.isMouseClicked = new Sk.builtin.func(() => {   
        let clicked =  _mouseClicks.length > 0;
        // clear out mouse clicks queue
        _mouseClicks = [];     

        return new Sk.builtin.bool(clicked);
    });

    mod.isMousePressed = new Sk.builtin.func(() => {   
        return new Sk.builtin.bool(_mouseDown.length > 0);
    });    
    
    // Add the say function to the module
    mod.clearScreen = new Sk.builtin.func((color, g , b, a) => {        
        refresh();
        
        args = {};
        
        if (g !== "undefined")
            args.fillStyle = getColour(color, g, b, a);
        else 
            args.fillStyle = getColour(color, mod.BLACK);

        _commands.push([_clearScreen, args]);
        return new Sk.builtin.none;
    });

    mod.printAt = new Sk.builtin.func((text, col, row, color, g , b, a) => {        
        args = {};
        
        args.font = "20px monospace";      
        
        args.fillStyle = getColour(color);
        
        args.text = text;
        args.x = col * 10;
        args.y = row * 20;
        
        _commands.push([_drawText, args]);
        
        return new Sk.builtin.none;        
    });
       
    mod.drawText = new Sk.builtin.func((text, x, y, font, color, g , b, a) => {        
        args = {};
        
        args.font = "32px Consolas";
        if (typeof (font) === "string") 
        {
            args.font = font;
        }             
        
        args.fillStyle = getColour(color);
        
        args.text = text;
        args.x = x;
        args.y = y;
        args.font = font;
        
        _commands.push([_drawText, args]);
        
        return new Sk.builtin.none;        
    });

    mod.drawImage = new Sk.builtin.func(async (imageURL, x, y, width, height, opacity) => {   
        if (opacity === undefined) {
            opacity = 1.0;
        }
        args = {};
        if (!(imageURL in _images)) {
            var newImage = new Image();
            await new Promise((resolve) => { newImage.onload = resolve; newImage.src = imageURL});
            _images[imageURL] = newImage;
        }

        var image = _images[imageURL];
        args.image = image;
        args.x = x;
        args.y = y;
        args.width = width;
        args.height = height;
        args.opacity = opacity;
               
        _commands.push([_drawImage, args]);
        
        return new Sk.builtin.none;        
    });

    mod.drawLine = new Sk.builtin.func((x1, y1, x2, y2, lineWidth, color, g , b, a) => {
        args = {};
                
        if (typeof(lineWidth) === 'undefined')
        {
            args.lineWidth = "1";
        }
        else
        {
            args.lineWidth = lineWidth;
        }
        args.strokeStyle = getColour(color, g, b, a);
        
        args.x1 = x1;
        args.y1 = y1;
        args.x2 = x2;
        args.y2 = y2;
        
        _commands.push([_drawLine, args]);

        return new Sk.builtin.none;
    });        
    
    mod.drawRect = new Sk.builtin.func((x, y, width, height, lineWidth, color, g , b, a) => {
        args = {};
                
        if (typeof(lineWidth) === 'undefined')
        {
            args.lineWidth = "1";
        }
        else
        {
            args.lineWidth = lineWidth;
        }
        args.strokeStyle = getColour(color);
        
        args.x = x;
        args.y = y;
        args.width = width;
        args.height = height;
        
        _commands.push([_drawRect, args]);

        return new Sk.builtin.none;
    });    
    
    mod.fillRect = new Sk.builtin.func((x, y, width, height, color, g , b, a) => {   
        args = {};
        
        args.fillStyle = getColour(color, g, b, a);
        
        args.x = x;
        args.y = y;
        args.width = width;
        args.height = height;

        _commands.push([_fillRect, args]);

        return new Sk.builtin.none;
    });     
 
    return mod;
}