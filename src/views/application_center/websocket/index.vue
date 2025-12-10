<template>
  <zs-container layout="header-main-footer">
    <template #main-body>
      <div>websocket</div>
      <div>发送全部</div>
      <button @click="websocketStore.sendAll({ message: 'hello world' })"
        >发送全部</button
      >
      <div>发送私信</div>
      <button
        @click="
          websocketStore.sendUser('1633833655917559809', {
            message: 'hello world',
          })
        "
        >发送私信</button
      >
      <div>断开连接</div>
      <button @click="websocketStore.disconnect">断开连接</button>
    </template>
  </zs-container>
</template>

<script setup lang="ts">
  import { useWebsocketStore } from '@/store/modules/common/websocketStore';

  const websocketStore = useWebsocketStore();

  // 使用 $state 显式获取状态避免类型问题
  const isConnected = computed(() => websocketStore.isConnected);

  onMounted(() => {
    if (!isConnected.value) {
      websocketStore.connect();
    }
  });

  onUnmounted(() => {
    websocketStore.disconnect();
  });
</script>
