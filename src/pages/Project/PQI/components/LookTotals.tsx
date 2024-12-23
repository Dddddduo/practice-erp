import React, { useState, useReducer, useEffect } from 'react';
import { Button, Divider, Input, Select, Space, Typography, Table, Drawer, } from 'antd';
import { getProjectData } from '@/services/ant-design-pro/project';
import { isObject } from 'lodash';

interface ItemListProps {
    currentMsg: any
}

const LookTotals: React.FC<ItemListProps> = ({
    currentMsg,
}) => {

    const [data, setData] = useState<any>([])

    const columns = [
        {
            title: 'item',
            dataIndex: 'title',
            align: 'center',
        },
        {
            title: 'Ex.VAT',
            dataIndex: 'ex_vat',
            align: 'center',
        },
        {
            title: 'In.VAT',
            dataIndex: 'in_vat',
            align: 'center',
        },
        {
            title: 'RATE',
            dataIndex: 'profit_rate',
            align: 'center',
        },
    ]
    useEffect(() => {
        getProjectData({ project_id: currentMsg.id }).then((res) => {
            if (res.success) {
                let result: any = [];
                let format: any = {}
                Object.keys(res.data).map(item => {
                    Object.keys(res.data[item]).map(value => {
                        if (isObject(res.data[item][value])) {
                            format = {
                                title: value,
                                ex_vat: res.data[item][value].ex_vat,
                                in_vat: res.data[item][value].in_vat
                            }
                            if (value.indexOf('profit') !== -1) {
                                format = {
                                    ...format,
                                    profit_rate: res.data[item].profit_rate
                                }
                            }
                            result.push(format)
                        }
                    })
                })
                console.log(result)
                setData(result)
            }

        })
    }, [])
    return (
        <>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
            />
        </>
    )
}
export default LookTotals
