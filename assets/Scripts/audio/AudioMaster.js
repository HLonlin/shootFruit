cc.Class({
	extends: cc.Component,

	properties: {
		bgm: {
			default: null,
			type: cc.AudioClip,
			displayName: '背景音效',
			tooltip: '背景音效'
		},
		buttonAudio: {
			default: null,
			type: cc.AudioClip,
			displayName: '按钮音效',
			tooltip: '按钮音效'
		},
		winAudio: {
			default: null,
			type: cc.AudioClip,
			displayName: '胜利音效',
			tooltip: '胜利音效'
		},
		loseAudio: {
			default: null,
			type: cc.AudioClip,
			displayName: '失败音效',
			tooltip: '失败音效'
		},
	},
	//播放音乐
	playMusic: function() {
		cc.audioEngine.playMusic(this.bgm, true);
	},
	//暂停播放音乐
	pauseMusic: function() {
		cc.audioEngine.pauseMusic();
	},
	//继续播放音乐
	resumeMusic: function() {
		cc.audioEngine.resumeMusic();
	},
	//播放音效
	_playSFX: function(clip) {
		cc.audioEngine.playEffect(clip, false);
	},

	playWin: function() {
		this._playSFX(this.winAudio);
	},

	playLose: function() {
		this._playSFX(this.loseAudio);
	},

	playCard: function() {
		this._playSFX(this.cardAudio);
	},

	playChips: function() {
		this._playSFX(this.chipsAudio);
	},

	playButton: function() {
		this._playSFX(this.buttonAudio);
	}
});