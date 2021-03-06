cc.Class({
    extends: cc.Component,
    properties: {
        duration: {
            default: 0.2,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
        },
        font_diamNums: {
            default: null,
            type: cc.Label,
            displayName: '钻石',
            tooltip: '用户拥有钻石'
        },
        btn_getDiamond: {
            default: null,
            type: cc.Node,
            displayName: '领取按钮',
            tooltip: '领取钻石按钮'
        },
        tips_reward: {
            default: null,
            type: require('tips'),
            displayName: '奖励弹框',
            tooltip: '获得奖励弹出框'
        },
        icon_luckyReward: {
            default: null,
            type: cc.Node,
            displayName: '奖励box',
            tooltip: '奖励box'
        },
        item_diamond: {
            default: null,
            type: cc.Prefab,
            displayName: '钻石奖励',
            tooltip: '抽奖奖励预制'
        },
    },
    onLoad: function () {
        this.GotDiamondDay = USERINFO.GotDiamondDay || new Date().getDate(); //上一次刷新领取钻石状态的日期
        this.isGotDiamonds = USERINFO.isGotDiamonds || 0; //领取钻石状态 0：未领取  1：已领取
        // 检测是否需要初始化签到状态
        if (this.GotDiamondDay != new Date().getDate()) {
            this.GotDiamondDay = new Date().getDate();
            USERINFO.GotDiamondDay = this.GotDiamondDay;
            // 初始化签到状态
            this.isGotDiamonds = false;
            USERINFO.GotDiamondDay = false;
        }

        this.outOfWorld = cc.v2(3000, 0);
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
    },
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
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
        var that = this;
        if (USERINFO.initSync.query.type == 'getDiamond') {
            if (USERINFO.isGotDiamonds == 1) {
                that.btn_getDiamond.getComponent(cc.Button).interactable = false;
                that.btn_getDiamond.getChildByName('font_share').getComponent(cc.RichText).string = "<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>";
            } else {
                that.btn_getDiamond.getComponent(cc.Button).interactable = true;
                that.btn_getDiamond.getChildByName('font_share').getComponent(cc.RichText).string = "<outline color=#9e5d00 width=2><color=#ffffff>领取</color>";
            }
        } else {
            that.btn_getDiamond.getComponent(cc.Button).interactable = true;
            that.btn_getDiamond.getChildByName('font_share').getComponent(cc.RichText).string = "<outline color=#9e5d00 width=2><color=#ffffff>分享好友</color>";
        }
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
    onGetDiamond: function () {
        var that = this;
        if (USERINFO.initSync.query.type == 'getDiamond') {
            USERINFO.diamond += 40;
            that.font_diamNums.string = USERINFO.diamond;
            USERINFO.isGotDiamonds = 1;
            that.btn_getDiamond.getComponent(cc.Button).interactable = false;
            that.btn_getDiamond.getChildByName('font_share').getComponent(cc.RichText).string = "<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>";
            USERINFO.save();
            that.onGetReword();
        } else {
            WECHAT.sharer(null, () => {
                wx.showModal({
                    title: '温馨提示',
                    content: '从分享链接点进去就能领取钻石哦~',
                    showCancel: false,
                    confirmText: '知道了',
                });
            }, () => {
                wx.showToast({
                    title: '请分享到群',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
            }, 'openId=' + USERINFO.openId + '&type=getDiamond');
        }
    },
    onGetReword: function () {
        var that = this;
        for (var i = 0, max = that.icon_luckyReward.children.length; i < max; i++) {
            that.icon_luckyReward.children[i].destroy();
        }
        let item_diamond = cc.instantiate(that.item_diamond);
        item_diamond.getChildByName("font_rewardNum").getComponent(cc.Label).string = 'x 40';
        that.icon_luckyReward.addChild(item_diamond);
        that.icon_luckyReward.height = 115
        that.tips_reward.show();
    }
});
