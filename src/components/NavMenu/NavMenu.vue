<template>
  <div id="NavMenu">
    <el-menu :default-active="default_active" class="el-menu-vertical-demo" router unique-opened ref="menuEl">
      <template v-for="item in menuList" :key="item.id">
        <template v-if="item.child && item.child.length > 0">
          <el-submenu :index="item.id">
            <template  v-slot:title>
              <i :class="['iconfont',item.icon]"></i>
              <span>{{ item.name }}</span>
            </template>
            <template v-for="item2 in item.child" :key="item2.id">
              <el-menu-item :index="item2.route">
                <i :class="['iconfont',item2.icon]"></i>
                <template #title>{{ item2.name }}</template>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.route">
            <i :class="['iconfont',item.icon]"></i>
            <template #title>{{ item.name }}</template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, ref,onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { getMenus } from '@/network/main'
import { treeData } from '@/utils'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      menuList: [],
      menuEl: ref(),
      default_active:'/'
    })

    onBeforeMount(() => {
      getMenuData()
    })

    const getMenuData = async () => {
      const { code, data } = await getMenus()
      if (code == 0) {
        state.menuList = treeData(data)

        data.forEach(item => {
          if(route.path == item.route)
            state.default_active = item.route
        })
      }
    }

    return {
      ...toRefs(state),
      store,
    }
  },
}
</script>

<style scoped lang="scss">
.iconfont{
  color: #485cc8 !important;
}
#NavMenu {
  width: 13.125rem;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  left: 0;

  .logo {
    display: block;
    margin: 0.625rem auto;
    cursor: pointer;
  }
  .el-menu {
    flex: 1;
    width: 100%;
    height: 100%;
    border-right: 0 solid #fff;
    .iconfont{
      font-size: 26px !important;
    }
  }
}
</style>
