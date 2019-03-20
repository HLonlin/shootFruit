import { userInfo } from "os";

const fruit = cc.Class({
    name: 'fruitInfo',
    properties: {
        res: {
            default: null,
            type: cc.SpriteFrame,
            displayName: '水果',
            tooltip: '水果的图片资源'
        },
        bullet: {
            default: null,
            type: cc.SpriteFrame,
            displayName: '子弹',
            tooltip: '水果的子弹资源'
        },
        name: {
            default: '',
            displayName: '水果名称',
            tooltip: '水果的名字'
        },
        power: {
            default: 0,
            type: cc.Integer,
            displayName: '威力',
            tooltip: '水果子弹的威力',
            min: 0
        },
        price: {
            default: 0,
            type: cc.Integer,
            displayName: '价格',
            tooltip: '水果子弹的价格',
            min: 0
        },
        state: {
            default: 0,
            type: cc.Integer,
            displayName: '状态',
            tooltip: '0未解锁、1已解锁未购买、2已购买',
            min: 0,
            max: 2
        }
    }
});
cc.Class({
    extends: cc.Component,
    properties: {
        duration: {
            default: 0.2,
            type: cc.Float,
            displayName: '切换时间',
            tooltip: '界面切换用时'
        },
        cardPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: 'item',
            tooltip: '列表中item预制'
        },
        scrollView: {
            default: null,
            type: cc.ScrollView,
            displayName: '滚动列表',
            tooltip: '滚动列表'
        },
        totalCount: {
            default: 0,
            type: cc.Integer,
            displayName: '总数',
            tooltip: '列表中item总数'
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
        tips_exchange: {
            default: null,
            type: cc.Node,
            displayName: '金币不足',
            tooltip: '金币不足时弹出兑换界面'
        },
        fruit: {
            default: [],
            type: fruit,
            displayName: '水果',
            tooltip: '水果的图片资源'
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
        this.initUi();
        this.addevents();
    },
    init: function (home) {
        this.itemsArr = [];
        this.home = home;
        for (let i = 0; i < this.totalCount; i++) {
            let items = this.additem();
            this.itemsArr.push(items);
        }
    },
    //添加列表中的item
    additem: function () {
        let card = cc.instantiate(this.cardPrefab);
        this.scrollView.content.addChild(card);
        return card;
    },
    initUi: function () {
        var that = this;
        for (var i = 0, max = this.itemsArr.length; i < max; i++) {
            this.itemsArr[i].getChildByName("item0").active = false;
            this.itemsArr[i].getChildByName("item1").active = false;
            this.itemsArr[i].getChildByName("item2").active = false;
            this.itemsArr[i].getChildByName("item3").active = false;
            // 子弹威力
            function bulletPower(item) {
                that.itemsArr[i].getChildByName(item).getChildByName("icon_fire").getChildByName("font_power").getComponent(cc.Label).string = USERINFO.bulletShop[i].power;
            }
            bulletPower("item0");
            bulletPower("item1");
            bulletPower("item2");
            bulletPower("item3");
            // 子弹名字
            function bulletName(item) {
                var string = "<outline color=#2b6393 width=2><color=#ffffff>" + USERINFO.bulletShop[i].name + "</color></outline>";
                that.itemsArr[i].getChildByName(item).getChildByName("font_fruitName").getComponent(cc.RichText).string = string;
            }
            bulletName("item1");
            bulletName("item2");
            bulletName("item3");
            // 子弹价格
            var priceString = '<outline color=#2b6393 width=2><color=#ffffff>' + USERINFO.bulletShop[i].price + '</color></outline>';
            that.itemsArr[i].getChildByName('item1').getChildByName('btn_testTry').getChildByName('font_testTry').getComponent(cc.RichText).string = priceString;
            // 水果贴图、剪影
            function bulletRes(item) {
                that.itemsArr[i].getChildByName(item).getChildByName("icon_fruitShadow").getComponent(cc.Sprite).spriteFrame = USERINFO.bulletShop[i].res;
            }
            bulletRes('item1');
            bulletRes('item2');
            bulletRes('item3');

            if (USERINFO.bulletShop[i].state == 0) {
                // 未解锁
                this.itemsArr[i].getChildByName("item0").active = true;
            } else if (USERINFO.bulletShop[i].state == 1) {
                // 已解锁未购买
                this.itemsArr[i].getChildByName("item1").active = true;
            } else if (USERINFO.bulletShop[i].state == 2) {
                // 已购买
                this.itemsArr[i].getChildByName("item2").active = true;
            }
        }
        this.itemsArr[USERINFO.bulletsInUse].getChildByName("item0").active = false;
        this.itemsArr[USERINFO.bulletsInUse].getChildByName("item1").active = false;
        this.itemsArr[USERINFO.bulletsInUse].getChildByName("item2").active = false;
        this.itemsArr[USERINFO.bulletsInUse].getChildByName("item3").active = true;
        if (USERINFO.bulletShop[USERINFO.bulletsInUse].state < 2) {
            this.itemsArr[USERINFO.bulletsInUse].getChildByName("item3").getChildByName("font_inUse").getComponent(cc.Label).string = '试用中';
        }
    },
    addevents: function () {
        var that = this;
        for (var i = 0, max = this.itemsArr.length; i < max; i++) {
            // 未解锁试用按钮
            var btn_testTry = this.itemsArr[i].getChildByName("item0").getChildByName("btn_testTry");
            btn_testTry.index = i;
            btn_testTry.on('touchend', function (event) {
                WECHAT.openVideoAd(() => {
                    var index = event.currentTarget.index
                    USERINFO.bulletsInUse = index;
                    that.initUi();
                }, () => {
                    console.log('中途退出视频');
                }, () => {
                    WECHAT.share(null, () => {
                        var index = event.currentTarget.index
                        USERINFO.bulletsInUse = index;
                        that.initUi();
                    }, () => {
                        console.log('分享失败');
                    }, 'querys1=1');
                });
            });
            // 未购买试用按钮
            var btn_testTry0 = this.itemsArr[i].getChildByName("item1").getChildByName("btn_test");
            btn_testTry0.index = i;
            btn_testTry0.on('touchend', function (event) {
                WECHAT.openVideoAd(() => {
                    var index = event.currentTarget.index
                    USERINFO.bulletsInUse = index;
                    that.initUi();
                }, () => {
                    console.log('中途退出视频');
                }, () => {
                    WECHAT.share(null, () => {
                        var index = event.currentTarget.index
                        USERINFO.bulletsInUse = index;
                        that.initUi();
                    }, () => {
                        console.log('分享失败');
                    }, 'querys1=1');
                });
            });
            // 购买按钮
            var btn_testTry1 = this.itemsArr[i].getChildByName("item1").getChildByName("btn_testTry");
            btn_testTry1.index = i;
            btn_testTry1.on('touchend', function (event) {
                var index = event.currentTarget.index;
                var price = USERINFO.bulletShop[index].price;
                if (USERINFO.coin >= price) {
                    USERINFO.coin -= price;
                    that.font_coinNums.string = USERINFO.coin;
                    USERINFO.bulletShop[index].state = 2;
                    USERINFO.bulletsInUse = index;
                    that.initUi();
                } else {
                    that.tips_exchange.getComponent('tips').show();
                }
            });
            // 使用按钮
            var btn_testTry2 = this.itemsArr[i].getChildByName("item2").getChildByName("btn_testTry");
            btn_testTry2.index = i;
            btn_testTry2.on('touchend', function (event) {
                var index = event.currentTarget.index
                USERINFO.bulletsInUse = index;
                that.initUi();
            });
        }
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
    },
    onFadeOutFinish: function () {
        this.node.position = this.outOfWorld;
    },
});
