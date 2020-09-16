<template>
  <div class="cmp-person-form">
    <van-cell-group>
      <!-- <van-cell title="预约诊所" :value="orgName"/> -->
      <van-field
        input-align="left"
        error-message-align="right"
        v-model="form.name"
        label="姓名"
        placeholder="请填写真实姓名"
        name="name"
        v-validate="'required|max:10'"
        :error-message="errors.first('name')"
      />

      <van-field
        input-align="left"
        error-message-align="right"
        v-model="form.phone"
        label="手机号"
        placeholder="请填写真实手机号"
        name="phone"
        v-validate="'required|phone'"
        :error-message="errors.first('phone')"
      />

      <van-field
        input-align="left"
        right-icon="arrow"
        readonly
        clickable
        name="picker"
        :value="cardItem.name"
        label="证件类型"
        placeholder="点击选择"
        @click="showPickerCard = true"
      />
      <van-popup v-model="showPickerCard" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirm"
          @cancel="showPickerCard = false"
        />
      </van-popup>

      <van-field
        v-show="cardItem.value === '1'"
        input-align="left"
        error-message-align="right"
        v-model="form.identificationNumber"
        label="证件号码"
        placeholder="请输入真实有效证件号码"
        name="card"
        v-validate="cardItem.value === '1' ?'required|card':(cardItem.value === '2'?'required|postCard':'required')"
        :error-message="cardItem.value === '1' ?errors.first('card'):(cardItem.value === '2'?errors.first('postCard'):errors.first('gatCard'))"
      />

      <van-field
        v-show="cardItem.value === '2'"
        input-align="left"
        error-message-align="right"
        v-model="form.identificationNumber"
        label="证件号码"
        placeholder="请输入真实有效证件号码"
        name="postCard"
        v-validate="cardItem.value === '1' ?'required|card':(cardItem.value === '2'?'required|postCard':'required')"
        :error-message="cardItem.value === '1' ?errors.first('card'):(cardItem.value === '2'?errors.first('postCard'):errors.first('gatCard'))"
      />

      <van-field
        v-show="cardItem.value === '3'"
        input-align="left"
        error-message-align="right"
        v-model="form.identificationNumber"
        label="证件号码"
        placeholder="请输入真实有效证件号码"
        name="gatCard"
        v-validate="cardItem.value === '1' ?'required|card':(cardItem.value === '2'?'required|postCard':'required')"
        :error-message="cardItem.value === '1' ?errors.first('card'):(cardItem.value === '2'?errors.first('postCard'):errors.first('gatCard'))"
      />
    </van-cell-group>

    <div class="footer">
      <van-button round type="primary" size block @click="handleAdd">{{editIndexStr?'编辑':'添加'}}</van-button>
    </div>
  </div>
</template>

<script>
import {
  Icon,
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
      optionList: [
        {
          name: '身份证',
          value: '1'
        },
        {
          name: '护照',
          value: '2'
        },
        {
          name: '港澳台通行证',
          value: '3'
        }
      ],
      columns: ['身份证', '护照', '港澳台通行证'],
      cardItem: {
        name: '身份证',
        value: '1'
      },
      showPickerCard: false,
      form: {
        name: '',
        phone: '',
        identificationNumber: ''
        // name: 'aa',
        // phone: '13567879802',
        // identificationNumber: '421003199908203541'
      }
    }
  },
  methods: {
    onConfirm(value, index) {
      this.cardItem = this.optionList[index]
      this.showPickerCard = false
      this.form.identificationNumber = ''
    },
    handleAdd() {
      this.$validator.validateAll().then(result => {
        if (result) {
          let hasItem = this.personList.find(
            item => item.identificationNumber === this.form.identificationNumber
          )
          if (!hasItem) {
            if (!this.editIndexStr) {
              // 新增
              this.goOrderPage('add')
            } else {
              // 编辑
              this.goOrderPage('edit')
            }
          } else {
            this.$toast('该身份证号已在参观人信息中，每个身份证号只能预约 1 人')
          }
        }
      })
    },
    goOrderPage(type) {
      this.form.identificationType = this.cardItem.value
      this.$http
        .post('/AppointOrder/checkVisitor.do', {
          // name: '', //int	姓名（限制长度10）
          // phone: '', //string	手机号（限制长度11）
          // identificationNumber: '', //string	证件号码
          // identificationType: this.cardItem.value, //string	证件类型 1-身份证 2-护照
          ...this.form,
          appointEntryTime: this.$route.query.time,
          orgId: this.$route.query.id,
          userId: this.$store.state.user.userId,
          token: this.$store.state.user.token
        })
        .then(res => {
          if (res.success === 1) {
            if (type === 'add') {
              this.personList.push({ ...this.form })
              this.$store.dispatch('app/setPersonList', this.personList)
            } else if (type === 'edit') {
              this.personList[Number(this.editIndexStr)] = { ...this.form }
              this.$store.dispatch('app/setPersonList', this.personList)
            }
            this.$router.push({
              path: '/home/order',
              query: {
                id: this.$route.query.id,
                time: this.$route.query.time,
                settingTimesId: this.$route.query.settingTimesId,
                timesStr: this.$route.query.timesStr,
                museumName: this.$route.query.museumName
              }
            })
          } else {
            this.$toast(res.error.message)
          }
        })
    }
  },
  created() {
    if (this.editIndexStr) {
      this.form = { ...this.personList[Number(this.editIndexStr)] }
    }
  }
}
</script>

<style lang="less" scoped>
.cmp-person-form {
  .footer {
    padding: 0 16px;
    margin-top: 30px;
  }
  .van-cell {
    color: @color2;
    font-size: 14px;
  }
}
</style>


