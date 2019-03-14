cc.Class({
    extends: cc.Component,

    properties: {
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
    },
    onLoad() {
        this.init();
    },
    init: function () {
        this.itemsArr = [];
        for (let i = 0; i < this.totalCount; ++i) {
            let items = this.additem();
            this.itemsArr.push(items);
        }
        this.addEvents();
    },
    //添加列表中的item
    additem: function () {
        let card = cc.instantiate(this.cardPrefab);
        var remoteUrl = "https://img.zcool.cn/community/01849a5c85eaefa80120af9a7984af.png@1280w_1l_2o_100sh.png";
        cc.loader.load(remoteUrl, function (err, texture) {
            var sf = new cc.SpriteFrame(texture);
            card.getChildByName("icon_gameList").getComponent(cc.Sprite).spriteFrame = sf;
            card.getChildByName("icon_gameList").width = 120;
            card.getChildByName("icon_gameList").height = 120;
        });
        this.scrollView.content.addChild(card);
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
