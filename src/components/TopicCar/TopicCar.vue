<template>
  <div id="TopicCar">
    <div class="left">
      <img
        class="current_icon"
        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/current_icon.png"
        alt="current_icon"
      />
      <div class="counts">
        <img
          class="car_icon"
          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/car_icon.png"
          alt="car_icon"
        />
        <p>试题篮</p>
        <div class="current_num">
          {{ questionData.totle_count }}
        </div>
      </div>
      <img
        class="info_icon"
        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/info_icon.png"
        alt="info_icon"
        style="margin-bottom:1.25rem;"
      />
      <img
        class="top_icon"
        src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/top_icon.png"
        alt="top_icon"
      />
    </div>
    <div class="right">
      <div class="title_count">
        试题总量（<span>{{ questionData.totle_count }}</span
        >）
      </div>
      <div
        class="content_item"
        v-for="(item, idx) in questionData.list"
        :key="idx"
      >
        <div class="left_title">{{ item.name }}</div>
        <div class="right_count">
          <div class="text">
            <span>{{ item.count }}</span
            >题
          </div>
          <img
            class="del_icon"
            src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/del_icon.png"
            alt="del_icon"
          />
        </div>
      </div>
      <div class="clear_text" @click="clearAll">清空试题</div>
      <el-button class="handleBtn" type="primary" @click="preview"
        >试卷预览</el-button
      >
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onUpdated } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getbasketDetail, getbasketDetailAll } from '@/network/knowledge'

export default {
  setup() {
    const state = reactive({
      questionData: {},
    })
    const store = useStore()
    const router = useRouter()

    onMounted(() => {
      getbasketDetailData()
    })

    const getbasketDetailData = async () => {
      const { code, data } = await getbasketDetail()
      if (code == 0) {
        state.questionData = data
      }
    }

    const clearAll = async () => {
      const { code } = await getbasketDetailAll()
      if (code == 0) {
        getbasketDetailData()
      }
    }

    const preview = () => {
      router.push('/preview_paper')
    }

    return {
      store,
      ...toRefs(state),
      clearAll,
      preview,
      getbasketDetailData
    }
  },
}
</script>

<style scoped lang="scss">
#TopicCar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  
  &:hover .right,
  &:focus .right {
    display: block;
  }

  .left {
    width: 3.125rem;
    height: 100%;
    background: #f7f9fb;
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .counts {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin: 1.25rem 0.625rem;
      padding: 1.25rem 0;
      border-top: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      p {
        margin: 0.9375rem auto;
        width: 1.25rem;
        line-height: 1.5rem;
        text-align: center;
      }
      .current_num {
        width: 1.625rem;
        height: 1.625rem;
        line-height: 1.625rem;
        background: #485ecb;
        color: #fff;
        border-radius: 50%;
        text-align: center;
      }
    }
  }
  .right {
    display: none;
    height: 100%;
    width: 15.25rem;
    padding: 1.875rem 0.9375rem;
    background: #ffffff;
    .title_count {
      font-size: 1rem;
      font-weight: 400;
      color: #222222;
      margin-bottom: 1.25rem;
      span {
        color: #485ecb;
      }
    }
    .content_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 2.625rem;
      border: 1px solid #e5e5e5;
      border-radius: 6px;
      padding: 0.875rem;
      margin-bottom: 0.625rem;

      .left_title {
        font-size: 0.875rem;
        font-weight: 400;
        color: #222222;
      }
      .right_count {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .text {
          font-size: 0.875rem;
          font-weight: 400;
          color: #222;
          margin-right: 0.5rem;
          span {
            color: #485ecb;
          }
        }
      }
    }
    .clear_text {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 400;
      color: #999999;
      margin-top: 1.25rem;
      cursor: pointer;
    }
    .handleBtn {
      width: 13.375rem;
      height: 2.625rem;
      background: #485ecb;
      border-color: #485ecb;
      border-radius: 0.375rem;
      margin-top: 1.25rem;
    }
  }
}
</style>
