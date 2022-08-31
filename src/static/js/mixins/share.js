module.exports={
	data(){
		return {
			share:{
				title:'',
				path:'',
				imageUrl:''
			},
			needSharePages:['pages/customHome/index','pages/home/index','pages/guide/index',
			'packageOrder/scenic/customScenicList','packageOrder/scenic/scenicDetail',
			'packageOrder/hotel/hotelSearch','packageOrder/hotel/customHotelList','packageOrder/hotel/hotelList','packageOrder/hotel/hotelDetail',
			'packageOrder/special/customGoodsList','packageOrder/special/specialList','packageOrder/special/specialDetail',
			'packageOrder/foods/customRestaurantList','packageOrder/foods/foodsList','packageOrder/foods/foodsDetail',
			'packageOrder/venue/customPlaceList','packageOrder/venue/list','packageOrder/venue/detail',
			'packageOrder/training/customSchoolList','packageOrder/training/list','packageOrder/training/detail']
		}
	},
	onLoad(){
		//获取路由信息
		const pages=getCurrentPages()
		//获取当前路由
		let nowPage = pages[pages.length - 1]
		if(!this.needSharePages.includes(nowPage.__route__)){
			//#ifdef MP-WEIXIN
			wx.hideShareMenu({
			  menus: ['shareAppMessage', 'shareTimeline']
			})
			//#endif
		}
	},
	//分享给好友
	onShareAppMessage(){
		//获取路由信息
		const pages=getCurrentPages()
		//获取当前路由
		let nowPage = pages[pages.length - 1]
		this.share.path=decodeURIComponent(nowPage.$page.fullPath)
		return this.share
	},
	// #ifdef MP-WEIXIN
	onShareTimeline(){
		//获取路由信息
		const pages=getCurrentPages()
		//获取当前路由
		let nowPage = pages[pages.length - 1]
		this.share.path=decodeURIComponent(nowPage.$page.fullPath)
		return this.share
	}
	// #endif
}