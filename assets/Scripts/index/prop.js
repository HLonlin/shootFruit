cc.Class({
    extends: cc.Component,
    properties: {
        bg_propPowerUp: {
            default: null,
            type: cc.Node,
            displayName: '提升威力',
            tooltip: '威力提升道具'
        },
        bg_propLifeUp: {
            default: null,
            type: cc.Node,
            displayName: '提升生命',
            tooltip: '生命提升道具'
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
    randomProp: function () {
        var randomNum = WECHAT.random(0, 2);
        if (randomNum == 1) {
            this.bg_propPowerUp.active = true;
        } else {
            this.bg_propLifeUp.active = true;
        }
    },
    onUseProp_power: function () {
        console.log('使用威力道具按钮');
    },
    onUseProp_Life: function () {
        console.log('使用生命道具按钮');
    },
    init: function (home) {
        this.home = home;
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
        this.randomProp();
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
});
