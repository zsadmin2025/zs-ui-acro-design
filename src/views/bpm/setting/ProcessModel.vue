<template>
  <div class="process-model">
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
                  <a-form-item label="模型名称">
                    <a-input
                      v-model="searchForm.name"
                      placeholder="请输入模型名称"
                      :allow-clear="true"
                      @press-enter="loadData"
                    />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6" :xxl="6">
                  <a-form-item label="KEY">
                    <a-input
                      v-model="searchForm.key"
                      placeholder="请输入KEY"
                      :allow-clear="true"
                      @press-enter="loadData"
                    />
                  </a-form-item>
                </a-col>
                <a-col flex="1">
                  <div style="text-align: right">
                    <a-space :size="9" wrap>
                      <a-button type="primary" @click="loadData">
                        <template #icon><icon-search /></template>
                        搜索
                      </a-button>
                      <a-button @click="resetSearch">
                        <template #icon><icon-refresh /></template>
                        重置
                      </a-button>
                    </a-space>
                  </div>
                </a-col>
              </a-row>
            </a-form>
          </a-col>
        </a-row>
      </template>
      <template #main-header>
        <a-row justify="space-between" align="center">
          <a-col :xs="24" :sm="12">
            <a-space>
              <a-button type="primary" @click="handleAdd">
                <template #icon><icon-plus /></template>
                新建
              </a-button>
            </a-space>
          </a-col>
          <a-col
            v-if="appStore.device !== 'mobile'"
            :xs="24"
            :sm="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip content="刷新">
                <div class="action-icon" @click="loadData">
                  <icon-refresh size="18" />
                </div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
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
          <template #status="{ record }">
            <a-tag v-if="record.status === 0" color="orange">草稿</a-tag>
            <a-tag v-else-if="record.status === 1" color="green">已部署</a-tag>
            <span v-else>-</span>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link @click="handleEdit(record)">
                <template #icon><icon-edit /></template>
                编辑
              </a-link>
              <a-link
                v-if="record.status !== 1"
                status="success"
                @click="handleDeploy(record)"
              >
                <template #icon><icon-send /></template>
                部署
              </a-link>
              <a-link status="danger" @click="handleDelete(record)">
                <template #icon><icon-delete /></template>
                删除
              </a-link>
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
          @change="loadData"
          @page-size-change="loadData"
        />
      </template>
    </zs-container>

    <!-- 新建/编辑弹窗 -->
    <a-modal
      v-model:visible="dialogVisible"
      :title="form.id ? '编辑模型' : '新建模型'"
      @ok="handleSubmit"
    >
      <a-form ref="formRef" :model="form" auto-label-width>
        <a-form-item
          label="模型名称"
          field="name"
          :rules="[{ required: true, message: '请输入模型名称' }]"
        >
          <a-input v-model="form.name" placeholder="请输入模型名称" />
        </a-form-item>
        <a-form-item
          label="KEY"
          field="key"
          :rules="[{ required: true, message: '请输入KEY' }]"
        >
          <a-input v-model="form.key" placeholder="请输入KEY" />
        </a-form-item>
        <a-form-item label="分类" field="category">
          <a-input v-model="form.category" placeholder="请输入分类" />
        </a-form-item>
        <a-form-item label="描述" field="description">
          <a-textarea
            v-model="form.description"
            placeholder="请输入描述"
            :auto-size="{ minRows: 2 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { Modal, Message } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { bpmSettingApi } from '@/api/bpm/setting';
  import type { ProcessModelItem } from '@/types/bpm/bpmTypes';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const appStore = useAppStore();

  const loading = ref(false);
  const list = ref<ProcessModelItem[]>([]);
  const total = ref(0);
  const currentSize = ref('medium');
  const searchForm = reactive({ name: '', key: '' });
  const pagination = reactive({ current: 1, pageSize: 10 });

  const dialogVisible = ref(false);
  const formRef = ref();
  const form = reactive({
    id: '',
    name: '',
    key: '',
    category: '',
    description: '',
  });

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '#',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (pagination.current - 1) * pagination.pageSize}`,
      width: 60,
      align: 'center',
    },
    {
      title: '模型名称',
      dataIndex: 'name',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: 'KEY',
      dataIndex: 'key',
      ellipsis: true,
      tooltip: true,
      width: 180,
    },
    { title: '分类', dataIndex: 'category', width: 120 },
    { title: '版本', dataIndex: 'version', width: 80, align: 'center' },
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
      width: 200,
      align: 'center',
      fixed: appStore.device === 'mobile' ? undefined : 'right',
      cellStyle: { whiteSpace: 'nowrap' },
    },
  ]);

  const loadData = async () => {
    loading.value = true;
    try {
      const { data } = await bpmSettingApi.getModelPage({
        ...searchForm,
        current: pagination.current,
        pageSize: pagination.pageSize,
      });
      const result = data?.data ?? data;
      list.value = result?.list ?? result?.records ?? [];
      total.value = result?.total ?? 0;
    } finally {
      loading.value = false;
    }
  };

  const resetSearch = () => {
    searchForm.name = '';
    searchForm.key = '';
    pagination.current = 1;
    loadData();
  };

  const handleAdd = () => {
    Object.assign(form, {
      id: '',
      name: '',
      key: '',
      category: '',
      description: '',
    });
    dialogVisible.value = true;
  };

  const handleEdit = async (record: ProcessModelItem) => {
    const { data } = await bpmSettingApi.getModelById(record.id);
    Object.assign(form, data?.data ?? data);
    dialogVisible.value = true;
  };

  const handleSubmit = async () => {
    const errors = await formRef.value?.validate();
    if (errors) return;
    const action = form.id
      ? bpmSettingApi.updateModel
      : bpmSettingApi.saveModel;
    await action({ ...form });
    Message.success(form.id ? '更新成功' : '创建成功');
    dialogVisible.value = false;
    loadData();
  };

  const handleDeploy = (record: ProcessModelItem) => {
    Modal.confirm({
      title: '确认部署',
      titleAlign: 'start',
      content: `确定部署模型「${record.name}」吗？`,
      onOk: async () => {
        await bpmSettingApi.deployModel(record.id);
        Message.success('部署成功');
        loadData();
      },
    });
  };

  const handleDelete = (record: ProcessModelItem) => {
    Modal.confirm({
      title: '确认删除',
      titleAlign: 'start',
      content: `确定删除模型「${record.name}」吗？`,
      onOk: async () => {
        await bpmSettingApi.deleteModel(record.id);
        Message.success('删除成功');
        loadData();
      },
    });
  };

  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };

  onMounted(() => {
    loadData();
  });
</script>

<style lang="less" scoped>
  .process-model {
    height: 100%;
    .action-icon {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.2s;
      &:hover {
        background-color: var(--color-fill-2);
      }
    }
  }
</style>
