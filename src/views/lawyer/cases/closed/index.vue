<template>
  <CasesListPage page-type="closed">
    <template #toolbar-left>
      <a-space>
        <a-input-search
          v-model="searchForm.caseName"
          placeholder="请输入项目名称"
          :allow-clear="true"
          @search="handleSearch"
        >
        </a-input-search>
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
      <a-space>
        <a-link v-permission="'cases:info:info'" @click="handleDetail(record)">
          结案
        </a-link>
      </a-space>
    </template>
  </CasesListPage>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useInfoStore } from '@/store/modules/lawyer/cases/info/infoStore';
  import CasesListPage from '../components/CasesListPage.vue';

  const router = useRouter();
  const infoStore = useInfoStore();
  const { form, selectedKeys } = storeToRefs(infoStore);
  const searchForm = ref({ caseName: '' });

  const handleSearch = () => {
    form.value.caseName = searchForm.value.caseName;
    infoStore.loadclosedPage();
  };

  const handleDetail = (record: any) => {
    router.push({
      name: 'infoDetail',
      query: {
        id: record?.caseInfo?.caseInfoId ?? '',
        type: 'edit',
        routeType: 'closed',
      },
    });
  };
</script>
