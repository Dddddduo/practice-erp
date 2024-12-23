import React, { useState, useEffect } from 'react';
import {Button, Divider, Form, Input, message, Select, Space, Typography} from 'antd';
import { SelectProps } from 'antd';
import { DatePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getProjectInfo } from '@/services/ant-design-pro/project';
import { produce, original } from 'immer';
import {getNumber} from "@/services/ant-design-pro/pqi"


const { Option } = Select;

interface ItemListProps {
    handleClose: () => void
    actionRef
    success: (text: string) => void
    error: (text: string) => void
    brandList
    typeList
    statusList
    onSetProject: ({ }: object) => void
    project: {
        time_ranges: {
            date: string[]
        }[]
    }
    setVat: any
    currentMsg
}


const ProjectContent: React.FC<ItemListProps> = ({
    handleClose,
    actionRef,
    success,
    error,
    brandList,
    typeList,
    statusList,
    onSetProject,
    project,
    setVat,
    currentMsg
}) => {
    const [form] = Form.useForm()

    // let dayCounst = 0
    const { RangePicker } = DatePicker;

    const [day, setDay] = useState(0)
    const [dayCounst, setDayCounst] = useState(0)

    const [calculation, setCalculation] = useState(0.0)
    const [timeRanges, setTimeRanges] = useState<any>([])
    // const [initialValues, setInitialValues] = useState({
    //     time: [{}],
    //     area: ''
    // })

    const optionsBrand: SelectProps['options'] = brandList?.map((item) => {
        return {
            value: item.id,
            label: item.brand_en,
        };
    });
    const optionsTypeList: SelectProps['options'] = typeList?.map((item) => {
        return {
            value: item.project_type_id,
            label: item.project_type,
        }
    })
    const optionsStatusList: SelectProps['options'] = statusList?.map((item) => {
        return {
            value: item.project_status_id,
            label: item.project_status,
        }
    })
    // const optionsType:SelectProps['options'] = type.map((item) =>{
    //     return {
    //         value:item.value,
    //         label:item.label
    //     }
    // })

    const content = (e, current, type, index) => {
        // project_no
        // brand_id
        // project_name
        // project_type_id
        // project_status_id
        // time_ranges
        // weekDay
        // area
        // floor
        // console.log(e, current, type);
        if (type === 'input') {
            if (current === 'project_no') {
                const format = {
                    project_no: e.target.value
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         project_no: e.target.value
                //     }
                // })
            }
            if (current === 'project_name') {
                const format = {
                    project_name: e.target.value
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         project_name: e.target.value
                //     }
                // })
            }
            if (current === 'area') {
                // setInitialValues(preState => {
                //     return {
                //         ...preState,
                //         area: e.target.value
                //     }
                // })
                setCalculation(e.target.value)
                const format = {
                    area: e.target.value
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         area: e.target.value
                //     }
                // })
            }
            if (current === 'floor') {
                const format = {
                    floor: e.target.value
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         floor: e.target.value
                //     }
                // })
            }
        }
        if (type === 'select') {
            if (current === 'brand_en') {
                const fotmat = {
                    brand_id: e
                }
                onSetProject(fotmat)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         brand_id: e
                //     }
                // })
            }
            if (current === 'type') {
                setVat(typeList[typeList.findIndex(item => item.project_type_id === e)].tax_rate * 0.01)
                const format = {
                    project_type_id: e
                }
                const params = {
                  type: e
                }

                getNumber(params).then(r => {
                  if (r.success) {
                    form.setFieldsValue({project_no: r.data.number})
                    return
                  }
                })
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         project_type_id: e
                //     }
                // })
            }
            if (current === 'status') {
                const format = {
                    project_status_id: e
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         project_status_id: e
                //     }
                // })
            }
            if (current === 'area_unit') {
                const format = {
                    area_unit: e
                }
                onSetProject(format)
                // onSetProject(preState => {
                //     return {
                //         ...preState,
                //         area_unit: e
                //     }
                // })
            }
        }
        if (type === 'time') {
            if (e) {
                const timeRange = [dayjs(e[0].$d).format('YYYY-MM-DD'), dayjs(e[1].$d).format('YYYY-MM-DD')]
                let formatTime = timeRanges
                if (formatTime.length === 0) {
                    formatTime.push({ date: timeRange })
                } else {
                    formatTime[index] = { date: timeRange }
                }
                console.log(formatTime);
                setTimeRanges(formatTime)
                calculateDay(formatTime)
            } else {
                // const format = project.time_ranges.filter((item, idx) => idx !== index)
                let formatTime = []
                for (const key in project.time_ranges) {
                    if (Number(index) !== Number(key)) {
                        formatTime.push(project.time_ranges[key])
                    } else {
                        formatTime.push({
                            date: ['', '']
                        })
                    }
                }
                console.log(formatTime);
                setTimeRanges(formatTime)
                calculateDay(formatTime)
            }
        }
    }

    const calculateDay = (timeRanges) => {
        console.log(timeRanges);
        let day = 0
        timeRanges.map(item => {
            if (item.date[1] && item.date[0]) {
                const diffDay = (dayjs(item.date[1]).diff(item.date[0], 'day') + 1)
                day += diffDay
            }
        })
        form.setFieldsValue({ weekDay: day })
        const data = {
            time_ranges: timeRanges,
            weekDay: day
        }
        onSetProject(data)
    }

    const removeTime = (idx) => {
        const format = project.time_ranges.filter((item, index) => index !== idx)
        console.log(format);
        setTimeRanges(format)
        calculateDay(format)
    }

    const unit = (e) => {
        if (e === 'sq.ft') {
            setCalculation(preState => {
                const format = (Number(preState) * 10.7639).toFixed(2)
                form.setFieldsValue({ area: format });
                onSetProject({
                    area: format,
                    unit: '2',
                    area_unit: e
                })
                return format
            })
        } else {
            setCalculation(preState => {
                const format = (Number(preState) / 10.7639).toFixed(2)
                form.setFieldsValue({ area: format });
                onSetProject({
                    area: format,
                    unit: '1',
                    area_unit: e
                })
                return format
            })
        }
    }

    useEffect(() => {
        if (!currentMsg) {
            return
        }
        getProjectInfo({
            project_id: currentMsg.id
        }).then((res) => {
            if (res.success) {
                form.setFieldsValue({
                    project_no: res.data.project_no ?? '',
                    brand_en: res.data.brand_id ?? '',
                    project_name: res.data.project_name ?? '',
                    type: res.data.project_type_id ?? '',
                    status: res.data.project_status_id ? res.data.project_status_id : '',
                    time: res.data.time_ranges.map(item => ({
                        key: item.date.join('-'),
                        time: [dayjs(item.date[0]), dayjs(item.date[1])]
                    })) ?? [],
                    weekDay: res.data.weekDay ?? '',
                    area: res.data.area ?? '',
                    unit: res.data.unit ?? '',
                    floor: res.data.floor ?? '',
                })
                setCalculation(res.data.area)
                calculateDay(res.data.time_ranges)
                onSetProject({
                    project_no: res.data.project_no ?? '',
                    brand_id: res.data.brand_id ?? '',
                    project_name: res.data.project_name ?? '',
                    project_type_id: res.data.project_type_id ?? '',
                    project_status_id: res.data.project_status_id ? res.data.project_status_id : '',
                    time_ranges: res.data.time_ranges ?? [],
                    weekDay: res.data.weekDay ?? '',
                    area: res.data.area ?? '',
                    area_unit: res.data.area_unit ?? '',
                    floor: res.data.floor ?? '',
                    unit: res.data.unit ?? '',
                })
            }
        })
    }, [])
    return (
        <>
            <Typography.Title level={4}>项目内容</Typography.Title>
            <Divider />
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                style={{ maxWidth: 600 }}
                form={form}
                initialValues={{
                    time: [{}]
                }}
            >
                <Form.Item label="项目编号" name="project_no">
                    <Input disabled></Input>
                </Form.Item>
                <Form.Item label="品牌" name="brand_en">
                    <Select placeholder="请选择" options={optionsBrand} onChange={(e) => content(e, 'brand_en', 'select', '')} />
                </Form.Item>
                <Form.Item label="项目名称" name="project_name">
                    <Input onChange={(e) => content(e, 'project_name', 'input', '')}></Input>
                </Form.Item>
                <Form.Item label="类型" name="type">
                    <Select placeholder="请选择" options={optionsTypeList} onChange={(e) => content(e, 'type', 'select', '')} />
                </Form.Item>
                <Form.Item label="工程状态" name="status">
                    <Select placeholder="请选择" options={optionsStatusList} onChange={(e) => content(e, 'status', 'select', '')} />
                </Form.Item>
                <Form.Item label="开工/完工日期" name="time"  >
                    <Form.List name="time">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => {
                                    // console.log(fields);
                                    return (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline" >
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'time']}
                                                rules={[{ required: true, message: 'Missing key' }]}
                                            >
                                                <RangePicker onChange={(e) => content(e, 'time', 'time', name)} />
                                            </Form.Item>
                                            <PlusOutlined onClick={() => add()} />
                                            {
                                                name !== 0 &&
                                                <MinusCircleOutlined onClick={() => {
                                                    remove(name)
                                                    removeTime(name)
                                                }} />
                                            }
                                        </Space>
                                    )
                                })}
                            </>
                        )}
                    </Form.List>
                </Form.Item>

                <Form.Item label="工程周期(day):" name="weekDay">
                    <Input disabled onChange={(e) => content(e, 'weekDay', 'input', '')} />
                </Form.Item>
                <Form.Item label="面积" name="area">
                    <Input onChange={(e) => content(e, 'area', 'input', '')} addonAfter={
                        <Select defaultValue="spm" onChange={(e) => unit(e)}>
                            <Option value="spm">spm</Option>
                            <Option value="sq.ft">sq.ft</Option>
                        </Select>
                    } />

                    {/* <Form.Item name="area_unit">
                        <Select options={tyPe} defaultValue onChange={(e) => content(e, 'area_unit', 'select')} />
                    </Form.Item> */}

                </Form.Item>
                <Form.Item label="楼层" name="floor">
                    <Input onChange={(e) => content(e, 'floor', 'input', '')} />
                </Form.Item>
            </Form>
        </>
    )
}
export default ProjectContent
