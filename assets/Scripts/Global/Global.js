window.Lodash = require("lodash");
window.Md5 = require('md5');
window.HL = {
	ajax: {
		// 域名
		DOMAIN: 'http://114.55.25.63:3000/mock/135',
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
				// signString += signString ? '&' : '';
				signString += i + newParam[i];
			}
			signString += this.appSalt;//添加混淆字符串
			// 通过 npm install js-md5 并require('md5')
			return Md5(signString);
		},
		/**
		 *例：
		HL.ajax.post(HL.ajax.getEnergy, { uid: 1, be_invitation_uid: 2, share_day: '2019-01-01' }, ((e) => {
			// 请求成功
			if (e.code == 1 && e.msg == "访问成功") {
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
			param.timestamp = Math.floor((new Date()).getTime() / 1000);
			param.secret = this.createSign(param);
			ajax.open(method, api);
			ajax.send(this.obj2str(param));
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4 && (ajax.status >= 200 && ajax.status < 400)) {
					if (complete) {
						complete(JSON.parse(ajax.responseText));
					}
				} else {
					console.log('ajax fail')
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
	coin: 100,//拥有金币数
	diamond: 100,//拥有钻石数
	durian: 1,//榴莲蛋剩余次数
	highestScore: 0,//最高分
	bulletsInUse: 1,//正在使用的子弹编号
	armCritLevel: 1,// 武器暴击等级
	armpoweLevel: 1,// 武器威力等级
	bulletShop: null,// 子弹库解锁情况：0未解锁、1已解锁未购买、2已购买
	Invincible: false,//无敌状态
	// initScene:wx.getLaunchOptionsSync()||'',
	luckyNum: 0,
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
		this.Data_game = data.Data_game;
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
// window.WXRANK = {
// 	Consts: {
// 		OpenDataKeys: {
// 			InitKey: "initKey",
// 			Grade: "testkey",
// 			LevelKey: "reachlevel",
// 			ScoreKey: "levelScore", // json.string
// 		},
// 		DomainAction: {
// 			FetchFriend: "FetchFriend",
// 			FetchGroup: "FetchGroup",
// 			FetchFriendLevel: "FetchFriendLevel", //好友关卡进度排行
// 			FetchFriendScore: "FetchFriendScore", //好友关卡得分排行
// 			HorConmpar: "HorConmpar", //横向比较 horizontal comparison
// 			Paging: "Paging",
// 			Scrolling: "Scrolling"
// 		},
// 	},

// 	// 这个换成自己的逻辑
// 	utils: {
// 		curLevel: 1,
// 		getScore: _ => {
// 			return 1
// 		}
// 	},

// 	instance= this,//实例
// 	rankRender: null,
// 	rankListNode: null,
// 	horRankNode: null,
// 	rankBgNode: null,
// 	labelTitle: null,
// 	touchLayer: null,
// 	enableScroll: true,
// 	_timeCounter: 0,
// 	rendInterval: 0.5,//刷新排行画布间隔s
// 	rankTexture: null,
// 	rankSpriteFrame: null,
// 	closeBackRank: 0,// 关闭后操作
// 	onLoad() {
// 		this._timeCounter = 0
// 		this.rankTexture = new cc.Texture2D();
// 		this.rankSpriteFrame = new cc.SpriteFrame();
// 		this.resizeSharedCanvas(this.rankRender.node.width, this.rankRender.node.height)
// 	},
// 	resizeSharedCanvas: function (width, height) {
// 		if (!window["wx"]) return;
// 		let sharedCanvas = window["wx"].getOpenDataContext().canvas
// 		sharedCanvas.width = width;
// 		sharedCanvas.height = height;
// 		console.log(sharedCanvas)
// 	},
// 	changeRender: function (renderNode) {
// 		if (renderNode.name === "sprHorRank") {
// 			this.horRankNode.active = true;
// 			this.rankListNode.active = false;
// 			this.rankBgNode.active = false
// 		} else if (renderNode.name === "sprRankList") {
// 			this.horRankNode.active = false;
// 			this.rankListNode.active = true;
// 			this.rankBgNode.active = true
// 		}
// 		this.rankRender.node.width = renderNode.width
// 		this.rankRender.node.height = renderNode.height
// 		this.rankRender.node.position = renderNode.position
// 		this.resizeSharedCanvas(renderNode.width, renderNode.height)
// 	},
// 	updateRankList: function () {
// 		if (!window["wx"]) return;
// 		if (!this.rankTexture) return;
// 		let sharedCanvas = window["wx"].getOpenDataContext().canvas
// 		this.rankTexture.initWithElement(sharedCanvas);
// 		this.rankTexture.handleLoadedTexture();
// 		this.rankSpriteFrame.setTexture(this.rankTexture);
// 		this.rankRender.spriteFrame = this.rankSpriteFrame;
// 	},
// 	onEnable() {
// 		this.touchLayer.active = true
// 		if (this.enableScroll) {
// 			this.rankRender.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
// 		}
// 		// this.postMessage(Consts.DomainAction.FetchFriendLevel)
// 	},
// 	onDisable() {
// 		if (this.enableScroll) {
// 			this.rankRender.node.off(cc.Node.EventType.TOUCH_MOVE)
// 		}
// 	},
// 	onViewDetailRank: function () {
// 		this.closeBackRank = 1;
// 		this.loadLevelScoreRank(utils.curLevel)
// 	},
// 	onPageUp: function () {
// 		cc.log(this)
// 		this.postMessage("Paging", -1)
// 	},
// 	onPageDown: function () {
// 		this.postMessage("Paging", 1)
// 	},
// 	onClose: function () {
// 		if (this.closeBackRank === 1) {
// 			this.closeBackRank = 0;
// 			this.loadHorRank(utils.curLevel)
// 			return
// 		}
// 		this.node.active = false;
// 	},
// 	onTouchMove: function (event) {
// 		const deltaY = event.getDeltaY();
// 		// console.log("rank touchmove:", deltaY);
// 		this.postMessage("Scrolling", deltaY)
// 	},
// 	//获取关卡得分排行
// 	loadLevelScoreRank: function (level) {
// 		this.labelTitle.string = `第${level}关排行`
// 		this.node.active = true;
// 		this.touchLayer.active = true
// 		this.onEnable()
// 		this.changeRender(this.rankListNode)
// 		this.postMessage(this.Consts.DomainAction.FetchFriendScore, level)
// 	},
// 	//获取关卡进度排行
// 	loadLevelOpenRank: function () {
// 		this.labelTitle.string = "关卡排行"
// 		this.node.active = true;
// 		this.touchLayer.active = true
// 		this.onEnable()
// 		this.changeRender(this.rankListNode)
// 		this.postMessage(Consts.DomainAction.FetchFriendLevel)
// 	},
// 	//横向比较
// 	loadHorRank: function (level = 1) {
// 		this.node.active = true;
// 		this.touchLayer.active = false
// 		this.onDisable()
// 		this.changeRender(this.horRankNode)
// 		this.postMessage(Consts.DomainAction.HorConmpar, level, utils.getScore(level))
// 	},
// 	//向子域发送消息
// 	postMessage: function (action, data = null, dataEx = null) {
// 		if (!window["wx"]) return;
// 		let openDataContext = window["wx"].getOpenDataContext()
// 		openDataContext.postMessage({
// 			action: action,
// 			data: data,
// 			dataEx: dataEx,
// 		})
// 	},
// 	//wx api
// 	// 检查得分
// 	checkScore: function (key, callback) {
// 		if (!window["wx"]) return;
// 		wx.getUserCloudStorage({
// 			keyList: [key],
// 			success: res => {
// 				console.log("checkScore success:res=>", res)
// 			}
// 		})
// 	},
// 	// 上传关卡分数
// 	uploadScore: function (level, score) {
// 		if (!window["wx"]) return;
// 		score = score.toString()
// 		window["wx"].setUserCloudStorage({
// 			KVDataList: [{
// 				key: Consts.OpenDataKeys.ScoreKey + level,
// 				value: score
// 			},],
// 			success: (res) => {
// 				console.log("uploadScore success:res=>", res)
// 			},
// 			fail: (res) => {
// 				console.log("uploadScore fail:res=>", res)
// 			}
// 		})
// 	},
// 	//删除微信数据
// 	removeUserKey: function (key_or_keys) {
// 		if (!window.window["wx"]) return
// 		if (typeof (key_or_keys) === "string") {
// 			key_or_keys = [key_or_keys]
// 		}
// 		window["wx"].removeUserCloudStorage({
// 			keyList: key_or_keys,
// 			success: (res) => {
// 				console.log("uploadScore success:res=>", res)
// 			},
// 			fail: (res) => {
// 				console.log("uploadScore fail:res=>", res)
// 			}
// 		})
// 	},
// 	initRank: function () { },
// 	snapshotSync: function () {
// 		if (!window['wx']) return
// 		var canvas = cc.game.canvas;
// 		var width = cc.winSize.width;
// 		var height = cc.winSize.height;
// 		return canvas['toTempFilePathSync']({
// 			x: 0,
// 			y: 0,
// 			width: width * 1.5,
// 			height: height,
// 			destWidth: width * 1.5,
// 			destHeight: height
// 		})
// 	},

// }