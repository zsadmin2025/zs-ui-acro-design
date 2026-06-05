<template>
  <div class="user-group">
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
                  <a-form-item label="分组名称"
                    ><a-input
                      v-model="searchForm.groupName"
                      placeholder="请输入分组名称"
                      :allow-clear="true"
                      @press-enter="store.loadData()"
                  /></a-form-item>
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
          <template #userNames="{ record }">
            <a-space
              v-if="record.userNames && record.userNames.length > 0"
              wrap
              size="mini"
            >
              <a-tag
                v-for="(name, idx) in record.userNames.slice(0, 3)"
                :key="idx"
                size="small"
                >{{ name }}</a-tag
              >
              <a-tag v-if="record.userNames.length > 3" size="small"
                >+{{ record.userNames.length - 3 }}</a-tag
              >
            </a-space>
            <span v-else>-</span>
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
      :title="store.form.id ? '编辑分组' : '新建分组'"
      :width="appStore.device === 'mobile' ? '90%' : '50%'"
      @ok="store.handleSubmit()"
    >
      <a-form ref="formRef" :model="store.form" auto-label-width>
        <a-form-item
          label="分组名称"
          field="groupName"
          :rules="[{ required: true, message: '请输入分组名称' }]"
          ><a-input v-model="store.form.groupName" placeholder="请输入分组名称"
        /></a-form-item>
        <a-form-item label="分组编码" field="groupCode"
          ><a-input v-model="store.form.groupCode" placeholder="请输入分组编码"
        /></a-form-item>
        <a-form-item label="成员"
          ><ZsSelectUser
            v-model="store.form.userIds"
            :multiple="true"
            @on-select="store.handleUserSelect"
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
  import { useUserGroupStore } from '@/store/modules/bpm/setting/userGroupStore';
  import { useAppStore } from '@/store';
  import DensityDropdown from '@/components/density-dropdown/index.vue';

  const store = useUserGroupStore();
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
      title: '分组名称',
      dataIndex: 'groupName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    { title: '编码', dataIndex: 'groupCode', width: 150 },
    {
      title: '成员',
      dataIndex: 'userNames',
      slotName: 'userNames',
      width: 250,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      width: 100,
      align: 'center',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      tooltip: true,
      width: 200,
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
  .user-group {
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
