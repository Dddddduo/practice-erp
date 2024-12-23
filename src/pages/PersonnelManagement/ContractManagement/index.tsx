import React, { useRef, useCallback } from "react"
import { PageContainer, ActionType } from "@ant-design/pro-components";
import ItemList from "./components/ItemList";
import { message } from "antd";
import { contractManagementList } from "@/services/ant-design-pro/system";
import dayjs from "dayjs";

const contractManagement = () => {
	const date = new Date()
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
			number: params['number'] ?? '',
			name: params['name'] ?? '',
			company_a: params['company_a'] ?? '',
			company_b: params['company_b'] ?? '',
			company_c: params['company_c'] ?? '',
			company_d: params['company_d'] ?? '',
			start_date: params['start_date'] ?? '',
			end_date: params['end_date'] ?? '',
			signing_date: params['signing_date'] ?? '',
			department_head_id: params['department_head_name'] ?? '',
			department_id: params['department_name'] ?? '',
		};

		try {
			const response = await contractManagementList(customParams);
			// console.log(response);

			const data = response.data;

			data.data ? data.data.map((item) => {
				if (Date.now() > Date.parse(item.end_date)) {
					item.color = 'gray'
				} else if ((Date.parse(item.end_date) - Date.now()) / (1000 * 3600 * 24) <= 30) {
					item.color = 'yellow'
				} else {
					item.color = ''
				}
				item.key = item.id
				return item
			}) : ''

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
export default contractManagement