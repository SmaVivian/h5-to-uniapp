<template>
  <div class="page-order-pre">
    <div class="content">
      <div class="pic-box">
        <img class="top" :src="detailData.museumUrl" :onerror="defaultImg" alt>
      </div>
      <div class="box-notice mb-10">
        <p class="title mb-5">
          <i class="icon icon-notice mr-5"></i>
          <span>重要提示：</span>
        </p>
        <div class="com-des">
          <p>
            疫情期间，北京市所有博物馆采用实名预约制，所有境内外观众（包括儿童），
            <span>请您预约前通过“北京健康宝”确保本人健康状态未见异常（微信关注“北京健康宝”公众号即可查询本人健康状态），</span>
            这将是参观当日入场的首要条件。
          </p>
          <p class="mt-20">
            <span>参观当日，除了需要出示本人实时的“北京健康宝”状态之外，</span>
            还需在入馆前扫描线下预约核检二维码，并出示核验成功页面，持有效身份证件入馆。
          </p>
          <p class="mt-20">
            <span>本系统仅支持线上预约，</span>
            对于非免费开放博物馆，参观当日还需线下购票方可入馆，具体票价以博物馆公布为准。感谢您的理解与支持！
          </p>
        </div>
      </div>

      <div class="mb-15">
        <p class="title mb-5">
          <i class="icon icon-cloak mr-5"></i>
          <span>开放时间</span>
        </p>
        <div class="com-des">
          <p>{{detailData.openTime}}</p>
        </div>
      </div>

      <div class="mb-15">
        <p class="title mb-5">
          <i class="icon icon-loc mr-5"></i>
          <span>地址&联系电话</span>
        </p>
        <div class="com-des">
          <p>地址：{{detailData.address}}</p>
          <p>电话：{{detailData.appointPhone}}</p>
        </div>
      </div>

      <div class="mb-20">
        <p class="title mb-5">
          <i class="icon icon-tip mr-5"></i>
          <span>预约须知</span>
        </p>
        <div class="com-des" style="padding-left:5px;">
          <p class="item mb-10">
            <label class="mr-5">1.</label> 预约时需填写本人真实有效身份证件（包含儿童）。
          </p>
          <p class="item mb-10">
            <label class="mr-5">2.</label>每个预约订单可预约3人，每张证件号码可预约1人，且每天限约1次。
          </p>
          <p class="item mb-10">
            <label class="mr-5">3.</label>如不能按期参观，请至少提前2小时取消预约，未提前取消预约导致爽约2次以上者。账号被冻结7天。
          </p>
          <p class="item mb-10">
            <span>
              <label class="mr-5">4.</label>疫情防控期间，实行观众入馆必检流程，入馆观众须一律佩戴口罩，进行体温测量，检测体温超过37.3°C、出现咳嗽等可疑症状者不得入馆参观。
            </span>
          </p>
          <p class="item mb-10">
            <label class="mr-5">5.</label>疫情防控期间，建议观众参观时间控制在2小时内，
            <span>排队和观展时请保持1.5米以上距离，</span>
            避免聚集以免造成封闭场所人员聚集。
          </p>
          <p class="item mb-10">
            <label class="mr-5">6.</label>疫情防控期间，当遇到馆内人员密度较大时，各博物馆将根据具体情况采取控制入馆速度等措施，敬请谅解。
          </p>
          <p class="item mb-10">
            <label class="mr-5">7.</label>请您按预约的时间到馆参观，如错过预约时间将无法核验成功。
          </p>
        </div>
      </div>
    </div>

    <div class="footer-box">
      <van-button round type="primary" block @click="showSheet">我已知晓并同意，开始预约</van-button>
    </div>

    <van-action-sheet close-icon="close" v-model="show" title="选择参观日期">
      <div class="sheet-box">
        <div class="date-content">
          <div class="date-box">
            <div
              class="date-item"
              :class="{'active': item.times===activeItem.times,'gray': item.openState==='0' || (item.openState==='1'&&item.surplusSum<=0)}"
              v-for="(item, index) in dataList"
              :key="index"
              @click="handleClickDate(item)"
            >
              <p>{{item.times | DateFormat('MM月dd日')}}</p>
              <p class="mt-5" v-if="item.openState==='0'">闭馆</p>
              <p class="mt-5" v-if="item.openState==='1'&&item.surplusSum===0">售罄</p>
              <p class="mt-5" v-if="item.openState==='1'&&item.surplusSum=== -1">停止入馆</p>
              <p class="mt-5" v-if="item.openState==='1'&&item.surplusSum>0">余{{item.surplusSum}}</p>
            </div>
          </div>

          <h2>选择参观时段</h2>
          <div class="date-box date-box2 bottom mb-10">
            <!-- 版本二 时间段 -->
            <div
              class="date-item"
              :class="{'active': it.settingTimesId === settingTimesId,'gray': activeItem.openState==='0' || (activeItem.openState==='1'&&it.surplusSum<=0)}"
              v-for="(it, index) in activeItem.sum"
              :key="index"
              @click="handleSel(it)"
            >
              <p>{{it.timesStr}}</p>
              <p class="mt-5" v-if="activeItem.openState==='0'">闭馆</p>
              <p class="mt-5" v-if="activeItem.openState==='1'&&it.surplusSum===0">售罄</p>
              <p class="mt-5" v-if="activeItem.openState==='1'&&it.surplusSum=== -1">停止入馆</p>
              <p class="mt-5" v-if="activeItem.openState==='1'&&it.surplusSum>0">余{{it.surplusSum}}</p>
            </div>

            <!-- 版本一 上午、下午 -->
            <!-- <div
              class="date-item"
              :class="{'active': amOrPm === '1', 'gray': activeItem.morningSurplusSum === -1 || (activeItem.openState==='1'&&activeItem.morningSurplusSum===0)}"
              @click="handleSel('1', activeItem.morningSurplusSum)"
            >
              <p>上午</p>
              <p class="mt-5" v-if="activeItem.openState==='1'&&activeItem.morningSurplusSum===0">售罄</p>
              <p
                class="mt-5"
                v-if="activeItem.openState==='1'&&activeItem.morningSurplusSum=== -1"
              >停止入馆</p>
              <p
                class="mt-5"
                v-if="activeItem.openState==='1'&&activeItem.morningSurplusSum>0"
              >余{{activeItem.morningSurplusSum}}</p>
            </div>
            <div
              class="date-item"
              :class="{'active': amOrPm === '2', 'gray': activeItem.afternoonSurplusSum === -1 || (activeItem.openState==='1'&&activeItem.afternoonSurplusSum===0)}"
              @click="handleSel('2', activeItem.afternoonSurplusSum)"
            >
              <p>下午</p>
              <p
                class="mt-5"
                v-if="activeItem.openState==='1'&&activeItem.afternoonSurplusSum===0"
              >售罄</p>
              <p
                class="mt-5"
                v-if="activeItem.openState==='1'&&activeItem.afternoonSurplusSum=== -1"
              >停止入馆</p>
              <p
                class="mt-5"
                v-if="activeItem.openState==='1'&&activeItem.afternoonSurplusSum>0"
              >余{{activeItem.afternoonSurplusSum}}</p>
            </div>-->
          </div>
        </div>

        <div class="footer">
          <van-button :disabled="!settingTimesId" round type="primary" block @click="goOrder">立即预约</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
import { Button, ActionSheet } from 'vant'
export default {
  components: {
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet
  },
  data() {
    return {
      defaultImg: 'this.src="' + require('@assets/images/default-2.png') + '"',
      show: false,
      activeItem: {
        date: 1,
        time: '1'
      },
      settingTimesId: '', // 时间段id
      timesStr: '', // 时间段字符串
      // amOrPm: '', // 上午还是下午  1-上午 2-下午
      detailData: {},
      dataList: []
    }
  },
  methods: {
    getDetail() {
      this.$http
        .get('/AppointOrder/museumDetail.do', {
          orgId: this.$route.query.id,
          userId: this.$store.state.user.userId,
          token: this.$store.state.user.token
        })
        .then(res => {
          this.detailData = res.data
        })
    },
    getMuseumTicket() {
      this.$http
        .get('/AppointOrder/museumTicket.do', {
          orgId: this.$route.query.id
        })
        .then(res => {
          this.dataList = res.data

          if (res.data.length) {
            this.activeItem = res.data.find(item => item.surplusSum > 0) || {}

            this.show = true
          } else {
            this.$toast('还未开馆哟，明天再来看吧')
          }
        })
    },
    showSheet() {
      this.getMuseumTicket()
    },
    handleClickDate(item) {
      if (item.surplusSum > 0) {
        this.activeItem = item
        this.settingTimesId = ''
      }
    },
    handleSel(it) {
      if (it.surplusSum > 0) {
        this.settingTimesId = it.settingTimesId
        this.timesStr = it.timesStr
      }
    },
    // 当前用户当天是否已经提交过预约
    judgeIsOrder() {
      this.$http
        .post('/AppointOrder/checkToday.do', {
          appointEntryTime: this.activeItem.times,
          orgId: this.$route.query.id,
          userId: this.$store.state.user.userId,
          token: this.$store.state.user.token
        })
        .then(res => {
          if (res.success === 1) {
            this.$router.push({
              path: '/home/order',
              query: {
                id: this.$route.query.id,
                time: this.activeItem.times,
                settingTimesId: this.settingTimesId,
                timesStr: this.timesStr,
                museumName: this.detailData.name
              }
            })
          } else {
            this.$toast(res.error.message)
          }
        })
        .catch(res => {
          console.log(res)
        })
    },
    goOrder() {
      if (!this.settingTimesId) {
        this.$toast('请选择时段')
        return
      }

      this.judgeIsOrder()

      // 登录授权
      // if (this.$store.state.user.userId || this.$route.query.wxlogin) {
      //   this.judgeIsOrder()
      // } else {
      //   let apiUrl = location.origin
      //   window.location.href =
      //     apiUrl +
      //     '/admin/wx/m/wxLogin.do?redirect_uri=' +
      //     encodeURIComponent(
      //       apiUrl + '/appoint/#/home/order-pre?id=' + this.$route.query.id
      //     )
      // }
    }
  },
  created() {
    // 登录授权
    if (this.$store.state.user.userId) {
      this.getDetail()
    } else if (this.$route.query.wxlogin) {
      this.$store
        .dispatch('user/loginWechatAuth', this.$route.query.wxlogin)
        .then(() => {
          this.getDetail()
        })
        .catch(msg => {
          this.$toast(msg)
        })
    } else {
      let apiUrl = location.origin
      window.location.href =
        apiUrl +
        '/admin/wx/m/wxLogin.do?redirect_uri=' +
        encodeURIComponent(
          apiUrl + '/appoint/#/home/order-pre?id=' + this.$route.query.id
        )
    }

    // this.getDetail()
    // if (this.$route.query.wxlogin) {
    //   this.$store
    //     .dispatch('user/loginWechatAuth', this.$route.query.wxlogin)
    //     .then(() => {})
    //     .catch(msg => {
    //       this.$toast(msg)
    //     })
    // }
  }
}
</script>

<style lang="less" scoped>
.page-order-pre {
  .pic-box {
    padding: 10px 0;
    .top {
      width: 100%;
      height: 140px;
    }
  }
  .content {
    padding: 0 16px;
    height: calc(100vh - 64px);
    box-sizing: border-box;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .box-notice {
      padding: 10px;
      background: #f3ffda;
    }
    .title {
      color: @color1;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      .icon {
        display: inline-block;
        width: 24px;
        height: 24px;
      }
      .icon-notice {
        background: url(~@images/icon-notice.svg) center center no-repeat;
      }
      .icon-cloak {
        background: url(~@images/icon-cloak.svg) center center no-repeat;
      }
      .icon-loc {
        background: url(~@images/icon-loc.svg) center center no-repeat;
      }
      .icon-tip {
        background: url(~@images/icon-tip.svg) center center no-repeat;
      }
    }
    .com-des {
      font-size: 14px;
      color: @color2;
      line-height: 20px;
      text-align: justify;
      .item {
        position: relative;
        padding-left: 20px;
        label {
          position: absolute;
          left: 0;
        }
      }
      span {
        // color: @primary;
      }
    }
  }
  .footer-box {
    padding: 10px 16px;
    width: 100%;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .sheet-box {
    position: relative;
    padding-top: 0;
    padding-bottom: 50px;
    font-size: 14px;
    color: @color2;
    .date-box {
      margin-left: -10px;
      padding: 0 16px;
      display: flex;
      flex-wrap: wrap;
      .date-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        margin-left: 10px;
        box-sizing: border-box;
        width: 78px;
        height: 60px;
        border-radius: 8px;
        box-shadow: 0px 3px 10px 0px rgba(173, 179, 191, 0.3);
        &.active {
          background: @primary;
          color: #fff;
        }
        &.gray {
          background: #f0f2f5;
          color: @color3;
        }
      }
      &.bottom {
      }
    }
    .date-box2 {
      margin-left: -20px;
      .date-item {
        width: 100px;
        margin-left: 20px;
      }
    }

    h2 {
      margin-top: 20px;
      padding-top: 20px;
      border-top: dashed 1px @border;
    }

    .footer {
      width: 100%;
      // height: 44px;
      position: absolute;
      bottom: 10px;
      left: 0;
      // margin-top: 10px;
      padding: 0 16px;
      box-sizing: border-box;
    }
  }
  // .van-action-sheet {
  //   max-height: 90%;
  // }
  .van-action-sheet {
    overflow: hidden;
  }
  .date-content {
    height: 320px;
    overflow-y: auto;
  }
  .sheet-box h2,
  .van-action-sheet__header {
    text-align: left;
    padding-left: 16px;
    font-size: 16px;
    color: @color1;
    line-height: initial;
    padding-top: 20px;
    .van-action-sheet__close {
      top: 20px;
    }
  }
}
</style>


