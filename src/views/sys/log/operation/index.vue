<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="username" label="用户名">
                    <a-input v-model="form.username" placeholder="用户名" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="module" label="功能模块">
                    <a-input v-model="form.module" placeholder="功能模块" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="ipAddress" label="ip地址">
                    <a-input v-model="form.ipAddress" placeholder="ip地址" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="operationType" label="操作类型">
                    <a-input
                      v-model="form.operationType"
                      placeholder="操作类型"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="operationDescription" label="操作描述">
                    <a-input
                      v-model="form.operationDescription"
                      placeholder="操作描述"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="requestMethod" label="请求方法">
                    <a-input
                      v-model="form.requestMethod"
                      placeholder="请求方法"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="requestPath" label="请求路径">
                    <a-input
                      v-model="form.requestPath"
                      placeholder="请求路径"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="responseStatusCode" label="响应状态码">
                    <a-input
                      v-model="form.responseStatusCode"
                      placeholder="响应状态码"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="logOperationStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="logOperationStore.reset">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:logOperation:export'"
                @click="logOperationStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                导出
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div
                  class="action-icon"
                  @click="() => logOperationStore.reset()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          v-model:selected-keys="selectedKeys"
          :row-selection="rowSelection"
          row-key="sysLogOperationId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <span v-if="record.status === 0" class="circle fail"></span>
            <span v-else-if="record.status === 1" class="circle pass"></span>
            <span v-if="record.status === 0"> 禁用 </span>
            <span v-else-if="record.status === 1"> 启用 </span>
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link @click="logOperationStore.handleDetails(record)">
                <template #icon>
                  <icon-eye />
                </template>
                <template #default>详情</template>
              </a-link>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          show-total
          show-jumper
          show-page-size
          @change="logOperationStore.handleCurrentChange"
          @page-size-change="logOperationStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <Detail ref="addEditRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, onMounted, reactive, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useLogOperationStore } from '@/store/modules/sys/log/operationLogStore';
  import Detail from './components/detail.vue';

  const logOperationStore = useLogOperationStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(logOperationStore);

  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '功能模块',
      dataIndex: 'module',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: 'ip地址',
      dataIndex: 'ipAddress',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '操作类型',
      dataIndex: 'operationType',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '操作描述',
      dataIndex: 'operationDescription',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '请求方法',
      dataIndex: 'requestMethod',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '请求路径',
      dataIndex: 'requestPath',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '响应状态码',
      dataIndex: 'responseStatusCode',
      ellipsis: true,
      tooltip: true,
      width: 120,
    },
    {
      title: '响应消息',
      dataIndex: 'responseMessage',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '操作耗时',
      dataIndex: 'operationDuration',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 100,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    logOperationStore.fetchData();
  });
</script>
