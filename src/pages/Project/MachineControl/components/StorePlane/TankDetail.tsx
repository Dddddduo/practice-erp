import React from 'react';
import './TankDetail.less'
import { TankData, ClickEnum, ModelTypeEnum } from '@/viewModel/Project/useMachineControl';
import NewSwitch from '@/pages/Project/MachineControl/components/Switch';
import BlockCard from '@/pages/Project/MachineControl/components/BlockCard';
interface Props {
  tankData: TankData;
  handleOnChange: (path: string, value: any) => void;
}

const TankDetail: React.FC<Props> = (props) => {
  const { tankData, handleOnChange } = props;
  const renderImg = (isMove: boolean) => {
    return (
      <img src={isMove ? '/image/air/water-pipe-move.gif' : '/image/air/water-pipe.png'} alt="" />
    );
  };

  return (
    <>
      <div className={'flex flex-wrap '}>
        {tankData.waterLevelList.map((item, index) => (
          <div key={index} className={'bg-blue-500 text-white rounded-1xl p-2 mr-2 w-[220px] text-center mb-3'}>
            {item.label}: {item.value}
          </div>
        ))}
      </div>

      <div className={'flex'}>
        {tankData.tankControlList.map((item, index) => (
          <div key={index} className={'mr-2'}>
            <BlockCard title={item.title}>
              <NewSwitch
                value={item.value}
                valueKey={'value'}
                onChange={(arg: any) => {
                  handleOnChange('TankData', {
                    key: arg.key,
                    value: arg?.value,
                  });
                }}
                httpParams={{
                  type: item.tag,
                  machine: item.deviceName ?? '',
                  floor: item.floor,
                  store_id: item.storeId,
                }}
                openText={item.openText}
                closeText={item.closeText}
              />
            </BlockCard>
          </div>
        ))}
      </div>
      <div className="tank-water">
        <div className="one-tank">
          {tankData.no1TankStatus ? renderImg(true) : renderImg(false)}
        </div>
        <div className="two-tank">
          {tankData.no2TankStatus ? renderImg(true) : renderImg(false)}
        </div>
        {
          <div className="cylinder" style={{ height: 100 }}>
            <div className="top"></div>
            <div className="side"></div>
            <div className="bottom"></div>
          </div>
        }
      </div>
    </>
  );
};
export default TankDetail;
