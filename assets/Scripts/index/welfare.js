cc.Class({
    extends: cc.Component,
    properties: {
        btn_getWelfare: {
            default: null,
            type: cc.Sprite,
            displayName: '领取福利',
            tooltip: '领取福利按钮'
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
    onLoad() {
        // this.isgot = localStorage.getItem('isGotWelfare') || 'false';
        if (USERINFO.isgot === 1) {
            this.btn_getWelfare.getComponent(cc.Button).interactable = false;
            this.btn_getWelfare.node.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>';
        } else if (USERINFO.initSync.scene == '1104') {
            this.btn_getWelfare.getComponent(cc.Button).interactable = true;
        } else {
            this.btn_getWelfare.getComponent(cc.Button).interactable = false;
            this.btn_getWelfare.node.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>立即领取</color>';
        }
    },
    onGetReword: function () {
        var that = this;
        USERINFO.isgot = 1;
        for (var i = 0, max = that.icon_luckyReward.children.length; i < max; i++) {
            that.icon_luckyReward.children[i].destroy();
        }
        let item_diamond = cc.instantiate(that.item_diamond);
        item_diamond.getChildByName("font_rewardNum").getComponent(cc.Label).string = 'x 200';
        that.icon_luckyReward.addChild(item_diamond);
        that.icon_luckyReward.height = 115
        that.tips_reward.show();
    }
});
