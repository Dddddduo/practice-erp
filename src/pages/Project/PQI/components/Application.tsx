import React, { useState, useReducer, useEffect } from 'react';
import { Button, Divider, Input, Select, Space, Typography, Table, Drawer, } from 'antd';
import { SelectProps } from 'antd';
import { createOrUpdateFinanceReimAlone } from '@/services/ant-design-pro/project';



const type = [
    {
        value: '公',
        label: '公'
    },
    {
        value: '私',
        label: '私'
    },
]



interface DataType {

}

interface ItemListProps {
    current
    actionRef
    success
    error
    handleClose,
    currentMsg
}
const Application: React.FC<ItemListProps> = ({
    current,
    actionRef,
    success,
    error,
    handleClose,
    currentMsg
}) => {

    const [dataSource, setDataSource] = useState([
        {
            key: 1,
            amount: '',
            coll_channel: '',
            coll_name: '',
            bank_name: '',
            bank_no: '',
            trd_id:current.Project_final_account_id ?? '',
            reim_type:current.cost_type_name ?? '',
            file_ids:'',
        }
    ])

    const columns = [
        {
            title: '申请金额',
            dataIndex: 'amount',
            key: 'project',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <>
                        <Input style={{ width: 100 }} 
                            onChange={(e) => handleFieldChange(e.target.value, entity.key, 'amount')}
                        />
                    </>
                )
            }
        },
        {
            title: '收款类型',
            dataIndex: 'coll_channel',
            key: 'coll_channel',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <>
                        <Select style={{ width: 100 }} options={type} 
                            onChange={(value) => handleFieldChange(value, entity.key, 'coll_channel')}
                        />
                    </>
                )
            }
        },
        {
            title: '收款名称',
            dataIndex: 'coll_name',
            key: 'coll_name',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <>
                        <Input style={{ width: 100 }} 
                        onChange={(e) => handleFieldChange(e.target.value, entity.key, 'coll_name')}
                        />
                    </>
                )
            }
        },
        {
            title: '收款开户行',
            dataIndex: 'bank_name',
            key: 'bank_name',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <>
                        <Input style={{ width: 100 }} 
                             onChange={(e) => handleFieldChange(e.target.value, entity.key, 'bank_name')}
                        />
                    </>
                )
            }
        },
        {
            title: '收款账号',
            dataIndex: 'bank_no',
            key: 'bank_no',
            align: 'center',
            render: (dom, entity) => {
                return (
                    <>
                        <Input style={{ width: 100 }} 
                             onChange={(e) => handleFieldChange(e.target.value, entity.key, 'bank_no')}
                        />
                    </>
                )
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            key: 'operate',
            align: 'center',
            render: (dom, entity) => (
                <>
                    {
                        <Button onClick={add}>+</Button>
                    }

                    {
                        (dataSource.length > 1) &&
                        <Button onClick={() => subtract(entity)}>-</Button>
                    }
                </>

            )
        },
    ]

    const handleFieldChange = (value, key, field) => {
        const updatedDataSource = dataSource.map((item) => {
            if (item.key === key) {
                return { ...item, [field]: value };
            }
            return item;
        });
        setDataSource(updatedDataSource);
    };

    const handleFinish = () => {

        const params = {
            detail_list: dataSource,
            status: 'submit',
            type: 'pqi_cost',
            trd_id: currentMsg.id ?? '',
            trd_sub_id: current.Project_final_account_id ?? '',
            
        }
        console.log(params);
        
         createOrUpdateFinanceReimAlone(params).then((res) => {
            console.log(res)
            if (res.success) {
                handleClose()
                actionRef.current.reload()
                success('添加成功')
                return
                // console.log(actionRef)
            }
            error(res.message)
        })
    };

    const add = () => {
        const newDada = {
            key: dataSource[dataSource.length - 1].key + 1,
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

    // const handleFinsh = () => {
    //     console.log(current)
    //     const params = {
    //         detail_list:[{
    //             amount:current.amount ?? '',
    //         }],

    //         // bank_name:currentMsg.bank_name ?? '',
    //         // bank_no:values.bank_no ?? '',
    //         // coll_channel:values.coll_channel ?? '',
    //         // coll_name:values.coll_name ?? '',
    //         // file_ids:'',
    //         // // reim_type:currentMsg.cost_type_name ?? '',
    //         status:'submit',
    //         trd_id:current.project_id ?? '',
    //         trd_sub_id:current.Project_final_account_id ?? '',
    //         type:'pqi cost',
    //     }
    //     // createOrUpdateFinanceReimAlone(params).then((res) => {
    //     //     console.log(res)
    //     //     if (res.success) {
    //     //         handleClose()
    //     //         actionRef.current.reload()
    //     //         success('处理成功')
    //     //         return
    //     //         // console.log(actionRef)
    //     //     }
    //     //     error(res.message)
    //     // })
    //     console.log(params)
    // }

    return (
        <>
            <Table
                dataSource={dataSource} columns={columns}
                pagination={false}
            />
            <Button onClick={handleFinish}>提交</Button>
        </>
    )
}
export default Application