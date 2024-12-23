import { message } from "antd";
import React, { useRef, useCallback} from "react";
import { ActionType } from "@ant-design/pro-components";
import { PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { getWorkerContract } from "@/services/ant-design-pro/system";

const WorkersContracts: React.FC = () =>{


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
            username:params['username'] ?? '',
            city_cn:params['city_cn'] ?? '',
        };

        
        try{
            const response = await getWorkerContract(customParams);

            const data = response.data;
            data.list.map((item, index) => {
                item.key = Number(index) + 1
                return item
            })

            retData.success = true;
            retData.total = data.total;
            retData.data = data.list ?? []; 

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
                success={success}
                error={error}
            />
        </PageContainer>
    )
}
export default WorkersContracts