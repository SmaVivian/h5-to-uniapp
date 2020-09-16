<template>
  <div class="page-order">
    <!-- 参观人信息 -->
    <div class="header">
      <img src="~@images/top1.png" alt :onerror="defaultImg">
      <div class="info">
        <p class="name">{{museumName}}</p>
        <p>
          {{currentTime | DateFormat('MM月dd日')}}
          <span class="ml-5">{{timesStr}}</span>
        </p>
      </div>
    </div>

    <div class="content mt-10">
      <h2>
        参观人信息
        <span>（最多3人）</span>
      </h2>
      <ul>
        <li v-for="(item,index) in personList" :key="index">
          <span class="name ell">{{item.name}}</span>
          <span class="code">{{item.identificationNumber}}</span>
          <div class="btns" style="font-size:12px;">
            <i class="btn btn-edit" @click="edit(index)"></i>
            <i class="btn btn-dele" @click="dele(index)"></i>
          </div>
        </li>
      </ul>
      <div class="tc mt-20" v-show="personList.length<3">
        <van-button round type="primary" size="small" @click="handleClick">添加参观人</van-button>
        <p class="tips mt-10">请确保姓名、证件号填写正确</p>
      </div>
    </div>

    <div class="mt-10">
      <van-checkbox
        v-model="isCheck"
        shape="square"
        checked-color="#bd1b2d"
        v-show="personList.length>0"
      >我承诺以上参观人近14天内未接触过新冠确诊病人或疑似病人，体温在 37.3℃以下，无乏力、干咳、鼻塞、流涕、咽痛、腹泻等症状</van-checkbox>
    </div>

    <div class="bottom">
      <van-button
        round
        type="primary"
        block
        :disabled="personList.length<1 || !isCheck"
        @click="handleSave"
        :loading="isLoading"
      >提交预约</van-button>
      <!-- loading-text="提交预约" -->
    </div>
  </div>
</template>

<script>
import {
  Icon,
  Checkbox,
  Cell,
  CellGroup,
  Field,
  Button,
  Popup,
  Picker,
  ActionSheet
} from 'vant'
import { mapGetters } from 'vuex'
export default {
  components: {
    [Icon.name]: Icon,
    [Checkbox.name]: Checkbox,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [ActionSheet.name]: ActionSheet
  },
  computed: {
    ...mapGetters(['personList', 'editIndexStr'])
  },
  data() {
    return {
      defaultImg: this.$store.state.app.defaultImg,
      isCheck: false,
      isLoading: false,
      currentTime: this.$route.query.time,
      settingTimesId: this.$route.query.settingTimesId,
      museumName: this.$route.query.museumName,
      timesStr: this.$route.query.timesStr
    }
  },
  methods: {
    handleClick() {
      this.$store.dispatch('app/setEditIndexStr', '')
      this.$router.push({
        path: '/home/order-add',
        query: {
          id: this.$route.query.id,
          time: this.$route.query.time,
          settingTimesId: this.$route.query.settingTimesId,
          timesStr: this.$route.query.timesStr,
          museumName: this.$route.query.museumName
        }
      })
    },
    edit(index) {
      this.$store.dispatch('app/setEditIndexStr', String(index))
      this.$router.push({
        path: '/home/order-add',
        query: {
          id: this.$route.query.id,
          time: this.$route.query.time,
          settingTimesId: this.$route.query.settingTimesId,
          timesStr: this.$route.query.timesStr,
          museumName: this.$route.query.museumName
        }
      })
    },
    dele(index) {
      this.personList.splice(index, 1)
      this.$store.dispatch('app/setPersonList', this.personList)
    },
    handleSave() {
      if (this.personList.length < 1 || !this.isCheck) return

      this.isLoading = true
      this.$http
        .post('/AppointOrder/apply.do', {
          orgId: this.$route.query.id, //int	博物馆ID
          appointEntryTime: this.$route.query.time, //string	预约的哪一天（例如：2020-04-21）
          settingTimesId: this.$route.query.settingTimesId, //string	时段
          userListStr: JSON.stringify(this.personList), //json字符串	游客信息
          userId: this.$store.state.user.userId,
          token: this.$store.state.user.token
        })
        .then(res => {
          this.isLoading = false
          if (res.success === 1) {
            this.$router.push({
              path: '/home/order-res',
              query: {
                pageType: '1',
                orderId: res.data
              }
            })
          } else if (res.error.code === '300011') {
            // 余票不足
            this.$router.push({
              path: '/home/order-res',
              query: { pageType: '2' }
            })
          } else {
            this.$toast(res.error.message)
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.page-order {
  padding: 10px 16px;
  min-height: 100%;
  .box {
    position: relative;
  }
  .header {
    position: relative;
    img {
      width: 100%;
      height: 85px;
      object-fit: cover;
    }
    .info {
      position: absolute;
      left: 40px;
      top: 20px;
      font-size: 14px;
      font-weight: 500;
      color: @primary;
      line-height: 16px;
      .name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }
    }
  }
  .content {
    padding: 20px 16px;
    box-shadow: 0px 3px 10px 0px rgba(173, 179, 191, 0.3);
    border-radius: 8px;
    h2 {
      padding-bottom: 20px;
      font-size: 16px;
      border-bottom: dashed 1px @border;
      color: @color1;
      span {
        font-size: 12px;
        color: @color2;
      }
    }
    ul {
      li {
        position: relative;
        line-height: 36px;
        padding-right: 60px;
        font-size: 14px;
        color: @color2;
        display: flex;
        align-items: center;
        border-bottom: dashed 1px @border;
        .name {
          display: inline-block;
          width: 80px;
          font-size: 16px;
          color: @color1;
        }
        .btns {
          position: absolute;
          width: 60px;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 5px;
          box-sizing: border-box;
          .btn {
            display: inline-block;
            width: 16px;
            height: 16px;
            padding: 3px;
          }
          .btn-edit {
            background: url(~@images/btn-edit.png) center center no-repeat;
            background-size: 16px 16px;
            margin-right: 4px;
          }
          .btn-dele {
            background: url(~@images/btn-dele.png) center center no-repeat;
            background-size: 16px 16px;
          }
        }
      }
    }
    .tips {
      text-align: center;
      font-size: 12px;
      color: @color3;
    }
  }
  .van-checkbox {
    align-items: baseline;
    text-align: justify;
    /deep/ .van-checkbox__icon {
      font-size: 16px;
      top: 2px;
      position: relative;
    }
    /deep/ .van-checkbox__label {
      font-size: 14px;
      color: #979797;
      line-height: 20px;
    }
  }
  .bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  .van-button--small {
    padding: 0 25px;
  }
}
</style>


