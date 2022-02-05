//=============================================================================
// JP_battle_hp.js
//=============================================================================
/*:
* @target MZ
* @plugindesc V1.0 战斗场景显示战斗双方的血条V1.0.1 MZ版本
* @author 青灯独酌
*
* @param ----敌人血条设置----
*
* @param enemy_hp
* @desc 是否显示敌人血条
* @type boolean
* @on 开启
* @off 不开启
* @default true
* @parent ----敌人血条设置----
*
* @param enemy_hp_x
* @desc 敌人血条的x坐标
* @default 0
* @parent ----敌人血条设置----
*
* @param enemy_hp_y
* @desc 敌人血条的y坐标
* @default 0
* @parent ----敌人血条设置----
*
* @param ----队友血条设置----
*
* @param player_hp
* @desc 是否显示角色血条
* @type boolean
* @on 开启
* @off 不开启
* @default true
* @parent ----队友血条设置----
*
* @param player_hp_x
* @desc 角色血条的x坐标
* @default 0
* @parent ----队友血条设置----
*
* @param player_hp_y
* @desc 角色血条的y坐标
* @default 0
* @parent ----队友血条设置----
*
* @help
* 1、战斗场景显示敌人与角色的血条、蓝条
* 2、战斗场景显示敌人与角色的名字
* 3、调整状态图标位置
* =============================================================================
* 版本：1.0.1
* 兼容yep侧视战斗图插件。
* =============================================================================
* 版本：1.0.0
* 基础功能完成。
* =============================================================================
*/

var Imported = Imported || {};
Imported.JP_battle_hp = true;
var Jp = Jp || {};
//参数处理
Jp.battle_hp = PluginManager.parameters('JP_battle_hp');
Jp.battle_hp.enemy_hp = [Jp.battle_hp['enemy_hp'],Jp.battle_hp['enemy_hp_x'],Jp.battle_hp['enemy_hp_y']];
Jp.battle_hp.player_hp = [Jp.battle_hp['player_hp'],Jp.battle_hp['player_hp_x'],Jp.battle_hp['player_hp_y']];
//=======================================================================

//*给敌人创建血条
Jp.enemy_hp = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function (battler) {
	Jp.enemy_hp.call(this, battler);
	if(Jp.battle_hp.enemy_hp[0]=='true'){
		this.battler_hp = new Jp_battle_hp(battler);
		if(Imported.YEP_X_AnimatedSVEnemies = true){//mV版本兼容yep侧视图
			if(this._svBattlerEnabled) {
				this.battler_hp.rotation *= -1;
				this.battler_hp.x *= -1;
				this.battler_hp.scale.x *= -1;
			}
		}
		this.battler_hp.move(Jp.battle_hp.enemy_hp[1],Jp.battle_hp.enemy_hp[2]);
		this.addChild(this.battler_hp);
	}
};

//重写敌人状态图标位置
Jp.enemy_hp_updateStateSprite = Sprite_Enemy.prototype.updateStateSprite;
Sprite_Enemy.prototype.updateStateSprite = function() {
    if(Jp.battle_hp.enemy_hp[0] == 'true'){
		var x = Number(Jp.battle_hp.player_hp[1]) + 68;
		var y = Number(Jp.battle_hp.player_hp[2]) + 6;
		this._stateIconSprite.x = x;
		this._stateIconSprite.y = y;
	}else return Jp.enemy_hp_updateStateSprite.call(this);
	
};

//*给角色创建血条
Jp.Actor_hp_setBattler = Sprite_Actor.prototype.setBattler;
Sprite_Actor.prototype.setBattler = function(battler) {
	Jp.Actor_hp_setBattler.call(this,battler);
	if(Jp.battle_hp.player_hp[0]=='true'){
		if(this.Actor_hp) this.removeChild(this.Actor_hp);
		this.Actor_hp = new Jp_battle_hp(battler);
		this.Actor_hp.move(Jp.battle_hp.player_hp[1],Jp.battle_hp.player_hp[2]);
		this.addChild(this.Actor_hp);
		this._stateIconSprite2.setup(battler);
	}
};
//*给角色创建状态图标
Jp.Actor_hp_initMembers = Sprite_Actor.prototype.initMembers;
Sprite_Actor.prototype.initMembers = function() {
    Jp.Actor_hp_initMembers.call(this);
	if(Jp.battle_hp.player_hp[0] == 'true'){
		this.createStateIconSprite();
		this.updateStateSprite();
	}
};

Sprite_Actor.prototype.createStateIconSprite = function() {
    this._stateIconSprite2 = new Sprite_StateIcon();
    this.addChild(this._stateIconSprite2);
};

Sprite_Actor.prototype.updateStateSprite = function() {
    var x = Number(Jp.battle_hp.player_hp[1]) + 68;
	var y = Number(Jp.battle_hp.player_hp[2]) + 6;
	this._stateIconSprite2.x = x;
	this._stateIconSprite2.y = y;
};

//定义血条
 function Jp_battle_hp() {
    this.initialize.apply(this, arguments)
}
Jp_battle_hp.prototype = Object.create(Sprite.prototype);
Jp_battle_hp.prototype.constructor = Jp_battle_hp;
//==============================
//初始化设置
Jp_battle_hp.prototype.initialize = function(actor) {
	Sprite.prototype.initialize.call(this);
	this.drawHp(actor);//
}

Jp_battle_hp.prototype.drawHp =function(actor){
	if(!actor) return;
	this.actor = actor;
	var Mhp = this.actor.mhp; 
	var Mmp = this.actor.mmp;
	var Hp = this.actor.hp;
	var Mp = this.actor.mp;
	this.old_hp = this.actor.hp;
	this.old_mp = this.actor.mp;
	this.color_bg = '#000000';
	this.color_hp = '#ff0000';
	this.color_mp = '#00ffff';
	var x = 0;
	var y = 0;
	this.battle_hp = new Sprite(new Bitmap(100, 50));
	this.battle_hp.move(-50,0);
	this.battle_hp.bitmap.fontSize = 12;
	this.battle_hp.bitmap.fontFace = $gameSystem.mainFontFace();//mz版本的字体
	this.battle_hp.bitmap.fillRect(x, y, 100, 10,this.color_bg);
	this.battle_hp.bitmap.fillRect(x + 1, y + 1, 98 * Hp/Mhp, 8,this.color_hp);
	this.battle_hp.bitmap.fillRect(x, y+12, 100, 10,this.color_bg);
	this.battle_hp.bitmap.fillRect(x + 1, y + 13, 98 * Mp/Mmp, 8,this.color_mp);
	if(Mhp>=10000){
		var text_hp = Hp;
	}else var text_hp = Hp + '/' + Mhp;
	if(Mmp>=10000){
		var text_mp = Mp;
	}else var text_mp = Mp + '/' + Mmp;
	this.battle_hp.bitmap.drawText(text_hp, x, y - 20, 100, 50,'center');
	this.battle_hp.bitmap.drawText(text_mp, x, y - 7, 100, 50, 'center')
	this.addChild(this.battle_hp);
	var text_name = this.actor.name();
	this.battle_name = new Sprite(new Bitmap(100, 50));
	this.battle_name.move(-50,-40);
	this.battle_name.bitmap.fontSize = 20;
	this.battle_name.bitmap.fontFace = $gameSystem.mainFontFace();//mz版本的字体
	this.battle_name.bitmap.drawText(text_name, x, y, 100, 50,'center');
	this.addChild(this.battle_name);
	
};

//*刷新
Jp_battle_hp.prototype.Jp_refresh_hp = function() {
	this.battle_hp.bitmap.clear();
	var Mhp = this.actor.mhp; 
	var Mmp = this.actor.mmp;
	var Hp = this.actor.hp;
	var Mp = this.actor.mp;
	var x = 0;
	var y = 0;
	this.battle_hp.bitmap.fillRect(x, y, 100, 10,this.color_bg);
	this.battle_hp.bitmap.fillRect(x + 1, y + 1, 98 * Hp/Mhp, 8,this.color_hp);
	this.battle_hp.bitmap.fillRect(x, y+12, 100, 10,this.color_bg);
	this.battle_hp.bitmap.fillRect(x + 1, y + 13, 98 * Mp/Mmp, 8,this.color_mp);
	if(Mhp>=10000){
		var text_hp = Hp;
	}else var text_hp = Hp + '/' + Mhp;
	if(Mmp>=10000){
		var text_mp = Mp;
	}else var text_mp = Mp + '/' + Mmp;
	this.battle_hp.bitmap.drawText(text_hp, x, y-20, 100, 50, 'center');
	this.battle_hp.bitmap.drawText(text_mp, x, y - 7, 100, 50, 'center');
};
	
//更新窗口信息
Jp_battle_hp.prototype.update = function() {
	if(!this.battle_hp) return;
	if(this.old_hp != this.actor.hp || this.old_mp != this.actor.mp){
		this.Jp_refresh_hp();
		this.old_hp = this.actor.hp;
		this.old_mp = this.actor.mp;
	}
};
