<template>
  <div id="Team">
    <div class="title_box">
      <el-button @click="openDialog(-1)" type="primary">新增班级</el-button>
    </div>
    <div class="search_box">
      <el-form inline>
        <el-form-item>
          <el-select v-model="search_data.school_id" placeholder="选择校区" clearable>
            <el-option
                v-for="item in search_condition.school"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="输入班级名称"
              v-model="search_data.keyword"
              clearable
          >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchbtn" type="primary" @click="doSearch"
          >搜索</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="table_data"
      tooltip-effect="dark"
      style="width: 99%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="name" label="班级名称" width="200">
        <template v-slot="scope"><el-link type="primary" href="javascrip:void(0)" @click="teamDetail(scope.$index, scope.row)">{{scope.row.name}}</el-link></template>
      </el-table-column>
      <el-table-column prop="school_data.name" label="校区" width="">
      </el-table-column>
      <el-table-column prop="course_data.name" label="课程" width="">
      </el-table-column>
      <el-table-column prop="uids_data" label="上课老师" width="">
        <template v-slot="scope">
          {{getTeacherNames(scope.row.user_data)}}
        </template>
      </el-table-column>
      <el-table-column prop="student_count" label="人数" width="">
      </el-table-column>
      <el-table-column label="创建时间" width="">
        <template v-slot="scope">
          <template v-if="scope.row.add_time">
            {{ setTimerType(scope.row.add_time * 1000) }}
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="200">
        <template v-slot="scope">
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="openDialog(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png">
          </el-image>
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="showConfirm(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png">
          </el-image>
        </template>
      </el-table-column>
    </el-table>

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
    <!-- 新增编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="team_data" :rules="rules" ref="form_ref" label-width="100px">
        <el-form-item label="班级名称" prop="name">
          <el-input v-model="team_data.name" placeholder="请输入课程名称" clearable style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="校区" prop="school_id">
          <el-select v-model="team_data.school_id" placeholder="选择校区" clearable @change="onSchoolChange">
            <el-option v-for="item in search_condition.school" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程" prop="course_id">
          <el-select v-model="team_data.course_id" placeholder="选择课程" clearable>
            <el-option v-for="item in search_condition.course" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课老师" prop="uids">
          <el-select multiple v-model="team_data.uids" placeholder="选择上课老师" clearable>
            <el-option v-for="item in search_condition.teacher" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onTeamSave">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
import {reactive, onMounted, toRefs, ref} from 'vue'
import { getTeamList,addTeam,saveTeam,deleteTeam } from "@/network/team";
import { getSchoolList,getCourseList,getTeacherList } from "@/network/block";
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from 'element-plus'
import { setTimerType } from "@/utils";

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      search_condition:{
        course:[],
        school:[],
        teacher:[]
      },
      search_data:{
        school_id:"",
        keyword:"",
      },
      table_data:[],
      team_data:{
        id:"",
        name:"",
        school_id:"",
        course_id:"",
        uids:[],
      },

      form_ref:ref(),
      rules: {
        name: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ],
        school_id: [
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        course_id: [
          {required: true, message: '请选择课程', trigger: 'blur'},
        ],
        uids: [
          {required: true, message: '请选择上课老师', trigger: 'blur'},
        ],
      },

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
      init()
    })

    const init = () => {
      loadTeamList()
      loadSearchCondition()
    }

    const loadTeamList = async () => {
      const { code, data, msg } = await getTeamList({
        page: state.page,
        // limit: state.limit,
        keyword: state.search_data.keyword,
        school_id: state.search_data.school_id,
      })
      if (!code) {
        state.table_data = data.list
        state.total_page = data.total_page
        state.count = data.count
      }
    }

    const loadSearchCondition = async () => {
      var {code,data,msg} = await getSchoolList()
      state.search_condition.school = data
    }

    const doSearch = () => {
      loadTeamList()
    }

    const getTeacherNames = (user_data) => {
      let names = _.map(user_data, 'name').join(" | ")
      return names ? names:'-'
    }

    //显示弹出框
    const openDialog = async (type,data={}) => {
      if(type == -1)
      {
        state.dialogTitle = '新增班级'

        state.team_data = {
          id:"",
          name:"",
          school_id:"",
          course_id:"",
          uids:[],
        }
      }
      else
      {
        await onSchoolChange(data.school_id)

        state.dialogTitle = '编辑班级'

        state.team_data.id = data.id
        state.team_data.name = data.name
        state.team_data.school_id = data.school_id
        state.team_data.course_id = data.course_id
        state.team_data.uids = data.uids
      }
      state.dialogVisible = true;
    }

    //保存：编辑，新增
    const onTeamSave = async () => {
      state.form_ref.validate(async (valid) => {
        if(valid)
        {
          //编辑
          if(state.team_data.id)
          {
            var {code,data,msg} = await saveTeam(state.team_data)

            if(!code)
            {
              state.dialogVisible = false
              loadTeamList()
            }
          }
          //添加
          else
          {
            var {code,data,msg} = await addTeam(state.team_data)

            if(!code)
            {
              state.dialogVisible = false
              loadTeamList()
            }
          }
        }
      })
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }
    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadTeamList()
    },300)

    const showConfirm = (index,data) => {
      state.confirmShow = true
      state.confirm_data.id = data.id
    }

    const doDelete = async () => {
      let {code} = await deleteTeam({
        id:state.confirm_data.id
      })
      if(!code)
      {
        state.confirmShow = false
        loadTeamList()
      }
    }

    const onSchoolChange = async (school_id) => {
      var {code,data,msg} = await getCourseList({
        school_id:school_id
      })
      state.team_data.course_id = ""
      state.search_condition.course = data

      var {code,data,msg} = await getTeacherList({
        school_id:school_id
      })
      state.team_data.uids = []
      state.search_condition.teacher = data
    }

    const teamDetail = (index,row) => {
      router.push({
        path:'/team_detail/'+row.id
      })
    }

    return {
      ...toRefs(state),
      store,
      setTimerType,
      doSearch,
      getTeacherNames,
      openDialog,
      onTeamSave,
      handleSizeChange,
      handleCurrentChange,
      showConfirm,
      doDelete,
      onSchoolChange,
      teamDetail
    }
  },
}
</script>

<style scoped lang="scss">
#Team {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  position: relative;

  .pagina {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .addfrom {
    .inputItem {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.9375rem;
      &:last-child {
        margin-bottom: 0;
      }
      span {
        width: 5.9375rem;
        font-size: 1rem;
        font-weight: 400;
        color: #999999;
        text-align: right;
        margin-right: 1.875rem;
      }
    }
  }

  .title_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .newstud {
      background: #485cc8;
      border-color: #485cc8;
    }
    span {
      font-size: 1rem;
      font-weight: 400;
      color: #222222;
    }
  }
  .search_box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
    .search_text {
      display: flex;
      justify-content: center;
      align-items: center;
      .searchtxt {
        width: 25rem;
        height: 2.625rem;
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-radius: 0.375rem 0px 0px 0.375rem;
      }
      .searchbtn {
        width: 4.5625rem;
        height: 2.625rem;
        background: #a8aab6;
        border-radius: 0px 0.375rem 0.375rem 0px;
        border-color: #a8aab6;
      }
    }
    .select_item {
      span {
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        margin-right: 1.25rem;
      }
    }
    .deletebtn {
      width: 7.8125rem;
      height: 2.625rem;
      background: #485cc8;
      border-radius: 0.375rem;
      border-color: #485cc8;
    }
  }
}
</style>
