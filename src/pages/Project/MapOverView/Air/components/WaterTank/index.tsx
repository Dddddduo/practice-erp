import { Button, Card, Image, Space, Switch, message } from "antd"
import { isEmpty } from "lodash"
import React, { useEffect, useState, useRef } from "react"
import './index.css'
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import PasswordDialog from '../PasswordDialog'
import { passwordExpire, localDataExpire } from '@/utils/utils'
import { changeOperation } from '@/services/ant-design-pro/air'

interface ItemListProps {
  acList: any,
  tourOpen: boolean,
  handleCloseOpen: () => void,
  floor: any
}

const pipe = '/air-condition/water-pipe.png'
const pipeMove = '/air-condition/water-pipe-move.gif'

const WaterTank: React.FC<ItemListProps> = ({
  acList,
  tourOpen,
  handleCloseOpen,
  floor,
}) => {

  // 漫游引导ref list
  const tour1 = useRef(null);
  const tour2 = useRef(null);

  const [messageApi, contextHolder] = message.useMessage();

  const steps: TourProps['steps'] = [
    {
      title: '1号水泵',
      description: '控制1号水泵的开关',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour1.current,
    },
    {
      title: '2号水泵',
      description: '控制2号水泵的开关',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour2.current,
    }
  ];

  const [tank, setTank] = useState({})

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  const [localDataList, setLocalDataList] = useState({
    '1号水泵启动': {
      value: 0,
      time: 0,
      id: '1号水泵启动',
    },
    '2号水泵启动': {
      value: 0,
      time: 0,
      id: '2号水泵启动',
    }
  })

  const getLocalData = (id: string): any => {
    let value: any = ''

    Object.keys(localDataList).forEach(key => {
      if (localDataList[key].id == id) {
        value = localDataList[key].value
      }
    })

    return value
  }


  const setLocalData = (id: string, value: any): any => {
    // 判断是否过期
    if (passwordExpire()) {
      setShowPasswordDialog(true)
      return;
    }

    let params = {
      type: id,
      machine: !isEmpty(tank) ? tank.name : '',
      value: 0,
      floor: floor,
      store_id: 1193,
    }

    if (id == '1号水泵启动') {
      if (value) {
        params.value = 1
      } else {
        params.value = 0
      }
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == '2号水泵启动') {
      if (value) {
        params.value = 1
      } else {
        params.value = 0
      }
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }
  }

  const changeLocalData = (id: string, value: any) => {
    let localData = { ...localDataList }


    if (id == '1号水泵启动') {
      localData['1号水泵启动'].value = value
      localData['1号水泵启动'].time = Date.now()
      setLocalDataList(localData)
    }


    if (id == '2号水泵启动') {
      localData['2号水泵启动'].value = value
      localData['2号水泵启动'].time = Date.now()
      setLocalDataList(localData)
    }
  }

  const codeSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '指令下发成功，请等待15秒查看结果...',
    });
  };


  const handleWater = (): string => {
    let height = '0%'

    if (tank['低液位'].value == 1) {
      height = '70%'
    } else if (tank['中液位'].value == 1) {
      height = '90%'
    } else if (tank['高液位'].value == 1) {
      height = '120%'
    } else if (tank['超高液位'].value == 1) {
      height = '140%'
    }


    return height
  }

  useEffect(() => {
    if (!isEmpty(acList)) {

      let localData = { ...localDataList }

      Object.keys(acList).forEach(key => {
        if (acList[key].device_type == 'tank') {

          console.log('打印选中的tank', acList[key]);
          setTank(acList[key])

          // 1号水泵启动
          if (localDataExpire(localData['1号水泵启动'].time)) {
            localData['1号水泵启动'].value = acList[key]['1号水泵启动'].value == 1
            setLocalDataList(localData)
          }

          // 2号水泵启动
          if (localDataExpire(localData['2号水泵启动'].time)) {
            localData['2号水泵启动'].value = acList[key]['2号水泵启动'].value == 1
            setLocalDataList(localData)
          }
          return;
        }
      })
    }

  }, [acList])


  return (
    <>
      {contextHolder}
      <div>
        {
          !isEmpty(tank) &&

          <Card
            style={{ height: 830 }}
            bordered={false}
            title={
              <Space>
                <Button type="primary" size="large">低液位:{tank['低液位'].value == 1 ? '有' : '无'}</Button>
                <Button type="primary" size="large">中液位:{tank['中液位'].value == 1 ? '有' : '无'}</Button>
                <Button type="primary" size="large">高液位:{tank['高液位'].value == 1 ? '有' : '无'}</Button>
                <Button type="primary" size="large">超高液:{tank['超高液位'].value == 1 ? '有' : '无'}</Button>
              </Space>
            }
            extra={
              <Space>
                <Card ref={tour1}>
                  <Space>
                    <span>1号水泵</span>
                    <Switch
                      checkedChildren={tank['1号水泵启动'].val_map[1]}
                      unCheckedChildren={tank['1号水泵启动'].val_map[0]}
                      disabled={!localDataExpire(localDataList['1号水泵启动'].time)}
                      value={getLocalData('1号水泵启动')}
                      onChange={(checked: boolean) => setLocalData('1号水泵启动', checked)}
                    />
                  </Space>
                </Card>

                <Card ref={tour2}>
                  <Space>
                    <span>2号水泵</span>
                    <Switch
                      checkedChildren={tank['2号水泵启动'].val_map[1]}
                      unCheckedChildren={tank['2号水泵启动'].val_map[0]}
                      disabled={!localDataExpire(localDataList['2号水泵启动'].time)}
                      value={getLocalData('2号水泵启动')}
                      onChange={(checked: boolean) => setLocalData('2号水泵启动', checked)}
                    />
                  </Space>
                </Card>
              </Space>
            }
          >
            <div style={{ width: '100%', height: '75vh' }}>
              <div className="out">
                <Image
                  preview={false}
                  width='100%'
                  src="/air-condition/water-tank.png"
                  style={{ position: 'absolute' }}
                />
                <Image
                  preview={false}
                  width='8%'
                  src={tank['1号水泵启动'].value == 1 ? pipeMove : pipe}
                  style={{ position: 'absolute', left: '145px' }}
                />
                <Image
                  preview={false}
                  width='8%'
                  src={tank['2号水泵启动'].value == 1 ? pipeMove : pipe}
                  style={{ position: 'absolute', left: '210px' }}
                />
                <div className="bucket">
                  <div className="water" style={{ height: handleWater() }}></div>
                </div>
              </div>
            </div>
          </Card >
        }
        {
          isEmpty(tank) && <div>暂无数据！</div>
        }
      </div>
      <Tour open={tourOpen} onClose={handleCloseOpen} steps={steps} />
      {
        showPasswordDialog && <PasswordDialog open={showPasswordDialog} successCallback={() => setShowPasswordDialog(false)} cancelCallback={() => setShowPasswordDialog(false)} />
      }
    </>
  )
}

export default WaterTank