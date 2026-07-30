<template>
  <div>
    <zs-container layout="header-main-footer">
      <template #header>
        <a-row>
          <a-col :span="12">
            <a-space>
              <a-input-search
                v-model="form.caseName"
                placeholder="请输入项目名称"
                :allow-clear="true"
                @input="projectStore.fetchData"
                @clear="projectStore.fetchData"
              >
              </a-input-search>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="display: flex; align-items: center; justify-content: end"
          >
            <a-space>
              <a-select
                v-model="form.approveStatus"
                placeholder="请选择状态"
                allow-clear
                style="width: 150px"
              >
                <a-option :value="1">待审批</a-option>
                <a-option :value="2">通过</a-option>
                <a-option :value="0">否决</a-option>
              </a-select>
              <a-tooltip :content="$t('searchTable.actions.refresh')">
                <div class="action-icon" @click="() => projectStore.reset()"
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
          row-key="caseInfo"
          :loading="loading"
          :pagination="false"
          :columns="(columns as TableColumnData[])"
          :data="list"
          :bordered="false"
          :size="currentSize"
          :scroll="{ x: '100%', y: '100%' }"
          :table-layout-fixed="true"
        >
          <template #approveStatus="{ record }">
            <span
              v-if="record.caseInfo.approveStatus === 0"
              class="circle fail"
            ></span>
            <span
              v-else-if="record.caseInfo.approveStatus === 1"
              class="circle warning"
            ></span>
            <span
              v-else-if="record.caseInfo.approveStatus === 2"
              class="circle pass"
            ></span>
            <span v-if="record.caseInfo.approveStatus === 0"> 否决 </span>
            <span v-else-if="record.caseInfo.approveStatus === 1">
              待审批
            </span>
            <span v-else-if="record.caseInfo.approveStatus === 2">通过</span>
          </template>
          <template #operations="{ record }">
            <a-space>
              <a-link
                v-if="record.caseInfo.approveStatus === 1"
                status="warning"
                @click="handleDetail(record)"
              >
                审批
              </a-link>
              <a-link v-else @click="handleDetail(record)"> 查看 </a-link>
            </a-space>
          </template>
        </a-table>
      </template>
      <template #footer>
        <a-pagination
          v-model:current="form.current"
          v-model:page-size="form.pageSize"
          :total="total"
          :show-total="appStore.device !== 'mobile'"
          :show-jumper="appStore.device !== 'mobile'"
          :show-page-size="appStore.device !== 'mobile'"
          :simple="appStore.device === 'mobile'"
          @change="projectStore.handleCurrentChange"
          @page-size-change="projectStore.handleSizeChange"
        />
      </template>
    </zs-container>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed, ref, onMounted } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useDicts } from '@/hooks/dict';
  import { useProjectStore } from '@/store/modules/lawyer/approve/project/projectStore';
  import { useAppStore } from '@/store';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const projectStore = useProjectStore();
  const appStore = useAppStore();
  const { loading, list, total, form, selectedKeys } =
    storeToRefs(projectStore);

  const { getLabel } = useDicts('caseLitigationStatus');

  const columns = computed<TableColumnData[]>(() => [
    {
      title: '序号',
      dataIndex: 'index',
      render: ({ rowIndex }) =>
        `${rowIndex + 1 + (form.value.current - 1) * form.value.pageSize}`,
      width: 60,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '案件编号',
      dataIndex: 'caseNo',
      ellipsis: true,
      tooltip: true,
      fixed: 'left',
      width: 120,
      render: ({ record }) => {
        return record.caseInfo?.caseNo ?? '--';
      },
    },
    {
      title: '项目名称',
      dataIndex: 'caseName',
      ellipsis: true,
      tooltip: true,
      width: 400,
      render: ({ record }) => {
        return record.caseInfo?.caseName ?? '--';
      },
    },
    {
      title: '申请律师',
      dataIndex: 'applicantName',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }) => {
        return record.caseInfo?.applicantName ?? '--';
      },
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      ellipsis: true,
      tooltip: true,
      width: 150,
      render: ({ record }) => {
        return record.caseInfo.applyDate ?? '--';
      },
    },
    {
      title: '委托人',
      dataIndex: 'customerName',
      ellipsis: true,
      tooltip: true,
      width: 150,
      render: ({ record }) => {
        return record.caseCustomer?.customerName ?? '--';
      },
    },
    {
      title: '诉讼地位',
      dataIndex: 'litigationStatus',
      ellipsis: true,
      tooltip: true,
      width: 100,
      align: 'center',
      render: ({ record }) =>
        getLabel('caseLitigationStatus', record?.caseInfo?.litigationStatus),
    },
    {
      title: '审批状态',
      dataIndex: 'approveStatus',
      slotName: 'approveStatus',
      width: 150,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      width: 60,
      align: 'center',
      fixed: 'right',
    },
  ]);

  const currentSize = ref<'small' | 'medium' | 'mini' | 'large'>('medium');
  const handleSizeChange = (size: string) => {
    currentSize.value = size as 'small' | 'medium' | 'mini' | 'large';
  };

  const handleDetail = (record: any) => {
    router.push({
      name: 'projectDetail',
      query: {
        id: record?.caseInfo?.caseInfoId ?? '',
      },
    });
  };
  onMounted(() => {
    projectStore.fetchData();
  });
</script>
