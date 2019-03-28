// 子弹组
cc.Class({
	extends: cc.Component,
	properties: () => ({
		names: {
			default: 'infiniteBullets',
			displayName: '节点名称',
			tooltip: '节点的名称'
		},
		rate: {
			default: 0.1,
			type: cc.Float,
			displayName: '速率',
			tooltip: '节点速率'
		},
		poolAmount: {
			default: 10,
			type: cc.Integer,
			displayName: '池量',
			tooltip: '节点池容量'
		},
		prefab: {
			default: null,
			type: cc.Prefab,
			displayName: '预制',
			tooltip: '子弹预制'
		},
		position: {
			default: 100,
			type: cc.Integer,
			displayName: '子弹相对arms的位置',
			tooltip: '子弹相对arms的位置'
		},
		arms: {
			default: null,
			type: cc.Node,
			displayName: '武器',
			tooltip: '玩家的武器'
		},
		Game: {
			default: null,
			type: require('Game'),
			displayName: '游戏页',
			tooltip: '游戏页面逻辑'
		},
	}),
	onLoad: function () {
		var that = this;
		that.bulletInfo = {
			name: that.names,
			rate: that.rate,
			poolAmount: that.poolAmount,
			prefab: that.prefab,
			position: that.position,
		}
		HL.nodePool.initNodePool(that, that.bulletInfo);
	},
	// 点击按钮生成子弹
	genNewBullet: function () {
		var that = this;
		let poolName = that.names + '_Pool';
		let newNode = HL.nodePool.genNewNode(that[poolName], that.prefab, that.node);
		newNode.setPosition(that.getBulletPosition(that.position));
		newNode.getComponent('bullet').bulletGroup = that;
		if (USERINFO.bulletShop[USERINFO.bulletsInUse] != undefined) {
			newNode.getComponent(cc.Sprite).spriteFrame = USERINFO.bulletShop[USERINFO.bulletsInUse].bullet;
		}
		if (USERINFO.DoubleDamage == 2) {
			newNode.setScale(1.5);
		} else {
			newNode.setScale(1);
		}
	},
	//获取子弹位置
	getBulletPosition: function (positionStr) {
		var that = this;
		let armsP = that.arms.getPosition();
		let newV2_x = armsP.x;
		let newV2_y = armsP.y + Number(positionStr);
		return cc.v2(newV2_x, newV2_y);
	},
	//销毁子弹
	destroyBullet: function (node) {
		var that = this;
		// bullet中是由bulletGroup调用，所以当前this为bulletGroup
		HL.nodePool.putBackPool(that, node);
	}
});