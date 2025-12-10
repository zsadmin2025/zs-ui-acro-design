<template>
  <div>
    <zs-container layout="header-main-footer">
      <!-- 搜索表单 -->
      <template #header>
        <a-row :gutter="16">
          <a-col :flex="1">
            <a-form :model="form" :auto-label-width="true" label-align="left">
              <a-row :gutter="16">
                <a-col :span="6">
                  <a-form-item field="username" label="登录用户名">
                    <a-input v-model="form.username" placeholder="登录用户名" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="ipAddress" label="请求IP">
                    <a-input
                      v-model="form.ipAddress"
                      placeholder="请求IP地址"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="module" label="所属模块">
                    <a-input v-model="form.module" placeholder="所属模块" />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="exceptionType" label="错误类型">
                    <a-input
                      v-model="form.exceptionType"
                      placeholder="错误类型"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="requestPath" label="请求接口">
                    <a-input
                      v-model="form.requestPath"
                      placeholder="请求接口"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item field="requestMethod" label="请求方式">
                    <a-select
                      v-model="form.requestMethod"
                      placeholder="请求方式"
                      allow-clear
                      style="width: 100%"
                    >
                      <a-option value="GET">GET</a-option>
                      <a-option value="POST">POST</a-option>
                      <a-option value="PUT">PUT</a-option>
                      <a-option value="DELETE">DELETE</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
          <a-col :flex="'86px'" style="text-align: right">
            <a-space :size="18">
              <a-button type="primary" @click="errorLogStore.fetchData">
                <template #icon>
                  <icon-search />
                </template>
                查询
              </a-button>
              <a-button @click="errorLogStore.reset">
                <template #icon>
                  <icon-refresh />
                </template>
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>

      <!-- 表格头部操作栏 -->
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:logerror:export'"
                @click="errorLogStore.handleExport()"
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
              <a-tooltip content="刷新">
                <div class="action-icon" @click="errorLogStore.reset">
                  <icon-refresh size="18" />
                </div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>

      <!-- 表格主体 -->
      <template #main-body>
        <a-table
          v-model:selected-keys="selectedKeys"
          :row-selection="rowSelection"
          row-key="id"
          :loading="loading"
          :pagination="false"
          :columns="columns"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #requestMethod="{ record }">
            <a-tag v-if="record.requestMethod === 'GET'" color="blue"
              >GET</a-tag
            >
            <a-tag v-else-if="record.requestMethod === 'POST'" color="green"
              >POST</a-tag
            >
            <a-tag v-else-if="record.requestMethod === 'PUT'" color="orange"
              >PUT</a-tag
            >
            <a-tag v-else-if="record.requestMethod === 'DELETE'" color="red"
              >DELETE</a-tag
            >
            <span v-else>{{ record.requestMethod }}</span>
          </template>
          <template #exceptionType="{ record }">
            <span v-if="record.exceptionType === 'BusinessException'"
              >业务异常</span
            >
            <span v-else-if="record.exceptionType === 'SystemException'"
              >系统异常</span
            >
            <span v-else>{{ record.exceptionType }}</span>
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link @click="errorLogStore.handleDetails(record)">
                <template #icon>
                  <icon-eye />
                </template>
                <template #default>详情</template>
              </a-link>
            </a-space>
          </template>
        </a-table>
      </template>

      <!-- 分页 -->
      <template #footer>
        <a-pagination
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          show-total
          show-jumper
          show-page-size
          @change="errorLogStore.handleCurrentChange"
          @page-size-change="errorLogStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <Detail ref="addEditRef" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useErrorLogStore } from '@/store/modules/sys/log/errorlogStore';
  import Detail from './components/detail.vue';

  const errorLogStore = useErrorLogStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(errorLogStore);

  // 表格多选配置
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: true,
  });

  // 表格列定义
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
      title: '登录用户名',
      dataIndex: 'username',
      ellipsis: true,
      tooltip: true,
      width: 100,
    },
    {
      title: '所属模块',
      dataIndex: 'module',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '请求接口',
      dataIndex: 'requestPath',
      ellipsis: true,
      tooltip: true,
      width: 300,
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      slotName: 'requestMethod',
      width: 120,
      align: 'center',
    },
    // {
    //   title: '请求参数',
    //   dataIndex: 'requestParams',
    //   ellipsis: true,
    //   tooltip: true,
    //   width: 200,
    // },
    {
      title: '请求IP地址',
      dataIndex: 'ipAddress',
      ellipsis: true,
      tooltip: true,
      width: 150,
    },
    {
      title: '错误类型',
      dataIndex: 'exceptionType',
      slotName: 'exceptionType',
      ellipsis: true,
      tooltip: true,
      width: 350,
    },
    // {
    //   title: '错误详情',
    //   dataIndex: 'exceptionMessage',
    //   ellipsis: true,
    //   tooltip: true,
    // },
    {
      title: '请求时间',
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

  // 表格尺寸（密度）
  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  // 初始化加载数据
  onMounted(() => {
    errorLogStore.fetchData();
  });
</script>
