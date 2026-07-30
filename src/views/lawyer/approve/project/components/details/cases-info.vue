<template>
  <div class="item-container">
    <a-space direction="vertical" fill>
      <a-card
        title="基本信息"
        :header-style="{
          background: '#fafafa',
          fontSize: '16px',
          fontWeight: 'bold',
        }"
      >
        <a-space :size="16" direction="vertical" fill>
          <a-descriptions
            size="large"
            :column="4"
            layout="horizontal"
            table-layout="fixed"
            :label-style="{
              width: '100px',
              fontWeight: 'normal',
              color: 'rgb(var(--gray-8))',
            }"
            :value-style="{
              paddingLeft: '8px',
              textAlign: 'left',
            }"
          >
            <a-descriptions-item label="客户名称" :span="2">
              {{ props.caseCustomer?.customerName ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="客户编号" :span="2">
              {{ props.caseCustomer?.customerCode ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="案件类型" :span="3">
              {{ caseTypeOptions?.dictLabel ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="代理阶段" :span="2">
              <a-space>
                <a-tag
                  v-for="item in proxyStageOptions"
                  :key="item"
                  color="#165dff"
                  >{{ item ?? '--' }}</a-tag
                >
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="当前阶段" :span="2">
              <a-space>
                <a-tag
                  v-for="item in nowStageOptions"
                  :key="item"
                  color="#00b42a"
                  >{{ item ?? '--' }}</a-tag
                >
              </a-space>
            </a-descriptions-item>
            <a-descriptions-item label="诉讼地位" :span="2">
              {{ litigationStatusOptions?.dictLabel ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="标的额" :span="2">
              {{ props.caseInfo?.subjectAmount ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="我方" :span="4">
              <div v-for="(item, index) in props.caseInfo.ourSide" :key="index">
                {{
                  (caseInfoOurSide.find(
                    (o) => o.dictValue === item.relationType,
                  )?.dictLabel ?? '--') +
                  ' / ' +
                  (item.relatedName ?? '--')
                }}
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="对方" :span="4">
              <div
                v-for="(item, index) in props.caseInfo.otherSide"
                :key="index"
              >
                {{
                  (caseInfoOtherSide.find(
                    (o) => o.dictValue === item.relationType,
                  )?.dictLabel ?? '--') +
                  ' / ' +
                  (item.relatedName ?? '--')
                }}
              </div>
            </a-descriptions-item>
            <a-descriptions-item label="申请时间" :span="2">
              {{ props.caseInfo?.applyDate ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="申请人" :span="2">
              {{ props.caseInfo?.applicantName ?? '--' }}
            </a-descriptions-item>
            <a-descriptions-item label="案情简介" :span="4">
              {{ props.caseInfo?.caseIntroduction }}
            </a-descriptions-item>
            <a-descriptions-item label="委托事宜" :span="4">
              {{ props.caseInfo?.entrustmentMatters }}
            </a-descriptions-item>
          </a-descriptions>
        </a-space>
      </a-card>

      <a-card
        v-if="props.caseInfo.approveStatus === 1"
        title="审批"
        :header-style="{
          background: '#fafafa',
          fontSize: '16px',
          fontWeight: 'bold',
        }"
      >
        <a-textarea
          v-model="localApproveOpinion"
          type="textarea"
          placeholder="请输入审批意见"
          :show-word-limit="true"
          :max-length="500"
          allow-clear
        ></a-textarea>
      </a-card>
      <a-card
        v-else
        title="审批"
        :header-style="{
          background: '#fafafa',
          fontSize: '16px',
          fontWeight: 'bold',
        }"
      >
        <a-table
          :data="data"
          :columns="columns"
          :pagination="false"
          column-resizable
          :bordered="{ cell: true }"
        >
          <template #approveStatus="{ record }">
            <a-tag
              v-if="record.approveStatus === 0"
              color="#f5222d"
              style="font-size: 14px"
            >
              已拒绝
            </a-tag>
            <a-tag
              v-else-if="record.approveStatus === 2"
              color="#52c41a"
              style="font-size: 14px"
            >
              已通过
            </a-tag>
          </template>
        </a-table>
      </a-card>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
  import { useDicts } from '@/hooks/dict';

  const props = defineProps<{
    caseInfo: any;
    caseCustomer: any;
  }>();

  //
  const localApproveOpinion = ref<string>('');

  const { proxyStage, caseInfoOurSide, caseInfoOtherSide, getLabel } = useDicts(
    'caseType',
    'proxyStage',
    'caseLitigationStatus',
    'caseInfoOurSide',
    'caseInfoOtherSide',
  );

  const data = computed(() => {
    const list: any[] = [
      {
        applyDate: props.caseInfo.applyDate ?? '--',
        applicantName: props.caseInfo.applicantName ?? '--',
        approvalTime: props.caseInfo.approvalTime ?? '--',
        approvalLawyerName: props.caseInfo.approvalLawyerName ?? '--',
        approveStatus: props.caseInfo.approveStatus,
        approvalOpinion: props.caseInfo.approvalOpinion ?? '--',
      },
    ];

    return list;
  });

  const columns = [
    {
      title: '提交时间',
      dataIndex: 'applyDate',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '提交人',
      dataIndex: 'applicantName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批人',
      dataIndex: 'approvalLawyerName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批结果',
      dataIndex: 'approveStatus',
      slotName: 'approveStatus',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '审批意见',
      dataIndex: 'approvalOpinion',
      ellipsis: true,
      tooltip: true,
    },
  ];

  const caseTypeOptions = computed(() => ({
    dictLabel: getLabel('caseType', props.caseInfo.caseType),
  }));
  // 代理阶段,将List<String>转换成string
  const proxyStageOptions = computed(() => {
    return proxyStage.value
      .filter((item) => props.caseInfo.proxyStage.includes(item.dictValue))
      .map((item) => item.dictLabel);
  });
  // 当前阶段
  const nowStageOptions = computed(() => {
    return proxyStage.value
      .filter((item) => props.caseInfo.nowStage === item.dictValue)
      .map((item) => item.dictLabel);
  });
  const litigationStatusOptions = computed(() => ({
    dictLabel: getLabel(
      'caseLitigationStatus',
      props.caseInfo.litigationStatus,
    ),
  }));

  const emit = defineEmits<{
    (e: 'update:case-info', caseInfo: any): void;
  }>();
  // 监听 props.caseInfo 变化，用于初始化和后续更
  watchEffect(() => {
    localApproveOpinion.value = props.caseInfo.approvalOpinion ?? '';
  });
  // 当本地输入变化时，触发事件通知父组件更
  watch(localApproveOpinion, (newVal) => {
    emit('update:case-info', {
      ...props.caseInfo,
      approvalOpinion: newVal,
    });
  });
  onMounted(() => {});
</script>

<style scoped lang="less">
  .item-container {
    padding: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
