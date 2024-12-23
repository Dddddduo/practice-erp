import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from '@umijs/max';
import {Form, Tag} from "antd";
import {isEmpty} from "lodash";
import {SearchType} from "..";
import {getMarketList, getShopList} from '@/services/ant-design-pro/report';
import {getStateMap, setStateMap} from "@/utils/utils";
import {useLocation} from "@@/exports";

type HandleListDataParams = {
  current: number;
  pageSize: number;
  [key: string]: any;
};

type HandleListDataReturnType = {
  success: boolean;
  total: number;
  data: any[]; // 可以根据需要进一步指定数组的类型
};

type HandleListDataFunc = (params: HandleListDataParams, sort: ParamsType) => Promise<HandleListDataReturnType>;

interface ItemListProps {
  onListData: HandleListDataFunc;
  searchData
  onSearchSelectedChild
}


const ItemList: React.FC<ItemListProps> = ({onListData, searchData, onSearchSelectedChild}) => {

  const intl = useIntl()
  const [form] = Form.useForm();
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]


  const handleSearchValuesChange = async (changedValues, allValues) => {
    // 获取店铺参数
    const shopParams: {
      city_id: string | number;
      brand_id: string | number;
      market_id: string | number;
    } = {
      city_id: allValues['city'] ?? '',
      brand_id: allValues['brand_en'] ?? '',
      market_id: allValues['market_cn'] ?? '',
    };

    let shopData: [] = [];
    if (
      '' !== shopParams['city_id'] ||
      '' !== shopParams['market_id']
    ) {
      const shopResponse = await getShopList(shopParams);
      shopData = shopResponse.data;
    }

    if ('city' in changedValues) {
      const marketResponse = await getMarketList({city_id: changedValues.city});
      onSearchSelectedChild(SearchType.LoadData, 'markets', marketResponse.data);
    }

    // 品牌、城市、商场切换
    if ('brand_en' in changedValues || 'city' in changedValues || 'market' in changedValues) {
      onSearchSelectedChild(SearchType.LoadData, 'shops', shopData);
    }
  };

  const columns: ProColumns<API.EventSendingParams>[] = [
    {
      title: (
        <FormattedMessage
          id="eventSending.field.city"
          defaultMessage="城市"
        />
      ),
      dataIndex: 'city',
      valueType: 'select',
      valueEnum: searchData.cities.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.city_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          form.setFieldsValue({market_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'markets', []);
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
      render: (dom, entity) => {
        return (
          <>{entity.shop.city}</>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.market"
          defaultMessage="商场"
        />
      ),
      dataIndex: 'market',
      hideInTable: true,
      valueType: 'select',
      valueEnum: searchData.markets?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.market_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true,
        onChange: (key, option) => {
          form.setFieldsValue({store_cn: undefined});
          if (isEmpty(key) && isEmpty(option)) {
            onSearchSelectedChild(SearchType.DeleteData, 'shops', []);
          }
        },
      },
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.store"
          defaultMessage="店铺"
        />
      ),
      dataIndex: 'store',
      valueType: 'select',
      valueEnum: searchData.shops?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.name_cn};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
      render: (dom, entity) => {
        return (
          <>{entity.shop.name}</>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.obj"
          defaultMessage="操作节点"
        />
      ),
      dataIndex: 'obj',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.val"
          defaultMessage="操作内容"
        />
      ),
      dataIndex: 'val',
      search: false,
    },
    // machine_name
    // created_at

    {
      title: (
        <FormattedMessage
          id="eventSending.field.success"
          defaultMessage="操作结果"
        />
      ),
      dataIndex: 'success',
      search: false,
      render: (dom, entity) => {
        return (
          <>
            {
              dom === '成功' &&
              <Tag color="green">{dom}</Tag>
            }
            {
              dom === '失败' &&
              <Tag color="red">{dom}</Tag>
            }
          </>

        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.en_name"
          defaultMessage="操作人"
        />
      ),
      dataIndex: 'en_name',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="eventSending.field.created_at"
          defaultMessage="操作时间"
        />
      ),
      dataIndex: 'created_at',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.created_at}</div>
        )
      }
    },

    // {
    //     title: <FormattedMessage id="eventSending.field.created_ats" defaultMessage="创建时间" />,
    //     dataIndex: 'created_at',
    //     valueType: 'dateRange',
    //     hideInTable: true, // 在表格中隐藏
    // },

  ]

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
  }, []);

  return (
    <>
      <ProTable<API.EventSendingParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'eventSending.table.title',
          defaultMessage: 'table list',
        })}

        scroll={{x: 'max-content'}}

        columns={columns}
        request={onListData}
        form={{
          form,
          onValuesChange: handleSearchValuesChange,
        }}
        columnsState={{
          value: columnsStateMap,
          onChange: (newState) => {
            setColumnsStateMap(newState)
            setStateMap(pathname, newState)
          }
        }}
      />

    </>
  )

}
export default ItemList
