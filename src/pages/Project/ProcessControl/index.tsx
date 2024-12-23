import React, {useCallback, useRef} from "react";
import { PageContainer } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-components";
import { getProjectProcessListPage } from "@/services/ant-design-pro/project";



const ProcessControl: React.FC = () =>{



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
            project_no:params['project_no'] ?? '',
            project_type:params['project_type'] ?? '',
            brand_id: params['brand'] ?? '',
            // brand_id: params['brand_list_str_en'] ?? '',
            project_type_id:params['type'] ?? '',
        };

        
        try{
            const response = await getProjectProcessListPage(customParams);

            const data = response.data;
            if (!data.list) {
                return
            }
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
                actionRef={actionRef}
                success={success}
                error={error}
            />
            
        </PageContainer>
    )
}

export default ProcessControl