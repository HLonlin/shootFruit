// 结束页
cc.Class({
    extends: cc.Component,
    properties: {
        font_level: {
            default: null,
            type: cc.Node,
            displayName: '关卡',
            tooltip: '关卡数'
        },
        font_score: {
            default: null,
            type: cc.Node,
            displayName: '分数',
            tooltip: '关卡得分'
        },
        tips_victory: {
            default: null,
            type: cc.Node,
            displayName: '胜利页',
            tooltip: '通关胜利页'
        },
        tips_revive: {
            default: null,
            type: cc.Node,
            displayName: '复活页',
            tooltip: '惜败复活页'
        },
        tips_over: {
            default: null,
            type: cc.Node,
            displayName: '失败页',
            tooltip: '失败结束页'
        },
        panel_levelUp: {
            default: null,
            type: require('fadeTab'),
            displayName: '升级面板',
            tooltip: '武器威力、暴击升级'
        },
        font_coin: {
            default: null,
            type: cc.Node,
            displayName: '金币',
            tooltip: '金币数'
        },
        font_diamond: {
            default: null,
            type: cc.Node,
            displayName: '钻石',
            tooltip: '钻石数'
        },
    },
    hideIcon: function () {
        this.font_coin.opacity = 0;
        this.font_diamond.opacity = 0;
    },
    showIcon: function () {
        this.font_coin.opacity = 255;
        this.font_diamond.opacity = 255;
    },
    fadein_victory: function () {
        this.font_level.getComponent(cc.RichText).string = "<outline color=#39A3FF width=2><color=#ffffff>第" + USERINFO.level + "关</color></outline>";
        this.font_score.getComponent(cc.Label).string = HL.nodePoolState.gameScore;
        this.victoryCoin_zIndex = this.font_coin.zIndex;
        this.victoryDiam_zIndex = this.font_diamond.zIndex;
        this.tips_victory.getComponent('tips').show();
        this.showIcon();
    },
    fadeOut_victory: function () {
        this.hideIcon();
        this.tips_victory.getComponent('tips').hide();
        this.font_coin.zIndex = this.victoryCoin_zIndex;
        this.font_diamond.zIndex = this.victoryDiam_zIndex;
    },
    fadein_revive: function () {
        this.font_coin.opacity = 255;
        this.font_diamond.opacity = 255;
        this.reviveCoin_zIndex = this.font_coin.zIndex;
        this.reviveDiam_zIndex = this.font_diamond.zIndex;
        this.tips_revive.getComponent('tips').show();
        this.panel_levelUp.node.getComponent('fadeTab').fadeToggle();
        this.showIcon();
    },
    fadeOut_revive: function () {
        this.hideIcon();
        this.panel_levelUp.node.getComponent('fadeTab').fadeToggle();
        this.font_diamond.zIndex = this.victoryDiam_zIndex;
        this.tips_revive.getComponent('tips').hide();
        this.font_coin.zIndex = this.victoryCoin_zIndex;
    },
    fadein_over: function () {
        this.showIcon();
        this.font_coin.opacity = 255;
        this.font_diamond.opacity = 255;
        this.overCoin_zIndex = this.font_coin.zIndex;
        this.overDiam_zIndex = this.font_diamond.zIndex;
        this.tips_over.getComponent('tips').show();
    },
    fadeOut_over: function () {
        this.hideIcon();
        this.font_coin.opacity = 0;
        this.font_diamond.opacity = 0;
        this.tips_over.getComponent('tips').hide();
        this.font_coin.zIndex = this.victoryCoin_zIndex;
        this.font_diamond.zIndex = this.victoryDiam_zIndex;
    },
});
