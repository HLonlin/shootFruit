cc.Class({
    extends: cc.Component,
    properties: {
        rankPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: '排行榜预制',
            tooltip: '排行榜预制'
        },
        top: {
            default: [],
            type: cc.SpriteFrame,
            displayName: '前三排名标志',
            tooltip: '前三排名标志'
        },
        worldrank: {
            default: null,
            type: cc.Node,
            displayName: '世榜box',
            tooltip: '世榜box'
        },
        page: {
            default: 1,
            type: cc.Integer,
            displayName: '页码',
            tooltip: '第几页'
        },
        rankType: {
            default: 'world',
            displayName: '默认榜',
            tooltip: '默认打开的排行榜'
        },
        world: {
            default: null,
            type: cc.Node,
            displayName: '世界排行榜',
            tooltip: '世界排行榜'
        },
        friend: {
            default: null,
            type: cc.Node,
            displayName: '好友排行榜',
            tooltip: '好友排行榜'
        }
    },
    onLoad() {
    },
    createImage(sprite, url) {
        let image = wx.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            texture.url = url;// 你可以暂时加这句话，如果不想可以等待新版本
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    },
    openFriend: function () {
        // 打开好友排行
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'openRank',
                maxScore: USERINFO.highestScore,
            })
        }
    },
    openWorld: function () {
        var that = this;
        this.rankType = 'world';
        this.friend.active = false
        this.world.active = true;
        // 打开世界排行
        HL.ajax.post(HL.ajax.ranking, { uid: USERINFO.uid, page: this.page, size: 7 }, ((e) => {
            // 请求成功
            if (e.code == 1) {
                this.itemsArr = [];
                if (e.data.rank_world.length == 0) {
                    return;
                }
                for (var i = 0, max = this.worldrank.children.length; i < max; i++) {
                    this.worldrank.children[i].destroy();
                }
                for (var i = 0, max = e.data.total; i < e.data.total; i++) {
                    if (e.data.rank_world[i] == undefined) {
                        return;
                    }
                    var rank = cc.instantiate(this.rankPrefab);
                    var sprite = rank.getChildByName("icon_head").getComponent(cc.Sprite);
                    let url = e.data.rank_world[i].avatarUrl;
                    this.createImage(sprite, url);
                    if (i > 2) {
                        rank.getChildByName("icon_ranking").getChildByName('font_rank').active = true;
                        rank.getChildByName("icon_ranking").getChildByName('font_rank').getComponent(cc.Label).string = i + 1;
                    }
                    // // 前三标志
                    if (i <= 2) {
                        rank.getChildByName("icon_ranking").getComponent(cc.Sprite).spriteFrame = this.top[i];
                    }
                    rank.getChildByName("font_wxName").getComponent(cc.Label).string = e.data.rank_world[i].nickName;
                    rank.getChildByName("font_score").getComponent(cc.Label).string = e.data.rank_world[i].score;
                    this.worldrank.addChild(rank);
                    this.itemsArr.push(rank);
                }
            } else {
                console.log('fail');
            }
        }));
    },
    openFriend: function () {
        this.rankType = 'friend';
        this.friend.active = true
        this.world.active = false;
        // 打开好友排行
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.postMessage({
                messageType: 'openRank',
                maxScore: USERINFO.highestScore,
            })
        }
    },
    lastRank: function () {
        if (this.rankType == 'world') {
            // 世界上一页
            this.page = this.page - 1 <= 0 ? 1 : this.page - 1;
            this.openWorld();
        } else {
            // 好友上一页
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                wx.postMessage({
                    messageType: 'lastRank',
                    maxScore: USERINFO.highestScore,
                })
            }
        }
    },
    nextRank: function () {
        if (this.rankType == 'world') {
            // 世界下一页
            this.page = this.page + 1 >= 15 ? 15 : this.page + 1;
            this.openWorld();
        } else {
            // 好友下一页
            if (cc.sys.platform === cc.sys.WECHAT_GAME) {
                wx.postMessage({
                    messageType: 'nextRank',
                    maxScore: USERINFO.highestScore,
                })
            }
        }

    }
});
