import React from "react";
import ItemList from "./components/ItemList";
import { PageContainer } from "@ant-design/pro-components";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-components";
import { useRef, useCallback} from "react";
import { projectCategory } from "@/services/ant-design-pro/system";

const TypeManagement: React.FC = () => {

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
            name:params['name'] ?? '',
            no:params['no'] ?? '',
            status:params['status'] ?? '',
            level1:params['oneLevel'] ?? '',
            level2:params['twoLevel'] ?? '',
        };


        try {
            const response = await projectCategory(customParams);

            const data = response.data;

            console.log(retData.data);

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
    return (
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
export default TypeManagement