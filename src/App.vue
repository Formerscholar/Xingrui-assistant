<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue'

import { useStore } from 'vuex'

import storage from '@/utils/storage'

export default {
  setup() {
    const store = useStore()

    onMounted(() => {

    })
  },
}
</script>

<style lang="scss">
#app {

}
</style>
