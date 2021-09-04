<template>
  <div id="Course">
    <div class="title_box">
      <el-button @click="openDialog(-1)" type="primary">新增课程</el-button>
    </div>
    <div class="search_box">
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="search_data.school_id" placeholder="选择校区" clearable>
            <el-option v-for="item in search_condition_school" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select  v-model="search_data.subject_id" placeholder="全部学科" clearable>
            <el-option v-for="item in search_condition_subject" :key="item.id" :label="item.title" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input class="searchtxt" placeholder="输入课程名称" v-model="search_data.keyword" >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchbtn" type="primary" @click="doSearch">搜索</el-button>
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
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="subject_data.title" label="学科"> </el-table-column>
      <el-table-column label="校区">
        <template v-slot="scope">{{ mapName(scope.row.school_data) }}</template>
      </el-table-column>
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
    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="course_data" :rules="rules" ref="form_ref" label-width="100px">
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="course_data.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="学科" prop="subject_id">
          <el-select v-model="course_data.subject_id" placeholder="选择学科" clearable>
            <el-option v-for="item in search_condition_subject" :key="item.id" :label="item.title" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="校区" prop="school_ids">
          <el-select v-model="course_data.school_ids" multiple placeholder="选择校区" clearable>
            <el-option v-for="item in search_condition_school" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onCourseSave">确 定</el-button>
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
import { reactive, onMounted, toRefs,computed,ref } from 'vue'
import { getCourse,saveCourse,addCourse,delelteCourse } from "@/network/course"
import {getSchoolList,getSubjectList} from "@/network/block"
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from 'element-plus'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      table_data:[],
      course_data: {
        id: 0,
        name: "",
        school_ids: [],
        subject_id: '',
      },
      form_ref:ref(),
      rules: {
        name: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ],
        school_ids: [
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        subject_id: [
          {required: true, message: '请选择学科', trigger: 'blur'},
        ],
      },
      search_condition_school :[{}],
      search_condition_subject : [{}],
      search_data: {
        keyword:"",
        school_id: "",
        subject_id: "",
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
      getCourseList()
      loadSearchCondition()
    })

    const getCourseList = async () => {
      const { code, data, msg } = await getCourse({
        keyword: state.search_data.keyword,
        page: state.page,
        limit: state.limit,
        school_id: state.search_data.school_id,
        subject_id: state.search_data.subject_id,
      })
      if (code == 0) {
        state.table_data = data.list
        state.total_page = data.total_page
        state.count = data.count
      }
    }

    const loadSearchCondition = async () => {
      var {data} = await getSchoolList()
      state.search_condition_school = data
      var {data} = await getSubjectList()
      state.search_condition_subject = data
    }

    const doSearch = () => {
      getCourseList()
    }

    //显示弹出框
    const openDialog = (type,data={}) => {
      if(type == -1)
      {
        state.dialogTitle = '新增课程'

        state.course_data = {
          id: 0,
          name: "",
          school_ids: [],
          subject_id: '',
        }
      }
      else
      {
        state.dialogTitle = '编辑课程'

        state.course_data.id = data.id
        state.course_data.name = data.name
        state.course_data.school_ids = _.map(data.school_data, "id")
        state.course_data.subject_id = data.subject_id
      }
      state.dialogVisible = true;
    }
    //保存：编辑，新增
    const onCourseSave = async () => {
      state.form_ref.validate(async (valid) => {
        if(valid)
        {
          //编辑
          if(state.course_data.id)
          {
            var {code,data,msg} = await saveCourse(state.course_data)
          }
          //添加
          else
          {
            var {code,data,msg} = await addCourse(state.course_data)
          }

          if(!code)
          {
            state.dialogVisible = false
            getCourseList()
          }
        }
      })
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }
    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      getCourseList()
    },300)

    const showConfirm = (index,data) => {
      state.confirmShow = true
      state.confirm_data.id = data.id
    }

    const doDelete = async () => {
      let {code} = await delelteCourse({
        id:state.confirm_data.id
      })
      if(!code)
      {
        state.confirmShow = false
        getCourseList()
      }
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function (value, key) {
        str += value.name + ' | '
      })
      str = str.substr(0, str.length - 1)
      return _.trim(str,'|')
    }

    return {
      ...toRefs(state),
      store,
      doSearch,
      onCourseSave,
      openDialog,
      handleSizeChange,
      handleCurrentChange,
      showConfirm,
      doDelete,
      mapName
    }
  },
}
</script>

<style scoped lang="scss">
#Course {
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
