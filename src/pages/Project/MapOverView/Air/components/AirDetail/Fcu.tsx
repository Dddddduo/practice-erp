import { Button, Card, Input, Select, Space, Switch } from "antd"
import React, { useEffect, useState, useRef } from "react"
import './index.css'
import { isEmpty } from "lodash"
import type { TourProps } from 'antd';
import { Tour, Popconfirm, Modal, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import PasswordDialog from '../PasswordDialog'
import { passwordExpire, localDataExpire } from '@/utils/utils'
import { changeOperation } from '@/services/ant-design-pro/air'

const move_cool = '/air-condition/short_cold_move_water.gif'
const static_cool = '/air-condition/short_cold_static_water.png'
const move_hot = '/air-condition/short_hot_move_water.gif'
const static_hot = '/air-condition/short_hot_static_water.png'
const hot = '/air-condition/fans.png'
const cool = '/air-condition/fans_cold.png'


interface ItemListProps {
  detail: any
  airDetail: any
  ehData: any
  floor: any
}

const Fcu: React.FC<ItemListProps> = ({
  detail,
  airDetail,
  ehData,
  floor
}) => {
  const [formatDetail, setFormatDetail] = useState<any>({})
  // 风速
  const [currentSpeedList, setCurrentSpeedList] = useState<any>([])
  // 模式
  const [modeList, setModeList] = useState<any>([])
  // 转速
  const [speed, setSpeed] = useState('')
  // 风扇path
  const [fanImg, setFanImg] = useState('')
  // 水流path
  const [waterPipe, setWaterPipe] = useState('')
  // eh加热模式
  const [ehHotModeList, setEhHotModeList] = useState([])
  // eh加热档位
  const [ehHotLevelList, setEhHotLevelList] = useState([])
  // 漫游引导ref list
  const tour1 = useRef(null);
  const tour2 = useRef(null);
  const tour3 = useRef(null);
  const tour4 = useRef(null);
  const tour5 = useRef(null);
  const tour6 = useRef(null);
  const tour7 = useRef(null);

  const [open, setOpen] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  const [inputType, setInputType] = useState('');
  const [input, setInput] = useState('');

  const steps: TourProps['steps'] = [
    {
      title: '启停模式',
      description: <div>手动:由人工控制 <br /> 自动:由机器控制</div>,
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour1.current,
    },
    {
      title: '开关机',
      description: '在手动模式下可以控制机器的开关',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour2.current,
    },
    {
      title: '风速',
      description: '调整风速的等级.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour3.current,
    },
    {
      title: '模式',
      description: '调整空调的模式.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour4.current,
    },
    {
      title: '加热模式',
      description: '调整空调加热模式.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour5.current,
    },
    {
      title: '电加热',
      description: '在冬天模式下可以调整电加热的等级',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour6.current,
    },
    {
      title: '设定温度',
      description: '设定空调预期达到的温度.',
      target: () => tour7.current,
    },
  ];

  const [localDataList, setLocalDataList] = useState({
    "auto_hand": {
      value: false,
      time: 0,
      id: 'auto_hand'
    },
    "switch": {
      value: false,
      time: 0,
      id: 'switch'
    },
    "current_speed": {
      value: 0,
      time: 0,
      id: 'current_speed'
    },
    "加热模式": {
      value: 0,
      time: 0,
      id: '加热模式'
    },
    "电热档启动": {
      value: '0',
      time: 0,
      id: '电热档启动'
    },
    "mode": {
      value: 0,
      time: 0,
      id: 'mode'
    },
    "temperature": {
      value: '',
      time: 0,
      id: 'temperature'
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

  const setLocalData = (id: string, value: any, machine = formatDetail.name): any => {
    // 判断是否过期
    if (passwordExpire()) {
      setShowPasswordDialog(true)
      return;
    }

    let params = {
      type: id,
      machine: machine ?? '',
      value: 0,
      floor: floor,
      store_id: 1193,
    }

    console.log('打印params✅✅✅', params);

    if (id == 'auto_hand') {
      if (value) {
        params.value = 1
      } else {
        params.value = 0
      }
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == 'switch') {
      if (value) {
        params.value = 1
      } else {
        params.value = 0
      }
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == 'current_speed') {
      params.value = value
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == 'mode') {
      params.value = value
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == '加热模式') {
      params.value = value
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == '电热档启动') {
      params.value = value
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }


    if (id == 'temperature') {
      if (!isEmpty(formatDetail[inputType]) && !isEmpty(formatDetail[inputType].range)) {
        if (input >= formatDetail[inputType].range[0] && input <= formatDetail[inputType].range[1]) {
          params.value = input
          changeOperation(params)
          codeSuccess()
          changeLocalData(id, input)
        } else {
          errMessage('请输入合规数字')
        }
      } else {
        params.value = input
        changeOperation(params)
        codeSuccess()
        changeLocalData(id, value)
      }
    }
  }

  const changeLocalData = (id: string, value: any) => {
    let localData = { ...localDataList }

    if (id == 'auto_hand') {
      localData.auto_hand.value = value
      localData.auto_hand.time = Date.now()
      setLocalDataList(localData)
    }

    if (id == 'switch') {
      localData.switch.value = value
      localData.switch.time = Date.now()
      setLocalDataList(localData)
    }

    if (id == 'current_speed') {
      localData.current_speed.value = value
      localData.current_speed.time = Date.now()
      setLocalDataList(localData)
      setInputType('')
    }

    if (id == 'mode') {
      localData.mode.value = value
      localData.mode.time = Date.now()
      setLocalDataList(localData)
      setInputType('')
    }

    if (id == '加热模式') {
      localData['加热模式'].value = value
      localData['加热模式'].time = Date.now()
      setLocalDataList(localData)
      setInputType('')
    }

    if (id == '电热档启动') {
      localData['电热档启动'].value = value
      localData['电热档启动'].time = Date.now()
      setLocalDataList(localData)
      setInputType('')
    }


    if (id == 'temperature') {
      localData.temperature.value = value
      localData.temperature.time = Date.now()
      setLocalDataList(localData)
      setInputType('')
    }
  }

  const codeSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '指令下发成功，请等待15秒查看结果...',
    });
  };

  const errMessage = (text: string) => {
    messageApi.open({
      type: 'error',
      content: `${text}`,
    });
  }

  const tourConfirm = (e: any) => {
    console.log(e);
    setOpen(true)
  };

  const handleEhData = () => {
    if (!isEmpty(ehData)) {

      let localData = { ...localDataList }

      // eh加热模式
      let hot: any = []

      ehData['加热模式'].val_map.map((item, index) => {
        hot.push({
          value: index,
          label: item
        })
      })

      setEhHotModeList(hot)

      if (localDataExpire(localData['加热模式'].time)) {
        // console.log('加热模式 超过了15s, 去更新✅✅✅', Number(ehData['加热模式'].value));
        localData['加热模式'].value = Number(ehData['加热模式'].value)
        setLocalDataList(localData)
      }


      // eh档位
      let level: any = []

      level.push({
        value: '0',
        label: '停止',
      })

      if (ehData['电热1档启动'] != null) {
        level.push({
          value: '1',
          label: '1档',
        })
      }
      if (ehData['电热2档启动'] != null) {
        level.push({
          value: '2',
          label: '2档',
        })
      }
      if (ehData['电热3档启动'] != null) {
        level.push({
          value: '3',
          label: '3档',
        })
      }

      setEhHotLevelList(level)

      if (ehData['电热1档启动'] != null &&
        ehData['电热1档启动']['value'] == 1) {
        if (localDataExpire(localData['电热档启动'].time)) {
          localData['电热档启动'].value = '1'
          setLocalDataList(localData)
        }
      } else if (ehData['电热2档启动'] != null &&
        ehData['电热2档启动']['value'].toString() == '1') {
        if (localDataExpire(localData['电热档启动'].time)) {
          localData['电热档启动'].value = '2'
          setLocalDataList(localData)
        }
      } else if (ehData['电热3档启动'] != null &&
        ehData['电热3档启动']['value'].toString() == '1') {
        if (localDataExpire(localData['电热档启动'].time)) {
          localData['电热档启动'].value = '3'
          setLocalDataList(localData)
        }
      } else {
        if (localDataExpire(localData['电热档启动'].time)) {
          localData['电热档启动'].value = '0'
          setLocalDataList(localData)
        }
      }
    }
  }

  const handleLevelText = (value: number) => {
    if (value == 0) {
      return '停止'
    } else if (value == 1) {
      return '1档'
    } else if (value == 2) {
      return '2档'
    } else if (value == 3) {
      return '3档'
    } else {
      return ''
    }
  }

  const handleInput = (e: any) => {
    const { value: inputValue } = e.target;
    // 只保留输入值中的数字
    const filteredValue = inputValue.replace(/[^\d]/g, '');
    console.log('filteredValue', filteredValue);

    setInput(filteredValue)
  }

  useEffect(() => {
    const format = detail
    setFormatDetail(format)

    let localData = { ...localDataList }

    // 启停模式
    if (localDataExpire(localData.auto_hand.time)) {
      localData.auto_hand.value = format.auto_hand.value == 1
      setLocalDataList(localData)
    }

    // 开关机
    if (localDataExpire(localData.switch.time)) {
      localData.switch.value = format.switch.value == 1
      setLocalDataList(localData)
    }

    // 设定温度
    if (localDataExpire(localData.temperature.time)) {
      localData.temperature.value = format.temperature.value
      setLocalDataList(localData)
    }

    // 设置水流
    if (format.mode.format_val === '制暖') {
      setFanImg(hot)
      if (Number(format.switch.value) === 1) {
        setWaterPipe(move_hot)
      } else {
        setWaterPipe(static_hot)
      }
    } else {
      setFanImg(cool)
      if (Number(format.switch.value) === 1) {
        setWaterPipe(move_cool)
      } else {
        setWaterPipe(static_cool)
      }
    }

    // 设置风扇速度
    if (Number(format.switch.value) === 1) {
      if (format.current_speed.format_val === '高速') {
        setSpeed('0.5s')
      } else if (format.current_speed.format_val === '低速') {
        setSpeed('1.5s')
      } else {
        setSpeed('1s')
      }
    } else {
      setSpeed('0s')
    }

    // 风速
    let current_speed: any = []

    for (const key in format.current_speed.val_map) {
      current_speed.push({
        value: Number(key),
        label: format.current_speed.val_map[key]
      })
    }

    if (localDataExpire(localData.current_speed.time)) {
      localData.current_speed.value = Number(format.current_speed.value)
      setLocalDataList(localData)
    }

    setCurrentSpeedList(current_speed)

    // 模式
    let mode: any = []

    for (const key in format.mode.val_map) {
      mode.push({
        value: Number(key),
        label: format.mode.val_map[key]
      })
    }

    if (localDataExpire(localData.mode.time)) {
      localData.mode.value = Number(format.mode.value)
      setLocalDataList(localData)
    }

    setModeList(mode)

    handleEhData()

  }, [airDetail])

  return (
    <>
      {
        !isEmpty(formatDetail) &&
        <>
          {contextHolder}
          <div style={{ height: "90vh" }}>
            <div style={{ display: 'flex' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '6px' }}>{formatDetail.name}</div>
              <Popconfirm
                title="教程"
                description="是否开启引导教程?"
                onConfirm={tourConfirm}
                okText="开始"
                cancelText="取消"
              >
                <QuestionCircleOutlined style={{ fontSize: '18px' }} onClick={() => console.log('被点击是')} />
              </Popconfirm>
            </div>

            <Card
              // 表头选项
              title={
                <Space>
                  <Card style={{ margin: 15 }} hoverable ref={tour1}>
                    <span style={{ marginRight: 15 }}>{formatDetail.auto_hand.name}</span>
                    <Switch
                      checkedChildren={formatDetail.auto_hand.val_map[1]}
                      unCheckedChildren={formatDetail.auto_hand.val_map[0]}
                      disabled={!localDataExpire(localDataList.auto_hand.time)}
                      value={getLocalData('auto_hand')}
                      onChange={(checked: boolean) => setLocalData('auto_hand', checked)}
                    />
                  </Card>

                  <Card style={{ margin: 15 }} hoverable ref={tour2}>
                    <span style={{ marginRight: 15 }}>{formatDetail.switch.name}</span>
                    <Switch
                      checkedChildren={formatDetail.switch.val_map[1]}
                      unCheckedChildren={formatDetail.switch.val_map[0]}
                      disabled={!localDataExpire(localDataList.switch.time) || formatDetail.auto_hand.value == 0}
                      value={getLocalData('switch')}
                      onChange={(checked: boolean) => setLocalData('switch', checked)}
                    />
                  </Card>
                </Space>
              }
              bordered={false}
            >
              {/* 内容按钮部分 */}
              <div className="btns">
                <Space>
                  {/* 风速 */}
                  <Button
                    type="primary"
                    size="large"
                    className="btn"
                    style={{ height: 60 }}
                    ref={tour3}
                  >
                    {formatDetail.current_speed.name}
                    <Select
                      style={{ width: 100, }}
                      options={currentSpeedList}
                      value={getLocalData('current_speed')}
                      onChange={(value) => setLocalData('current_speed', value)}
                      disabled={!localDataExpire(localDataList.current_speed.time)}
                    />
                  </Button>

                  {/* 模式 */}
                  <Button
                    type="primary"
                    size="large"
                    className="btn"
                    style={{ height: 60 }}
                    ref={tour4}
                  >
                    {formatDetail.mode.name}
                    <Select
                      style={{ width: 100, }}
                      options={modeList}
                      value={getLocalData('mode')}
                      onChange={(value) => setLocalData('mode', value)}
                      disabled={!localDataExpire(localDataList.mode.time)}
                    />
                  </Button>

                  {
                    !isEmpty(ehData) &&
                    <Button size="large" type="primary" style={{ height: 60 }}>
                      {ehData['电热送风温度']['name']}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {ehData['电热送风温度']['format_val']}
                    </Button>
                  }
                </Space>
              </div>

              {
                !isEmpty(ehData) &&
                <div className="btns" style={{ marginTop: '20px' }}>
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      className="btn"
                      style={{ height: 60 }}
                      ref={tour5}
                    >
                      加热模式
                      <Select
                        style={{ width: 100, }}
                        options={ehHotModeList}
                        value={getLocalData('加热模式')}
                        onChange={(value) => setLocalData('加热模式', value, ehData.name)}
                        disabled={!localDataExpire(localDataList['加热模式'].time)}
                      />
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      className="btn"
                      style={{ height: 60 }}
                      ref={tour6}
                    >
                      {ehData.name}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {
                        ehData['加热模式'].value == 1 ?
                          <Select
                            style={{ width: 100 }}
                            options={ehHotLevelList}
                            value={getLocalData('电热档启动')}
                            onChange={(value) => setLocalData('电热档启动', value, ehData.name)}
                            disabled={!localDataExpire(localDataList['电热档启动'].time)}
                          /> : <div>{handleLevelText(getLocalData('电热档启动'))}</div>
                      }

                    </Button>
                  </Space>
                </div>
              }

              {/* 平面图 */}
              <Card style={{ marginTop: '40px' }}>
                <div
                  className="bottomImage"
                  style={{
                    backgroundImage: 'url(/air-condition/fcu.png)',
                    backgroundSize: '100% 100%',
                    backgroundPositionY: "4vh"
                  }}
                >
                  <img
                    src={fanImg}
                    className="fan"
                    style={{ animationDuration: speed }}
                  />
                  <img
                    src={waterPipe}
                    style={{ position: 'absolute', top: "6vh", left: '22vw', width: 300 }}
                  />
                  <Button size="large" type="primary" style={{ position: 'absolute', top: '20vh', left: '5vw' }}>回风</Button>
                  <Button size="large" type="primary" style={{ position: 'absolute', top: '20vh', right: '10vw' }}>送风</Button>
                  {/* 环境温度 */}
                  <Button size="large" type="primary" style={{ position: 'absolute', left: '6.2vw' }}>
                    {formatDetail.wind_return_temperature.name}
                    {formatDetail.wind_return_temperature.value}
                    {formatDetail.wind_return_temperature.unit}
                  </Button>
                  {/* 名字 */}
                  <Button size="large" type="primary" style={{ position: 'absolute', top: '16vh', left: '43vw' }}>
                    {formatDetail.name}
                  </Button>
                  {/* 运行 */}
                  <Button size="large" type="primary" style={{ position: 'absolute', top: '35vh', left: '43vw' }}>
                    {formatDetail.switch.format_val}
                  </Button>
                  {/* 设定温度 */}
                  <Button
                    size="large"
                    type="primary"
                    style={{
                      position: 'absolute',
                      left: '43vw',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    ref={tour7}
                  >
                    {formatDetail.temperature.name}
                    &nbsp;
                    <Input
                      style={{ width: 80, height: 35, display: 'flex', }}
                      readOnly
                      value={getLocalData('temperature')}
                      suffix={<div onClick={() => {
                        if (!localDataExpire(localDataList.temperature.time)) {
                          return
                        }

                        // 判断是否过期
                        if (passwordExpire()) {
                          setShowPasswordDialog(true)
                          return;
                        }
                        setInput(getLocalData('temperature'))
                        setInputType('temperature')
                      }}>{formatDetail.temperature.unit}</div>}
                      onClick={() => {
                        if (!localDataExpire(localDataList.temperature.time)) {
                          return
                        }

                        // 判断是否过期
                        if (passwordExpire()) {
                          setShowPasswordDialog(true)
                          return;
                        }
                        setInput(getLocalData('temperature'))
                        setInputType('temperature')
                      }
                      }
                    />
                  </Button>
                </div>
              </Card>
            </Card>
          </div>
          <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
          {
            showPasswordDialog && <PasswordDialog open={showPasswordDialog} successCallback={() => setShowPasswordDialog(false)} cancelCallback={() => setShowPasswordDialog(false)} />
          }

          <Modal title="请输入" open={inputType != ''} onOk={() => setLocalData(inputType, input)} onCancel={() => setInputType('')}>
            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
              <Input placeholder="请输入" value={input} onChange={(e) => handleInput(e)} />
              {
                !isEmpty(formatDetail[inputType]) && !isEmpty(formatDetail[inputType].range) &&
                <div style={{ color: 'red', fontSize: '14px', marginTop: "6px" }}>请输入{formatDetail[inputType].range[0]} ~ {formatDetail[inputType].range[1]}之间的数字</div>
              }
            </div>
          </Modal>
        </>
      }
    </>
  )
}

export default Fcu