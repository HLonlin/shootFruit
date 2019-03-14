cc.Class({
    extends: cc.Component,
    properties: {
        btn_getWelfare: {
            default: null,
            type: cc.Sprite,
            displayName: '领取福利',
            tooltip: '领取福利按钮'
        },
    },
    onLoad() {
        this.isgot = localStorage.getItem('isGotWelfare') || 'false';
        if (this.isgot == 'true') {
            this.btn_getWelfare.getComponent(cc.Button).interactable = false;
            this.btn_getWelfare.node.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已领取</color>';
        } else if (USERINFO.initScene == '1001' || USERINFO.initScene == '1103' || USERINFO.initScene == '1104') {
            this.btn_getWelfare.getComponent(cc.Button).interactable = true;
        } else {
            this.btn_getWelfare.getComponent(cc.Button).interactable = false;
            this.btn_getWelfare.node.getChildByName("font_getWelfare").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>立即领取</color>';
        }
    },
});
