import React, { useRef } from "react";
import { message } from "antd";
import { ActionType, PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { useCallback } from "react";
import { toryList } from "@/services/ant-design-pro/system";

const LnventoryList: React.FC = () =>{

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

    // 表格的引入 
    const actionRef = useRef<ActionType>();

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
            no:params['no'] ?? '',
            name:params['productName'] ?? '',
            brand:params['brand'] ?? '',
        };

        
        try{
            const response = await toryList(customParams);

            const data = response.data;
            data.data.map((item, index) => {
                item.key = Number(index) + 1
                return item
            })

            retData.success = true;
            retData.total = data.total;
            retData.data = data.data ?? [];

        }catch (error) {
            message.error('数据请求异常');
        }
        return retData;
    },[])
    



    return(
        <PageContainer>
            {contextHolder}
            <ItemList
                 onListData={handleFetchListData}
                 actionRef={actionRef}
                 success={success}
                error={error}
            />
        </PageContainer>
    )
}

export default LnventoryList