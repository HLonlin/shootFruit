cc.Class({
    extends: cc.Component,
    properties: {
        propLifeUp: {
            default: null,
            type: cc.Node,
            displayName: '提升生命',
            tooltip: '生命提升道具'
        },
        propPowerUp: {
            default: null,
            type: cc.Node,
            displayName: '提升威力',
            tooltip: '威力提升道具'
        },
        btn_useprop: {
            default: null,
            type: cc.Node,
            displayName: '使用道具',
            tooltip: '使用道具按钮'
        },
        btn_noprop: {
            default: null,
            type: cc.Node,
            displayName: '不用道具',
            tooltip: '不使用道具'
        },
        arm: {
            default: null,
            type: require('arms'),
            displayName: '武器',
            tooltip: '武器信息'
        },
        fruit: {
            default: null,
            type: cc.Node,
            displayName: '水果',
            tooltip: '水果信息'
        },
        duration: {
            default: 0.2,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
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
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
    tapLife: function () {
        this.propLifeUp.getChildByName("outline_onTap").active = true;
        this.propPowerUp.getChildByName("outline_onTap").active = false;
        // if (this.propLifeUp.getChildByName("outline_onTap").active) {
        //     this.propLifeUp.getChildByName("outline_onTap").active = false;
        // } else {
        //     this.propLifeUp.getChildByName("outline_onTap").active = true;
        // }
    },
    tapPowe: function () {
        this.propLifeUp.getChildByName("outline_onTap").active = false;
        this.propPowerUp.getChildByName("outline_onTap").active = true;
        // if (this.propPowerUp.getChildByName("outline_onTap").active) {
        //     this.propPowerUp.getChildByName("outline_onTap").active = false;
        // } else {
        //     this.propPowerUp.getChildByName("outline_onTap").active = true;
        // }
    },
    useProp: function () {
        var that = this;
        WECHAT.openVideoAd(() => {
            if (that.propLifeUp.getChildByName("outline_onTap").active) {
                USERINFO.heart = 2;
                USERINFO.DoubleDamage = 1;
            } else if (that.propPowerUp.getChildByName("outline_onTap").active) {
                USERINFO.heart = 1;
                USERINFO.DoubleDamage = 2;
            }
            that.fruit.getComponent('fruit').fruitInit();
            that.arm.initStage();
            this.hide();
        }, () => {
            wx.showToast({
                title: '视频未播放结束',
                icon: 'none',
                duration: 2000,
                mask: true
            });
        }, () => {
            WECHAT.share(null, () => {
                if (that.propLifeUp.getChildByName("outline_onTap").active) {
                    USERINFO.heart = 2;
                    USERINFO.DoubleDamage = 1;
                } else if (that.propPowerUp.getChildByName("outline_onTap").active) {
                    USERINFO.heart = 1;
                    USERINFO.DoubleDamage = 2;
                }
                that.fruit.getComponent('fruit').fruitInit();
                that.arm.initStage();
                this.hide();
            }, () => {
                wx.showToast({
                    title: '请分享到群',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
            }, 'openId=' + USERINFO.openId);
        });
        // 多选道具：选择其中一个道具时以分享形式使用，选择两个道具时以视频形式使用
        // if (this.propLifeUp.getChildByName("outline_onTap").active && this.propPowerUp.getChildByName("outline_onTap").active) {
        //     WECHAT.openVideoAd(() => {
        //         USERINFO.heart = 2;
        //         USERINFO.DoubleDamage = 2;
        //         that.fruit.getComponent('fruit').fruitInit();
        //         that.arm.initStage();
        //         this.hide();
        //     }, () => {
        //         wx.showToast({
        //             title: '视频未播放结束',
        //             icon: 'none',
        //             duration: 2000,
        //             mask: true
        //         });
        //     }, () => {
        //         WECHAT.share(null, () => {
        //             USERINFO.heart = 2;
        //             USERINFO.DoubleDamage = 2;
        //             that.fruit.getComponent('fruit').fruitInit();
        //             that.arm.initStage();
        //             this.hide();
        //         }, () => {
        //             wx.showToast({
        //                 title: '请分享到群',
        //                 icon: 'none',
        //                 duration: 2000,
        //                 mask: true
        //             })
        //         }, 'openId=' + USERINFO.openId);
        //     });
        // } else if (this.propLifeUp.getChildByName("outline_onTap").active || this.propPowerUp.getChildByName("outline_onTap").active) {
        //     WECHAT.share(null, () => {
        //         if (that.propLifeUp.getChildByName("outline_onTap").active) {
        //             USERINFO.heart = 2;
        //             USERINFO.DoubleDamage = 1;
        //         } else if (that.propPowerUp.getChildByName("outline_onTap").active) {
        //             USERINFO.heart = 1;
        //             USERINFO.DoubleDamage = 2;
        //         }
        //         that.fruit.getComponent('fruit').fruitInit();
        //         that.arm.initStage();
        //         this.hide();
        //     }, () => {
        //         wx.showToast({
        //             title: '请分享到群',
        //             icon: 'none',
        //             duration: 2000,
        //             mask: true
        //         })
        //     }, 'openId=' + USERINFO.openId);
        // } else {
        //     wx.showToast({
        //         title: '请选择开局道具',
        //         icon: 'none',
        //         duration: 2000,
        //         mask: true
        //     })
        // }
    },
    noprop: function () {
        var that = this;
        USERINFO.heart = 1;
        USERINFO.DoubleDamage = 1;
        that.fruit.getComponent('fruit').fruitInit();
        that.arm.initStage();
        this.hide();
    },
});
