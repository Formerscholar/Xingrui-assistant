<template>
  <div class="page">
    <div class="box school_box" v-if="role != 2">
      <el-row :gutter="16">
        <el-col :span="6" v-for="(item,index) in data" :key="index">
          <el-card class="box-card" shadow="hover">
            <template #header>
              <div class="title">
                <img src="@/assets/img/school.png">
                <span>{{ item.name }}</span>
              </div>
            </template>
            <div class="text item">
              <span>学生人数</span>
              <span style="font-size: 2.125rem">{{ item.student_count }}</span>
            </div>
            <div class="text item">
              <span>老师人数</span>
              <span>{{ item.teacher_count }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="box teacher_box" v-else>
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="item">
            <img src="@/assets/img/console/1.png" />
            <div>
              <span>班级总数</span>
              <span>{{ data.team_count }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <img src="@/assets/img/console/2.png" />
            <div>
              <span>学生人数</span>
              <span>{{ data.student_count }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <img src="@/assets/img/console/3.png" />
            <div>
              <span>试卷总数</span>
              <span>{{ data.paper_count }}</span>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <img src="@/assets/img/console/4.png" />
            <div>
              <span>试卷总数</span>
              <span>{{ data.material_count }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="box info_box">
      <img src="@/assets/img/index_flower.png" />
      <div class="content">
        <div class="t1">上传试题或试卷</div>
        <el-link href="javascript:void(0);" class="btn" :underline="false">获取积分</el-link>
        <div class="t2">老师可通过上传试题或试卷获取相应积分。</div>
      </div>
      <img src="@/assets/img/index_1.png">
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { getIndexData } from "@/network/console";
import { Timestamp } from "@/utils";

export default {
  setup(props, context) {
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      role:2,
      data:[],
    })

    onMounted(() => {
        init()
    })

    const init = async () => {
      let {code,data,msg} = await getIndexData()
      if(!code)
      {
        state.role = data.role
        state.data = data.data
      }
    }
    return {
      store,
      ...toRefs(state),
    }
  },
}
</script>

<style scoped lang="scss">
  .page{
    background: none;
    padding: 0!important;

    .box{
      background: #FFFFFF;
      margin-bottom: 1rem;
    }
    .school_box{
      background: none;
      margin-bottom: 0 !important;
      .el-col {
        margin-bottom: 1rem;
      }
      .box-card{
        .title{
          display: flex;
          align-items: center;
          justify-content: flex-start;
          img{
            display: block;
            width: 1.875rem;
            height: 1.875rem;
          }
          span{
            margin-left: 1rem;
            color: #485ECB;
            font-size: 1.25rem;
          }
        }
        .item{
          display: flex;
          align-items: center;
          margin-bottom: .5rem;
          span:nth-child(1){
            color: #222222;
            font-size: 1rem;
            margin-right: 1.5rem;
          }
        }
      }
    }
    .teacher_box{
      background: none;
      .item{
        background: #FFFFFF;
        display: flex;
        justify-content: space-between;
        padding: 2.3125rem 3.125rem;
        img{
          display: block;
          width: 5.625rem;
          height: 5.625rem;
        }
        & > div{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          span:nth-child(1){
            font-size: 1rem;
            margin-bottom: 0.875rem;
          }
          span:nth-child(2){
            font-size: 2.125rem;
            font-weight: bold;
          }
        }
      }
    }
    .info_box{
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      padding: .5rem;
      & > img:nth-child(1){
        width: 19.875rem;
        height: 19.25rem;
        align-self:flex-end;
      }
      .content{
        flex: 1;
        .t1{
          color: #073993;
          font-size: 3.25rem;
          font-weight: Bold;
          margin-bottom: 1rem;
        }
        .btn{
          border-radius: 1px;
          background: #FFCF2A;
          color: #222222;
          font-size: 1.6875rem;
          padding: 0.625rem 2rem;
          margin-bottom: 1rem;
        }
        .t2{
          font-size: 1rem;
          color: #999999;
        }
      }
      & > img:nth-child(2){
        width: 34.3125rem;
        height: 24.8125rem;
      }
    }
  }
</style>
