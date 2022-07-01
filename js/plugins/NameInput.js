//=============================================================================
// NameInput.js
//=============================================================================
/*:
 * @plugindesc 自由名字输入处理
 * @author wangwang Revise by Fanzi
 *
 * @help
 * 帮助的信息
 * 用网页输入代替原本的名字输入
 * 增加文本显示时用“\A[n]”显示角色昵称，“\Q[n]”显示队员昵称
 */
 
function Window_BC() {
    this.initialize.apply(this, arguments);
}
 
(function() {
 
Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;
//初始化
Scene_Name.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
//准备
Scene_Name.prototype.prepare = function(actorId, maxLength) {
    this._actorId = actorId;
    this._maxLength = maxLength;
};
//创建
Scene_Name.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this._actor = $gameActors.actor(this._actorId);
    this.createEditWindow();
    this.createBCWindow();
};
//开始
Scene_Name.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._editWindow.refresh();
};
 
//创建编辑窗口
Scene_Name.prototype.createEditWindow = function() {
    this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
};
 
Scene_Name.prototype.createBCWindow = function() {
 
    var x = this._editWindow.x + this._editWindow.left() + 50;
    var y = this._editWindow.y + 80;
    var width = this._editWindow.charWidth() * this._maxLength;
    var height = this._editWindow.lineHeight();
 
    Graphics._addInput("text",x,y, width,height, this._editWindow.standardFontSize());
    Graphics._input.maxLength = this._maxLength;
    Graphics._input.value = this._actor.name().slice(0, this._maxLength);

    Graphics._addInput2("text",x,y+50, width,height, this._editWindow.standardFontSize());
    Graphics._input2.maxLength = this._maxLength;
    Graphics._input2.value = this._actor.nickname().slice(0, this._maxLength);
 
    this._bcWindow = new Window_BC("确定");
    this._bcWindow.x = this._editWindow.x + this._editWindow.width - this._bcWindow.width;
    this._bcWindow.y = this._editWindow.y +this._editWindow.height;
    this._bcWindow.setHandler('dianji', this.onInputOk.bind(this));
    this.addWindow(this._bcWindow);
 
    this._csWindow = new Window_BC("还原");
    this._csWindow.x = this._editWindow.x + this._editWindow.width - this._bcWindow.width - this._bcWindow.width;
    this._csWindow.y = this._editWindow.y +this._editWindow.height;
    this._csWindow.setHandler('dianji', this.oncs.bind(this));
    this.addWindow(this._csWindow);
};
 
//输入初始化
Scene_Name.prototype.oncs = function() {
    Graphics._input.value = this._actor.name().slice(0, this._maxLength);
    Graphics._input2.value = this._actor.nickname().slice(0, this._maxLength);
};
 
//当输入确定
Scene_Name.prototype.onInputOk = function() {
    var name="" + Graphics._input.value;
    var nickname="" + Graphics._input2.value;
    this._actor.setName(name);
    this._actor.setNickname(nickname);
    this.popScene();
    Graphics._removeInput();
    Graphics._removeInput2();
};
 
//名称编辑窗口
Window_NameEdit.prototype = Object.create(Window_Base.prototype);
Window_NameEdit.prototype.constructor = Window_NameEdit;
//初始化
Window_NameEdit.prototype.initialize = function(actor, maxLength) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    var y = (Graphics.boxHeight - (height + this.fittingHeight(4))) / 2;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._actor = actor;
    this._name = actor.name().slice(0, this._maxLength);
    this._index = this._name.length;
    this._maxLength = maxLength;
    this._defaultName = this._name;
    this.deactivate();
    this.refresh();
    ImageManager.loadFace(actor.faceName());
};
 
//窗口宽
Window_NameEdit.prototype.windowWidth = function() {
    return 480;
};
 
//窗口高
Window_NameEdit.prototype.windowHeight = function() {
    return this.fittingHeight(6);
};
 
//名称
Window_NameEdit.prototype.name = function() {
    return this._name;
};

Window_NameEdit.prototype.nickname = function() {
    return this._nickname;
};
 
//脸宽
Window_NameEdit.prototype.faceWidth = function() {
    return 144;
};
//字符宽
Window_NameEdit.prototype.charWidth = function() {
    var text =  '我';
    return this.textWidth(text);
};
 
//左
Window_NameEdit.prototype.left = function() {
    var nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
};
 
//刷新
Window_NameEdit.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this._actor, 0, (this.fittingHeight(6)-160)/2);
    this.drawText("名字输入处理",160,0,160,'center');
    this.drawText("姓名：",180,65,80,'left');
    this.drawText("昵称：",180,115,80,'left');
    this.drawText("显示昵称：角色库 \\A[n]、队伍 \\Q[n]",160,165,270,'left');
};

//随便写的点击窗口....
Window_BC.prototype = Object.create(Window_Base.prototype);
Window_BC.prototype.constructor = Window_BC;
//初始化
Window_BC.prototype.initialize = function(text) {
    var width = 80;
    var height = this.fittingHeight(1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._handlers = {};
    this._text = '';
    this.setText(text);
};
Window_BC.prototype.standardFontSize = function() {
    return 16;
};
Window_BC.prototype.lineHeight = function() {
    return 20;
};
 
Window_BC.prototype.standardPadding = function() {
    return 16;
};
Window_BC.prototype.textPadding = function() {
    return 0;
};
 
//设置文本
Window_BC.prototype.setText = function(text) {
    if (this._text !== text) {
        this._text = text;
        this.refresh();
    }
};
 
//清除
Window_BC.prototype.clear = function() {
    this.setText('');
};
//刷新
Window_BC.prototype.refresh = function() {
    this.contents.clear();
    this.drawTextEx(this._text, this.textPadding(), 0);
};
 
Window_BC.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.dianji();
};
 
Window_BC.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
};
Window_BC.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
};
Window_BC.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
        this._handlers[symbol]();
    }
};
 
Window_BC.prototype.dianji = function() {
    if (this.isOpen()) {
        if (TouchInput.isTriggered()) {
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            if(x >= 0 && y >= 0 && x < this.width && y < this.height){
                this.callHandler("dianji");
            }
        } 
    } 
};

Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bA\[(\d+)\]/gi, function() {
        return this.actorNickname(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bQ\[(\d+)\]/gi, function() {
        return this.partyMemberNickname(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

Window_Base.prototype.actorNickname = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.nickname() : '';
};

Window_Base.prototype.partyMemberNickname = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.nickname() : '';
};

Graphics._createAllElements = function() {
    this._createErrorPrinter();
    this._createCanvas();
    this._createVideo();
    this._createUpperCanvas();
    this._createRenderer();
    this._createFPSMeter();
    this._createModeBox();
    this._createGameFontLoader();
    this._createInput();
    this._createInput2();
};
 
Graphics._updateAllElements = function() {
    this._updateRealScale();
    this._updateErrorPrinter();
    this._updateCanvas();
    this._updateVideo();
    this._updateUpperCanvas();
    this._updateRenderer();
    this._updateInput();
    this._updateInput2();
    this._paintUpperCanvas();
};

Graphics._createInput = function() {
    this._input = document.createElement("input");
    this._input.id = 'Input';
    this._input.type ="text";
    this._input._sx ={};
    var sx = this._input._sx;
    sx.xs = false;
    sx.x= 0;
    sx.y=0;
    sx.width =100;
    sx.height= 20;
    sx.fontSize = 18;
};

Graphics._createInput2 = function() {
    this._input2 = document.createElement("input");
    this._input2.id = 'Input';
    this._input2.type ="text";
    this._input2._sx ={};
    var sx2 = this._input2._sx;
    sx2.xs = false;
    sx2.x= 0;
    sx2.y=0;
    sx2.width =100;
    sx2.height= 20;
    sx2.fontSize = 18;
};

Graphics._addInput = function(type,x,y,width,height,fontSize) {                
    this._input.type = type || "text";
    var sx = this._input._sx;
    sx.x= x;
    sx.y= y;
    sx.width = width|| 100;
    sx.height= height|| 20;
    sx.fontSize = fontSize || 18;
    this._updateInput();
    sx.xs = true;
    document.body.appendChild(this._input);
};

Graphics._addInput2 = function(type,x,y,width,height,fontSize) {                
    this._input2.type = type || "text";
    var sx2 = this._input2._sx;
    sx2.x= x;
    sx2.y= y;
    sx2.width = width|| 100;
    sx2.height= height|| 20;
    sx2.fontSize = fontSize || 18;
    this._updateInput2();
    sx2.xs = true;
    document.body.appendChild(this._input2);
};

Graphics._removeInput = function() {
    this._input.remove();
    this._input.value = null;
    this._input._xs = false;
};

Graphics._removeInput2 = function() {
    this._input2.remove();
    this._input2.value = null;
    this._input2._xs = false;
};

Graphics._updateInput =function () {   
    this._input.style.zIndex = 12;
    var sx = this._input._sx;
    var x = sx.x  * this._realScale + (window.innerWidth - this._width * this._realScale) / 2;
    var y = sx.y  * this._realScale + (window.innerHeight - this._height * this._realScale) / 2;
    var width = sx.width * this._realScale;
    var height = sx.height * this._realScale;
    var fontSize = sx.fontSize * this._realScale;
    this._input.style.position = 'absolute';
    this._input.style.margin = 'auto';
    this._input.style.top = y  + 'px';
    this._input.style.left = x  + 'px';
    this._input.style.width = width + 'px';
    this._input.style.height = height + 'px';
    this._input.style.fontSize = fontSize + 'px';
};

Graphics._updateInput2 =function () {   
    this._input2.style.zIndex = 12;
    var sx2 = this._input2._sx;
    var x2 = sx2.x  * this._realScale + (window.innerWidth - this._width * this._realScale) / 2;
    var y2 = sx2.y  * this._realScale + (window.innerHeight - this._height * this._realScale) / 2;
    var width2 = sx2.width * this._realScale;
    var height2 = sx2.height * this._realScale;
    var fontSize2 = sx2.fontSize * this._realScale;
    this._input2.style.position = 'absolute';
    this._input2.style.margin = 'auto';
    this._input2.style.top = y2  + 'px';
    this._input2.style.left = x2  + 'px';
    this._input2.style.width = width2 + 'px';
    this._input2.style.height = height2 + 'px';
    this._input2.style.fontSize = fontSize2 + 'px';
};

//防止默认

Input._onKeyDown = function(event) {
    if (this._shouldPreventDefault(event.keyCode)) {
        if (Graphics && Graphics._input && Graphics._input._sx && Graphics._input._sx.xs){
        }else {
            event.preventDefault();
        }
        if (Graphics && Graphics._input2 && Graphics._input2._sx && Graphics._input2._sx.xs){
        }else {
            event.preventDefault();
        }
    }
    if (event.keyCode === 144) {
        this.clear();
    }
    var buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
        this._currentState[buttonName] = true;
    }
};

})();