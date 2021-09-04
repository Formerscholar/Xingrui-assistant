<template>
  <div id="Student">
    <div class="title_box">
      <el-button type="primary" @click="openDialog(-1)">新增学生</el-button>
      <el-button type="primary" @click="importStudent">导入</el-button>
    </div>
    <div class="search_box">
      <el-form inline>
        <el-form-item>
          <el-select
              v-model="search_data.school_id"
              placeholder="选择校区"
              clearable
              @change="onSearchSchoolChange"
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
        <el-form-item>
          <el-select
              v-model="search_data.team_id"
              placeholder="全部班级"
              clearable
          >
            <el-option
                v-for="item in search_condition.team"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
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
              placeholder="输入学生姓名或手机号"
              v-model="search_data.keyword"
              clearable
          >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch" >搜索</el-button>
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
      <el-table-column prop="name" label="姓名" width="200">
        <template v-slot="scope"><el-link type="primary" href="javascript:void(0)" @click="studentDetail(scope.$index, scope.row)">{{scope.row.name}}</el-link></template>
      </el-table-column>
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
<!--      <el-table-column label="学情报告" width="">-->
<!--        <template v-slot="scope">-->
<!--          <el-link type="primary" href="javascript:void(0)" @click="studentReport(scope.$index, scope.row)">点击查看</el-link>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="right">
        <template v-slot="scope">
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="openDialog(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png">
          </el-image>
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="showConfirm(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png">
          </el-image>
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                    @click="openBuyDialog(scope.$index, scope.row)"
                    src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/xufei.png">
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
    <!-- 新增/编辑学生 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="student_data" :rules="rules" ref="form_ref" label-width="110px">
        <el-form-item label="姓名" prop="name">
          <el-input
              v-model="student_data.name"
              placeholder="请输入学生姓名"
              style="width: 16rem"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select
              v-model="student_data.sex"
              placeholder="性别"
          >
            <el-option label="男" value="1"> </el-option>
            <el-option label="女" value="2"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在校区" prop="school_id">
          <el-select
              v-model="student_data.school_id"
              placeholder="请选择所在校区"
              @change="onSchoolChange"
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
        <el-form-item label="班级">
          <el-select
              v-model="student_data.team_ids"
              placeholder="请选择班级"
              multiple
          >
            <el-option
                v-for="item in search_condition.team"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责老师">
          <el-select
              v-model="student_data.uids"
              placeholder="请选择老师"
              multiple
          >
            <el-option
                v-for="item in search_condition.teacher"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家长联系方式" prop="mobile">
          <el-input v-model="student_data.mobile" placeholder="请输入家长联系方式" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="销售人员">
          <el-select
              v-model="student_data.saler"
              placeholder="请选择销售人员"
              clearable
          >
            <el-option
                v-for="item in search_condition.teacher"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-input type="textarea" v-model="student_data.mark" placeholder="请输入学生的备注" />
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveStudent">确 定</el-button>
        </el-form-item>
      </el-form>
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
    <!-- 弹窗:添加购买记录 -->
    <el-dialog :title="dialogTitle2" v-model="dialogVisible2" width="30rem" center>
      <el-form :model="buy_data" :rules="rules2" ref="form_ref2" label-width="110px">
        <el-form-item label="课程" prop="course_id">
          <el-select
              v-model="buy_data.course_id"
              placeholder="选择课程"
              clearable
          >
            <el-option
                v-for="(item,index) in search_condition.course"
                :key="index"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="购买课时" prop="buy_hour">
          <el-input v-model="buy_data.buy_hour" placeholder="请输入购买的课时数量" style="width: 16rem">
            <template #append>节</template>
          </el-input>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="buy_data.pay_money" placeholder="请输入购买课时的所需的价格" style="width: 16rem">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="doAddBuy">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--  弹框：导入学生  -->
    <ImportStudent :visible="import_visiable" @close="onImportStudentDialogClose" @import="onImported" />
  </div>
</template>

<script>
import {reactive, onMounted, toRefs, ref} from 'vue'
import { getStudent, StudentSave, StudentAdd,deleteStudent } from '@/network/student'
import { setTimerType, Timestamp } from '@/utils'
import { getSchoolList,getTeamList,getTeacherList ,getCourseList} from "@/network/block";
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getbuyList,saveBuy,addBuy,deleteBuy } from '@/network/buy'
import {ElMessage} from "element-plus";
import ImportStudent from "../../components/Student/ImportStudent";

export default {
  components: {
    ImportStudent,
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      search_condition:{
        school:[],
        team:[],
        teacher:[],
        course:[]
      },
      search_data:{
        school_id:"",
        team_id:'',
        times:'',
        keyword:"",
      },
      table_data:[],
      student_data:{
        id:"",
        name:"",
        sex:"",
        school_id:"",
        team_ids:[],
        uids:[],
        mobile:"",
        saler:"",
        mark:"",
      },

      form_ref:ref(),
      rules: {
        name: [
          {required: true, message: '请输入学生姓名', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'blur'},
        ],
        school_id: [
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        team_ids: [
          {required: true, message: '请选择班级', trigger: 'blur'},
        ],
        uids: [
          {required: true, message: '请选择负责的老师', trigger: 'blur'},
        ],
        mobile: [
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
        mark: [
          {max: 200, message: '最大长度限制200个字符', trigger: 'blur'}
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

      dialogTitle2:'',
      dialogVisible2:false,

      buy_data:{
        school_id:'',
        course_id:'',
        student_id:'',
        buy_hour:'',
        pay_money:'',
      },

      form_ref2:ref(),
      rules2: {
        course_id: [
          {required: true, message: '请选择课程', trigger: 'change'},
        ],
        buy_hour: [
          {required: true, message: '请输入购买课时', trigger: 'blur'},
        ],
      },

      import_visiable:false,

    })

    onMounted(() => {
      init()
    })

    const init = async () => {
      await getStudentData()
      await loadSearchCondition()
    }

    const getStudentData = async () => {
      let params = {
        page: state.page,
        limit: state.limit,
        school_id: state.search_data.school_id,
        team_id: state.search_data.team_id,
        keyword: state.search_data.keyword,
      }
      if(state.search_data.times.length){
        params.start_time = Timestamp(state.search_data.times[0])
        params.end_time = Timestamp(state.search_data.times[1])
      }

      const { code, data, msg } = await getStudent(params)

      if (code == 0) {
        state.table_data = data.list
        state.page = data.page
        state.total_page = data.total_page
      }
    }

    const loadSearchCondition = async () => {
      var {code,data,msg} = await getSchoolList()
      state.search_condition.school = data
    }

    const doSearch = () => {
      getStudentData()
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function(value, key) {
        str += value.name + ' | '
      })
      str = str.substr(0, str.length - 1)
      return _.trim(str,"|")
    }

    //显示弹出框
    const openDialog = async (type,data={}) => {
      if(type == -1)
      {
        state.dialogTitle = '新增学生'

        state.student_data = {
          id:"",
          name:"",
          sex:"",
          school_id:"",
          team_ids:[],
          uids:[],
          mobile:"",
          saler: "",
          mark:""
        }
      }
      else
      {
        await onSchoolChange(data.school_id)

        state.dialogTitle = '编辑学生'

        state.student_data.id = data.id
        state.student_data.name = data.name
        state.student_data.sex = data.sex.toString()
        state.student_data.school_id = data.school_id
        state.student_data.team_ids = _.map(data.team_data, "id")
        state.student_data.uids = _.map(data.user_data, "id")
        state.student_data.mobile = data.mobile
        state.student_data.saler = data.saler
        state.student_data.mark = data.mark
      }
      state.dialogVisible = true;
    }
    //显示添加购买记录弹出框
    const openBuyDialog = async (index,data) => {
      state.dialogTitle2 = "新增课时记录"
      state.dialogVisible2 = true;

      state.buy_data = {
        id:'',
        school_id:data.school_id,
        course_id:'',
        student_id:data.id,
        buy_hour:'',
        pay_money:'',
      }

      var {data} = await getCourseList({
        school_id:state.buy_data.school_id
      })
      state.search_condition.course = data
    }

    const onSearchSchoolChange = async (school_id) => {
      var {code ,data , msg} = await getTeamList({
        school_id:school_id
      })
      state.search_condition.team = data
    }

    const onSchoolChange = async (school_id) => {
      var {code,data,msg} = await getTeamList({
        school_id:school_id
      })
      state.search_condition.team = data

      var {code,data,msg} = await getTeacherList({
        school_id:school_id
      })
      state.search_condition.teacher = data
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }
    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      getStudentData()
    },300)

    const showConfirm = (index,data) => {
      state.confirmShow = true
      state.confirm_data.id = data.id
    }
    const doDelete = async () => {
      let {code} = await deleteStudent({
        id:state.confirm_data.id
      })
      if(!code)
      {
        state.confirmShow = false
        getStudentData()
      }
    }

    const studentDetail = (index, row) => {
      router.push('/student/detail/' + row.id)
    }

    const saveStudent = () => {
      state.form_ref.validate(async (valid) => {
        if(valid)
        {
          //编辑
          if(state.student_data.id)
          {
            var {code,data,msg} = await StudentSave(state.student_data)
          }
          //添加
          else
          {
            var {code,data,msg} = await StudentAdd(state.student_data)
          }

          if(!code)
          {
            state.dialogVisible = false
            getStudentData()
          }
        }
      })
    }

    const doAddBuy = () => {
      state.form_ref2.validate(async (valid) => {
        if(valid)
        {
          let {code,data} = await addBuy(state.buy_data)
          if(!code)
          {
            ElMessage.success("添加课时记录成功")
            state.dialogVisible2 = false
          }
        }
      })
    }

    const studentReport = (index,row) => {
      router.push('/student/report/' + row.id)
    }

    const importStudent = () => {
      state.import_visiable = true
    }

    const onImportStudentDialogClose = () => {
      state.import_visiable = false
    }

    const onImported = () => {
      state.import_visiable = false
      state.page = 1
      getStudentData()
    }

    return {
      store,
      ...toRefs(state),
      mapName,
      setTimerType,
      doSearch,
      openDialog,
      onSearchSchoolChange,
      handleSizeChange,
      handleCurrentChange,
      showConfirm,
      doDelete,
      studentDetail,
      onSchoolChange,
      saveStudent,
      studentReport,
      openBuyDialog,
      doAddBuy,
      importStudent,
      onImportStudentDialogClose,
      onImported
    }
  },
}
</script>

<style scoped lang="scss">
#Student {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  position: relative;
  .student_box {
    .name_sex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        span {
          width: 5.9375rem;
          font-size: 1rem;
          font-weight: 400;
          color: #999999;
          margin-right: 1.875rem;
          text-align: right;
        }
      }
    }
    .items_input {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 0.9375rem;
      span {
        width: 5.9375rem;
        font-size: 1rem;
        font-weight: 400;
        color: #999999;
        margin-right: 1.875rem;
        text-align: right;
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
  .title_box {
    display: flex;
    align-items: center;
    .newstud {
      background: #485cc8;
      border-color: #485cc8;
    }
  }
  .search_box {
    display: flex;
    justify-content: space-between;
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
