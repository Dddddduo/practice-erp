import React, { useState, useReducer, useEffect } from 'react';
import { Button, Divider, Input, Select, Space, Typography, Table, Drawer, Tag, } from 'antd';
import { getAllCostList, getFinanceReimInfoBatch } from '@/services/ant-design-pro/project';
import Application from './Application';
import { isEmpty } from 'lodash';
import Records from './LookRecords';


interface ItemListProps {
    actionRef,
    success: (text: string) => void,
    error: (text: string) => void
    currentMsg: {}
}

const LookCost: React.FC<ItemListProps> = ({
    actionRef,
    success,
    error,
    currentMsg,
}) => {

    // 操作
    const [showDetailDrawer, setShowDetailDrawer] = useState(false)
    const [sourceData, setSourceData] = useState()
    const [current, setCurren] = useState({})
    const [financeReim, setFinanceReim] = useState([])

    // 查看更多
    const [showRecords, setShowRecords] = useState(false)

    const columns = [
        {
            title: '项目',
            dataIndex: 'cost_type_name',
            render: (dom, entity) => (
                <div>
                    {dom}
                    {
                        entity.cost_detail &&
                        <>({entity.cost_detail})</>
                    }
                </div>
            )
        },
        {
            title: '供应商名称',
            dataIndex: 'supplier_name',
            align: 'center',
        },
        {
            title: '合同不含税的价格',
            dataIndex: 'price',
            align: 'center',
        },
        {
            title: '含税价格/应付金额',
            dataIndex: 'sub_total_price',
            align: 'center',
        },
        {
            title: '收款比例',
            dataIndex: '"payment_ratio',
            align: 'center',
        },
        {
            title: '发票税率',
            dataIndex: 'profit_rate',
            align: 'center',
        },
        {
            title: '已付总金额',
            dataIndex: 'total_payment_price',
            align: 'center',
        },
        {
            title: '申请总金额',
            dataIndex: 'total_apply_price',
            align: 'center',
        },
        {
            title: '付款申请记录',
            dataIndex: 'applicationRecords',
            align: 'center',
            render: (dom: any, entity) => {
                return (
                    <>
                        {
                            entity.applicationRecords.map(item => {
                                return (
                                    <div style={{ width: 400, fontSize: 13 }}>
                                        <span>【账号: {item.coll_name}】</span>
                                        <span>【开户行: {item.bank_name}】</span>
                                        <span>【银行卡号: {item.bank_no}】</span>
                                        <span>【金额: {item.amount}】</span>
                                        <Tag color='blue' style={{ cursor: 'pointer' }} onClick={() => { setShowRecords(true) }}>查看记录</Tag>
                                    </div>
                                )
                            })
                        }
                    </>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <div>
                        {
                            entity.cost_type_name !== 'Total Price' &&
                            <Button type='primary' onClick={() => {
                                setShowDetailDrawer(true)
                                setCurren(entity)
                            }}>申请</Button>
                        }

                    </div>
                )
            }
        },
    ]

    const handleClose = () => {
        setCurren({})
        setShowDetailDrawer(false)
    }

    const handleRecords = () => {
        setShowRecords(false)
    }

    useEffect(() => {
        console.log(currentMsg);
        if (isEmpty(currentMsg)) {
            return
        }
        getAllCostList({ project_id: currentMsg.id, }).then(res => {
            if (res.success) {
                getFinanceReimInfoBatch({ trd_id: currentMsg.id, trd_type: 'pqi_cost' }).then((result) => {
                    if (result.success) {
                        setFinanceReim(result.data)
                        // console.log(Object.keys(result.data.pqi_cost_list))
                        const data = res.data.map(item => {
                            item.applicationRecords = []
                            Object.keys(result.data.pqi_cost_list).map(key => {
                                let title = item.cost_type_name +
                                    (item.cost_detail ? `（${item.cost_detail}）` : '')
                                if (key === title) {
                                    item.applicationRecords = result.data.pqi_cost_list[key]
                                    // console.log(result.data.pqi_cost_list[key])
                                    return item
                                }
                                return item
                            })
                            return item
                        })
                        let formatData: any = []
                        console.log(data);
                        let total = {
                            cost_type_name: 'Total Price',
                            price: 0,
                            supplier_name: "",
                            sub_total_price: 0,
                            payment_ratio: 0,
                            profit_rate: 0,
                            total_payment_price: 0,
                            total_apply_price: 0,
                            applicationRecords: [],
                        }
                        data.map(item => {
                            total.price += parseFloat(item.price)
                            total.sub_total_price += parseFloat(item.sub_total_price)
                            total.payment_ratio += parseFloat(item.payment_ratio)
                            total.profit_rate += parseFloat(item.profit_rate)
                            total.total_payment_price += parseFloat(item.total_payment_price)
                            total.total_apply_price += parseFloat(item.total_apply_price)
                        })

                        data.push(total)
                        console.log(data);
                        setSourceData(data)
                    }
                })
            }
        })

    }, [])

    return (
        <>
            <Table
                dataSource={sourceData}
                columns={columns}
                pagination={false}
            />
            <Drawer
                width={1000}
                open={showDetailDrawer}
                onClose={handleClose}
                destroyOnClose={true}
            >
                <Application
                    handleClose={handleClose}
                    current={current}
                    actionRef={actionRef}
                    success={success}
                    error={error}
                    currentMsg={currentMsg}
                />
            </Drawer>

            <Drawer
                width={1000}
                open={showRecords}
                onClose={handleRecords}
                destroyOnClose={true}
            >
                <Records />
            </Drawer>
        </>
    )
}
export default LookCost
