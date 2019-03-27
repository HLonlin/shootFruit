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
		icon_heartArr: {
			default: null,
			type: cc.Layout,
			displayName: '红心组',
			tooltip: '红心组'
		}
	}),
	onLoad: function () {
		this.initStage();
	},
	initStage: function () {
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测系统
		manager.enabled = true;
		// 武器血量
		USERINFO.heart = USERINFO.heart == 2 ? USERINFO.heart : 1;
		this.HP = USERINFO.heart;
		this.armHP = this.HP;
		for (var i = 0, max = 2; i < max; i++) {
			this.icon_heartArr.node.children[i].getChildByName("icon_hearts").opacity = 0;
		}
		for (var i = 0, max = this.armHP; i < max; i++) {
			this.icon_heartArr.node.children[i].getChildByName("icon_hearts").setScale(1);
			this.icon_heartArr.node.children[i].getChildByName("icon_hearts").opacity = 255;
		}
	},
	// 碰撞组件
	onCollisionEnter: function (other, self) {
		if (other.node.group === 'bullet' && this.armHP > 0) {
			this.armHP -= 1;
			var actionTo = cc.spawn(cc.scaleTo(0.35, 4), cc.fadeTo(0.35, 0));
			this.icon_heartArr.node.children[this.armHP].getChildByName("icon_hearts").runAction(actionTo);
			if (this.armHP <= 0) {
				this.onHandleDestroy();
			}
		}
	},
	onHandleDestroy: function () {
		if (USERINFO.bulletShop[USERINFO.bulletsInUse].state < 2) {
			USERINFO.bulletsInUse = 0;
		}
		if (HL.nodePoolState.revive == 0) {
			this.page_Over.node.getComponent('Over').fadein_revive();
		} else {
			this.page_Over.node.getComponent('Over').fadein_over();
		}

	}
});