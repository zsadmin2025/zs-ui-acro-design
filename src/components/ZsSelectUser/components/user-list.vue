<template>
  <a-layout class="user-select-center">
    <a-layout-header>
      <a-alert class="user-selected-header">
        <div>待选用户列表：</div>
        <template #action>
          <a-button
            size="small"
            plain
            type="primary"
            @click="useUserSelectStore.addAllSelectedUser"
            >添加当前所有</a-button
          >
        </template>
      </a-alert>
    </a-layout-header>
    <a-layout-content>
      <a-row :gutter="16">
        <a-col :flex="1">
          <a-space :size="18">
            <a-input
              v-model="form.realName"
              placeholder="请输入用户名"
              clearable
              @clear="useUserSelectStore.queryData"
            />
            <a-button type="primary" @click="useUserSelectStore.queryData">
              搜索
            </a-button>
            <a-button @click="useUserSelectStore.resetData">重置</a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        :data="tableData"
        :bordered="false"
        :pagination="false"
        size="medium"
        :scroll="{ x: '100%', y: 'calc(100% - 45px)' }"
      >
        <template #columns>
          <a-table-column align="center" title="序号" type="index" :width="80">
            <template #cell="{ rowIndex }">
              {{ rowIndex + 1 + (form.current - 1) * form.pageSize }}
            </template>
          </a-table-column>
          <a-table-column data-index="username" title="账号" />
          <a-table-column data-index="realName" title="姓名" />
          <a-table-column title="操作" align="center" :width="90">
            <template #cell="{ record }">
              <a-button
                size="small"
                color="#626aef"
                plain
                @click="addSelectedUser(record)"
              >
                添加
              </a-button>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-layout-content>
    <a-layout-footer>
      <a-pagination
        v-model:current="form.current"
        v-model:page-size="form.pageSize"
        :total="total"
        show-total
        size="small"
        @change="useUserSelectStore.handleCurrentChange"
        @page-size-change="useUserSelectStore.handleSizeChange"
      />
    </a-layout-footer>
  </a-layout>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { userSelectStore } from '@/store/modules/sys/user/userSelectStore';
  import { Modal } from '@arco-design/web-vue';

  const useUserSelectStore = userSelectStore();
  const { tableData, total, form, tableAddUserData } =
    storeToRefs(useUserSelectStore);

  const props = defineProps({
    multiple: {
      type: Boolean,
      default: false,
    },
  });

  const addSelectedUser = (row: any) => {
    // 如果是多选模式，则直接添加用户
    if (props.multiple) {
      useUserSelectStore.addSelectedUser(row);
      return;
    }

    // 检查是否已经有用户被添加，如果有则显示警告信息
    if (tableAddUserData.value.length > 0) {
      Modal.warning({
        title: '温馨提示',
        content: '最多只能选择一个用户！',
      });
      return;
    }

    // 单选模式并且没有其他用户被添加，则添加用户
    useUserSelectStore.addSelectedUser(row);
  };

  onMounted(() => {
    useUserSelectStore.queryData();
  });

  // 监听已选用户变化，重新查询数据
  watch(
    () => useUserSelectStore.tableAddUserData,
    () => {
      useUserSelectStore.queryData();
    },
    { deep: true },
  );
</script>

<style lang="less" scoped>
  .user-select-center {
    height: 100%;
    border: 1px solid #ebeef5;

    .arco-layout-header {
      height: 40px;

      .user-selected-header {
        height: 40px;
        border-bottom: 1px solid #ebeef5;
        display: flex;
        justify-content: space-between;
        padding: 0 15px 0 10px;
      }
    }
    .arco-layout-content {
      height: calc(100% - 80px);

      .arco-row {
        padding: 6px 10px;
        border-bottom: 1px solid #ebeef5;
      }
    }

    .arco-layout-footer {
      height: 40px;
      padding: 6px 10px;
      border-top: 1px solid #ebeef5;
    }

    .user-select-list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #ebeef5;
      padding: 2px 10px;
    }
  }
</style>
