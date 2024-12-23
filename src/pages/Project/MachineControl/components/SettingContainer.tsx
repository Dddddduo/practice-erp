import React from 'react';
import CardContainer from '@/pages/Project/MachineControl/components/CardContainer';
import NewButton from '@/pages/Project/MachineControl/components/SystemParameters/NewButton';
import { ClickEnum, ModelTypeEnum } from '@/viewModel/Project/useMachineControl';
import Weather from '@/pages/Project/MachineControl/components/Weather';
import Legend from '@/pages/Project/MachineControl/components/Legend';

interface Props {
  handleOnChange: (path: string, value: any) => void;
}

const SettingContainer: React.FC<Props> = ({ handleOnChange }) => {
  return (
    <div>
      <CardContainer className={'w-56 flex flex-col justify-center items-center mb-4'}>
        <NewButton
          btnText={{
            id: 'energySaving',
            defaultMessage: '节能',
          }}
          onClick={() => {
            handleOnChange('showModelType', ModelTypeEnum.EnergySaving);
          }}
          className={'block mb-2'}
        />

        <NewButton
          btnText={{
            id: 'systemParameters',
            defaultMessage: '系统参数',
          }}
          onClick={() => {
            handleOnChange('showModelType', ModelTypeEnum.SystemParameters);
          }}
          className={'block mb-2'}
        />

        <NewButton
          btnText={{
            id: 'powerData',
            defaultMessage: '电能数据',
          }}
          onClick={() => {
            handleOnChange('showModelType', ModelTypeEnum.PowerData);
          }}
          className={'block mb-2'}
        />

        <NewButton
          btnText={{
            id: 'lightingOperation',
            defaultMessage: '照明操作',
          }}
          onClick={() => {
            handleOnChange('showModelType', ModelTypeEnum.LightingOperation);
          }}
          className={'block'}
        />
      </CardContainer>
      <CardContainer className={'w-56 mb-4'}>
        <Weather />
      </CardContainer>
      <CardContainer className={'w-56'}>
        <Legend />
      </CardContainer>
    </div>
  );
};

export default SettingContainer;
