<template>
  <div id="Login">
    <div class="title">昕睿培优助手</div>
    <div class="form">
      <!-- 选择 -->
      <div class="select_box">
        <div
          v-for="(item, idx) in state.selectText"
          :key="idx"
          class="select_item"
          :style="{
            borderColor: state.current === idx ? '#6948B5' : 'transparent',
          }"
          @click="selectClick(idx)"
        >
          {{ item }}
        </div>
      </div>
      <!-- 显示内容 -->
      <div class="display_Con">
        <div v-show="!state.current">
          <!-- 账号 -->
          <el-input
            class="inpItem"
            placeholder="请输入账号"
            v-model="state.username"
          >
            <template v-slot:prefix>
              <img
                src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/username.png"
                alt="username"
              />
            </template>
          </el-input>
          <el-input
            class="inpItem"
            placeholder="请输入密码"
            v-model="state.password"
            show-password
          >
            <template v-slot:prefix>
              <img
                src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/password.png"
                alt="password"
              />
            </template>
          </el-input>
          <!-- 密码操作 -->
          <div class="passwordoper">
            <!-- 记住密码 -->
            <el-checkbox v-model="passed" label="passed">记住密码</el-checkbox>
            <!-- 忘记密码 -->
            <span>忘记密码？</span>
          </div>
          <el-button class="loginbtn" type="primary" @click="loginClick"
            >登录</el-button
          >
        </div>
        <div class="qr_box" v-show="state.current">
          <!-- 二维码 -->
          <div id="qr_warp"></div>
          <div class="tip_text">请使用微信扫码登录</div>
        </div>
      </div>
    </div>
    <div class="their">
      版权所有 扬州骐骥信息科技有限公司
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { callBackUrl, appid } from '@/utils'
import storage from '@/utils/storage'
import {useRoute, useRouter} from 'vue-router'
import { getLogin } from '@/network/login'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      current: 0,
      // , '扫码登录'
      selectText: ['账号登录'],
      username: '',
      password: '',
    })

    const passed = ref(false)

    onMounted(() => {
      // window.WxLogin({
      //   self_redirect: true,
      //   id: 'qr_warp',
      //   appid: appid,
      //   scope: 'snsapi_login',
      //   redirect_uri: callBackUrl,
      //   state: Math.ceil(Math.random() * 1000),
      //   href: '',
      // })
    })

    const selectClick = (idx) => {
      state.current = idx
    }

    const loginClick = async () => {
      const { code, data, msg } = await getLogin({
        account: state.username,
        password: state.password,
      })
      if (!code) {
        ElMessage.success({
          message: msg,
          type: 'success',
        })
        if(route.query.redirect)
          router.push(route.query.redirect)
        else
          router.push('/')
      }
    }

    return {
      state,
      passed,
      selectClick,
      loginClick,
    }
  },
}
</script>

<style scoped lang="scss">
#Login {
  background: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/login_bg.png')
    no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 3.75rem 0;
  .title {
    font-size: 3.75rem;
    font-weight: 400;
    color: #ffffff;
    text-shadow: 0px 1px 5px rgba(16, 16, 16, 0.96);
  }
  .form {
    width: 30.25rem;
    height: 476px;
    background: linear-gradient(-34deg, #eef1fb, #eef0fa);
    .select_box {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: 3.375rem;
      .select_item {
        font-size: 1.5rem;
        font-weight: 400;
        color: #6948b5;
        padding: 0 1.6875rem;
        margin-right: 5rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .display_Con {
      margin: 0 3.125rem;
      margin-top: 3.6875rem;
      padding: 0 2.1875rem;
      .inpItem {
        margin-bottom: 1.875rem;

        &::v-deep(.el-input__inner) {
          height: 2.5rem;
          border: 1px solid #6948b5;
          border-radius: 0.375rem;
          padding-left: 3.125rem;
        }
        &::v-deep(.el-input__prefix) {
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 1.125rem;
            height: 1.25rem;
            margin-left: 1rem;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
      .passwordoper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::v-deep(.el-checkbox__label) {
          font-size: 0.875rem;
          font-weight: 400;
          color: #6948b5;
        }

        &::v-deep(.el-checkbox__inner:hover) {
          border-color: #6948b5;
        }

        &::v-deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
          background-color: #6948b5;
          border-color: #6948b5;
        }

        span {
          font-size: 0.875rem;
          font-weight: bold;
          color: #6948b5;
          cursor: pointer;
        }
      }
      .loginbtn {
        width: 100%;
        height: 2.5rem;
        border-radius: 0.375rem;
        margin-top: 3.125rem;
      }
      .qr_box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: -1.5rem;
        #qr_warp {
          width: 15.625rem;
          height: 15.625rem;
          background-color: #fff;
          overflow: hidden;
          position: relative;

          &::v-deep(iframe) {
            position: absolute;
            top: -62px;
            left: -26px;
          }
          &::v-deep(.qrcode) {
            width: 230px !important;
          }
        }
        .tip_text {
          font-size: 1rem;
          font-weight: 400;
          color: #6948b5;
          margin-top: 2.5625rem;
        }
      }
    }
  }
  .their {
    font-size: 1rem;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
