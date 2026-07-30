<template>
  <a-card class="general-card">
    <template #title> 开庭信息 </template>
    <template #extra>
      <a-button type="primary" @click="addHearing">
        <template #icon>
          <icon-plus />
        </template>
        登记
      </a-button>
    </template>
    <div class="hearing-card">
      <a-table
        :columns="(columns as any)"
        :data="form.caseHearingList"
        :pagination="false"
        :bordered="false"
        :table-layout-fixed="true"
        :scroll="{ x: '100%', y: '100%' }"
      >
        <template #operations="{ rowIndex }">
          <a-space size="mini">
            <a-link @click="handleEdit(rowIndex)">
              <template #icon>
                <icon-edit />
              </template>
              <template #default>编辑</template>
            </a-link>
            <a-link status="danger" @click="handleDeleteNode(rowIndex)">
              <template #icon>
                <icon-delete />
              </template>
              <template #default>删除</template>
            </a-link>
          </a-space>
        </template>
      </a-table>
    </div>
    <HearingAddOrEdit
      ref="hearingModalRef"
      :case-hearing-list="form.caseHearingList"
      @update:case-hearing-list="handleUpdateCaseHearingList"
    />
  </a-card>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { computed } from 'vue';
  import { useDicts } from '@/hooks/dict';
  import { useInfoAddOrEditStore } from '@/store/modules/lawyer/cases/info/infoAddOrEditStore';
  import HearingAddOrEdit from './hearing-add-or-edit.vue';

  const infoAddOrEditStore = useInfoAddOrEditStore();
  const { form } = storeToRefs(infoAddOrEditStore);

  const hearingModalRef = ref();
  const isEditMode = ref(false);
  const selectedIndex = ref(-1);

  const { getLabel } = useDicts('hearingProcedure');

  const columns = computed(() => [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
      align: 'center' as const,
      render: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
    },
    {
      title: '审理程序',
      dataIndex: 'hearingProcedure',
      ellipsis: true,
      tooltip: true,
      width: 120,
      render: ({ record }: { record: any }) =>
        getLabel('hearingProcedure', record?.hearingProcedure),
    },
    {
      title: '开庭时间',
      dataIndex: 'courtTime',
      ellipsis: true,
      tooltip: true,
      align: 'center' as const,
    },
    {
      title: '法院/仲裁庭',
      dataIndex: 'court',
      ellipsis: true,
      tooltip: true,
      align: 'center' as const,
    },
    {
      title: '操作',
      dataIndex: 'operations',
      slotName: 'operations',
      align: 'center' as const,
      width: 150,
    },
  ]);

  const addHearing = () => {
    // 新增开庭信息
    hearingModalRef.value.caseInfoId = form.value.caseInfo.caseInfoId;
    hearingModalRef.value.open(undefined, isEditMode); // 调用子组件 open 方法
  };
  // 编辑按钮点击
  const handleEdit = (index: number) => {
    isEditMode.value = true;
    selectedIndex.value = index;
    const row = form.value.caseHearingList[index];
    hearingModalRef.value.open(row, isEditMode); // 调用子组件 open 并传入当前行数据
  };
  const handleDeleteNode = (index: number) => {
    // 删除节点,
    form.value.caseHearingList.splice(index, 1);
  };

  const handleUpdateCaseHearingList = (newData: any) => {
    if (isEditMode.value) {
      //  编辑
      // 根据指定下标进行编辑
      form.value.caseHearingList[selectedIndex.value] = newData;
    } else {
      // 新增
      form.value.caseHearingList.push(newData);
    }
    isEditMode.value = false;
    selectedIndex.value = -1;
  };

  onMounted(() => {});
</script>

<style lang="less" scoped>
  .hearing-card {
    background-color: var(--color-fill-2);
  }
</style>
