// 子弹
cc.Class({
	extends: cc.Component,
	properties: {
		speed: {
			default: 1500,
			type: cc.Integer,
			displayName: '子弹速度',
			tooltip: '子弹的移动速度'
		},
		attackPower: {
			default: 30,
			type: cc.Integer,
			displayName: '攻击',
			tooltip: '子弹的基础攻击力'
		},
	},
	onLoad: function () {
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测系统
		manager.enabled = true;
		// 子弹方向 true向上 false向下
		this.normal = true;
		// 暂时性无敌状态
		this.tentativeInvincible = false;

	},
	//碰撞检测
	onCollisionEnter: function (other, self) {
		// 判断检测到的碰撞组是否是障碍物
		if (other.node.group === 'hinder') {
			var hinder = other.node.getComponent("hinder");
			var currentTag = hinder.around + '' + hinder.length;
			// 判断击中的是障碍物0还是擦边x
			currentTag = currentTag + '0';
			if (other.tag == currentTag) {
				// 判断现在是否无敌
				if (!USERINFO.Invincible) {
					// 将子弹方向设置向下
					this.normal = false;
				}
				return;
			} else {
				// 当擦边时还需要进一步判断这个擦边是否附属于当前开启的障碍物，是才能判断为擦边
				// 注意：检测擦边碰撞tag时正反方向一样，所以只需取内外圈及长短值进行判断
				currentTag = hinder.around + '' + hinder.length;
				currentTag = currentTag + '1';
				if (other.tag == currentTag) {
					this.bulletGroup.Game.changeScore(30)
					// 擦边时暂时性将无敌状态开启
					this.tentativeInvincible = true;
				}
			}
			return;
		}
		// 当子弹命中武器时将子弹方向设置向上
		if (other.node.group === 'arms') {
			this.normal = true;
		}
		// 当子弹命中水果后，将占时开启的无敌状态关闭
		if (other.node.group === 'fruit') {
			this.tentativeInvincible = false;
		}
		this.bulletGroup.destroyBullet(self.node);
	},
	shoot: function (dt) {
		this.node.y += dt * this.speed;
		if (this.node.y > WECHAT.screenHeight / 2) {
			this.bulletGroup.destroyBullet(this.node);
		}
	},
	rebound: function (dt) {
		this.node.y -= dt * this.speed / 2;
		if (this.node.y > WECHAT.screenHeight / 2) {
			this.bulletGroup.destroyBullet(this.node);
		}
	},
	update: function (dt) {
		if (this.normal) {
			this.shoot(dt);
		} else {
			this.rebound(dt);
		}
	},
});