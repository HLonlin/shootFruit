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
		// 监听拖动事件
		//this.onDrag();
		// 获取碰撞检测系统
		let manager = cc.director.getCollisionManager();
		// 开启碰撞检测系统
		manager.enabled = true;
		this.armHP = this.HP;
	},
	// 添加拖动监听
	onDrag: function () {
		this.node.on('touchmove', this.onHandleHeroTap, this);
	},
	// 去掉拖动监听
	offDrag: function () {
		this.node.off('touchmove', this.onHandleHeroTap, this);
	},
	// 武器拖动
	onHandleHeroTap: function (event) {
		// touchmove事件中 event.getLocation() 获取当前已左下角为锚点的触点位置（world point）
		let position = event.getLocation();
		// 实际hero是background的子元素，所以坐标应该是随自己的父元素进行的，所以我们要将“world point”转化为“node point”
		let location = this.node.parent.convertToNodeSpaceAR(position);
		this.node.setPosition(location);
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
		this.page_Over.node.getComponent('Over').initUi();
		this.page_Over.node.getComponent('tips').show()
	}
});