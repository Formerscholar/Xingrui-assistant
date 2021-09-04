<template>
  <div id="Header">
    <img
      class="logo"
      src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/logo.png"
      alt="logo"
    />
<!--    <div class="avatar_box" @click="avaClick">-->
<!--      <el-avatar-->
<!--        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/avatar_icon.png"-->
<!--      ></el-avatar>-->
<!--      <div class="name">李krice</div>-->
<!--      <el-badge is-dot class="item">-->
<!--        <img-->
<!--          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/hint.png"-->
<!--          alt="hint"-->
<!--        />-->
<!--      </el-badge>-->
<!--    </div>-->
    <el-dropdown @command="onDropdownClick">
      <span class="el-dropdown-link">
        <el-avatar
            :src="user_info.avatar?user_info.avatar:default_avatar"
        ></el-avatar>
        <span class="name">{{ user_info.name }}</span>
        <i class="el-icon-arrow-down el-icon-s-tools"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item icon="" command="my">个人信息</el-dropdown-item>
<!--          <el-dropdown-item icon="" command="point">积分</el-dropdown-item>-->
          <el-dropdown-item icon="" command="password">修改密码</el-dropdown-item>
          <el-dropdown-item icon="" command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
import {reactive, toRefs,onMounted,onBeforeMount} from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { useStore } from 'vuex'
import {logout} from '@/network/user'
import {delCookie,getCookie} from '@/utils'
import {getUserInfo} from '@/network/user'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      default_avatar : 'https://aictb.oss-cn-shanghai.aliyuncs.com/straight/avatar_icon.png',
      user_info:{
        avatar:"",
        name:"",
      },
    })

    onBeforeMount(() => {
      loadUserInfo()
    })

    const loadUserInfo = async () => {
      let {code,data} = await getUserInfo()
      if(!code)
      {
        state.user_info.avatar = data.avatar
        state.user_info.name = data.name

        store.commit('SetUserInfo', data)
      }
    }

    const menuClick = (item) => {
      router.push(item.path)
    }
    const avaClick = () => {
      router.push('/personal')
    }

    const onDropdownClick = (e) => {
      if(e == 'my')
      {
        router.push('/personal')
      }
      else if(e == "point")
      {
        router.push('/point')
      }
      else if(e == 'password')
      {
        router.push('/password')
      }
      else if(e == 'logout')
      {
        delCookie("user_sign")
        delCookie("user")
        doLogout()
      }
    }

    const doLogout = async () => {
      let {code} = await logout()
      if(!code)
      {
        router.push('/login')
      }
    }

    return {
      ...toRefs(state),
      store,
      menuClick,
      avaClick,
      onDropdownClick
    }
  },
}
</script>

<style scoped lang="scss">
#Header {
  width: 100%;
  height: 3.125rem;
  background: #f7f9fb;
  box-shadow: 0px 2px 1px 0px rgba(0, 0, 0, 0.02);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.25rem;
  position: fixed;
  top: 0;
  z-index: 11;
  .logo {
    height: 100%;
  }
  //.avatar_box {
  //  height: 100%;
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //  cursor: pointer;
  //  .name {
  //    margin: 0 0.8125rem;
  //  }
  //}

  .el-dropdown-link{
    display: flex;
    align-items: center;
    .name{
      margin: 0 .3rem;
    }
  }
}
</style>
