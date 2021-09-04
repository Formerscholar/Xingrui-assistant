<template>
  <div id="Teacher">
    <div class="title_box">
      <el-button @click="newTeacher" type="primary">新增老师</el-button>
      <el-button type="primary" @click="importTeacher">导入</el-button>
    </div>
    <!--  搜索  -->
    <div class="search_box">
      <el-form inline>
        <el-form-item>
          <el-select
              v-model="search_data.school_id"
              placeholder="选择校区"
          >
            <el-option
                v-for="(item,index) in search_condition.school"
                :key="index"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
              v-model="search_data.subject_id"
              placeholder="全部学科"
          >
            <el-option
                v-for="(item,index) in search_condition.subject"
                :key="index"
                :label="item.title"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
              class="searchtxt"
              placeholder="输入老师姓名或手机号"
              v-model="search_data.keyword"
          >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchbtn" type="primary" @click="getTeacher">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--  列表  -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 99%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="name" label="姓名" width="200">
        <template v-slot="scope"><el-link type="primary" href="javascript:void(0)" @click="handleDetail(scope.$index, scope.row)">{{ scope.row.name }}</el-link></template>
      </el-table-column>
      <el-table-column label="所在校区" width="">
        <template v-slot="scope">{{ scope.row.school_data.name }}</template>
      </el-table-column>
      <el-table-column label="科目" width="">
        <template v-slot="scope">{{ mapTitle(scope.row.subject_data) }}</template>
      </el-table-column>
      <el-table-column label="负责的班级" width="">
        <template v-slot="scope">{{ mapName(scope.row.team_data) }}</template>
      </el-table-column>
      <el-table-column prop="student_count" label="学生数" width="">
      </el-table-column>
      <el-table-column prop="account" label="联系方式" width="">
      </el-table-column>
      <el-table-column align="right">
        <template v-slot="scope">
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="handleEdit(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png">
          </el-image>
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="handleDelete(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png">
          </el-image>
<!--          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"-->
<!--                    @click="handleDetail(scope.$index, scope.row)"-->
<!--                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/detail_icon.png">-->
<!--          </el-image>-->
        </template>
      </el-table-column>
    </el-table>
    <!--  分页  -->
    <el-pagination
      class="pagina"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="limit"
      layout="prev, pager, next, jumper"
      :page-count="total_page"
    >
    </el-pagination>
    <!-- 新增老师弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="teacher_data" :rules="rules" ref="form_ref" label-width="100px">
        <el-form-item label="手机号" prop="account">
          <el-input v-model="teacher_data.account" placeholder="请输入手机号" :disabled="dialogIsDelect" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="老师姓名" prop="name">
          <el-input v-model="teacher_data.name" placeholder="请输入老师姓名" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="所在校区" prop="school_id">
          <el-select
              v-model="teacher_data.school_id"
              placeholder="请选择所在校区"
          >
            <el-option
                v-for="item in search_condition.school"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目" prop="subject_ids">
          <el-select
              v-model="teacher_data.subject_ids"
              placeholder="请选择科目"
              multiple
          >
            <el-option
                v-for="item in search_condition.subject"
                :key="item.id"
                :label="item.title"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select
              v-model="teacher_data.role_id"
              placeholder="请选择角色"
          >
            <el-option
                v-for="item in search_condition.role"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addTeacherClick">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除dialog -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="40.625rem" center>
      <span>确定删除【{{ confirm_data.name }}】老师的记录？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="delTeaClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  弹框：导入老师  -->
    <ImportTeacher :visible="import_visiable" @close="onImportTeacherDialogClose" @import="onImported" />
  </div>
</template>

<script>
import { reactive, onMounted, toRefs,ref } from 'vue'
import {
  getTeacherList,
  teacherAdd,
  deleteTeacher,
  teacherSave,
} from '@/network/teacher'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from 'element-plus'
import { getSchoolList,getSubjectList,getAllRole } from "@/network/block"
import ImportTeacher from "../../components/Teacher/ImportTeacher";

export default {
  components: {
    ImportTeacher,
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      rootData:{},
      tableData:[],

      teacher_data:{
        id:'',
        account:'',
        name:'',
        school_id:'',
        subject_ids:[],
        role_id:''
      },
      form_ref:ref(),
      rules: {
        name: [
          {required: true, message: '请输入老师姓名', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ],
        school_id: [
          {required: true, message: '请选择校区', trigger: 'change'},
        ],
        // subject_ids: [
        //   {required: true, message: '请选择科目', trigger: 'change'},
        // ],
        role_id: [
          {required: true, message: '请选择角色', trigger: 'change'},
        ],
        account: [
          {required: true, message: '请输入手机号码', trigger: 'blur'},
          {
            validator:(rule,value,callBack) => {
              if(value)
              {
                if(/^[1][0-9]{10}$/.test(value))
                  callBack()
                else
                  callBack("请输入正确的手机号码")
              }
              else
                callBack()
            }
          }
        ],
      },

      search_data:{
        school_id:"",
        subject_id:'',
        keyword:"",
      },

      search_condition:{
        school:[],
        subject:[],
        role:[]
      },

      page:1,
      limit:10,
      total_page:1,
      count:0,

      dialogTitle:'',
      dialogVisible:false,
      dialogIsDelect:false,

      confirmShow:false,
      confirm_data: {
        id:0,
        name:''
      },

      import_visiable:false,
    })

    onMounted(() => {
      getTeacher()
      loadSearchCondition()
    })

    const getTeacher = async () => {
      const { code, data, msg } = await getTeacherList({
        keyword: state.search_data.keyword,
        page: state.page,
        limit: state.limit,
        school_id: state.search_data.school_id,
        subject_id: state.search_data.subject_id,
      })
      if (code == 0) {
        state.rootData = data
        state.tableData = data.list

        state.total_page = data.total_page
        state.count = data.count
      }
    }
    const loadSearchCondition = async () => {
      var {code,data,msg} = await getSchoolList()
      state.search_condition.school = data

      var {data} = await getSubjectList()
      state.search_condition.subject = data

      var {data} = await getAllRole()
      state.search_condition.role = data
    }

    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }

    const handleEdit = (index, row) => {

      state.teacher_data.id = row.id
      state.teacher_data.subject_ids = row.subject_ids
      state.teacher_data.school_id = row.school_id
      state.teacher_data.name = row.name
      state.teacher_data.account = row.account
      state.teacher_data.role_id = row.role_id

      state.dialogTitle = '修改老师'
      state.dialogIsDelect = true
      state.dialogVisible = true
    }

    const handleDelete = (index, row) => {
      state.confirm_data.name = row.name
      state.confirm_data.id = row.id
      state.confirmShow = true
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function(value, key) {
        str += value.name + ' | '
      })
      str = _.trim(str.substr(0, str.length - 1),'|')
      return str
    }

    const mapTitle = (obj) => {
      let str = ''
      _.forEach(obj, function(value, key) {
        str += value.title + ' | '
      })
      str = _.trim(str.substr(0, str.length - 1),'|')
      return str
    }

    const addTeacherClick = async () => {
      state.form_ref.validate(async (valid) => {
        if(valid)
        {
          if (state.dialogIsDelect) {
            const { code, data } = await teacherSave(state.teacher_data)
            if (code == 0) {
              state.dialogTitle = '添加老师'
              state.dialogIsDelect = false
              state.dialogVisible = false

              getTeacher()
            }
          } else {
            const { code, data } = await teacherAdd(state.teacher_data)
            if (code == 0) {
              state.dialogTitle = '编辑老师'
              state.dialogIsDelect = false
              state.dialogVisible = false

              getTeacher()
            }
          }
        }
      })
    }

    const delTeaClick = async () => {
      const { code } = await deleteTeacher({
        id: state.confirm_data.id,
      })
      if (code == 0) {
        getTeacher()
        state.confirmShow = false
      }
    }
    const handleDetail = (index, row) => {
      router.push(`/teacher/detail/${row.id}`)
    }

    const handleCurrentChange = (val) => {
      state.page = val
      getTeacher()
    }

    const newTeacher = () => {
      state.teacher_data.id = ''
      state.teacher_data.subject_ids = []
      state.teacher_data.school_id = ''
      state.teacher_data.name = ''
      state.teacher_data.account = ''
      state.teacher_data.role_id = ''

      state.dialogTitle = '新增老师'
      state.dialogIsDelect = false
      state.dialogVisible = true
    }

    const importTeacher = () => {
      state.import_visiable = true
    }

    const onImportTeacherDialogClose = () => {
      state.import_visiable = false
    }

    const onImported = () => {
      state.import_visiable = false
      state.page = 1
      getTeacher()
    }

    return {
      ...toRefs(state),
      store,
      handleSelectionChange,
      handleEdit,
      handleDelete,
      mapName,
      getTeacher,
      addTeacherClick,
      delTeaClick,
      handleDetail,
      handleCurrentChange,
      newTeacher,
      mapTitle,
      importTeacher,
      onImportTeacherDialogClose,
      onImported
    }
  },
}
</script>

<style scoped lang="scss">
#Teacher {
  background: #ffffff;
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
