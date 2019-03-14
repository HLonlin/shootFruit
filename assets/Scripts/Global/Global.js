window.Lodash = require("lodash");
window.HL = {
	nodePool: {
		// 批处理对象池
		batchInitNodePool: function (that, objArray) {
			for (let i = 0; i < objArray.length; i++) {
				let objInfo = objArray[i];
				this.initNodePool(that, objInfo);
			}
		},
		// 初始化对象池
		initNodePool: function (that, objInfo) {
			let poolName = objInfo.name + '_Pool';
			that[poolName] = new cc.NodePool();
			// 在nodePoolState中备份，方便clear
			HL.nodePoolState.poolObj[poolName] = that[poolName];
			// 创建对象，并放入池中
			for (let i = 0; i < objInfo.poolAmount; i++) {
				let newNode = cc.instantiate(objInfo.prefab);
				that[poolName].put(newNode);
			}
		},
		// 生成节点
		genNewNode: function (pool, prefab, nodeParent) {
			let newNode = null;
			if (pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
				newNode = pool.get();
			} else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
				newNode = cc.instantiate(prefab);
			}
			nodeParent.addChild(newNode);
			return newNode;
		},
		// 销毁节点
		putBackPool: function (that, node) {
			let poolName = node.name + "_Pool";
			that[poolName].put(node);
		},
		// 清空缓冲池
		clearAllPool: function () {
			Lodash.forEach(HL.nodePoolState.poolObj, function (pool) {
				pool.clear();
			})
		}
	},
	nodePoolState: {
		poolObj: {}
	},
};
window.USERINFO = {
	// 用户信息
	level: 1,//关卡
	coin: 100,//拥有金币数
	diamond: 100,//拥有钻石数
	durian: 1,//榴莲蛋剩余次数
	highestScore: 0,//最高分
	bulletsInUse: 1,//正在使用的子弹编号
	armCritLevel: 1,// 武器暴击等级
	armpoweLevel: 1,// 武器威力等级
	bulletShop: null,// 子弹库解锁情况：0未解锁、1已解锁未购买、2已购买
	// initScene:wx.getLaunchOptionsSync()||'',
	initScene: '1001',// 初始场景值，用于区分从哪进入游戏
	// 同步数据到本地
	init: function (data) {
		var that = this;
		that.coin = data.coin;
		that.diamond = data.diamond;
		that.durian = data.durian;
		that.highestScore = data.highestScore;
		that.bulletsInUse = data.bulletsInUse;
		that.armCritLevel = data.armCritLevel;
		that.armpoweLevel = data.armpoweLevel;
		that.bulletShop = data.bulletShop;
		that.initScene = data.initScene;
	},
};
window.WECHAT = {
	SYSTEM_INFO: null,
	//设备宽度
	screenWidth: 750,
	//设备高度
	screenHeight: 1334,
	//设备可用宽度
	windowWidth: 750,
	//设备可用高度
	windowHeight: 1334,
	//场景宽度
	stageWidth: 750,
	//场景高度
	stageHeight: 1334,
	//设备与场景 宽度比率 screenWidth/stageWidth
	scaleWidth: 1,
	//设备与场景 高度比率 screenHeight/stageHeight
	scaleHeight: 1,
	model: '',
	//初始化
	initDeviceMaster: function (stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;
		//获取系统信息
		this.SYSTEM_INFO = wx.getSystemInfoSync();
		this.model = this.SYSTEM_INFO.model;
		this.screenWidth = this.SYSTEM_INFO.screenWidth;
		this.screenHeight = this.SYSTEM_INFO.screenHeight;
		this.scaleWidth = this.screenWidth / this.stageWidth;
		this.scaleHeight = this.screenHeight / this.stageHeight;
		this.windowWidth = this.SYSTEM_INFO.windowWidth * 2;
		this.windowHeight = this.SYSTEM_INFO.windowHeight * 2;
	},
	//获取设备对应比例的宽度值
	getX: function (num) {
		return num * this.scaleWidth
	},
	//获取设备对应比例的高度值
	getY: function (num) {
		return num * this.scaleHeight
	},
	//Banner广告组
	bannerArr: [],
	//是否有Banner广告ID
	hasBannerID: false,
	//当前缓存的Banner广告
	cacheBannerAd: null,
	//视频广告列表
	videoArr: [],
	//是否有视频广告
	hasVideo: false,
	//当前缓存的视频广告
	cacheVideoAd: null,
	//是否初始化成功 0未初始，1开始初始化，2初始化成功，3初始化失败
	INIT_STATUS: 0,
	//分享标题
	shareTitle: ['小学生也能轻松答对，但很多成年人却不行，你试试？', '这题有点难，你能答出来吗？'],
	//分享图片
	shareImage: ['resources/share/share.png', 'resources/share/share.png'],
	//初始化
	initAD: function () {
		this.INIT_STATUS = 1;
		this.list();
	},
	getURLs: function (url) {
		url = cc.url.raw(url);
		if (cc.loader.md5Pipe) {
			url = cc.loader.md5Pipe.transformURL(url);
		}
		try {
			let fs = wx.getFileSystemManager();
			let localPath = wx.env.USER_DATA_PATH + '/';
			url = localPath + url;
			fs.accessSync(url);
		} catch (error) {
			url = window.wxDownloader.REMOTE_SERVER_ROOT + "/" + url;
		}
		return url;
	},
	//获取流量主列表
	list: function () {
		var that = this;
		wx.request({
			url: 'https://high.app81.com/highjump/back/getid', // 仅为示例，并非真实的接口地址
			data: {},
			header: {
				'content-type': 'application/json' // 默认值
			},
			method: 'POST',
			success(res) {
				var res = res.data;
				if (parseInt(res.code) === 200 && Number(res.errorcode) === 0 && res.data) {
					that.createBanner(res.data);
					that.createVideo(res.data);
					that.INIT_STATUS = 2
				}
			},
			fail(err) {
				console.log('fail');
				that.INIT_STATUS = 3
			}
		});
	},
	// 创建banner广告
	createBanner: function (data) {
		var that = this;
		that.initDeviceMaster();
		// banner广告
		that.bannerArr = data.banner_id;
		if (that.bannerArr != undefined && that.bannerArr != null && that.bannerArr.length > 0) {
			that.hasBannerID = true;
			// [随机]缓存创建banner广告
			that.cacheBannerAd = wx.createBannerAd({
				adUnitId: that.bannerArr[Math.floor(Math.random() * that.bannerArr.length)],
				style: {
					width: that.screenWidth,
					top: that.screenHeight
				}
			});
			// 当重定义banner尺寸时调整top位置
			that.cacheBannerAd.onResize((res) => {
				that.cacheBannerAd.style.top = that.screenHeight - that.cacheBannerAd.style.realHeight;
			})
			// 显示广告
			// that.cacheBannerAd.show();
			// 监听创建广告失误(必须)
			that.cacheBannerAd.onError(err => {
				console.log(err)
			})
		} else {
			this.cacheBannerAd = false;
			console.log('No banner Id');
		}
	},
	//隐藏广告
	closeBannerAd: function () {
		if (this.cacheBannerAd) {
			this.cacheBannerAd.hide()
		}
	},
	//显示广告
	showBannerAd: function () {
		if (this.cacheBannerAd) {
			this.cacheBannerAd.show()
		}
	},
	// 创建视频广告
	createVideo: function (data) {
		// 视频广告
		this.videoArr = data.video_id
		if (this.videoArr != undefined && this.videoArr != null && this.videoArr.length > 0) {
			this.hasVideo = true
			//[随机]缓存创建视频广告
			this.cacheVideoAd = wx.createRewardedVideoAd({
				adUnitId: this.videoArr[Math.floor(Math.random() * this.videoArr.length)]
			});
			// 监听创建视频广告失败
			this.cacheVideoAd.onError(() => {
				this.cacheVideoAd = false;
				console.log('Create video Fail');
			})
		} else {
			this.cacheVideoAd = false;
			console.log('No video Id');
		}
	},
	//开启视频广告
	openVideoAd: function (successCall, failCall, Novideo) {
		if (this.cacheVideoAd) {
			var isvideo = true;
			// 尝试播放视频
			this.cacheVideoAd.show()
				.catch(err => {
					this.cacheVideoAd.load()
						.then(() => this.cacheVideoAd.show())
				})
			// 监听用户点击关闭广告
			this.cacheVideoAd.onClose((res) => {
				// 用户点击了【关闭广告】按钮，小于 2.1.0 的基础库版本，res 是一个 undefined
				if (res && res.isEnded || res === undefined) {
					if (isvideo) {
						// 正常播放结束，可以下发游戏奖励
						successCall();
					}
				} else {
					// 播放中途退出，不下发游戏奖励
					failCall();
				}
				isvideo = false;
			});
		} else {
			// 没有视频
			Novideo();
		}
	},
	//	获取本地分享图路径
	getURL: function (url) {
		url = cc.url.raw(url);
		if (cc.loader.md5Pipe) {
			url = cc.loader.md5Pipe.transformURL(url);
		}
		try {
			wx.getFileSystemManager().accessSync(url);
		} catch (error) {
			url = window.wxDownloader.REMOTE_SERVER_ROOT + '/' + url;
		}
		return url;
	},
	// 随机数
	random: function (min, max) {
		return Math.floor(min + Math.random() * (max - min));
	},
	// 分享卡
	share: function (index, success, fail, querys) {
		var randomNum = (index != null) ? index : this.random(1, 3) - 1;
		var imageUrl = this.getURL(this.shareImage[randomNum]);
		wx.shareAppMessage({
			title: this.shareTitle[randomNum],
			imageUrl: imageUrl,
			query: querys
		});
		let share = true;
		let t = new Date().getTime();
		wx.onShow(() => {
			if (share) {
				if (new Date().getTime() - t > 3000) {
					if (this.random(1, 100) < 70) {
						success();
					} else {
						fail();
					}
				} else {
					fail();
				}
			}
			share = false;
		})
	},
	// 12、授权按钮
	UserInfoButton: function (left, top, width, height) {
		this.initDeviceMaster();
		var scale = this.screenWidth / 750;
		const button = wx.createUserInfoButton({
			type: 'image',
			text: '',
			style: {
				left: left * scale,
				top: top * scale,
				width: width * scale,
				height: height * scale
			}
		});
		button.onTap((res) => {
			console.log('UserInfoButton:', res);
		});
	}
};