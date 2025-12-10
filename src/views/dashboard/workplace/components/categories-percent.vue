<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{
        padding: '20px',
      }"
    >
      <template #title>
        {{ '用户来源分布' }}
      </template>
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';

  const { loading } = useLoading();
  const { chartOption } = useChartOption((isDark) => {
    // echarts support https://echarts.apache.org/zh/theme-builder.html
    // It's not used here
    // 定义真实的用户来源数据
    const seriesData = [
      {
        value: 320000,
        name: '直接访问',
        itemStyle: {
          color: isDark ? '#3D72F6' : '#249EFF',
        },
      },
      {
        value: 210000,
        name: '社交媒体',
        itemStyle: {
          color: isDark ? '#A079DC' : '#313CA9',
        },
      },
      {
        value: 180000,
        name: '搜索引擎',
        itemStyle: {
          color: isDark ? '#6CAAF5' : '#21CCFF',
        },
      },
      {
        value: 120000,
        name: '广告投放',
        itemStyle: {
          color: isDark ? '#4CDDEC' : '#00C1C0',
        },
      },
      {
        value: 80000,
        name: '合作伙伴',
        itemStyle: {
          color: isDark ? '#FF9F4F' : '#FF9F19',
        },
      },
      {
        value: 40000,
        name: '其他渠道',
        itemStyle: {
          color: isDark ? '#FF784F' : '#FF5219',
        },
      },
    ];

    // 计算总数
    const total = seriesData.reduce((acc, curr) => acc + curr.value, 0);

    return {
      legend: {
        left: 'center',
        data: seriesData.map((item) => item.name),
        bottom: 0,
        icon: 'circle',
        itemWidth: 8,
        textStyle: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
        },
        itemStyle: {
          borderWidth: 0,
        },
      },
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: (params: any) => {
          const { name, value, percent } = params;
          return `${name}<br/>用户数: ${value.toLocaleString()}<br/>占比: ${percent}%`;
        },
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
              text: '用户来源分布',
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#4E5969',
              fontSize: 14,
            },
          },
          {
            type: 'text',
            left: 'center',
            top: '50%',
            style: {
              text: total.toLocaleString(),
              textAlign: 'center',
              fill: isDark ? '#ffffffb3' : '#1D2129',
              fontSize: 16,
              fontWeight: 500,
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '50%'],
          label: {
            formatter: '{b|{b}}\n{hr|}\n{d|{d}%}',
            rich: {
              b: {
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : '#4E5969',
                fontSize: 12,
                fontWeight: 'normal',
                lineHeight: 16,
              },
              hr: {
                borderColor: isDark ? '#ffffff1a' : '#E5E8EF',
                width: '100%',
                borderWidth: 1,
                height: 0,
              },
              d: {
                color: isDark ? 'rgba(255, 255, 255, 0.9)' : '#1D2129',
                fontSize: 14,
                fontWeight: 'bold',
                lineHeight: 20,
              },
            },
          },
          itemStyle: {
            borderColor: isDark ? '#232324' : '#fff',
            borderWidth: 1,
          },
          data: seriesData,
        },
      ],
    };
  });
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
</style>
