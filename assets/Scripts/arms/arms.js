// 武器
cc.Class({
	extends: cc.Component,
	properties: () => ({
		bulletGroup: {
			default: null,
			type: require('bulletGroup'),
			displayName: '子弹组',
			tooltip: '游戏中的子弹组'
		},
		Game: {
			default: null,
			type: require('Game'),
			displayName: '游戏页',
			tooltip: '游戏页面逻辑'
		},
		attackPower: {
			default: 50,
			type: cc.Float,
			displayName: '攻击力',
			tooltip: '武器的攻击力'
		},
		critRate: {
			default: 0.05,
			type: cc.Float,
			displayName: '暴击率',
			tooltip: '武器的暴击率'
		},
		HP: {
			default: 1,
			type: cc.Integer,
			displayName: '武器HP',
			tooltip: '武器的默认血量'
		},
		page_Over: {
			default: null,
			type: require('tips'),
			displayName: '结束页面',
		},
	}),
	onLoad: function () {
		this.initStage();
	},
	initStage: function () {
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测系统
		manager.enabled = true;
		this.armHP = this.HP;
		this.critRate = USERINFO.Data_game[0].json[USERINFO.armCritLevel - 1].Crit;
		this.attackPower = USERINFO.Data_game[0].json[USERINFO.armpoweLevel - 1].Power;
	},
	// 碰撞组件
	onCollisionEnter: function (other, self) {
		if (other.node.group === 'bullet') {
			this.armHP -= 1;
			if (this.armHP <= 0) {
				this.onHandleDestroy();
			}
		}
	},
	onHandleDestroy: function () {
		if (USERINFO.bulletShop[USERINFO.bulletsInUse - 1].state < 2) {
			USERINFO.bulletsInUse = 1;
		}
		this.page_Over.node.getComponent('Over').initUi();
		this.page_Over.node.getComponent('tips').show()
	}
});