<template>
  <div class="main">
    <div class="box search_box">
      <el-form inline>
        <el-form-item style="margin-bottom: 0 !important;">
          <el-select v-model="search_data.team_id" placeholder="请选择班级">
            <el-option :label="item.name" :value="item.id" v-for="(item,index) in condition.team"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0 !important;">
          <el-input v-model="search_data.keyword" placeholder="学生姓名或手机号码"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0 !important;">
          <el-button @click="doSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box student_box">
      <el-table
          ref="multipleTable"
          :data="student_list"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55" :disabled="true">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="200"> </el-table-column>
        <el-table-column label="性别" width="100">
          <template v-slot="scope">{{
              scope.row.sex == 1 ? '男' : '女'
            }}</template>
        </el-table-column>
        <el-table-column prop="school_data" label="所在校区" width="">
          <template v-slot="scope">{{
              scope.row.school_data.name
            }}</template>
        </el-table-column>
        <el-table-column label="班级名称" width="">
          <template v-slot="scope">{{ mapName(scope.row.team_data) }}</template>
        </el-table-column>
        <el-table-column  label="负责的老师" width="">
          <template v-slot="scope">{{ mapName(scope.row.user_data) }}</template>
        </el-table-column>
        <el-table-column prop="mobile" label="家长联系方式" width="">
        </el-table-column>
        <el-table-column label="添加时间" width="">
          <template v-slot="scope">{{
              setTimerType(scope.row.add_time * 1000, true)
            }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box page_box">
      <el-pagination
          class="pagina"
          background
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          layout="prev, pager, next, jumper"
          :total="count"
      >
      </el-pagination>
    </div>
    <div class="box footer">
      <el-button @click="onCLoseClick">取 消</el-button>
      <el-button type="primary" @click="onSubmitClick">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {getStudent,addMistake} from '@/network/student'
import {useRouter} from "vue-router";
import {nextTick, onMounted, reactive, ref, toRefs, watch} from "vue";
import {useStore} from "vuex";
import { setTimerType, Timestamp } from '@/utils'
import { ElMessage } from 'element-plus'

export default {
  props:{
    question_id: {
      type: Number,
      default: 0,
    }
  },
  emits: ["close"],
  components: {

  },
  setup(props,context) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      search_data: {
        team_id: '',
        keyword: '',
      },
      condition: {
        team: []
      },
      student_list: [],
      multipleSelection: [],

      page: 1,
      count: 0,
      limit: 10,
    })

    onMounted(() => {

    })

    const handleSelectionChange = (val) => {
      state.multipleSelection = val;
    }
    const handleCurrentChange = (page)=>{
      this.page = page
      loadStudent()
    }
    const loadStudent = async() => {
      let params = {
        question_id:props.question_id,
        team_id:state.search_data.team_id,
        keyword: state.search_data.keyword,
        page:state.page,
        limit:state.limit
      }
      let {code,data} = await getStudent(params)
      if(!code)
      {
        state.count = data.count
        state.student_list = data.list
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

    const doSearch = () => {
      state.page = 1
      loadStudent()
    }

    const onCLoseClick = () => {
      context.emit("close")
    }

    const onSubmitClick = () => {
      doAddMistake()
    }

    const doAddMistake = async () => {
      let params = {
        question_id : props.question_id,
        student_ids : []
      }
      state.multipleSelection.map(item => {
        params.student_ids.push(item.id)
      })

      let {code} = await addMistake(params)
      if(!code)
      {
        ElMessage.success({
          message: '收录错题保存成功',
          type: 'success'
        })
        context.emit("close")
      }
    }

    return {
      ...toRefs(state),
      handleSelectionChange,
      handleCurrentChange,
      loadStudent,
      mapName,
      setTimerType,
      doSearch,
      onCLoseClick,
      onSubmitClick
    }
  },
}

</script>

<style scoped lang="scss">
.main {
  .box{
    display: block;
    margin-bottom: 1rem;
  }
  .page_box{
    text-align: center;
  }
  .footer{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0;
  }
}
</style>
