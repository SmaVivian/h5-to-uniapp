const baseUrl = 'http://bjmuseum.org.cn/admin'   
const request = (url = '', methord = 'GET', params = {}, header = {
}) => {
	return new Promise((resolve, reject) => {
		uni.request({
			method: methord,
			url: baseUrl + url,
			data: params,
			header: header,
			dataType: 'json',         
		}).then((response) => {
			setTimeout(function() {
				uni.hideLoading();
			}, 200);
			let [error, res] = response;        
				resolve(res.data);
		}).catch(error => {
			let [err, res] = error;
			reject(err)
		})
	});
}
export default request