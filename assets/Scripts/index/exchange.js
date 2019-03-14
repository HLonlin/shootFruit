cc.Class({
    extends: cc.Component,
    properties: {
        defaultNum: {
            default: 10,
            type: cc.Integer,
            min: 10,
            step: 10,
            displayName: '默认兑换',
            tooltip: '最低兑换数量'
        },
        font_num: {
            default: null,
            type: cc.RichText,
            displayName: '兑换数量',
            tooltip: '准备要兑换的钻石数量'
        },
        font_userDiamond: {
            default: null,
            type: cc.Label,
            displayName: '钻石',
            tooltip: '用户钻石数'
        },
        font_userCoin: {
            default: null,
            type: cc.Label,
            displayName: '金币',
            tooltip: '用户金币数'
        },
    },
    onLoad() {
    },
    addDiamonds: function () {
        // 增加兑换的钻石数量
        this.defaultNum += 10;
        this.numChangeCall(this.defaultNum);
    },
    reduceDiamonds: function () {
        // 减少兑换的钻石数量
        this.defaultNum -= 10;
        if (this.defaultNum <= 10) {
            this.defaultNum = 10;
        }
        this.numChangeCall(this.defaultNum);
    },
    numChangeCall: function (num) {
        this.font_num.string = "<color=#FFEFB2>" + num + "</color>";
        if (num > USERINFO.diamond) {
            this.font_num.string = "<color=#FF0000>" + num + "</color>";
        }
    },
    exchange: function () {
        if (this.defaultNum > USERINFO.diamond) {
            return;
        } else {
            // 钻石换金币汇率 = 1: 10
            var coins = this.defaultNum * 10;
            USERINFO.diamond = USERINFO.diamond - this.defaultNum;
            USERINFO.coin = USERINFO.coin + coins;
            this.font_userCoin.string = USERINFO.coin;
            this.font_userDiamond.string = USERINFO.diamond;
            this.numChangeCall(this.defaultNum);
        }
    }
});
