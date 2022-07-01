//=============================================================================
// SoR_GabWindow_Right.js
// MIT License (C) 2020 蒼竜 @soryu_rpmaker
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Latest version v1.00 (2020/07/04)
//=============================================================================

/*:ja
* @plugindesc ＜おしゃべりポップアップ Type:R＞
* @author 蒼竜　@soryu_rpmaker
* @help 1～2行の簡易的なチャットウィンドウを表示します。
* スクリプトコマンドからの入力に反応して、マップ画面および戦闘画面で随時表示されます。
*
*　機能の広範化により、製作者ごとに無駄な処理が氾濫することを抑制するため、
* UIデザインの方向性ごとにスクリプトファイルを分けています。
* 好みのスタイルのものを1つだけ選んで導入してください。
* (このスクリプトは、"Type-R"のものです。)
*
*
* [プラグインコマンド] text1,text2を2段構えにしてFaceID番のアクターの顔グラフィックを伴って表示します。
* PushGab FaceID text1|text2
* [プラグインコマンド] PushGabで挿入した、現在溜まっているキューを全て強制削除します。
* ForceGabClear
*
* 具体的な用例は
* https://github.com/soryu-rmv/tech_menus
* から参照してください。
*
* -----------------------------------------------------------
* バージョン情報
* -----------------------------------------------------------
* v1.00 (2020/07/04)       公開  
*
* @param WindowStyle
* @desc ウィンドウ形式 (default: 0)
* @type select
* @option 標準スキンによるウィンドウ
* @value 0
* @option 暗くする
* @value 1
* @option 独自画像を利用
* @value 2
* @default 0
*
* @param WindowSkinImage 
* @desc WindowStyleで設定したウィンドウ形式が 2.「独自画像を利用」 のときに参照する画像 (default: gab_bg)
* @type file
* @dir img/system
* @default gab_bg
* @param GabWindowYpadd_originalSkin
* @desc WindowStyleで設定したウィンドウ形式が 2.「独自画像を利用」 のときの縦の間隔の補正値(default: 0)
* @default 0
* @type number
*
* @param GabSoundSE
* @desc Gab挿入ごとに鳴らす効果音を設定します (default: 無し) 
* @type file
* @dir audio/se
*
* @param GabWindowY
* @desc 描画位置Y座標(default: 560)
* @default 560
* @type number
* @param GabWindowWidthPadd
* @desc ウィンドウ横幅に対する余白(default: 96)
* @default 96
* @type number
* @param GabWindowHeight
* @desc ウィンドウ縦幅(default: 64)
* @default 64
* @type number
* 
* @param GabWindow_baseDuration
* @desc 現在のGabの表示時間(次のGabの挿入を待つ時間)(default: 160)
* @default 160
* @type number
* @param GabWindow_keepDuration
* @desc GabWindow_baseDuration後のGabを消去するまでの待機時間(default: 400)
* @default 400
* @type number
* @param Multiple_GabSpaces
* @desc Gab同士の縦の間隔(default: 62)
* @default 62
* @type number
*
* @param GabWindowHeightPadd_ForBattle
* @desc 戦闘画面におけるGabWindowのy方向位置補正(default: -196)
* @default -196
* @type number
*
* @param FaceXPosition
* @desc 顔画像表示位置、画像中心のx座標(default: 44)
* @default 44
* @type number
* @param FaceYPosition
* @desc 顔画像表示位置、画像中心のy座標(default: 20)
* @default 20
* @type number
*
* @param scaleX_Face_default
* @desc x方向の顔画像の表示倍率(default: 0.5)
* @default 0.5
* @type number
* @param scaleY_Face_default
* @desc y方向の顔画像の表示倍率(default: 0.5)
* @default 0.5
* @type number
* @param ActorFaceRect_U
* @desc 顔画像グラフィックの表示領域(Y方向上端)(default: 0)
* @default 0
* @type number
* @param ActorFaceRect_L
* @desc Faceグラフィックの表示領域(Y方向下端)(default: 144)
* @default 144
* @type number
*
* @param MessageXPosition
* @desc メッセージ表示位置x補正、FaceXPositionを参考に調整のこと(default: 12)
* @default 12
* @type number
* @param GabStringFont
* @desc Gabフォントサイズ(default: 16)
* @default 16
* @type number
*
*/

/*:
* @plugindesc Gad对话窗口-右 <GabWindow Type-Right>
* @author @soryu_rpmaker
* @help 创建一个简单的 gab 窗口来显示几行文本。 
* 游戏通过脚本命令接受脚本命令以在地图和战斗场景
* 中显示 Gab 窗口。 
*
*　In order to avoid outburst of unnecessary functions for respective developers
* by implementing various features for attractive UI,
* script files are separated by the design.
* Thus, install just ONLY ONE script for your preference. 
* (This file is for "Type-Right".)
*
*
* -插件命令 
* [插件指令] Text1 和 text2 分两个阶段设置，并与Face ID号的角色的脸图一起显示。
* PushGab FaceID text1|text2
* //FaceID是对应数据库里”角色“的ID   例:PushGab 1，就会出现角色1的脸图。
* //text1|text2  分割线是让文本分为上下两排显示。
*
* [插件命令]强行删除当前所有PushGab插入的累积队列。
* ForceGabClear
*
* To get initial instructions, see
* https://github.com/soryu-rmv/tech_menus .
*
* -----------------------------------------------------------
* Version info.
* -----------------------------------------------------------
* v1.00 (Jul 4, 2020)       released!
*
* @param WindowStyle
* @desc Gab 窗口的样式（默认值：0） 
* @type select
* @option 带皮肤的默认窗口 
* @value 0
* @option 黑暗
* @value 1
* @option 使用原始 UI 图像 
* @value 2
* @default 0
*
* @param WindowSkinImage 
* @desc 在“使用原始 UI 图像”的情况下用于原始 Gab 窗口的图像。（默认：gab_bg） 
* @type file
* @dir img/system
* @default gab_bg
* @param GabWindowYpadd_originalSkin
* @desc 在“使用原始 UI 图像”的情况下，每个 gab 窗口的附加垂直填充。（默认值：0） 
* @default 0
* @type number
*
* @param GabSoundSE
* @desc SE 用于插入每个 Gab 窗口（默认值：无） 
* @type file
* @dir audio/se
*
* @param GabWindowY
* @desc Gab 窗口的 Y 坐标（左上角）（默认值：560） 
* @default 560
* @type number
* @param GabWindowWidthPadd
* @desc 文本内部 Gab 窗口后的填充（默认值：96） 
* @default 96
* @type number
* @param GabWindowHeight
* @desc 每个 Gab 的窗口高度（默认值：64） 
* @default 64
* @type number
* 
* @param GabWindow_baseDuration
* @desc 处理新 Gab 窗口的间隔（默认值：160） 
* @default 160
* @type number
* @param GabWindow_keepDuration
* @desc GabWindow_baseDuration 时间过去后，保持 Gab Window 的持续时间（默认值：400） 
* @default 400
* @type number
* @param Multiple_GabSpaces
* @desc 每个 Gab 的垂直空间（默认值：62） 
* @default 62
* @type number
*
* @param GabWindowHeightPadd_ForBattle
* @desc 战斗场景中 Gab 窗口的附加垂直填充（默认值：-196） 
* @default -196
* @type number
*
* @param FaceXPosition
* @desc 脸图的 X 坐标（精灵的中心）（默认值：44） 
* @default 44
* @type number
* @param FaceYPosition
* @desc 脸图的 Y 坐标（精灵的中心）（默认值：24）
* @default 24
* @type number
*
* @param scaleX_Face_default
* @desc 人脸精灵的水平比例（默认：0.5） 
* @default 0.5
* @type number
* @param scaleY_Face_default
* @desc 人脸精灵的垂直比例（默认：0.5） 
* @default 0.5
* @type number
* @param ActorFaceRect_U
* @desc 人脸精灵的显示范围（上）（默认：0） 
* @default 0
* @type number
* @param ActorFaceRect_L
* @desc 显示人脸精灵的范围（下）（默认：144） 
* @default 144
* @type number
*
* @param MessageXPosition
* @desc 窗口中 Gab 文本的填充（默认值：12） 
* @default 12
* @type number
* @param GabStringFont
* @desc Gab 文本的字体大小（默认值：16） 
* @default 16
* @type number
*
*/


var Imported = Imported || {};
if(Imported.SoR_GabWindows) throw new Error("[SoR_GabWindows] Do NOT import more than 2 types of <SoR_GabWindow> series.");
Imported.SoR_GabWindows = true;

var SoR = SoR || {};
SoR.GabParam = PluginManager.parameters('SoR_GabWindow_Right');

SoR.WindowLayoutSide = Number(SoR.GabParam['WindowLayoutSide'] || 0);

SoR.WindowStyle =　Number(SoR.GabParam['WindowStyle'] || 0);
SoR.WindowSkinImage =　String(SoR.GabParam['WindowSkinImage'] || 'gab_bg');

SoR.GabSoundSE =　String(SoR.GabParam['GabSoundSE'] || '');
SoR.GabWindowY = Number(SoR.GabParam['GabWindowY'] || 560);
SoR.GabWindowWidthPadd = Number(SoR.GabParam['GabWindowWidthPadd'] || 96);
SoR.GabWindowHeight = Number(SoR.GabParam['GabWindowHeight'] || 64);
SoR.GabWindow_baseDuration = Number(SoR.GabParam['GabWindow_baseDuration'] || 160);
SoR.GabWindow_keepDuration = Number(SoR.GabParam['GabWindow_keepDuration'] || 400);
SoR.Multiple_GabSpaces = Number(SoR.GabParam['Multiple_GabSpaces'] || 62);
SoR.GabWindowYpadd_originalSkin = Number(SoR.GabParam['GabWindowYpadd_originalSkin'] || 0);

SoR.GabWindowHeightPadd_ForBattle = Number(SoR.GabParam['GabWindowHeightPadd_ForBattle'] || -196);
SoR.FaceXPosition = Number(SoR.GabParam['FaceXPosition'] || 44);
SoR.FaceYPosition = Number(SoR.GabParam['FaceYPosition'] || 20);
SoR.scaleX_Face_default = Number(SoR.GabParam['scaleX_Face_default'] || 0.5);
SoR.scaleY_Face_default = Number(SoR.GabParam['scaleY_Face_default'] || 0.5);
SoR.ActorFaceRect_U = Number(SoR.GabParam['ActorFaceRect_U'] || 0);
SoR.ActorFaceRect_L = Number(SoR.GabParam['ActorFaceRect_L'] || 144);
SoR.MessageXPosition = Number(SoR.GabParam['MessageXPosition'] || 12);
SoR.GabStringFont = Number(SoR.GabParam['GabStringFont'] || 16);





var SoR_GabW_GI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    SoR_GabW_GI_pluginCommand.call(this, command, args);
	
    if (command === 'PushGab') this.setGabText(args);
    if (command === 'ForceGabClear') $gameTemp.clearGabCommand();
	
};

Game_Interpreter.prototype.setGabText = function(args) {
	if(!Number.isFinite(Number(args[0]))) return;
    var id = args[0];
		
	if(!args[1]) return;
	var strs = args[1].split('|');
	
	var str1 = strs[0];
	var str2;
	if(!strs[1]) str2 = '';
	else str2 = strs[1];
 
    var obj = new SoR_GabWindow(str1,str2,id);
	$gameTemp.SoR_GabPush(obj);
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

var SoR_GabW_GT_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
	SoR_GabW_GT_initialize.call(this);
    this.gab_ready_queue = [];
   // this.gab_log_queue = [];
	this.gab_duration = 0;
	this.isForceClear = false;
	this.ForceTransferClear = false;
};

//force clear gab
Game_Temp.prototype.clearGabCommand = function() {
	this.gab_ready_queue.length = 0;
	this.gab_duration = 0;
	this.isForceClear = true;
}
Game_Temp.prototype.IsForceClearGab = function() {
	return this.isForceClear;
}



Game_Temp.prototype.SoR_GabPush = function(obj) {
	this.gab_ready_queue.push(obj);
}

Game_Temp.prototype.SoR_GabPullHead = function(obj) {
	var obj = null;
	if(this.SoR_GabQueueCount() > 0){
		obj = this.gab_ready_queue[0];
	}
	
	return obj;
}
Game_Temp.prototype.SoR_GabPop = function() {
	this.gab_ready_queue.shift();
}



Game_Temp.prototype.SoR_GabQueueCount = function(){
	return this.gab_ready_queue.length;
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
var SoR_GabW_SB_initialize = Scene_Base.prototype.initialize;
Scene_Base.prototype.initialize = function() {
    SoR_GabW_SB_initialize.call(this);
		
	this.gab_duration = 0;
	this.gab_shown = [];

};

var SoR_GabW_SM_push = SceneManager.push;
SceneManager.push = function(next_scene) {
    if (this._scene instanceof Scene_Map) {
		for(var i=0; i<this._scene.gab_shown.length; i++){
			var obj = this._scene.gab_shown[i];
			obj.TempCloseGab();
			this._scene.SoR_GabField.removeChild(obj);
			if(SoR.WindowStyle == 2) this._scene.SoR_GabField.removeChild(obj.bg_img);
			if(obj.face)this._scene.SoR_GabField.removeChild(obj.face);
		}
		this._scene.gab_shown.length = 0;
    }
	
    SoR_GabW_SM_push.call(this, next_scene);
};

var SoR_GabW_GP_reserveTransfer = Game_Player.prototype.reserveTransfer;
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    SoR_GabW_GP_reserveTransfer.call(this, mapId, x, y, d, fadeType);
	$gameTemp.ForceTransferClear = true;
};

///////////////////////////////////////////////////////////////

Scene_Base.prototype.SoR_createGabWindow = function(scene) {
	this._scene = scene;
	this.SoR_GabField = new Sprite();
    this.addChild(this.SoR_GabField);
};

//
//update 
//
Scene_Base.prototype.GabWindowManager = function() {
	//reset for transition
	if($gameTemp.ForceTransferClear || $gameTemp.IsForceClearGab()){
		for(var i=0; i<this.gab_shown.length; i++){
			var obj = this.gab_shown[i];
			this.SoR_GabField.removeChild(obj);
			if(SoR.WindowStyle == 2) this.SoR_GabField.removeChild(obj.bg_img);
			if(obj.face)this.SoR_GabField.removeChild(obj.face);
		}
		this.gab_shown.length = 0;
		if($gameTemp.ForceTransferClear) $gameTemp.ForceTransferClear = false;
		if($gameTemp.IsForceClearGab()) $gameTemp.isForceClear = false;
		return;
	}	

	//create
	if($gameTemp.SoR_GabQueueCount()>0 && this.gab_duration == 0){
		var obj = $gameTemp.SoR_GabPullHead();
		if(obj!=null) this.SoR_GabSetup(obj, this._scene);
	}
	if(this.gab_duration>0) this.gab_duration--;
	
	//main update
	for(var i=0; i<this.gab_shown.length; i++){
		var obj = this.gab_shown[i];
		if(i==this.gab_shown.length-1){
			if(this.gab_duration==0){
				if($gameTemp.SoR_GabPullHead() == obj)	$gameTemp.SoR_GabPop();
				obj.keepDuration--;
			}
		}
		else obj.keepDuration--;
		
		this.gab_shown[i].shiftY(this.gab_shown.length-i-1);
	}

    //expire
	for(var i=0; i<this.gab_shown.length; i++){
		var obj = this.gab_shown[i];
		if(obj.keepDuration==0){
			this.SoR_GabField.removeChild(obj);
			if(SoR.WindowStyle == 2) this.SoR_GabField.removeChild(obj.bg_img);
			if(obj.face)this.SoR_GabField.removeChild(obj.face);
			this.gab_shown.splice(i, 1);
			i--;
		}
	}
	
}

Scene_Base.prototype.SoR_GabSetup = function(obj, scene){
		this.gab_shown.push(obj);
		this.gab_duration = obj.drawDuration;
		
		obj.setupGab(scene);
		if(SoR.WindowStyle == 2) this.SoR_GabField.addChild(obj.bg_img);
		this.SoR_GabField.addChild(obj);
		if(obj.face)this.SoR_GabField.addChild(obj.face);
		if(obj.gab_se)AudioManager.playSe(obj.gab_se);
}

////////////////////////////////////////////////////////////
// For Scene_Map
////////////////////////////////////////////////////////////
var SoR_GabW_SM_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    SoR_GabW_SM_createAllWindows.call(this);
    this.SoR_createGabWindow('Scene_Map');
};

var SoR_GabW_SM_update = Scene_Map.prototype.update;
Scene_Map.prototype.update = function() {
	SoR_GabW_SM_update.call(this);
	this.GabWindowManager();
}

////////////////////////////////////////////////////////////
// For Scene_Battle
////////////////////////////////////////////////////////////

var SoR_GabW_SB_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    SoR_GabW_SB_createAllWindows.call(this);
    this.SoR_createGabWindow('Scene_Battle');
};

var SoR_GabW_SB_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
	SoR_GabW_SB_update.call(this);
	this.GabWindowManager();
}




////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
function SoR_GabWindow() {
    this.initialize.apply(this, arguments);
}

SoR_GabWindow.prototype = Object.create(Window_Base.prototype);
SoR_GabWindow.prototype.constructor = SoR_GabWindow;

SoR_GabWindow.prototype.initialize = function(text1, text2, ID){
	Window_Base.prototype.initialize.call(this, 0, 0, 800, SoR.GabWindowHeight+16);
	
    this._text1 = text1;
    this._text2 = text2;
	this.contents.fontSize = SoR.GabStringFont;
	this.drawLength = this.CalcLength();
	this.drawDuration = this.CalcDuration();
	this.keepDuration = SoR.GabWindow_keepDuration;
	this.enter_effect = 512;
	this.x = Graphics.boxWidth- this.drawLength +this.enter_effect;
	this.Basey = SoR.GabWindowY; 
	this.y = this.Basey;
	this.diffY = 0;
	this.bg_img = null;
	this.gab_se = null;
	
	if(SoR.GabSoundSE!='') {
		this.gab_se = {
			name : SoR.GabSoundSE,
			pitch : 100,
			volume : 100
		}
	}
	
	if(ID>=1) this.face = this.GetFaceSprite(ID);
	else this.face = null;
	
	this.width = this.drawLength + SoR.GabWindowWidthPadd;
	this.height = SoR.GabWindowHeight;	
    this.openness = 0;
	
	if(SoR.WindowStyle == 0) this.setBackgroundType(0);	
	else this.setBackgroundType(2);	//no default window
	
	if(SoR.WindowStyle == 2){
		this.bg_img = new Sprite(ImageManager.loadSystem(SoR.WindowSkinImage));
	}
}


SoR_GabWindow.prototype.standardPadding = function() {
    return 6;
};


SoR_GabWindow.prototype.setupGab = function(scene){
	
	this.scene_ypadd = 0;
	if(scene == 'Scene_Battle') this.scene_ypadd = SoR.GabWindowHeightPadd_ForBattle;
	
	this.x = Graphics.boxWidth- this.drawLength + this.enter_effect;
	
	this.y = this.Basey + this.scene_ypadd;
	this.contents.clear();
	if(SoR.WindowStyle != 0) this.DrawBackground(255);
	this.DrawMessages();	 
	this.openness = 255;
	if(this.face) this.face.visible = true; 
}

SoR_GabWindow.prototype.TempCloseGab = function(){
	this.openness = 0;
	if(this.face) this.face.visible = false;
}


SoR_GabWindow.prototype.DrawMessages = function(){
	this.contents.fontSize = SoR.GabStringFont;
	var numl = 0;
	if(this._text2 == '') numl=1;

    var xpos = SoR.MessageXPosition;
	if(!this.face) xpos = SoR.FaceXPosition;

	this.drawText(this._text1, xpos, numl*10 -2, this.width, 'left');
    if(numl==0) this.drawText(this._text2, xpos, 16, this.width, 'left');
	
	
	//console.log(this.contents)
}

SoR_GabWindow.prototype.shiftY = function(tmp_y){
	if(this.y != this.Basey + this.scene_ypadd - tmp_y*SoR.Multiple_GabSpaces){
		this.diffY = (this.Basey + this.scene_ypadd - tmp_y*SoR.Multiple_GabSpaces) - this.y;
	}
	else this.diffY = 0;
	this.changeOpacity(tmp_y);
}

SoR_GabWindow.prototype.changeOpacity = function(opaLev){
	var Eraser = this.keepDuration<=45 ? (45-this.keepDuration)*5 : 0;
	
	if(SoR.WindowStyle == 0) this.opacity = 255 - opaLev*55 - Eraser;
	if(this.opacity < 0) this.opacity = 0;
	this.contents.paintOpacity = 255 - opaLev*55 - Eraser;
	if(this.contents.paintOpacity < 0) this.contents.paintOpacity = 0;
	if(this.face)this.face.opacity = this.contents.paintOpacity;

	this.contents.clear();
	if(SoR.WindowStyle != 0) this.DrawBackground(this.contents.paintOpacity);	
	this.DrawMessages(); 
	
	var op = this.contents.paintOpacity/512.0;
	var rgba = 'rgba(0, 0, 0, ' + op.toFixed(2) + ')' ;
	this.contents.outlineColor =  rgba;
}


SoR_GabWindow.prototype.update = function(){
	Window_Base.prototype.update.call(this);
	
	if(this.enter_effect>0) this.enter_effect = Math.floor(this.enter_effect/1.25);
	else this.enter_effect = 0;
		
	this.x = Graphics.boxWidth- this.drawLength-SoR.GabWindowWidthPadd +this.enter_effect;
	this.y += Math.floor(this.diffY/2.25);
	if(this.face)this.face.x = Graphics.boxWidth-SoR.FaceXPosition+this.enter_effect;
	if(this.face)this.face.y = this.y+SoR.FaceYPosition + Math.floor(this.diffY/2.25);
}


SoR_GabWindow.prototype.DrawBackground = function(opa) {	
	if(SoR.WindowStyle == 1){
		var color1 = this.dimColor1();
		var color2 = this.dimColor2(); 
		this.contents.fillRect(0, 0, this.width / 2, this.height, color1);
		this.contents.gradientFillRect(this.width / 2, 0, this.width / 2, this.height, color1, color2);
	}
	else{
		this.bg_img.x = this.x;
		this.bg_img.y = this.y+SoR.GabWindowYpadd_originalSkin;
		this.bg_img.opacity = opa;
	}
}

SoR_GabWindow.prototype.CalcLength = function(){
	var x1 = this.textWidth(this._text1);
	var x2 = this._text2 == '' ? x1 : this.textWidth(this._text2);
	return x1 > x2 ? x1 : x2;
}
SoR_GabWindow.prototype.CalcDuration = function(){
	var x1 = this.textWidth(this._text1);
	var x2 = this.textWidth(this._text2);
	var base = this.textWidth('００００００００００００００００００００００');
	var time = (x1+x2)/base;
	return time > 1.0 ? Math.floor(SoR.GabWindow_baseDuration*time) : SoR.GabWindow_baseDuration; 
}

SoR_GabWindow.prototype.GetFaceSprite = function(id){
	var fname = $dataActors[id].faceName;
	var fidx  = $dataActors[id].faceIndex;
	var img = ImageManager.loadFace(fname);
	var Face_spr = new Sprite(img);	

    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
	
	var upp = SoR.ActorFaceRect_U;
	var low = SoR.ActorFaceRect_L;
	if(SoR.ActorFaceRect_U <= -1) upp = 0;	
	if(SoR.ActorFaceRect_L <= -1 || SoR.ActorFaceRect_L > Window_Base._faceHeight) low = ph;
    
	var drawarea = Math.abs(upp-low);
	Face_spr.setFrame((fidx%4) * pw, Math.floor(fidx/4)*ph+upp, pw, drawarea);
	Face_spr.scale.x = SoR.scaleX_Face_default;
	Face_spr.scale.y = SoR.scaleY_Face_default;
	Face_spr.anchor.x = 0.5;
	Face_spr.anchor.y = 0.5;
	Face_spr.x = this.x+SoR.FaceXPosition;
	Face_spr.y = this.y+SoR.FaceYPosition;
	
	return Face_spr;
}