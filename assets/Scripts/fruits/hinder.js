// 障碍物
cc.Class({
    extends: cc.Component,
    properties: {
        around: {
            default: 1,
            type: cc.Integer,
            displayName: '内外圈',
            tooltip: '障碍物1外圈、2内圈'
        },
        length: {
            default: 1,
            type: cc.Integer,
            displayName: '长短度',
            tooltip: '障碍物1短、2中、3长'
        },
        prosAndCons: {
            default: 1,
            type: cc.Integer,
            displayName: '正反向',
            tooltip: '障碍物1正转、0反转'
        },
        speed: {
            default: 1,
            type: cc.Float,
            displayName: '速度',
            tooltip: '障碍物环绕速度，值越大速度越快,1为正常速度'
        }
    },
    onLoad: function () {
        // 默认播放外圈短正转障碍物动画
        var names = this.around + '' + this.length + '' + this.prosAndCons + '';
        // this.playAnimBynames(names);
    },
    // playAnimBynames: function (name) {
    //     let anim = this.getComponent(cc.Animation);
    //     let animName = this.node.name + name;
    //     var animState = anim.playAdditive(animName);
    //     animState.speed = this.speed;
    // },
});
