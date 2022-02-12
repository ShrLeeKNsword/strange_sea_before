//==========================================================================
// EliMZ_MobileControls.js
//==========================================================================

/*:
@target MZ
@base EliMZ_Book

@plugindesc 响应式虚拟按键！
@author Hakuen Studio | 汉化：硕明云书
@url https://hakuenstudio.itch.io/

@help
============================================================================
介绍
============================================================================

该插件仍处于测试版。
他为移动设备添加了响应式屏幕按钮，可以
模拟键盘按键或脚本调用。
响应式意味着按钮的大小取决于设备
屏幕尺寸（不是游戏分辨率）。

============================================================================
特征
============================================================================
已经完成了：

● 添加屏幕按钮
● 响应式按钮：基于设备百分比的大小和位置
屏幕尺寸。
● 在黑条上呈现。
● 重现键盘按钮或脚本调用
● 三种方向性：SinglePad、Joystick、Arrow Pad
● 支持对角线！
● 是否隐藏消息
● 每个场景启用它们
● 已按和未按的图像（冷热）

待办事项：
● 淡入/淡出按钮
● 振动
● 自定义场景通过拖放配置按钮位置。
● 另一种方向键样式。
● 还有什么？
============================================================================
如何使用
============================================================================

将您的按钮图像放在 "screen_controls"文件夹中。


============================================================================
使用条款
============================================================================

https://www.hakuenstudio.com/rpg-maker/terms-of-use

============================================================================
链接
============================================================================

Facebook - https://www.facebook.com/hakuenstudio
Instagram - https://www.instagram.com/hakuenstudio
Twitter - https://twitter.com/hakuen_studio

============================================================================
更新日志
============================================================================
版本 1.0.0 - 00/00/2020
- 插件发布！

@param disableScreenMove
@text 禁用屏幕移动
@type boolean
@desc 禁用单击/触摸屏幕上的任意位置以移动。
@default true

@param disableDoubleTouchMenu
@text 禁用双击菜单
@type boolean
@desc 禁用双击或右键单击打开菜单功能。
@default false

@param hideOnMessage
@text 隐藏消息
@type boolean
@desc 如果您想隐藏消息上的按钮，则为真。
@default false

@param dPadType
@text 方向键类型
@type select
@option arrows
@option singlePad
@option joystick
@desc Choose your directional pad type.
@default singlePad

@param arrowPad
@text 箭头垫
@type struct<arrowPad>[]
@desc Separated buttons that represent each direction to move with their own images.
@default
@parent dPadType

@param singlePad
@text 单垫
@type struct<singlePadST>
@desc A single image that can handle the player movement/directions.
@default
@parent dPadType

@param joystickPad
@text 操纵杆
@type struct<joystickST>
@desc A joystick pad that moves the player along with a pad inside an area.
The pad follows the fingers/mouse on screen.
@default
@parent dPadType

@param buttons
@text 纽扣
@type struct<buttonsST>[]
@desc Configure here all buttons that will represent keyboard keys.
@default 

*/

/*~struct~arrowPad:

@param scenes
@text 允许的场景
@type note
@desc 把这个按钮会出现的场景放在这里。
它区分大小写。
@default "Scene_Map, Scene_Menu"

@param img
@text 图片
@type file
@dir img/screen_controls
@desc 用于按钮的图像。
热图像必须与最后的“_hot”具有相同的文件名。
@default 

@param width
@text 尺寸
@type number
@min 0
@max 100
@desc 根据设备屏幕大小（%）设置按钮大小。
@default 5

@param verticalPos
@text 垂直位置
@type select
@option top
@option bottom
@desc 按钮将在顶部或底部屏幕开始？
@default bottom

@param y
@text Offset Y
@type text
@desc If top, the offset will push it down. 
If bottom, the offset will push it up.
@default 0
@parent verticalPos

@param horizontalPos
@text Horizontal Position
@type select
@option left
@option right
@desc Button will start at the left or right position on the screen?
@default left

@param x
@text Offset X
@type text
@desc If left, the offset will push it to the right. 
If right, the offset will push it to the left.
@default 0
@parent horizontalPos

@param key
@text Keyboard key
@type select
@option script @option leftarrow @option uparrow @option rightarrow @option downarrow
@desc Put the keyboard letter here.
If you want to use a script choose "script".
@default leftarrow

@param scriptIn
@text Script In
@type note
@desc The script call to run when button is pressed.
@default 

@param scriptOut
@text Script Out
@type note
@desc The script call to run when button is not pressed anymore.
@default

*/

/*~struct~singlePadST:

@param scenes
@text Allowed Scenes
@type note
@desc Allowed scenes
@default "Scene_Map, Scene_Menu"

@param img
@text Joystick pad
@type file
@dir img/screen_controls
@desc The image used for the pad.
@default 

@param width
@text Size
@type number
@min 0
@max 100
@desc Set the size of the button according to the device screen size(%).
Default is 4%
@default 4

@param y
@text Offset Y
@type number
@min 0
@max 100
@desc Set an offset Y using a % of the device screen.
@default 0

@param x
@text Offset X
@type number
@min 0
@max 100
@desc Set an offset X using a % of the device screen.
@default 0

*/

/*~struct~joystickST:

@param scenes
@text Allowed Scenes
@type note
@desc Allowed scenes
@default "Scene_Map, Scene_Menu"

@param imgBack
@text Joystick background
@type file
@dir img/screen_controls
@desc The image used for the background.
@default 

@param img
@text Joystick pad
@type file
@dir img/screen_controls
@desc The image used for the pad.
@default

@param backWidth
@text Background size
@type number
@min 0
@max 100
@desc Set the background size based on the screen area percent.
Default is 20%
@default 20

@param padWidth
@text Pad size
@type number
@min 0
@max 100
@desc Set the pad size based on the screen area percent.
Default is 4%
@default 4

@param x
@text Offset X
@type number
@min 0
@max 100
@desc The X offset according to the % of the screen.
Higher value to push it right. Default is 2%
@default 2

@param y
@text Offset Y
@type number
@min 0
@max 100
@desc The Y offset according to the % of the screen.
Higher value to push it up. Default is 2%
@default 2

*/

/*~struct~buttonsST:

@param scenes
@text Allowed Scenes
@type note
@desc Put here the scenes that this button will appear.
@default "Scene_Map, Scene_Menu"

@param img
@text Image
@type file
@dir img/screen_controls
@desc The image used for the button.
@default 

@param width
@text Size
@type number
@min 0
@max 100
@desc Set the size according to the screen area percent.
@default 5

@param verticalPos
@text Vertical Position
@type select
@option top
@option bottom
@desc Button will start at the top or bottom screen?
@default top

@param y
@text Offset Y
@type number
@min 0
@max 100
@desc If top, the offset will push it down. 
If bottom, the offset will push it up.
@default 0
@parent verticalPos

@param horizontalPos
@text Horizontal Position
@type select
@option left
@option right
@desc Button will start at the left or right position on the screen?
@default left

@param x
@text Offset X
@type number
@min 0
@max 100
@desc If left, the offset will push it to the right. 
If right, the offset will push it to the left.
@default 0
@parent horizontalPos

@param key
@text Keyboard key
@type select
@option script @option a @option b @option c @option d @option e @option f @option g @option h @option i @option j @option k @option l @option m @option n @option o @option p @option q @option r @option s @option t @option u @option v @option w @option x @option y @option z @option 0 @option 1 @option 2 @option 3 @option 4 @option 5 @option 6 @option 7 @option 8 @option 9 @option backspace @option tab @option enter @option shift @option ctrl @option alt @option pausebreak @option capslock @option esc @option space @option pageup @option pagedown @option end @option home @option leftarrow @option uparrow @option rightarrow @option downarrow @option insert @option delete @option leftwindowkey @option rightwindowkey @option selectkey @option numpad0 @option numpad1 @option numpad2 @option numpad3 @option numpad4 @option numpad5 @option numpad6 @option numpad7 @option numpad8 @option numpad9 @option multiply" @option add @option subtract @option decimalpoint @option divide @option f1 @option f2 @option f3 @option f4 @option f5 @option f6 @option f7 @option f8 @option f9 @option f10 @option f11 @option f12 @option numlock @option scrolllock @option semicolon @option equalsign @option comma @option dash @option period @option forwardslash @option graveaccent @option openbracket @option backslash @option closebracket @option singlequote
@desc Put the keyboard letter here.
If you want to use a script choose "script".
@default z

@param scriptIn
@text Script In
@type note
@desc The script call to run when button is pressed.
@default 

@param scriptOut
@text Script Out
@type note
@desc The script call to run when button is not pressed anymore.
@default

@param vibrate
@text Vibration
@type number
@desc The vibration in miliseconds. Leave it 0 for no vibration.
Not working yet.
@default 0

*/

"use strict"

var Eli = Eli || {};
var Imported = Imported || {};
Imported.Eli_MobileControls = true;

/* ========================================================================== */
/*                                    ALERT                                   */
/* ========================================================================== */

{

    const installWarning = `You must have installed the EliMZ_Book plugin above all Eli plugins.
Please download it for free.`
    const pluginName = (() => {
        const url = String(document.currentScript._url);
        const start = url.indexOf('Eli');
        const end = url.length - 3;
        const pluginName = url.substring(start, end);

        return pluginName;
    })();
    const requiredVersion = ['3','0','0']
    const updateWarning = `${pluginName} needs an updated version of EliMZ_Book.
Please download it for free.`

    function callEliBook(){
        window.open('https://hakuenstudio.itch.io/')
    };
    
    function needInstallBook() {
        if(!Eli.alert){

            if(window.confirm(installWarning)) callEliBook();
            Eli.alert = true;
        }
    };

    function needUpdateBook() {
        if(!Eli.alert){

            if(window.confirm(updateWarning)) callEliBook();
            Eli.alert = true;
        }
    };
    
    if(!Imported.Eli_Book) needInstallBook();
    if(Eli.Book.Version < requiredVersion) needUpdateBook();
     
}

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */
{

const controlsPath = "img/screen_controls/"

Eli.MobileControls = {

    Button: class {

        constructor(buttonParameter){
            this.parameters = buttonParameter;
            this.element = null;
            this.active = false;
            this.initialize();
        }
    
        initialize(){
            this.createElement();
            this.setAttributes();
            this.setKeyboardKey();
            this.setStyle();
            this.setListeners();
        }

        createElement(){
            this.element = document.createElement('img');
        }

        setAttributes(){
            const img = this.element;
            const button = this.parameters;
            const imgCold = `${controlsPath}${button.img}.png`
            const imgHot = `${controlsPath}${button.img}_hot.png`

            img.src = imgCold;
            img.draggable = false;
            img.classList.add("Button")
            img.dataset.coldImg = imgCold;
            img.dataset.hotImg = imgHot;
        }

        setKeyboardKey(){
            if(this.isScript()){
                this.element.dataset.scriptIn = this.parameters.scriptIn;
                this.element.dataset.scriptOut = this.parameters.scriptOut
            }else{
                const keyName = this.parameters.key.toLowerCase()
                const key = Input.keyMapper[(Input.keyBoardCodes[keyName])]
                this.element.dataset.key = key
            }
        }

        setStyle(){
            const img = this.element;
            img.style.zIndex = "11";
            img.style.position = "fixed";
            img.style.maxWidth = "100%";
            img.style.width = `${this.parameters.width}vw`
            img.style.height = `auto`;
            img.style.opacity = "0";
        }

        setCold(){
            this.element.src = this.element.dataset.coldImg;
        }

        setHot(){
            this.element.src = this.element.dataset.hotImg;
        }

        hide(){
            // const opacity = "0";
            // this.element.style.opacity = opacity;
            this.element.style.display = "none";
        }

        show(){
            // const opacity = "1";
            // this.element.style.opacity = opacity;   
            this.element.style.display = "";
            this.element.style.opacity = "1"
        }

        activate(){
            this.active = true;
        }

        deactivate(){
            this.active = false;
            this.resetInput();
            this.setCold();
        }

        isActive(){
            return this.active;
        }

        setListeners(){
            this.element.addEventListener("load", this.onLoad.bind(this), {once: true})
            if(Utils.isMobileDevice()){
                this.setTouchListeners();
            }else{
                this.setMouseListeners();
            }
    
        }

        onLoad(ev){
            this.setPosition();
        }

        setPosition(){  
            const {verticalPos, horizontalPos, x, y} = this.parameters;
            this.element.style[verticalPos] = `${y}vh`;
            this.element.style[horizontalPos] = `${x}vw`;
        }
    
        setTouchListeners(){
            this.element.addEventListener("touchstart", this.pressButton.bind(this));
            this.element.addEventListener("touchmove", this.pressButton.bind(this));
            this.element.addEventListener("touchcancel", this.clearButton.bind(this));
            this.element.addEventListener("touchend", this.clearButton.bind(this));
        }
    
        setMouseListeners(){
            this.element.addEventListener("mousedown", this.pressButton.bind(this));
            this.element.addEventListener("mouseleave", this.clearButton.bind(this));
            this.element.addEventListener("mouseup", this.clearButton.bind(this));
        }

        pressButton(ev){
            ev.preventDefault();
            if(!this.isActive()) return;
            this.setHot();
            this.setInput();
        }

        setInput(){
            if(this.isScript()){
                eval(this.element.dataset.scriptIn)
            }else{
                const key = this.element.dataset.key;
                Input._currentState[key] = true
            }
        }

        isScript(){
            return this.parameters.key === "script";
        }
    
        clearButton(ev){
            ev.preventDefault();
            if(!this.isActive()) return;
            this.resetInput();
            this.setCold();
        }

        resetInput(){
            if(this.isScript()){
                eval(this.element.dataset.scriptOut)
            }else{
                const key = this.element.dataset.key
                Input._currentState[key] = false
            }
        }


    },

    SinglePad: class {

        constructor(dpadParameters){
            this.parameters = dpadParameters;
            this.element = null;
            this.active = false;
            this.area = {
                up_left:    null,
                up:         null,
                up_right:   null,

                left:       null,
                center:     null,
                right:      null,
                
                down_left:  null,
                down:       null,
                down_right: null,

                bounds:    null
            };
            this.isBeingTouched = false;
            this.touch = null;
            this.dragPos = {x1:0, x2:0, y1:0, y2:0}
            this.initialize();
        }
    
        initialize(){
            this.createElement();
            this.setAttributes();
            this.setStyle();
            this.setListeners();
        }
    
        createElement(){
            this.element = document.createElement('img');
        }
    
        setAttributes(){
            const img = this.element;
            const imgCold = `${controlsPath}${this.parameters.img}.png`;
            const imgHot = `${controlsPath}${this.parameters.img}_hot.png`;
    
            img.src = imgCold;
            img.draggable = false;
            img.classList.add("SingleDpad")
            img.dataset.imgCold = imgCold;
            img.dataset.imgHot = imgHot;
        }
    
        setStyle(){
            const img = this.element;
            img.style.zIndex = "11";
            img.style.position = "fixed";
            img.style.maxWidth = "100%";
            img.style.width = `${this.parameters.width}vw`
            img.style.height = `auto`;
            img.style.opacity = "0";
        }

        setCold(){
            this.element.src = this.element.dataset.imgCold;
        }

        setHot(){
            this.element.src = this.element.dataset.imgHot;
        }

        hide(){
            // const opacity = "0";
            // this.element.style.opacity = opacity;
            this.element.style.display = "none";  
        }

        show(){
            // const opacity = "1";
            // this.element.style.opacity = opacity;
            this.element.style.display = "";  
            this.element.style.opacity = "1"
        }

        activate(){
            this.active = true;
        }

        deactivate(){
            this.active = false;
            this.setCold();
            this.resetTouch();
            this.resetMoveInput();
        }

        isActive(){
            return this.active;
        }
    
        setListeners(){
            this.element.addEventListener("load", this.onLoad.bind(this), {once: true});

            if(Utils.isMobileDevice()){
                this.setTouchListeners()
            }else{
                this.setMouseListeners()
            }
        }

        setTouchListeners(){
            this.element.addEventListener("touchstart", this.startMovementTouch.bind(this));
            this.element.addEventListener("touchmove", this.keepMovementTouch.bind(this));
            this.element.addEventListener("touchend", this.clear.bind(this));
            this.element.addEventListener("touchcancel", this.clear.bind(this));
        }

        setMouseListeners(){
            this.element.addEventListener("pointerdown", this.startMovementMouse.bind(this));
            this.element.addEventListener("pointermove", this.keepMovementMouse.bind(this));
            this.element.addEventListener("pointerup", this.clear.bind(this));
            this.element.addEventListener("pointerleave", this.clear.bind(this));
        }

        onLoad(ev){
            this.setPosition();
            this.createArea(ev);
        }

        setPosition(){
            const img = this.element;
            const posY = 100 - EliBook.ruleOf3(window.innerHeight, 100, img.height) - this.parameters.y;
            const posX = this.parameters.x;

            img.style.top = `${posY}vh`
            img.style.left = `${posX}vw`;
        }
    
        createArea(){
            const target = this.element;
            const width = target.width / 3;
            const height = target.height / 3;

            if(Utils.isMobileDevice()){
                var baseX = target.offsetLeft;
                var baseY = target.offsetTop;
            }else{
                var baseX = target.x;
                var baseY = target.y;
            }
            
            const x1 = baseX;
            const x2 = baseX + width;
            const x3 = baseX + (width*2);

            const y1 = baseY;
            const y2 = baseY + height;
            const y3 = baseY + (height*2);

            this.area = {
                up_left:    new Rectangle(x1, y1, width, height),
                up:         new Rectangle(x2, y1, width, height),
                up_right:   new Rectangle(x3, y1, width, height),

                left:       new Rectangle(x1, y2, width, height),
                center:     new Rectangle(x2, y2, width, height),
                right:      new Rectangle(x3, y2, width, height),
                
                down_left:  new Rectangle(x1, y3, width, height),
                down:       new Rectangle(x2, y3, width, height),
                down_right: new Rectangle(x3, y3, width, height),

                bounds: new Rectangle(x1, y1, target.width, target.height)
            }

        }

        getLastTouch(ev){
            const maxLenght = Math.max(0, ev.touches.length-1);
            const touch = ev.touches[maxLenght];

            return touch;
        }

        startMovementTouch(ev){
            this.touch = this.getLastTouch(ev);

            const x = this.touch.clientX;
            const y = this.touch.clientY;
            this.setHot();
            this.setInput(x, y);
        }

        keepMovementTouch(ev){
            for (const touch of ev.changedTouches) {
                
                if(touch.identifier === this.touch.identifier){
                    const x = touch.clientX;
                    const y = touch.clientY;

                    if(this.inputDirection(x, y, "bounds")){
                        this.setHot();
                        this.setInput(x, y);
                    }else{
                        this.clear(ev);
                    }
                    break;
                }
            }
        }

        startMovementMouse(ev){
            const x = ev.clientX;
            const y = ev.clientY;

            this.setHot();
            this.setInput(x, y);          
            this.isBeingTouched = true;
        }

        keepMovementMouse(ev){
            if(this.isBeingTouched){
                const x = ev.clientX;
                const y = ev.clientY;

                this.setHot();
                this.setInput(x, y);
            }
        }

        setInput(x, y){
            this.checkDownInput(x, y);
            this.checkLeftInput(x, y);
            this.checkRightInput(x, y);
            this.checkUpInput(x, y);
        }

        checkDownInput(x, y){
            Input._currentState['down'] = this.inputDirection(x, y, 'down') || 
                this.inputDirection(x, y, 'down_right') || 
                this.inputDirection(x, y, 'down_left');
        }

        checkUpInput(x, y){
            Input._currentState['up'] = this.inputDirection(x, y, 'up') || 
                this.inputDirection(x, y, 'up_right') || 
                this.inputDirection(x, y, 'up_left');
        }

        checkLeftInput(x, y){
            Input._currentState['left'] = this.inputDirection(x, y, 'left') || 
                this.inputDirection(x, y, 'up_left') || 
                this.inputDirection(x, y, 'down_left');
        }

        checkRightInput(x, y){
            Input._currentState['right'] = this.inputDirection(x, y, 'right') || 
                this.inputDirection(x, y, 'down_right') || 
                this.inputDirection(x, y, 'up_right');
        }

        inputDirection(x, y, direction){
            const area = this.area[direction];

            return area.contains(x, y);
        }

        setInputIf(x, y){
            if(this.inputDirection(x, y, 'up')){
                console.log("up")
                this.setCurrentStateUp();
                
            }else if(this.inputDirection(x, y, 'down')){
                console.log("down")
                this.setCurrentStateDown();
                
            }else if(this.inputDirection(x, y, 'left')){
                console.log("left")
                this.setCurrentStateLeft();
                
            }else if(this.inputDirection(x, y, 'right')){
                console.log("right")
                this.setCurrentStateRight();

            }else if(this.inputDirection(x, y, 'up_left')){
                console.log("up_left")
                this.setCurrentStateUpLeft();

            }else if(this.inputDirection(x, y, 'up_right')){
                console.log("up_right")
                this.setCurrentStateUpRight();

            }else if(this.inputDirection(x, y, 'down_left')){
                console.log("down_left")
                this.setCurrentStateDownLeft();

            }else if(this.inputDirection(x, y, 'down_right')){
                console.log("down_right")
                this.setCurrentStateDownRight();
            }else{

            }
        }

        setCurrentStateUp(){
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = false;
            Input._currentState['up'] = true;
        }

        setCurrentStateDown(){
            Input._currentState['up'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = true;
        }

        setCurrentStateLeft(){
            Input._currentState['up'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
        }

        setCurrentStateRight(){
            Input._currentState['up'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = true;
        }

        setCurrentStateUpLeft(){
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
            Input._currentState['up'] = true;
        }

        setCurrentStateUpRight(){
            Input._currentState['left'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = true;
            Input._currentState['up'] = true;
        }

        setCurrentStateDownLeft(){
            Input._currentState['up'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
            Input._currentState['down'] = true;
        }

        setCurrentStateDownRight(){
            Input._currentState['up'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = true;
            Input._currentState['right'] = true;
        }
    
        clear(ev){
            this.setCold();
            this.resetTouch();
            this.resetMoveInput();
        }

        resetTouch(){
            this.isBeingTouched = false;
            this.touch = null;
        }

        resetMoveInput(){
            Input._currentState['up'] = false;
            Input._currentState['down'] = false;
            Input._currentState['left'] = false;
            Input._currentState['right'] = false;
        }
    },

    Joystick: class {

        constructor(joystickParameters){
            this.parameters = joystickParameters;
            this.backElement = null;
            this.frontElement = null;
            this.active = false;
            this.area = {
                up_left:    null,
                up:         null,
                up_right:   null,

                left:       null,
                center:     null,
                right:      null,
                
                down_left:  null,
                down:       null,
                down_right: null,

                bounds:    null
            };
            this.isBeingTouched = false
            this.touch = null;
            this.dragPos = {x1:0, x2:0, y1:0, y2:0}
            this.initialize();
        }
    
        initialize(){
            this.createElements();
            this.setAttributes()
            this.setStyle()
            this.setListeners();
        }
    
        createElements(){
            this.backElement = document.createElement('img');
            this.frontElement = document.createElement('img');
        }

        setAttributes(){
            this.setBackAttributes();
            this.setFrontAttributes();
        }
    
        setBackAttributes(){
            const img = this.backElement;
            const imgCold = `${controlsPath}${this.parameters.imgBack}.png`;
            const imgHot = `${controlsPath}${this.parameters.imgBack}_hot.png`;

            img.src = imgCold;
            img.draggable = false;
            img.classList.add("Joystick")
            img.dataset.imgCold = imgCold;
            img.dataset.imgHot = imgHot;
        }

        setFrontAttributes(){
            const img = this.frontElement;
            const imgCold = `${controlsPath}${this.parameters.img}.png`;
            const imgHot = `${controlsPath}${this.parameters.img}_hot.png`;

            img.src = imgCold;
            img.draggable = false;
            img.classList.add("Joystick")
            img.dataset.imgCold = imgCold;
            img.dataset.imgHot = imgHot;
        }

        setStyle(){
            this.setBackStyle()
            this.setFrontStyle()
        }
    
        setBackStyle(){
            const img = this.backElement;

            img.style.zIndex = "11";
            img.style.position = "fixed";
            img.style.maxWidth = "100%";
            img.style.width = `${this.parameters.backWidth}vw`
            img.style.height = `auto`;
            img.style.opacity = "0";
        }

        setFrontStyle(){
            const img = this.frontElement;

            img.style.zIndex = "11";
            img.style.position = "fixed";
            img.style.maxWidth = "100%";
            img.style.width = `${this.parameters.padWidth}vw`
            img.style.height = `auto`;
            img.style.opacity = "0";
        }

        setCold(){
            this.backElement.src = this.backElement.dataset.imgCold;
            this.frontElement.src = this.frontElement.dataset.imgCold;
        }

        setHot(){
            this.backElement.src = this.backElement.dataset.imgHot;
            this.frontElement.src = this.frontElement.dataset.imgHot;
        }

        hide(){
            // const opacity = "0";
            // this.backElement.style.opacity = opacity;
            // this.frontElement.style.opacity = opacity;
            this.backElement.style.display = "none" 
            this.frontElement.style.display = "none" 
        }

        show(){
            // const opacity = "1";
            // this.backElement.style.opacity = opacity;
            // this.frontElement.style.opacity = opacity;
            this.backElement.style.display = "" 
            this.frontElement.style.display = "" 
            this.backElement.style.opacity = "1"
            this.frontElement.style.opacity = "1"
        }

        activate(){
            this.active = true;
        }

        deactivate(){
            this.active = false;
            this.setCold();
            this.resetTouch();
            this.setFrontToOrigin();
            this.resetMoveInput();
        }

        isActive(){
            return this.active;
        }
    
        setListeners(){
            this.setLoadListeners();
            if(Utils.isMobileDevice()){
                this.setTouchListeners();
            }else{
                this.setMouseListeners();
            }
        }

        setLoadListeners(){
            this.backElement.addEventListener("load", this.onBackLoad.bind(this), {once: true});
            // Added it here again, because sometimes it was not loading at all o.O
            setTimeout(this.frontElement.addEventListener("load", this.onFrontLoad.bind(this), {once: true}), 3000); 
            
        }

        setTouchListeners(){
            this.frontElement.addEventListener("touchstart", this.startMovementTouch.bind(this));
            this.frontElement.addEventListener("touchmove", this.keepMovementTouch.bind(this));
            this.frontElement.addEventListener("touchend", this.clear.bind(this));
            this.frontElement.addEventListener("touchcancel", this.clear.bind(this));
        }

        setMouseListeners(){
            this.frontElement.addEventListener("pointerdown", this.startMovementMouse.bind(this));
            this.frontElement.addEventListener("pointermove", this.keepMovementMouse.bind(this));
            this.frontElement.addEventListener("pointerup", this.clear.bind(this));
            this.frontElement.addEventListener("pointerleave", this.clear.bind(this));
            this.frontElement.addEventListener("pointerout", this.clear.bind(this));
        }

        onBackLoad(ev){
            this.setBackPosition();
            this.createArea(ev);
            // Put it here because sometimes the front has loaded before the back.
            // this.frontElement.addEventListener("load", this.onFrontLoad.bind(this), {once: true}); 
        }

        setBackPosition(){
            const img = this.backElement;
            const posY = 100 - EliBook.ruleOf3(window.innerHeight, 100, img.height) - this.parameters.y;
            const posX = this.parameters.x;

            img.style.top = `${posY}vh`
            img.style.left = `${posX}vw`;
        }

        createArea(){
            const target = this.backElement;

            const width = target.width / 3;
            const height = target.height / 3;

            if(Utils.isMobileDevice()){
                var baseX = target.offsetLeft;
                var baseY = target.offsetTop;
            }else{
                var baseX = target.x;
                var baseY = target.y;
            }
            
            const x1 = baseX;
            const x2 = baseX + width;
            const x3 = baseX + (width*2);

            const y1 = baseY;
            const y2 = baseY + height;
            const y3 = baseY + (height*2);

            this.area = {
                up_left:    new Rectangle(x1, y1, width, height),
                up:         new Rectangle(x2, y1, width, height),
                up_right:   new Rectangle(x3, y1, width, height),

                left:       new Rectangle(x1, y2, width, height),
                center:     new Rectangle(x2, y2, width, height),
                right:      new Rectangle(x3, y2, width, height),
                
                down_left:  new Rectangle(x1, y3, width, height),
                down:       new Rectangle(x2, y3, width, height),
                down_right: new Rectangle(x3, y3, width, height),

                bounds: new Rectangle(x1, y1, target.width, target.height),
            }
        }

        onFrontLoad(ev){
            this.setFrontPosition();
        }

        setFrontPosition(){
            const img = this.frontElement;
            const centerArea = this.area.center;
            const xArea = centerArea.x + centerArea.width / 6;
            const yArea = centerArea.y + centerArea.height / 6;
            const y = EliBook.ruleOf3(window.innerHeight, 100, yArea);
            const x = EliBook.ruleOf3(window.innerWidth, 100, xArea);
            console.log(x, y)
            img.style.top = `${y}vh`
            img.style.left = `${x}vw`
            this.originY = img.style.top
            this.originX = img.style.left
        }
    
        startDrag(x, y){
            this.dragPos = {x1:0, x2:0, y1:0, y2:0}
            this.dragPos.x2 = x;
            this.dragPos.y2 = y;
        }

        followPointer(x, y, img){
            const bounds = this.area.bounds;
            const minY = bounds.top;
            const maxY = (bounds.bottom - this.frontElement.height);
            const minX = bounds.left;
            const maxX = (bounds.right - this.frontElement.width);

            this.dragPos.x1 = this.dragPos.x2 - x;
            this.dragPos.y1 = this.dragPos.y2 - y;
            this.dragPos.x2 = x;
            this.dragPos.y2 = y;

            img.style.top = (img.offsetTop - this.dragPos.y1).clamp(minY, maxY) + "px";
            img.style.left = (img.offsetLeft - this.dragPos.x1).clamp(minX, maxX) + "px";
        }

        getLastTouch(ev){
            const maxLenght = Math.max(0, ev.touches.length-1);
            const touch = ev.touches[maxLenght];

            return touch;
        }

        startMovementTouch(ev){
            this.touch = this.getLastTouch(ev);

            const x = this.touch.clientX;
            const y = this.touch.clientY;

            this.setHot();
            this.startDrag(x, y, this.frontElement);
            this.followPointer(x, y, this.frontElement);
            this.setInput(x, y);
        }

        keepMovementTouch(ev){
            for (const touch of ev.changedTouches) {
                
                if(touch.identifier === this.touch.identifier){
                    const x = touch.clientX;
                    const y = touch.clientY;

                    if(this.inputDirection(x, y, "bounds")){
                        this.setHot();
                        this.startDrag(x, y, this.frontElement);
                        this.followPointer(x, y, this.frontElement);
                        this.setInput(x, y);
                    }else{
                        this.clear(ev);
                    }
                    break;
                }
            }
        }

        startMovementMouse(ev){
            const x = ev.clientX;
            const y = ev.clientY;

            this.setHot();
            this.startDrag(x, y, this.frontElement);
            this.followPointer(x, y, this.frontElement);
            this.setInput(x, y);          
            this.isBeingTouched = true;
        }

        keepMovementMouse(ev){
            if(this.isBeingTouched){
                const x = ev.clientX;
                const y = ev.clientY;

                this.setHot();
                this.followPointer(x, y, this.frontElement);
                this.setInput(x, y);
            }
        }

        setInput(x, y){
            this.checkDownInput(x, y);
            this.checkLeftInput(x, y);
            this.checkRightInput(x, y);
            this.checkUpInput(x, y);
        }

        checkDownInput(x, y){
            Input._currentState['down'] = this.inputDirection(x, y, 'down') || 
                this.inputDirection(x, y, 'down_right') || 
                this.inputDirection(x, y, 'down_left');
        }

        checkUpInput(x, y){
            Input._currentState['up'] = this.inputDirection(x, y, 'up') || 
                this.inputDirection(x, y, 'up_right') || 
                this.inputDirection(x, y, 'up_left');
        }

        checkLeftInput(x, y){
            Input._currentState['left'] = this.inputDirection(x, y, 'left') || 
                this.inputDirection(x, y, 'up_left') || 
                this.inputDirection(x, y, 'down_left');
        }

        checkRightInput(x, y){
            Input._currentState['right'] = this.inputDirection(x, y, 'right') || 
                this.inputDirection(x, y, 'down_right') || 
                this.inputDirection(x, y, 'up_right');
        }

        checkCenterInput(x, y){
            const lastInput = Input._latestButton;
            if(['right', 'left', 'up', 'down'].includes(lastInput)){
                Input._currentState[lastInput] = this.inputDirection(x, y, 'center')
            }
        }

        inputDirection(x, y, direction){
            const area = this.area[direction];
            return area.contains(x, y);
        }

        setInputIf(x, y){
            if(this.inputDirection(x, y, 'up')){
                console.log("up")
                this.setCurrentStateUp();
                
            }else if(this.inputDirection(x, y, 'down')){
                console.log("down")
                this.setCurrentStateDown();
                
            }else if(this.inputDirection(x, y, 'left')){
                console.log("left")
                this.setCurrentStateLeft();
                
            }else if(this.inputDirection(x, y, 'right')){
                console.log("right")
                this.setCurrentStateRight();

            }else if(this.inputDirection(x, y, 'up_left')){
                console.log("up_left")
                this.setCurrentStateUpLeft();

            }else if(this.inputDirection(x, y, 'up_right')){
                console.log("up_right")
                this.setCurrentStateUpRight();

            }else if(this.inputDirection(x, y, 'down_left')){
                console.log("down_left")
                this.setCurrentStateDownLeft();

            }else if(this.inputDirection(x, y, 'down_right')){
                console.log("down_right")
                this.setCurrentStateDownRight();
            }else{

            }
        }

        setCurrentStateUp(){
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = false;
            Input._currentState['up'] = true;
        }

        setCurrentStateDown(){
            Input._currentState['up'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = true;
        }

        setCurrentStateLeft(){
            Input._currentState['up'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
        }

        setCurrentStateRight(){
            Input._currentState['up'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = true;
        }

        setCurrentStateUpLeft(){
            Input._currentState['down'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
            Input._currentState['up'] = true;
        }

        setCurrentStateUpRight(){
            Input._currentState['left'] = false;
            Input._currentState['down'] = false;
            Input._currentState['right'] = true;
            Input._currentState['up'] = true;
        }

        setCurrentStateDownLeft(){
            Input._currentState['up'] = false;
            Input._currentState['right'] = false;
            Input._currentState['left'] = true;
            Input._currentState['down'] = true;
        }

        setCurrentStateDownRight(){
            Input._currentState['up'] = false;
            Input._currentState['left'] = false;
            Input._currentState['down'] = true;
            Input._currentState['right'] = true;
        }
    
        clear(ev){
            if(!this.isActive()) return;
            this.setCold();
            this.resetTouch();
            this.setFrontToOrigin();
            this.resetMoveInput();
        }

        resetTouch(){
            this.isBeingTouched = false;
            this.touch = null;
        }

        setFrontToOrigin(){
            const img = this.frontElement;

            img.style.top = this.originY;
            img.style.left = this.originX;
        }

        resetMoveInput(){
            Input._currentState['up'] = false;
            Input._currentState['down'] = false;
            Input._currentState['left'] = false;
            Input._currentState['right'] = false;
        }
    },

    parameters: EliPluginManager.createParameters() || {},
    alias: this.alias || {},
    buttons: [],
    debugPad: null,
    flag: 0,
    elements : [],

    framesToMs(frames){
        return ~~(frames * 16.66666666666667)
    },

    param(){
        return this.parameters;
    },

    buttonParams(){
        return this.param().buttons;
    },

    arrowParams(){
        return this.param().arrowPad
    },

    initialize(){
        this.createDiv();
        this.createDpad();
        this.createButtons();
    },

    createDiv(){
        const div = document.createElement('div');
        div.id = 'ScreenButton';
        div.style.position = "absolute";
        div.style.top = 0+'px';
        div.style.left = 0+'px';
        div.style.right = 0+'px';
        div.style.bottom = 0+'px';
        div.style.margin = "auto"
        document.body.append(div);
    },

    createDpad(){
        if(this.param().dPadType === "arrows"){

            for(const button of this.arrowParams()){
                const arrow = new this.Button(button);

                this.addToDiv(arrow.element)
                this.elements.push(arrow.element)
                this.buttons.push(arrow);
            }

        }else if(this.param().dPadType === "singlePad"){
            const dPadParameter = this.param().singlePad;
            const dPad = new this.SinglePad(dPadParameter);

            this.addToDiv(dPad.element);
            this.elements.push(dPad.element)
            this.buttons.push(dPad);

        }else{
            const joystickParameter = this.param().joystickPad;
            const joystick = new this.Joystick(joystickParameter);

            this.debugPad = joystick;
            this.addToDiv(joystick.backElement);
            this.addToDiv(joystick.frontElement);
            this.elements.push(joystick.backElement, joystick.frontElement)
            this.buttons.push(joystick);
        }
    },

    createButtons(){
        for(const button of this.buttonParams()){
            const thisButton = new this.Button(button);
            this.addToDiv(thisButton.element)
            this.elements.push(thisButton.element)
            this.buttons.push(thisButton);
        }
    },

    div(){
        return document.getElementById('ScreenButton');
    },

    addToDiv(element){
        this.div().append(element);
    },

    hide(){
        this.buttons.forEach(button => {
            button.hide();
        })
    },

    show(){
        this.buttons.forEach(button => {
            button.show();
        })
    },

    activate(){
        this.buttons.forEach(button => {
            button.activate();
        })
    },

    deactivate(){
        this.buttons.forEach(button => {
            button.deactivate();
        })
    },

    hideForMessage(){
        const scene = SceneManager._scene.constructor.name
        const hideAndDeactivate = button => {
            if(button.parameters.scenes.includes(scene)){
                button.hide();
                button.deactivate();
            }
        }
        this.buttons.forEach(hideAndDeactivate)
    },

    showForMessage(){
        const scene = SceneManager._scene.constructor.name;
        const showAndActivate = button => {
            if(button.parameters.scenes.includes(scene)){
                button.show();
                button.activate();
            }
        }
        this.buttons.forEach(showAndActivate)
    },

    fadeOut(duration) {
        let op = 1
        const fadeOutButton = button => {
            if(button.isActive()){
                if(button instanceof this.Joystick){
                    button.backElement.style.opacity = `${op}`
                    button.frontElement.style.opacity = `${op}`
                }else{
                    button.element.style.opacity = `${op}`
                }
            }
        }
        const updateFade = () => {
            op -= 0.1
            this.buttons.forEach(fadeOutButton)
            if (op <= 0){
                clearInterval(intervalId);
            }
        }
        const intervalId = setInterval(updateFade, duration);
    },
    
    fadeIn(duration) {
        let op = 0
        const fadeInButton = button => {
            if(button.isActive()){
                if(button instanceof this.Joystick){
                    button.backElement.style.opacity = `${op}`
                    button.frontElement.style.opacity = `${op}`
                }else{
                    button.element.style.opacity = `${op}`
                }
            }
        }
        const updateFade = () => {
            op += 0.1
            this.buttons.forEach(fadeInButton)
            if (op >= 1){
                clearInterval(intervalId);
            }
        }
        const intervalId = setInterval(updateFade, duration);
    },

    refreshButtonsForScene(){
        const scene = SceneManager._scene.constructor.name;
        const refresh = button => {
            if(button.parameters.scenes.includes(scene)){

                if(!button.isActive()){
                    button.show();
                    button.activate()
                }
            }else{

                if(button.isActive()){
                    button.hide();
                    button.deactivate();
                }
            }
        }
        this.buttons.forEach(refresh)
    }

};

const Plugin = Eli.MobileControls;
const Alias = Eli.MobileControls.alias;

Plugin.initialize();

Alias.Game_Temp_setDestination = Game_Temp.prototype.setDestination;
Game_Temp.prototype.setDestination = function(x, y) {
    if(Plugin.param().disableScreenMove){
        x = null;
        y = null;
    }
    Alias.Game_Temp_setDestination.call(this, x, y)
};

/* ========================================================================== */
/*                                    SCENE                                   */
/* ========================================================================== */

Eli.MobileControls.Scene_Config = class extends Scene_Base{

    constructor(){
        super();
    }

    initialize(){
        super.initialize();
        //Plugin.div().addEventListener()
    }

    create(){
        super.create();
        this.createBackground();
    }

    createBackground(){
        const width = () => {
            if (Utils.isMobileDevice()) {
                return document.documentElement.clientWidth;
            } else {
                return window.innerWidth;
            }
        }
        const height = () => {
            if (Utils.isMobileDevice()) {
                return document.documentElement.clientHeight;
            } else {
                return window.innerHeight;
            }
        }
        this._background = new Sprite();
        this._background.bitmap = new Bitmap(width(), height());
        this.addChild(this._background)
    }

    start(){
        super.start();
        this._background.bitmap.fillAll("pink")
    }

}

Alias.Scene_Base_create = Scene_Base.prototype.create;
Scene_Base.prototype.create = function(){
    Alias.Scene_Base_create.call(this);
    setTimeout(Plugin.refreshButtonsForScene.bind(Plugin), 50);
};

Alias.Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function(){
    Alias.Scene_Base_update.call(this);
    //$gameSystem.disableMenu();
    //console.log(Input.dir4)
    //console.log(Input._currentState)
};

Alias.Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
Scene_Map.prototype.isMenuCalled = function() {
    if(Plugin.param().disableDoubleTouchMenu && TouchInput.isCancelled()){
        return false;
    }
    return Alias.Scene_Map_isMenuCalled.call(this);
};

/* ========================================================================== */
/*                                   WINDOWS                                  */
/* ========================================================================== */

Alias.Window_Message_update = Window_Message.prototype.update;
Window_Message.prototype.update = function() {
    this.updateScreenButtons();
    return Alias.Window_Message_update.call(this);
};

Window_Message.prototype.updateScreenButtons = function() {
    if(Plugin.param().hideOnMessage){
        if(this.isOpening() || this.isOpen()){
            Plugin.hideForMessage()
        }else if(this.isClosing()){
            Plugin.showForMessage();
        }
    }
};

function dragElement(element, img) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (img) {
      // if present, the header is where you move the DIV from:
      img.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      element.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      img.style.top = (img.offsetTop - pos2) + "px";
      img.style.left = (img.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      //img.onmousedown = null
      document.onmouseup = null;
      document.onmousemove = null;
    }

  }

}

