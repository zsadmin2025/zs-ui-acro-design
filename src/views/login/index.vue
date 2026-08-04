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
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <div class="copyright">
        {{ copyright }} &nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://beian.miit.gov.cn/" target="_blank">{{ icp }}</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { websiteStore } from '@/store/modules/sys/config/website/websiteStore';
  import LoginForm from './components/login-form.vue';

  const websiteName = computed(() => websiteStore().website?.websiteName ?? '');
  const copyright = computed(() => websiteStore().website?.copyright ?? '');
  const icp = computed(() => websiteStore().website?.icp ?? '');
</script>

<style lang="less" scoped>
  .wrapper {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: #f1f3f4;
    padding: clamp(16px, 2vw, 32px);
    box-sizing: border-box;

    .logo {
      display: flex;
      align-items: center;
      color: var(--color-black);
      font-weight: 600;
      padding-bottom: clamp(10px, 2vh, 24px);

      .logo-img {
        width: clamp(32px, 5vw, 48px);
        height: clamp(32px, 5vw, 48px);
        object-fit: contain;
      }

      .logo-text {
        margin-left: 12px;
        font-size: clamp(24px, 4vw, 48px);
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    .login-container {
      display: grid;
      place-items: center;
      width: 100%;

      .login-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: min(100%, 1000px);
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;

        .left-side {
          background: url('@/assets/images/login/login-left.png') no-repeat
            center center;
          background-size: contain;
          background-color: #3875e8;
          min-height: 500px;
        }

        .right-side {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
      }

      @media (max-width: 850px) {
        .login-body {
          grid-template-columns: 1fr;
          width: 100%;
          max-width: 500px; /* 适配平板和移动端，限制卡片最大宽度 */

          .left-side {
            display: none;
          }
        }
      }
    }

    .login-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-top: clamp(10px, 2vh, 24px);
      text-align: center;

      .copyright {
        color: var(--color-black);
        font-size: clamp(12px, 1.2vw, 14px);
      }
    }
  }
</style>
