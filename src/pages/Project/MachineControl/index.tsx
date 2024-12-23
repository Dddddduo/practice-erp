import React from 'react';
import {useLocation , history } from "umi";
import {PageContainer} from '@ant-design/pro-components';
import BaseContainer, {ModalType} from "@/components/Container";
import {ModelTypeEnum, useMachineControl} from '@/viewModel/Project/useMachineControl';
import FloorSelect from '@/pages/Project/MachineControl/components/FloorSelect';
import TopWarning from '@/pages/Project/MachineControl/components/TopWarning';
import StorePlane from '@/pages/Project/MachineControl/components/StorePlane/StorePlane';
import SettingContainer from "@/pages/Project/MachineControl/components/SettingContainer";
import EnergySaving from "@/pages/Project/MachineControl/components/EnergySaving/EnergySaving";
import SystemParameters from "@/pages/Project/MachineControl/components/SystemParameters/SystemParameters";
import PowerData from "@/pages/Project/MachineControl/components/PowerData/PowerData";
import LightingOperation from "@/pages/Project/MachineControl/components/LightingOperation/LightingOperation";
import IaqDetail from "@/pages/Project/MachineControl/components/StorePlane/IaqDetail";
import TankDetail from "@/pages/Project/MachineControl/components/StorePlane/TankDetail";
import AhuDetail from "@/pages/Project/MachineControl/components/StorePlane/AhuDetail";
import FcuDetail from "@/pages/Project/MachineControl/components/StorePlane/FcuDetail";
import VrvDetail from "@/pages/Project/MachineControl/components/StorePlane/VrvDetail";
import AvDetail from "@/pages/Project/MachineControl/components/StorePlane/AvDetail";
import FanDetail from "@/pages/Project/MachineControl/components/StorePlane/FanDetail";

interface Props {
  storeId: number;
}

const MachineControl: React.FC<Props> = (props) => {
  const location:any  = useLocation();
  console.log('location', location.state?.storeId);
  const {storeId = location.state?.storeId } = props;
  const {
    baseData,
    dataSource,
    handleOnValueChange,
    handleOnChange,
    handleFullValueChange,
  } = useMachineControl(storeId);
  return (
    <>
    <PageContainer>
      <div className={'bg-white p-4 rounded-2xl overflow-hidden'}>
        <div className={'flex justify-between'}>
          <TopWarning
            deviceState={dataSource.connect_status}
            lastConnectTime={dataSource.last_connect_time}
            warningList={dataSource.waringList}
          />
          <FloorSelect
            value={dataSource.selectFloor}
            options={dataSource.floorOptions}
            handleOnChange={handleOnValueChange}
          />
        </div>
        <div className={'flex items-center justify-between w-full'}>
          <StorePlane
            planeImgShapeData={dataSource.planeImgShapeData}
            planeImgDeviceList={dataSource.planeImgDeviceList}
            planeImgDeviceCard={dataSource.detailBoxData}
            handleOnChange={handleOnValueChange}
            deviceState={dataSource.connect_status}
          />
          <SettingContainer handleOnChange={handleOnValueChange}/>
        </div>
      </div>
      <BaseContainer
        open={dataSource.showModelType !== null}
        type={ModalType.Modal}
        onClose={() => {
          handleOnValueChange('showModelType', null);
        }}
        width={1280}
      >
        {dataSource.showModelType === ModelTypeEnum.EnergySaving && <EnergySaving></EnergySaving>}
        {dataSource.showModelType === ModelTypeEnum.SystemParameters && (
          <SystemParameters
            systemParameters={dataSource.settings.systemParameters}
            handleOnChange={handleOnValueChange}
            handleFullValueChange={handleFullValueChange}
          ></SystemParameters>
        )}
        {dataSource.showModelType === ModelTypeEnum.PowerData && (
          <PowerData
            powerData={dataSource.settings.powerData}
            handleOnChange={handleOnValueChange}
          ></PowerData>
        )}
        {dataSource.showModelType === ModelTypeEnum.LightingOperation && (
          <LightingOperation
            lightingOperation={dataSource.settings.lightingOperation}
            handleOnChange={handleOnValueChange}
          ></LightingOperation>
        )}
        {dataSource.showModelType === ModelTypeEnum.AHU && (
          <AhuDetail ahuData={dataSource.AHUData} handleOnChange={handleOnValueChange}></AhuDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.FCU && (
          <FcuDetail fcuData={dataSource.FCUData} handleOnChange={handleOnValueChange}></FcuDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.VRV && (
          <VrvDetail vrvData={dataSource.VRVData} handleOnChange={handleOnValueChange}></VrvDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.AV && (
          <AvDetail groupData={dataSource.GroupData} handleOnChange={handleOnValueChange}></AvDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.IAQ && (
          <IaqDetail iaqData={dataSource.IAQData} handleOnChange={handleOnValueChange}></IaqDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.Tank && (
          <TankDetail tankData={dataSource.TankData} handleOnChange={handleOnValueChange}></TankDetail>
        )}
        {dataSource.showModelType === ModelTypeEnum.FAN && (
          <FanDetail fanData={dataSource.FanData} handleOnChange={handleOnValueChange}></FanDetail>
        )}
      </BaseContainer>
    </PageContainer>
</>
)
  ;
};

export default MachineControl;
