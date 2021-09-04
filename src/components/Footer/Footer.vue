<template>
  <div id="Footer">
    <div class="foot_tip_box">
      <div class="foot_tip_box_warp">
        <div class="left_texts">
          <span>联系我们</span>
          <span>邮箱地址</span>
          <span>咨询热线</span>
          <span>关于我们</span>
          <span>kefu@aictb.com</span>
          <span>0514-82885886</span>
        </div>
        <div class="right_qr_box">
          <img
            class="qrcode"
            src="https://aictb.oss-cn-shanghai.aliyuncs.com/straight/qrcode.png"
            alt="qrcode"
          />
          <p>关注微信公众号</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="scss">
#Footer {
  background-color: #020e1a;
  padding-bottom: 5rem;
  .foot_tip_box {
    background: url('https://aictb.oss-cn-shanghai.aliyuncs.com/straight/foot_bg.png')
      no-repeat;
    background-size: 100% 100%;
    height: 14.5625rem;
    .foot_tip_box_warp {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left_texts {
        display: grid;
        grid-template-columns: repeat(3, 15.125rem);
        grid-template-rows: repeat(2, 3rem);
        justify-items: start;
        align-items: center;
        span:nth-child(1),
        span:nth-child(2),
        span:nth-child(3) {
          font-size: 1.25rem;
          font-weight: bold;
          color: #222222;
        }
        span:nth-child(4) {
          font-size: 1rem;
          font-weight: bold;
          color: #222222;
        }
        span:nth-child(5) {
          font-size: 1rem;
          font-weight: 400;
          color: rgba(34, 34, 34, 0.8);
        }
        span:nth-child(6) {
          font-size: 1rem;
          font-weight: bold;
          color: rgba(229, 3, 4, 0.8);
        }
      }
      .right_qr_box {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        p {
          width: 100%;
          text-align: center;
          font-size: 1rem;
          font-weight: 400;
          color: #222222;
        }
      }
    }
  }
}
</style>
