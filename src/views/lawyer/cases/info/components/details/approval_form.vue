<template>
  <div class="approval-form-container">
    <div class="header">
      <div class="title">内蒙古全兴律师事务所</div>
      <div class="sub-title">案件代理、辩护审批表</div>
      <div class="case-no">
        {{ props.caseInfo?.caseNo ?? '' }}
      </div>
      <table class="pure-table">
        <tr>
          <td>
            <span>委托人</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{
              form.customerName
            }}</span>
            <a-input v-else v-model="form.customerName" placeholder="请输入" />
          </td>
          <td>
            <span>诉讼地位</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{
              form.litigationStatus
            }}</span>
            <a-cascader
              v-else
              v-model="form.litigationStatus"
              :options="caseLitigationStatus"
              :field-names="{ value: 'dictValue', label: 'dictLabel' }"
              placeholder="请选择诉讼地位"
              :alllow-clear="true"
            />
          </td>
          <td>
            <span>案由</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{ form.causeAction }}</span>
            <a-input v-else v-model="form.causeAction" placeholder="请输入" />
          </td>
        </tr>
        <tr>
          <td>
            <span>对方当事人</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{ form.otherSide }}</span>
            <a-input v-else v-model="form.otherSide" placeholder="请输入" />
          </td>
          <td>
            <span>诉讼地位</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{
              form.otherLitigationStatus
            }}</span>
            <a-cascader
              v-else
              v-model="form.otherLitigationStatus"
              :options="caseLitigationStatus"
              :field-names="{ value: 'dictValue', label: 'dictLabel' }"
              placeholder="请选择诉讼地位"
              :alllow-clear="true"
            />
          </td>
          <td>
            <span>第三方</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{ form.thirdParty }}</span>
            <a-input v-else v-model="form.thirdParty" placeholder="请输入" />
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <span>初查：委托事务与本所承办其他案件是否有利益冲突</span>
          </td>
          <td>
            <span v-if="form.approvalStatus === 3">{{
              form.conflictInterest === 1 ? '有' : '无'
            }}</span>
            <a-select
              v-else
              v-model="form.conflictInterest"
              placeholder="请输入"
            >
              <a-option :value="1">有</a-option>
              <a-option :value="0">无</a-option>
            </a-select>
          </td>
          <td>
            <span>标的额</span>
          </td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.subjectAmount
            }}</span>
            <a-input-number
              v-else
              v-model="form.subjectAmount"
              placeholder="请输入标的金额"
              :precision="2"
              :min="0"
            >
              <template #append> 元 </template>
            </a-input-number>
          </td>
        </tr>

        <tr>
          <td>
            <span>指明律师</span>
          </td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.indicateLawyerName
            }}</span>
            <a-select
              v-else
              v-model="form.indicateLawyer"
              placeholder="请选择指明律师"
              allow-search
              @change="handleIndicateLawyerChange"
            >
              <a-option
                v-for="item in userList"
                :key="item.sysUserId"
                :value="item.sysUserId"
                >{{ item.realName }}</a-option
              >
            </a-select>
          </td>
          <td>
            <span>指定律师</span>
          </td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.appointLawyerName
            }}</span>
            <a-select
              v-else
              v-model="form.appointLawyer"
              placeholder="请选择指定律师"
              allow-search
              @change="handleAppointLawyerChange"
            >
              <a-option
                v-for="item in userList"
                :key="item.sysUserId"
                :value="item.sysUserId"
                >{{ item.realName }}</a-option
              >
            </a-select>
          </td>
        </tr>

        <tr>
          <td>
            <span>受案法院</span>
          </td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.acceptingCourt
            }}</span>
            <a-input
              v-else
              v-model="form.acceptingCourt"
              placeholder="请输入"
            />
          </td>
          <td>
            <span>委托要求</span>
          </td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.entrustRequire
            }}</span>
            <a-input
              v-else
              v-model="form.entrustRequire"
              placeholder="请输入"
            />
          </td>
        </tr>

        <tr>
          <td>
            <span>委托事项摘要</span>
          </td>
          <td colspan="5">
            <span v-if="form.approvalStatus === 3">{{
              form.entrustedMattersAbstract
            }}</span>
            <a-input
              v-else
              v-model="form.entrustedMattersAbstract"
              placeholder="请输入"
            />
          </td>
        </tr>

        <tr>
          <td rowspan="2">
            <span>承办律师意见</span>
          </td>
          <!-- 合并输入框 -->
          <td colspan="2" rowspan="2">
            <span v-if="form.approvalStatus === 3">{{
              form.undertakeLawyerOpinion
            }}</span>
            <a-textarea
              v-else
              v-model="form.undertakeLawyerOpinion"
              rows="4"
              placeholder="请输入"
            />
          </td>
          <td>收费额</td>
          <td colspan="2">
            <span v-if="form.approvalStatus === 3">{{ form.feeAmount }}</span>
            <a-input-number
              v-else
              v-model="form.feeAmount"
              placeholder="请输入收费金额"
              :precision="2"
              :min="0"
            >
              <template #append> 元 </template>
            </a-input-number>
          </td>
        </tr>

        <tr>
          <td>审批意见</td>
          <td colspan="2">
            <span>{{ form.approvalOpinion }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';
  import { useUserStore } from '@/store/modules/sys/user/userStore';
  import { useInfoApprovalFormAddOrEditStore } from '@/store/modules/lawyer/cases/infoApprovalForm/infoApprovalFormAddOrEditStore';

  const ifoApprovalFormAddOrEditStore = useInfoApprovalFormAddOrEditStore();

  const userList = computed(() => useUserStore().userList);

  const props = defineProps<{
    caseInfo: any;
    caseInfoApprovalForm: any;
  }>();

  const { form } = storeToRefs(ifoApprovalFormAddOrEditStore);

  const { caseLitigationStatus } = useDicts('caseLitigationStatus');

  const handleIndicateLawyerChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[],
  ) => {
    const selectedUser = userList.value.find(
      (user) => user?.sysUserId === value,
    );
    if (selectedUser) {
      form.value.indicateLawyerName = selectedUser?.realName ?? '';
    }
  };

  const handleAppointLawyerChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[],
  ) => {
    const selectedUser = userList.value.find(
      (user) => user?.sysUserId === value,
    );
    if (selectedUser) {
      form.value.appointLawyerName = selectedUser?.realName ?? '';
    }
  };

  watch(
    () => props.caseInfo,
    (newVal) => {
      if (newVal) {
        form.value.caseInfoId = newVal.caseInfoId ?? '';
        form.value.caseNo = newVal.caseNo ?? '';
        form.value.caseType = newVal.caseType ?? '';
      }
    },
    { immediate: true }, // 立即执行一次监听器
  );
  watch(
    () => props.caseInfoApprovalForm,
    (newVal) => {
      if (newVal) {
        form.value = { ...form.value, ...newVal };
      }
    },
    { deep: true, immediate: true },
  );
  const emits = defineEmits(['refresh-details']);

  onMounted(() => {
    ifoApprovalFormAddOrEditStore.reset();
    useUserStore().loadUserList();
  });

  defineExpose({
    submit: () => ifoApprovalFormAddOrEditStore.submit(emits),
    submitApprovalForm: () =>
      ifoApprovalFormAddOrEditStore.submitApprovalForm(emits),
  });
</script>

<style lang="less" scoped>
  .approval-form-container {
    margin: auto;
    max-width: 800px;
    height: 100%;
    .header {
      text-align: center;
      margin-bottom: 20px;

      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }

      .sub-title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .case-no {
        text-align: right;
        font-size: 16px;
      }
    }

    .pure-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-top: 10px;

      // tr {
      //   &:nth-child(even) {
      //     background-color: #f9f9f9;
      //   }
      // }

      th,
      td {
        border: 1px solid #000;
        padding: 12px;
        vertical-align: middle;
        min-width: 100px;
        max-width: 250px;
        word-break: break-all;
        text-align: center;

        span {
          min-height: 20px;
          line-height: 20px;
        }

        &.label-cell {
          font-weight: bold;
          text-align: right;
        }
      }

      th {
        background-color: #f0f0f0;
        font-weight: bold;
      }
    }
  }
</style>
