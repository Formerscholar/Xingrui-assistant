<template>
  <div id="Integral">
    <div class="title">积分记录</div>
    <!-- 提现 -->
    <div class="deposit">
      <div class="left_info">
        <div class="inter">
          <div class="key">当前积分：</div>
          <div class="val">105</div>
        </div>
        <div class="depos">
          累计提现：0元
        </div>
      </div>
      <el-button class="deposit_btn" type="primary">提现</el-button>
    </div>
    <!-- infolist -->
    <div class="infoistl">
      <div class="infoitem">
        <div class="left_info">
          <div class="title">2020年11月13日xxx的初中数学试卷</div>
          <div class="update_time">
            <img
              class="time_icon"
              src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/time_icon.png"
              alt="time_icon"
            />
            <span>更新时间：2020-08-08</span>
          </div>
        </div>
        <div class="right_num">+10</div>
      </div>
      <div class="infoitem">
        <div class="left_info">
          <div class="title">2020年11月13日xxx的初中数学试卷</div>
          <div class="update_time">
            <img
              class="time_icon"
              src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/time_icon.png"
              alt="time_icon"
            />
            <span>更新时间：2020-08-08</span>
          </div>
        </div>
        <div class="right_num">+10</div>
      </div>
    </div>
    <el-pagination
      class="pagin"
      @current-change="handleCurrentChange"
      :current-page="state.currentPage"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="1000"
    >
    </el-pagination>
  </div>
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const state = reactive({
      currentPage: 1,
    })

    const handleCurrentChange = (page) => {
      console.log(`当前页: ${page}`)
    }
    return {
      state,
      handleCurrentChange,
    }
  },
}
</script>

<style scoped lang="scss">
#Integral {
  padding: 1.875rem 3.75rem;
  width: 100%;
  min-height: calc(100vh - 5rem);
  background: #ffffff;
  box-shadow: 0px 2px 2rem 0px rgba(93, 93, 93, 0.04);
  border-radius: 0px 2px 2px 0px;

  position: relative;
  .pagin {
    position: absolute;
    bottom: 3.125rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .title {
    font-size: 1rem;
    font-weight: 400;
    color: #222222;
  }
  .deposit {
    width: 100%;
    height: 3.625rem;
    background: #f7f9fb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.875rem;
    padding: 0 1.875rem;
    .left_info {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .inter {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .key {
          font-size: 1.25rem;
          font-weight: bold;
          color: #040000;
        }
        .val {
          font-size: 1.25rem;
          font-weight: bold;
          color: #de2220;
          margin-left: 1.875rem;
        }
      }
      .depos {
        font-size: 1rem;
        font-weight: 400;
        color: #222222;
        margin-left: 1.875rem;
      }
    }
    .deposit_btn {
      background: #485cc8;
      border-color: #485cc8;
    }
  }

  .infoistl {
    margin-top: 1.875rem;
    .infoitem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 6.875rem;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 0.375rem;
      padding: 0 1.875rem;
      margin-bottom: 0.9375rem;
      &:last-child {
        margin-bottom: 0;
      }

      .left_info {
        .title {
          margin-bottom: 1rem;
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
        }
        .update_time {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span {
            font-size: 1rem;
            font-weight: 400;
            color: #222222;
            margin-left: .625rem;
          }
        }
      }
      .right_num {
        font-size: 1rem;
        font-weight: bold;
        color: #485cc8;
      }
    }
  }
}
</style>
