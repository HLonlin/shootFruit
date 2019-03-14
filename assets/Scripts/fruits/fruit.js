cc.Class({
	extends: cc.Component,

	properties: {
		HP: {
			default: 300,
			type: cc.Integer,
			tooltip: '敌机血量',
		},
		initSpriteFrame: {
			default: null,
			type: cc.SpriteFrame,
			tooltip: '初始化图像'
		},
		Game: {
			default: null,
			type: require('Game'),
		},
		arms: {
			default: null,
			type: require('arms'),
			displayName: '武器',
			tooltip: '玩家的武器'
		},
		page_Over: {
			default: null,
			type: require('tips'),
			displayName: '结束页面',
		},
	},
	onLoad: function () {
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测系统
		manager.enabled = true;
		this.fruitInit();
	},
	fruitInit: function () {
		this.Game.initState();
		this.node.opacity = 255;
		this.node.setScale(1);
		this.fruitHp = this.HP;
		// 找到node的Sprite组件
		let nSprite = this.node.getComponent(cc.Sprite);
		// 初始化spriteFrame
		var fruit_wave = this.node.getChildByName('fruit_wave').getComponent(cc.Sprite);
		if (fruit_wave.spriteFrame != this.initSpriteFrame) {
			fruit_wave.spriteFrame = this.initSpriteFrame;
		}
		if (nSprite.spriteFrame != this.initSpriteFrame) {
			nSprite.spriteFrame = this.initSpriteFrame;
		}
	},
	// 监听挂载此组件的节点碰撞检测
	onCollisionEnter: function (other, self) {
		if (other.node.group !== 'bullet') {
			return;
		}
		var anim = self.node.getChildByName("fruit_wave").getComponent(cc.Animation);
		let animName = self.node.getComponent(cc.Sprite).spriteFrame.name;
		if (animName != null) anim.play(animName);
		// 获取武器挂载的组件'arms'
		this.armsProperty = this.arms.node.getComponent("arms");
		// 获取子弹挂载的组件'bullet'
		this.bulletProperty = other.node.getComponent("bullet");
		// 当子弹命中时计算伤害
		var injury = this.injuryValue();
		// 扣除伤害
		this.fruitHp = this.fruitHp - injury;
		// 更新得分
		this.Game.changeScore(Math.floor(injury));
		// 判断是否过关
		if (this.fruitHp <= 0) {
			this.explodingAnim();
			return;
		}
	},
	// 计算伤害
	injuryValue: function () {
		var attackType = this.isCrit(this.armsProperty.critRate);
		if (!attackType) {
			return USERINFO.bulletShop[USERINFO.bulletsInUse - 1].power;
		} else {
			return (USERINFO.bulletShop[USERINFO.bulletsInUse - 1].power + this.armsProperty.attackPower) * 2;
		}
	},
	// 是否暴击
	isCrit: function (probability) {
		var probability = probability * 100 || 1;
		var odds = Math.floor(Math.random() * 100);
		if (probability === 1) { return true };
		if (probability > odds) {
			return true;
		} else {
			return false;
		}
	},
	explodingAnim: function () {
		// 播放爆炸音效、动画
		var anim = this.node.getComponent(cc.Animation);
		let animName = this.node.getComponent(cc.Sprite).spriteFrame.name;
		if (animName != null) anim.play(animName);
		anim.on('finished', this.showpage_over, this);
	},
	showpage_over: function () {
		if (USERINFO.bulletShop[USERINFO.bulletsInUse - 1].state < 2) {
			USERINFO.bulletsInUse = 1;
		}
		this.page_Over.node.getComponent('Over').initUi();
		this.page_Over.node.getComponent('tips').show()
	}
});