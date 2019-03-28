cc.Class({
    extends: cc.Component,
    properties: {
        HP: {
            default: 300,
            type: cc.Integer,
            tooltip: '水果血量',
        },
        font_score: {
            default: null,
            type: cc.Node,
            tooltip: '分数',
            displayName: '分数',
        },
        newPlay_victory: {
            default: null,
            type: require('newPlay_victory'),
            displayName: '新手结束页',
            tooltip: '新手结束页'
        },
    },
    onLoad: function () {
        // 获取碰撞检测系统
        let manager = cc.director.getCollisionManager();
        // 开启碰撞检测系统
        manager.enabled = true;
        this.score = 0;
        this.minPercent = 0.3;
    },
    // 监听挂载此组件的节点碰撞检测
    onCollisionEnter: function (other, self) {
        if (other.node.group !== 'bullet' || this.HP <= 0) {
            return;
        }
        var anim = self.node.getChildByName("fruit_wave").getComponent(cc.Animation);
        anim.play('fruit1');
        var attackPower = other.node.getComponent("bullet").attackPower;
        // 扣除血量
        this.HP -= attackPower;

        // 更新分数
        this.score += attackPower;
        this.font_score.getComponent(cc.Label).string = this.score;
        // 缩小水果
        this.percent = (this.HP - Number(this.font_score.getComponent(cc.Label).string)) / this.HP;
        if (this.percent >= this.minPercent) {
            this.node.setScale(this.percent);
        } else {
            this.node.setScale(this.minPercent);
        }
        // 击中水果振动
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            wx.vibrateLong();
        }
        // 水果血量耗完
        if (this.HP <= 0) {
            this.explodingAnim();
            return;
        }
    },
    explodingAnim: function () {
        // 播放爆炸音效、动画
        var anim = this.node.getComponent(cc.Animation);
        anim.play('fruit1');
        anim.on('finished', this.showpage_victory, this);
    },
    showpage_victory: function () {
        this.newPlay_victory.show();
    },
});