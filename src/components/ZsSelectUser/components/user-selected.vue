<template>
  <div class="user-selected">
    <a-alert class="user-selected-header">
      <div>已选用户列表:</div>
      <template #action>
        <a-button
          size="small"
          plain
          type="primary"
          @click="useUserSelectStore.removeAllSelectedUser"
          >清空所选</a-button
        >
      </template>
    </a-alert>
    <div class="user-selected-main">
      <div
        v-for="(item, index) in tableAddUserData"
        :key="index"
        class="scrollbar-demo-item"
      >
        <div>
          {{ item.realName }}
        </div>
        <a-button
          type="text"
          status="danger"
          @click="useUserSelectStore.removeSelectedUser(item)"
        >
          <template #icon>
            <icon-delete />
          </template>
        </a-button>
      </div>
    </div>
    <div class="user-selected-footer">
      {{ '共' + tableAddUserData.length + '条' }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { userSelectStore } from '@/store/modules/sys/user/userSelectStore';

  const useUserSelectStore = userSelectStore();
  const { tableAddUserData } = storeToRefs(useUserSelectStore);
</script>

<style lang="less" scoped>
  .user-selected {
    height: 100%;
    border: 1px solid #ebeef5;
    .user-selected-header {
      height: 40px;
      border-bottom: 1px solid #ebeef5;
      display: flex;
      justify-content: space-between;
      padding: 0 15px 0 10px;
    }
    .user-selected-main {
      height: calc(100% - 80px);
      overflow-y: auto;
      .scrollbar-demo-item {
        display: flex;
        justify-content: space-between;
        padding: 6px 15px 0 10px;
      }
    }

    .user-selected-footer {
      height: 40px;
      padding: 0 15px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      border-top: 1px solid #ebeef5;
    }
  }
</style>
