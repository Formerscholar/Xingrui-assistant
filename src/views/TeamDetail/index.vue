<template>
  <div class="page">
    <AddStudent :visible="dialog_visiable" title="新增学生" :filter_team_id="team_id" @close="onDialogClose" @added="onDialogAdded" />
    <div class="box detail">
      <div class="title">班级详情</div>
      <div class="list_info">
        <ul>
          <li><span>班级名称:</span><span>{{ detail.name }}</span></li>
          <li><span>所在校区:</span><span>{{ detail.school_name }}</span></li>
          <li><span>课程:</span><span>{{ detail.course_name }}</span></li>
          <li><span>上课老师:</span><span>{{ detail.teachers }}</span></li>
          <li><span>创建时间:</span><span>{{ detail.add_time }}</span></li>
        </ul>
      </div>
    </div>
    <div class="box list_box">
      <div style="margin-bottom: 22px;"><el-button-group><el-button type="primary" @click="handleAddStudent">添加学生</el-button></el-button-group></div>
      <div class="list">
        <el-table
            :data="list"
            tooltip-effect="dark"
            style="width: 99%;"
            @selection-change="handleSelectionChange"
        >
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
            <template v-slot="scope">{{ mapKey(scope.row.team_data,'name') }}</template>
          </el-table-column>
          <el-table-column  label="负责的老师" width="">
            <template v-slot="scope">{{ mapKey(scope.row.user_data,'name') }}</template>
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
      <div class="pagination">
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
  </div>
</template>

<script>
import {reactive, ref, onMounted, toRefs,onBeforeMount} from 'vue'
import storage from '@/utils/storage'
import {useRouter,useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {detailTeam,detailTeamStudentList} from '@/network/team'
import {setTimerType} from '@/utils'
import AddStudent from "../../components/TeamDetail/AddStudent";

export default {
  components:{
    AddStudent
  },
  props: {},
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    const state = reactive({
      team_id:'',

      page: 1,
      count: 0,
      limit: 10,

      list: [],
      detail_origin:{},
      detail:{
        name:'',
        school_name:'',
        course_name:'',
        teachers:'',
        add_time:'',
      },

      dialog_visiable:false
    })

    onBeforeMount(() => {
      state.team_id = route.params.id
    })

    onMounted(() => {
      loadData()
    })

    const loadData = async () => {
      let {code,data} = await detailTeam({
        id:state.team_id,
      })
      if(!code)
      {
        state.detail_origin = data
        renderDetail()

        await loadStudent()
      }
    }

    const renderDetail = () => {
      state.detail.name = state.detail_origin.name
      state.detail.school_name = state.detail_origin.school_data.name
      state.detail.course_name = state.detail_origin.course_data.name
      state.detail.teachers = mapKey(state.detail_origin.user_data,'name')
      state.detail.add_time = setTimerType(state.detail_origin.add_time*1000)
    }

    const loadStudent = async () => {
      let {code,data} = await detailTeamStudentList({
        id:state.team_id,
        page:state.page
      })
      if(!code)
      {
        state.list = data.list
        state.count = data.count
      }
    }

    const mapKey = (obj,key) => {
      let re = []
      _.forEach(obj, item => {
        if(_.has(item,key))
          re.push(item[key])
      })
      return re.join(" | ")
    }

    const handleSizeChange = () => {

    }

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadData()
    },300)

    const handleAddStudent = () => {
      state.dialog_visiable = true
    }

    const onDialogClose = () => {
      state.dialog_visiable = false
    }
    const onDialogAdded = () => {
      state.dialog_visiable = false
      loadData()
    }

    return {
      ...toRefs(state),
      handleSizeChange,
      handleCurrentChange,
      mapKey,
      setTimerType,
      handleAddStudent,
      onDialogClose,
      onDialogAdded
    }
  },
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  padding: 0 !important;
  display: flex;
  flex-direction: column;

  .box{
    background: #FFFFFF;
    box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
    border-radius: 2px;
    padding: 1.875rem;
  }
  .detail{
    margin-bottom: .9375rem;
    .title{
      font-weight: bold;
      font-size: 1.25rem;
      position: relative;
      .el-button-group{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .list_info{
      margin-top: 2rem;
      ul,li{
        margin: 0;
        padding: 0;
      }
      ul{
        display: flex;
        flex-wrap: wrap;
      }
      li{
        flex-basis: 50%;
        list-style: none;
        height: 3rem;
        line-height: 3rem;
        span{
          display: inline-block;
          color: #606266;
          font-size: 1rem;
        }
        &>span:first-child{
          width: 5.5rem;
          font-size: 1.05rem;
          font-weight: 400;
        }
      }
    }
  }
  .list_box{
    flex: 1;
    display: flex;
    flex-direction: column;

    .list{
      flex: 1;
    }
    .pagination{
      margin-top: 1rem;
      text-align: center;
    }
  }
}
</style>
