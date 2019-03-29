// 签到页
const reward = cc.Class({
    name: 'singnReward',
    properties: {
        res: {
            default: null,
            type: cc.SpriteFrame,
            displayName: '物品',
            tooltip: '奖励物品'
        },
        Number: {
            default: 0,
            type: cc.Integer,
            displayName: '数量',
            tooltip: '要奖励的数量(整数)'
        }
    }
});
cc.Class({
    extends: cc.Component,
    properties: {
        dayArr: {
            default: [],
            type: [cc.Node],
            displayName: '签到日历',
            tooltip: '星期一到星期日'
        },
        Day: {
            default: 1,
            type: cc.Integer,
            displayName: '日期',
            tooltip: '今天星期几'
        },
        singnReward: {
            default: [],
            type: reward,
            displayName: '签到奖励',
            tooltip: '每日签到的奖励'
        },
        btn_singn: {
            default: null,
            type: cc.Sprite,
            displayName: '签到按钮',
            tooltip: '签到按钮'
        },
        font_coinNums: {
            default: null,
            type: cc.Label,
            displayName: '金币',
            tooltip: '用户拥有金币'
        },
        font_diamNums: {
            default: null,
            type: cc.Label,
            displayName: '钻石',
            tooltip: '用户拥有钻石'
        },
        btn_openDurian: {
            default: null,
            type: cc.Button,
            displayName: '开启榴莲按钮',
            tooltip: '开启榴莲按钮'
        },
        redPoint_durian: {
            default: null,
            type: cc.Sprite,
            displayName: '榴莲红点',
            tooltip: '榴莲红点'
        },
        font_durianNum: {
            default: null,
            type: cc.Label,
            displayName: '榴莲蛋',
            tooltip: '榴莲蛋抽奖次数'
        },
    },
    onLoad() {
        this.today = USERINFO.today || new Date().getDate(); //上一次刷新签到状态的日期
        this.signInState = USERINFO.signInState || 0; //签到状态默认为未签到、0：未签到   1：已签到一次 2：已签到2次
        // 检测是否需要初始化签到状态
        if (this.today != new Date().getDate()) {
            this.today = new Date().getDate();
            localStorage.setItem('today', this.today);
            USERINFO.today = this.today;
            // 初始化签到状态
            this.signInState = 0;
        }
        this.Day = new Date().getDay() == 0 ? 7 : new Date().getDay();
        this.Day -= 1;
    },
    start() {
        this.initUi();
    },
    initUi: function () {
        if (this.signInState == 1) {
            this.btn_singn.node.getChildByName("font_singnIn").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>再签一次</color>';
        } else if (this.signInState == 2) {
            this.btn_singn.node.getComponent(cc.Button).interactable = false;
            this.btn_singn.node.getChildByName("font_singnIn").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已签到</color>';
        }
        for (var i = 0, max = this.dayArr.length; i < max; i++) {
            // 之前
            if (i < this.Day) {
                this.dayArr[i].children[0].active = true;
                // 奖励物品
                var icon_singnCoin = this.dayArr[i].children[0].getChildByName("icon_singnCoin");
                if (icon_singnCoin != null) {
                    icon_singnCoin.getComponent(cc.Sprite).spriteFrame = this.singnReward[i].res;
                    if (this.singnReward[i].res.name == 'tubiao_liulian') {
                        icon_singnCoin.setScale(0.75);
                    }
                }
            }
            // 当天
            if (i == this.Day) {
                this.dayArr[i].getChildByName('singn1').getChildByName('font_data').getComponent(cc.Label).string = '今天';
                this.dayArr[i].getChildByName('singn2').getChildByName('font_data').getComponent(cc.Label).string = '今天';
                this.dayArr[i].getChildByName('singn3').getChildByName('font_data').getComponent(cc.Label).string = '今天';
                if (this.signInState == 0) {
                    this.dayArr[i].children[0].active = false;
                    this.dayArr[i].children[1].active = true;
                    // 奖励物品
                    var icon_singnCoin = this.dayArr[i].children[1].getChildByName("icon_singnCoin");
                    if (icon_singnCoin != null) {
                        icon_singnCoin.getComponent(cc.Sprite).spriteFrame = this.singnReward[i].res;
                        if (this.singnReward[i].res.name == 'tubiao_liulian') {
                            icon_singnCoin.setScale(0.75);
                        }
                    }
                    // 奖励数目
                    var font_singnNum = this.dayArr[i].children[1].getChildByName("font_singnNum");
                    if (font_singnNum != null) {
                        font_singnNum.getComponent(cc.RichText).string = '<outline color=#2b6393 width=2><color=#ffffff>' + this.singnReward[i].Number + '</color>';
                    }
                } else {
                    this.dayArr[i].children[0].active = true;
                    // 奖励物品
                    var icon_singnCoin = this.dayArr[i].children[0].getChildByName("icon_singnCoin");
                    if (icon_singnCoin != null) {
                        icon_singnCoin.getComponent(cc.Sprite).spriteFrame = this.singnReward[i].res;
                        if (this.singnReward[i].res.name == 'tubiao_liulian') {
                            icon_singnCoin.setScale(0.75);
                        }
                    }
                }
            }
            // 之后
            if (i > this.Day) {
                this.dayArr[i].children[0].active = false;
                this.dayArr[i].children[2].active = true;
                // 奖励物品
                var icon_singnCoin = this.dayArr[i].children[2].getChildByName("icon_singnCoin");
                if (icon_singnCoin != null) {
                    icon_singnCoin.getComponent(cc.Sprite).spriteFrame = this.singnReward[i].res;
                    if (this.singnReward[i].res.name == 'tubiao_liulian') {
                        icon_singnCoin.setScale(0.75);
                    }
                }
                // 奖励数目
                var font_singnNum = this.dayArr[i].children[2].getChildByName("font_singnNum");
                if (font_singnNum != null) {
                    font_singnNum.getComponent(cc.RichText).string = '<outline color=#2b6393 width=2><color=#ffffff>' + this.singnReward[i].Number + '</color>';
                }
            }
        }
    },
    onSingnIn: function (event) {
        var that = this;
        function singnRewards() {
            var res = that.singnReward[that.Day].res.name;
            var num = that.singnReward[that.Day].Number;
            // 判断奖励的物品及数量
            if (res == 'tubiao_jinbi00') {
                USERINFO.coin += num;
                that.font_coinNums.string = USERINFO.coin;
            } else if (res == 'tubiao_zuanshi00') {
                USERINFO.diamond += num;
                that.font_diamNums.string = USERINFO.diamond;
            } else if (res == 'tubiao_liulian') {
                USERINFO.durian += num;
                if (USERINFO.durian == 0) {
                    that.btn_openDurian.interactable = true;
                    that.redPoint_durian.node.active = false;
                } else {
                    that.btn_openDurian.interactable = false;
                    that.redPoint_durian.node.active = true;
                    that.font_durianNum.string = USERINFO.durian;
                }
            } else if (res == 'tubiao_lihe0201') {
                console.log('奖励礼盒');
            }
            that.signInState = that.signInState + 1;
            // 保存最新签到状态
            localStorage.setItem('signInState', that.signInState);
            USERINFO.signInState = that.signInState;
            // 保存最新签到日期
            localStorage.setItem('today', that.today);
            USERINFO.today = that.today;
            // 更新界面
            if (that.signInState == 1) {
                event.currentTarget.getChildByName("font_singnIn").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>再签一次</color>';
            } else if (that.signInState == 2) {
                event.currentTarget.getComponent(cc.Button).interactable = false;
                event.currentTarget.getChildByName("font_singnIn").getComponent(cc.RichText).string = '<outline color=#9e5d00 width=2><color=#ffffff>已签到</color>';
            }
            that.dayArr[that.Day].children[0].active = true;
            that.dayArr[that.Day].children[1].active = false;
            // 奖励物品
            var icon_singnCoin = that.dayArr[that.Day].children[0].getChildByName("icon_singnCoin");
            if (icon_singnCoin != null) {
                icon_singnCoin.getComponent(cc.Sprite).spriteFrame = that.singnReward[that.Day].res;
            }
            USERINFO.save();
        }
        if (that.signInState == 1) {
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                WECHAT.openVideoAd(() => {
                    singnRewards();
                }, () => {
                    console.log('中途退出视频');
                }, () => {
                    WECHAT.share(null, () => {
                        singnRewards();
                    }, () => {
                        console.log('分享失败');
                    }, 'querys1=1');
                });
            }
        } else {
            singnRewards();
        }

    }
});