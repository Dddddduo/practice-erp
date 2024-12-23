import DBChart from '@/pages/Project/MachineControl/components/PowerData/DBChart';
import PowerCard from '@/pages/Project/MachineControl/components/PowerData/PowerCard';
import { ClickEnum, IAQData, ModelTypeEnum } from '@/viewModel/Project/useMachineControl';
import React from 'react';

interface Props {
  iaqData: IAQData;
  handleOnChange: (path: string, value: any) => void;
}

const IaqDetail: React.FC<Props> = (props) => {
  const { iaqData, handleOnChange } = props;
  return (
    <div className={'flex'}>
      <div style={{ width: '55%' }}>
        <div className={'font-bold text-large mb-4'}>IAQ</div>

        <div className={'flex flex-wrap gap-4'}>
          {iaqData.dataInfoList.map((item, index) => {
            return (
              <div key={index}>
                <PowerCard
                  title={item.name}
                  formatVal={item.formalVal}
                  isActive={iaqData.selectDataInfoIndex === index}
                  onClick={() =>
                    handleOnChange('IAQData', {
                      key: 'selectDataInfoIndex',
                      value: index,
                    })
                  }
                  style={{
                    backgroundColor: item.bgColor,
                  }}
                  titleStyle={{ color: 'white' }}
                  contentStyle={{ color: 'white' }}
                />
              </div>
            );
          })}
        </div>

        <div className={'mt-8'}>
          <div className={'text-title font-bold'}>峰值说明</div>
          {iaqData.numericalValueList.map((item, index) => (
            <div key={index} style={{ color: item.color }}>
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '40%' }}>
        <DBChart
          value={iaqData.selectWeekValue}
          options={iaqData.weekOptions}
          chartName={''}
          chartXData={iaqData.chartData.x}
          chartYData={iaqData.chartData.y}
          onClick={(v,key ) => {
            handleOnChange('IAQData', {
              key: key,
              value: v,
            });
          }}
        />
      </div>
    </div>
  );
};
export default IaqDetail;
