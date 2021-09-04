<template>
  <div id="home">
    <Header />

    <div class="comtent_warp">
      <NavMenu />
      <div class="bg">
        <router-view class="setHight" />
      </div>
    </div>
    <!-- <Footer /> -->
  </div>
</template>

<script>
import { reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import NavMenu from '@/components/NavMenu/NavMenu'
import {
  getTeamList,
  getSubjectList,
  getSchoolList,
  getTeacherList,
  getArea,
} from '@/network/main'

export default {
  name: 'Home',
  components: {
    Header,
    Footer,
    NavMenu,
  },
  setup(props, context) {
    const store = useStore()

    onBeforeMount(() => {

    })

    return {}
  },
}
</script>

<style lang="scss" scoped>
#home {
  height: 100vh;
  .comtent_warp {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow-x: hidden;
    overflow-y: auto;
    min-height: calc(100vh - 5rem);
    padding-top: 3.125rem;
    padding-left: 13.125rem;
    .bg {
      flex: 1;
      padding: 0.9375rem;
      background-color: #f0f2f5;
      min-height: calc(100vh - 5rem);
      .setHight {
        min-height: calc(100vh - 5rem);
        width: 100%;
        padding: 1.875rem;
      }
    }
  }
}
</style>
