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
    },
    initUi: function () {
        this.font_level.getComponent(cc.RichText).string = "<outline color=#39A3FF width=2><color=#ffffff>第" + USERINFO.level + "关</color></outline>";
        this.font_score.getComponent(cc.Label).string = HL.nodePoolState.gameScore;
    }
});
