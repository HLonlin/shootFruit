cc.Class({
    extends: cc.Component,

    properties: {
        fruit: {
            default: null,
            type: cc.Node,
            displayName: '水果',
            tooltip: '新水果'
        },
        font_fruitName: {
            default: null,
            type: cc.Node,
            displayName: '水果名字',
            tooltip: '新水果名字'
        },
        font_newBullerPower: {
            default: null,
            type: cc.Label,
            displayName: '水果威力',
            tooltip: '新水果威力'
        },
        duration: {
            default: 0.2,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
        },
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
        var bulletNum = USERINFO.Data_game[2].json[USERINFO.level - 2].bullet;
        this.fruit.getComponent(cc.Sprite).spriteFrame = USERINFO.bulletShop[bulletNum - 1].res;
        this.font_fruitName.getComponent(cc.RichText).string = '<outline color=#af5f00 width=2><color=#ffffff>' + USERINFO.bulletShop[bulletNum - 1].name + '</color></outline>'
        this.font_newBullerPower.string = USERINFO.bulletShop[bulletNum - 1].power;
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
});
