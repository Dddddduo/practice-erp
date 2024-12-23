import React, { useEffect, useState } from "react"
import { ParamsType, ProColumns, ProTable, ActionType } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { getBrandList } from "@/services/ant-design-pro/report";
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
  showBrand: boolean
}


const ItemList: React.FC<ItemListProps> = ({
  onListData,
  showBrand
}) => {
  const intl = useIntl()
  const [brandList, setBrandList]: any = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const columns: ProColumns<API.LeadingProfitStatisParams>[]= [
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.username"
          defaultMessage="负责人"
        />
      ),
      dataIndex: 'username',

    },
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'cost',
      search:false
    },
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.total"
          defaultMessage="总价"
        />
      ),
      dataIndex: 'total',
      search:false
    },
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.rate"
          defaultMessage="利润率"
        />
      ),
      dataIndex: 'rate',
      search:false
    },
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.month"
          defaultMessage="月份"
        />
      ),
      dataIndex: 'm',
      search:false
    },
    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      hideInTable: !showBrand, // 在表格中隐藏
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = { text: item.brand_en };
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },
    },

    {
      title: (
        <FormattedMessage
          id="leadingProfitStatis.field.create_at"
          defaultMessage="创建时间"
        />
      ),
      dataIndex: 'create_at',
      valueType: 'dateRange',
      hideInTable: true,
      render: (dom, entity) => {
        return (
          <div>{entity.create_at}</div>
        )
      }
    },

  ]
  useEffect(()=>{
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
  }, [showBrand])
  return (
    <>
      <ProTable<API.LeadingProfitStatisParams, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'leadingProfitStatis.table.title',
          defaultMessage: 'table list',
        })}
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 'max-content' }}
        columns={columns}
        request={onListData}
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
