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
		minPercent: {
			default: 0.3,
			type: cc.Float,
			displayName: '缩小比例',
			tooltip: '水果最小的缩小比例'
		},
		initSpriteArr: {
			default: [],
			type: cc.SpriteFrame,
			tooltip: '初始化图像组',
			displayName: '初始化图像组',
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
		// 获取当前关卡信息
		this.level = USERINFO.Data_game[2].json[USERINFO.level - 1];
		// 水果血量
		this.HP = this.level.FruitHP;
		this.fruitHp = this.HP;
		// 获取水果的Sprite组件
		let nSprite = this.node.getComponent(cc.Sprite);
		// 初始化spriteFrame
		var fruit_wave = this.node.getChildByName('fruit_wave').getComponent(cc.Sprite);
		this.initSpriteFrame = this.initSpriteArr[this.level.fruit - 1];
		if (fruit_wave.spriteFrame != this.initSpriteFrame) {
			fruit_wave.spriteFrame = this.initSpriteFrame;
		}
		if (nSprite.spriteFrame != this.initSpriteFrame) {
			nSprite.spriteFrame = this.initSpriteFrame;
		}
	},
	// 监听挂载此组件的节点碰撞检测
	onCollisionEnter: function (other, self) {
		if (other.node.group !== 'bullet' || this.fruitHp <= 0) {
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
		this.percent = this.fruitHp / this.HP;
		if (this.percent >= this.minPercent) {
			this.node.setScale(this.percent);
		} else {
			this.node.setScale(this.minPercent);
		}
		// 更新得分
		this.Game.changeScore(Math.floor(injury));
		// 水果血量耗完
		if (this.fruitHp <= 0) {
			this.explodingAnim();
			return;
		}
	},
	// 计算伤害
	injuryValue: function () {
		// 根据武器暴击率计算是否暴击
		var attackType = this.isCrit(USERINFO.Data_game[0].json[USERINFO.armCritLevel - 1].Crit);
		if (!attackType) {
			// 普通伤害=子弹威力
			return USERINFO.bulletShop[USERINFO.bulletsInUse - 1].power;
		} else {
			// 暴击伤害=(子弹威力 + 武器威力) * 2
			return (USERINFO.bulletShop[USERINFO.bulletsInUse - 1].power + USERINFO.Data_game[0].json[USERINFO.armpoweLevel - 1].Power) * 2;
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
		anim.on('finished', this.showpage_victory, this);
	},
	// 显示胜利页面
	showpage_victory: function () {
		if (USERINFO.bulletShop[USERINFO.bulletsInUse - 1].state < 2) {
			USERINFO.bulletsInUse = 1;
		}
		// 	"coin": 250,
		// "diamond": 10,
		// "bullet": 0
		console.log('奖励金币:', this.level.coin);
		console.log('奖励钻石：', this.level.diamond);
		console.log('奖励子弹编号:', this.level.bullet);
		this.page_Over.node.getComponent('Over').initUi();
		this.page_Over.node.getComponent('tips').show();
		USERINFO.level += 1;
	}
});