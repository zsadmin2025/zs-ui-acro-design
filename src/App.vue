<template>
  <a-config-provider :locale="locale">
    <!-- <template #empty="scope">
      <a-empty
        v-if="scope?.component === 'cascader'"
        description="cascader no data!"
        in-config-provider
      >
      </a-empty>
      <a-empty
        v-else-if="scope?.component === 'select'"
        description="select no data!"
        in-config-provider
      ></a-empty>
      <a-empty
        v-else-if="scope?.component === 'tree-select'"
        description="tree-select no data!"
        in-config-provider
      ></a-empty>
      <a-empty
        v-else-if="scope?.component === 'list'"
        description="list no data!"
        in-config-provider
      ></a-empty>
      <a-empty
        v-else-if="scope?.component === 'table'"
        description="table no data!"
        in-config-provider
      ></a-empty>
      <div v-else class="my-empty">
        <icon-trophy />
      </div>
    </template> -->
    <router-view />
    <global-setting />
  </a-config-provider>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import enUS from '@arco-design/web-vue/es/locale/lang/en-us';
  import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn';
  import GlobalSetting from '@/components/global-setting/index.vue';
  import useLocale from '@/hooks/locale';
  import { useDictDataStore } from '@/store/modules/sys/dict/dictDataStore';
  import { isLogin } from '@/utils/auth';
  // import useWebsocket from '@/hooks/websocket';
  import { useWebsocketStore } from '@/store/modules/common/websocketStore';
  import { useAppStore } from '@/store';

  const dictDataStore = useDictDataStore();

  const wsStore = useWebsocketStore();

  const appStore = useAppStore();

  async function initWebSocket() {
    if (isLogin()) {
      await wsStore.connect();
      wsStore.registerMessageHandlers();
    } else {
      wsStore.disconnect();
    }
  }

  // ✅ 页面卸载前主动断开 WebSocket（关键！）
  onBeforeUnmount(() => {
    wsStore.disconnect();
  });

  onMounted(async () => {
    appStore.initTheme();
    if (isLogin()) {
      dictDataStore.loadDictDataList();

      initWebSocket();
    }
  });

  const { currentLocale } = useLocale();
  const locale = computed(() => {
    switch (currentLocale.value) {
      case 'zh-CN':
        return zhCN;
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  });
</script>
