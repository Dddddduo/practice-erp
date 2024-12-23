import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsProps } from 'antd';
import * as echarts from 'echarts';
import { produce } from 'immer';

const EnergySaving: React.FC = () => {
  const frequencyChartRef: any = useRef(null);

  const frequency = {
    title: 'Unit:Hz',
    min: 20,
    data: [
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
        45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
        45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 0, 0, 0, 0, 0, 0,
      ],
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 40.2,
        41.9, 39.1, 40.7, 42.3, 38.9, 41.5, 42.1, 39.5, 41.3, 40.3, 41.1, 40.6, 41.4, 42.2, 39.3,
        40.9, 42.5, 41.9, 40.5, 41.3, 39.7, 40.5, 38.9, 39.7, 38.1, 37.7, 38.5, 36.9, 37.5, 36.1,
        35.7, 36.5, 34.9, 35.7, 34.1, 34.9, 33.3, 33.9, 32.5, 33.1, 39.7, 37.9, 40.3, 39.5, 38.7,
        39.3, 40.1, 37.7, 40.5, 37.5, 39.9, 38.3, 40.3, 37.9, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
    ],
  };

  const power = {
    title: 'Unit:kW',
    min: 0,
    data: [
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.46,
        1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46,
        1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46,
        1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46,
        1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 1.46, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.04,
        1.18, 0.96, 1.08, 1.21, 0.94, 1.14, 1.19, 0.99, 1.13, 1.05, 1.11, 1.07, 1.14, 1.2, 0.97,
        1.09, 1.23, 1.18, 1.06, 1.13, 1.0, 1.06, 0.94, 1.0, 0.88, 0.86, 0.91, 0.8, 0.84, 0.75, 0.73,
        0.78, 0.68, 0.73, 0.63, 0.68, 0.59, 0.62, 0.55, 0.58, 1.0, 0.87, 1.05, 0.99, 0.93, 0.97,
        1.03, 0.86, 1.06, 0.84, 1.02, 0.9, 1.05, 0.87, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
    ],
  };

  const energy = {
    title: 'Unit:kW·h',
    min: 0,
    data: [
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.36,
        0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36,
        0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36,
        0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36,
        0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.26,
        0.29, 0.24, 0.27, 0.3, 0.24, 0.29, 0.3, 0.25, 0.28, 0.26, 0.28, 0.27, 0.28, 0.3, 0.24, 0.27,
        0.31, 0.29, 0.27, 0.28, 0.25, 0.27, 0.24, 0.25, 0.22, 0.21, 0.23, 0.2, 0.21, 0.19, 0.18,
        0.19, 0.17, 0.18, 0.16, 0.17, 0.15, 0.16, 0.14, 0.15, 0.25, 0.22, 0.26, 0.25, 0.23, 0.24,
        0.26, 0.21, 0.27, 0.21, 0.25, 0.22, 0.26, 0.22, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
      [
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1,
        0.07, 0.12, 0.09, 0.06, 0.12, 0.07, 0.06, 0.11, 0.08, 0.1, 0.08, 0.09, 0.08, 0.06, 0.12,
        0.09, 0.05, 0.07, 0.09, 0.08, 0.11, 0.09, 0.12, 0.11, 0.14, 0.15, 0.13, 0.16, 0.15, 0.17,
        0.18, 0.17, 0.19, 0.18, 0.2, 0.19, 0.21, 0.2, 0.22, 0.21, 0.11, 0.14, 0.1, 0.11, 0.13, 0.12,
        0.1, 0.15, 0.09, 0.15, 0.11, 0.14, 0.1, 0.14, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
      ],
    ],
  };

  const [energyData, setEnergyData] = useState({
    currentIndex: '0',
    value: 0,
    rate: 0,
    startRange: 0,
    endRange: 100,
  });

  const getFrequencyChart = (configData: any) => {
    // 销毁当前实例（如果存在）
    if (frequencyChartRef.current) {
      const chart = echarts.getInstanceByDom(frequencyChartRef.current);
      if (chart) {
        chart.dispose();
      }
    }

    const chart = echarts.init(frequencyChartRef.current);

    let option = undefined;

    if (configData.data.length === 3) {
      option = {
        title: {
          text: configData.title,
        },
        tooltip: {},
        legend: {
          data: ['Regular Mode', 'AI Mode', 'Energy Saving'],
        },
        toolbox: {},
        grid: {},
        xAxis: [
          {
            type: 'category',
            data: [
              '00:00',
              '00:15',
              '00:30',
              '00:45',
              '01:00',
              '01:15',
              '01:30',
              '01:45',
              '02:00',
              '02:15',
              '02:30',
              '02:45',
              '03:00',
              '03:15',
              '03:30',
              '03:45',
              '04:00',
              '04:15',
              '04:30',
              '04:45',
              '05:00',
              '05:15',
              '05:30',
              '05:45',
              '06:00',
              '06:15',
              '06:30',
              '06:45',
              '07:00',
              '07:15',
              '07:30',
              '07:45',
              '08:00',
              '08:15',
              '08:30',
              '08:45',
              '09:00',
              '09:15',
              '09:30',
              '09:45',
              '10:00',
              '10:15',
              '10:30',
              '10:45',
              '11:00',
              '11:15',
              '11:30',
              '11:45',
              '12:00',
              '12:15',
              '12:30',
              '12:45',
              '13:00',
              '13:15',
              '13:30',
              '13:45',
              '14:00',
              '14:15',
              '14:30',
              '14:45',
              '15:00',
              '15:15',
              '15:30',
              '15:45',
              '16:00',
              '16:15',
              '16:30',
              '16:45',
              '17:00',
              '17:15',
              '17:30',
              '17:45',
              '18:00',
              '18:15',
              '18:30',
              '18:45',
              '19:00',
              '19:15',
              '19:30',
              '19:45',
              '20:00',
              '20:15',
              '20:30',
              '20:45',
              '21:00',
              '21:15',
              '21:30',
              '21:45',
              '22:00',
              '22:15',
              '22:30',
              '22:45',
              '23:00',
              '23:15',
              '23:30',
              '23:45',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            min: configData.min,
          },
        ],
        series: [
          {
            name: 'Regular Mode',
            type: 'line',
            data: configData.data[0],
          },
          {
            name: 'AI Mode',
            type: 'line',
            emphasis: {
              focus: 'series',
            },
            data: configData.data[1],
          },
          {
            name: 'Energy Saving',
            type: 'bar',
            emphasis: {
              focus: 'series',
            },
            data: configData.data[2],
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
    } else {
      option = {
        title: {
          text: configData.title,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['Regular Mode', 'AI Mode'],
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false,
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [
              '00:00',
              '00:15',
              '00:30',
              '00:45',
              '01:00',
              '01:15',
              '01:30',
              '01:45',
              '02:00',
              '02:15',
              '02:30',
              '02:45',
              '03:00',
              '03:15',
              '03:30',
              '03:45',
              '04:00',
              '04:15',
              '04:30',
              '04:45',
              '05:00',
              '05:15',
              '05:30',
              '05:45',
              '06:00',
              '06:15',
              '06:30',
              '06:45',
              '07:00',
              '07:15',
              '07:30',
              '07:45',
              '08:00',
              '08:15',
              '08:30',
              '08:45',
              '09:00',
              '09:15',
              '09:30',
              '09:45',
              '10:00',
              '10:15',
              '10:30',
              '10:45',
              '11:00',
              '11:15',
              '11:30',
              '11:45',
              '12:00',
              '12:15',
              '12:30',
              '12:45',
              '13:00',
              '13:15',
              '13:30',
              '13:45',
              '14:00',
              '14:15',
              '14:30',
              '14:45',
              '15:00',
              '15:15',
              '15:30',
              '15:45',
              '16:00',
              '16:15',
              '16:30',
              '16:45',
              '17:00',
              '17:15',
              '17:30',
              '17:45',
              '18:00',
              '18:15',
              '18:30',
              '18:45',
              '19:00',
              '19:15',
              '19:30',
              '19:45',
              '20:00',
              '20:15',
              '20:30',
              '20:45',
              '21:00',
              '21:15',
              '21:30',
              '21:45',
              '22:00',
              '22:15',
              '22:30',
              '22:45',
              '23:00',
              '23:15',
              '23:30',
              '23:45',
            ],
          },
        ],
        yAxis: [
          {
            type: 'value',
            min: configData.min,
          },
        ],
        series: [
          {
            name: 'Regular Mode',
            type: 'line',
            // stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: configData.data[0],
          },
          {
            name: 'AI Mode',
            type: 'line',
            // stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: configData.data[1],
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
    }

    chart.setOption(option);

    chart.on('dataZoom', (params: any) => {
      const startValue = params?.start;
      const endValue = params?.end;

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      computeValue(startValue, endValue);
    });
  };

  const tabChange = (e: any) => {
    if (e === '0') {
      setEnergyData(
        produce((draft) => {
          draft.currentIndex = '0';
        }),
      );

      getFrequencyChart(frequency);
    } else if (e === '1') {
      setEnergyData(
        produce((draft) => {
          draft.currentIndex = '1';
        }),
      );

      getFrequencyChart(power);
    } else if (e === '2') {
      setEnergyData(
        produce((draft) => {
          draft.currentIndex = '2';
        }),
      );

      getFrequencyChart(energy);
    }
  };

  useEffect(() => {
    getFrequencyChart(frequency);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    computeValue(energyData.startRange, energyData.endRange);

    console.log(energy.data[2].length);
  }, []);

  const computeValue = (start: any, end: any) => {
    const s_i = Math.ceil((start / 100) * 96);
    const e_i = Math.floor((end / 100) * 96);

    let value = 0;
    let rate = 0;

    for (let i = s_i; i < e_i; i++) {
      value += energy.data[2][i];
      rate += energy.data[0][i];
    }

    setEnergyData(
      produce((draft:any) => {
        draft.value = value.toFixed(2);
        draft.rate = rate === 0 ? 0 : ((value / rate) * 100).toFixed(2);
      }),
    );
  };

  const items: TabsProps['items'] = [
    {
      key: '0',
      label: 'Frequency',
    },
    {
      key: '1',
      label: 'Power',
    },
    {
      key: '2',
      label: 'Energy Consumption',
    },
  ];

  return (
    <div className="electric-detail" style={{ position: 'relative' }}>
      <Tabs defaultActiveKey="0" items={items} onChange={tabChange} />
      <div
        style={{ width: '100%', height: 500 }}
        className="electric-chart"
        ref={frequencyChartRef}
      ></div>
      {energyData.currentIndex === '2' && (
        <div style={{ position: 'absolute', top: 84, left: 590, display: 'flex' }}>
          <div style={{ marginRight: 12, fontSize: 14, fontWeight: 'bold' }}>
            Energy Consumption: {energyData.value}kW·h
          </div>
          <div style={{ fontSize: 14, fontWeight: 'bold' }}>Proportion: {energyData.rate}%</div>
        </div>
      )}
    </div>
  );
};

export default EnergySaving;
