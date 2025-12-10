<template>
  <div class="wrapper">
    <div class="logo">
      <img alt="ZsAdminlogo" src="@/assets/logo.png" class="logo-img" />
      <div class="logo-text">{{ websiteName }}</div>
    </div>
    <div class="login-container">
      <div class="login-body">
        <!-- 左侧品牌区域 -->
        <div class="left-side"> </div>

        <!-- 右侧登录区域 -->
        <div class="right-side">
          <div class="login-panel">
            <div class="panel-body">
              <LoginForm />
            </div>

            <!-- 底部链接（可选，提升完整性） -->
            <!-- <div class="panel-footer">
          <a href="#" class="footer-link">忘记密码？</a>
          <a href="#" class="footer-link">联系管理员</a>
        </div> -->
          </div>
        </div>
      </div>
      <div class="login-footer">
        <div class="copyright">
          {{ copyright }} &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://beian.miit.gov.cn/" target="_blank">{{
            icp
          }}</a></div
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';
  import LoginForm from './components/login-form.vue';

  const websiteName = computed(() => websiteStore().website?.websiteName ?? '');
  const copyright = computed(() => websiteStore().website?.copyright ?? '');
  const icp = computed(() => websiteStore().website?.icp ?? '');
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f1f3f4;
    // 背景图优化：避免拉伸+固定显示
    background: url('@/assets/images/6.png') no-repeat center center;
    background-size: cover;
    position: relative;

    // Logo区域：悬浮感+抗遮挡
    .logo {
      position: absolute;
      top: 24px;
      left: 40px;
      z-index: 2;
      display: flex;
      align-items: center;
      color: var(--color-black);
      font-weight: 600;
      padding: 8px 16px;
      transition: all 0.3s ease; // 基础过渡

      .logo-img {
        width: 48px;
        height: 48px;
        object-fit: contain; // 避免logo变形
      }

      .logo-text {
        margin-left: 12px;
        font-size: 48px;
        letter-spacing: 0.5px;
      }
    }

    .login-container {
      width: 100%;
      max-width: 1000px;
      text-align: center;

      .login-body {
        display: flex;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        .left-side {
          flex: 1;
          // 背景图优化：避免拉伸+固定显示
          background: url('@/assets/images/login/login-left.png') no-repeat
            center center;
          background-size: contain;
          background-color: #3875e8;
        }

        .right-side {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .login-footer {
        padding: 40px 0 0 0;
        text-align: center;

        .copyright {
          color: var(--color-black);
        }
      }
    }
  }
</style>
