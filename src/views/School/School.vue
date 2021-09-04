<template>
  <div id="School">
    <div class="title_box">
      <el-button class="newstud" type="primary" @click="showAddSchoolDialog">新增校区</el-button>
    </div>
    <!-- 搜索-->
    <div class="search_box">
      <el-form :model="search_data"  ref="search_school_ref" :inline="true">
        <el-form-item>
          <el-cascader :options="area_data" :props="cascader_props" placeholder="请选择省/市/区" style="width: 20rem;" ref="search_area_ref" clearable></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-input class="searchtxt" placeholder="输入校区名称" v-model="search_data.keyword" >
            <template v-slot:prefix>
              <i class="el-input__icon el-icon-search"></i>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="searchbtn" type="primary" @click="searchSchool">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--    列表-->
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 99%;"
    >
      <el-table-column prop="name" label="校区名称" width="155"></el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column align="right">
        <template v-slot="scope">
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;" @click="handleEdit(scope.$index, scope.row)" src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/edit_icon.png"></el-image>
          <el-image style="display: inline-block; vertical-align: middle; margin-right: 1rem;cursor: pointer;" @click="handleDelete(scope.$index, scope.row)" src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/delete_icon.png"></el-image>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination
        class="pagina"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Idata.page"
        :page-size="limit"
        layout="prev, pager, next, jumper"
        :page-count="Idata.total_page"
    >
    </el-pagination>
    <!-- 新增/编辑校区 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="30rem" center>
      <el-form :model="school_data" :rules="rules" ref="school_ref" label-width="100px">
        <el-form-item label="校区名称" prop="name">
          <el-input v-model="school_data.name" placeholder="请输入校区名称" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="school_data.address" placeholder="请输入校区地址" style="width: 16rem"></el-input>
        </el-form-item>
        <el-form-item label="省/市/区">
          <el-cascader v-model="areaIds" :options="area_data" :props="cascader_props" placeholder="请选择省/市/区" ref="area_ref"></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-form-item>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="doAddSchool">确定</el-button>
        </el-form-item>
      </template>
    </el-dialog>
    <!-- 删除confirm -->
    <el-dialog title="温馨提示" v-model="confirmShow" width="30rem" center>
      <span>确定删除校区，继续此操作？</span>
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
import {reactive, onMounted, toRefs, computed,ref} from 'vue'
import {getschool, deleteSchool,addSchool,saveSchool} from "@/network/school"
import {getArea} from "@/network/block";
import {setTimerType, Timestamp} from '@/utils'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      Idata: {},//接口数据
      tableData: [],//列表数据
      confirmShow:false,
      dialogTitle: '',
      dialogVisible: false,
      search_school_ref:ref(),
      search_area_ref:ref(),
      school_ref:ref(),
      area_ref:ref(),
      school_data: {
        id: 0,
        name: "",
        address: "",
        province: 0,
        city: 0,
        area: 0,
      },
      rules: {
        name: [
          {required: true, message: '请输入校区名称', trigger: 'blur'},
          {max: 20, message: '最大长度限制20个字符', trigger: 'blur'}
        ]
      },
      area_data: [],
      cascader_props: {value: 'id', label: 'name', children: 'child'},
      search_data: {
        province: 0,
        city: 0,
        area: 0,
        keyword:"",
      },
      page:1,
      limit:10,
      confirm_data: {
        id:''
      }
    })

    onMounted(() => {
      getschoolData()
      getAreaData()
    })

    const areaIds = computed(() => {
      return [state.school_data.province, state.school_data.city, state.school_data.area]
    })

    const getAreaData = async () => {
      const {code, data, msg} = await getArea({
        id: -1
      })
      state.area_data = toTreeData(data)
    }

    const toTreeData = (data) => {
      let cloneData = JSON.parse(JSON.stringify(data)) // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(
            child => father.id == child.parent_id
        ) //返回每一项的子级数组
        branchArr.length > 0 ? (father.child = branchArr) : '' //如果存在子级，则给父级添加一个children属性，并赋值
        return father.parent_id == 0 //返回第一层
      })
    }

    const getschoolData = async () => {
      const {code, data, msg} = await getschool({
        page: state.page,
        limit: state.limit,
        keyword: state.search_data.keyword,
        province: state.search_data.province,
        city: state.search_data.city,
        area: state.search_data.area,
      })
      if (code == 0) {
        state.Idata = data
        state.tableData = data.list.map((item) => {
          return {
            id: item.id,
            name: item.name,
            add_time: item.add_time,
            address: item.address,
            province: item.province,
            city: item.city,
            area: item.area,
          }
        })
      }
    }

    const handleDelete = (index, row) => {
      state.confirm_data.id = row.id
      state.confirmShow = true
    }

    const handleEdit = (index, row) => {
      state.dialogTitle = '编辑校区'
      state.dialogIsDelect = false
      state.dialogVisible = true

      state.school_data = {...row}
    }

    const handleDetail = (index, row) => {
      console.log(index, row, '跳转详情')
      router.push('/student/detail/' + row.id)
    }

    const mapName = (obj) => {
      let str = ''
      _.forEach(obj, function (value, key) {
        str += value.name + '|'
      })
      str = str.substr(0, str.length - 1)
      return str
    }

    const showAddSchoolDialog = () => {
      state.school_data = {
        id: 0,
        name: "",
        address: "",
        province: 0,
        city: 0,
        area: 0,
      }

      state.dialogTitle = '添加校区'
      state.dialogIsDelect = false
      state.dialogVisible = true
    }

    const doAddSchool = () => {
      state.school_ref.validate(async (valid) => {
        if (valid) {
          let post_data = JSON.parse(JSON.stringify(state.school_data))

          let nodes = state.area_ref.getCheckedNodes()
          if(nodes.length > 0)
          {
            post_data.province = nodes[0].pathValues[0]
            post_data.city = nodes[0].pathValues[1]
            post_data.area = nodes[0].pathValues[2]
          }

          if(post_data.id)
          {
            let {code ,data ,msg} = await saveSchool(post_data)
            if(!code)
            {
              state.dialogVisible = false
              getschoolData()
            }
          }
          else
          {
            let {code ,data ,msg} = await addSchool(post_data)
            if(!code)
            {
              state.dialogVisible = false
              getschoolData()
            }
          }
        }
      })
    }

    const searchSchool = () => {
      let nodes = state.search_area_ref.getCheckedNodes()
      if(nodes.length > 0)
      {
        state.search_data.province = nodes[0].pathValues[0]
        state.search_data.city = nodes[0].pathValues[1]
        state.search_data.area = nodes[0].pathValues[2]
      }
      else
      {
        state.search_data.province = 0
        state.search_data.city = 0
        state.search_data.area = 0
      }
      getschoolData()
    }

    const handleSizeChange = () => {
      alert("修改每页显示数")
    }
    const handleCurrentChange = _.debounce((page) =>{
      state.page = page
      getschoolData()
    },300)

    const doDelete = async () => {
      const {code} = await deleteSchool({
        id: state.confirm_data.id,
      })
      if (!code) {
        state.confirmShow = false
        getschoolData()
      }
    }

    return {
      store,
      ...toRefs(state),
      handleDelete,
      handleEdit,
      mapName,
      setTimerType,
      getschoolData,
      handleDetail,
      showAddSchoolDialog,
      areaIds,
      doAddSchool,
      searchSchool,
      handleSizeChange,
      handleCurrentChange,
      doDelete,
    }
  },
}
</script>

<style scoped lang="scss">
#School {
  background: #ffffff;
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
}
</style>
