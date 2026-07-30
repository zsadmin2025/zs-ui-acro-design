<template>
  <CasesListPage page-type="filing">
    <template #toolbar-left>
      <a-space>
        <a-input-search
          v-model="searchForm.caseName"
          placeholder="请输入项目名称"
          :allow-clear="true"
          @search="handleSearch"
        >
        </a-input-search>
      </a-space>
    </template>

    <template #is-paper-contract-submitted="{ record }">
      <a-tag
        v-if="
          record.caseInfo.isPaperContractSubmitted &&
          record.caseInfo.isPaperContractSubmitted === 1
        "
        color="rgb(var(--primary-6))"
      >
        已提交
      </a-tag>
      <a-tag
        v-if="
          record.caseInfo.isPaperContractSubmitted &&
          record.caseInfo.isPaperContractSubmitted === 0
        "
        color="gray"
      >
        未提交
      </a-tag>
    </template>

    <template #is-letter-issued="{ record }">
      <a-tag
        v-if="
          record.caseInfo.isLetterIssued && record.caseInfo.isLetterIssued === 1
        "
        color="rgb(var(--primary-6))"
      >
        已开
      </a-tag>
      <a-tag
        v-if="
          record.caseInfo.isLetterIssued && record.caseInfo.isLetterIssued === 0
        "
        color="gray"
      >
        未开
      </a-tag>
    </template>

    <template #operations="{ record }">
      <a-space>
        <a-link v-permission="'cases:info:info'" @click="handleDetail(record)">
          详情
        </a-link>
        <a-link
          v-permission="'cases:info:filing'"
          @click="infoStore.filing(record)"
        >
          归档
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
  const { form } = storeToRefs(infoStore);
  const searchForm = ref({ caseName: '' });

  const handleSearch = () => {
    form.value.caseName = searchForm.value.caseName;
    infoStore.loadfilingPage();
  };

  const handleDetail = (record: any) => {
    router.push({
      name: 'infoDetail',
      query: {
        id: record?.caseInfo?.caseInfoId ?? '',
        type: 'detail',
      },
    });
  };
</script>
