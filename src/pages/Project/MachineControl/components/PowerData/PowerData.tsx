import React from 'react';
import { ClickEnum, ModelTypeEnum, PowerDataType } from '@/viewModel/Project/useMachineControl';
import DBList from '@/pages/Project/MachineControl/components/PowerData/DBList';
import DBChart from '@/pages/Project/MachineControl/components/PowerData/DBChart';

interface Props {
  powerData: PowerDataType;
  handleOnChange: (path: string, value: any) => void;
}

const PowerData: React.FC<Props> = ({ powerData, handleOnChange }) => {
  return (
    <div className={'flex'}>
      <div className={'w-1/2 mr-[50px]'}>
        <DBList
          powerData={powerData}
          handleOnChange={(value, key) => {
            handleOnChange('powerData', {
              value,
              key
            })
          }}
        ></DBList>
      </div>
      <div className={'w-2/5'}>
        <DBChart
          value={powerData.selectWeekValue}
          options={powerData.weekOptions}
          chartName={''}
          chartXData={powerData.chartData.x}
          chartYData={powerData.chartData.y}
          onClick={(value, key) => {
            handleOnChange('powerData', {
              value,
              key
            })
          }}
        ></DBChart>
      </div>
    </div>
  );
};
export default PowerData;
