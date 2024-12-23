import React from 'react';
import {Tabs} from "antd";
import { PowerDataType } from '@/viewModel/Project/useMachineControl';
import PowerCard from '@/pages/Project/MachineControl/components/PowerData/PowerCard';
interface  Props {
  powerData: PowerDataType,
  handleOnChange: (value: any, key: any) => void;
}
const DBList: React.FC<Props> = ({powerData , handleOnChange}) => {
  return <Tabs
    defaultActiveKey="0"
    onChange={(value) => {
      handleOnChange(value,'selectDBMachineIndex')
    }}
    //@ts-ignore
    items={powerData.dbDataList.map((item,index) => {
      return {
        label: item.deviceName,
        key: index,
        children:(
          <div className={'flex flex-wrap gap-2'}>
            {
              item.dataList.map((data,key) => {
                return (
                  <div key={key}>
                    <PowerCard
                      title={data.name}
                      formatVal={`${data.value}${data.unit}`}
                      onClick={() => {
                        handleOnChange(key,'selectDBDataIndex')
                      }}
                      isActive={powerData.selectDBDataIndex === key}
                    />
                  </div>
                )
              })
            }
          </div>
        )
      }
    })}
  />
};
export default DBList;
