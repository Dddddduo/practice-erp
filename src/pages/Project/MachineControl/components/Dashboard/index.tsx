import React, {useEffect, useState} from "react";
import {cos, pi, sin} from "mathjs";
import {useModel} from "@@/exports";

interface Props {
  inputValue: number,
  title: string,
  unit: string,
  desc?: string | null
}

const Dashboard: React.FC<Props> = ({
                                      inputValue,
                                      title,
                                      unit,
                                      desc,
                                    }) => {
  const {initialState} = useModel('@@initialState');
  const {settings} = initialState;

  // 最外面大容器的大小
  const allContainW: number = 230
  const allContainH: number = 190

  // 里面内容的容器大小
  const insideContainW: number = 100
  const insideContainH: number = 100

  // 颜色改变的半圆大小
  const colorChangeContainW: number = 100
  const colorChangeContainH: number = 50

  // 角度改变的半圆大小
  const angleChangeContainW: number = 100.3
  const angleChangeContainH: number = 50

  // 底部背景半圆大小
  const underBgContainW: number = 100
  const underBgContainH: number = 50

  // 中心圆的大小
  const centerOfCircleContainW: number = 80
  const centerOfCircleContainH: number = 80

  // 刻度大小
  const scaleContainW: number = 6
  const scaleContainH: number = 3.5

  // 圆点大小
  const dotContainW: number = 16
  const dotContainH: number = 16

  // 文字容器大小
  const labelContainW: number = 34
  const labelContainH: number = 15

  // 外面传递的数据范围
  const valueRange = [0, 100]

  // 是否是温水
  const warmWaterValue: number = 54 // 角度（30摄氏度对应54度）

  // top偏移量
  const topOffset = 10

  const step: number = 20 // 刻度数量

  const label: number = 5 // 显示值数量

  const [config, setConfig] = useState<any>({
    realWaterColorL: '#F48A74',
    realWaterColorR: '#F4AE86',
    realWaterZeta: 0,
    dotT: 0,
    dotL: 0,
    waterLimit: 0,
    isExceedWarmWater: false,
  });

  const scaleTopValue = (zeta: number): number => {
    return (allContainH / 2) - (colorChangeContainW / 2 + scaleContainW / 2 + 10) * sin(zeta * pi / 180) - (scaleContainH / 2) + topOffset
  }

  const scaleLeftValue = (zeta: number): number => {
    return (allContainW / 2) - (colorChangeContainW / 2 + scaleContainW / 2 + 10) * cos(zeta * pi / 180) - (scaleContainW / 2)
  }

  const labelTopValue = (zeta: number): number => {
    return (allContainH / 2) - (colorChangeContainW / 2 + labelContainH / 2 + 20) * sin(zeta * pi / 180) - (labelContainH / 2) + topOffset
  }

  const labelLeftValue = (zeta: number): number => {
    return (allContainW / 2) - (colorChangeContainW / 2 + labelContainW / 2 + 20) * cos(zeta * pi / 180) - (labelContainW / 2)
  }

  const dotTopValue = (zeta: number): number => {
    return (allContainH / 2) - (colorChangeContainW / 2 - 5) * sin(zeta * pi / 180) + topOffset - (dotContainW / 2)
  }

  const dotLeftValue = (zeta: number): number => {
    return (allContainW / 2) - (colorChangeContainW / 2 - 5) * cos(zeta * pi / 180) - (dotContainW / 2)
  }

  const getZetaByInputValue = (inputValue: number): number => {
    let changeValue: number = inputValue
    if (inputValue < valueRange[0]) {
      changeValue = valueRange[0]
    }
    if (inputValue > valueRange[1]) {
      changeValue = valueRange[1];
    }

    return changeValue * (180 / (valueRange[1] - valueRange[0]))
  }

  const renderStep = () => {
    const divs: any[] = [];

    for (let i = 0; i < step; i++) {
      const rotateDegree = i * (180 / (step - 1)); // 计算每个 div 的旋转角度

      const style: any = {
        width: scaleContainW,
        height: scaleContainH,
        position: 'absolute',
        top: scaleTopValue(rotateDegree),
        left: scaleLeftValue(rotateDegree),
        zIndex: 1,
        backgroundColor: (i <= config.waterLimit && config.realWaterZeta <= warmWaterValue && config.waterLimit > 0) ? '#F48A74' : (i <= config.waterLimit && config.realWaterZeta > warmWaterValue ? '#BEB1C3' : '#EEEEEF'
        ),
        transformOrigin: 'center center', // 将旋转中心点设置为元素的顶部中心
        transform: `rotate(${rotateDegree}deg)`, // 应用旋转角度
        borderRadius: scaleContainW / 4,
      };

      divs.push(<div key={i} style={style}></div>);
    }

    return <>{divs}</>;
  }

  const renderLabel = () => {
    const divs: any[] = [];

    for (let i = 0; i < label; i++) {
      const rotateDegree = i * (180 / (label - 1)); // 计算每个 div 的旋转角度

      const labelText = (rotateDegree / 1.8) % 1 === 0 && rotateDegree !== 0 ? `${rotateDegree / 1.8}.0` : rotateDegree / 1.8;

      const style: any = {
        width: labelContainW,
        height: labelContainH,
        position: 'absolute',
        top: labelTopValue(rotateDegree),
        left: labelLeftValue(rotateDegree),
        zIndex: 1,
        // backgroundColor: 'grey',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#888888',
        fontWeight: 'bold',
      };

      divs.push(<div key={i} style={style}>
        {labelText}
      </div>);
    }

    return <>{divs}</>;
  }

  useEffect(() => {
    // todo1: 得当真实值对应的角度；比如：50摄氏度就是90度
    const realWaterZeta = getZetaByInputValue(inputValue)

    let newConfig = {
      ...config,
      realWaterZeta,
      waterLimit: realWaterZeta / (180 / step) - 1,
      dotT: dotTopValue(realWaterZeta),
      dotL: dotLeftValue(realWaterZeta),
    }

    if (newConfig.realWaterZeta <= warmWaterValue) {
      newConfig.realWaterColorL = '#F48A74'
      newConfig.realWaterColorR = '#F4AE86'
    } else {
      newConfig.realWaterColorL = '#BEB1C3'
      newConfig.realWaterColorR = '#DED6D3'
    }

    // console.log('配置数据', newConfig)
    setConfig(newConfig)

    // todo2: 循环所有的刻度
  }, [inputValue]);

  return (
    <div style={{
      position: 'relative',
      width: allContainW,
      height: allContainH,
      backgroundColor: settings.navTheme === 'light' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)',
      paddingTop: topOffset,
      borderRadius: 8,
    }}>
      {/* 刻度遍历 */}
      {
        renderStep()
      }
      {/* label遍历 */}
      {
        renderLabel()
      }
      {/* 进度圆点 */}
      {
        config.dotL > 0 && config.dotT > 0 &&
        <div style={{
          position: 'absolute',
          top: `${config.dotT}px`,
          left: `${config.dotL}px`,
          zIndex: 2,
          width: dotContainW,
          height: dotContainH,
          borderRadius: '8px',
          backgroundImage: `linear-gradient(to right, ${config.realWaterColorL} 0%, ${config.realWaterColorR} 100%)`,
          // backgroundColor: 'red',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
        }}/>
      }

      <div style={{
        position: 'relative',
        top: (allContainH - insideContainH) / 2,
        left: (allContainW - insideContainW) / 2,
        width: insideContainW,
        height: insideContainH,
      }}>

        <div style={{
          position: 'absolute',
          width: colorChangeContainW,
          height: colorChangeContainH,
          borderRadius: '50px 50px 0 0',
          backgroundImage: `linear-gradient(to right, ${config.realWaterColorL} 0%, ${config.realWaterColorR} 100%)`,
        }}/>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: angleChangeContainW,
          height: angleChangeContainH,
          borderRadius: '0 0 50px 50px',
          backgroundColor: settings.navTheme === 'light' ? '#EEEEEF' : 'rgba(159, 159, 159, 1)',
          transform: `rotate(${-(180 - config.realWaterZeta)}deg)`, // 使用模板字符串和变量
          transformOrigin: 'center top', /* 将旋转中心点设置为元素的顶部中心 */
        }}/>

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: underBgContainW,
          height: underBgContainH,
          borderRadius: '0 0 50px 50px',
          backgroundColor: settings.navTheme === 'light' ? '#F7F7F7' : 'rgba(104, 104, 104, 1)',
        }}/>

        <div style={{
          position: 'absolute',
          top: (insideContainW - centerOfCircleContainW) / 2,
          left: (insideContainH - centerOfCircleContainH) / 2,
          width: centerOfCircleContainW,
          height: centerOfCircleContainH,
          borderRadius: '50%',
          background: settings.navTheme === 'light' ? 'radial-gradient(131.48% 131.48% at 106.21% 117.49%, #EEEEEF 0%, #FFFFFF 100%)' : 'radial-gradient(131.48% 131.48% at 106.21% 117.49%, #A2A2A2 0%, #FFFFFF 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#404040',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{width: centerOfCircleContainW / 5 * 3, textAlign: 'center'}}>
            <div style={{fontWeight: 'bold', marginBottom: 4}}>
              {inputValue < 0 ? 0 : (inputValue > 100 ? 100 : inputValue)}{unit}
            </div>
            <div style={{fontSize: 8, textAlign: 'center'}}>
              {title}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          position: 'absolute',
          bottom: '8px',
          textAlign: 'center'
        }}
      >
        {desc}
      </div>
    </div>
  )
}

export default Dashboard;
