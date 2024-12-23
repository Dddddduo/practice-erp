import React, { useEffect, useState, useRef } from "react"
import { Card, Typography, Radio } from "antd"
import { isEmpty } from "lodash"
import * as echarts from 'echarts';
import { getIaqHistory } from '@/services/ant-design-pro/project';

interface ItemListProps {
    detail: any,
}

const IaqBox: React.FC<ItemListProps> = ({
    detail,
}) => {

    const chartRef: any = useRef(null);

    const [selectItem, setSelectItem] = useState<any>({})
    const [time, setTime] = useState(0)
    const [others, setOthers] = useState([])

    const onTapItem = (item: string) => {
        setSelectItem(item)
        handleEchart(item, time)

        Object.keys(detail).forEach(key => {
            if (detail[key] != null && typeof detail[key] === 'object' && !Array.isArray(detail[key]) && detail[key]['value'] != null) {

                if (item.name == detail[key].name) {
                    console.log('打印搜索到的other', detail[key].others);
                    setOthers(detail[key].others)
                }
            }
        })
    }

    const handleChangeTime = (e: any) => {
        console.log('打印e', e.target.value);
        setTime(e.target.value)

        handleEchart(selectItem, e.target.value)

    }

    const renderColor = (item: any): string => {
        let color = ''

        if (isEmpty(item)) {
            return color
        }

        if (!isEmpty(item.others) && item.value != null) {

            if (item.value > item.others[0]['value_range'][0] && item.value < item.others[0]['value_range'][1]) {
                color = 'green'
            } else if (item.value > item.others[1]['value_range'][0] && item.value < item.others[1]['value_range'][1]) {
                color = 'orange'
            } else if (item.value >= item.others[2]['value_range'][0]) {
                color = 'red'
            }
        }


        return color
    }

    const handleEchart = async (item: any, time: any) => {

        const params = {
            tag: item.name,
            group: detail.name,
            shop_id: 1193,
            day: time,
        }

        console.log('打印参数', params);

        const res = await getIaqHistory(params)

        console.log('打印结果 <-------------', res);

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
        if (!isEmpty(detail)) {
            const firstKey = Object.keys(detail)[0];
            setSelectItem(detail[firstKey])
            setOthers(detail[firstKey].others)

            handleEchart(detail[firstKey], time)
        }

    }, [])

    return (
        <>
            <div style={{ display: 'flex' }}>
                {/* 左边 */}
                <div style={{ width: '50%' }}>

                    <div style={{ fontSize: '20px', marginBottom: '20px' }}>{detail.name}</div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {
                            Object.keys(detail).map(key => {
                                if (detail[key] != null && typeof detail[key] === 'object' && !Array.isArray(detail[key]) && detail[key]['value'] != null) {
                                    return <div key={detail[key].name}>
                                        <Card
                                            style={{
                                                width: 180,
                                                marginRight: 10,
                                                marginBottom: 10,
                                                backgroundColor: renderColor(detail[key]),
                                                boxShadow: selectItem.name == detail[key].name ? '0px 10px 10px rgba(0, 0, 0, 0.1)' : 'none'
                                            }}
                                            onClick={() => onTapItem(detail[key])}
                                        >
                                            <Typography.Title level={5} style={{ color: !isEmpty(detail[key].others) && detail[key].value != null ? 'white' : 'black' }}>{detail[key].name}</Typography.Title>

                                            <div style={{ display: 'flex' }}>
                                                <Typography.Text style={{ color: !isEmpty(detail[key].others) && detail[key].value != null ? 'white' : 'black' }}>{detail[key].value}</Typography.Text>
                                                <Typography.Text style={{ color: !isEmpty(detail[key].others) && detail[key].value != null ? 'white' : 'black' }}>{detail[key].unit}</Typography.Text>
                                            </div>

                                        </Card>
                                    </div>
                                }

                            })
                        }
                    </div>

                    {/* 解释 */}
                    <div>
                        <div style={{ fontSize: '20px' }}>数值说明</div>
                        {
                            !isEmpty(others) &&
                            <div style={{ fontSize: '16px' }}>
                                <div style={{ color: 'green' }}>优:{others[0]['value_range'][0]}~{others[0]['value_range'][1]}{selectItem.unit}</div>
                                <div style={{ color: 'orange' }}>良:{others[1]['value_range'][0]}~{others[1]['value_range'][1]}{selectItem.unit}</div>
                                <div style={{ color: 'red' }}>差:{others[2]['value_range'][0]}{selectItem.unit}</div>
                            </div>

                        }
                    </div>

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

export default IaqBox