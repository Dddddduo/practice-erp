import React, { useRef } from "react"
import { PageContainer } from "@ant-design/pro-components"
import ItemList from "./components/ItemList"
import { useCallback } from "react";
import { message } from "antd";
import { ActionType } from "@ant-design/pro-components";


const WorkPlan = () => {

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



    return (
        <PageContainer>
            <ItemList
                actionRef={actionRef}
                success={success}
                error={error}
            />
        </PageContainer>
    )
}
export default WorkPlan