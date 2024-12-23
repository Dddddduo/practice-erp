import React, { useEffect, useState, useRef } from "react"
import { Card, Typography, Radio, Tabs } from "antd"
import { isEmpty } from "lodash"
import * as echarts from 'echarts';
import { getIaqHistory } from '@/services/ant-design-pro/project';

interface ItemListProps {
    acList: any,
}

const Electric: React.FC<ItemListProps> = ({
    acList
}) => {

    const chartRef: any = useRef(null);

    const [selectItem, setSelectItem] = useState<any>({})
    const [time, setTime] = useState(0)

    const [dbList, setDbList] = useState([])

    const [groupName, setGroupName] = useState('')

    const onTapItem = (item: string) => {
        setSelectItem(item)
        handleEchart(item, time, groupName)
    }

    const handleChangeTime = (e: any) => {
        // console.log('打印e', e.target.value);
        setTime(e.target.value)

        handleEchart(selectItem, e.target.value, groupName)

    }

    const handleTabChange = (e) => {
        // console.log('打印tab切换', e);

        const result = dbList.find(item => item.name == e);

        if (result !== null && result !== undefined) {

            const itemTem = Object.keys(result).map(key => {
                if (result[key] != null && typeof result[key] === 'object' && !Array.isArray(result[key]) && result[key]['value'] != null) {
                    return result[key]
                }
            }).filter(item => item !== undefined)



            if (!isEmpty(itemTem)) {
                setSelectItem(itemTem[0])
                handleEchart(itemTem[0], time, e)
                setGroupName(e)

                // console.log('获取切换后的第一个item', itemTem[0],);
            }
        }
    }


    const handleEchart = async (item: any, time: any, groupName: any) => {

        console.log('打印item <----------', item);



        const params = {
            tag: item.name,
            group: groupName,
            shop_id: 1193,
            day: time,
        }

        console.log('打印参数', params);

        const res = await getIaqHistory(params)

        // console.log('打印结果 <-------------', res);

        let xAxis = []
        let yAxis = []

        if (res.success && res.data != null && res.data != undefined) {
            xAxis = res.data.x
            yAxis = res.data.y
        }

        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);
            // 在这里初始化图表

            // 配置和初始化图表
            const options = {
                // title: { text: "单位：" + `${selectItem.unit}`, right: "0" },
                // legend: reimLineMoreToOne.legend,
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '10%',
                    containLabel: true
                },
                // toolbox: {
                //   feature: {
                //     saveAsImage: {}
                //   }
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                    },
                    formatter: function (params) {
                        return params[0].value + `${selectItem.unit}` + '<br />' + params[0].axisValue;
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis,
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '电表',
                        type: 'line',
                        stack: 'total',
                        label: {
                            show: false,
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: yAxis,
                        itemStyle: {
                            color: '#5470c6'
                        }
                    }
                ],
                dataZoom: [
                    {
                        type: "slider",
                        xAxisIndex: 0,
                        filterMode: "none",
                        handleIcon: "path://M30.9,53.2C16.8,53.2,5.3,41.7,5.3,27.6S16.8,2,30.9,2C45,2,56.4,13.5,56.4,27.6S45,53.2,30.9,53.2z M30.9,3.5M36.9,35.8h-1.3z M27.8,35.8 h-1.3H27L27.8,35.8L27.8,35.8z"
                    },
                ],
            };

            chart.setOption(options);
        }

    }

    useEffect(() => {
        if (!isEmpty(acList)) {

            // 筛选所有的DB
            const listTem = Object.keys(acList).map(key => {
                if (acList[key].device_type == 'db') {
                    return acList[key]
                }
            }).filter(item => item !== undefined)

            // console.log('打印所有筛选的db', listTem);

            setDbList(listTem)


            if (!isEmpty(listTem)) {

                const firstItem = listTem[0]

                const itemTem = Object.keys(firstItem).map(key => {
                    if (firstItem[key] != null && typeof firstItem[key] === 'object' && !Array.isArray(firstItem[key]) && firstItem[key]['value'] != null) {
                        return firstItem[key]
                    }
                }).filter(item => item !== undefined)

                // console.log('打印所有筛选的值', itemTem);

                if (!isEmpty(itemTem)) {
                    setSelectItem(itemTem[0])
                    handleEchart(itemTem[0], time, listTem[0].name)
                    setGroupName(listTem[0].name)
                }
            }
        }

        console.log('打印电能的实时刷新 <---------------');


    }, [acList])

    return (
        <>
            <div style={{ display: 'flex' }}>
                {/* 左边 */}
                <div style={{ width: '50%' }}>

                    {/* tab */}
                    <Tabs
                        onChange={handleTabChange}
                        items={dbList.map(item => {
                            return {
                                label: item.name,
                                key: item.name,
                                children:
                                    <div
                                        key={item.name}
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            height: 'auto',
                                            maxHeight: '80vh',
                                            overflow: 'auto'
                                        }}>
                                        {
                                            Object.keys(item).map(key => {
                                                if (item[key] != null && typeof item[key] === 'object' && !Array.isArray(item[key]) && item[key]['value'] != null) {
                                                    return <Card
                                                        key={key}
                                                        style={{
                                                            width: 180,
                                                            marginRight: 10,
                                                            marginBottom: 10,
                                                            boxShadow: selectItem.name == item[key].name ? '0px 10px 10px rgba(0, 0, 0, 0.1)' : 'none'
                                                        }}
                                                        onClick={() => onTapItem(item[key])}
                                                    >
                                                        <Typography.Title level={5}>{item[key].name}</Typography.Title>

                                                        <div style={{ display: 'flex' }}>
                                                            <Typography.Text>{item[key].value}</Typography.Text>
                                                            <Typography.Text>{item[key].unit}</Typography.Text>
                                                        </div>

                                                    </Card>
                                                }
                                            })
                                        }

                                    </div>,
                            };
                        })}
                    />
                </div>

                {/* 右边 */}
                <div style={{ width: '50%' }}>
                    <div style={{ width: 400, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <Radio.Group value={time} buttonStyle="solid" onChange={(e) => handleChangeTime(e)}>
                            <Radio.Button value={0}>今天</Radio.Button>
                            <Radio.Button value={7}>近7天</Radio.Button>
                            <Radio.Button value={30}>近30天</Radio.Button>
                            <Radio.Button value={90}>近3个月</Radio.Button>
                        </Radio.Group>
                    </div>
                    <div style={{ fontSize: '16px', textAlign: 'right' }}>单位: {selectItem.unit}</div>
                    <div ref={chartRef} style={{ width: '100%', height: 700 }}></div>
                </div>
            </div >
        </>
    )
}

export default Electric