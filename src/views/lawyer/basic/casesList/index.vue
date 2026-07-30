<template>
  <div>
    <zs-container layout="left-right" left-box-width="200px">
      <template #left>
        <div class="tree-container">
          <a-tree
            ref="treeRef"
            :data="caseType"
            :field-names="fieldNames"
            :show-line="true"
            @select="listStore.handleNodeClick"
          >
          </a-tree>
        </div>
      </template>
      <template #right-header>
        <a-row>
          <a-col :span="12">
            <a-space>
              <a-button
                v-permission="'cases:list:save'"
                type="primary"
                @click="listStore.handleAddOrEdit(null)"
              >
                <template #icon>
                  <icon-plus />
                </template>
                {{ $t('searchTable.operation.create') }}
              </a-button>
              <!-- <a-button
                v-permission="'cases:list:batchDelete'"
                type="primary"
                status="danger"
                :disabled="selectedKeys.length === 0"
                @click="listStore.handleDeleteSelected()"
              >
                <template #icon>
                  <icon-delete />
                </template>
                <template #default>删除</template>
              </a-button>
              <a-button
                v-permission="'cases:list:export'"
                @click="listStore.handleExport()"
              >
                <template #icon>
                  <icon-download />
                </template>
                {{ $t('searchTable.operation.download') }}
              </a-button> -->
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-input-search
                v-model="form.fileName"
                placeholder="请输入文件名"
                :allow-clear="true"
                @search="listStore.fetchData"
              >
              </a-input-search>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => listStore.reset()"
                  ><icon-refresh size="18"
                /></div>
              </a-tooltip>
              <!-- <a-tooltip content="高级筛元>
                <icon-double-up
                  v-if="queryVisible"
                  size="18"
                  @click="handleAdvancedSearch"
                />
                <icon-double-down
                  v-else
                  size="18"
                  @click="handleAdvancedSearch"
                />
              </a-tooltip> -->
              <DensityDropdown @size-change="handleSizeChange" />
            </a-space>
          </a-col>
        </a-row>
      </template>
      <template #right-main>
        <a-table
          v-model:selected-keys="selectedKeys"
          row-key="caseListId"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #fileOriginalName="{ record }">
            <a-link
              :hoverable="false"
              @click="downloadFile(record.fileUrl, record.fileOriginalName)"
              >{{ record.fileOriginalName ?? '' }}</a-link
            >
          </template>
          <template #isRequired="{ record }">
            <a-switch
              v-model="record.isRequired"
              :checked-value="1"
              :unchecked-value="0"
              type="round"
              @change="listStore.handleIsRequiredChange(record)"
            >
              <template #checked> 是</template>
              <template #unchecked> 否</template>
            </a-switch>
          </template>
          <template #operations="{ record }">
            <a-space size="mini">
              <a-link
                v-permission="'cases:list:update'"
                @click="listStore.handleAddOrEdit(record)"
              >
                <template #icon><icon-edit /></template>
                <template #default>编辑</template>
              </a-link>
              <a-link
                v-permission="'cases:list:delete'"
                status="danger"
                @click="listStore.handleDelete(record)"
              >
                <template #icon><icon-delete /></template>
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
          @change="listStore.handleCurrentChange"
          @page-size-change="listStore.handleSizeChange"
        />
      </template>
    </zs-container>
    <ListAddOrEdit ref="addEditRef" @refresh="listStore.fetchData" />
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  import { useListStore } from '@/store/modules/lawyer/basic/casesList/listStore';
  import DensityDropdown from '@/components/density-dropdown/index.vue';
  import { useDicts } from '@/hooks/dict';
  import download from '@/utils/fileDownload';
  import ListAddOrEdit from './components/list-add-or-edit.vue';

  const listStore = useListStore();
  const { addEditRef, loading, list, total, form, selectedKeys } =
    storeToRefs(listStore);

  const fieldNames = {
    children: 'children',
    title: 'dictLabel',
    key: 'dictValue',
  };

  const caseType = useDicts('caseType').caseType as any;

  const expandedKeys = ref<string[]>(
    (caseType.value as any[]).map((item) => item.sysDictDataId),
  );

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 80,
      align: 'center',
    },
    {
      title: '文件名称',
      dataIndex: 'fileName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '模板文档',
      dataIndex: 'fileOriginalName',
      slotName: 'fileOriginalName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '结案是否必填',
      dataIndex: 'isRequired',
      slotName: 'isRequired',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 160,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const downloadFile = async (url: string, fileName: string) => {
    download.url(url, fileName);
  };
  onBeforeMount(() => {
    listStore.fetchData();
  });
</script>

<style lang="less" scoped>
  .tree-container {
    height: 100%;
    overflow: auto;
  }
</style>
