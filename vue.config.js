let path = require('path');
let stylePath = path.resolve(__dirname, 'common/css/mixin.less') // common/common.less是less的路径

const TransformPages = require('uni-read-pages')
const tfPages = new TransformPages()

module.exports = {
	css: {
		loaderOptions: {
			less: {
				globalVars: {
					"hack": `true; @import "${stylePath}"`
				}
			}
		}
	},
	
	configureWebpack: {
		plugins: [
			new tfPages.webpack.DefinePlugin({
				ROUTES: JSON.stringify(tfPages.routes)
			})
		]
	}
}