cc.Class({
	extends: cc.Component,
	properties: {
		scoreDisplay: {
			default: null,
			type: cc.Label,
			displayName: '分数',
			tooltip: '游戏得分'
		},
		hero: {
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
		var hinder_animState = hinder_anim.play(hinder_animName);
		var hinders_animState = hinders_anim.play(hinders_animName);
	},
	changeScore: function (score) {
		HL.nodePoolState.gameScore += score;
		this.scoreDisplay.string = HL.nodePoolState.gameScore.toString();
	},
});