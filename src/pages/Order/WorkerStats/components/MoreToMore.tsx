import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react'
import { ProCard } from '@ant-design/pro-components';

interface ItemListProps {
  reimLineMoreToMore: { xAxis: Array<any>, yAxis: Array<any>, series: Array<any>, legend: Array<any> }
  reimBarMoreToMore: { xAxis: Array<any>, yAxis: Array<any>, series: Array<any>, legend: Array<any> }

}

const MoreToMore: React.FC<ItemListProps> = ({
  reimLineMoreToMore,
  reimBarMoreToMore
}) => {
  const leftChartRef: any = useRef(null);
  const rightChartRef: any = useRef(null);

  useEffect(() => {
    if (reimLineMoreToMore.xAxis && reimBarMoreToMore.xAxis) {
      const lineChart = echarts.getInstanceByDom(leftChartRef.current);
      const barChart = echarts.getInstanceByDom(rightChartRef.current);
      if (lineChart) {
        // 销毁现有实例
        lineChart.dispose();
      }
      if (barChart) {
        // 销毁现有实例
        barChart.dispose();
      }

      const leftChart = echarts.init(leftChartRef.current);
      const rightChart = echarts.init(rightChartRef.current);

      const leftOptions = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: reimLineMoreToMore.xAxis,
        yAxis: {
          ...reimLineMoreToMore.yAxis,
          axisLabel: {
            rotate: 45, // 设置 y 轴标签倾斜角度为 45°
          },
        },
        series: reimLineMoreToMore.series
      };
      const rightOptions = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: reimBarMoreToMore.xAxis,
        yAxis: {
          ...reimBarMoreToMore.yAxis,
          axisLabel: {
            rotate: 45, // 设置 y 轴标签倾斜角度为 45°
          },
        },
        series: reimBarMoreToMore.series
      }
      leftChart.setOption(leftOptions);
      rightChart.setOption(rightOptions);
    }
  }, [reimLineMoreToMore, reimBarMoreToMore]);

  return (
    <ProCard split="vertical">
      <ProCard colSpan="50%" title="年度维修维保单量汇总/对比(数量)">
        <div ref={leftChartRef} style={{ width: '100%', height: 360 }}></div>
      </ProCard>
      <ProCard title="年度维修维保单量汇总/对比(金额)">
        <div ref={rightChartRef} style={{ width: '100%', height: 360 }}></div>
      </ProCard>
    </ProCard>
  )
}

export default MoreToMore
