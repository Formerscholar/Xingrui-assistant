<template>
  <div id="StudentDetail">
    <div class="info_title">
      <div class="title">个人信息</div>
      <div class="info_box">
        <el-avatar
          class="max_ava"
          :size="150"
          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/max_ava.png"
        ></el-avatar>
        <div class="right_texts">
          <div class="name">{{ student_data.name }}</div>
          <div class="infolist">
            <div class="item">
              <span class="key">所在校区:</span>
              <span class="val">{{ student_data.school_data ?student_data.school_data.name:"" }}</span>
            </div>
            <div class="item">
              <span class="key">年级班级：</span>
              <span class="val">{{ mapName(student_data.team_data) }}</span>
            </div>
            <div class="item">
              <span class="key">联系方式：</span>
              <span class="val">{{ student_data.mobile }}</span>
            </div>
            <div class="item">
              <span class="key">负责的老师：</span>
              <span class="val">{{ mapName(student_data.user_data) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs_contain">
      <Tab :student_id="id" />
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref,onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { studentDetail } from "@/network/student";
import { getSubjectList } from "@/network/block";
import { setTimerType, Timestamp,formatTimeToStr } from '@/utils'
import Tab from "@/components/StudentDetail/Tab";

export default {
  components:{
    Tab
  },

  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      id:"",
      student_data:{},
      active_name:'first',
    })

    onBeforeMount(() => {
      state.id = route.params.id
    })

    onMounted(() => {
      loadStudentDetail()
    })

    const loadStudentDetail = async () => {
      let {code,data,msg} = await studentDetail({
        id:state.id
      })

      state.student_data = data.info
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function(value, key) {
        str += value.name + ' | '
      })
      str = str.substr(0, str.length - 1)
      return _.trim(str,"|")
    }

    return {
      store,
      ...toRefs(state),
      mapName,
      setTimerType,
      formatTimeToStr
    }
  },
}
</script>

<style scoped lang="scss">
#StudentDetail {
  width: 100%;
  height: 100%;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  position: relative;
  padding: 0 !important;

  .info_title {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
    border-radius: 2px;
    padding: 1.875rem;
    margin-bottom: .9375rem;
    .title {
      font-size: 1rem;
      font-weight: 400;
      color: #222222;
      margin-bottom: 1.875rem;
    }
    .info_box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .max_ava {
        width: 9.375rem;
        height: 9.375rem;
      }
      .right_texts {
        flex: 1;
        width: 100%;
        margin-left: 5.625rem;
        .name {
          font-size: 1.5rem;
          font-weight: 400;
          color: #222222;
          margin-bottom: 1.875rem;
        }
        .infolist {
          display: grid;
          grid-template-columns: repeat(2, 50%);
          grid-template-rows: repeat(2, 40px);
          justify-items: start;
          align-items: center;
        }
      }
    }
  }
  .tabs_contain{
    background: #FFFFFF;
    padding: 1.875rem;

    .page_box {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 4rem;
    }
  }
}
</style>
