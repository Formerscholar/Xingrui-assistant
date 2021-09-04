<template>
  <div class="page">
    <el-table
        ref="multipleTable"
        :data="list"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        style="width: 99%"
    >
      <el-table-column label="姓名" width="200">
        <template v-slot="scope">{{scope.row.student_data.name}}</template>
      </el-table-column>
      <el-table-column label="课程" width="">
        <template v-slot="scope">{{scope.row.course_data.name}}</template>
      </el-table-column>
      <el-table-column label="购买课时" width="">
        <template v-slot="scope">{{ scope.row.buy_hour }}节</template>
      </el-table-column>
      <el-table-column label="金额" width="">
        <template v-slot="scope">{{ scope.row.pay_money }}</template>
      </el-table-column>
      <el-table-column label="已使用课时" width="">
        <template v-slot="scope">{{ scope.row.used_hour }}节</template>
      </el-table-column>
      <el-table-column label="操作人" width="">
        <template v-slot="scope">{{ scope.row.user_data.name }}</template>
      </el-table-column>
      <el-table-column label="添加日期" width="">
        <template v-slot="scope">{{ formatTimeToStr(scope.row.add_time * 1000, "yyyy-MM-dd") }}</template>
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
import {studentDetailBuy} from '@/network/student'
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
      let {code,data} = await studentDetailBuy({
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
