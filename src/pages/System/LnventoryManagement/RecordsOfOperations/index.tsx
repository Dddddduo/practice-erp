import React, {useCallback, useRef} from "react";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { record } from "@/services/ant-design-pro/system";

const RecordsOfOperations: React.FC = () =>{

    // 配置Message
    const [messageApi, contextHolder] = message.useMessage();

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
            method:params['method'] ?? '',
            brand:params['brand'] ?? '',
            operate_date: params['created_at'] ?? [],
            operator:params['username'] ?? '',
            start_at: params['created_at'] ? params['created_at'][0] : '',
            end_at: params['created_at'] ? params['created_at'][1] : ''
        };

        
        try{
            const response = await record(customParams);

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
            <ItemList
                 onListData={handleFetchListData}
            />
        </PageContainer>
    )
}

export default RecordsOfOperations