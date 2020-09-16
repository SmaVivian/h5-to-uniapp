<template>
  <div class="page-order-code">
    <img class="content mb-10" src="~@images/bg-code.jpg" alt>
    <img class="code-txt" src="~@images/code-txt.png" alt>
    <div class="pic-box">
      <img :src="codeUrl" alt>
    </div>
    <!-- <div class="content mb-10">
      <div class="pic-box">
        <img :src="codeUrl" alt>
      </div>
    </div>-->

    <div class="footer">
      <van-button round type="primary" block @click="handleClick">取 消</van-button>
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
      codeUrl: this.$route.params.appointQrcode
    }
  },
  methods: {
    handleClick() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.page-order-code {
  // padding: 10px 16px;
  position: relative;
  height: 100vh;
  .content {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // height: 494px;
    // background: url(~@images/bg-code.png) center center no-repeat;
    // background-size: 100% 100%;
  }
  .code-txt {
    width: 294px;
    height: 48px;
    position: absolute;
    top: 110px;
    left: 50%;
    margin-left: -147px;
  }
  .pic-box {
    width: 216px;
    height: 216px;
    position: absolute;
    // padding: 13px;
    box-sizing: border-box;
    top: 200px;
    left: 50%;
    margin-left: -108px;
    // background: url(~@images/code-border.png) center center no-repeat;
    // background-size: 100% 100%;
    img {
      width: 214px;
      height: 214px;
    }
  }
  .footer {
    padding: 0 16px;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
  }
  .van-button--primary {
    font-size: 16px;
  }
}
</style>


