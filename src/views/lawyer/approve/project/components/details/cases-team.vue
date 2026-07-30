<template>
  <div class="item-container">
    <a-card
      title="团队信息"
      :header-style="{
        background: '#fafafa',
        fontSize: '16px',
        fontWeight: 'bold',
      }"
    >
      <a-table
        :data="tableData"
        :columns="columns"
        :bordered="false"
        :pagination="false"
        :table-layout-fixed="true"
      >
        <template #realName="{ record }">
          <a-space>
            <a-avatar
              :style="{
                marginRight: '14px',
                verticalAlign: 'middle',
                backgroundColor: getRandomColor(),
              }"
            >
              {{ getInitial(record?.realName) ?? '--' }}
            </a-avatar>
            <div>
              {{ record?.realName ?? '--' }}
            </div>
          </a-space>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';

  const props = defineProps<{
    caseInfoId: any;
    caseTeam: any;
  }>();

  const router = useRouter();

  // 获取首字母并大写
  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '--';
  };
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // 数据转换：把原始数据结构转换为扁平化的数据
  const tableData = computed(() => {
    const { caseTeam } = props;

    const data = [
      {
        title: '承接律师',
        value: caseTeam?.undertakeLawyerVo,
        isArray: false,
      },
      {
        title: '协接律师',
        value: caseTeam?.coordinatingLawyerVos,
        isArray: true,
      },
      {
        title: '主办律师',
        value: caseTeam?.leadLawyerVos,
        isArray: true,
      },
      {
        title: '协办人员',
        value: caseTeam?.coOrganizerVos,
        isArray: true,
      },
      {
        title: '助理',
        value: caseTeam?.assistantVos,
        isArray: true,
      },
      {
        title: '秘书',
        value: caseTeam?.secretaryVos,
        isArray: true,
      },
    ];

    return data
      .filter((item) => item.value)
      .flatMap((item) => {
        const list = item.isArray ? item.value : [item.value];
        return list.map(
          (person: { realName: any; postName: any; sysUserId: any }) => ({
            type: item.title,
            realName: person.realName,
            postName: person.postName || '-',
            sysUserId: person.sysUserId,
          }),
        );
      });
  });

  // 表格列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      fixed: 'left' as const,
      width: 100,
      align: 'center' as const,
      render: ({ rowIndex }: { rowIndex: number }) => `${rowIndex + 1}`,
    },

    {
      title: '姓名',
      dataIndex: 'realName',
      width: 200,
      slotName: 'realName',
      align: 'left' as const,
    },
    { title: '类型', dataIndex: 'type' },
  ];

  const handleEdit = (caseInfoId: any) => {
    router.push({
      name: 'infoRegister',
      query: { id: caseInfoId ?? '', type: 'edit' },
    });
  };
</script>

<style scoped lang="less">
  .item-container {
    padding: 20px;
    :deep(.arco-descriptions-item-label) {
      font-weight: normal;
    }
  }
</style>
