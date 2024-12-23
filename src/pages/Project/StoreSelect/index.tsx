import { PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import React, { useEffect } from 'react';
import { history } from 'umi';

import { getShopList } from '@/services/ant-design-pro/project';
import { useStoreSelect } from '@/viewModel/Project/useStoreSelect';
import {Button} from "antd";

const StoreSelect: React.FC = () => {
  const { dataSource, handleFetchListData ,handleOnValueChange} = useStoreSelect();
  const columns: ProColumns<API.EventSendingParams>[] = [
    {
      title: '城市',
      dataIndex: 'city',
      align: 'center',
      valueType: 'select',
      valueEnum:dataSource.cityOptions.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      },{}),
      fieldProps: {
        onChange:async (value) => {
        await  handleOnValueChange('city',value)
        }
      },
    },
    {
      title: '品牌',
      dataIndex: 'brand_en',
      align: 'center',
      valueType: 'select',
      valueEnum:dataSource.brandOptions.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      },{}),
      fieldProps: {
        onChange: async (value) => {
          await handleOnValueChange('brand_en', value)
        }
      }
    },
    {
      title: '商场',
      dataIndex: 'market',
      align: 'center',
      valueType: 'select',
      valueEnum:dataSource.marketOptions.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      },{}),
      fieldProps: {
        onChange:async (value) => {
          await handleOnValueChange('market',value)
        }
      }
    },
    {
      title: '店铺',
      dataIndex: 'name',
      align: 'center',
      valueType: 'select',
      valueEnum:dataSource.shopOptions.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      },{}),
      fieldProps: {
        onChange:async (value) => {
          await handleOnValueChange('name',value)
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
      search: false,
      render: (_, record:any) => {
        return (
          <Button
            type="primary"
            onClick={() => {
              //跳转同时携带shop_id
              history.push({
                pathname: '/project/machineControl',
              },{
                storeId: record.shop_id
              })
            }}
          >
            机电控制
          </Button>
        );
      },
    }
  ];
  useEffect(() => {
    getShopList();
  }, []);
  return (
    <PageContainer>
      <ProTable<API.EventSendingParams, API.PageParams>
        columns={columns}
        request={handleFetchListData}
      />
    </PageContainer>
  );
};
export default StoreSelect;
