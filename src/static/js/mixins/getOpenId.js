import {
	loginApi
} from "@/common/js/api/baseApi/login.js";
export default {
	methods: {
		async getOpenId() {
			let openId = uni.getStorageSync('openId');
			if (openId) {
				return openId
			} else {
				let login = await new Promise((resolve, reject) => {
					// uni.login非异步，所以用Promise包装  
					uni.login({
						success: res => {
							resolve({
								status: 'success',
								code: res.code
							});
						},
						fail: err => {
							reject({
								status: 'error',
								...err
							});
						}
					});
				})
				if (login.status == 'success') {
					let openIdRes=await new Promise((resolve,reject)=>{
						this.$http.get(loginApi.codeLogin4C + login.code).then((loginData) => {
							if (loginData.code == 200) {
								uni.setStorageSync("token", loginData.data.access_token);
								uni.setStorageSync("openId", loginData.msg);
								resolve({
									status:'success',
									code:loginData.msg
								})
							}
						}).catch(err => {
							reject({
								status:'error',
								...err
							})
						});
					}) 
					if(openIdRes.status=='success'){
						return openIdRes.code
					}
				}
			}
		}
	}
}
