import React from 'react';
import {FormattedMessage} from "@@/exports";
import {getDifferentIcon} from "@/utils/machine_control_service";
import { AloneData } from '@/ViewModel/useMachineControl';
interface Props {
  data:AloneData,
  onClick: () => void
}
const DeviceCardItem: React.FC<Props> = (props) => {
  const { data: item, onClick } = props
  return (
    <div
      style={{
        backgroundColor: '#EEEEEF',
        width: 'fit-content',
        height: 'auto',
        borderRadius: 8,
        padding:12
      }}
    >
      {/* 设备名称 */}
      <div
        style={{
          width: 100,
          height: 30,
          borderRadius: 6,
          background: 'linear-gradient(to right, #F48A74 0%, #F4AE86 100%)',
          fontWeight: 'bold',
          fontSize: 16,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
          cursor: 'pointer'
        }}
        onClick={() => {
          onClick()
        }}
      >
        {item.deviceName}
      </div>

      {/* 设备状态 */}
      <div style={{ display: 'flex', alignItems: 'center', color: '#888888', marginBottom: 4 }}>
        <div><FormattedMessage id="status" defaultMessage="状态" />：</div>
        <div>{item.deviceStatus}</div>
        <img src={getDifferentIcon(item.deviceType, item.deviceStatus)} width={28} style={{ marginLeft: 2 }} alt="" />
      </div>

      {/* 动态显示信息 */}
      {
        item.contentList.map((data, index) => {
          return (
            <div
              key={index}
              style={{ display: 'flex', color: '#888888', marginBottom: 4, letterSpacing: 1 }}
            >
              <div>{data.key}：</div>
              <div>{data.value}</div>
            </div>
          )
        })
      }
    </div>
  )
};

export default DeviceCardItem;
