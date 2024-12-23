import React, { useRef, useReducer, useEffect } from 'react';
import { useCallback } from 'react';
import { Button, Drawer, message } from 'antd';
import type { ActionType, ParamsType } from '@ant-design/pro-components';
import ItemList from './components/ItemList';
import { PageContainer } from '@ant-design/pro-components';
import { customerCenterAlarmList } from '@/services/ant-design-pro/project';
import { isEmpty } from 'lodash';
import {
    getCityList,
} from '@/services/ant-design-pro/report';

export enum SearchType {
    LoadData = 'LOAD_DATA',
    DeleteData = 'DELETE_DATA'
}

// 初始状态
const initialSearchForm = {
    cities: [],
    shops: [],
    markets: []
};



function searchFormReducer(state, action) {
    const { field, data } = action.payload;
    if (isEmpty(field)) {
        return state;
    }

    switch (action.type) {
        case SearchType.LoadData:
            return { ...state, [field]: [...Array.from(data)] };
        case SearchType.DeleteData:
            return { ...state, [field]: [] };
        // case UPDATE_EMAIL:
        //   return { ...state, profile: { ...state.profile, email: action.payload } };
        // case UPDATE_ADDRESS:
        //   // payload 应该是一个对象，包含 street, city 和 zip
        //   return { ...state, profile: { ...state.profile, address: { ...state.profile.address, ...action.payload } } };
        default:
            return state;
    }
}

const WarningEvent: React.FC = () => {


    const [searchDataState, dispatchSearchData] = useReducer(searchFormReducer, initialSearchForm);

    const actionRef = useRef<ActionType>();

    // 配置Message
    const [messageApi, contextHolder] = message.useMessage();
    // 成功Message
    const success = (text: string) => {
        messageApi.open({
            type: 'success',
            content: text,
        });
    };

    // 失败Message
    const error = (text: string) => {
        messageApi.open({
            type: 'error',
            content: text,
        });
    };

    const handleFetchListData = useCallback(async ({ current, pageSize, ...params }) => {
        console.log('handleFetchListData:params:', params);
        const retData = {
            success: false,
            total: 0,
            data: []
        };

        const customParams = {
            page: current,
            page_size: pageSize,
            city_id: params['city'] ?? '',
            market_id: params['market'] ?? '',
            store_id: params['store'] ?? '',
            create_at: params['created_at'] ?? '',
            content: params['content'] ?? '',
            is_clear: params['is_clear'] ?? '',
        };

        try {
            const response = await customerCenterAlarmList(customParams);

            const data = response.data;
            data.data.map((item, index) => {
                item.key = Number(index) + 1
                return item
            })

            retData.success = true;
            retData.total = data.total;
            retData.data = data.data ?? [];

        } catch (error) {
            message.error('数据请求异常');
        }
        return retData;
    }, [])


    const fetchSearchInitData = async () => {

        const cityResponse = await getCityList();
        if (cityResponse.success) {
            dispatchSearchData({
                type: SearchType.LoadData,
                payload: {
                    field: 'cities',
                    data: cityResponse.data
                }
            });
        }
    }

    const handleSearchSelectedChild = (type: string, field: string, data: []) => {
        dispatchSearchData({
            type,
            payload: {
                field,
                data
            }
        });
    }
    // 加载选择项
    useEffect(() => {
        const fetchData = async () => {
            await fetchSearchInitData();
        };

        fetchData();
    }, []);




    return (
        <PageContainer>
            {contextHolder}
            <ItemList
                onListData={handleFetchListData}
                searchData={searchDataState}
                onSearchSelectedChild={handleSearchSelectedChild}
                actionRef={actionRef}
                success={success}
                error={error}
            />
        </PageContainer>
    )
}
export default WarningEvent