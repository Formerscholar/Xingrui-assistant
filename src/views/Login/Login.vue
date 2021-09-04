<template>
  <div class="page">
    <div class="logo"></div>
    <div class="login_box">
      <div class="wrapp">
        <h4>用户登录</h4>
        <el-form>
          <el-form-item>
            <el-input type="text" prefix-icon="el-icon-user" v-model="state.username" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item>
            <el-input type="text" prefix-icon="el-icon-unlock" v-model="state.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item class="inline">
            <el-checkbox label="记住密码" v-model="passed"></el-checkbox>
            <el-link :underline="false" href="javascript:void(0);">忘记密码</el-link>
          </el-form-item>
          <el-form-item>
            <el-button round class="login_btn" @click="loginClick">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="reg">
          还没有账号？<el-link :underline="false" href="javascript:void(0);">去注册</el-link>
        </div>
      </div>
    </div>
    <div class="copyright">Copyright © 2021 扬州骐骥信息科技有限公司版权所有 苏ICP备20016245号</div>
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
.page{
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: url("../../assets/img/login/bg.png") no-repeat right center;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .logo{
    background: url("../../assets/img/login/logo.png") no-repeat;
    background-size: contain;
    width: 14.8125rem;
    height: 4.3125rem;
    position: absolute;
    top: 3.125rem;
    left: 5.625rem;
  }
  .login_box{
    position: absolute;
    top: 50%;
    left: 9.5rem;
    width: 28rem;
    transform: translateY(-50%);
    .wrapp{
      position: relative;
      h4{
        color: #485ECB;
        font-size: 2.5rem;
        text-align: center;
        font-weight: normal;
        margin-bottom: 4.1875rem;
      }
      .el-link{
        color: #999999;
      }
      .el-link--default:hover{
        color: #485ECB !important;
      }
      .el-form{
        ::v-deep(.el-input__inner){
          border: 0 none;
          border-bottom: 1px solid #ccc;
          border-radius: 0px;
        }
        ::v-deep(.el-input__inner):focus {
          border-bottom: 1px solid #485ECB;
        }
        .inline{
          .el-link{
            float: right;
          }
        }
        .login_btn{
          color: #FFFFFF !important;
          width: 100%;
          border: 0;
          background: linear-gradient(
                  to bottom,
                  rgba(red(#B0C9FF), green(#B0C9FF), blue(#B0C9FF), 1),
                  rgba(red(#485ECB), green(#485ECB), blue(#485ECB), 1)
          );
        }
      }
      .reg{
        text-align: center;
        margin-top: 5rem;
        .el-link{
          color: #485ECB;
        }
      }
    }
  }
  .copyright{
    background: #3B3B3B;
    font-size: 0.625rem;
    text-align: center;
    color: #FFFFFF;
    padding: 0.25rem 0;
  }
}
</style>
