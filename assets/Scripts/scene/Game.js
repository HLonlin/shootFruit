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
		HL.nodePoolState.gameScore = 0;
		this.scoreDisplay.string = HL.nodePoolState.gameScore.toString();
	},
	changeScore: function (score) {
		HL.nodePoolState.gameScore += score;
		this.scoreDisplay.string = HL.nodePoolState.gameScore.toString();
	},
});