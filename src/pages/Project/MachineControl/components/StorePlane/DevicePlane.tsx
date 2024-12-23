import React from 'react';
import { GivingFeedbackData } from '@/viewModel/Project/useMachineControl';
import FcuTag from '@/pages/Project/MachineControl/components/StorePlane/FcuTag';
import ModelInput from '@/pages/Project/MachineControl/components/ModelInput';
import './rotate.less'

interface TemperatureType {
  title: string;
  value: string;
  valueKey: string;
  unit: string;
  tag: string;
  deviceName: string;
  floor: string;
  storeId: number;
}

interface Props {
  deviceName: string;
  fanAnimationDuration: string;
  fanImagePath: string;
  fcuStatus: string;
  temperature: TemperatureType;
  windTemperature: string;
  onSetTemperatureChange: (arg: any) => void;
  deviceType: string;
  waterPipeList: string[];
  givingFeedbackTextList?: GivingFeedbackData[],
}

const DevicePlane: React.FC<Props> = (Props) => {
  const {
    deviceName,
    fanAnimationDuration,
    fanImagePath,
    fcuStatus,
    temperature,
    windTemperature,
    onSetTemperatureChange,
    deviceType,
    waterPipeList,
    givingFeedbackTextList
  } = Props;

  const renderWaterPipe = (): React.ReactNode => {
    if (deviceType === 'fcu' && waterPipeList.length > 0) {
      return (
        <img
          src={waterPipeList[0]}
          style={{
            width: '18%',
            height: "58%",
            position: 'absolute',
            top: '20%',
            left: '37%'
          }}
          alt={'water-pipe'}
        />
      )
    }

    if (deviceType === 'ahu' && waterPipeList.length === 1) {
      return (
        <img
          src={waterPipeList[0]}
          style={{
            width: '18%',
            height: "52%",
            position: 'absolute',
            top: '20%',
            left: '29%'
          }}
          alt={'water-pipe'}
        />
      )
    }

    if (deviceType === 'ahu' && waterPipeList.length === 2) {
      return (
        <>
          <img
            src={waterPipeList[0]}
            style={{
              width: '18%',
              height: "58%",
              position: 'absolute',
              top: '20%',
              left: '37%'
            }}
            alt={'water-pipe'}
          />

          <img
            src={waterPipeList[1]}
            style={{
              width: '18%',
              height: "58%",
              position: 'absolute',
              top: '20%',
              left: '37%'
            }}
            alt={'water-pipe'}
          />
        </>
      )
    }

    return <></>
  }

  const renderGivingFeedback = (): React.ReactNode => {

    if (deviceType === 'ahu' && givingFeedbackTextList?.length === 2) {
      return (
        <div >
          <FcuTag style={{top:'74%',left:'40%'}}>{givingFeedbackTextList[0].name} : {givingFeedbackTextList[0].formatVal}</FcuTag>
          <FcuTag style={{top:'88%',left:'40%'}}>{givingFeedbackTextList[1].name} : {givingFeedbackTextList[1].formatVal}</FcuTag>
        </div>
      )
    }

    if (deviceType === 'ahu' && givingFeedbackTextList?.length === 4) {
      return (
        <div>
          <div style={{
            position: 'absolute',
            top: 50,
            left: 200
          }}>
            <FcuTag>{givingFeedbackTextList[0].name} : {givingFeedbackTextList[0].formatVal}</FcuTag>
            <FcuTag>{givingFeedbackTextList[1].name} : {givingFeedbackTextList[1].formatVal}</FcuTag>
          </div>

          <div style={{
            position: 'absolute',
            top: 50,
            left: 300
          }}>
            <FcuTag>{givingFeedbackTextList[2].name} : {givingFeedbackTextList[2].formatVal}</FcuTag>
            <FcuTag>{givingFeedbackTextList[3].name} : {givingFeedbackTextList[3].formatVal}</FcuTag>
          </div>
        </div>
      )
    }

    return <></>
  }

  console.log('fanAnimationDuration--fanAnimationDuration',fanAnimationDuration)
  return (
    <div
      className={'relative md:pt-6 lg:pt-12'}>
      <img className={'pl-[4%]'} src="/air-condition/fcu.png" alt="" />
      <img
        src={fanImagePath}
        className="fan absolute w-[4%] top-[54%] left-[59%] rotate-fan"
        style={{
          animationDuration: fanAnimationDuration,
        }}
        alt="fan"
      />
      <FcuTag className={'w-[200px] md:-top-[4%] lg:top-[2%] left-[2%]'}>{windTemperature}</FcuTag>
      <FcuTag
        className={
          'w-[200px] md:-top-[4%] lg:top-[2%] right-[12%] flex justify-center items-center'
        }
      >
        <div className={'pr-1'}>{temperature.title}:</div>
        <ModelInput
          value={temperature.value}
          valueKey={temperature.valueKey}
          unit={temperature.unit}
          rule={[]}
          onChange={() => onSetTemperatureChange}
          httpParams={{
            type: temperature.tag,
            machine: temperature.deviceName,
            floor: temperature.floor,
            store_id: temperature.storeId,
          }}
        />
        <div className={'pl-1'}>℃</div>
      </FcuTag>
      <FcuTag className={'w-[100px] md:top-[29%] lg:top-[42%] left-[2%]'}>回风</FcuTag>
      <FcuTag className={'w-[100px] md:top-[29%] lg:top-[42%] right-[8%]'}>送风</FcuTag>
      {
        deviceName && <FcuTag className={'w-[100px] md:top-[28%] lg:top-[30%] md:right-[31%] lg:right-[34.5%]'}>
          {deviceName}
        </FcuTag>
      }

      <FcuTag className={'w-[100px] md:top-[80%] lg:top-[84%] md:right-[31%] lg:right-[34.5%]'}>
        {fcuStatus}
      </FcuTag>

      <div>{renderWaterPipe()}</div>
      <div>{renderGivingFeedback()}</div>
    </div>
  );
};
export default DevicePlane;
