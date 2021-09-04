<template>
  <div id="Institution">
    <div class="title">
      当前套餐:
      <span>您还未购买任何套餐！</span>
    </div>
    <!-- 套餐 -->
    <div class="combo_head">
      <span class="name">精选特惠套餐</span>
      <span class="tiptext">倾心打造家教共育</span>
    </div>
    <div class="combo_body">
      <div class="item">
        <div class="title_text">
          套餐一
        </div>
        <img
          class="combo_icon"
          src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/combo_icon.png"
          alt="combo_icon"
        />
        <div class="teacher_count">
          <div class="lt">老师人数</div>
          <div class="rt">
            <span>10</span>
            人
          </div>
        </div>
        <div class="student_count">
          <div class="lt">学生总数</div>
          <div class="rt">
            <span>100</span>
            人
          </div>
        </div>
        <el-button class="pricebtn" type="primary" round>￥360</el-button>
        <div class="tip">原价 <s>￥200</s></div>
      </div>
    </div>
    <div class="tip_warp">
      <div class="title">温馨提示</div>
      <div class="content">
        1.没想好没想好没想好没想好没想好没想好没想好没想好没想好
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
#Institution {
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 2px;
  padding: 1.875rem;
  .title {
    font-size: 1rem;
    font-weight: 400;
    color: #222222;
    span {
      font-size: 1rem;
      font-weight: 400;
      color: #999999;
    }
  }
  .combo_head {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 3.3125rem;
    .name {
      font-size: 2.625rem;
      font-weight: bold;
      color: #222222;
      margin-bottom: 1.125rem;
    }
    .tiptext {
      font-size: 1.25rem;
      font-weight: 400;
      color: #999999;
      letter-spacing: 4px;
    }
  }
  .combo_body {
    margin-top: 3.75rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 5rem;
    .item {
      width: 317px;
      height: 449px;
      background: #f7f9fb;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 3.125rem 0;
      margin-right: 2.8125rem;
      &:nth-child(3n) {
        margin-right: 0;
      }
      .title_text {
        font-size: 1.625rem;
        font-weight: bold;
        color: #222222;
      }
      .combo_icon {
        width: 222px;
        height: 114px;
        margin: 1.875rem 0;
      }
      .teacher_count,
      .student_count {
        width: 8.625rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .lt {
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
        }
        .rt {
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
          span {
            font-size: 1.25rem;
            font-weight: bold;
            color: #e54303;
          }
        }
      }
      .teacher_count{
        margin-bottom: 1.25rem;
      }
      .pricebtn {
        width: 133px;
        height: 42px;
        background: #485cc8;
        border-radius: 21px;
        border-color: #485cc8;
        margin-top: 1.875rem;
        margin-bottom: 0.625rem;
      }
      .tip {
        font-size: 0.875rem;
        font-weight: 400;
        color: #999999;
      }
    }
  }
  .tip_warp {
    margin-top: 3.75rem;
    .title {
      font-size: 1rem;
      font-weight: 400;
      color: #222222;
      margin-bottom: 1rem;
    }
    .content {
      font-size: 1rem;
      font-weight: 400;
      color: #999999;
      margin-left: 1.4375rem;
    }
  }
}
</style>
