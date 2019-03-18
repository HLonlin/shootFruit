//按钮缩放类
cc.Class({
    extends: cc.Component,
    properties: {
        pressedScale: {
            default: 0.85,
            type: cc.Float,
            displayName: '缩放倍数',
            tooltip: '按钮缩放倍数'
        },
        transDuration: {
            default: 0.1,
            type: cc.Float,
            displayName: '缩放用时',
            tooltip: '按钮缩放用时'
        },
    },
    onLoad: function () {
        var self = this;
        var audioMng = cc.find('Index/AudioMaster') || cc.find('Game/AudioMaster') || cc.find('Shop/AudioMaster') || cc.find('Over/AudioMaster') || cc.find('AudioMaster');
        if (audioMng) {
            audioMng = audioMng.getComponent('AudioMaster');
        }
        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);

        function onTouchDown(event) {
            this.stopAllActions();
            if (audioMng) audioMng.playButton();
            this.runAction(self.scaleDownAction);
        }

        function onTouchUp(event) {
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
});