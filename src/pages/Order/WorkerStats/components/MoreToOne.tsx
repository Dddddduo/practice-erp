import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react'
import { ProCard } from '@ant-design/pro-components';

interface ItemListProps {
  reimLineMoreToOne: { xAxis: Array<any>, yAxis: Array<any>, series: Array<any>, legend: Array<any> }
  reimBarMoreToOne: { xAxis: Array<any>, yAxis: Array<any>, series: Array<any>, legend: Array<any> }

}

const MoreToOne: React.FC<ItemListProps> = ({
  reimLineMoreToOne,
  reimBarMoreToOne
}) => {
  const leftChartRef: any = useRef(null);
  const rightChartRef: any = useRef(null);

  useEffect(() => {
    if (reimLineMoreToOne.xAxis && reimBarMoreToOne.xAxis) {
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

      console.log(reimLineMoreToOne);

      const leftChart = echarts.init(leftChartRef.current);
      const rightChart = echarts.init(rightChartRef.current);

      // 在这里配置和初始化图表
      const leftOptions = {
        tooltip: {
          trigger: 'axis'
        },
        legend: reimLineMoreToOne.legend,
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
        xAxis: reimLineMoreToOne.xAxis,
        yAxis: reimLineMoreToOne.yAxis,
        series: reimLineMoreToOne.series
      };
      console.log(leftOptions);
      
      const rightOptions = {
        tooltip: {
          trigger: 'axis'
        },
        legend: reimBarMoreToOne.legend,
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
        xAxis: {
          ...reimBarMoreToOne.xAxis,
          axisLabel: {
            rotate: 45, // 设置 x 轴标签倾斜角度为 45°
          },
        },
        yAxis: reimBarMoreToOne.yAxis,
        series: reimBarMoreToOne.series
      }
      leftChart.setOption(leftOptions);
      rightChart.setOption(rightOptions);
    }
  }, [reimLineMoreToOne, reimBarMoreToOne]);

  return (
    <ProCard split="vertical">
      <ProCard colSpan="50%" title="季度维修维保单量汇总/对比(数量)">
        <div ref={leftChartRef} style={{ width: '100%', height: 360 }}></div>
      </ProCard>
      <ProCard title="季度维修维保单量汇总/对比(金额)">
        <div ref={rightChartRef} style={{ width: '100%', height: 360 }}></div>
      </ProCard>
    </ProCard>
  )
}

export default MoreToOne