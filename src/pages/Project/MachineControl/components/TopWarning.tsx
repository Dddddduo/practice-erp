import { Carousel } from 'antd';
import React from 'react';

interface Props {
  warningList: string[];
  deviceState: boolean;
  lastConnectTime: string;
}

const TopWarning: React.FC<Props> = ({ warningList, deviceState, lastConnectTime }) => {
  console.log('lastConnectTime--lastConnectTime',lastConnectTime)
  return (
    <div className={'w-[60%]'} style={{ width: '60%' }}>
      <div className={'flex gap-4 mb-2 text-[#808080]'}>
        {deviceState ? (
          <div className={'flex gap-2 items-center '}>
            <img className={'w-6'} src={'/status/online.png'} alt={'online'} />
            <div>设备在线</div>
            <div>最后更新时间 {lastConnectTime}</div>
          </div>
        ) : (
          <div className={'flex gap-2 items-center '}>
            <img className={'w-6'} src={'/status/offline.png'} alt={'offline'} />
            <div>设备离线</div>
            <div>最后更新时间 {lastConnectTime}</div>
          </div>
        )}
      </div>
      {warningList.length === 0 ? null : (
        <div className={'flex items-center border border-gray-200 p-1 rounded-1xl '}>
          <img src="/image/air/警示.png" alt="" width={20} className={'mr-2'} />
          <div style={{ width: 200, height: 20 }}>
            <Carousel fade={true} autoplay dots={false} autoplaySpeed={3000}>
              {warningList.map((content, index) => (
                <div key={index} className={'text-red-600'} style={{ color: 'red' }}>
                  {content}
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopWarning;
