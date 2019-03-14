// 升级面板切换效果
cc.Class({
    extends: cc.Component,
    properties: {
        duration: {
            default: 0.1,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
        },
        font_StartGame: {
            default: null,
            type: cc.Node,
            displayName: '开始游戏',
            tooltip: '开始游戏'
        },
        btn_durian: {
            default: null,
            type: cc.Node,
            displayName: '榴莲蛋',
            tooltip: '榴莲蛋开启按钮'
        },
        btn_countDown: {
            default: null,
            type: cc.Node,
            displayName: '倒计时',
            tooltip: '在线金币倒计时'
        },
        btn_ranking: {
            default: null,
            type: cc.Node,
            displayName: '排行榜',
            tooltip: '排行榜按钮'
        },
        btn_singnIn: {
            default: null,
            type: cc.Node,
            displayName: '签到',
            tooltip: '签到按钮'
        }
    },
    onLoad: function () {
        this.node.on('fade-in', this.startFadeIn, this);
        this.node.on('fade-out', this.startFadeOut, this);
        this.fade = false;
    },
    init: function (home) {
        this.home = home;
    },
    fadeToggle: function () {
        if (!this.fade) {
            this.node.active = true;
            this.node.emit('fade-in');
            this.fade = true;
        } else {
            this.node.emit('fade-out');
            this.fade = false;
        }
    },
    startFadeIn: function () {
        this.node.setScale(cc.v2(1, 0));
        this.node.opacity = 0;
        var onFadeInFinish = function () { this.font_StartGame.opacity = 0 };
        // 排行榜
        var action = cc.moveTo(this.duration, cc.v2(-280, 360));
        this.btn_ranking.runAction(action);
        // 签到
        var actions = cc.moveTo(this.duration, cc.v2(-280, 240));
        this.btn_singnIn.runAction(actions);
        // 倒计时
        var actionTo = cc.moveTo(this.duration, cc.v2(275, 80));
        this.btn_countDown.runAction(actionTo);
        // 榴莲蛋
        var actionBy = cc.moveTo(this.duration, cc.v2(-275, 80));
        this.btn_durian.runAction(actionBy);
        // 升级面板
        let cbFadeIn = cc.callFunc(onFadeInFinish, this);
        var actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 255), cc.scaleTo(this.duration, 1.0)), cbFadeIn);
        this.node.runAction(actionFadeIn);
    },
    startFadeOut: function () {
        var onFadeOutFinish = function () { this.font_StartGame.opacity = 255 };
        // 排行榜
        var action = cc.moveTo(this.duration, cc.v2(-280, 230));
        this.btn_ranking.runAction(action);
        // 签到
        var actions = cc.moveTo(this.duration, cc.v2(-280, 110));
        this.btn_singnIn.runAction(actions);
        // 倒计时
        var actionTo = cc.moveTo(this.duration, cc.v2(275, -60));
        this.btn_countDown.runAction(actionTo);
        // 榴莲蛋
        var actionBy = cc.moveTo(this.duration, cc.v2(-275, -60));
        this.btn_durian.runAction(actionBy);
        // 升级面板
        let cbFadeOut = cc.callFunc(onFadeOutFinish, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.duration, 0), cc.scaleTo(this.duration, 1, 0)), cbFadeOut);
        this.node.runAction(actionFadeOut);
    },
});