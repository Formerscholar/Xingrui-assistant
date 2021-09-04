<template>
  <div id="Institution">
    <div class="title">
      机构信息
    </div>
    <div class="list">
      <div class="item" style="margin-bottom:1.875rem;">
        <span>LOGO</span>
        <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="upload_url"
            :on-success="onUploadSuccess"
            name='image'
            :with-credentials='true'
        >
          <img v-if="ins_data.logo" :src="logo_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="item" style="margin-bottom:1.875rem;">
        <span>机构名称</span>
        <el-input
            v-model="ins_data.name"
            style="width:254px;"
            placeholder="请输入机构名称"
        ></el-input>
      </div>
      <div class="item" style="margin-bottom:1.875rem;">
        <span>联系人</span>
        <el-input
          v-model="ins_data.contacter"
          style="width:254px;"
          placeholder="请输入联系人"
        ></el-input>
      </div>
      <div class="item" style="margin-bottom:1.875rem;">
        <span>手机号</span>
        <el-input
          v-model="ins_data.mobile"
          style="width:254px;"
          placeholder="请输入手机号码"
        ></el-input>
      </div>
      <div class="item" style="margin-bottom:1.875rem;">
        <span>所在地区</span>
        <el-cascader v-model="areaIds" :options="area_data" :props="cascader_props" placeholder="请选择省/市/区" style="width: 20rem;"  @change="onChangeArea"></el-cascader>
      </div>
      <div class="item" style="margin-bottom:1.875rem;">
        <span>详细地址</span>
        <el-input
          v-model="ins_data.address"
          style="flex:1;"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="btns">
      <el-button type="primary" class="btn" round @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed,ref} from 'vue'
import { getInstitutionInfo,saveInstitutionInfo } from '@/network/institution'
import {getArea} from "@/network/block"
import {rootURL,baseURL} from '@/utils'

export default {
  setup() {
    const state = reactive({
      ins_data:{
        logo:'',
        name:'',
        contacter:'',
        mobile:'',
        province:0,
        city:0,
        area:0,
        address:''
      },
      upload_url:"/ins/Block/uploadImg",
      area_data:[],
      cascader_props: {value: 'id', label: 'name', children: 'child'},
    })

    onMounted(() => {
      state.upload_url = baseURL + state.upload_url

      getInstitution()
      getAreaData()
    })

    const getInstitution = async () => {
      const { data, code } = await getInstitutionInfo()
      if (!code) {
        state.ins_data.logo = data.logo
        state.ins_data.name = data.name
        state.ins_data.contacter = data.contacter
        state.ins_data.mobile = data.mobile
        state.ins_data.province = data.province
        state.ins_data.city = data.city
        state.ins_data.area = data.area
        state.ins_data.address = data.address
      }
    }

    const save = async () => {
      let {code,data,msg} = await saveInstitutionInfo(state.ins_data)
      if(!code)
        alert(msg)
    }

    const getAreaData = async () => {
      const {code, data, msg} = await getArea({
        id: -1
      })
      state.area_data = toTreeData(data)
    }

    const areaIds = computed(() => {
      return [state.ins_data.province, state.ins_data.city, state.ins_data.area]
    })

    const logo_url = computed(() => {
      return baseURL + state.ins_data.logo
    })

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

    const onUploadSuccess = (res,file,fileList) => {
       let {code,data,msg} = res
      if(!code)
        state.ins_data.logo = data.pic_src
      else
        alert(msg)
    }

    const onChangeArea = (node) => {
      state.ins_data.province = node[0]
      state.ins_data.city = node[1]
      state.ins_data.area = node[2]
    }

    return {
      ...toRefs(state),
      save,
      onUploadSuccess,
      areaIds,
      logo_url,
      onChangeArea
    }
  },
}
</script>

<style scoped lang="scss">
#Institution {
  height: 47.75rem;
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  .title {
    font-size: 1rem;
    font-weight: 400;
    color: #222222;
    margin: 1.875rem;
  }
  .list {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .item {
      width: 50.75rem;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      &::v-deep(.avatar-uploader){
        .el-upload{
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          line-height: 178px;
          text-align: center;
        }
      }

      .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
      span {
        width: 7.125rem;
        font-size: 1rem;
        font-weight: 400;
        color: #6d7783;
        margin-right: 3.0625rem;
        text-align: right;
      }
      .select_list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: 1;
      }
    }
  }
  .btns {
    display: flex;
    justify-content: center;
    align-items: center;
    .btn {
      width: 8.3125rem;
      height: 3.125rem;
      background: #485cc8;
      border-radius: 1.5625rem;
      border-color: #485cc8;
      margin-left: -21.875rem;
    }
  }
}

</style>
