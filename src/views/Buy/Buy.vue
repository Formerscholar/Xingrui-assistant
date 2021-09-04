<template>
  <div id="Buy">
    <div class="tool_box">
      <el-button @click="openDialog(-1)" type="primary">添加课时记录</el-button>
      <el-button @click="importBuy" type="primary">导入</el-button>
    </div>
    <div class="search_box">
      <el-form inline>
        <el-form-item>
          <el-select
              v-model="search_data.school_id"
              placeholder="选择校区"
              clearable
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
              v-model="search_data.has_hour"
              placeholder="剩余课时"
              clearable
          >
            <el-option label="有" value="1"></el-option>
            <el-option label="无" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
              placeholder="输入学生姓名"
              v-model="search_data.keyword"
              prefix-icon="el-icon-search"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_box">
      <el-table
          ref="multipleTable"
          :data="table_data"
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
        <el-table-column label="剩余课时" width="">
          <template v-slot="scope">{{ scope.row.buy_hour - scope.row.used_hour }}节</template>
        </el-table-column>
        <el-table-column label="操作人" width="">
          <template v-slot="scope">{{ scope.row.user_data.name }}</template>
        </el-table-column>
        <el-table-column label="添加日期" width="">
          <template v-slot="scope">{{ setTimerType(scope.row.add_time * 1000) }}</template>
        </el-table-column>
        <el-table-column align="right">
          <template v-slot="scope">
            <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;"
                      @click="openDialog(-2, scope.row)"
                      src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/xufei.png"
            >
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
          :total="count"
      >
      </el-pagination>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="buy_data" :rules="rules" ref="form_ref" label-width="110px">
        <el-form-item label="校区" prop="school_id">
          <el-select
              v-model="buy_data.school_id"
              placeholder="选择校区"
              clearable
              @change="onSchoolChange"
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
        <el-form-item label="学生" prop="student_id">
          <el-select
              v-model="buy_data.student_id"
              placeholder="选择学生"
              clearable
          >
            <el-option
                v-for="(item,index) in search_condition.student"
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
        <el-form-item label="课时类型" prop="type">
          <el-select
              v-model="buy_data.type"
              placeholder="选择课时类型"
              clearable
          >
            <el-option
                v-for="(item,index) in search_condition.buyType"
                :key="index"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="buy_data.pay_money" placeholder="请输入购买课时的所需的价格" style="width: 16rem">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="formSubmit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除dialog -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="40.625rem" center>
      <span>确定删除，继续此操作？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmShow = false">取 消</el-button>
          <el-button type="primary" @click="doDelete">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  导入课时记录-弹框  -->
    <ImportBuy :visible="import_visiable" @close="onImportBuyClose" @import="onImportBuyDo" />
  </div>
</template>

<script>
import {reactive, onMounted, toRefs, ref} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Message } from 'element-plus'
import { setTimerType, Timestamp } from '@/utils'
import { getbuyList,saveBuy,addBuy,deleteBuy } from '@/network/buy'
import { getSchoolList,getStudentList,getCourseList,getAllBuyType } from "@/network/block"
import ImportBuy from "../../components/Buy/ImportBuy";

export default {
  components: {ImportBuy},
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      search_condition:{
        school:[],
        student:[],
        course:[],
        buyType:[]
      },
      search_data:{
        school_id:"",
        has_hour:"",
        keyword:"",
      },
      table_data:[],
      buy_data:{
        id:'',
        school_id:'',
        course_id:'',
        student_id:'',
        buy_hour:'',
        pay_money:'',
      },

      form_ref:ref(),
      rules: {
        school_id: [
          {required: true, message: '请选择校区', trigger: 'blur'},
        ],
        course_id: [
          {required: true, message: '请选择课程', trigger: 'blur'},
        ],
        student_id: [
          {required: true, message: '请选择学生', trigger: 'blur'},
        ],
        buy_hour: [
          {required: true, message: '请输入购买课时', trigger: 'blur'},
        ],
      },

      loading:false,

      page:1,
      limit:10,
      count:0,

      dialogTitle:'',
      dialogVisible:false,

      confirmShow:false,
      confirm_data: {
        id:0
      },

      import_visiable:false,
    })

    onMounted(() => {
      state.search_data.school_id = store.state.userInfo.school_id
      init()
    })

    const init = async () => {
      await loadBuyList()
      await loadSearchCondition()
    }

    const loadBuyList = async () => {
      let params = {...state.search_data,page:state.page}
      let {code,data,msg} = await getbuyList(params)
      if(!code)
      {
        state.table_data = data.list
        state.count = data.count
      }
    }

    const loadSearchCondition = async () => {
      var {code,data,msg} = await getSchoolList()
      state.search_condition.school = data

      var {code,data} = await getAllBuyType()
      state.search_condition.buyType = data
    }

    const doSearch = () => {
      loadBuyList()
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }

    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      loadBuyList()
    },300)

    //显示弹出框
    const openDialog = async (type,data={}) => {
      if(type == -1)
      {
        state.dialogTitle = '新增课时记录'

        state.buy_data = {
          id:'',
          school_id:store.state.userInfo.school_id,
          course_id:'',
          student_id:'',
          buy_hour:'',
          pay_money:'',
        }

        await onSchoolChange()
      }
      else if(type == -2)
      {
        state.dialogTitle = '新增课时记录'

        state.buy_data = {
          id:'',
          school_id:data.school_id,
          course_id:data.course_id,
          student_id:data.student_id,
          buy_hour:'',
          pay_money:'',
        }

        await onSchoolChange()
      }
      else
      {
        state.dialogTitle = '编辑课时记录'

        state.buy_data = {
          id:data.id,
          school_id:data.school_id,
          course_id:data.course_id,
          student_id:data.student_id,
          buy_hour:data.buy_hour,
        }

        await onSchoolChange()
      }
      state.dialogVisible = true;
    }

    const showConfirm = (index,data) => {
      state.confirmShow = true
      state.confirm_data.id = data.id
    }

    const onSchoolChange = async () => {
        var {data} = await getStudentList({
          school_id:state.buy_data.school_id
        })
        state.search_condition.student = data

        var {data} = await getCourseList({
          school_id:state.buy_data.school_id
        })
        state.search_condition.course = data
    }

    const formSubmit = () => {
      state.form_ref.validate(async (valid) => {
        if(valid)
        {
          //编辑
          if(state.buy_data.id)
          {
            var {code,data,msg} = await saveBuy(state.buy_data)
          }
          //添加
          else
          {
            var {code,data,msg} = await addBuy(state.buy_data)
          }

          if(!code)
          {
            state.dialogVisible = false
            loadBuyList()
          }
        }
      })
    }
    const doDelete = async ()=> {
      let {code} = await deleteBuy({
        id : state.confirm_data.id
      })
      if(!code)
      {
        state.confirmShow = false
        loadBuyList()
      }
    }

    const importBuy = () => {
      state.import_visiable = true
    }

    const onImportBuyClose = () => {
      state.import_visiable = false
    }

    const onImportBuyDo = () => {
      state.import_visiable = false
      state.page = 1
      loadBuyList()
    }

    return {
      ...toRefs(state),
      store,
      doSearch,
      handleSizeChange,
      handleCurrentChange,
      setTimerType,
      openDialog,
      showConfirm,
      formSubmit,
      onSchoolChange,
      doDelete,
      importBuy,
      onImportBuyClose,
      onImportBuyDo
    }
  },
}
</script>

<style scoped lang="scss">
#Buy {
  position: relative;
  background: #FFFFFF;
  padding: .9rem;

  .tool_box{
    margin-bottom: 1rem;
  }
  .search_box{

  }
  .table_box{

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
