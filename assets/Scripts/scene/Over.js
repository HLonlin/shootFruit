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
        font_score_over: {
            default: null,
            type: cc.Node,
            displayName: '结束分数',
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
        cardPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: 'item_gameList',
            tooltip: '列表中item预制'
        },
        scrollView: {
            default: null,
            type: cc.Node,
            displayName: '推荐列表',
            tooltip: '推荐列表'
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
    submitScore: function () {
        HL.ajax.post(HL.ajax.sendScore, { score: HL.nodePoolState.gameScore, uid: USERINFO.uid, fruits_id: USERINFO.bulletsInUse }, ((e) => {
            // 请求成功
            if (e.code == 1) {
                console.log('提交成功：', e.data);
                USERINFO.highestScore = e.data.high_score;
                localStorage.setItem('highestScore', USERINFO.highestScore);
            } else {
                console.log('fail');
            }
        }));
    },
    fadein_victory: function () {
        this.submitScore();
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
        this.submitScore();
        this.font_score_over.getComponent(cc.Label).string = '本局得分：' + HL.nodePoolState.gameScore;
        // 上传最高分
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'overRank',
                maxScore: USERINFO.highestScore,
            })
        }
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
    onLoad() {
        this.init();
    },
    init: function () {
        this.itemsArr = [];
        if (this.scrollView.children.length >= 6) {
            return;
        }
        for (let i = 0; i < 6; ++i) {
            let items = this.additem();
            this.itemsArr.push(items);
        }
        this.addEvents();


    },
    additem: function () {
        let card = cc.instantiate(this.cardPrefab);
        var remoteUrl = "https://img.zcool.cn/community/01849a5c85eaefa80120af9a7984af.png@1280w_1l_2o_100sh.png";
        cc.loader.load(remoteUrl, function (err, texture) {
            var sf = new cc.SpriteFrame(texture);
            card.getChildByName("gameList_head").getComponent(cc.Sprite).spriteFrame = sf;
            card.getChildByName("gameList_head").width = 120;
            card.getChildByName("gameList_head").height = 120;
            card.getChildByName("font_gameName").getComponent(cc.Label).string = '游戏游戏';
        });
        this.scrollView.addChild(card);
        return card;
    },
    // 对应跳转
    addEvents: function () {
        for (var i = 0, max = this.itemsArr.length; i < max; i++) {
            this.itemsArr[i].index = i;
            this.itemsArr[i].on('touchend', function (event) {
                var index = event.currentTarget.index
                console.log('跳转到小程序：', index);
            }, this);
        }
    },
});
