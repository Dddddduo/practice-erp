import React from "react"
import ItemList from "./components/ItemList"
import { PageContainer, ActionType } from "@ant-design/pro-components"
import { message } from "antd"
import { useRef } from "react"
import { useCallback } from "react"
import { getCityList } from "@/services/ant-design-pro/system"
const CityManagement: React.FC = () =>{

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
            status:params['status'] ?? '',
            other_vendor_name:params['other_vendor_name'] ?? '',
            username:params['username'] ?? '',
        };


        try {
            const response = await getCityList(customParams);

            const data = response.data;

            console.log( retData.data);

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
        return retData;
    }, [])


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
export default CityManagement