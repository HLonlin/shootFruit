cc.Class({
	extends: cc.Component,
	properties: {
		AudioMaster: {
			default: null,
			type: cc.Node,
			displayName: '音效控件',
			tooltip: '游戏内各音效控制器'
		},
		Data_game: {
			default: [],
			type: cc.JsonAsset,
			displayName: '游戏数据',
			tooltip: '游戏内各数据'
		},
		page_Game: {
			default: null,
			type: require('tips'),
			displayName: '游戏页面',
		},
		page_Over: {
			default: null,
			type: require('tips'),
			displayName: '结束页面',
		},
		StartGame: {
			default: null,
			type: cc.Node,
			displayName: '开始游戏',
			tooltip: '开始游戏'
		},
		bulletShop: {
			default: null,
			type: require('bulletShop'),
			displayName: '子弹库',
			tooltip: '子弹库弹出框'
		},
		tips_welfare: {
			default: null,
			type: require('tips'),
			displayName: '福利弹出框',
			tooltip: '消息弹出框'
		},
		tips_openDurian: {
			default: null,
			type: require('tips'),
			displayName: '榴莲蛋弹出框',
			tooltip: '消息弹出框'
		},
		tips_ranking: {
			default: null,
			type: require('tips'),
			displayName: '排行榜弹出框',
			tooltip: '消息弹出框'
		},
		tips_singnIn: {
			default: null,
			type: require('tips'),
			displayName: '签到弹出框',
			tooltip: '消息弹出框'
		},
		tips_getDiamonds: {
			default: null,
			type: require('tips'),
			displayName: '领钻石弹出框',
			tooltip: '消息弹出框'
		},
		tips_exchange: {
			default: null,
			type: require('tips'),
			displayName: '钻石换金币弹出框',
			tooltip: '消息弹出框'
		},
		panel_levelUp: {
			default: null,
			type: require('fadeTab'),
			displayName: '升级面板',
			tooltip: '武器威力、暴击升级'
		},
		font_coin: {
			default: null,
			type: cc.Label,
			displayName: '金币',
			tooltip: '金币数量'
		},
		font_diamond: {
			default: null,
			type: cc.Label,
			displayName: '钻石',
			tooltip: '钻石数量'
		},
		font_highestScore: {
			default: null,
			type: cc.RichText,
			displayName: '最高分',
			tooltip: '历史记录最高分'
		},
		font_durianNum: {
			default: null,
			type: cc.Label,
			displayName: '榴莲蛋',
			tooltip: '榴莲蛋抽奖次数'
		},
		redPoint_durian: {
			default: null,
			type: cc.Sprite,
			displayName: '榴莲红点',
			tooltip: '榴莲红点'
		},
		redPoint_singnIn: {
			default: null,
			type: cc.Sprite,
			displayName: '签到红点',
			tooltip: '签到红点'
		},
		redPoint_bulletShop: {
			default: null,
			type: cc.Sprite,
			displayName: '子弹库红点',
			tooltip: '子弹库红点'
		},
		btn_openDurian: {
			default: null,
			type: cc.Button,
			displayName: '开启榴莲按钮',
			tooltip: '开启榴莲按钮'
		},
		font_powerLevel: {
			default: null,
			type: cc.Label,
			displayName: '武器威力等级',
			tooltip: '武器威力等级'
		},
		font_critLevel: {
			default: null,
			type: cc.Label,
			displayName: '武器暴击等级',
			tooltip: '武器暴击等级'
		},
		font_powerNum: {
			default: null,
			type: cc.Label,
			displayName: '武器威力',
			tooltip: '武器威力'
		},
		font_critNum: {
			default: null,
			type: cc.Label,
			displayName: '武器暴击',
			tooltip: '武器暴击'
		},
		power_price: {
			default: null,
			type: cc.RichText,
			displayName: '武器威力价格',
			tooltip: '武器威力价格'
		},
		crit_price: {
			default: null,
			type: cc.RichText,
			displayName: '武器暴击价格',
			tooltip: '武器暴击价格'
		},
	},
	onLoad() {
		//播放背景音乐
		this.audioMng = cc.find('Index/AudioMaster') || cc.find('Game/AudioMaster') || cc.find('Shop/AudioMaster') || cc.find('Over/AudioMaster') || cc.find('AudioMaster');
		if (this.audioMng) {
			this.audioMng = this.audioMng.getComponent('AudioMaster');
		}
		if (this.audioMng) this.audioMng.playMusic();
	},
	start: function () {
		// 登录
		this.login();
		// 初始化界面
		this.initUi();
		// 开始动作
		this.startAction();
	},
	login: function () {
		var data = {
			// 用户信息
			coin: 0,//金币
			diamond: 100,//钻石
			durian: 1,//榴莲
			highestScore: 100000,//最高分
			bulletsInUse: 1,//正在使用的子弹
			armCritLevel: 1,// 武器暴击等级
			armpoweLevel: 1,// 武器威力等级
			bulletShop: this.bulletShop.fruit,// 子弹库解锁情况：0未解锁、1已解锁未购买、2已购买
			initScene: '1001',// 初始场景值，用于区分从哪进入游戏
			Data_game: this.Data_game,//游戏数据
		};
		USERINFO.init(data);
	},
	initUi: function () {
		// 签到页弹出
		var signInState = localStorage.getItem('signInState');
		if (signInState != 2) {
			this.redPoint_singnIn.node.active = true;
			this.openSingnIn();
		}
		// 金币
		this.font_coin.string = USERINFO.coin;
		// 钻石
		this.font_diamond.string = USERINFO.diamond;
		// 最高分
		this.font_highestScore.string = '<outline color=#af5f00 width=2><color=#ffffff>最高分' + USERINFO.highestScore + '</color>';
		// 榴莲蛋
		if (USERINFO.durian == 0) {
			this.btn_openDurian.interactable = true;
			this.redPoint_durian.node.active = false;
		} else {
			this.btn_openDurian.interactable = false;
			this.redPoint_durian.node.active = true;
			this.font_durianNum.string = USERINFO.durian;
		}
		// 子弹库
		this.bulletShop.init();
		// 升级面板
		this.initPowerUi();
		this.initCritUi();
		// 微信
		if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT) {
			//初始化设备信息
			WECHAT.initDeviceMaster();
			//初始化广告
			WECHAT.initAD();
		}
	},
	startAction: function () {
		this.action_StartGame();
	},
	// 重复缩放动作
	action_StartGame: function () {
		var seq = cc.ActionInstant;
		seq = cc.repeatForever(
			cc.sequence(
				cc.scaleTo(0.75, 0.85),
				cc.scaleTo(0.75, 1)
			));
		this.StartGame.runAction(seq);
	},
	// 领取福利
	getWelfare: function (event) {
		USERINFO.diamond += 2000;
		this.font_diamond.string = USERINFO.diamond;
		localStorage.setItem('isGotWelfare', 'true');
		event.currentTarget.getComponent(cc.Button).interactable = false;
		event.currentTarget.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>';
	},
	// 开启签到
	openSingnIn: function () {
		this.tips_singnIn.show();
	},
	// 开启榴莲蛋
	openDurian: function () {
		if (USERINFO.durian > 0) {
			USERINFO.durian -= 1;
			this.tips_openDurian.show();
		} else {
			console.log('剩余次数不足');
			USERINFO.durian += 1;
		}
		if (USERINFO.durian <= 0) {
			this.btn_openDurian.interactable = true;
			this.redPoint_durian.node.active = false;
		} else {
			this.btn_openDurian.interactable = false;
			this.redPoint_durian.node.active = true;
			this.font_durianNum.string = USERINFO.durian;
		}
	},
	// 升级武器
	updatalevel_power: function () {
		// 威力
		var currentLv = USERINFO.Data_game[0].json[USERINFO.armpoweLevel - 1];
		if (USERINFO.coin >= currentLv.Price) {
			USERINFO.coin -= currentLv.Price;
			USERINFO.armpoweLevel += 1;
			this.font_coin.string = USERINFO.coin;
			this.initPowerUi();
		} else {
			// 金币不足
			this.tips_exchange.show();
		}
	},
	initPowerUi: function () {
		this.font_powerLevel.string = 'Lv.' + USERINFO.armpoweLevel;
		this.font_powerNum.string = USERINFO.Data_game[0].json[USERINFO.armpoweLevel - 1].Power;
		this.power_price.string = '<outline color=#2b6393 width=2><color=#ffffff>' + USERINFO.Data_game[0].json[USERINFO.armpoweLevel - 1].Price + '</color></outline>';
	},
	updatalevel_crit: function () {
		// 暴击
		var currentLv = USERINFO.Data_game[0].json[USERINFO.armCritLevel - 1];
		if (USERINFO.coin >= currentLv.Price) {
			USERINFO.coin -= currentLv.Price;
			USERINFO.armCritLevel += 1;
			this.font_coin.string = USERINFO.coin;
			this.initCritUi();
		} else {
			// 金币不足
			this.tips_exchange.show();
		}
	},
	initCritUi: function () {
		this.font_critLevel.string = 'Lv.' + USERINFO.armCritLevel;
		this.font_critNum.string = USERINFO.Data_game[0].json[USERINFO.armCritLevel - 1].Power;
		this.crit_price.string = '<outline color=#2b6393 width=2><color=#ffffff>' + USERINFO.Data_game[0].json[USERINFO.armCritLevel - 1].Price + '</color></outline>';
	},
	// 显示广告
	openAd: function () {
		setTimeout(() => {
			WECHAT.showBannerAd();
		}, 1000);
	},
	// 关闭广告
	closeAd: function () {
		WECHAT.closeBannerAd();
	},
	// 分享
	share: function () {
		WECHAT.share(null, () => {
			console.log('分享成功');
		}, () => {
			console.log('分享失败');
		}, 'querys1=1');
	},
	// 观看视频
	openVideo: function () {
		WECHAT.openVideoAd(() => {
			console.log('正常播放完成');
		}, () => {
			console.log('中途退出视频');
		}, () => {
			console.log('没有视频播放');
		});
	},
	toggleHomeBtns: function () {

	},
});