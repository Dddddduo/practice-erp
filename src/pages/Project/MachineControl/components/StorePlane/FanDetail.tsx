import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import {ClickEnum, ModelTypeEnum} from '@/viewModel/Project/useMachineControl';
import React from 'react';

interface Props {
  fanData: any;
  handleOnChange: (path: string, value: any) => void;
}

const FanDetail: React.FC<Props> = ({ fanData, handleOnChange }) => {
  console.log('fanData-fanData', fanData);
  return (
    <>
      <div>
        <div>
          {
            fanData
          }
          <BlockCard title={'停启模式'}>
            {/*<NewSwitch*/}
            {/*  value={true}*/}
            {/*  valueKey={'value'}*/}
            {/*  onChange={(arg: any) => {*/}
            {/*    handleOnChange(ClickEnum.onValueChange, {*/}
            {/*      model: ModelTypeEnum.FAN,*/}
            {/*      index: 0,*/}
            {/*      key: arg.key,*/}
            {/*      value: arg?.value,*/}
            {/*    });*/}
            {/*  }}*/}
            {/*  httpParams={{*/}
            {/*    type: 'fan',*/}
            {/*    machine: 'fan',*/}
            {/*    floor: '1',*/}
            {/*    store_id: '1',*/}
            {/*  }}*/}
            {/*  openText={'开'}*/}
            {/*  closeText={'关'}*/}
            {/*/>*/}
          </BlockCard>
          <BlockCard title={'室内温度'}>
            <div>

            </div>
          </BlockCard>
        </div>
      </div>
    </>
  );
};

export default FanDetail;
