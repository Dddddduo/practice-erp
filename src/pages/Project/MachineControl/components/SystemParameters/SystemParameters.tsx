import BaseContainer, { ModalType } from '@/components/Container';
import SupplyWaterList from '@/components/MachineControl/SupplyWaterList';
import NewButton from '@/pages/Project/MachineControl/components/SystemParameters/NewButton';
import OperationRecord from '@/pages/Project/MachineControl/components/SystemParameters/OperationRecord';
import WarningsRecord from '@/pages/Project/MachineControl/components/SystemParameters/WarningsRecord';
import { i18nGlobalKey } from '@/utils/utils';
import { SystemParamsData } from '@/viewModel/Project/useMachineControl';
import { useRecord } from '@/viewModel/Project/useRecord';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import NewWind from './NewWind';
import OperateTime from './OperateTime';

interface SystemParametersProps {
  systemParameters: SystemParamsData;
  handleOnChange: (path: string, value: any) => void;
  handleFullValueChange: (path: string, value: any, isPause?: boolean) => void;
}

const SystemParameters: React.FC<SystemParametersProps> = ({
  systemParameters,
  handleOnChange,
  handleFullValueChange,
}) => {
  const {
    dataSource,
    openContainer,
    closeContainer,
    getOperationRecordData,
    getWarningsRecordData,
  } = useRecord();
  const [containerTitle, setContainerTitle] = useState('');
  return (
    <div className={'flex justify-between p-2'}>
      {/* Left */}
      {!isEmpty(systemParameters.supplyReturnList) && (
        <div style={{ width: '56%' }}>
          <div className={'font-bold text-title mb-2'}>{i18nGlobalKey('供回水参数')}</div>
          <SupplyWaterList supplyReturnList={systemParameters.supplyReturnList} />
        </div>
      )}

      {/* Right */}
      <div style={{ width: '40%' }}>
        <div className={'mb-3'}>
          <div className={'font-bold text-title mb-2'}>{i18nGlobalKey('新风系统参数')}</div>
          <NewWind
            windSpeedList={systemParameters.windSpeedList}
            airValveList={systemParameters.airValveList}
            handleOnChange={handleOnChange}
          />
        </div>

        <div>
          <div className={'font-bold text-title mb-2'}>{i18nGlobalKey('运行时间')}</div>
          <OperateTime
            overTimeData={systemParameters.overTimeData}
            machineStartTimeList={systemParameters.machineStartTimeList}
            handleOnChange={handleOnChange}
            handleFullValueChange={handleFullValueChange}
          />
        </div>

        <div>
          <div className={'font-bold text-title mb-2'}>{i18nGlobalKey('历史数据')}</div>
          <div className={'flex gap-4'}>
            <div className={'flex'}>
              <div className={'mr-2'}>{i18nGlobalKey('操作记录')}:</div>
              <div>
                <NewButton
                  btnText={{
                    id: 'view',
                    defaultMessage: '查看',
                  }}
                  onClick={() => {
                    openContainer();
                    setContainerTitle('操作记录');
                  }}
                  style={{ width: 60 }}
                />
              </div>
            </div>

            <div className={'flex'}>
              <div className={'mr-2'}>{i18nGlobalKey('报警记录')}:</div>
              <div>
                <NewButton
                  btnText={{
                    id: 'view',
                    defaultMessage: '查看',
                  }}
                  onClick={() => {
                    openContainer();
                    setContainerTitle('报警记录');
                  }}
                  style={{ width: 60 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BaseContainer
        type={ModalType.Drawer}
        open={dataSource.containerStatus}
        onCancel={closeContainer}
        onOk={closeContainer}
        title={containerTitle}
        width="80%"
      >
        {containerTitle === '操作记录' ? (
          <OperationRecord
            getOperationRecordData={getOperationRecordData}
            operationRecord={dataSource.operationRecord}
          />
        ) : (
          <WarningsRecord
            getWarningsRecordData={getWarningsRecordData}
            warningsRecord={dataSource.warningsRecord}
          />
        )}
      </BaseContainer>
    </div>
  );
};
export default SystemParameters;
