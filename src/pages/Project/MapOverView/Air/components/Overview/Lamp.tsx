import { Card, Switch, TimePicker, message } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { isEmpty } from "lodash"
import React, { useEffect, useState, useRef } from "react"
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { passwordExpire, localDataExpire } from '@/utils/utils'
import PasswordDialog from '../PasswordDialog'
import { changeOperation } from '@/services/ant-design-pro/air'

interface ItemListProps {
    acList: any
    tourOpen: boolean,
    handleCloseOpen: () => void,
    floor: any
}

const Lamp: React.FC<ItemListProps> = ({
    acList,
    tourOpen,
    handleCloseOpen,
    floor,
}) => {
    // 漫游引导ref list
    const tour1 = useRef(null);
    const tour2 = useRef(null);
    const tour3 = useRef(null);

    const [messageApi, contextHolder] = message.useMessage();

    const [lightList, setLightList] = useState<any[]>([])

    const [localList, setLocalList] = useState<any[]>([])

    const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

    var timeData: string = ''

    const timeFormat = 'HH:mm'

    const steps: TourProps['steps'] = [
        {
            title: '灯光开光',
            description: '在手动模式下可以控制灯光开关',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour1.current,
        },
        {
            title: '启停模式',
            description: <div>手动:由人工控制 <br /> 自动:由机器控制</div>,
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour2.current,
        },
        {
            title: '灯光开关灯时间',
            description: '设定灯光开关灯的时间.',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour3.current,
        }
    ];

    const getLocalData = (index: number, id: string) => {
        return localList[index][id].value
    }

    const setLocalData = (index: number, id: string, value: any, machine: string) => {
        // 判断是否过期
        if (passwordExpire()) {
            setShowPasswordDialog(true)
            return;
        }

        let params = {
            type: id,
            machine: machine,
            value: 0,
            floor: floor,
            store_id: 1193,
        }

        console.log('打印params✅✅', params);


        if (id == '照明启动') {
            if (value) {
                params.value = 1
            } else {
                params.value = 0
            }

            changeOperation(params)
            codeSuccess()
            changeLocalData(index, id, value)
        }

        if (id == 'auto_hand') {
            if (value) {
                params.value = 1
            } else {
                params.value = 0
            }

            changeOperation(params)
            codeSuccess()
            changeLocalData(index, id, value)
        }

        if (id == 'light-system-open-close-time') {

            console.log('打印数据时间 <-----------------', timeData);
            if (timeData != '') {
                params.value = timeData
            }

            changeOperation(params)
            codeSuccess()
            changeLocalData(index, id, timeData)
        }
    }


    const changeLocalData = (index: number, id: string, value: any,) => {
        let localListTem: any = [
            ...localList
        ]

        if (id == 'light-system-open-close-time') {
            let time: any = [dayjs(value[0], timeFormat), dayjs(value[1], timeFormat)]

            // console.log('打印数据', value, typeof value, Array.isArray(value));


            localListTem[index][id].value = time
            localListTem[index][id].time = Date.now()
            setLocalList(localListTem)
            return
        }

        localListTem[index][id].value = value
        localListTem[index][id].time = Date.now()
        setLocalList(localListTem)

        console.log('本地值修改成功🏅️',);

    }

    const codeSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '指令下发成功，请等待15秒查看结果...',
        });
    };

    const handleTimeChange = (time: Dayjs, timeString: string) => {
        console.log('打印时间数据', time, timeString);
        timeData = timeString
    };

    useEffect(() => {

        console.log('子组件被父组件持续更新');

        if (!isEmpty(acList)) {
            const lightList = Object.keys(acList).map(key => {
                if (acList[key].device_type == 'light') {
                    return acList[key]
                }
            }).filter(item => item !== undefined)

            let localListTem: any = [
                ...localList
            ]

            if (isEmpty(localListTem)) {
                console.log('为空，第一次赋值', localListTem);

                lightList.forEach(item => {

                    let time: any = []
                    const s_h = item['light_system_open_at_h'].value
                    const s_m = item['light_system_open_at_m'].value
                    const e_h = item['light_system_close_at_h'].value
                    const e_m = item['light_system_close_at_m'].value
                    time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]

                    let data = {
                        '照明启动': {
                            value: item['照明启动'].value == 1,
                            time: 0,
                            id: '照明启动'
                        },
                        'auto_hand': {
                            value: item['auto_hand'].value == 1,
                            time: 0,
                            id: 'auto_hand'
                        },
                        'light-system-open-close-time': {
                            value: time,
                            time: 0,
                            id: 'light-system-open-close-time'
                        },
                    }
                    localListTem.push(data)
                })


            } else {

                localListTem.forEach((item, index) => {

                    // console.log('当前下标', index);


                    Object.keys(item).forEach(key => {
                        if (key == '照明启动' && localDataExpire(item[key].time)) {
                            localListTem[index]['照明启动'].value = lightList[index]['照明启动'].value == 1
                        } else if (key == '照明启动' && !localDataExpire(item[key].time)) {
                        }

                        if (key == 'auto_hand' && localDataExpire(item[key].time)) {
                            localListTem[index]['auto_hand'].value = lightList[index]['auto_hand'].value == 1
                        } else if (key == 'auto_hand' && !localDataExpire(item[key].time)) {
                        }


                        if (key == 'light-system-open-close-time' && localDataExpire(item[key].time)) {

                            let time: any = []
                            const s_h = lightList[index]['light_system_open_at_h'].value
                            const s_m = lightList[index]['light_system_open_at_m'].value
                            const e_h = lightList[index]['light_system_close_at_h'].value
                            const e_m = lightList[index]['light_system_close_at_m'].value
                            time = [dayjs(`${s_h}:${s_m}`, timeFormat), dayjs(`${e_h}:${e_m}`, timeFormat)]

                            // console.log('时间被更新  ✅✅.......');


                            localListTem[index]['light-system-open-close-time'].value = time
                        }
                    })
                })
            }

            setLocalList(localListTem)
            setLightList(lightList)


        }
    }, [acList])

    return (
        <>
            {contextHolder}
            <div style={{ display: "flex", flexWrap: 'wrap', height: 'auto', maxHeight: '90vh', overflow: 'auto' }}>
                {
                    lightList.map((item, index) => {
                        if (index == 0) {
                            return <Card
                                key={item.name}
                                title={item.name}
                                style={{ width: '23%', margin: 10, backgroundColor: '#eee' }}
                                extra={
                                    <Switch
                                        checkedChildren={item['照明启动'].val_map[1]}
                                        unCheckedChildren={item['照明启动'].val_map[0]}
                                        disabled={!localDataExpire(localList[index]['照明启动'].time) || item['auto_hand'].value == 0}
                                        value={getLocalData(index, '照明启动')}
                                        onChange={(checked: boolean) => setLocalData(index, '照明启动', checked, item.name)}
                                        ref={tour1}
                                    />
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-around' }}>
                                    <div style={{ marginBottom: 20 }} ref={tour2}>
                                        <span style={{ marginRight: 20 }}>启停模式</span>
                                        <Switch
                                            checkedChildren={item['auto_hand'].val_map[1]}
                                            unCheckedChildren={item['auto_hand'].val_map[0]}
                                            disabled={!localDataExpire(localList[index]['auto_hand'].time)}
                                            value={getLocalData(index, 'auto_hand')}
                                            onChange={(checked: boolean) => setLocalData(index, 'auto_hand', checked, item.name)}
                                            ref={tour2}
                                        />
                                    </div>
                                    <div ref={tour3}>
                                        <span style={{ marginRight: 20 }}>开关时间</span>
                                        <TimePicker.RangePicker
                                            format="HH:mm"
                                            style={{ width: '70%' }}
                                            disabled={!localDataExpire(localList[index]['light-system-open-close-time'].time)}
                                            defaultValue={getLocalData(index, 'light-system-open-close-time')}
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
                                                    setLocalData(index, 'light-system-open-close-time', '', item.name)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        } else {
                            return <Card
                                key={item.name}
                                title={item.name}
                                style={{ width: '23%', margin: 10, backgroundColor: '#eee' }}
                                extra={
                                    <Switch
                                        checkedChildren={item['照明启动'].val_map[1]}
                                        unCheckedChildren={item['照明启动'].val_map[0]}
                                        disabled={!localDataExpire(localList[index]['照明启动'].time) || item['auto_hand'].value == 0}
                                        value={getLocalData(index, '照明启动')}
                                        onChange={(checked: boolean) => setLocalData(index, '照明启动', checked, item.name)}
                                    />
                                }
                            >
                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-around' }}>
                                    <div style={{ marginBottom: 20 }} ref={tour2}>
                                        <span style={{ marginRight: 20 }}>启停模式</span>
                                        <Switch
                                            checkedChildren={item['auto_hand'].val_map[1]}
                                            unCheckedChildren={item['auto_hand'].val_map[0]}
                                            disabled={!localDataExpire(localList[index]['auto_hand'].time)}
                                            value={getLocalData(index, 'auto_hand')}
                                            onChange={(checked: boolean) => setLocalData(index, 'auto_hand', checked, item.name)}
                                        />
                                    </div>
                                    <div>
                                        <span style={{ marginRight: 20 }}>开关时间</span>
                                        <TimePicker.RangePicker
                                            format="HH:mm"
                                            style={{ width: '70%' }}
                                            disabled={!localDataExpire(localList[index]['light-system-open-close-time'].time)}
                                            defaultValue={getLocalData(index, 'light-system-open-close-time')}
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
                                                    setLocalData(index, 'light-system-open-close-time', '', item.name)
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </Card>
                        }

                    })
                }
                {
                    isEmpty(lightList) && <div>暂无数据！</div>
                }
            </div>
            <Tour open={tourOpen} onClose={handleCloseOpen} steps={steps} />
            {
                showPasswordDialog && <PasswordDialog open={showPasswordDialog} successCallback={() => setShowPasswordDialog(false)} cancelCallback={() => setShowPasswordDialog(false)} />
            }
        </>
    )
}

export default Lamp