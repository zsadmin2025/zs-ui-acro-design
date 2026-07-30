<template>
  <div class="infoDetail-container">
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <a-card :bordered="false">
          <!-- <template #extra>
            <a-space>
              <a-button>关闭</a-button>
              <a-button type="primary" icon="printer" status="warning"
                >打印合同</a-button
              >
              <a-button type="primary" icon="edit">编辑</a-button>
            </a-space>
          </template> -->
          <a-space :size="30" :fill="true">
            <img
              src="@/assets/images/contact-us.png"
              alt="Description of svg"
              width="100"
            />
            <a-descriptions
              :title="form.caseInfo.caseName"
              :column="3"
              layout="horizontal"
              :label-style="{
                paddingRight: '8px',
                fontWeight: 'normal',
                color: 'rgb(var(--gray-8))',
              }"
              :value-style="{
                width: '200px',
                textAlign: 'left',
              }"
            >
              <a-descriptions-item label="编号：">
                {{ form?.caseInfo?.caseNo ?? '--' }}
              </a-descriptions-item>
              <a-descriptions-item label="案件状态：">
                <span
                  v-if="form?.caseInfo?.caseStatus === 0"
                  style="color: rgb(var(--red-6))"
                  >• 已作废</span
                >
                <span
                  v-if="form?.caseInfo?.caseStatus === 1"
                  style="color: rgb(var(--green-6))"
                  >• 进行中</span
                >
                <span
                  v-if="form?.caseInfo?.caseStatus === 2"
                  style="color: rgb(var(--warning-6))"
                  >• 已结案</span
                >
                <span
                  v-if="form?.caseInfo?.caseStatus === 3"
                  style="color: rgb(var(--primary-6))"
                  >• 已归档</span
                >
              </a-descriptions-item>
              <a-descriptions-item label="主办律师：">
                张律师
              </a-descriptions-item>
            </a-descriptions>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-tabs
          :default-active-key="active"
          :active-key="active"
          type="capsule"
          :justify="true"
          :animation="true"
          @change="handleTabChange"
        >
          <a-tab-pane key="1" title="案件信息">
            <CasesInfo
              :case-info="form.caseInfo"
              :case-customer="form.caseCustomer"
              :type="type"
            />
          </a-tab-pane>
          <a-tab-pane key="2" title="开庭信息">
            <CasesHearing
              :case-info-id="form.caseInfo.caseInfoId"
              :case-hearing-list="form.caseHearingList"
              :type="type"
              @update:case-hearing-list="infoAddOrEditStore.init()"
            />
          </a-tab-pane>
          <a-tab-pane key="3" title="团队信息">
            <CasesTeam
              :case-info-id="form.caseInfo.caseInfoId"
              :case-team="form.caseTeam"
              :type="type"
            />
          </a-tab-pane>

          <a-tab-pane key="4" title="合同信息">
            <CasesContract
              :case-info-id="form.caseInfo.caseInfoId"
              :case-contract="form.caseContract"
              :type="type"
            />
          </a-tab-pane>

          <a-tab-pane key="5" title="利冲信息"> 敬请期待 </a-tab-pane>

          <a-tab-pane key="6" title="任务提醒"> 敬请期待 </a-tab-pane>

          <a-tab-pane key="7" title="结案目录">
            <CasesList
              :case-info="form.caseInfo"
              :case-info-list="form.caseInfoList"
              :type="type"
              @refresh-details="infoAddOrEditStore.init()"
            />
          </a-tab-pane>
          <a-tab-pane key="8" title="业务日志"> 敬请期待 </a-tab-pane>
          <a-tab-pane key="9" title="审批表">
            <ApprovalForm
              id="printApprovalForm"
              ref="approvalFormRef"
              :case-info="form.caseInfo"
              :case-info-approval-form="form.caseInfoApprovalForm"
              @refresh-details="infoAddOrEditStore.init()"
            />
          </a-tab-pane>
          <a-tab-pane key="10" title="委托书">
            <CasesInfoPowerAttorney
              id="printMe"
              ref="powerAttorneyRef"
              :case-info="form.caseInfo"
              :type="type"
              @refresh-details="infoAddOrEditStore.init()"
            />
          </a-tab-pane>
          <a-tab-pane key="11" title="附件">
            <CasesFiles
              :case-info-id="form.caseInfo.caseInfoId"
              :case-info-files="form.caseInfoFilesList"
              :type="type"
              @refresh-details="infoAddOrEditStore.init()"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <div v-if="active === '10'" class="actions">
      <a-space>
        <a-button v-print="printObj" type="primary" status="warning">
          打印
        </a-button>
        <a-button
          v-if="
            routeType === 'info' &&
            active === '10' &&
            form.caseInfo.caseStatus === 1
          "
          type="primary"
          :loading="loading"
          @click="powerAttorneyEdit()"
        >
          编辑
        </a-button>
      </a-space>
    </div>
    <div v-if="routeType === 'closed'" class="actions">
      <a-space>
        <a-button type="primary" :loading="loading" @click="closed()">
          结案
        </a-button>
      </a-space>
    </div>

    <div v-if="active === '9'" class="actions">
      <a-space>
        <a-button
          v-if="form.caseInfo.caseStatus === 1"
          :disabled="form.caseInfoApprovalForm?.approvalStatus === 2"
          @click="handleSubmit"
          >保存</a-button
        >
        <a-button
          v-if="
            form.caseInfo.caseStatus === 1 &&
            (form.caseInfoApprovalForm?.approvalStatus === 1 ||
              form.caseInfoApprovalForm?.approvalStatus === 0)
          "
          type="primary"
          @click="handleSubmitApprovalForm"
        >
          提交签批
        </a-button>
        <a-button
          v-if="form.caseInfoApprovalForm?.approvalStatus === 2"
          v-print="printObjApprovalForm"
          type="primary"
          status="warning"
        >
          >打印</a-button
        >
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import { Modal } from '@arco-design/web-vue';
  import { useTabBarStore } from '@/store';
  import CasesInfo from './components/details/cases-info.vue';
  import CasesContract from './components/details/cases-contract.vue';
  import CasesHearing from './components/details/cases-hearing.vue';
  import CasesTeam from './components/details/cases-team.vue';
  import CasesList from './components/details/cases-list.vue';
  import CasesFiles from './components/details/cases-files.vue';
  import ApprovalForm from './components/details/approval_form.vue';
  import CasesInfoPowerAttorney from './components/details/cases-info-powerAttorney.vue';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form, loading } = storeToRefs(infoAddOrEditStore);

  const tabBarStore = useTabBarStore();

  const powerAttorneyRef = ref<InstanceType<
    typeof CasesInfoPowerAttorney
  > | null>(null);

  const approvalFormRef = ref<InstanceType<typeof ApprovalForm> | null>(null);

  const route = useRoute();
  const router = useRouter();
  const active = ref('1');
  const type = ref(((route.query.type as string) ?? '') || 'edit');
  const routeType = ref((route.query.routeType as string) ?? '');

  const printObj = {
    id: 'printMe',
    popTitle: '',
    extraCss: '',
    extraHead: '',
    beforeOpenCallback(vue: any) {
      vue.printLoading = true;
    },
    openCallback(vue: any) {
      vue.printLoading = false;
    },
    closeCallback(vue: any) {},
  };

  const printObjApprovalForm = {
    id: 'printApprovalForm',
    popTitle: '',
    extraCss: '',
    extraHead: '',
    beforeOpenCallback(vue: any) {
      vue.printLoading = true;
      console.log('打开之前');
    },
    openCallback(vue: any) {
      vue.printLoading = false;
      console.log('执行了打印');
    },
    closeCallback(vue: any) {
      console.log('关闭了打印工具');
    },
  };

  const handleTabChange = (tab: any) => {
    active.value = tab;
  };

  onBeforeMount(() => {
    form.value.caseInfo.caseInfoId = (route.query.id as string) ?? '';
    if (routeType.value === 'closed') {
      active.value = '7'; // 如果是结案页面，默认选中结案目录
    }
    // 获取详情
    infoAddOrEditStore.init();
  });

  const closed = () => {
    Modal.confirm({
      title: '温馨提示',
      titleAlign: 'start',
      content: '您将进行结案操作,是否继续?',
      onOk: async () => {
        infoAddOrEditStore.closed();
        // 关闭当前页面
        tabBarStore.deleteTagByName(route.name as string);
        // 返回列表页面
        router.push({
          path: '/cases/closed',
        });
      },
    });
  };

  const powerAttorneyEdit = () => {
    if (powerAttorneyRef.value) {
      powerAttorneyRef.value.openEditor();
    }
  };

  const handleSubmit = () => {
    if (approvalFormRef.value) {
      approvalFormRef.value.submit();
    }
  };

  const handleSubmitApprovalForm = () => {
    if (approvalFormRef.value) {
      approvalFormRef.value.submitApprovalForm();
    }
  };
</script>

<style scoped lang="less">
  .infoDetail-container {
    margin-bottom: 70px;
  }
  .wrapper {
    padding: 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }

  :deep(.arco-avatar-trigger-icon-button) {
    width: 32px;
    height: 32px;
    line-height: 32px;
    background-color: #e8f3ff;
    .arco-icon-camera {
      margin-top: 8px;
      color: rgb(var(--arcoblue-6));
      font-size: 14px;
    }
  }
  .img {
    border-radius: 8px;
  }
  :deep(.arco-descriptions) {
    .arco-descriptions-title {
      width: 100%;
      font-size: 30px;
      font-weight: bold;
    }
  }

  .arco-tabs {
    background-color: var(--color-bg-2);

    :deep(.arco-tabs-nav) {
      border-bottom: 1px solid var(--color-neutral-3);
      padding: 8px 16px;
      .arco-tabs-nav-tab {
        justify-content: flex-start;

        .arco-tabs-nav-tab-list {
          padding: 0 3px;
          .arco-tabs-tab {
            padding: 2px 10px;
            border-radius: 2px;
          }
          .arco-tabs-tab-active {
            background-color: rgb(var(--primary-6));
            color: var(--color-white);
          }
          .arco-tabs-tab:hover {
            background-color: rgb(var(--primary-6));
            color: var(--color-white);
          }
        }
      }
    }
  }

  .actions {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    padding: 14px 20px 14px 0;
    background: var(--color-bg-2);
    text-align: right;
    z-index: 999;
  }
</style>
