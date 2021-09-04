<template>
  <div class="page">
    <!-- 上课记录 -->
    <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        style="width: 99%"
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
            {{ formatTimeToStr(scope.row.study_time * 1000, "yyyy-MM-dd hh:mm") }}
          </template>
          <template v-else>-</template>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_box">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="count"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {reactive, ref, onMounted,onUpdated, toRefs} from 'vue'
import storage from '@/utils/storage'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {studentDetailStudy} from '@/network/student'
import {formatTimeToStr} from '@/utils'

export default {
  props: {
    id:{
      type:Number,
      default:0,
    }
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      search_data: {

      },
      condition_data: {

      },
      page: 1,
      count: 0,
      limit: 10,

      list: [],
    })

    onMounted(() => {
      loadData()
    })

    const loadData = async () => {
      let {code,data} = await studentDetailStudy({
        id:props.id
      })

      if(!code)
      {
        state.list = data.list
        state.count = data.count
      }
    }

    return {
      ...toRefs(state),
      formatTimeToStr
    }
  },
}
</script>

<style scoped lang="scss">
.page {
  .page_box{
    text-align: center;
    margin-top: 1rem;
  }
}
</style>
