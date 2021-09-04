<template>
  <div class="main">
    <div class="box header">
      <div><i class="iconfont iconsuiji2"></i>同类型题目</div>
      <el-button @click="loadQuestion" type="text" style="padding: 0!important;"><i class="iconfont iconshuaxin"></i>换一批</el-button>
    </div>
    <div class="box">
      <div class="question_list">
        <div class="question_item" v-for="(item,index) in list" :key="index">
          <div class="content">
            <div v-html="item.content_all"></div>
          </div>
          <div class="tool">
            <el-button type="text" icon="iconfont iconsousuo">查看详情</el-button>
            <el-button type="text" icon="iconfont iconwujiaoxing" v-if="!item.has_add_basket" @click="onAddClick(index)">添加组卷</el-button>
            <el-button type="text" icon="iconfont iconwujiaoxing" v-else @click="onRemoveClick(index)">移除组卷</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getInfo, getbasketAdd, getbasketDel } from '@/network/knowledge'
export default {
  props:{
    value:{
      type:Boolean,
      default: false,
    },
    question_id:{
      type:Number,
      default:0,
    }
  },
  name: "SimilarQuestion",
  data() {
    return {
      current:{},
      list:[],
      count:2,
    }
  },
  components:{

  },
  computed:{

  },
  methods:{
    async onAddClick(index){
      let item = this.list[index]
      if(!item.has_add_basket)
      {
        let {code,data} = await getbasketAdd({
          id:item.id
        })
        if(!code)
        {
          this.list[index].has_add_basket = 1
          this.$emit("added",item.id)
        }
      }
    },
    async onRemoveClick(index){
      let item = this.list[index]
      if(item.has_add_basket)
      {
        let {code,data} = await getbasketDel({
          id:item.id
        })
        if(!code)
        {
          this.list[index].has_add_basket = 0
          this.$emit("removed",item.id)
        }
      }
    },
    async loadQuestion(){
      let {code,data} = await getInfo({
        id:this.question_id,
        count:this.count
      })
      if(!code)
      {
        this.current = data.question
        this.list = data.about
      }
    }
  },
  created(){

  },
  mounted(){

  }
}
</script>

<style scoped lang="scss">
  .main{
    &::v-deep(.iconfont){
      color: #485ecb !important;
      font-size: 2rem !important;
    }
    .box{
      margin-bottom: .5rem;
    }
    .iconfont{
      font-size: 20px !important;
    }
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .question_list{
      background: #f0f2f5;
      .question_item{
        margin-bottom: .5rem;
        .content{

        }
        .tool{
          display: flex;
          justify-content: space-between;
          height: 3rem;
          background: #FFFFFF;
          align-items: center;

          .el-button{
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
</style>
