cc.Class({
    extends: cc.Component,

    properties: {
        newPlay_game: {
            default: null,
            type: require('newPlay_game'),
            displayName: '新手游戏页',
            tooltip: '新手游戏页'
        },
    },
    onLoad() {

    },
    onTapStart: function () {
        this.newPlay_game.show();
    }
});
