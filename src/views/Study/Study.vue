<template>
  <div id="Study">
    <div class="box">
      <el-button type="primary" @click="handleAdd">新增上课记录</el-button>
    </div>
    <div class="box search_box">
      <el-form inline>
        <el-form-item>
          <el-date-picker
              v-model="search_data.times"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="输入学生姓名"
              v-model="search_data.keyword"
          >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box">
      <el-table
          ref="multipleTable"
          :data="table_data"
          tooltip-effect="dark"
          style="width: 99%;"
          @selection-change="handleSelectionChange"
      >
        <el-table-column prop="student_name" label="姓名" width="200"> </el-table-column>
        <el-table-column label="课程" width="">
          <template v-slot="scope">
            {{ scope.row.course_data.name }}
          </template>
        </el-table-column>
        <el-table-column label="负责的老师" width="">
          <template v-slot="scope">
            {{ scope.row.user_data.name }}
          </template>
        </el-table-column>
        <el-table-column prop="content" label="上课内容" width=""></el-table-column>
        <el-table-column prop="mistake_count" label="错题收录" width=""></el-table-column>
        <el-table-column label="上课时间" width="">
          <template v-slot="scope">
            <template v-if="scope.row.study_time">
              {{
                formatTimeToStr(scope.row.study_time * 1000, "yyyy-MM-dd hh:mm")
              }}
            </template>
            <template v-else>-</template>
          </template>
        </el-table-column>
        <el-table-column align="right">
          <template v-slot="scope">
            <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                      @click="handleEdit(scope.$index, scope.row)"
                      src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png">
            </el-image>
            <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                      @click="showConfirm(scope.$index, scope.row)"
                      src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png">
            </el-image>
            <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                      @click="handleDetail(scope.$index, scope.row)"
                      src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/detail_icon.png">
            </el-image>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        class="pagina"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :page-count="total_page"
    >
    </el-pagination>
    <!-- 删除confirm -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="40.625rem" center>
      <span>确定删除，继续此操作？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="doDelete">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from 'element-plus'
import { getStudyList,deleteStudy } from '@/network/Study'
import { setTimerType, Timestamp,formatTimeToStr } from '@/utils'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      search_data:{
        times:"",
        keyword:""
      },
      table_data:[],

      page:1,
      limit:10,
      total_page:1,
      count:0,

      dialogTitle:'',
      dialogVisible:false,

      confirmShow:false,
      confirm_data: {
        id:0
      },
    })

    onMounted(() => {
      loadStudyList()
    })

    const loadStudyList = async () => {
      let params = {
        keyword: state.search_data.keyword,
        page:state.page,
        limit:state.limit
      }
      if(_.isArray(state.search_data.times))
      {
        params.start_time = Timestamp(state.search_data.times[0])
        params.end_time = Timestamp(state.search_data.times[1])
      }

      const { code, data, msg } = await getStudyList(params)
      if(!code)
      {
        state.table_data = data.list
        state.total_page = data.total_page
      }
    }

    const doSearch = async () => {
      await loadStudyList()
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function(value, key) {
        str += value.name + '|'
      })
      str = str.substr(0, str.length - 1)
      return str
    }

    const handleAdd = (index, row) => {
      router.push('/study/add/')
    }

    const handleEdit = (index, row) => {
      router.push('/study/edit/' + row.id)
    }

    const handleDetail = (index, row) => {
      router.push(`/study/detail/${row.id}`)
    }

    const showConfirm = (index,data) => {
      state.confirmShow = true
      state.confirm_data.id = data.id
    }
    const doDelete = async () => {
      let {code} = await deleteStudy({
        id:state.confirm_data.id
      })
      if(!code)
      {
        state.confirmShow = false
        loadStudyList()
      }
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }
    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadStudyList()
    },300)


    return {
      ...toRefs(state),
      store,
      handleAdd,
      handleEdit,
      showConfirm,
      doDelete,
      handleDetail,
      setTimerType,
      doSearch,
      handleSizeChange,
      handleCurrentChange,
      formatTimeToStr
    }
  },
}
</script>

<style scoped lang="scss">
#Study {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #FFFFFF;
  .box{
    margin-bottom: 1rem;
    background: #FFFFFF;
  }
  .search_box{
    .el-form--inline{
      .el-form-item{
        margin-bottom: 0 !important;
      }
    }
  }

  .pagina {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
