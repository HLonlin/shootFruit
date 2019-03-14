cc.Class({
	extends: cc.Component,
	properties: {
		progressBar: {
			default: null,
			type: cc.ProgressBar,
			displayName: '进度条',
			tooltip: '进度条'
		},
		timeToRecover: {
			default: 30,
			type: cc.Integer,
			displayName: '秒数',
			tooltip: '转一圈需要的时间'
		},
		totalCount: {
			default: 120,
			type: cc.Integer,
			displayName: '总圈数',
			tooltip: '一共可以转N圈'
		},
		currentCount: {
			default: 0,
			type: cc.Integer,
			displayName: '圈数',
			tooltip: '现在已经转了几圈'
		},
		labelTimer: {
			default: null,
			type: cc.Label,
			displayName: '倒计时数字',
			tooltip: '显示现在距离倒计时结束剩余时间'
		},
		eachCoin: {
			default: 30,
			type: cc.Integer,
			displayName: '每圈金币',
			tooltip: '每转一圈可获得金币数'
		},
		gotCoin: {
			default: 0,
			type: cc.Integer,
			displayName: '已累金币',
			tooltip: '已经累计的金币'
		},
		font_coinNum: {
			default: null,
			type: cc.RichText,
			displayName: '金币',
			tooltip: '可领取金币数'
		},
		font_coinNums: {
			default: null,
			type: cc.Label,
			displayName: '金币',
			tooltip: '用户拥有金币'
		},
		font_diamNums: {
			default: null,
			type: cc.Label,
			displayName: '钻石',
			tooltip: '用户拥有钻石'
		}
	},
	onLoad: function () {
		this.startTiming();
		if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT) {
			wx.onHide(() => {
				localStorage.setItem('Timing', this.timer);
				localStorage.setItem('currentCount', this.currentCount);
				localStorage.setItem('gotCoin', this.gotCoin);
			})
		}
	},
	startTiming: function () {
		this.timer = Number(localStorage.getItem('Timing')) || 0;
		this.currentCount = Number(localStorage.getItem('currentCount')) || this.currentCount;
		this.gotCoin = Number(localStorage.getItem('gotCoin')) || this.gotCoin;
		this.font_coinNum.string = "<outline color=#755313 width=2><color=#fff881>" + this.gotCoin + "</color></outline>";
		if (this.currentCount >= this.totalCount) {
			this.font_coinNum.string = "<outline color=#755313 width=2><color=#fff881>明天再来</color></outline>";
		}
	},
	getOnlineCoin: function () {
		USERINFO.coin += this.gotCoin;
		this.gotCoin = 0;
		this.font_coinNums.string = USERINFO.coin;
		this.font_coinNum.string = "<outline color=#755313 width=2><color=#fff881>" + this.gotCoin + "</color></outline>";
		if (this.currentCount >= this.totalCount) {
			this.font_coinNum.string = "<outline color=#755313 width=2><color=#fff881>明天再来</color></outline>";
		}
	},
	update: function (dt) {
		if (this.currentCount >= this.totalCount) {
			this.progressBar.progress = 1
			return this.currentCount = this.totalCount;
		}
		let ratio = this.timer / this.timeToRecover;
		this.progressBar.progress = ratio;
		let timeLeft = Math.floor(this.timeToRecover - this.timer);
		//显示现在已经转几圈
		this.labelTimer.string = Math.floor(timeLeft / 60).toString() + ':' + (timeLeft % 60 < 10 ? '0' : '') + timeLeft % 60;
		this.timer += dt;
		if (this.timer >= this.timeToRecover) {
			this.timer = 0;
			this.currentCount++;
			this.gotCoin += this.eachCoin;
			this.font_coinNum.string = "<outline color=#755313 width=2><color=#fff881>" + this.gotCoin + "</color></outline>";
		}
	},
});