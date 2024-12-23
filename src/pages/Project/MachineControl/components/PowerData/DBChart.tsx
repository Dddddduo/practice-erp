import React, { useEffect, useRef } from 'react';
import { Radio } from 'antd';
import * as echarts from 'echarts';
import { OptionData } from '@/viewModel/Project/useMachineControl';

interface Props {
  value: number;
  options: OptionData[];
  chartName: string;
  chartXData: string[];
  chartYData: number[];
  onClick: (value: any, key: any) => void;
}

const DBChart: React.FC<Props> = ({
  value,
  options,
  chartName,
  chartXData,
  chartYData,
  onClick,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const getChart = () => {

    const chart = echarts.init(chartRef.current!);
    const option = {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '10%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartXData,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: chartName,
          type: 'line',
          stack: 'total',
          label: {
            show: false,
          },
          emphasis: {
            focus: 'series',
          },
          data: chartYData,
          itemStyle: {
            color: '#5470c6',
          },
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          handleIcon:
            'path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z',
        },
      ],
    };
    chart.setOption(option);
  };

  useEffect(() => {
    getChart();
  }, [chartYData]);
  return (
    <>
      <div>
        <Radio.Group
          defaultValue={value}
          buttonStyle="solid"
          onChange={(e) => {
            onClick(e.target.value, 'selectWeekValue');
          }}
        >
          {options.map((item, index) => (
            <Radio.Button key={index} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>

      {/* chart */}
      <div style={{ width: '100%', height: 500 }} ref={chartRef}></div>
    </>
  );
};

export default DBChart;
