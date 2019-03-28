window.Lodash = require("lodash");
window.Md5 = require('md5');
window.HL = {
	ajax: {
		// 域名
		DOMAIN: 'https://newbox.0e3.cn/gfruits',
		// token
		TOKEN: '',
		//混淆字符串
		appSalt: '!@#$%^&*',
		//请求方式
		METHOD_POST: 'POST',
		METHOD_GET: 'GET',
		login: '/user/logins',//用户登录
		updataHead: '/user/updateUser',//更新用户昵称头像
		sendScore: '/user/getScore',//提交分数
		ranking: '/user/rank_world',//世界排行榜
		getGameData: '/user/getGameData',//获取游戏数据
		setGameData: '/user/setGameData',//设置游戏数据
		getConfig: '/other/getConfig',//获得配置
		getGameList: '/other/getGameList',//游戏列表
		gameClick: '/other/gameClick',//游戏列表点击统计
		getEnergy: '/other/getEnergy',//可否领取钻石
		getEnergyDo: '/other/getEnergyDo',//领一份奖励
		/**
		 * 对obj的 属性名进行sort排序 
		 * 并返回属性名sort排序后的对象
		 * @param object param 需要进行排序的对象
		 * @return object newparam 排序完成的新对象
		 */
		objSort: function (param) {
			var newkeyArray = Object.keys(param).sort();
			var newParam = {};//创建一个新的对象，用于存放排好序的键值对(Object)
			//遍历newkeyArray数组   
			for (var i = 0; i < newkeyArray.length; i++) {
				newParam[newkeyArray[i]] = param[newkeyArray[i]];//向新创建的对象中按照排好的顺序依次增加键值对
			}
			return newParam;//返回排好序的新对象
		},
		/**
		 * 将请求参数转化字符串
		 */
		obj2str: function (param) {
			let str = '';
			for (let k in param) {
				str += '&' + k + '=' + param[k]
			}
			return str.substring(1)
		},
		//生成token
		createSign: function (param) {
			for (let i in ['sign', 'id', 'action', 'api', 'version'])
				if (typeof (param[i]) != "undefined")
					delete param[i];
			// console.log(param)
			//对param进行sort排序
			var newParam = this.objSort(param);
			var signString = '';
			for (var i in newParam) {
				signString += signString ? '&' : '';
				signString += i + '=' + newParam[i];
			}
			signString += this.appSalt;//添加混淆字符串
			// 通过 npm install js-md5 并require('md5')
			return Md5(signString);
		},
		/**
		 *例：
		HL.ajax.post(HL.ajax.getEnergy, { uid: 1 }, ((e) => {
			// 请求成功
			if (e.code == 1) {
				console.log(e.data);
			} else {
				console.log('fail');
			}
		}));
		 */
		//发起请求
		request: function (api, method, param, complete, error, progress) {
			// console.log('************************************');
			// console.log('发起请求', api, param);
			var ajax = new XMLHttpRequest();
			param.token = this.createSign(param);
			ajax.open(method, api);
			ajax.send(this.obj2str(param));
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status >= 200 && ajax.status < 400)) {
					if (complete) {
						complete(JSON.parse(ajax.responseText));
					}
				}
			};
		},
		//发起POST请求
		post: function (api, param, complete, error, progress) {
			this.request(
				this.DOMAIN + api,
				this.METHOD_POST,
				param,
				complete,
				error,
				progress
			)
		},
		//发起GET请求
		get: function (api, param, complete, error, progress) {
			this.request(
				this.DOMAIN + api,
				this.METHOD_GET,
				param,
				complete,
				error,
				progress
			)
		},
	},
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
	armLevel: 0,//武器威力和暴击的平均等级、决定签到奖励的等级
	weekDate: new Date().getDate(),//签到等级刷新日期
	coin: 100,//拥有金币数
	diamond: 100,//拥有钻石数
	durian: 0,//榴莲蛋剩余次数
	highestScore: 0,//最高分
	bulletsInUse: 0,//正在使用的子弹编号
	armCritLevel: 0,// 武器暴击等级
	armpoweLevel: 0,// 武器威力等级
	bulletShop: {},// 子弹库解锁情况：0未解锁、1已解锁未购买、2已购买
	Invincible: false,//无敌状态
	luckyNum: 0,//已经抽奖次数
	signInState: 0,//签到状态 0未签到、1已签到1次、2已签到2次
	today: new Date().getDate(),//签到刷新日期
	isGotDiamonds: 0,//领取钻石对话框是否领取过钻石 0未领取、1已领取
	GotDiamondDay: new Date().getDate(),// 领取钻石对话框领取钻石刷新日期
	exchange_getDiamond: 2,//兑换钻石对话框领取钻石剩余次数
	exchange_DiamondDay: new Date().getDate(),//兑换钻石对话框领取钻石刷新日期
	initScene: null,// 初始场景值，用于区分从哪进入游戏
	// 同步数据到本地
	init: function (data) {
		var that = this;
		if (data != '') {
			data = JSON.parse(data);
			for (var i = 0, max = data.bulletShop.length; i < max; i++) {
				that.bulletShop[i].state = data.bulletShop[i];
			}
		}
		that.level = data.level || that.level;
		that.armLevel = data.armLevel || that.armLevel;//武器威力和暴击的平均等级、决定签到奖励的等级
		that.weekDate = data.weekDate || that.weekDate;//签到等级刷新日期
		that.coin = data.coin || that.coin;
		that.diamond = data.diamond || that.diamond;
		that.durian = data.durian || that.durian;
		that.highestScore = data.highestScore || that.highestScore;
		that.bulletsInUse = data.bulletsInUse || that.bulletsInUse;
		that.armCritLevel = data.armCritLevel || that.armCritLevel;
		that.armpoweLevel = data.armpoweLevel || that.armpoweLevel;
		that.luckyNum = data.luckyNum || that.luckyNum;
		that.signInState = data.signInState || that.signInState;
		that.isGotDiamonds = data.isGotDiamonds || that.isGotDiamonds;//领取钻石对话框是否领取过钻石 0未领取、1已领取
		that.GotDiamondDay = data.GotDiamondDay || that.GotDiamondDay;//领取钻石对话框领取钻石刷新日期
		that.exchange_getDiamond = data.exchange_getDiamond //兑换钻石对话框领取钻石剩余次数
		that.exchange_DiamondDay = data.exchange_DiamondDay //兑换钻石对话框领取钻石刷新日期
	},
	save: function () {
		var bulletShop = [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (var i = 0, max = USERINFO.bulletShop.length; i < max; i++) {
			bulletShop[i] = USERINFO.bulletShop[i].state;
		}
		var data = {
			level: USERINFO.level,//关卡
			armLevel: USERINFO.armLevel,//武器威力和暴击的平均等级、决定签到奖励的等级
			weekDate: USERINFO.weekDate,//签到等级刷新日期
			coin: USERINFO.coin,//拥有金币数
			diamond: USERINFO.diamond,//拥有钻石数
			durian: USERINFO.durian,//榴莲蛋剩余次数
			highestScore: USERINFO.highestScore,//最高分
			bulletsInUse: USERINFO.bulletsInUse,//正在使用的子弹编号
			armCritLevel: USERINFO.armCritLevel,// 武器暴击等级
			armpoweLevel: USERINFO.armpoweLevel,// 武器威力等级
			bulletShop: bulletShop,// 子弹库解锁情况：0未解锁、1已解锁未购买、2已购买
			luckyNum: USERINFO.luckyNum,//已经抽奖次数
			signInState: USERINFO.signInState,//签到状态
			today: USERINFO.today,//签到刷新日期
			isGotDiamonds: USERINFO.isGotDiamonds,//领取钻石对话框是否领取过钻石 0未领取、1已领取
			GotDiamondDay: USERINFO.GotDiamondDay,//领取钻石对话框领取钻石刷新日期
			exchange_getDiamond: USERINFO.exchange_getDiamond,//兑换钻石对话框领取钻石剩余次数
			exchange_DiamondDay: USERINFO.exchange_DiamondDay,//兑换钻石对话框领取钻石刷新日期
		}
		var info = JSON.stringify(data);
		HL.ajax.post(HL.ajax.setGameData, { uid: USERINFO.uid, info: info }, ((e) => {
			// 请求成功
			if (e.code == 1) {
				// console.log('save_GameData_Success', e.data);
			} else {
				console.log('fail');
			}
		}));
	},
	getInitScene: function () {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			return wx.getLaunchOptionsSync();
		} else {
			return null;
		}
	}
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
	// 初始化推荐游戏列表
	initGameList: function (callFun) {
		var that = this;
		HL.ajax.post(HL.ajax.getGameList, {}, ((e) => {
			// 请求成功
			if (e.code == 1) {
				that.GameList = e.data[1].games;
				if (callFun) {
					callFun();
				}
			} else {
				console.log('fail');
			}
		}));
	},
	//初始化设备
	initDeviceMaster: function (stageWidth, stageHeight) {
		//获取系统信息
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			this.stageWidth = stageWidth;
			this.stageHeight = stageHeight;
			this.SYSTEM_INFO = wx.getSystemInfoSync();
			this.model = this.SYSTEM_INFO.model;
			this.screenWidth = this.SYSTEM_INFO.screenWidth;
			this.screenHeight = this.SYSTEM_INFO.screenHeight;
			this.scaleWidth = this.screenWidth / this.stageWidth;
			this.scaleHeight = this.screenHeight / this.stageHeight;
			this.windowWidth = this.SYSTEM_INFO.windowWidth * 2;
			this.windowHeight = this.SYSTEM_INFO.windowHeight * 2;
		}
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
	shareTitle: ['你的好友送你一箱宝石，快来拿走属于你的', '这么圆的大橘子，你见过吗？', '欢乐又刺激的射击水果，果汁四溅！'],
	//分享图片
	shareImage: ['resources/share/share.png', 'resources/share/share.png'],
	//初始化
	initAD: function () {
		if (cc.sys.platform === cc.sys.WECHAT_GAME) {
			this.INIT_STATUS = 1;
			this.list();
		}
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
		HL.ajax.post(HL.ajax.getConfig, {}, ((res) => {
			// 请求成功
			// console.log('获取流量主列表success', res);
			if (res.code == 1) {
				that.createBanner(res.data);
				that.createVideo(res.data);
				that.INIT_STATUS = 2
			} else {
				console.log('获取流量主列表fail');
				that.INIT_STATUS = 3
			}
		}));
	},
	// 创建banner广告
	createBanner: function (data) {
		var that = this;
		// that.initDeviceMaster();
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
				wx.showToast({
					title: '没有视频可播放！',
					icon: 'none',
					duration: 2000,
					mask: true
				})
				this.cacheVideoAd = false;
			})
		} else {
			this.cacheVideoAd = false;
			console.log('No video Id');
		}
	},
	//开启视频广告
	openVideoAd: function (success, fail, Novideo) {
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
						if (success) {
							success();
						}
					}
				} else {
					// 播放中途退出，不下发游戏奖励
					if (fail) {
						fail();
					}
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
		var that = this;
		var randomNum = (index != null) ? index : that.random(1, 3) - 1;
		// 本地分享图
		// var imageUrl = this.getURL(this.shareImage[randomNum]);
		// 远程分享图
		that.shareImage = ["https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share1.png", "https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share2.png", "https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share3.png"];
		var shareTitle = that.shareTitle[randomNum];
		var imageUrl = that.shareImage[randomNum];
		wx.shareAppMessage({
			title: shareTitle,
			imageUrl: imageUrl,
			query: querys
		});
		let share = true;
		let t = new Date().getTime();
		wx.onShow(() => {
			if (share) {
				if (new Date().getTime() - t > 3000) {
					if (that.random(1, 100) < 70) {
						if (success) {
							success();
						}
					} else {
						that.onceMoreShare(index, success, fail, querys);
					}
				} else {
					that.onceMoreShare(index, success, fail, querys);
				}
			}
			share = false;
		})
	},
	sharer: function (index, success, fail, querys) {
		var that = this;
		var randomNum = (index != null) ? index : that.random(1, 3) - 1;
		that.shareImage = [
			"https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share1.png",
			"https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share2.png",
			"https://page8.h5.0e3.cn/H5Game/page8/1903/0301/share/share3.png"
		];
		var shareTitle = that.shareTitle[randomNum];
		var imageUrl = that.shareImage[randomNum];
		wx.shareAppMessage({
			title: shareTitle,
			imageUrl: imageUrl,
			query: querys
		});
		let share = true;
		let t = new Date().getTime();
		wx.onShow(() => {
			if (share) {
				if (success) {
					success();
				}
			}
			share = false;
		})
	},
	onceMoreShare: function (index, success, fail, querys) {
		var that = this;
		wx.showModal({
			title: '温馨提示',
			content: '分享到不同的群才能获得奖励哦~',
			confirmText: '再试一次',
			success(res) {
				if (res.confirm) {
					that.share(index, success, fail, querys);
				} else if (res.cancel) {
					if (fail) {
						fail();
					}
				}
			}
		});
	},
	// 12、授权按钮
	UserInfoButton: function (left, top, width, height) {
		// this.initDeviceMaster();
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
			// console.log('UserInfoButton:', res);
			button.destroy();
			HL.ajax.post(HL.ajax.updataHead, { uid: USERINFO.uid, nickName: res.userInfo.nickName, avatarUrl: res.userInfo.avatarUrl, gender: res.userInfo.gender }, ((e) => {
				// 请求成功
				if (e.code != 1) {
					console.log('fail');
				}
			}));
		});
	}
};