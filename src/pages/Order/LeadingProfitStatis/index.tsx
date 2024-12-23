import React, { useCallback, useState } from "react"
import { statsManager } from "@/services/ant-design-pro/leadingProfitStatis";
import { PageContainer } from '@ant-design/pro-components';
import ItemList from "./components/ItemList";
import { message } from "antd";
import type { ActionType } from '@ant-design/pro-components';
import { useRef } from "react";

const LeadingProfitStatis: React.FC = () => {

    // 是否显示品牌
    const [showBrand, setShowBrand] = useState(false)
    // 配置Message
    const [messageApi, contextHolder] = message.useMessage();
        // 表格的引入
    const actionRef = useRef<ActionType>();
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
        if (params['brand_en']) {
            setShowBrand(true)
        } else {
            setShowBrand(false)
        }
        const retData = {
            success: false,
            total: 0,
            data: []
        };
            
        const customParams = {
            page: current,
            page_size: pageSize,
            username: params['username'] ?? '',
            brand_id: params['brand_en'] ?? '',
            begin: params['create_at'] ? params['create_at'][0] : '',
            end: params['create_at'] ? params['create_at'][1] : '',
            select_data: params['create_at'] ?? '',
        };
        try {
            const response = await statsManager(customParams);
            if (!response.success) {
                return retData;
            }

            const data = response.data;
            data.map((item, index) => {
                item.key = Number(index) + 1
                return item
            })
            retData.success = true;
            retData.total = data.total;
            retData.data = data ?? [];
        } catch (error) {
            message.error('数据请求异常');
        }
        console.log(retData);

        return retData;
    }, []);

    return (
        <PageContainer>
            {contextHolder}
            <ItemList
                onListData={handleFetchListData}
                showBrand={showBrand}
            />
        </PageContainer>
    )
}

export default LeadingProfitStatis
