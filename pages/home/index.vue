<template>
  <div class="page-home">
    <img class="main-pic" src="@/static/images/main.png" alt :onerror="defaultImg">
		
		<div class="header">
			<!-- <div class="btn-sel-box" :class="{'active': showPop}" @click="showPop=!showPop"> -->
			<div class="btn-sel-box">
				<van-dropdown-menu>
					<!-- <van-dropdown-item v-model="value1" :options="optionList"/> -->
					<van-dropdown-item :title="currentCity.name" ref="item">
						<div
							role="button"
							tabindex="0"
							class="van-cell van-cell--clickable van-dropdown-item__option"
							:class="{'van-dropdown-item__option--active': item.id === currentCity.id}"
							v-for="(item, index) in optionList"
							:key="index"
							@click="handleChange(item)"
						>
							<div class="van-cell__title">
								<span v-if="item.id">{{item.name+'（'+item.count+'）'}}</span>
								<span v-else>{{item.name}}</span>
							</div>
						</div>
					</van-dropdown-item>
				</van-dropdown-menu>
				<!-- <span class="btn-sel">湖北省</span> -->
			</div>
			<form action="/">
				<!-- <van-search left-icon="location-o" placeholder="请输入搜索关键词" v-model="key"/> -->
				<van-search
					placeholder="输入要预约的博物馆名称"
					v-model="key"
					@search="handleEnter"
					@focus="handleFocus"
				/>
			</form>
		</div>
		
		<van-tabs class="content" :active="activeTab" @click="handleTabClick">
			<van-tab :title="item.title" :name="item.name" v-for="item in tabList" :key="item.name"></van-tab>
		</van-tabs>
		
		<view class="uni-list">
			<block v-for="(item, index) in dataList" :key="index">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<img class="pic" :src="item.museumUrl" :onerror="defaultImg" alt>
					<div class="info">
						<h2>{{item.name}}</h2>
						<div class="center">
							<span class="com-tag" v-show="item.level">{{item.level}}</span>
							<span class="com-tag ml-10" v-show="item.type">{{item.type}}</span>
							<img
								class="icon-night"
								:class="{'ml-10': item.level || item.type}"
								v-show="item.isNight==='1'"
								src="@/static/images/night.svg"
								alt
							>
							<!-- <span class="distance">距离: {{item.showDistance | filterDistance}}</span> -->
						</div>
						<div class="bottom">
							<span class="num" v-if="item.openStatus==='1'">预约量{{item.appointSum}}</span>
							<span class="num" v-if="item.openStatus==='2'">跳转到博物馆预约入口</span>
							<span class="num" v-if="item.openStatus==='0'">该馆仅支持线下购票参观</span>
							<!-- <van-button
								round
								type="primary"
								:disabled="item.openStatus==='0'"
								size="small"
								@click="handleOrder(item)"
							>{{item.openStatus==='0'?'不支持预约':'立即预约'}}</van-button>-->

							<van-button
								round
								type="primary"
								size="small"
								disabled
								@click="handleOrder(item)"
								v-if="item.close === '8'"
							>闭馆中</van-button>
							<van-button
								round
								type="primary"
								size="small"
								disabled
								@click="handleOrder(item)"
								v-else-if="item.openStatus === '0'"
							>不支持预约</van-button>
							<van-button
								round
								type="primary"
								size="small"
								@click="handleOrder(item)"
								v-else-if="item.openStatus === '1' || item.openStatus === '2'"
							>立即预约</van-button>
						</div>
					</div>
				</view>
			</block>
		</view>
		<div v-if="dataList.length">
			<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
		</div>
		
		<div class="g-no-data tc mt-30" v-if="status==='noMore' && !dataList.length">
			<img src="@/static/images/no-data.png" alt>
		</div>
		
		<div class="tree-mask" v-if="showPop" style="width: 100%;" @click="showPop=false">
			<van-tree-select
				height="55vw"
				:items="items"
				:main-active-index.sync="activeIndex"
				@click.native.stop="handleStop"
			>
				<template slot="content">
					<ul class="addr-child-list">
						<li
							v-for="(it, i) in items[activeIndex].children"
							:key="i"
							@click="chooseAddr(it, items[activeIndex])"
						>
							<span class="name" :class="{'active': it.id === activeAddr.id}">{{it.text}}</span>
							<span class="count">{{i === 0 ? it.num+'家诊所' : it.num}}</span>
						</li>
					</ul>
				</template>
			</van-tree-select>
		</div>
  </div>
</template>

<script>
// var wx = require('weixin-js-sdk')
// import {
//   List
// } from 'vant'
export default {
	// components: {
	// 	[List.name]: List
	// },
  data() {
		return {
			status: 'more',
			contentText: {
				contentdown: '上拉加载更多',
				contentrefresh: '加载中',
				contentnomore: '没有更多了'
			},
			
			defaultImg: 'this.src="' + require('@/static/images/default-1.png') + '"',
			loading: false,
			finished: false,
			size: 10,
			currentPage: 1,

			showPop: false,
			key: '',
			dataList: [],
			items: [],
			activeTab: '1',
			tabList: [
				{
					title: '综合排序',
					name: '1'
				},
				// {
				//   title: '离我最近',
				//   name: '2'
				// },
				{
					title: '预约量↓',
					name: '3'
				}
			],
			// activeId: 1,
			// activeIndex: 0,
			// activeAddr: {
			//   text: '',
			//   id: ''
			// }, // 已选择的地区
			latitude: '30.59276',
			longitude: '114.30525',
			optionList: [],
			currentCity: {
				name: '北京市',
				id: null
			},
			isFirst: true
		}
	},
	onLoad() {
		this.getAddrList()
		this.getDataList();
	},
	onPullDownRefresh() {
		this.dataList = []
		this.currentPage = 1
		this.reload = true;
		this.getDataList();
	},
	onReachBottom() {
		this.status = 'more';
		this.currentPage++
		this.getDataList();
	},
	methods: {
		handleChange(item) {
			console.log(11111)
			this.currentCity = {
				name: item.name,
				id: item.id
			}
			this.$refs.item.toggle()
			this.handleTabClick()
		},
		handleTabClick(e) {
			console.log(e)
			e && e.detail && (this.activeTab = e.detail.name)
			this.currentPage = 1
			this.dataList = []
			this.reload = true
			// this.finished = false
			// this.loading = true
			this.getDataList()
		},
		handleFocus(e) {
			this.$Router.push({
				path: 'pages/index/index',
				// path: '/home/search',
				query: { longitude: this.longitude, latitude: this.latitude }
			})
		},
		handleEnter() {
			console.log(this.key)
		},
		handleOrder(item) {
			this.$Router.push({
				path: 'pages/index/index',
				// path: '/home/search',
				query: { longitude: this.longitude, latitude: this.latitude }
			})
			// if (item.openStatus === '1') {
			// 	this.$router.push({ path: '/home/order-pre', query: { id: item.id } })
			// } else {
			// 	this.$router.push({
			// 		name: 'orderCode',
			// 		params: {
			// 			appointQrcode: item.appointQrcode
			// 		}
			// 	})
			// }
		},
		getDataList() {
			this.$http('/AppointOrder/museumList.do', 'GET', {
				type: this.activeTab, //排序类型(1-默认排序 2-距离最近 3-预约量)
				area: this.currentCity.id||'', //区列表
				longitude: this.longitude, //经度
				latitude: this.latitude, //纬度
				size: this.size,
				currentPage: this.currentPage
			})
			.then(res => {
				let data = res.data
				this.loading = false
				this.status = this.currentPage >= res.page.totalPage ? 'noMore' : 'more'
				this.dataList = this.dataList.concat(data)
			})
		},
		getAddrList() {
			console.log(111)
			// openId=on_Gjs6N38QlsFymr-hGkdl08Jhw
			// console.log('openId', this.$route.query.openId)
			// http://bjmuseum.org.cn/appoint/#/home
			this.$http('/AppointOrder/areaList.do', 'GET',  {
					// openId: this.$route.query.openId,
					// lat: this.latitude,
					// lng: this.longitude
				})
				.then(res => {
					console.log(222, res)
					// this.currentCity = res.data[0]
					res.data.unshift({
						name: '北京市',
						id: null
					})
					this.optionList = res.data
					// this.items = res.item
					// this.activeAddr.text = res.text
					// this.activeAddr.id = res.id
					// this.getDataList()
				})
		},
	}
}
</script>

<style lang="less" scoped>
.page-home {
  padding: 32rpx;
  // padding-top: @headerHeight;
  img.main-pic {
    width: 100%;
    height: 260rpx;
  }
  .header {
    margin-top: 20rpx;
    position: relative;
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    z-index: 2;
    // height: @headerHeight;
    background: #fff;
    display: flex;
    align-items: center;
    // padding: 20rpx;
    padding-left: 160rpx;
    box-sizing: border-box;
    .van-search__content {
      background: #f0f2f5;
    }
    .btn-sel-box {
      position: absolute;
      left: 0;
      top: 0;
      line-height: @headerHeight;
      color: #fff;
      /deep/ .van-dropdown-menu {
        height: 68rpx;
        // line-height: 60rpx;
        .van-dropdown-menu__item {
          height: 68rpx;
        }
        .van-dropdown-menu__title {
          padding-left: 0;
          font-size: 28rpx;
          color: @color2;
        }
        .van-cell {
          font-size: 28rpx;
          color: @color2;
        }
        .van-dropdown-item__option--active {
          color: @primary;
        }
        .van-dropdown-item__icon {
          color: @primary;
        }
      }
    }
    form {
      width: 100%;
    }
    /deep/ .van-search {
      padding: 0;
      height: 68rpx;
      line-height: 68rpx;
      // width: 100%;
      // flex: 1;
      // background: @primary !important;
    }
  }
  .content {
  }
  .uni-list {
    // padding: 0 40rpx 20rpx;
    .uni-list-cell {
      display: flex;
      padding: 20rpx;
      margin-top: 20rpx;
      box-shadow: 0rpx 6rpx 20rpx 0rpx rgba(173, 179, 191, 0.3);
      border-radius: 16rpx;
      img.pic {
        width: 180rpx;
        height: 180rpx;
        object-fit: cover;
      }
      .info {
        width: 100%;
        padding-left: 20rpx;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        font-size: 32rpx;
        color: @color1;
        .center {
          position: relative;
          color: @warning;
          display: flex;
          align-items: center;
          font-size: 28rpx;
          .distance {
            color: @color3;
            font-size: 24rpx;
            position: absolute;
            right: 0;
          }
          .icon-night {
            width: 40rpx;
            height: 40rpx;
          }
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .num {
            font-size: 24rpx;
            color: @color3;
          }
        }
      }
    }
  }
  .van-button {
    // font-size: 28rpx;
    width: 160rpx;
    padding: 0;
    text-align: center;
  }
  /deep/ .van-dropdown-menu__bar {
    box-shadow: none;
  }

  .addr-child-list {
    li {
      padding: 0 30rpx;
      display: flex;
      justify-content: space-between;
      line-height: 80rpx;
      .name {
        font-size: @fontSize;
        color: @color2;
        &.active {
          color: @primary;
        }
      }
      .count {
        font-size: 20rpx;
        color: @color3;
      }
    }
  }

  // /deep/ .van-overlay {
  //   top: @headerHeight;
  // }
  .tree-mask {
    position: fixed;
    top: @headerHeight;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
  }
  .tree-pop {
    &.van-popup {
      top: @headerHeight;
    }
  }

  .van-tree-select {
    .van-sidebar-item--select {
      // border-color: @primary;
    }
  }
}
</style>


