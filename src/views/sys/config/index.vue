<template>
  <ZsContainer layout="left-right">
    <template #right-main-body>
      <a-tabs
        v-model:active-key="activeKey"
        :position="position"
        :scroll-position="scrollPosition"
        style="width: 100%; height: 100%; margin-top: 20px"
        :justify="true"
        :animation="true"
      >
        <a-tab-pane key="base" title="基本配置">
          <Website />
        </a-tab-pane>
        <a-tab-pane key="file" title="文件配置">
          <UploadFiles />
        </a-tab-pane>
        <a-tab-pane key="sms" title="短信配置">
          <Sms />
        </a-tab-pane>
        <a-tab-pane key="email" title="邮件配置">
          <Mail />
        </a-tab-pane>
        <!-- <a-tab-pane key="pay" title="支付配置">
          <a-button>支付配置</a-button>
        </a-tab-pane>
        <a-tab-pane key="other" title="其他配置">
          <a-button>其他配置</a-button>
        </a-tab-pane> -->
      </a-tabs>
    </template>
  </ZsContainer>
</template>

<script lang="ts" setup>
  import Website from './components/website.vue';
  import UploadFiles from './components/upload-files.vue';
  import Mail from './components/mail/mail.vue';
  import Sms from './components/sms.vue';

  const position = ref('left');
  const scrollPosition = ref('auto');
  const activeKey = ref('base');
</script>

<style lang="less" scoped>
  .arco-tabs {
    :deep(.arco-tabs-nav) {
      width: 200px;
      .arco-tabs-nav-tab {
        width: 100%;

        .arco-tabs-nav-tab-list {
          .arco-tabs-tab {
            padding: 8px 16px;
            margin-right: 10px;
            border-radius: var(--border-radius);

            .arco-tabs-tab-title::before {
              background-color: transparent;
            }
          }
          .arco-tabs-tab-active {
            background-color: var(--color-fill-2);
          }

          .arco-tabs-tab:hover {
            background-color: var(--color-fill-2);
            border-radius: 4px;
            cursor: pointer;
          }
        }
      }
    }

    :deep(.arco-tabs-content-list) {
      height: 100%;
      .arco-tabs-content-item {
        .arco-tabs-pane {
          height: 100%;
          overflow-y: auto;
        }
      }
    }
  }
  .website-container {
    width: 50%;
  }
</style>
