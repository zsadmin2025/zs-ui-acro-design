<template>
  <div class="register-container">
    <a-form ref="formRef" :model="form" :rules="rules" auto-label-width>
      <a-space direction="vertical" :size="16" style="margin-bottom: 60px">
        <Customer />
        <CaseInfo />
        <CaseHearing />
        <CaseTeam />
        <CaseContract />
        <CaseLichong />
        <!-- <a-card class="general-card">
            <template #title> 利冲信息 </template>
          </a-card> -->
        <CaseInfoApproval v-if="approvalForm.isApproval === 1" />
      </a-space>
      <div class="actions">
        <a-space>
          <a-button @click="infoAddOrEditStore.reset">
            {{ $t('groupForm.reset') }}
          </a-button>
          <a-button type="primary" :loading="loading" @click="submit">
            {{ $t('groupForm.submit') }}
          </a-button>
        </a-space>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import { useCustomerStore } from '@/store/modules/lawyer/customer/customerStore';
  import { useUserStore } from '@/store/modules/sys/user/userStore';
  import { useDicts } from '@/hooks/dict';
  import { useRoute } from 'vue-router';
  import { useTabBarStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { useApprovalStore } from '@/store/modules/lawyer/basic/approval/approvalStore';
  import { caseInfoApi } from '@/api/lawyer/cases/info';
  import Customer from './components/addOrEdit/customer.vue';
  import CaseInfo from './components/addOrEdit/case-info.vue';
  import CaseHearing from './components/addOrEdit/case-hearing.vue';
  import CaseTeam from './components/addOrEdit/case-team.vue';
  import CaseContract from './components/addOrEdit/case-contract.vue';
  import CaseLichong from './components/addOrEdit/case-lichong.vue';
  import CaseInfoApproval from './components/addOrEdit/case-info-approval.vue';

  const route = useRoute();
  const router = useRouter();

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form, loading, formRef, rules, resultShow } =
    storeToRefs(infoAddOrEditStore);

  const approvalStore = useApprovalStore();
  const { form: approvalForm } = storeToRefs(approvalStore);

  const tabBarStore = useTabBarStore();

  const { customerType, paymentCategory, paymentMethod } = useDicts(
    'customerType',
    'paymentCategory',
    'paymentMethod',
  );

  onMounted(() => {
    approvalStore.loadInfo();
    resultShow.value = false;
    if (route.query.type === 'projectApproval') {
      console.log('我是立项', route);
      form.value.caseCustomer.customerId =
        (route.query.customerId as string) ?? '';
      form.value.caseCustomer.customerName =
        (route.query.customerName as string) ?? '';
      form.value.caseCustomer.customerCode =
        (route.query.customerCode as string) ?? '';
    } else if (route.query.type === 'edit') {
      console.log('我是编辑', route);
      form.value.caseInfo.caseInfoId = (route.query.id as string) ?? '';
      infoAddOrEditStore.init();
    } else {
      console.log('我是新增', route);
      form.value.caseCustomer.customerId = '';
      form.value.caseCustomer.customerName = '';
      form.value.caseCustomer.customerCode = '';
    }
    useCustomerStore().loadlist();
    useUserStore().loadUserList();
  });

  const emits = defineEmits(['refresh']);

  const submit = async () => {
    // 防止重复提交
    if (loading.value) return;
    try {
      if (!formRef.value) return;

      if (await formRef.value.validate()) {
        return;
      }

      loading.value = true;

      const action = form.value.caseInfo.caseInfoId
        ? caseInfoApi.edit
        : caseInfoApi.save;
      await action(form.value);
      infoAddOrEditStore.close();
      loading.value = false;
      emits('refresh');
      // 关闭当前页面
      tabBarStore.deleteTagByName(route.name as string);
      // 返回上一页
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      Message.error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  defineExpose({
    init: infoAddOrEditStore.init,
    form,
  });
</script>

<style scoped lang="less">
  .register-container {
    height: 100%;
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
