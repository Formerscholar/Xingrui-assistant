<template>
  <div class="main">
    <el-dialog title="添加学生" v-model="dialog_visible" top="5vh" width="80rem" center @open="onDialogOpen" @close="onDialogClose">
      <div class="box search_box">
        <el-form inline>
          <el-form-item style="margin-bottom: 0 !important;">
            <el-select v-model="search_data.school_id" placeholder="请选择校区" clearable>
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in condition.school" :key="index"></el-option>
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
              width="55" :disabled="true" :selectable="isDisabled">
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
    </el-dialog>
  </div>
</template>

<script>
import {getStudent} from '@/network/student'
import {useRouter} from "vue-router";
import {nextTick, onMounted, reactive, ref, toRefs, watch,computed} from "vue";
import {useStore} from "vuex";
import { setTimerType, Timestamp } from '@/utils'
import { ElMessage } from 'element-plus'
import {getSchoolList, getTeamList} from "../../network/block";
import {addToTeam} from '@/network/team'

export default {
  props:{
    visible: Boolean,
    filter_team_id: Number
  },
  emits: ["close"],
  components: {

  },
  setup(props,context) {
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      dialog_visible:false,

      search_data: {
        school_id:'',
        team_id: [],
        keyword: '',
      },
      condition: {
        school:[],
        team: []
      },
      student_list: [],
      multipleSelection: [],

      page: 1,
      count: 0,
      limit: 10,
    })

    onMounted(() => {
      state.dialog_visible = props.visible
      state.search_data.school_id = store.state.userInfo.school_id
    })

    watch(
        () => props.visible,
        (data, prevdata) => {
          state.dialog_visible = props.visible
        }
    )

    const handleSelectionChange = (val) => {
      state.multipleSelection = val;
    }
    const handleCurrentChange = (page)=>{
      state.page = page
      loadStudent()
    }
    const loadStudent = async() => {
      let params = {
        filter_team_id:props.filter_team_id,
        school_id:state.search_data.school_id,
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

    const loadCondition = async () => {
      var {code,data} = await getSchoolList()
      if(!code)
      {
        state.condition.school = data
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
      state.dialog_visible = false
    }

    const onSubmitClick = () => {
      doAddStudent()
    }

    const doAddStudent = async () => {
      let params = {
        add_team_id : props.filter_team_id,
        student_ids : []
      }
      state.multipleSelection.map(item => {
        params.student_ids.push(item.id)
      })

      if(!params.student_ids.length)
      {
        ElMessage.error("请选择要添加学生")
        return
      }

      let {code} = await addToTeam(params)
      if(!code)
      {
        ElMessage.success({
          message: '添加学生成功',
          type: 'success'
        })
        state.dialog_visible = false
        context.emit("added")
      }
    }

    const onDialogOpen = () => {
      state.search_data.team_id = []
      state.search_data.keyword = ""
      loadStudent()
      loadCondition()
    }

    const onDialogClose = () => {
      context.emit("close")
    }

    const isDisabled = (row,index) => {
      return row.has_add ? false:true
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
      onSubmitClick,
      onDialogOpen,
      onDialogClose,
      isDisabled
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
