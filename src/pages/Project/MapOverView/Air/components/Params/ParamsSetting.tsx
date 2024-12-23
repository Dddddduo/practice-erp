import { Button, Card, Modal, Select, Switch, TimePicker, message } from "antd"
import React, { useEffect, useState, useRef } from "react"
import OperationLog from "./OperationLog"
import AlarmLog from "./AlarmLog"
import dayjs, { Dayjs } from "dayjs"
import { isEmpty } from "lodash"
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { passwordExpire, localDataExpire } from '@/utils/utils'
import PasswordDialog from '../PasswordDialog'
import { changeOperation } from '@/services/ant-design-pro/air'

interface ItemListProps {
  params: any,
  tourOpen: boolean,
  handleCloseOpen: () => void,
  floor: any
}

const ParamsSetting: React.FC<ItemListProps> = ({
  params,
  tourOpen,
  handleCloseOpen,
  floor,
}) => {
  const [operationLog, setOperationLog] = useState(false)
  const [alarmLog, setAlarmLog] = useState(false)
  const [windList, setWindList] = useState([])

  const [windSwitchList, setWindSwitchList] = useState([])

  const [overtimeList, setOvertimeList] = useState<any[]>([])

  const [locaWindSwitchList, setLocaWindSwitchList] = useState<any[]>([])

  const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();

  var timeData: string = ''

  const timeFormat = 'HH:mm'

  const [localDataList, setLocalDataList] = useState({
    "overtime": {
      value: 0,
      time: 0,
      id: 'overtime'
    },
    "ahu-system-open-close-time": {
      value: [],
      time: 0,
      id: 'ahu-system-open-close-time"'
    },
    "fcu-system-open-close-time": {
      value: [],
      time: 0,
      id: 'fcu-system-open-close-time'
    },
    "vrv-system-open-close-time": {
      value: [],
      time: 0,
      id: 'vrv-system-open-close-time'
    },
    "light-system-open-close-time": {
      value: [],
      time: 0,
      id: 'light-system-open-close-time'
    },
  })

  // 漫游引导ref list
  const tour1 = useRef(null);
  const tour2 = useRef(null);
  const tour3 = useRef(null);
  const tour4 = useRef(null);
  const tour5 = useRef(null);
  const tour6 = useRef(null);

  const steps: TourProps['steps'] = [
    {
      title: '新风阀控制',
      description: '控制新风阀开关',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour1.current,
    },
    {
      title: '加班时长',
      description: '设定加班时长',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour2.current,
    },
    {
      title: 'AHU开关机定时',
      description: '设定AHU开关机时间.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour3.current,
    },
    {
      title: 'VRV开关机定时',
      description: '设定VRV开关机时间.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour4.current,
    },
    {
      title: 'FCU开关机定时',
      description: '设定FCU开关机时间.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour5.current,
    },
    {
      title: '灯光开关机定时',
      description: '设定灯光开关机定时.',
      // cover: (
      //   <img
      //     alt="tour.png"
      //     src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
      //   />
      // ),
      target: () => tour6.current,
    },
  ];


  const setLocalWind = (index: number, value: any, id: any) => {
    // 判断是否过期
    if (passwordExpire()) {
      setShowPasswordDialog(true)
      return;
    }

    let params = {
      type: id,
      machine: '',
      value: 0,
      floor: floor,
      store_id: 1193,
    }

    console.log('打印params✅✅', params);

    if (value) {
      params.value = 1
    } else {
      params.value = 0
    }

    changeOperation(params)
    codeSuccess()

    let localListTem: any = [
      ...locaWindSwitchList
    ]


    localListTem[index].value = value
    localListTem[index].time = Date.now()
    setLocaWindSwitchList(localListTem)
  }


  const codeSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '指令下发成功，请等待15秒查看结果...',
    });
  };

  const getWindSwitchList = () => {
    const targetKey = '新风阀开-'

    let listTem: any = []

    Object.keys(params).forEach(key => {
      if (key.includes(targetKey)) {
        // console.log('打印搜索到的key <-----', key);

        let item = {
          isOpen: false
        }

        listTem.push(item)
      }
    })

    let originList = [...listTem]

    listTem.forEach((item: any, index: number) => {

      const order = index + 1

      const targetKey = `新风阀开状态-${order}`; // 1

      Object.keys(params).forEach(key => {
        if (targetKey == key) {

          const isOpen = params[key].value == 1

          originList[index].isOpen = isOpen
        }
      })
    })

    let localWindSwitchTme: any = [
      ...locaWindSwitchList
    ]

    if (isEmpty(localWindSwitchTme)) {
      originList.forEach(item => {
        localWindSwitchTme.push({
          value: item.isOpen,
          time: 0,
        })
      })
    } else {
      localWindSwitchTme.forEach((item, index) => {
        if (localDataExpire(item.time)) {
          localWindSwitchTme[index].value = item.isOpen
        }
      })
    }

    setLocaWindSwitchList(localWindSwitchTme)
    setWindSwitchList(originList)
  }

  const getLocalData = (id: string): any => {
    let value: any = ''

    Object.keys(localDataList).forEach(key => {
      if (key == id) {
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
      machine: '',
      value: 0,
      floor: floor,
      store_id: 1193,
    }

    console.log('在修改 cccc', id);


    if (id == 'overtime') {
      params.value = value
      changeOperation(params)
      codeSuccess()
      changeLocalData(id, value)
    }

    if (id == 'ahu-system-open-close-time') {
      if (timeData != '') {
        params.value = timeData
      }

      changeOperation(params)
      codeSuccess()
      changeLocalData(id, timeData)
    }

    if (id == 'vrv-system-open-close-time') {
      if (timeData != '') {
        params.value = timeData
      }

      changeOperation(params)
      codeSuccess()
      changeLocalData(id, timeData)
    }

    if (id == 'fcu-system-open-close-time') {
      if (timeData != '') {
        params.value = timeData
      }

      changeOperation(params)
      codeSuccess()
      changeLocalData(id, timeData)
    }

    if (id == 'light-system-open-close-time') {
      if (timeData != '') {
        params.value = timeData
      }

      changeOperation(params)
      codeSuccess()
      changeLocalData(id, timeData)
    }
  }

  const changeLocalData = (id: string, value: any) => {
    let localData = { ...localDataList }

    if (id == 'overtime') {
      localData.overtime.value = value
      localData.overtime.time = Date.now()
      setLocalDataList(localData)
    }

    if (id == 'ahu-system-open-close-time') {
      let time: any = [dayjs(value[0], timeFormat), dayjs(value[1], timeFormat)]
      localData['ahu-system-open-close-time'].value = time
      localData['ahu-system-open-close-time'].time = Date.now()
      setLocalDataList(localData)

      return
    }

    if (id == 'vrv-system-open-close-time') {
      let time: any = [dayjs(value[0], timeFormat), dayjs(value[1], timeFormat)]
      localData['vrv-system-open-close-time'].value = time
      localData['vrv-system-open-close-time'].time = Date.now()
      setLocalDataList(localData)

      return
    }

    if (id == 'fcu-system-open-close-time') {
      let time: any = [dayjs(value[0], timeFormat), dayjs(value[1], timeFormat)]
      localData['fcu-system-open-close-time'].value = time
      localData['fcu-system-open-close-time'].time = Date.now()
      setLocalDataList(localData)

      return
    }

    if (id == 'light-system-open-close-time') {
      let time: any = [dayjs(value[0], timeFormat), dayjs(value[1], timeFormat)]
      localData['light-system-open-close-time'].value = time
      localData['light-system-open-close-time'].time = Date.now()
      setLocalDataList(localData)

      return
    }


  }

  const handleTimeChange = (time: Dayjs, timeString: string) => {
    // console.log('打印时间数据', time, timeString);
    timeData = timeString
  };


  useEffect(() => {

    if (params) {

      let localData = { ...localDataList }

      getWindSwitchList()

      // 加班时间
      const listTem = Object.keys(params.overtime.val_map).map(key => {
        return {
          value: key,
          label: params.overtime.val_map[key]
        }
      })

      if (localDataExpire(localData.overtime.time)) {
        localData.overtime.value = params.overtime.value
        setLocalDataList(localData)
      }

      setOvertimeList(listTem)

      // 设置ahu时间
      if (params['ahu_system_open_at_m'] != null) {

        if (localDataExpire(localData['ahu-system-open-close-time'].time)) {

          let time: any = []
          const s_h = params['ahu_system_open_at_h'].value
          const s_m = params['ahu_system_open_at_m'].value
          const e_h = params['ahu_system_close_at_h'].value
          const e_m = params['ahu_system_close_at_m'].value
          time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]


          localData['ahu-system-open-close-time'].value = time
          setLocalDataList(localData)
        }

      } else {
        localData['ahu-system-open-close-time'].value = []
      }

      // 设置vrv时间
      if (params['vrv_system_open_at_m'] != null) {

        if (localDataExpire(localData['vrv-system-open-close-time'].time)) {

          let time: any = []
          const s_h = params['vrv_system_open_at_h'].value
          const s_m = params['vrv_system_open_at_m'].value
          const e_h = params['vrv_system_close_at_h'].value
          const e_m = params['vrv_system_close_at_m'].value
          time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]


          localData['vrv-system-open-close-time'].value = time
          setLocalDataList(localData)
        }

      } else {
        localData['vrv-system-open-close-time'].value = []
      }

      // 设置fcu时间
      if (params['fcu_system_open_at_m'] != null) {

        if (localDataExpire(localData['fcu-system-open-close-time'].time)) {

          let time: any = []
          const s_h = params['fcu_system_open_at_h'].value
          const s_m = params['fcu_system_open_at_m'].value
          const e_h = params['fcu_system_close_at_h'].value
          const e_m = params['fcu_system_close_at_m'].value
          time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]


          localData['fcu-system-open-close-time'].value = time
          setLocalDataList(localData)
        }

      } else {
        localData['fcu-system-open-close-time'].value = []
      }

      // 设置light时间
      if (params['light_system_open_at_m'] != null) {

        if (localDataExpire(localData['light-system-open-close-time'].time)) {

          let time: any = []
          const s_h = params['light_system_open_at_h'].value
          const s_m = params['light_system_open_at_m'].value
          const e_h = params['light_system_close_at_h'].value
          const e_m = params['light_system_close_at_m'].value
          time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]


          localData['light-system-open-close-time'].value = time
          setLocalDataList(localData)
        }

      } else {
        localData['light-system-open-close-time'].value = []
      }

    }

    let windData: any = []

    for (const key in params) {
      if (key.startsWith("wind")) {
        windData.push(params[key]);
      }
    }

    setWindList(windData)

  }, [params])

  return (
    <>
      {contextHolder}
      <Card title="风速/新风开关" bordered={false} hoverable style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '50%' }}>
            {
              windList.map((item, index) => {
                return (
                  <div key={index} style={{ height: 30 }}>{item.name}: {item.format_val}</div>
                )
              })
            }
          </div>

          <div>
            {
              windSwitchList.map((item, index) => {
                if (index == 0) {
                  return <div key={index} style={{ height: 30 }} ref={tour1}>
                    <Switch
                      checkedChildren="开启"
                      unCheckedChildren="关闭"
                      disabled={!localDataExpire(locaWindSwitchList[index].time)}
                      value={locaWindSwitchList[index].value}
                      onChange={(checked: boolean) => setLocalWind(index, checked, `新风开关${index + 1}`)}
                    />
                  </div>
                } else {
                  return <div key={index} style={{ height: 30 }} >
                    <Switch
                      checkedChildren="开启"
                      unCheckedChildren="关闭"
                      disabled={!localDataExpire(locaWindSwitchList[index].time)}
                      value={locaWindSwitchList[index].value}
                      onChange={(checked: boolean) => setLocalWind(index, checked, `新风开关${index + 1}`)}
                    />
                  </div>
                }
              })
            }
          </div>

        </div>
      </Card>

      <Card title="运行时间设置" bordered={false} hoverable style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: 'center', marginBottom: 20 }} ref={tour2}>
          <div style={{ width: '30%' }}>加班时长：</div>
          <Select
            style={{ width: '70%', }}
            options={overtimeList}
            value={getLocalData('overtime')}
            onChange={(value) => setLocalData('overtime', value)}
            disabled={!localDataExpire(localDataList.overtime.time)}
          />
        </div>
        {
          getLocalData('ahu-system-open-close-time') != null &&
          <div style={{ display: "flex", alignItems: 'center', marginBottom: 20 }} ref={tour3}>
            <div style={{ width: '30%' }}>AHU开关机定时：</div>
            {
              !isEmpty(getLocalData('ahu-system-open-close-time')) && <TimePicker.RangePicker
                format={'HH:mm'}
                style={{ width: '70%' }}
                disabled={!localDataExpire(localDataList['ahu-system-open-close-time'].time)}
                defaultValue={getLocalData('ahu-system-open-close-time')}
                onChange={handleTimeChange}
                onOpenChange={(open: boolean) => {
                  console.log('openopen', open);

                  if (open) {
                    // 先判断密码过期
                    if (passwordExpire()) {
                      setShowPasswordDialog(true)
                      return;
                    }
                  } else {
                    setLocalData('ahu-system-open-close-time', '')
                  }
                }}
              />
            }
          </div>
        }
        {
          getLocalData('vrv-system-open-close-time') != null &&
          <div style={{ display: "flex", alignItems: 'center', marginBottom: 20 }} ref={tour4}>
            <div style={{ width: '30%' }}>VRV开关机定时：</div>
            {
              !isEmpty(getLocalData('vrv-system-open-close-time')) && <TimePicker.RangePicker
                format={'HH:mm'}
                style={{ width: '70%' }}
                disabled={!localDataExpire(localDataList['vrv-system-open-close-time'].time)}
                defaultValue={getLocalData('vrv-system-open-close-time')}
                onChange={handleTimeChange}
                onOpenChange={(open: boolean) => {
                  console.log('openopen', open);

                  if (open) {
                    // 先判断密码过期
                    if (passwordExpire()) {
                      setShowPasswordDialog(true)
                      return;
                    }
                  } else {
                    setLocalData('vrv-system-open-close-time', '')
                  }
                }}
              />
            }
          </div>
        }
        {
          getLocalData('fcu-system-open-close-time') != null &&
          <div style={{ display: "flex", alignItems: 'center', marginBottom: 20 }} ref={tour5}>
            <div style={{ width: '30%' }}>FCU开关机定时：</div>
            {
              !isEmpty(getLocalData('fcu-system-open-close-time')) && <TimePicker.RangePicker
                format={'HH:mm'}
                style={{ width: '70%' }}
                disabled={!localDataExpire(localDataList['fcu-system-open-close-time'].time)}
                defaultValue={getLocalData('fcu-system-open-close-time')}
                onChange={handleTimeChange}
                onOpenChange={(open: boolean) => {
                  console.log('openopen', open);

                  if (open) {
                    // 先判断密码过期
                    if (passwordExpire()) {
                      setShowPasswordDialog(true)
                      return;
                    }
                  } else {
                    setLocalData('fcu-system-open-close-time', '')
                  }
                }}
              />
            }
          </div>
        }
        {
          getLocalData('light-system-open-close-time') != null &&
          <div style={{ display: "flex", alignItems: 'center', marginBottom: 20 }} ref={tour6}>
            <div style={{ width: '30%' }}>FCU开关机定时：</div>
            {
              !isEmpty(getLocalData('light-system-open-close-time')) && <TimePicker.RangePicker
                format={'HH:mm'}
                style={{ width: '70%' }}
                disabled={!localDataExpire(localDataList['light-system-open-close-time'].time)}
                defaultValue={getLocalData('light-system-open-close-time')}
                onChange={handleTimeChange}
                onOpenChange={(open: boolean) => {
                  console.log('openopen', open);

                  if (open) {
                    // 先判断密码过期
                    if (passwordExpire()) {
                      setShowPasswordDialog(true)
                      return;
                    }
                  } else {
                    setLocalData('light-system-open-close-time', '')
                  }
                }}
              />
            }
          </div>
        }
      </Card>

      <Card title="历史数据" bordered={false} hoverable style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <span style={{ marginRight: 10 }}>操作记录</span>
            <Button type="primary" onClick={() => setOperationLog(true)}>查看</Button>
          </div>
          <div>
            <span style={{ marginRight: 10 }}>报警记录</span>
            <Button type="primary" onClick={() => setAlarmLog(true)}>查看</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={operationLog}
        width="70vw"
        destroyOnClose={true}
        onCancel={() => setOperationLog(false)}
        footer={null}
        style={{ top: 40 }}
        title="操作日志"
      >
        <OperationLog />
      </Modal>

      <Modal
        open={alarmLog}
        width="70vw"
        destroyOnClose={true}
        onCancel={() => setAlarmLog(false)}
        footer={null}
        style={{ top: 40 }}
        title="报警记录"
      >
        <AlarmLog />
      </Modal>
      <Tour open={tourOpen} onClose={handleCloseOpen} steps={steps} />
      {
        showPasswordDialog && <PasswordDialog open={showPasswordDialog} successCallback={() => setShowPasswordDialog(false)} cancelCallback={() => setShowPasswordDialog(false)} />
      }
    </>
  )
}

export default ParamsSetting