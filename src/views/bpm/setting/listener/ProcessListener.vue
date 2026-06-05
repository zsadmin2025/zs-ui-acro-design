<template>
  <div class="process-listener">
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row :gutter="[16, 16]">
          <a-col :flex="1">
            <a-form
              :model="searchForm"
              label-align="left"
              :auto-label-width="true"
            >
              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="监听器名称"
                    ><a-input
                      v-model="searchForm.name"
                      placeholder="请输入监听器名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                  /></a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="事件类型">
                    <a-select
                      v-model="searchForm.eventType"
                      placeholder="请选择事件类型"
                      :allow-clear="true"
                    >
                      <a-option value="TASK_CREATE">任务创建</a-option>
                      <a-option value="TASK_COMPLETE">任务完成</a-option>
                      <a-option value="PROCESS_START">流程启动</a-option>
                      <a-option value="PROCESS_END">流程结束</a-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col flex="1"
                  ><div style="text-align: right"
                    ><a-space :size="9" wrap
                      ><a-button type="primary" @click="store.loadData()"
                        ><template #icon><icon-search /></template
                        >搜索</a-button
                      ><a-button @click="store.resetSearch()"
                        ><template #icon><icon-refresh /></template
                        >重置</a-button
                      ></a-space
                    ></div
                  ></a-col
                >
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12"
            ><a-space
              ><a-button type="primary" @click="store.handleAdd()"
                ><template #icon><icon-plus /></template>新建</a-button
              ></a-space
            ></a-col
          >
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space
              ><a-tooltip content="刷新"
                ><div class="action-icon" @click="store.loadData()"
                  ><icon-refresh size="18" /></div></a-tooltip
              ><DensityDropdown @size-change="handleSizeChange"
            /></a-space>
          </a-col>
        </a-row>
      </template>
      <template #main-body>
        <a-table
          row-key="id"
          :loading="loading"
          :columns="columns"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :pagination="false"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #eventType="{ record }">
            <a-tag v-if="record.eventType === 'TASK_CREATE'" color="blue"
              >任务创建</a-tag
            >
            <a-tag
              v-else-if="record.eventType === 'TASK_COMPLETE'"
              color="green"
              >任务完成</a-tag
            >
            <a-tag
              v-else-if="record.eventType === 'PROCESS_START'"
              color="orange"
              >流程启动</a-tag
            >
            <a-tag v-else-if="record.eventType === 'PROCESS_END'" color="red"
              >流程结束</a-tag
            >
            <span v-else>{{ record.eventType }}</span>
          </template>
          <template #handlerType="{ record }">
            <a-tag v-if="record.handlerType === 'JAVA_CLASS'">Java类</a-tag>
            <a-tag
              v-else-if="record.handlerType === 'EXPRESSION'"
              color="arcoblue"
              >表达式</a-tag
            >
            <a-tag
              v-else-if="record.handlerType === 'DELEGATE_EXPRESSION'"
              color="purple"
              >委托表达式</a-tag
            >
            <span v-else>{{ record.handlerType }}</span>
          </template>
          <template #status="{ record }"
            ><ZsStatus :value="record.status"
          /></template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link @click="store.handleEdit(record)"
                ><template #icon><icon-edit /></template>编辑</a-link
              >
              <a-link status="danger" @click="store.handleDelete(record)"
                ><template #icon><icon-delete /></template>删除</a-link
              >
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="store.loadData()"
          @page-size-change="store.loadData()"
        />
      </template>
    </zs-container>

    <a-modal
      v-model:visible="dialogVisible"
      :title="store.form.id ? '编辑监听器' : '新建监听器'"
      @ok="store.handleSubmit()"
    >
      <a-form ref="formRef" :model="store.form" auto-label-width>
        <a-form-item
          label="监听器名称"
          field="name"
          :rules="[{ required: true, message: '请输入名称' }]"
          ><a-input v-model="store.form.name" placeholder="请输入监听器名称"
        /></a-form-item>
        <a-form-item
          label="事件类型"
          field="eventType"
          :rules="[{ required: true, message: '请选择事件类型' }]"
        >
          <a-select v-model="store.form.eventType" placeholder="请选择事件类型">
            <a-option value="TASK_CREATE">任务创建</a-option
            ><a-option value="TASK_COMPLETE">任务完成</a-option>
            <a-option value="PROCESS_START">流程启动</a-option
            ><a-option value="PROCESS_END">流程结束</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="处理器类型"
          field="handlerType"
          :rules="[{ required: true, message: '请选择处理器类型' }]"
        >
          <a-select
            v-model="store.form.handlerType"
            placeholder="请选择处理器类型"
          >
            <a-option value="JAVA_CLASS">Java类</a-option
            ><a-option value="EXPRESSION">表达式</a-option
            ><a-option value="DELEGATE_EXPRESSION">委托表达式</a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="处理器值"
          field="handlerValue"
          :rules="[{ required: true, message: '请输入处理器值' }]"
          ><a-input
            v-model="store.form.handlerValue"
            placeholder="如：com.example.MyListener"
        /></a-form-item>
        <a-form-item label="状态" field="status"
          ><a-switch
            v-model="store.form.status"
            :checked-value="1"
            :unchecked-value="0"
            type="round"
            ><template #checked>启用</template
            ><template #unchecked>禁用</template></a-switch
          ></a-form-item
        >
        <a-form-item label="描述" field="description"
          ><a-textarea
            v-model="store.form.description"
            placeholder="请输入描述"
            :auto-size="{ minRows: 2 }"
        /></a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useProcessListenerStore } from '@/store/modules/bpm/setting/processListenerStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useProcessListenerStore();
  const appStore = useAppStore();
  const {
    loading,
    list,
    total,
    searchForm,
    pagination,
    dialogVisible,
    formRef,
  } = storeToRefs(store);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${
          rowIndex +
          1 +
          (pagination.value.current - 1) * pagination.value.pageSize
        }`,
      width: 60,
      align: 'center',
    },
    {
      title: '监听器名称',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      slotName: 'eventType',
      width: 120,
      align: 'center',
    },
    {
      title: '处理器类型',
      dataIndex: 'handlerType',
      slotName: 'handlerType',
      width: 120,
      align: 'center',
    },
    {
      title: '处理器值',
      dataIndex: 'handlerValue',
      ellipsis: true,
      tooltip: true,
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    { title: '创建时间', dataIndex: 'createTime', width: 180 },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 140,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  onMounted(() => {
    store.loadData();
  });
  onUnmounted(() => {
    store.resetState();
  });
</script>

<style lang="less" scoped>
  .process-listener {
    height: 100%;
  }
  .action-icon {
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
    &:hover {
      background-color: var(--color-fill-2);
    }
  }
</style>
