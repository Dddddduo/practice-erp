import React from "react";
import {FormattedMessage} from "@umijs/max";

const Legend: React.FC = () => {

  const data = [
    {
      title: <FormattedMessage id="airVent" defaultMessage="送风口"/>,
      icon: '/image/air/send.png'
    },
    {
      title: <FormattedMessage id="returnAirVent" defaultMessage="回风口"/>,
      icon: '/image/air/return.png'
    },
    {
      title: <FormattedMessage id="running" defaultMessage="运行"/>,
      icon: '/image/air/run.png'
    },
    {
      title: <FormattedMessage id="shutdown" defaultMessage="停止"/>,
      icon: '/image/air/stop.png'
    },
    {
      title: <FormattedMessage id="airQuality" defaultMessage="空气质量"/>,
      icon: '/image/air/pm2.5优.png'
    },
    {
      title: <FormattedMessage id="power" defaultMessage="电能"/>,
      icon: '/image/air/electric.png'
    },
    {
      title: <FormattedMessage id="alert" defaultMessage="报警"/>,
      icon: '/image/air/warning.png'
    },
    {
      title: <FormattedMessage id="leakageAlarm" defaultMessage="漏水报警"/>,
      icon: '/image/air/water_leak.png'
    },
  ];

  return (
    <div>
      <div className={'mb-2'}>
        <FormattedMessage id={'indicatorLightInstructions'} defaultMessage={'指示灯'}/>
      </div>

      <div className='flex flex-wrap'>
        {data.map((item) => {
          return (
            <div key={item.icon} className={'mx-1 mb-1 flex items-center w-20'}>
              <img src={item.icon} alt='Icon' width={30}/>
              <div className={'text-small'}>{item.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Legend;
