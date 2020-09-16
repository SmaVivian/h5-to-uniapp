<template>
  <div class="page-order-res">
    <!-- 成功 -->
    <div class="content-success" v-if="pageType==='1'">
      <div class="header">
        <img src="~@images/success.png" alt>
        <div class="head-txt">
          <h1>预约成功</h1>
          <p>请在约定时间前往博物馆参观，若需取消预约，请提前 2 小时在“预约记录”中取消</p>
        </div>
      </div>

      <div class="content">
        <div class="box-bor">
          <ul>
            <li v-for="(item, index) in detailData.visitors" :key="index">
              <img
                class="status"
                v-if="detailData.orderStatus==='1'"
                src="~@images/status-1.png"
                alt
              >
              <img
                class="status"
                v-if="detailData.orderStatus==='2'"
                src="~@images/status-2.png"
                alt
              >
              <img
                class="status"
                v-if="detailData.orderStatus==='3'"
                src="~@images/status-3.png"
                alt
              >
              <img
                class="status"
                v-if="detailData.orderStatus==='0'"
                src="~@images/status-4.png"
                alt
              >
              <div class="bg-box" v-show="index+1<detailData.visitors.length">
                <img class="left-bg" src="~@images/semicircle.png" alt>
                <img class="right-bg" src="~@images/semicircle.png" alt>
              </div>
              <h2>{{item.name}}</h2>
              <p>
                <label>预约场馆：</label>
                {{detailData.museumName}}
              </p>
              <p>
                <label>参观日期：</label>
                {{detailData.visiteTime}}
              </p>
              <p>
                <label>证件号码：</label>
                {{item.identificationNumber}}
              </p>
              <p>
                <label>手机号码：</label>
                {{item.phone}}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer">
        <van-button round type="primary" block @click="goMyOrder">查看预约记录</van-button>
      </div>
    </div>

    <!-- 失败 -->
    <div class="content-fail" v-if="pageType==='2'">
      <div class="content">
        <img src="~@images/fail.png" alt>
        <h1>余票不足</h1>
        <p>当前余票不足，无法预约，请更改参观日期或时段后重新提交预约，若您提交的预约订单中包含多个参观人，也可删减参观人后再尝试</p>
      </div>

      <div class="footer">
        <van-button round type="primary" block @click="handleReOrder">重新预约</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Button } from 'vant'
export default {
  components: {
    [Button.name]: Button
  },
  data() {
    return {
      pageType: this.$route.query.pageType,
      orderId: this.$route.query.orderId, // 39
      detailData: {}
    }
  },
  methods: {
    getData() {
      this.$http
        .post('/AppointOrder/detail.do', {
          id: this.$route.query.orderId,
          userId: this.$store.state.user.userId,
          token: this.$store.state.user.token
        })
        .then(res => {
          if (res.success === 1) {
            this.detailData = res.data
          } else {
            this.$toast(res.error.message)
          }
        })
    },
    handleReOrder() {
      this.$router.go('-1')
    },
    goMyOrder() {
      this.$router.push('/myorder')
    }
  },
  created() {
    if (this.$route.query.pageType === '1') {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.page-order-res {
  .content-success {
    .header {
      display: flex;
      padding: 20px 30px 50px;
      background: @success;
      img {
        width: 100px;
        height: 100px;
      }
      .head-txt {
        flex: 1;
        padding-left: 20px;
        font-size: 12px;
        color: #fff;
        line-height: 17px;
        h1 {
          font-size: 24px;
          line-height: 33px;
          margin-bottom: 4px;
        }
        p {
          text-align: justify;
        }
      }
    }
    .content {
      margin-top: -30px;
      padding: 0 20px 30px;
      .box-bor {
        padding: 6px 6px 0;
        background: url(~@images/bg-top1.png) top center no-repeat;
        background-size: 100% 10px;
        img.bor {
          width: 100%;
          height: 14px;
          display: block;
        }
        ul {
          // height: calc(100vh - 250px);
          // overflow: hidden;
          // overflow-y: auto;
          box-shadow: 0px 3px 10px 0px rgba(173, 179, 191, 0.3);
          li {
            position: relative;
            padding: 30px 20px;
            font-size: 14px;
            color: @color2;
            line-height: 20px;
            background: #fff;
            border-bottom: dashed 1px @border;
            &:first-child {
              background: #fff url(~@images/bg-border.png) top center no-repeat;
              background-size: 100% 10px;
            }
            &:last-child {
              border-bottom: none;
            }
            .status {
              position: absolute;
              width: 70px;
              height: 70px;
              right: 0;
              top: 0;
            }
            h2 {
              font-size: 16px;
              color: @color1;
              margin-bottom: 8px;
            }
            p {
              line-height: 20px;
            }
            .bg-box {
              img {
                width: 30px;
                height: 40px;
                position: absolute;
                bottom: -20px;
                z-index: 2;
                &.left-bg {
                  left: -12px;
                }
                &.right-bg {
                  right: -12px;
                  transform: rotate(180deg);
                }
              }
            }
          }
        }
      }
    }
    .footer {
      position: relative;
      padding-top: 0;
    }
  }

  .content-fail {
    .content {
      padding: 30px 45px 25px;
      text-align: center;
      font-size: 12px;
      color: @color2;
      line-height: 17px;
      img {
        width: 137px;
        height: 120px;
      }
      h1 {
        margin-top: 20px;
        margin-bottom: 12px;
        font-size: 24px;
        line-height: 33px;
      }
      p {
        text-align: justify;
      }
    }
  }

  .footer {
    padding: 20px 16px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
  }
}
</style>


