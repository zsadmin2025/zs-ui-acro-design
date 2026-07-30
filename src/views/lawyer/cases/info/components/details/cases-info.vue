<template>
  <div class="item-container">
    <a-card
      title="基本信息"
      :header-style="{
        background: '#fafafa',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <template #extra>
        <a-button
          v-if="type === 'edit'"
          type="primary"
          @click="handleEdit(props.caseInfo.caseInfoId)"
        >
          <template #icon>
            <icon-edit />
          </template>
          <template #default>编辑</template>
        </a-button>
      </template>
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
          <a-descriptions-item label="标的额：" :span="2">
            {{ props.caseInfo?.subjectAmount ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="我方" :span="4">
            <div v-for="(item, index) in props.caseInfo.ourSide" :key="index">
              {{
                (caseInfoOurSide.find((o) => o.dictValue === item.relationType)
                  ?.dictLabel ?? '--') +
                ' / ' +
                (item.relatedName ?? '--')
              }}
            </div>
          </a-descriptions-item>
          <a-descriptions-item label="对方" :span="4">
            <div v-for="(item, index) in props.caseInfo.otherSide" :key="index">
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
            {{ props.caseInfo.applyDate ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人" :span="2">
            {{ props.caseInfo.applicantName ?? '--' }}
          </a-descriptions-item>
          <a-descriptions-item label="案情简介：" :span="4">
            {{ props.caseInfo?.caseIntroduction }}
          </a-descriptions-item>
          <a-descriptions-item label="委托事宜" :span="4">
            {{ props.caseInfo?.entrustmentMatters }}
          </a-descriptions-item>
          <a-descriptions-item label="审批人：" :span="2"></a-descriptions-item>
          <a-descriptions-item label="审批时间" :span="2"></a-descriptions-item>
        </a-descriptions>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useDicts } from '@/hooks/dict';
  import { useRouter } from 'vue-router';

  const props = defineProps<{
    caseInfo: any;
    caseCustomer: any;
    type: string; // 用于区分详情和编辑
  }>();

  const router = useRouter();

  const { proxyStage, caseInfoOurSide, caseInfoOtherSide, getLabel } = useDicts(
    'caseType',
    'proxyStage',
    'caseLitigationStatus',
    'caseInfoOurSide',
    'caseInfoOtherSide',
  );

  const caseTypeOptions = computed(() => ({
    dictLabel: getLabel('caseType', props.caseInfo.caseType),
  }));
  // 代理阶段,将List<String>转换成string
  const proxyStageOptions = computed(() => {
    return proxyStage.value
      .filter((item) => props.caseInfo.proxyStage.includes(item.dictValue))
      .map((item) => item.dictLabel);
    // .join('、);
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
  const handleEdit = (caseInfoId: any) => {
    router.push({
      name: 'infoRegister',
      query: { id: caseInfoId ?? '', type: 'edit' },
    });
  };

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
