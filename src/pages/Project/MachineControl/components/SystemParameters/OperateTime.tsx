import NewSelect from '@/pages/Project/MachineControl/components/Select';
import { MachineStartTimeData, OverTimeData } from '@/viewModel/Project/useMachineControl';
import React from 'react';
import SystemTimePicker from "@/pages/Project/MachineControl/components/SystemParameters/SystemTimePicker";

interface Props {
  overTimeData: OverTimeData;
  machineStartTimeList: MachineStartTimeData[];
  handleOnChange: (path: string, value: any) => void;
  handleFullValueChange: (path: string, value: any, isPause?: boolean) => void;
}

const OperateTime: React.FC<Props> = ({ overTimeData, machineStartTimeList, handleOnChange , handleFullValueChange }) => {
  return (
    <>
      <div className={'flex justify-between mb-2'}>
        <div>OverTime</div>
        <NewSelect
          value={overTimeData.value}
          valueKey={'overTimeData'}
          // @ts-ignore
          options={overTimeData.options}
          onChange={handleOnChange}
          httpParams={{
            type: overTimeData.tag,
            machine: overTimeData.deviceName,
            floor: overTimeData.floor,
            store_id: overTimeData.storeId,
          }}
        />
      </div>
      <div>
        {
          machineStartTimeList.map((item,index) => {
            return (
              <div className={' mb-2'} key={item.title}>
                <div className={'mb-2'}>{item.title}</div>
                <SystemTimePicker
                  index={index}
                  baseData={item.timeValue}
                  httpParams={{
                    type: item.tag,
                    machine: item.deviceName,
                    floor: item.floor,
                    store_id: item.storeId,
                  }}
                  onChange={handleOnChange}
                  handleFullValueChange={handleFullValueChange}
                ></SystemTimePicker>
              </div>
            )
          })
        }
      </div>
    </>
  );
};

export default OperateTime;
