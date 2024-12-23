import React from "react"
import { message } from "antd";
import { useRef } from "react";
import type { ActionType } from '@ant-design/pro-components';
import { PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { useCallback } from "react";
import { statsWorker } from "@/services/ant-design-pro/workerProfitStatis";


const WorkerProfitStatis: React.FC = () => {
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


    const handleFetchListData = useCallback(async ({ current, pageSize, ...params }) =>{
        console.log('handleFetchListData:params:', params);
        
        const retData = {
            success: false,
            total: 0,
            data: []
        };

        const customParams ={
            
            page: current,
            page_size: pageSize,
            name: params['name'] ?? '',
            brand_id: params['brand_en'] ?? '',
            begin: params['create_at'] ? params['create_at'][0] : '',
            end: params['create_at'] ? params['create_at'][1] : '',
            select_data: params['create_at'] ?? '',
        };

        try{
            const response = await statsWorker(customParams);
            console.log(statsWorker)
            const data = response.data;
            data.map((item, index) => {
                item.key = Number(index) + 1
                return item
            })

            retData.success = true;
            retData.total = data.total;
            retData.data = data ?? [];

        }catch (error) {
            message.error('数据请求异常');
        }
        return retData;
       

    },[])




    return (
        <PageContainer>
            {contextHolder}
            <ItemList
                onListData={handleFetchListData}
            />
        </PageContainer>
    )

}





export default WorkerProfitStatis