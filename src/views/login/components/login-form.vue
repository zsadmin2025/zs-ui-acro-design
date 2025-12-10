<template>
  <div class="form_container">
    <div class="logo_container">
      <img alt="ZsAdminlogo" src="@/assets/login-logo.png" class="logo-img" />
    </div>
    <div class="title_container">
      <p class="title">登录</p>
    </div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="tenantId"
        :rules="[{ required: true, message: $t('login.form.tenantId.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-select
          v-model="userInfo.tenantId"
          placeholder="请选择租户"
          allow-clear
          size="large"
          class="login-form-select"
          @change="handleTenantChange"
        >
          <a-option
            v-for="(item, index) in loginStore.tenantList"
            :key="index"
            :value="item.sysTenantId"
            >{{ item.tenantName }}</a-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        field="username"
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.username"
          :placeholder="$t('login.form.userName.placeholder')"
          size="large"
          class="login-form-input"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="$t('login.form.password.placeholder')"
          allow-clear
          size="large"
          class="login-form-input"
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item
        field="code"
        :rules="[{ required: true, message: $t('login.form.code.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.code"
          :placeholder="$t('login.form.code.placeholder')"
          allow-clear
          size="large"
          class="login-form-input"
        >
        </a-input>
        <div class="captcha-container" @click="refreshCaptcha()">
          <img
            :src="loginStore.codeForm.img"
            alt="验证码"
            style="width: 100px; height: 35px"
          />
          <div v-if="captchaExpired" class="captcha-mask">
            <div class="text">点击刷新</div>
          </div>
        </div>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <!--注释，后续放开 <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
          <a-link>{{ $t('login.form.forgetPassword') }}</a-link>
        </div> -->
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="loginConfig.rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t('login.form.rememberPassword') }}
          </a-checkbox>
        </div>
        <a-button
          type="primary"
          html-type="submit"
          long
          :loading="loading"
          class="sign-in_btn"
        >
          {{ $t('login.form.login') }}
        </a-button>
        <!--注释，后续放开
        <a-button type="text" long class="login-form-register-btn">
          {{ $t('login.form.register') }}
        </a-button>-->
      </a-space>
    </a-form>
    <!-- <div class="separator">
      <hr class="line" />
      <span>Or</span>
      <hr class="line" />
    </div>
    <p class="note">Terms of use &amp; Conditions</p> -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { ValidatedError } from '@arco-design/web-vue/es/form/interface';
  import { useI18n } from 'vue-i18n';
  import { useStorage } from '@vueuse/core';
  import { useUserStore } from '@/store';
  import useLoginStore from '@/store/modules/common/loginStore';
  import useLoading from '@/hooks/loading';
  import type { LoginData } from '@/api/user';
  import { setTenantId } from '@/utils/auth';
  import { useWebsocketStore } from '@/store/modules/common/websocketStore';

  const router = useRouter();
  const { t } = useI18n();
  const errorMessage = ref('');
  const { loading, setLoading } = useLoading();
  const userStore = useUserStore();

  const loginStore = useLoginStore();

  const loginConfig = useStorage('login-config', {
    tenantId: '',
    rememberPassword: true,
    username: '',
    password: '',
  });
  const userInfo = reactive({
    tenantId: loginConfig.value.tenantId,
    username: loginConfig.value.username,
    password: loginConfig.value.password,
    code: '',
    uuid: loginStore.codeForm.uuid,
  });

  // 验证码过期状态
  const captchaExpired = ref(false);

  // 启动倒计时
  const startCountdown = () => {
    let countdown = 60;
    const interval = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        clearInterval(interval);
        captchaExpired.value = true;
      }
    }, 1000);
  };

  const refreshCaptcha = () => {
    loginStore.refreshCaptcha();
    captchaExpired.value = false;
    startCountdown();
  };
  const handleSubmit = async ({
    errors,
    values,
  }: {
    errors: Record<string, ValidatedError> | undefined;
    values: Record<string, any>;
  }) => {
    if (loading.value) return;
    if (!errors) {
      setLoading(true);
      try {
        values.uuid = loginStore.codeForm.uuid;
        await userStore.login(values as LoginData);
        router.push('/dashboard/workplace');

        Message.success(t('login.form.login.success'));

        const { rememberPassword } = loginConfig.value;
        const { tenantId, username, password } = values;
        // 实际生产环境需要进行加密存储。
        // The actual production environment requires encrypted storage.
        loginConfig.value.tenantId = tenantId;
        loginConfig.value.username = rememberPassword ? username : '';
        loginConfig.value.password = rememberPassword ? password : '';
      } catch (err) {
        errorMessage.value = (err as Error).message;
      } finally {
        setLoading(false);

        // 连接WebSocket
        useWebsocketStore().connect();
      }
    }
  };
  const setRememberPassword = (value: boolean) => {
    loginConfig.value.rememberPassword = value;
  };

  const handleTenantChange = (value: string) => {
    setTenantId(value);
  };

  onMounted(() => {
    loginStore.getTenantList();
    loginStore.refreshCaptcha();
    startCountdown();
  });
</script>

<style lang="less" scoped>
  .form_container {
    width: 420px;
    max-width: 100%;
    padding: 40px 20px;
  }

  .logo_container {
    width: 100%;
    height: 100%;
    .logo-img {
      width: 100%;
      height: 100px;
      object-fit: contain; // 避免logo变形
    }
  }

  .title_container {
    width: 100%;
    text-align: left;
  }

  .title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #212121;
  }

  .subtitle {
    font-size: 0.725rem;
    max-width: 80%;
    text-align: center;
    line-height: 1.1rem;
    color: #8b8e98;
  }

  .input_container {
    width: 100%;
    height: fit-content;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .icon {
    width: 20px;
    position: absolute;
    z-index: 99;
    left: 12px;
    bottom: 9px;
  }

  .input_label {
    font-size: 0.75rem;
    color: #8b8e98;
    font-weight: 600;
  }

  .input_field {
    width: auto;
    height: 40px;
    padding: 0 0 0 40px;
    border-radius: 7px;
    outline: none;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
  }

  .input_field:focus {
    border: 1px solid transparent;
    box-shadow: 0px 0px 0px 2px #242424;
    background-color: transparent;
  }

  .sign-in_btn {
    width: 100%;
    height: 40px;
    border: 0;
    background: #115dfc;
    border-radius: 7px;
    outline: none;
    color: #ffffff;
    cursor: pointer;
  }

  .sign-in_ggl {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #ffffff;
    border-radius: 7px;
    outline: none;
    color: #242424;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    cursor: pointer;
  }

  .sign-in_apl {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #212121;
    border-radius: 7px;
    outline: none;
    color: #ffffff;
    border: 1px solid #e5e5e5;
    filter: drop-shadow(0px 1px 0px #efefef)
      drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
    cursor: pointer;
  }

  .separator {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 30px;
    color: #8b8e98;
  }

  .separator .line {
    display: block;
    width: 100%;
    height: 1px;
    border: 0;
    background-color: #e8e8e8;
  }

  .captcha-container {
    position: relative;
    display: inline-block;
    cursor: pointer;
    margin-left: 10px;
    width: 100px;
    height: 35px;
  }

  .captcha-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(65, 65, 65, 0.8); /* 半透明白色遮罩 */
    z-index: 2;
    border-radius: var(--border-radius-base);

    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #f3f3f3;
      font-size: 12px;
      z-index: 3;
    }
  }
  .note {
    font-size: 0.75rem;
    color: #8b8e98;
    text-decoration: underline;
  }
  .copyright {
    position: absolute;
    font-size: 12px;
    text-align: center;
    bottom: 24px;
    width: 100%;
  }
  // 验证码区域样式优化
  .login-form-item[field='code'] {
    display: flex;
    align-items: center;
    gap: 8px;

    .login-form-input {
      flex: 1;
    }
  }

  .login-form-password-actions {
    text-align: left;
  }

  // 响应式：移动端适配
  @media (max-width: 480px) {
    .login-form-wrapper {
      width: calc(100vw - 40px);
      padding: 30px 16px;
    }

    .logo-text {
      font-size: 22px;
    }

    .login-form-title {
      font-size: 24px;
    }

    .login-form-item[field='code'] {
      flex-direction: column;
      align-items: stretch;

      img {
        order: -1;
        width: 100%;
        margin-left: 0 !important;
      }
    }
  }
</style>
