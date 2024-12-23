import React, { useState, useEffect } from "react";
import { ProTable, ProColumns, ParamsType } from "@ant-design/pro-components"
import { useIntl, FormattedMessage } from "@umijs/max"
import { getWorkItemUserList, getWorkItemList } from "@/services/ant-design-pro/system";
import type { Dayjs } from 'dayjs';
import type { BadgeProps, CalendarProps, Input } from 'antd';
import { Badge, Calendar, Select } from 'antd';
import dayjs from "dayjs";

type HandleListDataParams = {
    current: number;
    pageSize: number;
    [key: string]: any;
};



type HandleListDataReturnType = {
    success: boolean;
    total: number;
    data: any[]; // 可以根据需要进一步指定数组的类型
};


type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;
interface ItemListProps {
    actionRef: any,
    success: (text: string) => void
    error: (text: string) => void

}

const ItemList: React.FC<ItemListProps> = ({
    actionRef,
    success,
    error
}) => {

    const intl = useIntl()
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [userId, setUserId] = useState('')
    const [workItem, setWorkItem] = useState()
    const [data, setData] = useState()

    const handleChangeTime = (e) => {
        console.log(e.$M + 1);
        let end = e.$y + '-' + (e.$M + 1 + 1) + '-' + '01'
        setEndTime(end)
        if (e.$M + 1 === 12) {
            end = e.$y + 1 + '-' + '01' + '-' + '01'
            setEndTime(end)
        }
        const start = dayjs(e.$d).format('YYYY-MM')
        setStartTime(start)
        const params = {
            supplier_uid: userId ?? '',
            work_start_at: start ?? '',
            work_end_at: end ?? ''
        }
        console.log(params);

        getWorkItemList(params).then(res => {
            if (res.success) {
                setData(res.data)
            }
        })
    }

    const handleChangeUser = (e) => {
        setUserId(e)
        const params = {
            supplier_uid: e ?? '',
            work_start_at: startTime ?? '',
            work_end_at: endTime ?? ''
        }
        getWorkItemList(params).then(res => {
            if (res.success) {
                setData(res.data)
            }
        })
    }

    const dateCellRender = (value: Dayjs) => {
        const listData = data;

        console.log(listData);

        return (
            <></>
        );
    };

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        // if (info.type === 'month') return monthCellRender(current);
        return info.originNode;
    };

    useEffect(() => {
        const time = new Date
        let end = time.getFullYear() + '-' + (time.getMonth() + 1 + 1) + '-' + '01'
        if (time.getMonth() + 1 === 12) {
            end = (time.getFullYear() + 1) + '-' + '01' + '-' + '01'
            setEndTime(end)
        }
        const start = time.getFullYear() + '-' + time.getMonth() + 1

        setStartTime(start)
        setEndTime(end)

        const params = {
            supplier_uid: userId,
            work_start_at: start ?? '',
            work_end_at: end ?? ''
        }
        getWorkItemList(params).then(res => {
            if (res.success) {
                setData(res.data)
            }
        })

        getWorkItemUserList().then(res => {
            setWorkItem(res.data.map(item => {
                return {
                    value: item.creator_uid,
                    label: item.name_cn,
                }
            }))
        })

    }, [])

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <div style={{ marginBottom: 20 }}>
                <span>选择负责人</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <Select
                    showSearch
                    filterOption={filterOption}
                    style={{ width: 200 }}
                    options={workItem}
                    allowClear
                    onChange={handleChangeUser}
                />
            </div>
            <Calendar
                onPanelChange={handleChangeTime}
                cellRender={cellRender}
            />
        </>


    )
}
export default ItemList
