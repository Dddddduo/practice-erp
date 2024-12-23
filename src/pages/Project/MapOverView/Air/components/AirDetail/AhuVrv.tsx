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

const static_cool = '/air-condition/air-condition-water-static.png'
const move_cool = '/air-condition/air-condition-water-move.gif'
const hot = '/air-condition/fans.png'
const cool = '/air-condition/fans_cold.png'

interface ItemListProps {
    groupData: any
    airDetail: any
    ehData: any,
    floor: any,
}

const AhuVrv: React.FC<ItemListProps> = ({
    groupData,
    airDetail,
    ehData,
    floor,
}) => {
    // 详情
    const [formatDetail, setFormatDetail] = useState<any>({})
    // vrv data
    const [vrvData, setVrvData] = useState<any>({})
    // 风速
    const [currentSpeedList, setCurrentSpeedList] = useState<any>([])
    // 转速
    const [speed, setSpeed] = useState('')
    // 风扇
    const [fanImg, setFanImg] = useState('')
    // 二管还是四管
    const [isTwoWaterPipe, setIsTwoWaterPipe] = useState(true)
    // eh加热模式
    const [ehHotModeList, setEhHotModeList] = useState([])
    // eh加热档位
    const [ehHotLevelList, setEhHotLevelList] = useState([])
    // vrv 风速
    const [vrvSpeedList, setVrvSpeedList] = useState<any>([])
    // vrv转速
    const [vrvSpeed, setVrvSpeed] = useState('')
    // vrv风扇
    const [vrvFanImg, setVrvFanImg] = useState('')
    // 漫游引导ref list
    const tour1 = useRef(null);
    const tour2 = useRef(null);
    const tour3 = useRef(null);
    const tour4 = useRef(null);
    const tour5 = useRef(null);
    const tour6 = useRef(null);
    const tour7 = useRef(null);
    const tour8 = useRef(null);
    const tour9 = useRef(null);
    const tour10 = useRef(null);
    const tour11 = useRef(null);

    const [open, setOpen] = useState<boolean>(false);

    const [messageApi, contextHolder] = message.useMessage();

    const [showPasswordDialog, setShowPasswordDialog] = useState<boolean>(false);

    const [inputType, setInputType] = useState('');
    const [input, setInput] = useState('');

    const steps: TourProps['steps'] = [
        {
            title: 'AHU模式',
            description: '调整AHU的模式为制冷或制热',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour1.current,
        },
        {
            title: '工变频切换',
            description: '在关机情况下可以切换工频和变频',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour2.current,
        },
        {
            title: '大厦店铺',
            description: '可以切换成大厦或店铺模式',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour3.current,
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
            target: () => tour4.current,
        },
        {
            title: '开关机',
            description: '在手动模式下可以控制机器的开关',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour5.current,
        },
        {
            title: '高速模式',
            description: '设定高速模式下的频率.',
            target: () => tour6.current,
        },
        {
            title: 'AHU风速',
            description: '调整AHU风速的等级.',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour7.current,
        },
        {
            title: 'VRV风速',
            description: '调整VRV风速的等级.',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour8.current,
        },
        {
            title: '加热模式',
            description: '调整空调加热模式.',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour9.current,
        },
        {
            title: '电加热',
            description: '在冬天模式下可以调整电加热的等级',
            // cover: (
            //     <img
            //         alt="tour.png"
            //         src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png"
            //     />
            // ),
            target: () => tour10.current,
        },
        {
            title: '设定温度',
            description: '设定空调预期达到的温度.',
            target: () => tour11.current,
        },
    ];

    const [localDataList, setLocalDataList] = useState({
        "cooling_heating": {
            value: false,
            time: 0,
            id: 'cooling_heating'
        },
        "power_variable": {
            value: false,
            time: 0,
            id: 'power_variable'
        },
        "building_shop": {
            value: false,
            time: 0,
            id: 'building_shop'
        },
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
        "high_speed": {
            value: '',
            time: 0,
            id: 'high_speed'
        },
        "mid_speed": {
            value: '',
            time: 0,
            id: 'mid_speed'
        },
        "low_speed": {
            value: '',
            time: 0,
            id: 'low_speed'
        },
        "current_speed_ahu": {
            value: 0,
            time: 0,
            id: 'current_speed_ahu'
        },
        "current_speed_vrv": {
            value: 0,
            time: 0,
            id: 'current_speed_vrv'
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
        "temperature": {
            value: '',
            time: 0,
            id: 'temperature'
        }
    })

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

    const handleInput = (e: any) => {
        const { value: inputValue } = e.target;
        // 只保留输入值中的数字
        const filteredValue = inputValue.replace(/[^\d]/g, '');
        console.log('filteredValue', filteredValue);

        setInput(filteredValue)
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

        if (id == 'cooling_heating') {
            if (value) {
                params.value = 1
            } else {
                params.value = 0
            }
            changeOperation(params)
            codeSuccess()
            changeLocalData(id, value)
        }

        if (id == 'power_variable') {
            if (value) {
                params.value = 1
            } else {
                params.value = 0
            }
            changeOperation(params)
            codeSuccess()
            changeLocalData(id, value)
        }

        if (id == 'building_shop') {
            if (value) {
                params.value = 1
            } else {
                params.value = 0
            }
            changeOperation(params)
            codeSuccess()
            changeLocalData(id, value)
        }

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

        if (id == 'high_speed') {
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

        if (id == 'mid_speed') {
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

        if (id == 'low_speed') {
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

        if (id == 'current_speed_ahu') {
            params.value = value
            changeOperation(params)
            codeSuccess()
            changeLocalData(id, value)
        }

        if (id == 'current_speed_vrv') {
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

        if (id == 'cooling_heating') {
            localData.cooling_heating.value = value
            localData.cooling_heating.time = Date.now()
            setLocalDataList(localData)
        }

        if (id == 'power_variable') {
            localData.power_variable.value = value
            localData.power_variable.time = Date.now()
            setLocalDataList(localData)
        }

        if (id == 'building_shop') {
            localData.building_shop.value = value
            localData.building_shop.time = Date.now()
            setLocalDataList(localData)
        }

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

        if (id == 'high_speed') {
            localData.high_speed.value = value
            localData.high_speed.time = Date.now()
            setLocalDataList(localData)
            setInputType('')
        }

        if (id == 'mid_speed') {
            localData.mid_speed.value = value
            localData.mid_speed.time = Date.now()
            setLocalDataList(localData)
            setInputType('')
        }

        if (id == 'low_speed') {
            localData.low_speed.value = value
            localData.low_speed.time = Date.now()
            setLocalDataList(localData)
            setInputType('')
        }

        if (id == 'current_speed_ahu') {
            localData.current_speed_ahu.value = value
            localData.current_speed_ahu.time = Date.now()
            setLocalDataList(localData)
            setInputType('')
        }

        if (id == 'current_speed_vrv') {
            localData.current_speed_vrv.value = value
            localData.current_speed_vrv.time = Date.now()
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

    const getLocalData = (id: string): any => {
        let value: any = ''

        Object.keys(localDataList).forEach(key => {
            if (localDataList[key].id == id) {
                value = localDataList[key].value
            }
        })

        return value
    }

    const errMessage = (text: string) => {
        messageApi.open({
            type: 'error',
            content: `${text}`,
        });
    }

    const codeSuccess = () => {
        messageApi.open({
            type: 'success',
            content: '指令下发成功，请等待15秒查看结果...',
        });
    };

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


    useEffect(() => {
        let format: any = {}
        let vrvData: any = {}

        if (!isEmpty(groupData)) {
            Object.keys(groupData).forEach(key => {
                if (groupData[key].device_type == 'ahu') {
                    format = groupData[key]
                }

                if (groupData[key].device_type == 'vrv') {
                    vrvData = groupData[key]
                }

            })

            if (format.cooling_heating.format_val === '制暖') {
                setFanImg(hot)
            } else {
                setFanImg(cool)
            }

            if (format.water_valve_feedback != null) {
                setIsTwoWaterPipe(true)
            }
            if (format.water_hot_valve_feedback != null) {
                setIsTwoWaterPipe(false)
            }


            setFormatDetail(format)

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

            let localData = { ...localDataList }

            // Ahu模式
            if (localDataExpire(localData.cooling_heating.time)) {
                localData.cooling_heating.value = format.cooling_heating.value == 1
                setLocalDataList(localData)
            }

            // 工变频切换
            if (localDataExpire(localData.power_variable.time)) {
                localData.power_variable.value = format.power_variable.value == 1
                setLocalDataList(localData)
            }


            // 大厦店铺
            if (localDataExpire(localData.building_shop.time)) {
                localData.building_shop.value = format.building_shop.value == 1
                setLocalDataList(localData)
            }


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

            // 高速模式
            if (localDataExpire(localData.high_speed.time)) {
                localData.high_speed.value = format.high_speed.value
                setLocalDataList(localData)
            }

            // 中速模式
            if (localDataExpire(localData.mid_speed.time)) {
                localData.mid_speed.value = format.mid_speed.value
                setLocalDataList(localData)
            }

            // 低速模式
            if (localDataExpire(localData.low_speed.time)) {
                localData.low_speed.value = format.low_speed.value
                setLocalDataList(localData)
            }

            // 设定温度
            if (localDataExpire(localData.temperature.time)) {
                localData.temperature.value = format.temperature.value
                setLocalDataList(localData)
            }

            // ahu风速
            let current_speed: any = []
            for (const key in format.current_speed.val_map) {
                current_speed.push({
                    value: Number(key),
                    label: format.current_speed.val_map[key]
                })
            }

            if (localDataExpire(localData.current_speed_ahu.time)) {
                localData.current_speed_ahu.value = Number(format.current_speed.value)
                setLocalDataList(localData)
            }

            setCurrentSpeedList(current_speed)

            // vrv风速
            let vrv_current_speed: any = []

            for (const key in vrvData.current_speed.val_map) {
                vrv_current_speed.push({
                    value: Number(key),
                    label: vrvData.current_speed.val_map[key]
                })
            }

            if (localDataExpire(localData.current_speed_vrv.time)) {
                localData.current_speed_vrv.value = Number(vrvData.current_speed.value)
                setLocalDataList(localData)
            }

            setVrvSpeedList(vrv_current_speed)

            if (vrvData.control_mode.format_val === '制暖') {
                setVrvFanImg(hot)
            } else {
                setVrvFanImg(cool)
            }

            if (Number(vrvData.switch.value) === 1) {
                if (vrvData.current_speed.format_val === '高速') {
                    setVrvSpeed('0.5s')
                } else if (vrvData.current_speed.format_val === '低速') {
                    setVrvSpeed('1.5s')
                } else {
                    setVrvSpeed('1s')
                }
            } else {
                setVrvSpeed('0s')
            }

            setVrvData(vrvData)

            handleEhData()
        }
    }, [airDetail])

    return (
        <>
            {
                !isEmpty(formatDetail) &&
                <>
                    {contextHolder}
                    <div style={{ height: "90vh" }}>
                        <div style={{ display: 'flex' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', marginRight: '6px' }}>{formatDetail.name} & {vrvData.name}</div>
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
                                        <span style={{ marginRight: 15 }}>{formatDetail.cooling_heating.name}</span>
                                        <Switch
                                            checkedChildren={formatDetail.cooling_heating.val_map[1]}
                                            unCheckedChildren={formatDetail.cooling_heating.val_map[0]}
                                            disabled={!localDataExpire(localDataList.cooling_heating.time)}
                                            value={getLocalData('cooling_heating')}
                                            onChange={(checked: boolean) => setLocalData('cooling_heating', checked)}
                                        />
                                    </Card>
                                    <Card style={{ margin: 15 }} hoverable ref={tour2}>
                                        <span style={{ marginRight: 15 }}>{formatDetail.power_variable.name}</span>
                                        <Switch
                                            checkedChildren={formatDetail.power_variable.val_map[1]}
                                            unCheckedChildren={formatDetail.power_variable.val_map[0]}
                                            disabled={!localDataExpire(localDataList.power_variable.time) || formatDetail.switch.value == 1}
                                            value={getLocalData('power_variable')}
                                            onChange={(checked: boolean) => setLocalData('power_variable', checked)}
                                        />
                                    </Card>
                                    <Card style={{ margin: 15 }} hoverable ref={tour3}>
                                        <span style={{ marginRight: 15 }}>{formatDetail.building_shop.name}</span>
                                        <Switch
                                            checkedChildren={formatDetail.building_shop.val_map[1]}
                                            unCheckedChildren={formatDetail.building_shop.val_map[0]}
                                            disabled={!localDataExpire(localDataList.building_shop.time)}
                                            value={getLocalData('building_shop')}
                                            onChange={(checked: boolean) => setLocalData('building_shop', checked)}
                                        />
                                    </Card>
                                    <Card style={{ margin: 15 }} hoverable ref={tour4}>
                                        <span style={{ marginRight: 15 }}>{formatDetail.auto_hand.name}</span>
                                        <Switch
                                            checkedChildren={formatDetail.auto_hand.val_map[1]}
                                            unCheckedChildren={formatDetail.auto_hand.val_map[0]}
                                            disabled={!localDataExpire(localDataList.auto_hand.time)}
                                            value={getLocalData('auto_hand')}
                                            onChange={(checked: boolean) => setLocalData('auto_hand', checked)}
                                        />
                                    </Card>
                                    <Card style={{ margin: 15 }} hoverable ref={tour5}>
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
                                <div style={{ marginRight: '20px' }}>
                                    <Button
                                        size="large"
                                        type="primary"
                                        className="speed"
                                        ref={tour5}
                                    >
                                        高速模式
                                        <Input
                                            style={{ width: 80, height: 35, display: 'flex', }}
                                            readOnly
                                            value={getLocalData('high_speed')}
                                            suffix={<div onClick={() => {
                                                if (!localDataExpire(localDataList.high_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('high_speed'))
                                                setInputType('high_speed')
                                            }}>{formatDetail.high_speed.unit}</div>}
                                            onClick={() => {
                                                if (!localDataExpire(localDataList.high_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('high_speed'))
                                                setInputType('high_speed')
                                            }
                                            }
                                        />
                                    </Button>
                                    <Button
                                        size="large"
                                        type="primary"
                                        className="speed">
                                        中速模式
                                        <Input
                                            style={{ width: 80, height: 35, display: 'flex', }}
                                            readOnly
                                            value={getLocalData('mid_speed')}
                                            suffix={<div onClick={() => {
                                                if (!localDataExpire(localDataList.mid_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('mid_speed'))
                                                setInputType('mid_speed')
                                            }}>{formatDetail.mid_speed.unit}</div>}
                                            onClick={() => {
                                                if (!localDataExpire(localDataList.mid_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('mid_speed'))
                                                setInputType('mid_speed')
                                            }
                                            }
                                        />
                                    </Button>
                                    <Button
                                        size="large"
                                        type="primary"
                                        className="speed"
                                    >
                                        低速模式
                                        <Input
                                            style={{ width: 80, height: 35, display: 'flex', }}
                                            readOnly
                                            value={getLocalData('low_speed')}
                                            suffix={<div onClick={() => {
                                                if (!localDataExpire(localDataList.low_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('low_speed'))
                                                setInputType('low_speed')
                                            }}>{formatDetail.low_speed.unit}</div>}
                                            onClick={() => {
                                                if (!localDataExpire(localDataList.low_speed.time)) {
                                                    return
                                                }

                                                // 判断是否过期
                                                if (passwordExpire()) {
                                                    setShowPasswordDialog(true)
                                                    return;
                                                }
                                                setInput(getLocalData('low_speed'))
                                                setInputType('low_speed')
                                            }
                                            }
                                        />
                                    </Button>
                                </div>
                                <div style={{ marginRight: '20px' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="speed"
                                        ref={tour7}
                                    >
                                        AHU{formatDetail.current_speed.name}
                                        <Select
                                            style={{ width: 100, }}
                                            options={currentSpeedList}
                                            value={getLocalData('current_speed_ahu')}
                                            onChange={(value) => setLocalData('current_speed_ahu', value)}
                                            disabled={!localDataExpire(localDataList.current_speed_ahu.time)}
                                        />
                                    </Button>

                                    <Button
                                        type="primary"
                                        size="large"
                                        className="speed"
                                        ref={tour8}
                                    >
                                        VRV风速
                                        <Select
                                            style={{ width: 100, }}
                                            options={vrvSpeedList}
                                            value={getLocalData('current_speed_vrv')}
                                            onChange={(value) => setLocalData('current_speed_vrv', value, vrvData.name)}
                                            disabled={!localDataExpire(localDataList.current_speed_vrv.time)}
                                        />
                                    </Button>

                                    {
                                        !isEmpty(ehData) &&
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="speed"
                                            style={{ height: 60 }}
                                            ref={tour7}
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
                                    }
                                </div>
                                <div>
                                    {
                                        !isEmpty(ehData) &&
                                        <div>
                                            <Button
                                                type="primary"
                                                size="large"
                                                className="speed"
                                                style={{ height: 60 }}
                                                ref={tour10}
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
                                                        /> : <div>{handleLevelText(getLocalData('电热档启动'))}</div>}

                                            </Button>
                                        </div>
                                    }
                                    <Button
                                        type="primary"
                                        size="large"
                                        className="speed"
                                        style={{ marginBottom: 10 }}
                                    >
                                        风速给定
                                        <Input
                                            style={{ width: 80, color: 'white', display: 'flex' }}
                                            bordered={false}
                                            readOnly
                                            value={formatDetail.speed_giving.value}
                                            suffix={formatDetail.speed_giving.unit}
                                        />
                                    </Button>

                                    <Button
                                        type="primary"
                                        size="large"
                                        className="speed"
                                    >
                                        风速反馈
                                        <Input
                                            style={{ width: 80, color: 'white', display: 'flex' }}
                                            bordered={false}
                                            readOnly
                                            value={formatDetail.speed_feedback.value}
                                            suffix={formatDetail.speed_feedback.unit}
                                        />
                                    </Button>
                                </div>

                                <div style={{ marginLeft: '20px' }}>
                                    {
                                        !isEmpty(ehData) &&
                                        <div>
                                            <Button size="large" type="primary" style={{ height: 60 }}>
                                                {ehData['电热送风温度']['name']}
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                {ehData['电热送风温度']['format_val']}
                                            </Button>
                                        </div>
                                    }

                                    <div style={{ marginTop: '10px' }}>
                                        <Button size="large" type="primary" style={{ height: 60 }}>
                                            {formatDetail['CO2']['name']}
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            {formatDetail['CO2']['format_val']}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* 平面图 */}
                            <Card style={{ marginTop: '20px' }}>
                                <div
                                    className="bottomImage"
                                    style={{
                                        backgroundImage: 'url(/air-condition/air-machine-cold-back.png)',
                                        backgroundSize: '100% 100%',
                                        backgroundPositionY: "4vh"
                                    }}
                                >
                                    <img
                                        src={fanImg}
                                        className="fan"
                                        style={{ animationDuration: speed, left: '52vw', top: '32vh' }}
                                    />
                                    <img
                                        src={vrvFanImg}
                                        className="fan"
                                        style={{ animationDuration: vrvSpeed, left: '18vw', top: '32vh' }}
                                    />
                                    {
                                        isTwoWaterPipe && !isEmpty(formatDetail) &&
                                        <>
                                            <img
                                                src={
                                                    formatDetail.cooling_heating.value == 1 ? (
                                                        formatDetail.water_valve_feedback.value >= 5 ? move_cool : static_cool
                                                    ) : (
                                                        formatDetail.water_valve_feedback.value >= 5 ? move_cool : static_cool
                                                    )
                                                }

                                                style={{ position: 'absolute', top: "6vh", left: '15vw', width: 400, height: 300 }}
                                            />
                                            <Button size="small" type="primary" style={{ position: 'absolute', top: '38vh', left: '36vw' }}>
                                                给定: {formatDetail.water_valve_giving.format_val}
                                            </Button>
                                            <Button size="small" type="primary" style={{ position: 'absolute', top: '42vh', left: '36vw' }}>
                                                反馈: {formatDetail.water_valve_feedback.format_val}
                                            </Button>
                                        </>
                                    }

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '20vh', left: '5vw' }}>回风</Button>
                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '32vh', left: '5vw' }}>新风</Button>
                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '33vh', right: '8vw' }}>送风</Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', left: '3vw' }}>
                                        {formatDetail.wind_return_temperature.name}
                                        {formatDetail.wind_return_temperature.value}
                                        {formatDetail.wind_return_temperature.unit}
                                    </Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '16vh', left: '50vw' }}>
                                        {formatDetail.name}
                                    </Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '16vh', left: '16vw' }}>
                                        {vrvData.name}
                                    </Button>


                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '16vh', left: '26vw' }}>
                                        风阀
                                    </Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '40vh', left: '16vw' }}>
                                        {vrvData.switch.format_val}
                                    </Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '40vh', left: '24vw' }}>
                                        {vrvData['VRV风阀开状态'].value == 1 ? '开启' : '关闭'}
                                    </Button>

                                    <Button size="large" type="primary" style={{ position: 'absolute', top: '40vh', left: '52vw' }}>
                                        {formatDetail.switch.format_val}
                                    </Button>

                                    <Button
                                        size="large"
                                        type="primary"
                                        style={{
                                            position: 'absolute',
                                            left: '43vw',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                        ref={tour11}
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
                    </div >
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

export default AhuVrv