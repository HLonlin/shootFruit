cc.Class({
    extends: cc.Component,
    properties: {
        defaultNum: {
            default: 10,
            type: cc.Integer,
            min: 10,
            step: 10,
            displayName: '默认兑换',
            tooltip: '最低兑换数量'
        },
        font_num: {
            default: null,
            type: cc.RichText,
            displayName: '兑换数量',
            tooltip: '准备要兑换的钻石数量'
        },
        DiamondNum: {
            default: null,
            type: cc.Label,
            displayName: '剩余次数',
            tooltip: '剩余领取钻石次数'
        },
        font_userDiamond: {
            default: null,
            type: cc.Label,
            displayName: '钻石',
            tooltip: '用户钻石数'
        },
        font_userCoin: {
            default: null,
            type: cc.Label,
            displayName: '金币',
            tooltip: '用户金币数'
        },
        font_exchangeDiam: {
            default: null,
            type: cc.Label,
            displayName: '钻石兑率',
            tooltip: '钻石兑换率'
        },
        font_exchangeCoin: {
            default: null,
            type: cc.Label,
            displayName: '金币兑率',
            tooltip: '金币兑换率'
        },
    },
    onLoad() {
        this.outOfWorld = cc.v2(3000, 0);
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
        // 检测是否需要初始化剩余领取次数
        if (USERINFO.exchange_DiamondDay != new Date().getDate()) {
            USERINFO.exchange_DiamondDay = new Date().getDate();
            // 初始化签到状态
            USERINFO.exchange_getDiamond = 2;
        }
    },
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
        this.DiamondNum.string = "剩余" + USERINFO.exchange_getDiamond + "次机会";
        if (USERINFO.exchange_getDiamond <= 0) {
            var color = new cc.Color(255, 0, 0);
            this.DiamondNum.node.color = color;
        }
        WECHAT.showBannerAd();
    },
    hide: function () {
        this.node.emit('fade-out');
        WECHAT.closeBannerAd();
    },
    startFadeIn: function () {
        this.node.position = cc.v2(0, 0);
        this.node.setScale(2);
        this.node.opacity = 0;
        this.node.runAction(this.actionFadeIn);
    },
    startFadeOut: function () {
        this.node.runAction(this.actionFadeOut);
    },
    onFadeInFinish: function () {
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
    // 兑换领取钻石
    exchange_getDiamond: function () {
        if (USERINFO.exchange_getDiamond > 0) {
            WECHAT.share(null, () => {
                USERINFO.exchange_getDiamond -= 1;
                USERINFO.diamond += 50;
                this.font_userDiamond.string = USERINFO.diamond;
                this.DiamondNum.string = "剩余" + USERINFO.exchange_getDiamond + "次机会";
                if (USERINFO.exchange_getDiamond <= 0) {
                    var color = new cc.Color(255, 0, 0);
                    this.DiamondNum.node.color = color;
                }
                USERINFO.save();
            }, () => {
                wx.showToast({
                    title: '请分享到群',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
            }, 'openId=' + USERINFO.openId);
        } else {
            console.log('次数不足');
        }
    },
    addDiamonds: function () {
        // 增加兑换的钻石数量
        this.defaultNum += 10;
        this.numChangeCall(this.defaultNum);
    },
    reduceDiamonds: function () {
        // 减少兑换的钻石数量
        this.defaultNum -= 10;
        if (this.defaultNum <= 10) {
            this.defaultNum = 10;
        }
        this.numChangeCall(this.defaultNum);
    },
    numChangeCall: function (num) {
        this.font_num.string = "<color=#FFEFB2>" + num + "</color>";
        this.font_exchangeDiam.string = num;
        this.font_exchangeCoin.string = num * 10;
        if (num > USERINFO.diamond) {
            this.font_num.string = "<color=#FF0000>" + num + "</color>";
        }
    },
    exchange: function () {
        if (this.defaultNum > USERINFO.diamond) {
            return;
        } else {
            // 钻石换金币汇率 = 1: 10
            var coins = this.defaultNum * 10;
            USERINFO.diamond = USERINFO.diamond - this.defaultNum;
            USERINFO.coin = USERINFO.coin + coins;
            this.font_userCoin.string = USERINFO.coin;
            this.font_userDiamond.string = USERINFO.diamond;
            this.numChangeCall(this.defaultNum);
        }
    }
});
