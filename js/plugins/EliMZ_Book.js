//==========================================================================
// EliMZ_Book.js
//==========================================================================

/*:
@target MZ

@plugindesc 所有 Eli 插件核心插件
@author Hakuen Studio
@url https://hakuenstudio.itch.io/

@help
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
如果你喜欢我的作品，请考虑在 Patreon 上支持我！
https://www.patreon.com/hakuenstudio
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
============================================================================
介绍
==================================================== ===========================

    这个插件优化了我所有的其他插件，减少了代码和
更易于维护和实施改进。它不是核心插件，它
不会覆盖 rpg maker mz 的标准代码的任何功能。

==================================================== ===========================
特征
==================================================== ===========================

提供在所有 Eli 插件上添加更好性能的方法和代码。

==================================================== ===========================
如何使用
==================================================== ===========================

放在所有其他 Eli 插件之上。

==================================================== ===========================
使用条款
==================================================== ===========================

https://www.hakuenstudio.com/rpg-maker/terms-of-use

==================================================== ===========================
链接
==================================================== ===========================

脸书 - https://www.facebook.com/hakuenstudio
Instagram - https://www.instagram.com/hakuenstudio
推特 - https://twitter.com/hakuen_studio

==================================================== ===========================
更新日志
==================================================== ===========================
版本 3.3.2 - 05/08/2021
- 修复了在生成事件时 VisuMZ_1_EventsMoveCore 的崩溃。

版本 3.3.1 - 05/06/2021
- 修复了检查数据对象类型时的错误。

版本 3.3.0 - 2021 年 5 月 3 日
- 添加了游戏手柄按钮代码。

版本 3.2.0 - 02/08/2021
- Eli.ColorManager 对象的改进。

版本 3.1.0 - 2021 年 1 月 30 日
- 添加方法以获取执行插件命令的事件 ID。

版本 3.0.0 - 2020 年 12 月 18 日
- 重组了 Eli.Book 对象。
- 添加了 Eli.Book.PluginManager、Eli.Book.Easing 和 Eli.Book.ColorManager。

版本 2.3.1 - 2020 年 12 月 16 日
- 为 Galv_EventSpawnerMZ.js 添加兼容性补丁

版本 2.3.0 - 2020 年 11 月 28 日
- 改变了插件获取缓动类型的方式。
- 添加全键盘代码对象。

版本 2.2.0 - 2020 年 11 月 11 日
- 修复了使用 eli.needEval() 评估某些表达式时的错误。
- 添加自定义场景基础。
- 增加了日志和日志表功能。
- 添加来自 Robert Penner 的缓动函数。
- 添加获取游戏中下一个和上一个事件命令的方法
口译员。

版本 2.1.1 - 2020 年 10 月 28 日
- 修复了在某些插件命令中出现错误的错误。

版本 2.1.0 - 20/10/2020
• 读取未加载地图数据的方法。
• 一些转换特定插件参数的方法，这些参数定义
混合模式，图片来源和easying类型。

版本 2.0.0 - 2020 年 10 月 16 日
• 在setPresetPos 上添加ui 参数。
• 添加新方法来检查$dataObject 的类型。
• 添加新类以覆盖任何精灵中的 MV 动画。
• 添加新方法来处理EscapeCharacters 或公式(eval)。
• 添加新方法以在插件命令/参数上转换转义字符。
• 添加处理插件参数的新方法。
• 添加新方法来注册插件命令。

版本 1.3.0 - 2020 年 9 月 26 日
• 创建了我自己的按钮类

版本 1.2.0 - 2020 年 9 月 23 日
• 更改了转换颜色功能。

版本 1.1.0 - 2020 年 9 月 16 日
• 添加新方法（参见帮助文件的更多信息）：
• eli.ruleOf3（别笑……xD）
• eli.centerX
• eli.centerY
• eli.centerPos
• eli.divideByTheLargest
• Sprite.prototype.scaledBitmapWidth
• Sprite.prototype.scaledBitmapHeight
• Sprite.prototype.stretchToScreen
• ImageManager.saveOldCache
• ImageManager.restoreOldCache

版本 1.0.0 - 10/09/2020
• 插件发布！

*/

"use strict";

var Eli = Eli || {};
var Imported = Imported || {};
Imported.Eli_Book = true;

/* ========================================================================== */
/*                                   PLUGIN                                   */
/* ========================================================================== */

Eli.Book = {

    Version: ['3', '3', '2'],
    alias: {},
    escapeCodes: [],
    regExtractMeta: /<([^<>:]+)(:?)([^>]*)>/g,
    regRemoveEscapeCodes: /(\\.\[[^]])/gi,
    reserveImages: [],
    metas: [],

    log(value, label = 'LOG'){
        console.log(`[${label.toUpperCase()}] = ${value}`)
    },

    logTable(value, colums){
        console.table(value, colums);
    },

    toLowerCaseArray(array){
        return array.map(element => element === 'string' ? element.toLowerCase() : element);
    },
    
    formatDollarSign(string){
        return string.replace("%24", "$");
    },

    scene(){
        return SceneManager._scene;
    },

    isScene(scene){
        return this.scene() instanceof scene;
    },

    needEval(param) {
        if(isNaN(param)){

            try{
                return eval(param)
            }catch(err){
                return param
            }

        }else{
            return param;
        }
    },

    convertEscapeCharacters(text){
        const tempWin = new Window_Base(new Rectangle(0,0,0,0));
        text = tempWin.convertEscapeCharacters(text);

        return text;
    },

    convertEscapeVariablesOnly(text){
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(+arguments[1]);
        }.bind(this));

        return text;
    },

    processEscapeVarOrFormula(arg){
        if(typeof arg !== 'string') return arg;
        
        const rawArg = arguments[0];
        arg = this.convertEscapeVariablesOnly(rawArg);
        if(rawArg === arg){
            return this.needEval(arg);
        }else{
            return arg;
        }
    },

    makeDeepCopy(object){
        return JSON.parse(JSON.stringify(object));
    },

    getTextWidth(text, fontSize = $gameSystem.mainFontSize(), standardPadding = $gameSystem.windowPadding(), 
            textPadding = Window_Base.prototype.itemPadding()){
        
        const sprite = new Sprite();
        const pad1 = standardPadding*2;
        const pad2 = textPadding*2;

        sprite.bitmap = new Bitmap(1,1);
        sprite.bitmap.fontSize = fontSize;

        let width = ~~((sprite.bitmap.measureTextWidth(text) + pad1 + pad2));
        if(width & 1) width += 1;
        
        return width;
    },

    presetPos(width, height, custom1, custom2, preset, ui){
        const baseWidth = ui ? Graphics.boxWidth : Graphics.width;
        const baseHeight = ui ? Graphics.boxHeight : Graphics.height;
        const centerX = (baseWidth - (baseWidth / 2)) - (width / 2);
        const endX = baseWidth - width;
        const centerY = (baseHeight - (baseHeight / 2)) - (height / 2);
        const endY = baseHeight - height;
        const defPos = [
            {x:custom1, y:custom2},     // 0
            {x:0,       y:0},           // 1 Top left
            {x:centerX, y:0},           // 2 Top center
            {x:endX,    y:0},           // 3 Top Right
            {x:0,       y:centerY},     // 4 Center left
            {x:centerX, y:centerY},     // 5 Center center
            {x:endX,    y:centerY},     // 6 Center right
            {x:0,       y:endY},        // 7 Bottom left
            {x:centerX, y:endY},        // 8 Bottom center
            {x:endX,    y:endY}         // 9 Bottom right
        ]
        const pX = defPos[preset].x;
        const pY = defPos[preset].y;

        return {x:pX, y:pY};
    },

    toBoolean(string){
        const value = string.toLowerCase()
        const options = ['enable', 'enabled', 'true', 'on', 'default', 'auto', 'ui area']

        return options.includes(value)
    },

    ruleOf3(a, b, c){
        return (c*b)/a;
    },

    divideByTheLargest(num1, num2){
        const max = Math.max(num1, num2);
        const min = Math.min(num1, num2);

        return max / min;
    },

    centerXPos(objWidth, baseWidth = Graphics.width){
        return Math.abs(objWidth - baseWidth) / 2;
    },

    centerYPos(objHeight, baseHeight = Graphics.height){
        return Math.abs(objHeight - baseHeight) / 2;
    },

    centerPos(objWidth, objHeight, baseWidth, baseHeight){
        const pos = {
            x:  this.centerXPos(objWidth, baseWidth),
            y:  this.centerYPos(objHeight, baseHeight),
        }

        return pos;
    },

    getId(searchName, dataName){
        return searchName;
    },

    // new
    getDataMap(mapId) {
        const xhr = new XMLHttpRequest();
        const fileName = "Map%1.json".format(mapId.padZero(3));
        const url = "data/" + fileName;

        xhr.open("GET", url, false);
        xhr.send();

        return JSON.parse(xhr.responseText);
    },

    getEasingType(type, move){
        const easingType =  {
            Linear: "linear",
            Quad: "quad", Cubic: "cubic", Quart: "quart", Quint: "quint", 
            Sine: "sine", Expo: "expo", Circ: "circ", 
            Elastic: "elastic", Back: "back", Bounce: "bounce",
        };

        if(easingType[type] === "linear"){
            return easingType[type];
        }else{
            return easingType[type]+move
        }

    },

    getDefaultEasingType(type){
        const easingType = ["Constant speed", "Slow start", "Slow end", "Slow start and end"];
        return easingType.indexOf(type);
    },
    
    getPicOrigin(type){
        const origin =  {
            UpperLeft: 0,
            Center: 1,
        };

        return origin[type];
    },
    
    getBlendMode(mode){
        const blend =  {
            Normal: 0,
            Additive: 1,
            Multiply: 2,
            Screen: 3
        };

        return blend[mode];
    },
    
/* ----------------------------- CONDITION CHECK ---------------------------- */
//testing...
    evaluateCondition(param){
        const type = param.conditionType;
        const value = param.conditionValue;
        
        return this[`${type}Condition`](value);
    },

    switchCondition(conditionValue){
        return $gameSwitches.value(+conditionValue);
    },

    variableCondition(conditionValue){
        const arr = conditionValue.split(' ');
        const [id, inputedOperator, value] = arr;
        const operatorTypes = ['===', '>', '<', '>=', '<='];
        const operator = operatorTypes.indexOf(inputedOperator);
        let result = 0;
        
        switch(operatorTypes[operator]){
            case '===':
                result = $gameVariables.value(+id) === +value;
                break;
            case '>':
                result = $gameVariables.value(+id) > +value;
                break;
            case '<':
                result = $gameVariables.value(+id) < +value;
                break;
            case '>=':
                result = $gameVariables.value(+id) >= +value;
                break;
            case '<=':
                result = $gameVariables.value(+id) <= +value;
                break;
        }

        return result;
    },

    booleanCondition(conditionValue){
        return typeof conditionValue === 'string' ? this.toBoolean(conditionValue) : conditionValue;
    },

    scriptCondition(conditionValue){
        return eval(conditionValue);
    },

/* ----------------------------------- OLD ---------------------------------- */

    extractTextBetween(text, startChar, endChar){ 
        const startCharLength = startChar.length
        const startIndex = text.indexOf(startChar) + startCharLength;
        const endIndex = text.indexOf(endChar);
        const extractedText = text.substring(startIndex, endIndex);

        return extractedText;
    },

    setPosXy(array){
        const argLower = this.toLowerCaseArray(array);
        const index = [ argLower.indexOf('x:'), argLower.indexOf('y:') ];
        const posX  = index[0] !== -1 ? array[index[0]+1] : false;
        const posY  = index[1] !== -1 ? array[index[1]+1] : false;

        return {x:posX, y:posY};
    },

    manipulateWindows(args){
        const argLower = this.toLowerCaseArray(args);
        const index = [
            argLower.indexOf('x:'), argLower.indexOf('y:'), 
            argLower.indexOf('w:'), argLower.indexOf('h:'), argLower.indexOf('opacity:')
        ];
        const posX      = index[0] !== -1 ? args[index[0]+1] : false;
        const posY      = index[1] !== -1 ? args[index[1]+1] : false;
        const width     = index[2] !== -1 ? args[index[2]+1] : false;
        const height    = index[3] !== -1 ? args[index[3]+1] : false;
        const opacity   = index[4] !== -1 ? args[index[4]+1] : false;

        return {x:posX, y:posY, width: width, height: height, opacity: opacity};
    },

    manipulatePictures(args){
        const argLower = this.toLowerCaseArray(args);
        const index = [
            argLower.indexOf('id:'), argLower.indexOf('name:'), argLower.indexOf('origin:'), 
            argLower.indexOf('x:'), argLower.indexOf('y:'), 
            argLower.indexOf('scaleX:'), argLower.indexOf('scaleY:'), 
            argLower.indexOf('opacity:'), argLower.indexOf('blendmode:'),
            argLower.indexOf('easingType:')
        ];
        const id        = index[0] !== -1 ? args[index[0]+1] : false;
        const name      = index[1] !== -1 ? args[index[1]+1] : false;
        const origin    = index[2] !== -1 ? args[index[2]+1] : false;
        const posX      = index[3] !== -1 ? args[index[3]+1] : false;
        const posY      = index[4] !== -1 ? args[index[4]+1] : false;
        const scaleX    = index[5] !== -1 ? args[index[5]+1] : false;
        const scaleY    = index[6] !== -1 ? args[index[6]+1] : false;
        const opacity   = index[7] !== -1 ? args[index[7]+1] : false;
        const blend     = index[8] !== -1 ? args[index[8]+1] : false;
        const easy      = index[9] !== -1 ? args[index[9]+1] : false;

        const result    = {
            id: id, name: name, origin: origin, x: posX, y: posY, 
            scaleX: scaleX, scaleY: scaleY, opacity: opacity, 
            blendMode: blend, easingType: easy
        };

        return result;
    },

    addToDecrypterIgnoreList(folder, file){
        const image = `img/${folder}/${file}.png`;
        if(!Decrypter._ignoreList.includes(image)) Decrypter._ignoreList.push(image);
    },

};

Eli.PluginManager = {

    regPluginCommand: /^(?:@command) (\w+$)/gmi,
    eventId: 0,

    createParameters(){
        const pluginName = this.getPluginName();
        const rawParameters = PluginManager.parameters(pluginName);
        const param = this.convertParameters(rawParameters);

        return param;
    },

    getPluginName(){
        const url = String(document.currentScript._url);
        const start = url.indexOf('Eli');
        const end = url.length - 3;
        const pluginName = url.substring(start, end);

        return pluginName;
    },

    convertParameters(parameters){ // Thanks to LTN games!
        const parseParameters = function(string)  {
            try {
                return JSON.parse(string, (key, value) => {
                    try {
                        return parseParameters(value)
                    } catch (e) {
                        return value
                    }
                })
            } catch (e) {
                return string
                }
        }

        return parseParameters(JSON.stringify(parameters));
    },

    registerCommands(plugin){
        const url = document.currentScript._url;
        const text = this.getJsFileInString(url);
        const helpFile = this.formatJsText(text);
        const pluginCommands = this.getCommands(helpFile);
        const pluginName = this.getPluginName();

        this.setupCommands(pluginName, pluginCommands, plugin);
    },

    getJsFileInString(url){
        const XHR = new XMLHttpRequest();
        XHR.open('GET', url, false);
        XHR.send();

        return XHR.responseText;
    },

    formatJsText(text){
        const startIndex = text.indexOf('@command');
        const endIndex = text.lastIndexOf('@command') + 50;
        const pluginCommandText = text.substring(startIndex, endIndex);

        return pluginCommandText;
    },

    getCommands(text){
        const commandNames = [];
        const reg = this.regPluginCommand;
        let match;

        while(match = reg.exec(text)){
            commandNames.push(match[1]);
        }

        return commandNames;
    },

    setupCommands(pluginName, commands, plugin){
        for(const command of commands){
            const callBack = command;
            PluginManager.registerCommand(pluginName, command, plugin[callBack].bind(plugin));
        }
    },

};

Eli.Easing = {

    linear(t){
        return t;
    },

    quadIn(t){
        return t**2;
    },

    quadOut(t){
        return t * (2 - t);
    },

    quadInOut(t){
        if((t *= 2) < 1){
            return 0.5 * t**2;
        }
        return -0.5 * (--t * (t - 2) - 1);
    },

    cubicIn(t){
        return t**3;
    },

    cubicOut(t){
        return --t * t * t + 1;
    },

    cubicInOut(t){
        if((t *= 2) < 1){
            return 0.5 * t**3;
        }
    
        return 0.5 * ((t -= 2) * t * t + 2);
    },

    quartIn(t){
        return t**4;
    },

    quartOut(t){
        return 1 - --t * t**3;
    },

    quartInOut(t){
        if((t *= 2) < 1){
            return 0.5 * t**4;
        }
    
        return -0.5 * ( (t -= 2) * t**3 - 2);
    },

    quintIn(t){
        return t**5;
    },

    quintOut(t){
        return --t * t**4 + 1;
    },

    quintInOut(t){
        if((t *= 2) < 1){
            return 0.5 * t**5;
        }
    
        return 0.5 * ( (t -= 2) * t**4 + 2);
    },

    sineIn(t){
        const pi = Math.PI;
        return Math.cos(t * pi / 2 - pi) + 1.0;
    },

    sineOut(t){
        return Math.sin((t * Math.PI) / 2);
    },

    sineInOut(t){
        return 0.5 * (1 - Math.cos(Math.PI * t));
    },

    expoIn(t){
        return t === 0 ? 0 : Math.pow(1024, t - 1);
    },

    expoOut(t){
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },

    expoInOut(t){
        if (t === 0){
            return 0;
        }

        if (t === 1){
            return 1;
        }

        if ((t *= 2) < 1) {
            const expo = t - 1;
            return 0.5 * Math.pow(1024, t - 1);
        }

        return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    },

    circIn(t){
        return 1 - Math.sqrt(1 - t * t);
    },

    circOut(t){
        return Math.sqrt(1 - --t * t);
    },

    circInOut(t){
        if ((t *= 2) < 1){
            return -0.5 * (Math.sqrt(1 - t * t) - 1);
        }

        return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    },

    elasticIn(t){
        if (t === 0){
            return 0;
        }

        if (t === 1){
            return 1;
        }

        return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },

    elasticOut(t){
        if (t === 0){
            return 0;
        }

        if (t === 1){
            return 1;
        }

        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },

    elasticInOut(t){
        if (t === 0){
            return 0;
        }

        if (t === 1){
            return 1;
        }

        t *= 2;
        if (t < 1){
            return -0.5 * Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
        }

        return 0.5 * Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 1;
    },

    backIn(t){
        const s = 1.70158;
        return t * t * ((s + 1) * t - s);
    },

    backOut(t){
        const s = 1.70158;
        return --t * t * ((s + 1) * t + s) + 1;
    },

    backInOut(t){
        const s = 1.70158 * 1.525;

        if((t *= 2) < 1){
            return 0.5 * (t * t * ((s + 1) * t - s));
        }

        return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
    },

    bounceIn(t){
        return 1 - this.bounceOut(1 - t);
    },

    bounceOut(t){
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;

        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;

        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;

        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },

    bounceInOut(t){
        if(t < 0.5){
            return this.bounceIn(t * 2) * 0.5;
        }

        return this.bounceOut(t * 2 - 1) * 0.5 + 0.5;
    },

    execute(type, t){
        return this[type](t);
    },
};

Eli.ColorManager = {

    names: [
            "ALICEBLUE", "ANTIQUEWHITE", "AQUA", "AQUAMARINE", "AZURE", "BEIGE", "BISQUE", "BLACK", "BLANCHEDALMOND", "BLUE", "BLUEVIOLET", "BROWN", 
            "BURLYWOOD", "CADETBLUE", "CHARTREUSE", "CHOCOLATE", "CORAL", "CORNFLOWERBLUE", "CORNSILK", "CRIMSON", "CYAN", "DARKBLUE", "DARKCYAN", 
            "DARKGOLDENROD", "DARKGRAY", "DARKGREY", "DARKGREEN", "DARKKHAKI", "DARKMAGENTA", "DARKOLIVEGREEN", "DARKORANGE", "DARKORCHID", "DARKRED", 
            "DARKSALMON", "DARKSEAGREEN", "DARKSLATEBLUE", "DARKSLATEGRAY", "DARKSLATEGREY", "DARKTURQUOISE", "DARKVIOLET", "DEEPPINK", "DEEPSKYBLUE", 
            "DIMGRAY", "DIMGREY", "DODGERBLUE", "FIREBRICK", "FLORALWHITE", "FORESTGREEN", "FUCHSIA", "GAINSBORO", "GHOSTWHITE", "GOLD", "GOLDENROD", 
            "GRAY", "GREY", "GREEN", "GREENYELLOW", "HONEYDEW", "HOTPINK", "INDIANRED", "INDIGO", "IVORY", "KHAKI", "LAVENDER", "LAVENDERBLUSH", 
            "LAWNGREEN", "LEMONCHIFFON", "LIGHTBLUE", "LIGHTCORAL", "LIGHTCYAN", "LIGHTGOLDENRODYELLOW", "LIGHTGRAY", "LIGHTGREY", "LIGHTGREEN", 
            "LIGHTPINK", "LIGHTSALMON", "LIGHTSEAGREEN", "LIGHTSKYBLUE", "LIGHTSLATEGRAY", "LIGHTSLATEGREY", "LIGHTSTEELBLUE", "LIGHTYELLOW", 
            "LIME", "LIMEGREEN", "LINEN", "MAGENTA", "MAROON", "MEDIUMAQUAMARINE", "MEDIUMBLUE", "MEDIUMORCHID", "MEDIUMPURPLE", "MEDIUMSEAGREEN", 
            "MEDIUMSLATEBLUE", "MEDIUMSPRINGGREEN", "MEDIUMTURQUOISE", "MEDIUMVIOLETRED", "MIDNIGHTBLUE", "MINTCREAM", "MISTYROSE", "MOCCASIN", 
            "NAVAJOWHITE", "NAVY", "OLDLACE", "OLIVE", "OLIVEDRAB", "ORANGE", "ORANGERED", "ORCHID", "PALEGOLDENROD", "PALEGREEN", "PALETURQUOISE", 
            "PALEVIOLETRED", "PAPAYAWHIP", "PEACHPUFF", "PERU", "PINK", "PLUM", "POWDERBLUE", "PURPLE", "REBECCAPURPLE", "RED", "ROSYBROWN", "ROYALBLUE", 
            "SADDLEBROWN", "SALMON", "SANDYBROWN", "SEAGREEN", "SEASHELL", "SIENNA", "SILVER", "SKYBLUE", "SLATEBLUE", "SLATEGRAY", "SLATEGREY", "SNOW", 
            "SPRINGGREEN", "STEELBLUE", "TAN", "TEAL", "THISTLE", "TOMATO", "TURQUOISE", "VIOLET", "WHEAT", "WHITE", "WHITESMOKE", "YELLOW", "YELLOWGREEN",
        ],

            // Thanks! - https://css-tricks.com/converting-color-spaces-in-javascript/
    nameToRGB(name) {
        // Create fake div
        const fakeDiv = document.createElement("div");
        fakeDiv.style.color = name;
        document.body.appendChild(fakeDiv);

        // Get color of div
        const cs = window.getComputedStyle(fakeDiv);
        const pv = cs.getPropertyValue("color");
        
        // Remove div after obtaining desired color value
        document.body.removeChild(fakeDiv);

        return pv;
    },

    hexToRgb(hex) {       
        const r = this.getHexValue(hex, 1, 3)
        const g = this.getHexValue(hex, 3, 5)
        const b = this.getHexValue(hex, 5, 7)
        const hasAlpha = hex.length > 7;
        let color = ''

        if(hasAlpha){
            const a = this.getHexValue(hex, 7, 9)
            color = `rgba(${r}, ${g}, ${b}, ${a})`

        }else{
            color = `rgb(${r}, ${g}, ${b})`
        }

        return color;
    },

    getHexValue(hex, start, end){
        return parseInt(hex.slice(start, end), 16);
    },

    isHexColor(color){
        return color[0] === '#'
    },

    isRgb(color){
        return !isNaN(color[0]);
    },

    isHtmlColor(color){
        return isNaN(color[0]);
    },

    getColorType(color){
        if(this.isHexColor(color)){
            return 'hex'

        }else if(this.isRgb(color)){
            return 'rgb'

        }else if(this.isHtmlColor(color)){
            return 'html'

        }else{
            console.log(`The string ${color} is not a valid color format`)
        }
    },

    formatColorToArray(color){
        if(!color.includes('(')){
            color = `(${color})`
        }
        
        const start = color.indexOf('(')
        const end = color.indexOf(')')
        const colorValues = color.slice(start+1, end)        
        return colorValues.split(',').map(item => +item);
    },

    convert(color, needArray){
        const colorType = this.getColorType(color);
 
        switch(colorType){
            case 'hex': color = this.hexToRgb(color);
            case 'html': color = this.nameToRGB(color);
        }

        if(needArray){
            color = this.formatColorToArray(color);
        }

        return color;
    },

};

function getId(searchName, dataName){
    return searchName;
};

function getUniqueId(searchMeta){
    return searchMeta;
};

/* ========================================================================== */
/*                                  SAVE DATA                                 */
/* ========================================================================== */

function Eli_SavedContents() {
    this.initialize.apply(this, arguments);
};

Eli_SavedContents.prototype.initialize = function(){
    this.contents = {};
};

Eli_SavedContents.prototype.createNewContent = function(pluginName){
    this.contents[pluginName] = {};
};

Eli_SavedContents.prototype.createContentWithPluginParameters = function(pluginName, pluginParameters){
    this.contents[pluginName] = EliBook.makeDeepCopy(pluginParameters);
};

Eli_SavedContents.prototype.addNewDataToContent = function(pluginName, newData, value){
    this.contents[pluginName][newData] = value;
};

var $eliData = null;

/* ========================================================================== */
/*                              GLOBAL SHORTCUTS                              */
/* ========================================================================== */

const EliBook = Eli.Book;
const EliPluginManager = Eli.PluginManager;
const EliColorManager = Eli.ColorManager;
const EliEasing = Eli.Easing;

/* ========================================================================== */
/*                                    MAKER                                   */
/* ========================================================================== */

{

const Alias = Eli.Book.alias;

/* ========================================================================== */
/*                                    CORE                                    */
/* ========================================================================== */

/* ---------------------------------- INPUT --------------------------------- */

Input.keyBoardCodes = {
    backspace:8, tab:9, enter:13, shift:16, ctrl:17, alt:18, pausebreak:19, capslock:20, 
    esc:27, space:32, pageup:33, pagedown:34, end:35, home:36, 
    leftarrow:37, uparrow:38, rightarrow:39, downarrow:40, insert:45, delete:46, 
    0:48, 1:49, 2:50, 3:51, 4:52, 5:53, 6:54, 7:55, 8:56, 9:57, 
    a:65, b:66, c:67, d:68, e:69, f:70, g:71, h:72, i:73, j:74, k:75, l:76, m:77, n:78, 
    o:79, p:80, q:81, r:82, s:83, t:84, u:85, v:86, w:87, x:88, y:89, z:90, 
    leftwindowkey:91, rightwindowkey:92, selectkey:93, 
    numpad0:96, numpad1:97, numpad2:98, numpad3:99, numpad4:100, numpad5:101, 
    numpad6:102, numpad7:103, numpad8:104, numpad9:105, 
    multiply:106, add:107, subtract:109, decimalpoint:110, divide:111, 
    f1:112, f2:113, f3:114, f4:115, f5:116, f6:117, f7:118, f8:119, f9:120, f10:121, f11:122, f12:123,
    numlock:144, scrolllock:145, semicolon:186, equalsign:187, comma:188, dash:189, period:190,
    forwardslash:191, graveaccent:192, openbracket:219, backslash:220, closebracket:221, singlequote:222
};

Input.gamePadCodes = {
    a: 0, b: 1, x: 2, y: 3, lb: 4, rb: 5, lt: 6, rt: 7, select: 8,
    start: 9, l3: 10, r3: 11, up: 12, down: 13, left: 14, right: 15
}

/* --------------------------------- SPRITE --------------------------------- */

{

Sprite.prototype.setScale = function(x, y){
    this.scale.set(x, y);
};

Sprite.prototype.scaledBitmapWidth = function(){
    return EliBook.ruleOf3(1, this.bitmap.width, this.scale.x);
};

Sprite.prototype.scaledBitmapHeight = function(){
    return EliBook.ruleOf3(1, this.bitmap.height, this.scale.y);
};

Sprite.prototype.centerX = function(baseWidth){
    const x = EliBook.centerXPos(this.scaledBitmapWidth(), baseWidth);
    this.x = x;
};

Sprite.prototype.centerY = function(baseHeight){
    const y = EliBook.centerYPos(this.scaledBitmapHeight(), baseHeight);
    this.y = y;
};

Sprite.prototype.centerPos = function(baseWidth, baseHeight){
    const x = EliBook.centerXPos(this.scaledBitmapWidth(), baseWidth);
    const y = EliBook.centerYPos(this.scaledBitmapHeight(), baseHeight);
    this.move(x, y);
};

Sprite.prototype.stretchToScreen = function(keepRatio, baseWidth = Graphics.width, baseHeight = Graphics.height){
    const bitmapWidth = this.bitmap.width
    const bitmapHeight = this.bitmap.height
    const upScale = baseWidth > bitmapWidth || baseHeight > bitmapHeight;

    if(!keepRatio){
        const widthRatio = EliBook.divideByTheLargest(bitmapWidth, baseWidth);
        const heightRatio = EliBook.divideByTheLargest(bitmapHeight, baseHeight);
        const scaleX = Math.abs(1-widthRatio);
        const scaleY = Math.abs(1-heightRatio);

        if(upScale){
            this.setScale(1 + scaleX, 1 + scaleY);
        }else{
            this.setScale(1 - scaleX, 1 - scaleY);
        }
    }else{
        const widthRatio = baseWidth / bitmapWidth;
        const heightRatio = baseHeight / bitmapHeight;
        const finalScale = Math.min(widthRatio, heightRatio);
        this.setScale(finalScale, finalScale);
    }

    this.centerPos(baseWidth, baseHeight);
};

}

/* ========================================================================== */
/*                                   MANAGER                                  */
/* ========================================================================== */

/* ------------------------------ DATA MANAGER ------------------------------ */

{

Alias.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Alias.DataManager_createGameObjects.call(this);
    $eliData = new Eli_SavedContents();
};

Alias.DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
    const alias = Alias.DataManager_makeSaveContents.call(this);
    alias.eli = $eliData;

    return alias;
};

Alias.DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
    Alias.DataManager_extractSaveContents.call(this, contents);
    $eliData = contents.eli;
};

DataManager.isDataActor = function(data) {
    return data.hasOwnProperty("nickname")
};

DataManager.isDataArmor = function(data) {
    return data.hasOwnProperty("atypeId")
};

DataManager.isDataClass = function(data) {
    return data.hasOwnProperty("learnings")
};

DataManager.isDataEnemy = function(data) {
    return data.hasOwnProperty("dropItems")
};

DataManager.isDataItem = function(data) {
    return data.hasOwnProperty("itypeId")
};

DataManager.isDataMapInfo = function(data) {
    return data.hasOwnProperty("expanded")
};

DataManager.isDataSkills = function(data) {
    return data.hasOwnProperty("stypeId")
};

DataManager.isDataStates = function(data) {
    return data.hasOwnProperty("stepsToRemove")
};

DataManager.isDataSystem = function(data) {
    return data.hasOwnProperty("locale")
};

DataManager.isDataTroops = function(data) {
    return data.hasOwnProperty("members")
};

DataManager.isDataWeapon = function(data) {
    return data.hasOwnProperty("wtypeId")
};

}

/* ------------------------------ IMAGE MANAGER ----------------------------- */

{

ImageManager._previousFolders = [];
ImageManager._previousFiles = [];

ImageManager.saveOldCache = function(){
    const urls = Object.keys(this._cache);
    this._previousFolders = [];
    this._previousFiles = [];

    for(let i = 0, l = urls.length; i < l; i++) {
        const url = urls[i];
        const folderIndex = url.lastIndexOf('/') + 1;
        const folderName = url.substring(0, folderIndex);
        const fileIndex = url.indexOf('.png');
        let fileName = url.substring(folderIndex, fileIndex);
        fileName = EliBook.formatDollarSign(fileName);

        this._previousFolders.push(folderName);
        this._previousFiles.push(fileName);
    }
};

ImageManager.restoreOldCache = function(){
    this.clear();
    for(let i = 0, l = this._previousFolders.length; i < l; i++){
        const folder = this._previousFolders[i];
        const file = this._previousFiles[i];
        this.loadBitmap(folder, file);
    }
};

}

/* ========================================================================== */
/*                                   OBJECTS                                  */
/* ========================================================================== */

/* --------------------------- GAME CHARACTER BASE -------------------------- */

{

Game_CharacterBase.prototype.isEvent = function(){
    return this instanceof Game_Event;
};

Game_CharacterBase.prototype.isPlayer = function(){
    return this instanceof Game_Player;
};

Game_CharacterBase.prototype.isFollower = function(){
    return this instanceof Game_Follower;
};

}

/* ------------------------------- GAME EVENT ------------------------------- */

{

Alias.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias.Game_Event_initialize.call(this, mapId, eventId);
    this.initNote(eventId);
    this.initMeta();
};

Game_Event.prototype.initNote = function(eventId){
    if(Imported.Galv_EventSpawner && this.isSpawnEvent){
        this._note = $dataSpawnMap.events[this._spawnEventId].note || '';
    }else if($dataMap.events[eventId]){
        /*
            This is an attempt to try to fix a crash with VisuMZ Event Move core.
            Ideally, it has to be something like I did with Galv above:
            if(Imported.VisuMZ_1_EventsMoveCore && this.isSpawnedEvent()){
                this._note = $dataSomething[eventId].note
            }
            But the function "isSpawnedEvent()" always return false.
            And I don't know if it is a function of visustella, since
            the project that was given to me also contains a lot of other plugins...

            At least, this will avoid the crash.
        */
        this._note = $dataMap.events[eventId].note || '';
    }else{
        this._note = ''
    }
};

Game_Event.prototype.initMeta = function(){
    this._meta = {};
    const re = EliBook.regExtractMeta;
    let match;

    while(match = re.exec(this._note)) {

        if (match[2] === ':') {
            this._meta[match[1]] = match[3];
        } else {
            this._meta[match[1]] = true;
        }
    }
};

Game_Event.prototype.name = function(){ 
    return $dataMap.events[this._eventId].name;
};

Game_Event.prototype.meta = function(){ 
    return this._meta;
};

Game_Event.prototype.note = function(){ 
    return this._note;
};

}

/* ------------------------------- GAME PLAYER ------------------------------ */

Game_Player.prototype.meta = function(){
    return $dataActors[$gameParty.leader()._actorId].meta;
};

/* ---------------------------- GAME INTERPRETER ---------------------------- */

Game_Interpreter.prototype.nextCommand = function(){
    return this._list[this._index + 1];
};

Game_Interpreter.prototype.previousCommand = function(){
    return this._list[this._index - 1];
};

// Plugin Command
Alias.Game_Interpreter_command357 = Game_Interpreter.prototype.command357;
Game_Interpreter.prototype.command357 = function(params) {
    if(this._eventId > 0){
        EliPluginManager.eventId = this._eventId;
    }
    return Alias.Game_Interpreter_command357.call(this, params);
};

/* ========================================================================== */
/*                                   SCENES                                   */
/* ========================================================================== */

/* ------------------------------- SCENE BASE ------------------------------- */

{
Scene_Base.prototype.addWindowTo = function(window, boxContainer) {
    if(boxContainer){
        this.addWindow(window)
    }else{
        this.addChild(window);
    }
};

Alias.Scene_Base_update = Scene_Base.prototype.update;
Scene_Base.prototype.update = function() {
    this.beforeUpdate();
    Alias.Scene_Base_update.call(this);
    this.afterUpdate();
};

Scene_Base.prototype.beforeUpdate = function(){};
Scene_Base.prototype.afterUpdate = function(){};

}

/* -------------------------------- SCENE MAP ------------------------------- */

{

Alias.Scene_Map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    if(this._transfer){
        this.beforeStart();
    }
    Alias.Scene_Map_start.call(this);
    this.afterStart();
};

Alias.Scene_Map_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
    this.beforeUpdate();
    Alias.Scene_Map_update.call(this);
    this.afterUpdate();
};

Alias.Scene_Map_terminate = Scene_Map.prototype.terminate;
Scene_Map.prototype.terminate = function() {
    this.beforeTerminate();
    Alias.Scene_Map_terminate.call(this);
    this.afterTerminate();
};

Scene_Map.prototype.beforeStart = function(){};
Scene_Map.prototype.afterStart = function(){};
Scene_Map.prototype.beforeUpdate = function(){};
Scene_Map.prototype.afterUpdate = function(){};
Scene_Map.prototype.beforeTerminate = function(){};
Scene_Map.prototype.afterTerminate = function(){};

}

/* ------------------------------ SCENE BATTLE ------------------------------ */

{

Alias.Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    this.beforeUpdate();
    Alias.Scene_Battle_update.call(this);
    this.afterUpdate();
};

Scene_Battle.prototype.beforeUpdate = function(){};
Scene_Battle.prototype.afterUpdate = function(){};

}

/* ========================================================================== */
/*                                   SPRITES                                  */
/* ========================================================================== */

/* ========================================================================== */
/*                                   WINDOWS                                  */
/* ========================================================================== */


/* ========================================================================== */
/*                                 NEW CLASSES                                */
/* ========================================================================== */

/* ----------------------------- ELI SCENE BASE ----------------------------- */

Eli.Scene_MenuBase = class extends Scene_MenuBase {

    constructor(){
        super();
        this._baseWidth = Graphics.boxWidth;
        this._baseHeight = Graphics.boxHeight;
    };

    createWindowLayer() {
        this._windowLayer = new WindowLayer();
        this._windowLayer.x = (Graphics.width - this._baseWidth) / 2;
        this._windowLayer.y = (Graphics.height - this._baseHeight) / 2;
        this.addChild(this._windowLayer);
    };

    buttonAreaTop() {
        if (this.isBottomButtonMode()) {
            return this._baseHeight - this.buttonAreaHeight();
        } else {
            return 0;
        }
    };

    mainAreaHeight() {
        return this._baseHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    };

    helpWindowRect() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = this._baseWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    createCancelButton() {  
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = this._baseWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this.addWindow(this._cancelButton);
    };

};

/* ------------------------------- ELI BUTTON ------------------------------- */

Eli.Sprite_Button = class extends Sprite_Clickable{

    constructor(buttonType, image){
        super(buttonType, image);
    };

    initialize(buttonType, image){
        Sprite.prototype.initialize.call(this);
        this._image = image
        this._buttonType = buttonType;
        this._clickHandler = null;
        this._coldFrame = null;
        this._hotFrame = null;
        this.loadButtonImage();
    };

    loadButtonImage() {
        this.bitmap = ImageManager.loadSystem(this._image);
        this.bitmap.addLoadListener(this.setupFrames.bind(this))
    };

    setupFrames() {
        const x = 0;
        const width = this.bitmap.width;
        const height = this.bitmap.height/2;
        this.setColdFrame(x, 0, width, height);
        this.setHotFrame(x, height, width, height);
        this.updateFrame();
        this.updateOpacity();
    };

    setColdFrame(x, y, width, height) {
        this._coldFrame = new Rectangle(x, y, width, height);
    };
    
    setHotFrame(x, y, width, height) {
        this._hotFrame = new Rectangle(x, y, width, height);
    };

    updateFrame() {
        const frame = this.isPressed() ? this._hotFrame : this._coldFrame;

        if (frame) {
            this.setFrame(frame.x, frame.y, frame.width, frame.height);
        }
    };

    updateOpacity() {
        this.opacity = this._pressed ? 255 : 192;
    };

    update() {
        Sprite.prototype.update.call(this);
        this.updateFrame();
        this.updateOpacity();
        this.processTouch();
    };

    setClickHandler(method) {
        this._clickHandler = method;
    };
    
    onClick() {
        if (this._clickHandler) {
            this._clickHandler();
        } else {
            Input.virtualClick(this._buttonType);
        }
    };

};

/* ----------------------------- SPRITE BASE MV ----------------------------- */

Eli.Sprite_MV = class extends Sprite {

    constructor() {
        super();
    }

    initialize() {
        super.initialize();
        this._animationSprites = [];
        this._effectTarget = this;
    }

    update() {
        super.update();
        this.updateVisibility();
        this.updateAnimationSprites();
    }

    updateAnimationSprites() {
        if (this._animationSprites.length > 0) {
            const sprites = this._animationSprites.clone();
            this._animationSprites = [];

            for (let i = 0, l = sprites.length; i < l; i++) {
                const sprite = sprites[i];

                if (sprite.isPlaying()) {
                    this._animationSprites.push(sprite);
                } else {
                    sprite.remove();
                }
            }
        }
    }

    startAnimation(animation, mirror, delay) {
        const sprite = new Eli.Sprite_AnimationMV();
        sprite.setup(this._effectTarget, animation, mirror, delay);
        this.parent.addChild(sprite);
        this._animationSprites.push(sprite);
    }

    isAnimationPlaying() {
        return this._animationSprites.length > 0;
    }
}

/* ------------------------ SPRITE ANIMATION FROM MV ------------------------ */

Eli.Sprite_AnimationMV = class extends Sprite {

    constructor() {
        super();
        this._checker1 = {};
        this._checker2 = {};
    }

    initialize() {
        super.initialize();
        this._reduceArtifacts = true;
        this.initMembers();
    }

    initMembers() {
        this._target = null;
        this._animation = null;
        this._mirror = false;
        this._delay = 0;
        this._rate = 4;
        this._duration = 0;
        this._flashColor = [0, 0, 0, 0];
        this._flashDuration = 0;
        this._screenFlashDuration = 0;
        this._hidingDuration = 0;
        this._bitmap1 = null;
        this._bitmap2 = null;
        this._cellSprites = [];
        this._screenFlashSprite = null;
        this._duplicated = false;
        this.z = 8;
    }

    setup(target, animation, mirror, delay) {
        this._target = target;
        this._animation = animation;
        this._mirror = mirror;
        this._delay = delay;

        if (this._animation) {
            this.remove();
            this.setupRate();
            this.setupDuration();
            this.loadBitmaps();
            this.createSprites();
        }
    }

    remove() {
        if (this.parent && this.parent.removeChild(this)) {
            this._target.setBlendColor([0, 0, 0, 0]);
            this._target.show();
        }
    }

    setupRate() {
        this._rate = 4;
    }

    setupDuration() {
        this._duration = this._animation.frames.length * this._rate + 1;
    }

    update() {
        super.update();
        this.updateMain();
        this.updateFlash();
        this.updateScreenFlash();
        this.updateHiding();
        this._checker1 = {};
        this._checker2 = {};
    }

    updateFlash() {
        if (this._flashDuration > 0) {
            let d = this._flashDuration--;
            this._flashColor[3] *= (d - 1) / d;
            this._target.setBlendColor(this._flashColor);
        }
    }

    updateScreenFlash() {
        if (this._screenFlashDuration > 0) {
            let d = this._screenFlashDuration--;

            if (this._screenFlashSprite) {
                this._screenFlashSprite.x = -this.absoluteX();
                this._screenFlashSprite.y = -this.absoluteY();
                this._screenFlashSprite.opacity *= (d - 1) / d;
                this._screenFlashSprite.visible = (this._screenFlashDuration > 0);
            }
        }
    }

    absoluteX() {
        let x = 0;
        let object = this;

        while (object) {
            x += object.x;
            object = object.parent;
        }

        return x;
    }

    absoluteY() {
        let y = 0;
        let object = this;

        while (object) {
            y += object.y;
            object = object.parent;
        }

        return y;
    }

    updateHiding() {
        if (this._hidingDuration > 0) {
            this._hidingDuration--;

            if (this._hidingDuration === 0) {
                this._target.show();
            }
        }
    }

    isPlaying() {
        return this._duration > 0;
    }

    loadBitmaps() {
        const name1 = this._animation.animation1Name;
        const name2 = this._animation.animation2Name;
        const hue1 = this._animation.animation1Hue;
        const hue2 = this._animation.animation2Hue;

        this._bitmap1 = ImageManager.loadAnimation(name1, hue1);
        this._bitmap2 = ImageManager.loadAnimation(name2, hue2);
    }

    isReady() {
        return this._bitmap1 && this._bitmap1.isReady() && this._bitmap2 && this._bitmap2.isReady();
    }

    createSprites() {
        if (!this._checker2[this._animation]) {
            this.createCellSprites();

            if (this._animation.position === 3) {
                this._checker2[this._animation] = true;
            }

            this.createScreenFlashSprite();
        }

        if (this._checker1[this._animation]) {
            this._duplicated = true;
        } else {
            this._duplicated = false;

            if (this._animation.position === 3) {
                this._checker1[this._animation] = true;
            }
        }
    }

    createCellSprites() {
        this._cellSprites = [];

        for (let i = 0; i < 16; i++) {
            const sprite = new Sprite();
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            this._cellSprites.push(sprite);
            this.addChild(sprite);
        }
    }

    createScreenFlashSprite() {
        this._screenFlashSprite = new ScreenSprite();
        this.addChild(this._screenFlashSprite);
    }

    updateMain() {
        if (this.isPlaying() && this.isReady()) {

            if (this._delay > 0) {
                this._delay--;
            } else {
                this._duration--;
                this.updatePosition();

                if (this._duration % this._rate === 0) {
                    this.updateFrame();
                }
            }
        }
    }

    updatePosition() {
        if (this._animation.position === 3) {
            this.x = this.parent.width / 2;
            this.y = this.parent.height / 2;
        } else {
            const parent = this._target.parent;
            const grandparent = parent ? parent.parent : null;
            this.x = this._target.x;
            this.y = this._target.y;

            if (this.parent === grandparent) {
                this.x += parent.x;
                this.y += parent.y;
            }

            if (this._animation.position === 0) {
                this.y -= this._target.height;
            } else if (this._animation.position === 1) {
                this.y -= this._target.height / 2;
            }
        }
    }

    updateFrame() {
        if (this._duration > 0) {
            const frameIndex = this.currentFrameIndex();

            this.updateAllCellSprites(this._animation.frames[frameIndex]);

            this._animation.timings.forEach(function (timing) {

                if (timing.frame === frameIndex) {
                    this.processTimingData(timing);
                }
            }, this);
        }
    }

    currentFrameIndex() {
        return (this._animation.frames.length -
            Math.floor((this._duration + this._rate - 1) / this._rate));
    }

    updateAllCellSprites(frame) {
        for (let i = 0, l = this._cellSprites.length; i < l; i++) {
            const sprite = this._cellSprites[i];

            if (i < frame.length) {
                this.updateCellSprite(sprite, frame[i]);
            } else {
                sprite.visible = false;
            }
        }
    }

    updateCellSprite(sprite, cell) {
        const pattern = cell[0];

        if (pattern >= 0) {
            const sx = pattern % 5 * 192;
            const sy = Math.floor(pattern % 100 / 5) * 192;
            const mirror = this._mirror;
            sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
            sprite.setFrame(sx, sy, 192, 192);
            sprite.x = cell[1];
            sprite.y = cell[2];
            sprite.rotation = cell[4] * Math.PI / 180;
            sprite.scale.x = cell[3] / 100;

            if (cell[5]) {
                sprite.scale.x *= -1;
            }

            if (mirror) {
                sprite.x *= -1;
                sprite.rotation *= -1;
                sprite.scale.x *= -1;
            }

            sprite.scale.y = cell[3] / 100;
            sprite.opacity = cell[6];
            sprite.blendMode = cell[7];
            sprite.visible = true;
        } else {
            sprite.visible = false;
        }
    }

    processTimingData(timing) {
        const duration = timing.flashDuration * this._rate;

        switch (timing.flashScope) {
            case 1:
                this.startFlash(timing.flashColor, duration);
                break;
            case 2:
                this.startScreenFlash(timing.flashColor, duration);
                break;
            case 3:
                this.startHiding(duration);
                break;
        }

        if (!this._duplicated && timing.se) {
            AudioManager.playSe(timing.se);
        }
    }

    startFlash(color, duration) {
        this._flashColor = color.clone();
        this._flashDuration = duration;
    }

    startScreenFlash(color, duration) {
        this._screenFlashDuration = duration;

        if (this._screenFlashSprite) {
            this._screenFlashSprite.setColor(color[0], color[1], color[2]);
            this._screenFlashSprite.opacity = color[3];
        }
    }

    startHiding(duration) {
        this._hidingDuration = duration;
        this._target.hide();
    }
}

/* ========================================================================== */
/*                                  MENU CORE                                 */
/* ========================================================================== */

Eli.Window_Base = class extends Window_Base{

    constructor(rect, easingSettings){
        super(rect);
        this.initEasingMembers();
        this.setupEasing(easingSettings)
    }

    initEasingMembers(){
        this.easing = {
            origin: {x: 0, y:0},
            target: {x: 0, y:0},
            closeDuration: 0,
            openDuration: 0,
            duration: 0,
            type: '',
        }
    }

    setupEasing(easingSettings){
        this.easing = easingSettings;
    }

    getOrigin(){
        return this.easing.origin;
    }

    getTarget(){
        return this.easing.target;
    }

    getCloseDuration(){
        return this.easing.closeDuration;
    }

    setCloseDuration(value){
        this.easing.closeDuration = value;
    }

    getOpenDuration(){
        return this.easing.openDuration;
    }

    setOpenDuration(value){
        this.easing.openDuration = value;
    }

    getEasingDuration(){
        return this.easing.duration;
    }

    getEasingType(){
        return this.easing.type;
    }

    setEasingType(value){
        this.easing.type = value;
    }

    setXtoOrigin(elapsedTime){
        this.x = this.getTarget().x + elapsedTime * (this.getOrigin().x - this.getTarget().x);
    }

    setXtoTarget(elapsedTime){
        this.x = this.getOrigin().x + elapsedTime * (this.getTarget().x - this.getOrigin().x)
    }

    setYtoOrigin(elapsedTime){
        this.y = this.getTarget().y + elapsedTime * (this.getOrigin().y - this.getTarget().y);
    }

    setYtoTarget(elapsedTime){
        this.y = this.getOrigin().y + elapsedTime * (this.getTarget().y - this.getOrigin().y);
    }

    moveToOrigin(elapsedTime){
        this.setXtoOrigin(elapsedTime);
        this.setYtoOrigin(elapsedTime);
    }

    moveToTarget(elapsedTime){
        this.setXtoTarget(elapsedTime);
        this.setYtoTarget(elapsedTime);
    }

    updateOpenMovement(){
        if(this.getOpenDuration() < this.getEasingDuration()){
            this.setCloseDuration(0);
            this.easing.openDuration++;
	
            let elapsedTime = this.easing.openDuration / this.easing.duration;
            elapsedTime = EliEasing.execute(this.getEasingType(), elapsedTime);
        
            this.moveToTarget(elapsedTime);
        
        }else{
            this.x = this.getTarget().x;
            this.y = this.getTarget().y;
        }
    }

    updateCloseMovement(){
        if(this.getCloseDuration() < this.getEasingDuration()){
            this.setOpenDuration(0);
            this.easing.closeDuration++;
	
            let elapsedTime = this.easing.closeDuration / this.easing.duration;
            elapsedTime = EliEasing.execute(this.getEasingType(), elapsedTime);
            
            this.moveToOrigin(elapsedTime);
        }
    }

    isClosed() {
        return this.y === this.getOrigin().y && this.x === this.getOrigin().x;
    }
    
    isOpen() {
        return this.y === this.getTarget().y && this.x === this.getTarget().x;
    }
    
    updateOpen() {
        if (this._opening) {
            this.updateOpenMovement();
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    }
    
    updateClose() {
        if (this._closing) {
            this.updateCloseMovement();
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    }

}

Eli.Window_Scrollable = class extends Eli.Window_Base{

    constructor(rect){
        super(rect)
    }

    initialize(rect) {
        super.initialize(rect);
        this._scrollX = 0;
        this._scrollY = 0;
        this._scrollBaseX = 0;
        this._scrollBaseY = 0;
        this.clearScrollStatus();
    };
    
    clearScrollStatus() {
        this._scrollTargetX = 0;
        this._scrollTargetY = 0;
        this._scrollDuration = 0;
        this._scrollAccelX = 0;
        this._scrollAccelY = 0;
        this._scrollTouching = false;
        this._scrollLastTouchX = 0;
        this._scrollLastTouchY = 0;
        this._scrollLastCursorVisible = false;
    };
    
    scrollX() {
        return this._scrollX;
    };
    
    scrollY() {
        return this._scrollY;
    };
    
    scrollBaseX() {
        return this._scrollBaseX;
    };
    
    scrollBaseY() {
        return this._scrollBaseY;
    };
    
    scrollTo(x, y) {
        const scrollX = x.clamp(0, this.maxScrollX());
        const scrollY = y.clamp(0, this.maxScrollY());

        if (this._scrollX !== scrollX || this._scrollY !== scrollY) {
            this._scrollX = scrollX;
            this._scrollY = scrollY;
            this.updateOrigin();
        }
    };
    
    scrollBy(x, y) {
        this.scrollTo(this._scrollX + x, this._scrollY + y);
    };
    
    smoothScrollTo(x, y) {
        this._scrollTargetX = x.clamp(0, this.maxScrollX());
        this._scrollTargetY = y.clamp(0, this.maxScrollY());
        this._scrollDuration = Input.keyRepeatInterval;
    };
    
    smoothScrollBy(x, y) {
        if (this._scrollDuration === 0) {
            this._scrollTargetX = this.scrollX();
            this._scrollTargetY = this.scrollY();
        }
        this.smoothScrollTo(this._scrollTargetX + x, this._scrollTargetY + y);
    };
    
    setScrollAccel(x, y) {
        this._scrollAccelX = x;
        this._scrollAccelY = y;
    };
    
    overallWidth() {
        return this.innerWidth;
    };
    
    overallHeight() {
        return this.innerHeight;
    };
    
    maxScrollX() {
        return Math.max(0, this.overallWidth() - this.innerWidth);
    };
    
    maxScrollY() {
        return Math.max(0, this.overallHeight() - this.innerHeight);
    };
    
    scrollBlockWidth() {
        return this.itemWidth();
    };
    
    scrollBlockHeight() {
        return this.itemHeight();
    };
    
    smoothScrollDown(n) {
        this.smoothScrollBy(0, this.itemHeight() * n);
    };
    
    smoothScrollUp(n) {
        this.smoothScrollBy(0, -this.itemHeight() * n);
    };
    
    update() {
        super.update();
        this.processWheelScroll();
        this.processTouchScroll();
        this.updateSmoothScroll();
        this.updateScrollAccel();
        this.updateArrows();
        this.updateOrigin();
    };
    
    processWheelScroll() {
        if (this.isWheelScrollEnabled() && this.isTouchedInsideFrame()) {
            const threshold = 20;

            if (TouchInput.wheelY >= threshold) {
                this.smoothScrollDown(1);
            }
            if (TouchInput.wheelY <= -threshold) {
                this.smoothScrollUp(1);
            }
        }
    };
    
    processTouchScroll() {
        if (this.isTouchScrollEnabled()) {

            if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
                this.onTouchScrollStart();
            }

            if (this._scrollTouching) {

                if (TouchInput.isReleased()) {
                    this.onTouchScrollEnd();
                } else if (TouchInput.isMoved()) {
                    this.onTouchScroll();
                }
            }
        }
    };
    
    isWheelScrollEnabled() {
        return this.isScrollEnabled();
    };
    
    isTouchScrollEnabled() {
        return this.isScrollEnabled();
    };
    
    isScrollEnabled() {
        return true;
    };
    
    isTouchedInsideFrame() {
        const touchPos = new Point(TouchInput.x, TouchInput.y);
        const localPos = this.worldTransform.applyInverse(touchPos);

        return this.innerRect.contains(localPos.x, localPos.y);
    };
    
    onTouchScrollStart() {
        this._scrollTouching = true;
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this._scrollLastCursorVisible = this.cursorVisible;
        this.setScrollAccel(0, 0);
    };
    
    onTouchScroll() {
        const accelX = this._scrollLastTouchX - TouchInput.x;
        const accelY = this._scrollLastTouchY - TouchInput.y;

        this.setScrollAccel(accelX, accelY);
        this._scrollLastTouchX = TouchInput.x;
        this._scrollLastTouchY = TouchInput.y;
        this.cursorVisible = false;
    };
    
    onTouchScrollEnd() {
        this._scrollTouching = false;
        this.cursorVisible = this._scrollLastCursorVisible;
    };
    
    updateSmoothScroll() {
        if (this._scrollDuration > 0) {
            const d = this._scrollDuration;
            const deltaX = (this._scrollTargetX - this._scrollX) / d;
            const deltaY = (this._scrollTargetY - this._scrollY) / d;
            this.scrollBy(deltaX, deltaY);
            this._scrollDuration--;
        }
    };
    
    updateScrollAccel() {
        if (this._scrollAccelX !== 0 || this._scrollAccelY !== 0) {
            this.scrollBy(this._scrollAccelX, this._scrollAccelY);
            this._scrollAccelX *= 0.92;
            this._scrollAccelY *= 0.92;

            if (Math.abs(this._scrollAccelX) < 1) {
                this._scrollAccelX = 0;
            }
            if (Math.abs(this._scrollAccelY) < 1) {
                this._scrollAccelY = 0;
            }
        }
    };
    
    updateArrows() {
        this.downArrowVisible = this._scrollY < this.maxScrollY();
        this.upArrowVisible = this._scrollY > 0;
    };
    
    updateOrigin() {
        const blockWidth = this.scrollBlockWidth() || 1;
        const blockHeight = this.scrollBlockHeight() || 1;
        const baseX = this._scrollX - (this._scrollX % blockWidth);
        const baseY = this._scrollY - (this._scrollY % blockHeight);

        if (baseX !== this._scrollBaseX || baseY !== this._scrollBaseY) {
            this.updateScrollBase(baseX, baseY);
            this.paint();
        }

        this.origin.x = this._scrollX % blockWidth;
        this.origin.y = this._scrollY % blockHeight;
    };
    
    updateScrollBase(baseX, baseY) {
        const deltaX = baseX - this._scrollBaseX;
        const deltaY = baseY - this._scrollBaseY;

        this._scrollBaseX = baseX;
        this._scrollBaseY = baseY;
        this.moveCursorBy(-deltaX, -deltaY);
        this.moveInnerChildrenBy(-deltaX, -deltaY);
    };
    
    paint() {
        // to be overridden
    };

}

/* ========================================================================== */
/*                                     END                                    */
/* ========================================================================== */

/*
© ® » «  ∆ ™ ≠ ≤ ≥ ▫ ♫
• ■ ▪ ● ▬ ♦
► ▲ ▼ ◄
→ ← ↑ ↔ ↨
*/

/* Put button on scene map

Eli.Alias.SceneMap_createButtons = SceneMap.createButtons;
SceneMap.createButtons = function() {
    Eli.Alias.SceneMap_createButtons.call(this);
    this.createCustomButton();
};

SceneMap.createCustomButton = function() {
    if (!ConfigManager.touchUI || customButtonIsEnabled) return;
    this._customButton = new Sprite_EliButton("buttonName", "buttonImage");
    this._customButton.x = 0
    this._customButton.y = 0
    this._customButton.visible = false;
    this._customButton.setClickHandler(this.callCustomScene.bind(this));
    this.addWindow(this._customButton);
};

SceneMap.callCustomScene = function() {
    $gameTemp.clearDestination();
    SoundManager.playButtonSound();
    SceneManager.push(Scene_Custom);
    this._waitCount = 2;
};

Eli.alias.SceneMap_afterUpdate = SceneMap.afterUpdate;
SceneMap.afterUpdate = function() {
    Eli.Alias.SceneMap_afterUpdate.call(this);
    this.updateCustomScreenButton();
    this.updateCustomKeyButton();
};

SceneMap.updateCustomScreenButton = function() {
    if (this._customButton) {
        this._customButton.visible = ConfigManager.touchUI;
    }
};

SceneMap.updateCustomKeyButton = function(){
    if(Input.isTriggered("pause")){
        this.callScenePause();
    }
};

Eli.Alias.SceneMap_isAnyButtonPressed = SceneMap.isAnyButtonPressed;
SceneMap.isAnyButtonPressed = function() {
    const alias = Eli.Alias.SceneMap_isAnyButtonPressed.call(this);
    return alias || this.isCustomButtonPressed();
};

SceneMap.isCustomButtonPressed = function(){
    return this._customButton && this._customButton.isPressed();
};

SceneMap.callSceneCustom = function(){
    
    SoundManager.playButtonSound();
    SceneManager.push(Scene_Custom);
};

Eli.Alias.SceneMap_beforeTerminate = SceneMap.beforeTerminate;
SceneMap.beforeTerminate = function() {
    Eli.Alias.SceneMap_beforeTerminate.call(this);
    this.hideCustomGameButton();
    this.extras();
};

SceneMap.hideCustomGameButton = function() {
    if (this._customButton) {
        this._customButton.visible = false;
        this._customButton = false;
    }
};

SceneMap.extras = function(){

};
this._paramsCurve[i] = parameterCurve.slice(i*3, (3*(i+1)));
Eli.CustomParameterCurve.regExp = /([\w]+)(:?)([^#]*)/g;

// Input.gamepadMapper = {
// 0: "A",
// 1: "B",
// 2: "X",
// 3: "Y",
// 4: "LB",
// 5: "RB",
// 6: LT
// 7: RT
// 8: select
// 9: start
// 10: L3
// 11: R3
// 12: up,
// 13: down,
// 14: left,
// 15: right
// };

*/

}