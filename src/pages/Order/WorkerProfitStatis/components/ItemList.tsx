import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable, ActionType} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Button} from "antd";
// 品牌接口
import {getBrandList} from "@/services/ant-design-pro/report";
import {useLocation} from "@@/exports";
import {getStateMap, setStateMap} from "@/utils/utils";


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
}

const ItemList: React.FC<ItemListProps> = ({
                                             onListData
                                           }) => {
  const intl = useIntl()
  const [brandList, setBrandList]: any = useState([])
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]
  const columns: ProColumns<API.WorkerProfitStatisParams>[] = [
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand_en',
      hideInTable: true, // 在表格中隐藏
      valueType: 'select',
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
      fieldProps: {
        showSearch: true
      },

    },
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.name"
          defaultMessage="工人"
        />
      ),
      dataIndex: 'name',
    },
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.cost"
          defaultMessage="成本"
        />
      ),
      dataIndex: 'cost',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.total"
          defaultMessage="总价"
        />
      ),
      dataIndex: 'total',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.rate"
          defaultMessage="利润率"
        />
      ),
      dataIndex: 'rate',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.month"
          defaultMessage="月份"
        />
      ),
      dataIndex: 'm',
      search: false
    },

    {
      title: (
        <FormattedMessage
          id="workerProfitStatis.field.create_at"
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


  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
  }, [])

  return (
    <ProTable<API.WorkerProfitStatisParams, API.PageParams>

      headerTitle={intl.formatMessage({
        id: 'workerProfitStatis.table.title',
        defaultMessage: 'table list',
      })}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
        >
          <FormattedMessage id="pages.searchTable.export" defaultMessage="Export"/>
        </Button>,
      ]}
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


  )
}


export default ItemList



