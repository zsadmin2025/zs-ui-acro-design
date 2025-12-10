<template>
  <div>
    <zs-container layout="left-right">
      <template #left>
        <ZsDept @node-click="postStore.handleNodeClick" />
      </template>
      <template #right-header>
        <a-row :gutter="16" style="width: fit-content">
          <a-col :flex="1">
            <a-form :model="form" label-align="left" :auto-label-width="true">
              <a-form-item label="岗位名称">
                <a-input
                  v-model="form.postName"
                  :allow-clear="true"
                  placeholder="请输入岗位名称"
                />
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :flex="'86px'">
            <a-space :size="18">
              <a-button type="primary" @click="postStore.loadPostPage">
                <template #icon>
                  <icon-search />
                </template>
                {{ $t('searchTable.form.search') }}
              </a-button>
              <a-button @click="postStore.resetSearch">
                <template #icon>
                  <icon-refresh />
                </template>
                {{ $t('searchTable.form.reset') }}
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #right-main-header>
        <a-row justify="space-between" align="center">
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'sys:post:save'"
                type="primary"
                @click="postStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <a-button
                v-permission="'sys:post:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="postStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'sys:post:export'"
                @click="postStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                <template #default>导出</template>
              </a-button>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => postStore.resetSearch()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #right-main-body>
        <a-table
          v-model:selected-keys="selectedKeys"
          :row-selection="rowSelection"
          row-key="sysPostId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
        >
          <template #status="{ record }">
            <ZsStatus :value="record.status" />
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'sys:post:update'"
                @click="postStore.handleAddOrEdit(record)"
              >
                <template #icon>
                  <icon-edit />
                </template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'sys:post:delete'"
                status="danger"
                @click="postStore.handleDelete(record)"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-link>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #right-footer>
        <a-pagination
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          show-total
          show-jumper
          show-page-size
          @change="postStore.handleCurrentChange"
          @page-size-change="postStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <PostAddOrEdit ref="addEditRef" @refresh="postStore.loadPostPage" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, reactive, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { usePostStore } from '@/store/modules/sys/position/postStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import ZsDept from '@/components/zs-dept/index.vue';
  import PostAddOrEdit from './components/post-add-or-edit.vue';

  const postStore = usePostStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(postStore);

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
      width: 60,
      align: 'center',
    },
    {
      title: '岗位名称',
      dataIndex: 'postName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      slotName: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 150,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size;
  };
  onMounted(() => {
    postStore.loadPostPage();
  });
</script>

<style scoped lang="less">
  .post-container {
    padding: 0 20px 20px 20px;
  }
  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }
  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }
  .setting {
    display: flex;
    align-items: center;
    width: 200px;
    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
