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
    tapPowe: function () {
        console.log('tap威力！');
    },
    tapLife: function () {
        console.log('tap生命！');
    },
    useProp: function () {
        console.log('使用道具');
    },
    noprop: function () {
        console.log('不使用道具');
        this.hide();
    },
});
