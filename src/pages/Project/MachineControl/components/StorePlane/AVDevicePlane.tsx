import FcuTag from '@/pages/Project/MachineControl/components/StorePlane/FcuTag';
import ModelInput from '@/pages/Project/MachineControl/components/ModelInput';
import React from "react";
import {ComponentChangeValue} from "@/utils/machine_control_service";
import './rotate.less'

interface TemperatureType {
  title: string,
  value: string,
  valueKey: string,
  unit: string,
  tag: string,
  deviceName: string,
  floor: string,
  storeId: number,
}

interface Props {
  windTemperature: string,
  temperature: TemperatureType,
  onSetTemperatureChange: (arg: ComponentChangeValue) => void,
  ahuDeviceName: string,
  vrvDeviceName: string,
  ahuFanImagePath: string,
  ahuFanAnimationDuration: string,
  ahuStatus: string,
  vrvFanImagePath: string,
  vrvFanAnimationDuration: string,
  vrvStatus: string,
}

const AVDetailPlane: React.FC<Props> = ({
                                                windTemperature,
                                                temperature,
                                                onSetTemperatureChange,
                                                ahuDeviceName,
                                                vrvDeviceName,
                                                ahuFanImagePath,
                                                ahuFanAnimationDuration,
                                                ahuStatus,
                                                vrvFanImagePath,
                                                vrvFanAnimationDuration,
                                                vrvStatus,
                                              }) => {
  return (
    <div className={'relative md:pt-6 lg:pt-12'}>
      <img
        src='/air-condition/air-machine-cold-back.png'
        alt={''}
      />

      <FcuTag style={{width: 200, position: 'absolute', top: '2%', left: '2%'}}>
        <div>{windTemperature}</div>
      </FcuTag>

      <FcuTag
        style={{ width: 200, position: 'absolute', top: '2%', right: '5%', display: 'flex', justifyContent: 'center' }}>
        <div className={'mr-1'}>{temperature.title}:</div>
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
        <div className={'ml-1'}>℃</div>
      </FcuTag>

      <FcuTag style={{ width: 100, position: 'absolute', top: '34%', left: '2%',}}>
        <div>回风</div>
      </FcuTag>

      <FcuTag style={{width: 100, position: 'absolute', top: '64%', left: '2%',}}>
        <div>送风</div>
      </FcuTag>

      <FcuTag style={{width: 100, position: 'absolute', top: '24%', right: '24%',}}>
        <div>{ahuDeviceName}</div>
      </FcuTag>

      <FcuTag style={{width: 100, position: 'absolute', top: '24%', left: '22.5%',}}>
        <div>{vrvDeviceName}</div>
      </FcuTag>

      <img
        src={ahuFanImagePath}
        className="fan absolute w-[4%] top-[64%] left-[69.2%] rotate-fan"
        style={{
          animationDuration: ahuFanAnimationDuration,
        }}
        alt={''}
      />

      <FcuTag style={{width: 100, position: 'absolute', right: '24%', bottom: '5%',}}>
        <div>{ahuStatus}</div>
      </FcuTag>

      <img
        src={vrvFanImagePath}
        className="fan absolute w-[4%] top-[64%] left-[23.5%] rotate-fan"
        style={{
          animationDuration: vrvFanAnimationDuration,
        }}
        alt={'fan'}
      />

      <FcuTag style={{width: 100, position: 'absolute', left: '22.5%', bottom: '5%',}}>
        <div>{vrvStatus}</div>
      </FcuTag>

    </div>
  )
}

export default AVDetailPlane

