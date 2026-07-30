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
              width="200"
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
          type="capsule"
          :justify="true"
          :animation="true"
          @change="handleTabChange"
        >
          <a-tab-pane key="1" title="案件信息">
            <CasesInfo
              :case-info="form.caseInfo"
              :case-customer="form.caseCustomer"
              @update:case-info="form.caseInfo = $event"
            />
          </a-tab-pane>
          <a-tab-pane key="2" title="开庭信息">
            <CasesHearing
              :case-info-id="form.caseInfo.caseInfoId"
              :case-hearing-list="form.caseHearingList"
            />
          </a-tab-pane>
          <a-tab-pane key="3" title="团队信息">
            <CasesTeam
              :case-info-id="form.caseInfo.caseInfoId"
              :case-team="form.caseTeam"
            />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <div v-if="form.caseInfo.approveStatus === 1" class="actions">
      <a-space>
        <a-button @click="handleCancel()"> 取消 </a-button>
        <a-button
          v-permission="'cases:info:approveReject'"
          type="primary"
          status="danger"
          :loading="loading"
          @click="projectDetailStore.reject()"
        >
          否决
        </a-button>
        <a-button
          v-permission="'cases:info:approvePass'"
          type="primary"
          :loading="loading"
          @click="projectDetailStore.approve()"
        >
          通过
        </a-button>
      </a-space>
    </div>
    <div v-else class="actions">
      <a-space>
        <a-button @click="handleCancel()"> 关闭 </a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { useProjectDetailStore } from '@/store/modules/lawyer/approve/project/projectDetail';
  import { useTabBarStore } from '@/store';
  import CasesInfo from './components/details/cases-info.vue';
  import CasesHearing from './components/details/cases-hearing.vue';
  import CasesTeam from './components/details/cases-team.vue';

  const projectDetailStore = useProjectDetailStore();
  const { form, loading } = storeToRefs(projectDetailStore);

  const tabBarStore = useTabBarStore();

  const route = useRoute();
  const router = useRouter();

  const active = ref('1');

  const handleTabChange = (tab: any) => {
    active.value = tab;
  };

  const handleCancel = () => {
    // 关闭当前页面
    tabBarStore.deleteTagByName(route.name as string);
    // 返回上一页
    router.back();
  };
  onBeforeMount(() => {
    form.value.caseInfo.caseInfoId = (route.query.id as string) ?? '';
    // 获取详情
    projectDetailStore.init();
  });
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
  }
</style>
