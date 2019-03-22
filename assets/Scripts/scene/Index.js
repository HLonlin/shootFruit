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
		icon_luckyReward: {
			default: null,
			type: cc.Node,
			displayName: '抽奖奖励',
			tooltip: '抽奖奖励'
		},
		item_coin: {
			default: null,
			type: cc.Prefab,
			displayName: '金币奖励',
			tooltip: '抽奖奖励预制'
		},
		item_diamond: {
			default: null,
			type: cc.Prefab,
			displayName: '钻石奖励',
			tooltip: '抽奖奖励预制'
		},
		item_bullet: {
			default: null,
			type: cc.Prefab,
			displayName: '子弹奖励',
			tooltip: '抽奖奖励预制'
		},
	},
	onLoad() {
		//播放背景音乐
		this.audioMng = cc.find('Index/AudioMaster') || cc.find('Game/AudioMaster') || cc.find('Shop/AudioMaster') || cc.find('Over/AudioMaster') || cc.find('AudioMaster');
		if (this.audioMng) {
			this.audioMng = this.audioMng.getComponent('AudioMaster');
		}
		if (this.audioMng) this.audioMng.playMusic();

		// 初始设备
		WECHAT.initDeviceMaster();
		//初始化广告
		WECHAT.initAD();
		// 登录
		this.login();
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			wx.onHide(() => {
				USERINFO.save();
			})
		}
	},
	login: function () {
		var that = this;
		USERINFO.Data_game = this.Data_game;
		USERINFO.bulletShop = this.bulletShop.fruit;
		USERINFO.initSync = USERINFO.getInitScene();
		// 登录并获取用户信息
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			wx.login({
				success: (res) => {
					if (res.code) {
						HL.ajax.post(HL.ajax.login, { code: res.code }, ((e) => {
							// 请求成功
							if (e.code == 1) {
								var loginData = e.data;
								USERINFO.uid = loginData.uid;
								USERINFO.openId = loginData.openId;
								HL.ajax.post(HL.ajax.getGameData, { uid: loginData.uid }, ((e) => {
									// 请求成功
									if (e.code == 1) {
										USERINFO.init(e.data.info);
										// 开始动作
										that.startAction();
										// 子弹库
										that.bulletShop.init();
										// 初始化界面
										that.initUi();
										wx.triggerGC()
									} else {
										console.log('getGameData_fail', e);
									}
								}));
							} else {
								console.log('login_fail', e);
							}
						}));
					}
				},
			})
		}
	},
	initUi: function () {
		var that = this;
		// 金币
		that.font_coin.string = USERINFO.coin;
		// 钻石
		that.font_diamond.string = USERINFO.diamond;
		// 最高分
		that.font_highestScore.string = '<outline color=#af5f00 width=2><color=#ffffff>最高分' + USERINFO.highestScore + '</color>';
		// 榴莲蛋
		if (USERINFO.durian == 0) {
			that.btn_openDurian.interactable = true;
			that.redPoint_durian.node.active = false;
		} else {
			that.btn_openDurian.interactable = false;
			that.redPoint_durian.node.active = true;
			that.font_durianNum.string = USERINFO.durian;
		}
		// 升级面板
		that.initPowerUi();
		that.initCritUi();
		// 签到页弹出
		var signInState = localStorage.getItem('signInState');
		if (signInState != 2) {
			that.redPoint_singnIn.node.active = true;
			that.openSingnIn();
		}
		// 领钻石弹出
		if (USERINFO.initSync.query.type == 'getDiamond') {
			that.tips_getDiamonds.node.getComponent('getDiamond').show();
		}
	},
	startAction: function () {
		var that = this;
		that.action_StartGame();
	},
	// 重复缩放动作
	action_StartGame: function () {
		var taht = this;
		var seq = cc.ActionInstant;
		seq = cc.repeatForever(
			cc.sequence(
				cc.scaleTo(0.75, 0.85),
				cc.scaleTo(0.75, 1)
			));
		taht.StartGame.runAction(seq);
	},
	// 领取福利
	getWelfare: function (event) {
		var that = this;
		USERINFO.diamond += 2000;
		that.font_diamond.string = USERINFO.diamond;
		localStorage.setItem('isGotWelfare', 'true');
		event.currentTarget.getComponent(cc.Button).interactable = false;
		event.currentTarget.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>';
	},
	// 开启签到
	openSingnIn: function () {
		var that = this;
		that.tips_singnIn.show();
	},
	// 开启榴莲蛋
	openDurian: function () {
		var that = this;
		if (USERINFO.durian > 0) {
			USERINFO.durian -= 1;
			var lucky = USERINFO.Data_game[3].json[USERINFO.luckyNum];
			var luckyRewardNum = 0;
			for (var i = 0, max = that.icon_luckyReward.children.length; i < max; i++) {
				that.icon_luckyReward.children[i].destroy();
			}
			if (lucky.bullet != 0) {
				luckyRewardNum += 1;
				let item_bullet = cc.instantiate(that.item_bullet);
				item_bullet.getChildByName("icon_bg").getChildByName("icon_reward").getComponent(cc.Sprite).spriteFrame = that.bulletShop.fruit[lucky.bullet - 1].res;
				item_bullet.getChildByName("bg").getChildByName("font_rewardNum").getComponent(cc.Label).string = USERINFO.bulletShop[lucky.bullet - 1].power;
				if (USERINFO.bulletShop[lucky.bullet - 1].state != 2) {
					if (USERINFO.bulletShop[lucky.bullet - 1].state == 0) {
						item_bullet.getChildByName("icon_bg").getChildByName("icon_new").active = true
					}
					USERINFO.bulletShop[lucky.bullet - 1].state = 1;
					that.bulletShop.initUi();
				}
				that.icon_luckyReward.addChild(item_bullet);
			}
			if (lucky.coin != 0) {
				USERINFO.coin += lucky.coin;
				that.font_coin.string = USERINFO.coin;
				luckyRewardNum += 1;
				let item_coin = cc.instantiate(that.item_coin);
				item_coin.getChildByName("font_rewardNum").getComponent(cc.Label).string = 'x' + lucky.coin;
				that.icon_luckyReward.addChild(item_coin);
			}
			if (lucky.diamond != 0) {
				USERINFO.diamond += lucky.diamond;
				that.font_diamond.string = USERINFO.diamond;
				luckyRewardNum += 1;
				let item_diamond = cc.instantiate(that.item_diamond);
				item_diamond.getChildByName("font_rewardNum").getComponent(cc.Label).string = 'x' + lucky.diamond;
				that.icon_luckyReward.addChild(item_diamond);
			}
			that.icon_luckyReward.height = luckyRewardNum * 115
			USERINFO.luckyNum = USERINFO.luckyNum + 1 >= 20 ? 15 : USERINFO.luckyNum + 1;
			that.tips_openDurian.show();
		} else {
			if (cc.sys.platform === cc.sys.WECHAT_GAME) {
				WECHAT.openVideoAd(() => {
					USERINFO.durian += 1;
					if (USERINFO.durian == 0) {
						that.btn_openDurian.interactable = true;
						that.redPoint_durian.node.active = false;
					} else {
						that.btn_openDurian.interactable = false;
						that.redPoint_durian.node.active = true;
						that.font_durianNum.string = USERINFO.durian;
					}
				}, () => {
					console.log('中途退出视频');
				}, () => {
					WECHAT.share(null, () => {
						USERINFO.durian += 1;
						if (USERINFO.durian == 0) {
							that.btn_openDurian.interactable = true;
							that.redPoint_durian.node.active = false;
						} else {
							that.btn_openDurian.interactable = false;
							that.redPoint_durian.node.active = true;
							that.font_durianNum.string = USERINFO.durian;
						}
					}, () => {
						wx.showToast({
							title: '请分享到群',
							icon: 'none',
							duration: 2000,
							mask: true
						})
					}, 'querys1=1');
				});
			}
		}
		if (USERINFO.durian <= 0) {
			that.btn_openDurian.interactable = true;
			that.redPoint_durian.node.active = false;
		} else {
			that.btn_openDurian.interactable = false;
			that.redPoint_durian.node.active = true;
			that.font_durianNum.string = USERINFO.durian;
		}
	},
	// 升级武器
	updatalevel_power: function () {
		// 威力
		var currentLv = USERINFO.Data_game[0].json[USERINFO.armpoweLevel];
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
		this.font_powerLevel.string = 'Lv.' + (USERINFO.armpoweLevel + 1);
		this.font_powerNum.string = USERINFO.Data_game[0].json[USERINFO.armpoweLevel].Power;
		this.power_price.string = '<outline color=#2b6393 width=2><color=#ffffff>' + USERINFO.Data_game[0].json[USERINFO.armpoweLevel].Price + '</color></outline>';
	},
	updatalevel_crit: function () {
		// 暴击
		var currentLv = USERINFO.Data_game[0].json[USERINFO.armCritLevel];
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
		this.font_critLevel.string = 'Lv.' + (USERINFO.armCritLevel + 1);
		this.font_critNum.string = Math.floor(USERINFO.Data_game[0].json[USERINFO.armCritLevel].Crit * 100) + '%';
		this.crit_price.string = '<outline color=#2b6393 width=2><color=#ffffff>' + USERINFO.Data_game[0].json[USERINFO.armCritLevel].Price + '</color></outline>';
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
			wx.showModal({
				title: '温馨提示',
				content: '从分享链接点进去就能领取钻石哦~',
				showCancel: false,
				confirmText: '知道了',
				success(res) {
					if (res.confirm) {

					}
				}
			});
		}, () => {
			wx.showToast({
				title: '请分享到群',
				icon: 'none',
				duration: 2000,
				mask: true
			})
		}, 'openId=' + USERINFO.openId + '&type=getDiamond');
	},
	// 观看视频
	openVideo: function () {
		WECHAT.openVideoAd(() => {
			console.log('正常播放完成');
		}, () => {
			console.log('中途退出视频');
		}, () => {
			WECHAT.share(null, () => {
				wx.showToast({
					title: '分享成功',
					icon: 'none',
					duration: 2000,
					mask: true
				})
			}, () => {
				wx.showToast({
					title: '请分享到群',
					icon: 'none',
					duration: 2000,
					mask: true
				})
			}, 'openId=' + USERINFO.openId);
		});
	},
});