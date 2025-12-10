<template>
  <div class="container">
    <a-row :gutter="16">
      <!-- 左侧：用户面板 -->
      <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6" :xxl="5">
        <UserPanel />
      </a-col>

      <!-- 右侧：设置选项卡 -->
      <a-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18" :xxl="19">
        <a-card class="wrapper">
          <a-tabs default-active-key="1" type="rounded">
            <a-tab-pane key="1" :title="$t('userSetting.tab.basicInformation')">
              <BasicInformation />
            </a-tab-pane>
            <a-tab-pane key="2" :title="$t('userSetting.tab.securitySettings')">
              <SecuritySettings />
            </a-tab-pane>
            <!-- <a-tab-pane key="3" :title="$t('userSetting.tab.certification')">
              <Certification />
            </a-tab-pane> -->
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import UserPanel from './components/user-panel.vue';
  import BasicInformation from './components/basic-information.vue';
  import SecuritySettings from './components/security-settings.vue';
  import Certification from './components/certification.vue';
</script>

<script lang="ts">
  export default {
    name: 'Setting',
  };
</script>

<style scoped lang="less">
  .wrapper {
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
