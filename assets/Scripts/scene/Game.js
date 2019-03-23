cc.Class({
	extends: cc.Component,
	properties: {
		scoreDisplay: {
			default: null,
			type: cc.Label,
			displayName: '分数',
			tooltip: '游戏得分'
		},
		arms: {
			default: null,
			type: require('arms'),
			displayName: '武器',
			tooltip: '玩家的武器'
		},
		bulletGroup: {
			default: null,
			type: require('bulletGroup'),
			displayName: '子弹组',
			tooltip: '游戏中的子弹组'
		},
		hinder: {
			default: null,
			type: cc.Node,
			displayName: '障碍物',
			tooltip: '第一个障碍物'
		},
		hinders: {
			default: null,
			type: cc.Node,
			displayName: '障碍物',
			tooltip: '第二个障碍物'
		},
		font_level: {
			default: null,
			type: cc.Label,
			displayName: '关卡数',
			tooltip: '关卡数'
		},
		font_levelTip: {
			default: null,
			type: cc.RichText,
			displayName: '关卡提示',
			tooltip: '关卡奖励子弹提示'
		},
		icon_heartArr: {
			default: null,
			type: cc.Layout,
			displayName: '红心组',
			tooltip: '红心组'
		},
		icon_coins: {
			default: null,
			type: cc.Node,
			displayName: '金币',
			tooltip: '金币'
		},
		icon_diamond: {
			default: null,
			type: cc.Node,
			displayName: '钻石',
			tooltip: '钻石'
		}
	},
	// 生命周期回调
	onLoad: function () {
		//播放背景音乐
		this.audioMng = cc.find('Game/audioMaster') || cc.find('audioMaster');
		if (this.audioMng) {
			this.audioMng = this.audioMng.getComponent('audioMaster');
		}
		if (this.audioMng) this.audioMng.playMusic();
		//初始化状态
		this.initState();
	},
	initState: function () {
		// 重置分数
		HL.nodePoolState.gameScore = 0;
		this.scoreDisplay.string = HL.nodePoolState.gameScore.toString();
		// 初始化障碍物
		let hinder_anim = this.hinder.getComponent(cc.Animation);
		let hinders_anim = this.hinders.getComponent(cc.Animation);
		let hinder_animName = this.hinder.name + USERINFO.Data_game[2].json[USERINFO.level - 1].hinder;
		let hinders_animName = this.hinders.name + USERINFO.Data_game[2].json[USERINFO.level - 1].hinders;
		var hinder_Str = USERINFO.Data_game[2].json[USERINFO.level - 1].hinder.toString();
		var hinders_Str = USERINFO.Data_game[2].json[USERINFO.level - 1].hinders.toString();
		this.hinder.getComponent('hinder').around = hinder_Str.substring(0, 1);
		this.hinder.getComponent('hinder').length = hinder_Str.substring(1, 2);
		this.hinders.getComponent('hinder').around = hinders_Str.substring(0, 1);
		this.hinders.getComponent('hinder').length = hinders_Str.substring(1, 2);
		var hinder_animState = hinder_anim.play(hinder_animName);
		var hinders_animState = hinders_anim.play(hinders_animName);
		// 使动画播放速度加、减速
		hinder_animState.speed = USERINFO.Data_game[2].json[USERINFO.level - 1].hinder_speed;
		hinders_animState.speed = USERINFO.Data_game[2].json[USERINFO.level - 1].hinders_speed;
		// speed 值越大速度越快，值越小则速度越慢
		// 关卡信息
		this.font_level.string = '第' + USERINFO.level + '关';
		for (var i = 0, max = USERINFO.Data_game[2].json.length; i < max; i++) {
			if (USERINFO.Data_game[2].json[i].bullet != 0) {
				if (USERINFO.level - 1 == i) {
					this.font_levelTip.string = '<outline color=#223f67 width=2><color=#ffffff>(通过本关可获得新型子弹)</color></outline>';
					break;
				} else {
					if (USERINFO.level - 1 < i) {
						this.font_levelTip.string = '<outline color=#223f67 width=2><color=#ffffff>(还差  ' + (i - (USERINFO.level - 1)) + '  关获得新型子弹)</color></outline>';
						break;
					}
				}
			}
		}
	},
	hideIcon: function () {
		this.icon_coins.opacity = 0;
		this.icon_diamond.opacity = 0;
	},
	showIcon: function () {
		this.icon_coins.opacity = 255;
		this.icon_diamond.opacity = 255;
	},
	changeScore: function (score) {
		HL.nodePoolState.gameScore += score;
		this.scoreDisplay.string = HL.nodePoolState.gameScore.toString();
	},
});