/*:
 * @target     MZ
 * @plugindesc v1.1 为游戏添加在线序列号验证系统。
 * @author     41工作室 爱走位的KN_sword
 * @url        https://space.bilibili.com/403314450
 *
 * @help
 * * 使用说明：
 * 1、设置好插件参数，并确保为游戏添加在线序列号验证系统，进入游戏场景后通过插件指令触发。
 * 2、可在任意事件中调用“更改（激活）在线序列号验证系统”插件指令来更改在线序列号验证系统，若在线
 *序列号验证系统已禁用，则激活。
 * 3、可在任意事件中调用“禁用在线序列号验证系统”，以禁用在线序列号验证系统。
 *
 * * 使用条款：免费用于任何商业或非商业目的；允许在保留原作者信息的前提下修改代
 * 码；请在你的项目中致谢“41工作室 爱走位的KN_sword”，谢谢！:)
 *
 * @param   licenseCheckEnabled
 * @text    是否为游戏添加在线序列号验证系统
 * @type    boolean
 * @default true
 *
 * @param   licenseLength
 * @text    序列号长度
 * @type    string
 * @default 16
 * @desc    0~16之间的整数
 *
 * @param   licenseName
 * @text    序列号存储名
 * @type    string
 * @default access_key.license
 * @desc    本地的储存名，建议以“.license”为后缀，储存名不要超过50个字符
 *
 * @param   licenseCheckHost
 * @text    服务器存储网址
 * @type    string
 * @default Http://www.example.com
 * @desc    服务器存储网址，不会填写的联系作者
 *
 * @command changeLicenseCheckEnabled
 * @text    更改（激活）在线序列号验证系统
 *
 * @param   newLicenseLength
 * @text    序列号长度
 * @type    string
 * @default 16
 * @desc    0~16之间的实数
 *
 * @param   newLicenseName
 * @text    序列号存储名
 * @type    string
 * @default access_key.license
 * @desc    本地的储存名，建议以“.license”为后缀，储存名不要超过50个字符
 *
 * @param   newLicenseCheckHost
 * @text    服务器存储网址
 * @type    string
 * @default Http://www.example.com
 * @desc    服务器存储网址，不会填写的联系作者
 *
 * @command disableLicenseCheckEnabled
 * @text    禁用在线序列号验证系统
 */


var license_check = license_check || {};

(() => {
    var params = PluginManager.parameters('41workroom_license_check');
	boolean check_abalibale = true;

    license_check.licenseCheckEnabled          = String(licenseCheckEnabled) === 'true';
    license_check.licenseLength                = Number(params.licenseLength);
    license_check.licenseName                  = Number(params.licenseName);
    license_check.licenseCheckHost             = Number(params.licenseCheckHost);

    PluginManager.registerCommand('41workroom_license_check', 'changeLicenseCheckEnabled', args => {
        license_check.licenseLength            = Number(args.newLicenseLength);
        license_check.licenseName              = Number(args.newLicenseName);
        license_check.licenseCheckHost         = Number(args.newLicenseCheckHost);
        fixData();
        license_check.godrayFilter.length      = license_check.licenseLength;
        license_check.godrayFilter.name        = license_check.licenseName;
        license_check.godrayFilter.host        = license_check.licenseCheckHost;
        if (!license_check.licenseCheckEnabled) {
            license_check.licenseCheckEnabled = true;
            startLicense();
        }
    });

    PluginManager.registerCommand('41workroom_license_check', 'disableLicenseCheckEnabled', () => {
        if (license_check.licenseCheckEnabled) {
            license_check.licenseCheckEnabled = false;
            disableLicense();
        }
    });

    function setupLicense() {
        fixData();
        var license_check.data = {
            angle   : license_check.beautifulSunshineGodrayAngle,
            length  : license_check.licenseLength,
            name    : license_check.licenseName,
            host    : license_check.licenseCheckHost
        };
		console.log('Plugin licenseCheck has been setup!') ;
		console.log('Plugin data' + license_check.data);	
    }

    function fixData() {
		String(license_check.licenseLength) = Math.floor(parseInt(license_check.licenseLength))
        if (String(license_check.licenseLength) === 'NaN') license_check.licenseLength = 16;
        else if   (license_check.licenseLength < 1)        license_check.licenseLength = 1;
        else if   (license_check.licenseLength > 16)       license_check.licenseLength = 16;

        if (String(license_check.licenseName) === 'NaN') license_check.licenseName = 'access_key.license';
        else if   (license_check.licenseName.length < 1)        license_check.licenseName = 'access_key.license';
        else if   (license_check.licenseName.length > 50)        license_check.licenseName = 'access_key.license';

        if (String(license_check.licenseCheckHost) === 'NaN') license_check.licenseCheckHost = 'Http://www.example.com';
        else if   (license_check.licenseCheckHost.length < 1)        license_check.licenseCheckHost = 'Http://www.example.com';
        else if   (license_check.licenseCheckHost.length > 1)        license_check.licenseCheckHost = 'Http://www.example.com';
	}
		
	function writeLicense(li_name,li_value) {
        
    }

    function checkWindow() {
        var li_windowInput=window.prompt("请输入官方给与的序列号:");
        console.log(li_windowInput + "用户输入的序列号");
			
	    writeLicense(license_check.data["licenseName"],li_windowInput);
    }
	
	function deepenLicense(li_length,li_input) {
		/*
		这里就是数据加密的核心
		*/
		li_length = Math.floor(parseInt(li_length));
		li_input = Math.floor(parseInt(li_input));
		
		if (li_length != li_input.length){
			console.log('Plugin Error:Your length is not corrct!Please check again!') ;
			return;
		};
		
		switch(li_length){
			case 1 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 2 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 3 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 4 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 5 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 6 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 7 :{
				li_input = li_input * 2 - 1;
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 8 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 9 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 10 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 11 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 12 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 13 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 14 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 15 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			case 16 :{
				/*
			    这里请开始你的自由发挥，a~h代表从左往右的各个数位上的数码
			    */
				li_a = Math.floor(li_input / 10000000);
				li_b = Math.floor(li_input / 1000000) - li_a * 10;
				li_c = Math.floor(li_input / 100000) - li_a * 100 - li_b * 10;
				li_d = Math.floor(li_input / 10000) - li_a * 1000 - li_b * 100 - li_c * 10;
				li_e = Math.floor(li_input / 1000) - li_a * 10000 - li_b * 1000 - li_c * 100 - li_d * 10;
				li_f = Math.floor(li_input / 100) - li_a * 100000 - li_b * 10000 - li_c * 1000 - li_d * 100 - li_e *10;
				li_g = Math.floor(li_input / 10) - li_a * 1000000 - li_b * 100000 - li_c * 10000 - li_d * 1000 - li_e *100 -li_f * 10;
				li_h = Math.floor(li_input / 1) - li_a * 10000000 - li_b * 1000000 - li_c * 100000 - li_d * 10000 - li_e *1000 -li_f * 100 - li_g * 10;
				
				li_input = li_a ^ 2 + li_b * 3222432 + li_c * 83134141 + li_d ^ 4 + li_e *51244 + li_f ^ 2 + li_g * 52434223 + li_h ^ 3 - 10343434
				
				console.log('Plugin access_key:'+ li_input) ;
				return li_input;
				break;
			}
			
		}
	}
	
    function updateLicense() {
        if (!license_check.licenseCheckEnabled) return;
        console.log('Plugin licenseCheck has been update!');
		
		check_abalibale = false;
    }

    function startLicense() {
        if (!license_check.licenseCheckEnabled) return;
            console.log('Plugin licenseCheck has been started!') 
			/*
			这里就是运行的核心
			*/
			checkWindow();
        });
    }


    while (check_abalibale){
	    setupLicense();
		startLicense();
	}

})();