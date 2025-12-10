<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{ paddingTop: '20px' }"
      title="访问趋势"
    >
      <template #extra>
        <!-- <a-link>{{ $t('workplace.viewMore') }}</a-link> -->
        <!-- 时间范围选择 -->
        <div>
          <a-radio-group v-model="timeRange" type="button" size="small">
            <a-radio value="1">今日</a-radio>
            <a-radio value="7">本周</a-radio>
            <a-radio value="30">本月</a-radio>
          </a-radio-group>
        </div>
      </template>

      <!-- ECharts 图表 -->
      <Chart height="310px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import useChartOption from '@/hooks/chart-option';
  import { AnyObject } from '@/types/global';

  // 模拟数据（可根据接口替换）
  const mockData = [
    { x: '周一', y1: 1200, y2: 2000 },
    { x: '周二', y1: 1800, y2: 3000 },
    { x: '周三', y1: 1500, y2: 2500 },
    { x: '周四', y1: 2200, y2: 3800 },
    { x: '周五', y1: 2000, y2: 3400 },
    { x: '周六', y1: 3000, y2: 5200 },
    { x: '周日', y1: 3800, y2: 6200 },
  ];

  // 时间范围控制
  const timeRange = ref('1');

  // 数据处理
  const xAxis = ref<string[]>([]);
  const series1 = ref<number[]>([]);
  const series2 = ref<number[]>([]);

  // 图形文本组件
  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }

  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);

  const { loading, setLoading } = useLoading(true);
  const { chartOption } = useChartOption(() => {
    const data = mockData;

    // 更新坐标轴和数据
    xAxis.value = data.map((item) => item.x);
    series1.value = data.map((item) => item.y1);
    series2.value = data.map((item) => item.y2);

    // 设置起止点文字
    if (data.length > 0) {
      graphicElements.value[0].style.text = data[0].x;
      graphicElements.value[1].style.text = data[data.length - 1].x;
    }

    return {
      grid: {
        left: '50',
        right: '0',
        top: '30',
        bottom: '30',
      },
      tooltip: {
        trigger: 'axis',
        className: 'echarts-tooltip-diy',
      },
      legend: {
        show: true,
        top: '0%',
        right: '0%',
        textStyle: {
          color: '#4E5969',
          fontSize: 12,
        },
        data: ['用户数', '访问量'],
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: xAxis.value,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: string, idx: number) {
            if (idx === 0) return '';
            if (idx === xAxis.value.length - 1) return '';
            return value;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          interval: (idx: number) =>
            idx !== 0 && idx !== xAxis.value.length - 1,
          lineStyle: {
            color: '#E5E8EF',
          },
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#23ADFF',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: any) {
            return `${value}`;
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#E5E8EF',
          },
        },
      },
      series: [
        {
          name: '用户数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
            },
          },
          lineStyle: {
            width: 2,
            color: '#006AFF',
          },
          areaStyle: {
            opacity: 0.2,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0, 106, 255, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(0, 106, 255, 0)',
              },
            ]),
          },
          data: series1.value,
        },
        {
          name: '访问量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
            },
          },
          lineStyle: {
            width: 2,
            color: '#00C9A7',
          },
          areaStyle: {
            opacity: 0.2,
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgba(0, 201, 167, 0.2)',
              },
              {
                offset: 1,
                color: 'rgba(0, 201, 167, 0)',
              },
            ]),
          },
          data: series2.value,
        },
      ],
      graphic: {
        elements: graphicElements.value,
      },
    };
  });

  // 监听时间范围变化（可扩展为请求不同时间段数据）
  watch(timeRange, () => {
    // 可在此处重新加载数据，例如：
    // fetchData();
  });

  // 初始化数据
  const fetchData = async () => {
    setLoading(true);
    try {
      // 实际使用时替换为接口调用
      // const { data } = await queryContentData();
      // 处理数据...
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }

  .time-filter {
    margin-bottom: 16px;
    text-align: right;
  }

  .echarts-tooltip-diy {
    background: white;
    border: 1px solid #e5e8ef;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .tooltip-title {
    margin: 0 0 8px;
    color: #4e5969;
    font-weight: bold;
  }

  .content-panel {
    display: flex;
    justify-content: space-between;
    margin: 4px 0;
  }

  .tooltip-value {
    color: #006aff;
    font-weight: 500;
  }
</style>
