import React, { useState, useEffect } from 'react';
import { Button, Divider, Form, Input, Select, Space, Typography, Table, } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getProjectEquipmentList } from '@/services/ant-design-pro/project';
import { SelectProps } from 'antd';
import { getProjectInfo } from '@/services/ant-design-pro/project';

interface ItemListProps {
    handleClose: () => void
    actionRef
    success: (text: string) => void
    error: (text: string) => void
    setEquipment_list: (data: any) => void
    currentMsg
}

const CreateDevice: React.FC<ItemListProps> = ({
    setEquipment_list,
    handleClose,
    success,
    error,
    actionRef,
    currentMsg
}) => {

    const [form] = Form.useForm()

    const [pmentList, setPmentList] = useState([])

    const optionspmentList: SelectProps['options'] = pmentList.map((item) => {
        return {
            value: item.equipment_id,
            label: item.equipment_name,
        };
    });

    const [dataSource, setDataSource] = useState([
        {
            key: 1,
            equipment_id: '',
            detail: '',
        },
    ])

    const content = (e, entity, cur) => {
        if (cur === 'equipment_id') {
            const data = dataSource.map(item => {
                if (item.key === entity.key) {
                    item[cur] = e
                    return item
                }
                return item
            })
            console.log(data);
            setEquipment_list(data)
            // setEquipment_list(preState => {
            //     return [
            //         ...data
            //     ]
            // })
        }
        if (cur === 'detail') {
            console.log(e.target.value, entity);
            const data = dataSource.map(item => {
                if (item.key === entity.key) {
                    item[cur] = e.target.value
                    return item
                }
                return item
            })
            console.log(data);
            setEquipment_list(data)
            // setEquipment_list(preState => {
            //     return [
            //         ...data
            //     ]
            // })
        }
    }

    const columns = [
        {
            title: '设置类型',
            dataIndex: 'equipment_id',
            key: 'equipment_id',
            required: true,
            align: 'center',
            render: (dom, entity) => (
                <Select style={{ width: 200 }} value={dom} options={optionspmentList} onChange={(e) => content(e, entity, 'equipment_id')} />
            )
        },
        {
            title: '数量',
            dataIndex: 'detail',
            key: 'detail',
            align: 'center',
            render: (dom, entity) => (
                <Input style={{ width: 250 }} value={dom} onChange={(e) => { content(e, entity, 'detail') }} />
            )
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            render: (dom, entity) => (
                <>
                    {
                        !currentMsg &&
                        <>
                            <Button onClick={add}>+</Button>
                            {
                                (dataSource.length > 1) &&
                                <Button onClick={() => subtract(entity)}>-</Button>
                            }
                        </>
                    }

                </>

            )
        },
    ]
    const add = () => {
        const newDada = {
            key: dataSource[dataSource.length - 1].key + 1,
            equipment_id: '',
            detail: '',
        }
        setDataSource(preState => {
            return [
                ...preState,
                newDada
            ]
        })
    }
    const subtract = (entity) => {
        setDataSource(dataSource.filter(item => item.key !== entity.key))
    }

    useEffect(() => {
        getProjectEquipmentList().then((res) => {
            setPmentList(res.data)
        })
        if (!currentMsg) {
            return
        }

        getProjectInfo({
            project_id: currentMsg.id
        }).then((res) => {
            setDataSource(preState => {
                if (res.data.equipment_list.length > 0) {
                    res.data.equipment_list.map((item, index) => {
                        item.key = index + 1
                    })
                    return [
                        ...res.data.equipment_list
                    ]
                }
                return [
                    ...preState
                ]
            })
            setEquipment_list(res.data.equipment_list)
        })


    }, [])

    return (
        <>
            <Typography.Title level={4}>设备设置</Typography.Title>
            <Divider />
            <Table
                dataSource={dataSource} columns={columns}
                pagination={false}
            />
        </>

    )
}
export default CreateDevice