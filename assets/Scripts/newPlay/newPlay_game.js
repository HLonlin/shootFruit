cc.Class({
    extends: cc.Component,
    properties: {
        duration: {
            default: 0.2,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
        },
        finger: {
            default: null,
            type: cc.Node,
            displayName: '手指',
            tooltip: '手指指示'
        },
        stepTip: {
            default: null,
            type: cc.Node,
            displayName: '步骤提示',
            tooltip: '新手步骤提示'
        },
        hinder: {
            default: null,
            type: cc.Node,
            displayName: '障碍物',
            tooltip: '水果障碍物'
        }
    },
    onLoad: function () {
        this.outOfWorld = cc.v2(3000, 0);
        this.node.position = this.outOfWorld;
        let cbFadeOut = cc.callFunc(this.onFadeOutFinish, this);
        let cbFadeIn = cc.callFunc(this.onFadeInFinish, this);
        this.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 2.0)), cbFadeOut);
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
        USERINFO.step = 1;
    },
    show: function () {
        this.node.active = true;
        this.node.emit('fade-in');
    },
    hide: function () {
        this.node.emit('fade-out');
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
    newPlay_step: function () {
        var that = this;
        var stepTipStr = this.stepTip.getChildByName("font_stepTip").getComponent(cc.Label);
        var hindeAnim = this.hinder.getComponent(cc.Animation);
        if (USERINFO.step === 1) {
            stepTipStr.string = '抓住机会，再点击一次';
            hindeAnim.pause('animation_hinder110');
            this.hinder.runAction(cc.rotateTo(0.5, -140.0));
            USERINFO.step += 1;
        } else if (USERINFO.step === 2) {
            stepTipStr.string = '试试撞击一下障碍物';
            this.hinder.runAction(cc.rotateTo(0.5, -195.0));
            USERINFO.step += 1;
        } else if (USERINFO.step === 3) {
            this.finger.active = false;
            setTimeout(function () {
                stepTipStr.string = 'Oh no!子弹反弹了';
                setTimeout(function () {
                    stepTipStr.string = '接下来就看你的了，疯狂射击吧';
                    hindeAnim.resume('animation_hinder110');
                    setTimeout(function () {
                        that.stepTip.active = false;
                    }, 2000);
                }, 1000)
            }, 300);
            USERINFO.step += 1;
        }
    }
});
