import {
	mapMutations
} from 'vuex';
import {
	scenicApi
} from '@/common/js/api/baseApi/scenic.js';
export default {
	methods: {
		...mapMutations(['setNeedRefresh']),
		// v3支付
		/*
			objData : 订单支付的所需参数;
			appId : appId;
			orderInfo : 订单信息;
			datas : 商品信息;
		*/
		prePayOrder(openId, orderInfo, datas) {
			let that = this
			return new Promise((resolve, reject) => {
				that.$http.post(scenicApi.preOrder, orderInfo).then(res => {
					let obj = {
						orderHistoryId: res.data.id,
						openid: openId,
						payMode: 'MiniProgram',
						payType: 'WxPay'
					};
					datas.price = res.data.realPrice
					resolve({
						obj: obj,
						datas: datas,
						status: true
					})
				}).catch(err => {
					reject({
						status: false
					})
				});
			}).then(resObj => {
				if (resObj.status.toString() == 'false') {
					return false
				} else {
					return this.submitPayment(resObj.obj, resObj.datas, orderInfo)
				}
			})
		},
		submitPayment(objData, datas, orderInfo) {
			let that = this;
			return new Promise((resolve, reject) => {
				that.$http.post(scenicApi.prePay, objData).then(res => {
					if (res.code == 200 && res.data) {
						let payNo = res.data.paymentNo
						datas = JSON.stringify(datas)
						if (res.data.needPay && payNo != null && payNo.length) {
							uni.requestPayment({
								provider: 'wxpay',
								appId: that.$appId,
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.package,
								signType: res.data.signType,
								paySign: res.data.paySign,
								orderInfo: orderInfo,
								success: function(res) {
									uni.hideLoading()
									uni.navigateTo({
										url: "/packageOrder/paySuccess/index?objData=" + datas
									})
								},
								fail: function(err) {
									uni.hideLoading()
									uni.switchTab({
										url: '/pages/order/index'
									})
									that.setNeedRefresh(true);
								}
							});
						}
						if (!res.data.needPay) {
							uni.showToast({
								title: '下单成功!',
								icon: 'success'
							})
							uni.navigateTo({
								url: "/packageOrder/paySuccess/index?objData=" + datas
							})
						}
					}
					resolve(true)
				}).catch(err => {
					reject(false)
				});
			})
		},
	}
}
