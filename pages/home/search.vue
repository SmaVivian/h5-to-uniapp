<template>
  <div class="page-search">
    <div class="header">
      <!-- <div class="btn-sel-box">
        <van-dropdown-menu>
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
      </div>-->

      <form action="/">
        <!-- <van-search left-icon="location-o" placeholder="请输入搜索关键词" v-model="value"/> -->

        <van-search
          v-model="value"
          placeholder="输入要预约的博物馆名称"
          show-action
          @search="onSearch"
          @input="onSearch"
          @cancel="onCancel"
        />
      </form>
    </div>

    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      :finished-text="(dataList.length === 0 && !loading || !value) ? '' : '没有更多了'"
    >
      <!-- :finished-text="(dataList.length === 0 && !loading) ? '' : '没有更多了'" -->
      <li v-for="item in dataList" :key="item.id">
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
              src="~@images/night.svg"
              alt
            >
            <!-- <span class="distance">距离: {{item.showDistance | filterDistance}}</span> -->
          </div>
          <div class="bottom">
            <span class="num" v-if="item.openStatus==='1'">预约量{{item.appointSum}}</span>
            <span class="num" v-if="item.openStatus==='2'">跳转到博物馆预约入口</span>
            <span class="num" v-if="item.openStatus==='0'">该馆仅支持线下购票参观</span>
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
      </li>

      <p class="g-no-data tc" v-if="!loading && !dataList.length && value">
        <img src="~@images/no-data.png" alt>
      </p>
    </van-list>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem, Button, Search, Icon, List } from 'vant'
export default {
  components: {
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Button.name]: Button,
    [Search.name]: Search,
    [Icon.name]: Icon,
    [List.name]: List
  },
  data() {
    return {
      defaultImg: 'this.src="' + require('@assets/images/default-1.png') + '"',
      loading: false,
      finished: false,
      size: 10,
      currentPage: 0,

      value: '',
      dataList: [],
      optionList: [],
      currentCity: {
        name: '北京市',
        id: null
      }
    }
  },
  methods: {
    handleChange(item) {
      this.currentCity = {
        name: item.name,
        id: item.id
      }
      this.$refs.item.toggle()
      this.onSearch()
    },
    onLoad() {
      if (!this.value) {
        this.finished = true
        return
      }
      this.currentPage++
      this.getDataList()
    },
    getDataList() {
      // console.log(this.loading)
      this.$http
        .get('/AppointOrder/museumList.do', {
          key: this.value,
          type: '1', //排序类型(1-默认排序 2-距离最近 3-预约量)
          area: this.currentCity.id, //区列表
          longitude: this.$route.query.longitude, //经度
          latitude: this.$route.query.latitude, //纬度
          size: this.size,
          currentPage: this.currentPage
        })
        .then(res => {
          let data = res.data
          this.loading = false
          this.finished = this.currentPage >= res.page.totalPage ? true : false
          this.dataList = this.dataList.concat(data)
        })
    },
    getAddrList() {
      this.$http
        .get('/AppointOrder/areaList.do', {
          // openId: this.$route.query.openId,
          // lat: this.latitude,
          // lng: this.longitude
        })
        .then(res => {
          // this.currentCity = res.data[0]
          res.data.unshift({
            name: '北京市',
            id: null
          })
          this.optionList = res.data
        })
    },
    handleOrder(item) {
      if (item.openStatus === '1') {
        this.$router.push({ path: '/home/order-pre', query: { id: item.id } })
      } else {
        this.$router.push({
          name: 'orderCode',
          params: {
            appointQrcode: item.appointQrcode
          }
        })
      }
    },
    goBack() {
      this.$router.go(-1)
    },
    onSearch() {
      this.currentPage = 1
      this.dataList = []

      if (!this.value) return

      this.finished = false
      this.loading = true
      this.getDataList()
    },
    onCancel() {
      this.$router.go(-1)
    }
  },
  created() {
    this.getAddrList()
  }
}
</script>

<style lang="less" scoped>
.page-search {
  height: calc(100vh);
  background: #fff;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .header {
    position: relative;
    padding: 10px 16px;
    // padding-left: 100px;

    .btn-sel-box {
      position: absolute;
      left: 16px;
      top: 10px;
      line-height: @headerHeight;
      color: #fff;
      /deep/ .van-dropdown-menu {
        height: 34px;
        // line-height: 30px;
        .van-dropdown-menu__item {
          height: 34px;
        }
        .van-dropdown-menu__title {
          padding-left: 0;
          font-size: 14px;
          color: @color2;
        }
        .van-cell {
          font-size: 14px;
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

    .van-search__content {
      background: #f0f2f5;
    }
    .van-search {
      padding: 0;
    }
    .van-search__action {
      padding-left: 10px;
      padding-right: 0;
      background: #fff;
      color: @primary;
    }
  }
  .list {
    padding: 0 16px 10px;
    li {
      display: flex;
      padding: 10px;
      margin-top: 10px;
      box-shadow: 0px 3px 10px 0px rgba(173, 179, 191, 0.3);
      border-radius: 8px;
      img.pic {
        width: 90px;
        height: 90px;
        object-fit: cover;
      }
      .info {
        width: 100%;
        padding-left: 10px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        font-size: 16px;
        color: @color1;
        .center {
          position: relative;
          color: @warning;
          display: flex;
          align-items: center;
          font-size: 14px;
          .distance {
            color: @color3;
            font-size: 12px;
            position: absolute;
            right: 0;
          }
          .icon-night {
            width: 20px;
            height: 20px;
          }
        }
        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .num {
            font-size: 12px;
            color: @color3;
          }
        }
      }
    }
  }
}
</style>


