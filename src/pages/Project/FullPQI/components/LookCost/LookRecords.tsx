import React from 'react';
import { Divider, Typography, Table } from 'antd';



interface ItemListProps {

}

const Records: React.FC<ItemListProps> = () => {

    const dataSource = [

    ]

    const columns = [
        {
            title: '金额',
            dataIndex: 'amount',
        },
        {
            title: '备注',
            dataIndex: 'remark',
        },
        {
            title: '备注',
            dataIndex: 'payment_date',
        },
        {
            title: '附件',
            dataIndex: 'attachment',
        },
    ]


    return (
        <>
            <Typography.Title level={4}>打款记录</Typography.Title>
            <Divider />
            <Table
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
        </>
    )
}
export default Records
