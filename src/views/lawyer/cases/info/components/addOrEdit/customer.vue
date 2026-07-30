<template>
  <a-card class="general-card">
    <template #title> 客户信息 </template>
    <a-row :gutter="20">
      <a-col :span="12">
        <a-form-item label="客户名称" field="caseCustomer.customerId">
          <a-select
            v-model="form.caseCustomer.customerId"
            placeholder="请选择客户"
            :allow-search="true"
            @change="handleCustomerChange"
          >
            <a-option
              v-for="item in customerList"
              :key="item.customerId"
              :value="item.customerId"
              >{{ item.customerName }}</a-option
            >
          </a-select>

          <a-button
            type="primary"
            shape="circle"
            size="mini"
            :style="{ marginLeft: '20px' }"
            @click="openAddCustomer"
          >
            <icon-plus />
          </a-button>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="客户编号" field="customerCode">
          <span>{{ form.caseCustomer.customerCode }}</span>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="客户状态" field="caseCustomer.customerType">
          <a-select
            v-model="form.caseCustomer.customerType"
            placeholder="请选择客户状态"
          >
            <a-option
              v-for="item in customerType"
              :key="item.dictValue"
              :value="item.dictValue"
              >{{ item.dictLabel }}</a-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <CustomerAddOrEdit
      ref="addCustomerRef"
      @refresh="useCustomerStore().loadlist()"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useDicts } from '@/hooks/dict';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import { useCustomerStore } from '@/store/modules/lawyer/customer/customerStore';
  import CustomerAddOrEdit from '@/views/lawyer/customer/components/customer-add-or-edit.vue';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);

  const { customerList } = storeToRefs(useCustomerStore());
  const { customerType } = useDicts('customerType');
  const addCustomerRef = ref();

  const handleCustomerChange = (value: any) => {
    const customer = customerList.value.find(
      (item) => item?.customerId === value,
    );
    if (customer) {
      form.value.caseCustomer.customerCode = customer?.customerCode ?? '';
      form.value.caseCustomer.customerName = customer?.customerName ?? '';
    }
  };

  onMounted(() => {});

  const openAddCustomer = () => {
    addCustomerRef.value.init();
  };
</script>
