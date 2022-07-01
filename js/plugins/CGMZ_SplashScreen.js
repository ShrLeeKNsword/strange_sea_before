/*:
 * @author Casper Gaming
 * @url https://www.caspergaming.com/plugins/cgmz/splashscreen/
 * @target MZ
 * @base CGMZ_Core
 * @orderAfter CGMZ_Core
 * @plugindesc 在标题屏幕之前创建一个启动屏幕
 * @help
 * ============================================================================
 * For terms and conditions using this plugin in your game please visit:
 * https://www.caspergaming.com/terms-of-use/
 * ============================================================================
 * Become a Patron to get access to beta/alpha plugins plus other goodies!
 * https://www.patreon.com/CasperGamingRPGM
 * ============================================================================
 * Version: 1.1.0
 * ----------------------------------------------------------------------------
 * 兼容性：仅使用我的 CGMZ 插件进行测试。
 * 为 RPG Maker MZ 1.0.0 制作
 * ------------------------------------------------- --------------------------
 * 描述：在标题屏幕之前创建一个启动屏幕。 它可以处理
 *多个飞溅，并且可以通过输入跳过飞溅。
 * ------------------------------------------------- --------------------------
 * 文档：
 * 此插件不支持插件命令。
 *
 * 淡入淡出速度是在每帧期间从不透明度中添加/减去多少
 * 褪色。
 *
 * 未完全填满屏幕的图像将居中
 *
 * 对于声音延迟和显示时间参数，60f = 1 秒
 *
 * 版本历史：
 * 1.0 - 初始版本
 *
 * 1.1.0：
 * - 增加了为每个飞溅播放声音效果的能力
 * - 添加声音延迟属性音效
 * - 优化插件代码
 *
 * @param Display Time
 * @text 显示时间
 * @type number
 * @min 1
 * @desc 确定显示飞溅的时间量（以帧为单位）。
 * @default 360
 * 
 * @param Fade Speed
 * @text 淡出速度
 * @type number
 * @min 1
 * @max 255
 * @desc 确定每次飞溅消失的速度
 * @default 2
 *
 * @param Splashes
 * @text 飞溅
 * @type struct<Splash>[]
 * @default []
 * @desc 设置启动画面/声音属性
*/
 /*~struct~Splash:
 * @param Image
 * @type file
 * @dir img/
 * @default
 * @desc 要在初始屏幕上显示的图像
 * 
 * @param Sound Effect
 * @type file
 * @dir audio/se
 * @desc 显示飞溅时播放的声音
 *
 * @param Sound Delay
 * @type number
 * @min 0
 * @default 0
 * @desc 播放音效前等待的时间（以帧为单位）
*/
var Imported = Imported || {};
Imported.CGMZ_SplashScreen = true;
var CGMZ = CGMZ || {};
CGMZ.Versions = CGMZ.Versions || {};
CGMZ.Versions["Splash Screen"] = "1.1.0";
CGMZ.SplashScreen = CGMZ.SplashScreen || {};
CGMZ.SplashScreen.parameters = PluginManager.parameters('CGMZ_SplashScreen');
CGMZ.SplashScreen.DisplayTime = Number(CGMZ.SplashScreen.parameters["Display Time"]) || 480;
CGMZ.SplashScreen.FadeSpeed = Number(CGMZ.SplashScreen.parameters["Fade Speed"]) || 2;
CGMZ.SplashScreen.Splashes = JSON.parse(CGMZ.SplashScreen.parameters["Splashes"]);
//=============================================================================
// CGMZ_Splash
//-----------------------------------------------------------------------------
// Object which stores splash data
//=============================================================================
function CGMZ_Splash() {
    this.initialize(...arguments);
}
CGMZ_Splash.prototype.constructor = CGMZ_Splash;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.initialize = function(splashData) {
	const splash = JSON.parse(splashData);
	this._imagePath = splash["Image"];
	this._se = splash["Sound Effect"];
	this._soundDelay = splash["Sound Delay"];
	this.initImage();
};
//-----------------------------------------------------------------------------
// Initialize the image
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.initImage = function() {
	const separator = this._imagePath.lastIndexOf("/");
	const filename = this._imagePath.slice(separator+1);
	const folder = "img/" + this._imagePath.slice(0, separator+1);
	this._image = ImageManager.loadBitmap(folder, filename);
};
//-----------------------------------------------------------------------------
// Determine if this splash has sound
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.hasSound = function() {
	return this._se !== "";
};
//-----------------------------------------------------------------------------
// Get the splash image
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.getImage = function() {
	return this._image;
};
//-----------------------------------------------------------------------------
// Get the splash sound effect
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.getSe = function() {
	return this._se;
};
//-----------------------------------------------------------------------------
// Get the splash sound effect delay
//-----------------------------------------------------------------------------
CGMZ_Splash.prototype.getSoundDelay = function() {
	return this._soundDelay;
};
//=============================================================================
// CGMZ_Scene_SplashScreen
//-----------------------------------------------------------------------------
// Scene to show splash images and then transfer to title scene.
//=============================================================================
function CGMZ_Scene_SplashScreen() {
    this.initialize(...arguments);
}
CGMZ_Scene_SplashScreen.prototype = Object.create(Scene_Base.prototype);
CGMZ_Scene_SplashScreen.prototype.constructor = CGMZ_Scene_SplashScreen;
//-----------------------------------------------------------------------------
// Initialize
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
	this._timer = 0;
	this._fadeMode = 'none';
	this._fastFade = false;
	this._isReady = true;
	this._image = null;
	this._index = 0;
	this._hasSound = false;
	this._se = "";
	this._soundDelay = 0;
	this._soundPlayed = false;
	this._splashes = this.initSplashes();
};
//-----------------------------------------------------------------------------
// Initialize splash objects
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.initSplashes = function() {
    let splashes = [];
	CGMZ.SplashScreen.Splashes.forEach((splash) => {
		splashes.push(new CGMZ_Splash(splash));
	});
	return splashes;
};
//-----------------------------------------------------------------------------
// Create splash scene assets
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.createImage();
};
//-----------------------------------------------------------------------------
// Create first splash image
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.createImage = function() {
    this._image = new Sprite(this._splashes[0].getImage());
	this._image.opacity = 0;
	this.addChild(this._image);
};
//-----------------------------------------------------------------------------
// Change image bitmap to next image
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.splash = function() {
	return this._splashes[this._index];
};
//-----------------------------------------------------------------------------
// Change image bitmap to next image
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.setNewImage = function() {
	const splash = this.splash();
    this._image.bitmap = splash.getImage();
	this._image.opacity = 0;
	this._hasSound = splash.hasSound();
	this._soundDelay = splash.getSoundDelay();
	this._se = {name: splash.getSe(), pan: 0, pitch: 100, volume: 100};
	this._soundPlayed = false;
	AudioManager.stopSe();
};
//-----------------------------------------------------------------------------
// Update
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.update = function() {
    Scene_Base.prototype.update.call(this);
    if(this._timer === 0) {
		this.updateLoad();
	} else {
		this.updateFade();
	}
	if(Input.isTriggered('ok') || TouchInput.isPressed()) {
		this._fadeMode = 'out';
		this._fastFade = true;
	}
	this.updateAudio();
};
//-----------------------------------------------------------------------------
// Update image loading (if none left, leave scene)
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.updateLoad = function() {
	if(this._isReady) {
		if(this._index >= CGMZ.SplashScreen.Splashes.length) {
			SceneManager.goto(Scene_Title);
			Window_TitleCommand.initCommandPosition();
		} else {
			this.setNewImage();
			this._isReady = false;
			this._index++;
		}
	}
	if(ImageManager.isReady()) {
		this.centerSprite(this._image);
		this._fadeMode = 'in';
		this._timer++;
	}
};
//-----------------------------------------------------------------------------
// Update image fade in/out
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.updateFade = function() {
	if(this._fadeMode === 'in') {
		if(this._image.opacity < 255) {
			this._image.opacity += CGMZ.SplashScreen.FadeSpeed;
		}
		this._timer++;
		if(this._timer >= CGMZ.SplashScreen.DisplayTime) {
			this._fadeMode = 'out';
		}
	}
	else if(this._fadeMode ==='out') {
		this._image.opacity -= CGMZ.SplashScreen.FadeSpeed;
		if(this._fastFade) {
			this._image.opacity -= CGMZ.SplashScreen.FadeSpeed*3;
		}
		if(this._image.opacity <= 0) {
			this._timer = 0;
			this._fadeMode = 'none';
			this._isReady = true;
			this._fastFade = false;
		}
	}
};
//-----------------------------------------------------------------------------
// Update image loading (if none left, leave scene)
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.updateAudio = function() {
	if(this._hasSound && !this._soundPlayed && this._timer > this._soundDelay) {
		this._soundPlayed = true;
		AudioManager.playSe(this._se);
	}
};
//-----------------------------------------------------------------------------
// Center Sprite
//-----------------------------------------------------------------------------
CGMZ_Scene_SplashScreen.prototype.centerSprite = function(sprite) {
	sprite.x = (Graphics._width - sprite.width) / 2;
	sprite.y = (Graphics._height - sprite.height) / 2;
};
//=============================================================================
// Scene_Boot
//-----------------------------------------------------------------------------
// Change which scene begins the game
// Modifies: startNormalGame
//=============================================================================
//-----------------------------------------------------------------------------
// Alias: Change first scene unless no splash images
//-----------------------------------------------------------------------------
var alias_CGMZ_SplashScreen_SceneBoot_startNormalGame = Scene_Boot.prototype.start;
Scene_Boot.prototype.startNormalGame = function() {
	if(CGMZ.SplashScreen.Splashes.length < 1) {
		alias_CGMZ_SplashScreen_SceneBoot_startNormalGame.call(this);
	} else {
		this.checkPlayerLocation();
		DataManager.setupNewGame();
		SceneManager.goto(CGMZ_Scene_SplashScreen);
	}
};