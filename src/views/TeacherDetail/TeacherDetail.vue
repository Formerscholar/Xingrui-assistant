<template>
  <div id="TeacherDetail">
    <div class="info_box">
      <div class="title">个人信息</div>
      <div class="grail_box">
        <!-- 头像 -->
        <el-avatar
          class="max_ava"
          :size="150"
          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/max_ava.png"
        ></el-avatar>
        <!-- info -->
        <div class="info">
          <div class="name">{{ teacher_data.name }}</div>
          <!-- 校区 -->
          <div class="campus" style="margin-bottom:.9375rem;">
            <span class="key">所在校区:</span>
            <span class="val">{{ teacher_data.school_data?teacher_data.school_data.name:"" }}</span>
          </div>
          <!-- 联系方式 -->
          <div class="campus">
            <span class="key">联系方式：</span>
            <span class="val">{{ teacher_data.account }}</span>
          </div>
        </div>
        <!-- select -->
        <div class="info">
          <div class="campus" style="margin-bottom:.9375rem;">
            <span class="key">所教科目：</span>
            <span class="val">{{ teacher_data.subject_data?teacher_data.subject_data.title:"" }}</span>
          </div>
          <div class="campus" style="margin-bottom:.9375rem;">
            <span class="key">学生人数：</span>
            <span class="val">{{ teacher_data.student_count }}</span>
          </div>
          <div class="campus">
            <span class="key">负责的班级：</span>
            <span class="val">{{ mapName(teacher_data.team_data) }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 上课记录 -->
    <div class="record">
      <div class="title">上课记录</div>
      <el-table
          ref="multipleTable"
          :data="study_list"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
      >
        <el-table-column label="姓名" width="200">
          <template v-slot="scope">{{ scope.row.student_data.name }}</template>
        </el-table-column>
        <el-table-column prop="user_data" label="负责的老师" width="">
          <template v-slot="scope">{{ scope.row.user_data.name }}</template>
        </el-table-column>
        <el-table-column prop="content" label="上课内容"> </el-table-column>
        <el-table-column prop="mistake_count" label="错题收录"> </el-table-column>
        <el-table-column label="上课时间" width="">
          <template v-slot="scope">
            <template v-if="scope.row.study_time">
              {{ setTimerType(scope.row.study_time * 1000, true) }}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { getTeacherDetail } from "@/network/teacher";
import { setTimerType, Timestamp } from '@/utils'

export default {
  setup() {
    const route = useRoute()
    const state = reactive({
      teacher_id:'',
      teacher_data:{},
      study_list:[],

      page:1,
      limit:10,
      total_page:1,
      count:0,
    })

    onMounted(() => {
      state.teacher_id = route.params.id

      loadData()
    })

    const loadData = async ()=>{
      let {code,data,msg} = await getTeacherDetail({id:state.teacher_id})
      if(!code)
      {
        state.teacher_data = data.info
        state.study_list = data.study_list
        state.count = data.study_list.length
      }
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
      ...toRefs(state),
      mapName,
      setTimerType
    }
  },
}
</script>

<style scoped lang="scss">
#TeacherDetail {
  position: relative;
  padding: 0 !important;

  .info_box {
    height: 15.9375rem;
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
    .grail_box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .max_ava {
        width: 9.375rem;
        height: 9.375rem;
      }
      .info {
        margin-left: 5.625rem;
        flex: 1;
        .name {
          font-size: 1.5rem;
          font-weight: 400;
          color: #222222;
          margin-bottom: 1.875rem;
        }
        .campus .key,
        .campus .val {
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
        }
      }
    }
  }
  .record {
    background: #ffffff;
    box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
    border-radius: 2px;
    padding: 1.875rem;
    .title {
      margin-bottom: 1.875rem;
    }

    .pagina {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
