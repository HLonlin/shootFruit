cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad() {
    },
    openRank: function () {
        // 打开好友排行
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'openRank',
                maxScore: USERINFO.highestScore,
            })
        }
    },
    lastRank: function () {
        // 上一页
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'lastRank',
                maxScore: USERINFO.highestScore,
            })
        }
    },
    nextRank: function () {
        // 下一页
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'nextRank',
                maxScore: USERINFO.highestScore,
            })
        }
    }
});
