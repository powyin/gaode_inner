import {
	orderApi
} from '@/common/js/api/baseApi/order.js';
import {
	mapMutations
} from 'vuex';
import QR from '@/utils/wxqrcode.js'
const orderDetailCrud = {
	methods: {
		...mapMutations(['setNeedRefresh']),
		// 删除订单
		deleteOrder(orderId) {
			uni.showModal({
				title: '提示',
				content: '确认是否删除该订单',
				success: res => {
					if (res.confirm) {
						this.$http.delete(orderApi.delOrder + '/' + orderId).then(res => {
							if (res.code == 200) {
								uni.showToast({
									title: res.msg,
									icon: 'success'
								})
								this.setNeedRefresh(true);
								uni.navigateBack();
							}
						});
					}
				}
			});
		},
		// 取消订单
		cancelOrder(orderId) {
			uni.showModal({
				title: '提示',
				content: '确认是否取消该订单',
				success: res => {
					if (res.confirm) {
						this.$http.post(orderApi.cancelOrder + '/' + orderId + '?cancelReason=用户取消该订单')
							.then(res => {
								if (res.code == 200) {
									uni.navigateBack()
									this.setNeedRefresh(true)
								}
							})
					}
				}
			});
		},
		//复制
		copyBtn(data) {
			wx.setClipboardData({
				data,
				success: function(res) {
					wx.getClipboardData({
						success: function(res) {
							wx.showToast({
								title: '已复制到剪贴板'
							});
						}
					});
				}
			});
		},
		// 打电话
		makeCallUp(data) {
			uni.makePhoneCall({
				phoneNumber: data,
				success: res => {
					console.log(res)
				},
				fail: err => {
					console.log(err)
				}
			});
		},
		// 入园地址导航
		checkAddress(datas) {
			const latitude = datas.latitude;
			const longitude = datas.longitude;
			const addr = datas.address
			uni.openLocation({
				latitude: latitude,
				longitude: longitude,
				name: addr,
				success: function(res) {
					console.log('success');
				}
			});
		},
		// 打开弹窗
		openPopup(data) {
			this.$refs[data + 'Popup'].open();
		},
		// 关闭弹框
		closePopup(data) {
			this.$refs[data + 'Popup'].close();
		},
		// 申请退票
		goRefund(data, idx) {
			// 特产单个商品退款
			if(idx) {
				uni.setStorageSync('refundIndex', idx)
			} else {
				uni.removeStorageSync('refundIndex')
			}
			uni.navigateTo({
				url: '/pages/order/orderRefund?id=' + data
			});
			if(this.showRefund){
				this.showRefund = false
			}
		},
		getCodeImg(data, str) {
			if (str == null) {
				return QR.createQrCodeImg(data, {
					typeNumber: 3,
					errorCorrectLevel: 'L',
					size: parseInt(200)
				})
			} else {
				return QR.createQrCodeImg(data + str, {
					typeNumber: 3,
					errorCorrectLevel: 'L',
					size: parseInt(200)
				})
			}
		},
	}
}
export default orderDetailCrud
