import React, {useEffect, useState} from "react"
import {ParamsType, ProColumns, ProTable} from "@ant-design/pro-components";
import {FormattedMessage, useIntl} from '@umijs/max';
import {getBrandList} from "@/services/ant-design-pro/report";
import {getInitData} from "@/services/ant-design-pro/system";
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
  const [columnsStateMap, setColumnsStateMap] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const pathname = currentPath.split('/')[currentPath.split('/').length - 1]

  const type = [
    {
      value: 0,
      label: '入库'
    },
    {
      value: 1,
      label: '出库'
    },
  ]

  // 品牌下拉框
  const [brandList, setBrandList]: any = useState([])
  const [itData, setItData]: any = useState([])

  const columns: ProColumns<API.RecordsOfOperations>[] = [

    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.id"
          defaultMessage="序号"
        />
      ),
      dataIndex: 'id',
      search: false
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.no"
          defaultMessage="产品编码"
        />
      ),
      dataIndex: 'no',
      render: (dom, entity) => {
        return (<div>{entity.category.no}</div>)
      }
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.productName"
          defaultMessage="产品名称"
        />
      ),
      dataIndex: 'productName',
      render: (dom, entity) => {
        return (
          <div>{entity.category.cn_name} / {entity.category.en_name}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.warehouse"
          defaultMessage="仓库中/英文名称"
        />
      ),
      dataIndex: 'warehouse',
      search: false,
      render: (dom, entity) => {
        // console.log(entity)
        return (
          <div>
            {
              entity.warehouse &&
              <div>{entity.warehouse.cn_name} / {entity.warehouse.en_name}</div>
            }
          </div>
          //
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.person"
          defaultMessage="采购方/供应方"
        />
      ),
      dataIndex: 'person',
      search: false,
      render: (dom, entity) => {
        return (
          <div>{entity.op_name} / {entity.op_mobile}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.num"
          defaultMessage="当前库存数量"
        />
      ),
      dataIndex: 'num',
      search: false,
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.method"
          defaultMessage="操作类型"
        />
      ),
      dataIndex: 'method',
      valueEnum: type?.reduce((acc, item) => {
        acc[`${item.value}`] = {text: item.label};
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.brand"
          defaultMessage="品牌"
        />
      ),
      dataIndex: 'brand',
      render: (dom, entity) => {
        return (<div>{entity.category.brand.brand}</div>)
      },
      valueEnum: brandList?.reduce((acc, item) => {
        acc[`${item.id}`] = {text: item.brand_en};
        return acc;
      }, {}),
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.total_num"
          defaultMessage="操作数量"
        />
      ),
      dataIndex: 'total_num',
      search: false,
      render: (dom, entity) => {
        return (<div>{entity.inventory.total_num}</div>)
      },
    },
    {
      title: <FormattedMessage id="RecordsOfOperations.field.created_at" defaultMessage="操作时间"/>,
      dataIndex: 'created_at',
      valueType: 'dateRange',
      render: (dom, entity) => {
        return (
          <div>{entity.created_at}</div>
        )
      }
    },
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.username"
          defaultMessage="操作人"
        />
      ),
      dataIndex: 'username',
      render: (dom, entity) => {
        return (<div>{entity.user.username}</div>)
      },
      valueEnum: itData?.reduce((acc, item) => {
        acc[`${item.user_id}`] = {text: item.username};
        return acc;
      }, {}),
    },
    // remark
    {
      title: (
        <FormattedMessage
          id="RecordsOfOperations.field.remark"
          defaultMessage="备注"
        />
      ),
      dataIndex: 'remark',
      search: false,
    },
  ]

  useEffect(() => {
    setColumnsStateMap(getStateMap(pathname))
    getBrandList().then(res => {
      setBrandList(Object.keys(res.data).map(key => res.data[key]))
    })
    getInitData().then(res => {
      setItData(res.data.users)
    })
  }, [])


  return (
    <>
      <ProTable<API.RecordsOfOperations, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'RecordsOfOperations.table.title',
          defaultMessage: 'table list',
        })}

        scroll={{x: 'max-content'}}

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
