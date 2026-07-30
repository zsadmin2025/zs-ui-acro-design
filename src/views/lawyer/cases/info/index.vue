<template>
  <CasesListPage page-type="info">
    <template #toolbar-left>
      <a-space>
        <a-button
          v-permission="'cases:info:save'"
          type="primary"
          @click="handleAdd"
        >
          <template #icon>
            <icon-plus />
          </template>
          登记
        </a-button>
        <a-button
          v-permission="'cases:info:batchDelete'"
          type="primary"
          status="danger"
          :disabled="selectedKeys.length === 0"
          @click="infoStore.handleDeleteSelected()"
        >
          <template #icon>
            <icon-delete />
          </template>
          <template #default>删除</template>
        </a-button>
      </a-space>
    </template>

    <template #operations="{ record }">
      <a-space size="mini">
        <a-link v-permission="'cases:info:info'" @click="handleDetail(record)">
          <template #icon>
            <icon-eye />
          </template>
          <template #default>详情</template>
        </a-link>
        <a-link v-permission="'cases:info:update'" @click="handleEdit(record)">
          <template #icon>
            <icon-edit />
          </template>
          <template #default>编辑</template>
        </a-link>
        <a-link
          v-permission="'cases:info:cancel'"
          status="warning"
          @click="infoStore.handleCancel(record?.caseInfo)"
        >
          <template #icon>
            <icon-close-circle />
          </template>
          <template #default>作废</template>
        </a-link>
        <a-link
          v-permission="'cases:info:delete'"
          status="danger"
          @click="infoStore.handleDelete(record?.caseInfo)"
        >
          <template #icon>
            <icon-delete />
          </template>
          <template #default>删除</template>
        </a-link>
      </a-space>
    </template>
  </CasesListPage>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { useInfoStore } from '@/store/modules/lawyer/cases/info/infoStore';
  import CasesListPage from '../components/CasesListPage.vue';

  const router = useRouter();
  const infoStore = useInfoStore();
  const { selectedKeys } = storeToRefs(infoStore);

  const handleAdd = () => {
    router.push({ name: 'infoRegister' });
  };

  const handleEdit = (row: any) => {
    router.push({
      name: 'infoRegister',
      query: { id: row?.caseInfo?.caseInfoId ?? '', type: 'edit' },
    });
  };

  const handleDetail = (record: any) => {
    router.push({
      name: 'infoDetail',
      query: {
        id: record?.caseInfo?.caseInfoId ?? '',
        routeType: 'info',
      },
    });
  };
</script>
